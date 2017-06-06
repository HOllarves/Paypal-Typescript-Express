import * as Express from 'express'
import * as BodyParser from 'body-parser'
import { Paypal } from './routes/paypal'
import { WebHooks } from './routes/webhooks'

export class Server {

    public app: Express.Application


    public static bootstrap(): Server {
        return new Server()
    }

    constructor() {
        this.app = Express()
        this.app.use(BodyParser.json())
        this.webhooks()
        this.api()
    }

    public api() {
        let router = Express.Router()
        // Initializing billing_agreement for paypal
        Paypal.billing_agreement(router)
        // Initializing billing_agreement_list for paypal
        Paypal.billing_agreement_list(router)
        // Intializing billing_agreement_execute for paypal
        Paypal.billing_agreement_execute(router)
        // Initializing billing_agreement_cancel for paypal
        Paypal.billing_agreement_cancel(router)
        // Initializing billing_agreement_suspend for paypal
        Paypal.billing_agreement_suspend(router)
        // Initializing payment_create for paypal
        Paypal.payment_create(router)
        // Initializing payment_execute for paypal
        Paypal.payment_execute(router)
        // Exposing endpoint
        this.app.use('/paypal', router)
    }

    public webhooks() {
        // Instantiating webhook class
        let webhooks = new WebHooks
        // Creating router for webooks
        let router = Express.Router()
        webhooks.billing_plans(router)
        // Exposing endpoint
        this.app.use('/webhooks', router)

    }
}

const server = Server.bootstrap().app
server.set("port", process.env.PORT || 4500)

server.listen(server.get("port"), () => {
    console.log("App running on", server.get("port"))
})
