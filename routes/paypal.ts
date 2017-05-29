const PaypalSdk = require('paypal-rest-sdk')
const db = __dirname + "/db.json"
import *  as fs from 'fs'
import * as url from 'url'
import { NextFunction, Request, Response, Router } from "express"
require('../paypal-config.js')

export class Paypal {

    constructor() {}

    public static billing_agreement(router: Router) {

        var redirectUrl: string
        router.post('/billing-agreement', (req: Request, res: Response) => {
            // Fetching billing agreement. This should come in the post object
            let billing_agreement_obj = JSON.parse(fs.readFileSync(__dirname + '/samples/sample-billing-agreement.json', 'utf-8'))
            if (billing_agreement_obj) {
                // Fetching billing agreement attributes. This should be fetched from a database
                let billing_agreement_attributes = JSON.parse(fs.readFileSync(__dirname + '/samples/sample-billing-agreement-attr.json', 'utf-8')) 
                // Fetching attribute object that sets the plan to ACTIVE
                let billing_plan_update_attributes = [{
                    "op": "replace",
                    "path": "/",
                    "value": {
                        "state": "ACTIVE"
                    }
                }]
                //Creating billing plan
                PaypalSdk.billingPlan.create(billing_agreement_obj, (err: any, billingPlan: any) => {
                    if (err) {
                        console.log(err)
                        res.send(err)
                    } else {
                        console.log("Creating billing plan")
                        //If valid billing plan, updating it's state to ACTIVE
                        PaypalSdk.billingPlan.update(billingPlan.id, billing_plan_update_attributes, (err: any, response: any) => {
                            if (err) {
                                console.log(err)
                                res.send(err)
                            } else {
                                billing_agreement_attributes.plan.id = billingPlan.id
                                // Use activated billing plan to create agreement
                                PaypalSdk.billingAgreement.create(billing_agreement_attributes, (err: any, billingAgreement: any) => {
                                    if (err) {
                                        console.log(err)
                                        res.send(err)
                                    } else {
                                        for (let i = 0; i < billingAgreement.links.length; i++) {
                                            if (billingAgreement.links[i].rel == 'approval_url') {
                                                let approval_url = billingAgreement.links[i].href
                                                res.json({
                                                    status: 200,
                                                    approval_url: approval_url,
                                                    token: url.parse(approval_url, true).query.token
                                                })
                                            }
                                        }
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    }

    /**
     * Executes billing agreement with token
     * @param router - Express router
     */

    public static billing_agreement_execute(router: Router) {
        router.get('/billing-agreement/execute', (req: Request, res: Response) => {
            // Fething token from query strings
            let token = req.query.token
            if (token) {
                PaypalSdk.billingAgreement.execute(token, {}, (err: any, response: any) => {
                    if (err) {
                        console.log(err)
                        res.send(err)
                    } else {
                        res.send("Billing agrement executed!" + JSON.stringify(response))
                    }
                })
            }
        })
    }

    public static billing_agreement_cancel(router: Router) {
        router.get('/billing-agreement/cancel', (req: Request, res: Response) => {
            res.send("Billing agreement canceled!")
        })
    }

    /**
     * Creates Paypal payment
     * @param router - Express Router
     */

    public static payment_create(router: Router) {
        var redirectUrl: string
        console.log("Creating Router for [Paypal::payment_create]")
        //Posting to web-server paypal route
        router.post('/', (req: Request, res: Response) => {
            //Creating payment with PaypalSDK
            let payment_obj = JSON.parse(fs.readFileSync('../samples/sample-payment.json', 'utf-8'))
            PaypalSdk.payment.create(payment_obj, (err: any, payment_response: any) => {
                if (payment_response && payment_response.payer.payment_method === 'paypal') {
                    //Grabbing redirect url for payment authentication
                    for (var i = 0; i < payment_response.links.length; i++) {
                        let link = payment_response.links[i]
                        if (link.method === 'REDIRECT') {
                            redirectUrl = link.href
                        }
                    }
                    //Saving payment_id
                    let data_to_save = {
                        "user_id": "1",
                        "payment_id": payment_response.id
                    }
                    //Manually saving payment_id to file, this should be either a session, coorkie or a real db
                    fs.writeFile(db, JSON.stringify(data_to_save), (err) => {
                        if (err) {
                            console.log("DB error = ", err)
                            res.json({
                                status: 500,
                                message: "Unable to save to file"
                            })
                        } else {
                            res.redirect(redirectUrl)
                        }
                    })
                } else {
                    res.send("Meh...")
                }
            })
        })
    }

    /**
     * Executes paypal payment
     * @param router - Express Router
     */

    public static payment_execute(router: Router) {
        console.log("Creating Router for [Paypal::payment_execute]")
        //Route that will be called once the payment has been created
        router.get('/execute', (req: Request, res: Response) => {
            //Grabbing payment id from db
            fs.readFile(db, (err, data) => {
                if (data) {
                    let jsonData = JSON.parse(data.toString())
                    let payment_id = jsonData.payment_id
                    let payer_id = req.param('PayerID')
                    PaypalSdk.payment.execute(payment_id, {
                        'payer_id': payer_id
                    }, (err: any, payment: any) => {
                        if (err) {
                            console.log(err)
                        } else {
                            res.send("Payment executed correctly")
                        }
                    })
                }
            })
        })
    }

    /**
     * Executes paypal cancel
     * @param router - Express Router
     */

    public static payment_cancel(router: Router) {
        router.get('/cancel', (req: Request, res: Response) => {
            res.send("Payment canceled!")
        })
    }
}