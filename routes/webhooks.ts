import { Paypal } from './paypal'
import { NextFunction, Request, Response, Router } from "express"
const PaypalSdk = require('paypal-rest-sdk')

export class WebHooks extends Paypal {

    constructor() {
        super()

        let webhooks = {
            url: 'https://paypal-test-integration.herokuapp.com/webhooks/subscription',
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
            }]
        }

        PaypalSdk.notification.webhook.create(webhooks, function (err: any, webhook: any) {
            if (err) {
                console.error(JSON.stringify(err.response));
            } else {
                console.log('Create webhook Response');
                console.log(webhook);
            }
        });
    }

    public billing_plans(router: Router) {
        console.log("Creating Router for [Webook::billing_plan_webhooks]")
        router.post('/subscription', (req: Request, res: Response) => {
            console.log("Webhook event!")
            console.log(req.body.event_type)
            console.log(req.body.summary)
            console.log(req.body.resource.name)
        })
    }
}