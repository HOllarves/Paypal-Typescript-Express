import * as Express from 'express'
import * as BodyParser from 'body-parser'
import * as paypalRouter from './routes/paypal'
import * as webhookRouter from './routes/webhooks'
import * as path from 'path'

const PayPalStrategy = require('passport-paypal-openidconnect').Strategy

export class Server {

    public app: Express.Application


    public static bootstrap(): Server {
        return new Server()
    }

    constructor() {
        this.app = Express()
        this.app.use(BodyParser.json())
        this.app.use(BodyParser.urlencoded({ extended: true }))
        this.api()
        this.webhooks()
    }

    public api() {
        // Exposing endpoint
        this.app.use('/paypal', paypalRouter.default())
    }

    public webhooks() {
        webhookRouter.default().init()
        // Exposing endpoint
        this.app.use('/webhooks', webhookRouter.default().api)
    }
}

const server = Server.bootstrap().app


server.set("port", process.env.PORT || 4500)
server.listen(server.get("port"), () => {
    console.log("App running on", server.get("port"))
})
