import * as Express from 'express'
import * as BodyParser from 'body-parser'
import { TestRoute } from './routes/test_route'
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
        return false
    }

    public routes(){
        let router = Express.Router()

        //Initializing get route for testroutes
        TestRoute.get(router)
        //Initializing payment_create for paypal
        Paypal.payment_create(router)
        //Initializing payment_execute for paypal
        Paypal.payment_execute(router)
        this.app.use(router)
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

