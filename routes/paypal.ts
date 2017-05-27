const PaypalSdk = require('paypal-rest-sdk')
const db = __dirname + "/db.json"
import *  as fs from 'fs'
import { NextFunction, Request, Response, Router } from "express"
require('../paypal-config.js')

export class Paypal {
    
    paymentID:string
    constructor() {}

    public static payment_create(router: Router) {
        var redirectUrl:string
        console.log("Creating Router for [Paypal::payment_create]")
        router.post('/paypal', (req: Request, res: Response) => {
            PaypalSdk.payment.create(req.body.payment, (err:any, payment_response:any) => {
                if (payment_response && payment_response.payer.payment_method === 'paypal') {
                    for (var i = 0; i < payment_response.links.length; i++) {
                        var link = payment_response.links[i]
                        if (link.method === 'REDIRECT') {
                            redirectUrl = link.href
                        }
                    }
                    let data_to_save = {
                        "user_id": "1",
                        "payment_id": payment_response.id
                    }
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
    public static payment_execute(router: Router) {
        console.log("Creating Router for [Paypal::payment_execute]")
        router.get('/paypal/execute', (req: Request, res: Response) => {
            fs.readFile(db, (err, data) => {
                console.log(data)
            })
        })
    }


}