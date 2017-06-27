const PaypalSdk = require('paypal-rest-sdk'),
    PaypalStrategy = require('passport-paypal-openidconnect').Strategy

require('../paypal-config.js')(PaypalSdk)
const db = __dirname + '/db.json'
import *  as fs from 'fs'
import * as url from 'url'
import * as path from 'path'
import * as request from 'request'
import * as passport from 'passport'
import { Request, Response, Router } from 'express'

export default function () {


    const api: Router = Router()

    api.get('/login', (req: Request, res: Response) => {
        res.sendFile(__dirname + '/index.html')
    })

    api.get('/callback', (req: Request, res: Response) => {
        const openIdconnect = PaypalSdk.openIdConnect
        openIdconnect.tokeninfo.create(req.query.code, function (error: any, tokeninfo: any) {
            if (error) {
                console.log(error);
            } else {
                console.log(tokeninfo)
                openIdconnect.userinfo.get(tokeninfo.access_token, function (error: any, userinfo: any) {
                    if (error) {
                        res.json({
                            status: 500,
                            message: 'Unable to authenticate user'
                        })
                    } else {
                        //return res.send('<script>window.close()</script>');
                        let userId: any = userinfo.user_id.split("/");
                        let url = 'https://paypal-test-integration.herokuapp.com/webhooks/' + userId[userId.length - 1]
                        let webhooks = {
                            url: url,
                            event_types: [{
                                name: 'BILLING.PLAN.CREATED'
                            }, {
                                name: 'BILLING.PLAN.UPDATED'
                            }, {
                                name: 'BILLING.SUBSCRIPTION.CREATED'
                            }, {
                                name: 'BILLING.SUBSCRIPTION.CANCELLED'
                            }, {
                                name: 'BILLING.SUBSCRIPTION.RE-ACTIVATED'
                            }, {
                                name: 'BILLING.SUBSCRIPTION.SUSPENDED'
                            }, {
                                name: 'BILLING.SUBSCRIPTION.UPDATED'
                            }, {
                                name: 'PAYMENT.AUTHORIZATION.CREATED'
                            }]
                        }
                        PaypalSdk.notification.webhook.create(webhooks, function (err: any, webhook: any) {
                            if (err) {
                                if (err.name == 'WEBHOOK_URL_ALREADY_EXISTS') {
                                    console.log('WebHooks already exist')
                                }
                                console.error(JSON.stringify(err.response));
                            } else {
                                console.log('Create webhook Response');
                                console.log(webhook);
                            }
                        })
                        return res.send({
                            access_token: tokeninfo.access_token,
                            refresh_token: tokeninfo.refresh_token,
                            id: userinfo.user_id,
                            logout_url: openIdconnect.logoutUrl({ 'id_token': tokeninfo.id_token }),
                            user: userinfo
                        });
                    }
                });
            }
        });

    })

    return api
}