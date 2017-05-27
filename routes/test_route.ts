import { NextFunction, Request, Response, Router } from "express"

export class TestRoute {

    constructor() {}

    public static get(router: Router) {
        console.log("Creating Router for [TestRoute::get]")
        router.get('/', (req: Request, res: Response) => {
            res.send("Hello world!")
        })
    }
}