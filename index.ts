import 'dotenv/config'
import 'express-async-errors'
import express from 'express'
import { Request, Response } from 'express'
import { connectDb } from './db/connect'
import { notFound } from './middlewares/notFound'
import { productsRouter } from './routers/productsRouter'
const app = express()

const getPort = () => {
    if(process.env.PORT) {
        return parseInt(process.env.PORT)
    }
    else {
        return 5000
    }
}

const port = getPort()

app.use(express.json())
app.get('/', (req: Request, res: Response) => {
    res.send("<h1>Store API</h1><a href = '/api/v1/products'>Products Route</a>")
}) 

app.use('/api/v1/products', productsRouter)
app.use(notFound)

const start = async (uri: string, port: number) => {
    try {
        await connectDb(uri)
        console.log('connected to db');
        app.listen(port, () => {
            console.log(`server listening at port ${port}`);
            
        })
    } catch (error) {
        console.log(error)
    }
}

start(process.env.MONGO_URI as string, port)

