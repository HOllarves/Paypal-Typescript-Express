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
                        console.log(tokeninfo);
                        console.log(userinfo);
                        // Logout url
                        console.log(openIdconnect.logoutUrl({ 'id_token': tokeninfo.id_token }));
                        return res.send({
                            access_token: tokeninfo.access_token,
                            id: userinfo.user_id,
                            logout_url: openIdconnect.logoutUrl({ 'id_token': tokeninfo.id_token })
                        });
                    }
                });
            }
        });

    })

    return api
}