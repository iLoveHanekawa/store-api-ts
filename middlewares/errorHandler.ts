import { Request, Response, ErrorRequestHandler, NextFunction  } from "express"

export const errorHandlerMiddleware = async (err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
    console.log(err)
    return res.status(500).json({ msg: 'Something went wrong' })
}