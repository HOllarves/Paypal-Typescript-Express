import { Request, Response, Router } from 'express'
const PaypalSdk = require('paypal-rest-sdk')

export default function () {

    const api: Router = Router()

    function webhookInit() {
        console.log('Configurating WebHooks')
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
                if (err.name == 'WEBHOOK_URL_ALREADY_EXISTS') {
                    console.log('WebHooks already exist')
                }
                console.error(JSON.stringify(err.response));
            } else {
                console.log('Create webhook Response');
                console.log(webhook);
            }
        })
    }


    console.log('Creating Router for [Webook::list_webhooks]')
    api.get('/', (req: Request, res: Response) => {
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

    console.log('Creating Router for [Webook::billing_plan_webhooks]')
    api.post('/subscription', (req: Request, res: Response) => {
        console.log('Webhook event!')
        console.log(JSON.stringify(req.body))
        switch (req.body.event_type) {
            case 'BILLING.PLAN.CREATED':
                console.log('Billing plan created!')
                console.log(req.body.event_type)
                console.log(req.body.summary)
                console.log(req.body.resource.name)
                console.log("Request = ", JSON.stringify(req.body));
                break
            case 'BILLING.PLAN.UPDATED':
                console.log('Billing plan updated!')
                console.log(req.body.event_type)
                console.log(req.body.summary)
                console.log(req.body.resource.name)
                console.log("Request = ", JSON.stringify(req.body));
                break
            case 'BILLING.SUBSCRIPTION.CANCELLED':
                console.log('Billing plan cancelled!')
                console.log(req.body.event_type)
                console.log(req.body.summary)
                console.log(req.body.resource.name)
                console.log("Request = ", JSON.stringify(req.body));
                break
            case 'BILLING.SUBSCRIPTION.CREATED':
                console.log('Billing subscription created!')
                req.body.bodyType = "created"
                let subscription = mapDataToSubscription(req.body)
                console.log("Subscription = ", subscription)
                break
            case 'BILLING.SUBSCRIPTION.RE-ACTIVATED':
                console.log('Billing subscription reactivated')
                console.log(req.body.event_type)
                console.log(req.body.summary)
                console.log(req.body.resource.name)
                console.log("Request = ", JSON.stringify(req.body));
                break
            case 'BILLING.SUBSCRIPTION.SUSPENDED':
                console.log('Billing subscription suspended!')
                console.log(req.body.event_type)
                console.log(req.body.summary)
                console.log(req.body.resource.name)
                console.log("Request = ", JSON.stringify(req.body));
                break
            case 'BILLING.SUBSCRIPTION.UPDATED':
                console.log('Billing subscription updated!')
                req.body.bodyType = "updated"
                req.body.previous_attributes = {
                    "id": "WH-19973937YW279670F-02S63370HL636500Y",
                    "event_version": "1.0",
                    "create_time": "2016-04-28T11:29:31Z",
                    "resource_type": "Agreement",
                    "event_type": "BILLING.SUBSCRIPTION.CREATED",
                    "summary": "A billing subscription was created",
                    "resource": {
                        "id": "I-PE7JWXKGVN0R",
                        "shipping_address": {
                            "recipient_name": "Cool Buyer",
                            "line1": "3rd st",
                            "line2": "cool",
                            "city": "San Jose",
                            "state": "CA",
                            "postal_code": "95112",
                            "country_code": "US"
                        },
                        "plan": {
                            "curr_code": "USD",
                            "links": [],
                            "payment_definitions": [
                                {
                                    "type": "TRIAL",
                                    "frequency": "Month",
                                    "frequency_interval": "1",
                                    "amount": {
                                        "value": "5.00"
                                    },
                                    "cycles": "5",
                                    "charge_models": [
                                        {
                                            "type": "TAX",
                                            "amount": {
                                                "value": "1.00"
                                            }
                                        },
                                        {
                                            "type": "SHIPPING",
                                            "amount": {
                                                "value": "1.00"
                                            }
                                        }
                                    ]
                                },
                                {
                                    "type": "REGULAR",
                                    "frequency": "Month",
                                    "frequency_interval": "1",
                                    "amount": {
                                        "value": "10.00"
                                    },
                                    "cycles": "15",
                                    "charge_models": [
                                        {
                                            "type": "TAX",
                                            "amount": {
                                                "value": "2.00"
                                            }
                                        },
                                        {
                                            "type": "SHIPPING",
                                            "amount": {
                                                "value": "1.00"
                                            }
                                        }
                                    ]
                                }
                            ],
                            "merchant_preferences": {
                                "setup_fee": {
                                    "value": "0.00"
                                },
                                "auto_bill_amount": "YES",
                                "max_fail_attempts": "21"
                            }
                        },
                        "payer": {
                            "payment_method": "paypal",
                            "status": "verified",
                            "payer_info": {
                                "email": "coolbuyer@example.com",
                                "first_name": "Cool",
                                "last_name": "Buyer",
                                "payer_id": "XLHKRXRA4H7QY",
                                "shipping_address": {
                                    "recipient_name": "Cool Buyer",
                                    "line1": "3rd st",
                                    "line2": "cool",
                                    "city": "San Jose",
                                    "state": "CA",
                                    "postal_code": "95112",
                                    "country_code": "US"
                                }
                            }
                        },
                        "agreement_details": {
                            "outstanding_balance": {
                                "value": "0.00"
                            },
                            "num_cycles_remaining": "5",
                            "num_cycles_completed": "0",
                            "final_payment_due_date": "2017-11-30T10:00:00Z",
                            "failed_payment_count": "0"
                        },
                        "description": "desc",
                        "state": "Pending",
                        "links": [
                            {
                                "href": "https://api.paypal.com/v1/payments/billing-agreements/I-PE7JWXKGVN0R",
                                "rel": "self",
                                "method": "GET"
                            }
                        ],
                        "start_date": "2016-04-30T07:00:00Z"
                    },
                    "links": [
                        {
                            "href": "https://api.paypal.com/v1/notifications/webhooks-events/WH-19973937YW279670F-02S63370HL636500Y",
                            "rel": "self",
                            "method": "GET"
                        },
                        {
                            "href": "https://api.paypal.com/v1/notifications/webhooks-events/WH-19973937YW279670F-02S63370HL636500Y/resend",
                            "rel": "resend",
                            "method": "POST"
                        }
                    ]
                }
                let subscription_updated = mapDataToSubscription(req.body)
                console.log(subscription_updated)
                break
            default:
                console.log('Some unknown webhook')
                console.log(req.body.event_type)
                console.log(req.body.summary)
                console.log(req.body.resource.name)
                console.log("Request = ", JSON.stringify(req.body));
                break
        }
    })

    function mapDataToSubscription(response: any) {

        let subscription = {
            gatewayOriginalObject: '',
            date: '',
            periodStart: '',
            periodEnd: null,
            planId: '',
            planName: '',
            planAmount: '',
            currency: '',
            previousPlanId: '',
            previousPlanName: '',
            previousPlanAmount: '',
            type: '',
            planInterval: '',
            status: ''

        }
        subscription.gatewayOriginalObject = JSON.stringify(response);
        subscription.date = response.create_time;
        subscription.periodStart = response.resource.start_date;
        subscription.periodEnd = response.resource.agreement_details.final_payment_due_date;
        subscription.planId = response.resource.id;
        subscription.planName = response.resource.description;
        subscription.planAmount = response.resource.plan.payment_definitions[0].amount.value;
        subscription.currency = response.resource.plan.curr_code;
        if (response.bodyType == "updated") {
            subscription.previousPlanId = response.previous_attributes.planId;
            subscription.previousPlanName = response.previous_attributes.planName;
            subscription.previousPlanAmount = response.previous_attributes.planAmount;
            if (subscription.previousPlanAmount < subscription.planAmount) {
                subscription.type = 'Upgrade'
            } else if (subscription.previousPlanAmount > subscription.planAmount) {
                subscription.type = 'Downgrade'
            } else if (subscription.previousPlanAmount > subscription.planAmount) {
                subscription.type = 'Other'
            } else {
                subscription.type = 'Other'
            }
        } else if (response.bodyType == "created") {
            subscription.type = 'Created'
        }
        switch (response.resource.plan.payment_definitions[0].frequency) {
            case "Month":
                subscription.planInterval = 'Monthly'
                break;
            default:
                subscription.planInterval = '';
                break;
        }
        switch (response.resource.state) {
            case "CREATED":
                subscription.status = 'Active'
                break;
            default:
                subscription.status = 'Closed'
                break;
        }
        return subscription;
    }

    return {
        api: api,
        init: webhookInit
    }
}