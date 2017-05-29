import * as Express from 'express'
import * as BodyParser from 'body-parser'
import { Paypal } from './routes/paypal'

export class Server {

    public app: Express.Application


    public static bootstrap(): Server {
        return new Server()
    }

    constructor(){
        this.app = Express()
        this.app.use(BodyParser.json())
        this.config()
        this.routes()
        this.api()
    }

    public api(){
        let router = Express.Router()
        //Initializing billing_agreement for paypal
        Paypal.billing_agreement(router)
        //Intializing billing_agreement_execute for paypal
        Paypal.billing_agreement_execute(router)
        //Initializing payment_create for paypal
        Paypal.payment_create(router)
        //Initializing payment_execute for paypal
        Paypal.payment_execute(router)
        //Initializing payment_cancel for paypal
        Paypal.payment_cancel(router)
        //Using router
        this.app.use('/paypal', router)
    }

    public routes(){
        return false
    }

    public config(){
        return false
    }
}

const server = Server.bootstrap().app
server.set("port", process.env.PORT || 4500)

server.listen(server.get("port"), () => {
    console.log("App running on", server.get("port"))
})

