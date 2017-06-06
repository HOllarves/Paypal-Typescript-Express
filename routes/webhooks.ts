import { Paypal } from './paypal'
import { Request, Response, Router } from 'express'
const PaypalSdk = require('paypal-rest-sdk')

export class WebHooks extends Paypal {

    constructor() { super() }

    public static webhookInit() {
        console.log("Config webhooks!")
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
        })
    }

    public static list_webhooks(router: Router) {
        console.log('Creating Router for [Webook::list_webhooks]')
        router.get('/', (req: Request, res: Response) => {
            PaypalSdk.notification.webhook.list((err: any, webhooks: any) => {
                if (err) {
                    console.error(JSON.stringify(err.response))
                } else {
                    res.json({
                        status: 200,
                        data: webhooks
                    })
                }
            })
        })
    }

    public static billing_plans(router: Router) {
        console.log('Creating Router for [Webook::billing_plan_webhooks]')
        router.post('/subscription', (req: Request, res: Response) => {
            console.log('Webhook event!')
            switch (req.body.event_type) {
                case 'BILLING.PLAN.CREATED':
                    console.log('Billing plan created!')
                    console.log(req.body.event_type)
                    console.log(req.body.summary)
                    console.log(req.body.resource.name)
                    break
                case 'BILLING.PLAN.UPDATED':
                    console.log('Billing plan updated!')
                    console.log(req.body.event_type)
                    console.log(req.body.summary)
                    console.log(req.body.resource.name)
                    break
                case 'BILLING.SUBSCRIPTION.CANCELLED':
                    console.log('Billing plan cancelled!')
                    console.log(req.body.event_type)
                    console.log(req.body.summary)
                    console.log(req.body.resource.name)
                    break
                case 'BILLING.SUBSCRIPTION.CREATED':
                    console.log('Billing subscription created!')
                    console.log(req.body.event_type)
                    console.log(req.body.summary)
                    console.log(req.body.resource.name)
                    break
                case 'BILLING.SUBSCRIPTION.RE-ACTIVATED':
                    console.log('Billing subscription reactivated')
                    console.log(req.body.event_type)
                    console.log(req.body.summary)
                    console.log(req.body.resource.name)
                    break
                case 'BILLING.SUBSCRIPTION.SUSPENDED':
                    console.log('Billing subscription suspended!')
                    console.log(req.body.event_type)
                    console.log(req.body.summary)
                    console.log(req.body.resource.name)
                    break
                case 'BILLING.SUBSCRIPTION.UPDATED':
                    console.log('Billing subscription updated!')
                    console.log(req.body.event_type)
                    console.log(req.body.summary)
                    console.log(req.body.resource.name)
                    break
                default:
                    console.log('Some unknown webhook')
                    console.log(req.body.event_type)
                    console.log(req.body.summary)
                    console.log(req.body.resource.name)
                    break
            }
        })
    }
}