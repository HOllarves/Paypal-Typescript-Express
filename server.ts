import * as Express from 'express'
import TestRoute from './routes/test_route'

export class Server {

    public app: Express.Application

    public static bootstrap(): Server {
        return new Server()
    }

    constructor(){
        this.app = Express()
        this.config()
        this.routes()
        this.api()
    }

    public api(){
        return false
    }

    public routes(){
        let router = Express.Router()
        TestRoute.get(router)
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

