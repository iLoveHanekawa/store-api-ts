import 'dotenv/config'
import { connectDb } from './db/connect'
import ProductsModel from './models/productsModel'
import * as products from './products.json'

const start = async () => {
    try {
        await connectDb(process.env.MONGO_URI as string)
        console.log('success');
        await ProductsModel.deleteMany()
        await ProductsModel.create(products.default)
        process.exit(0)
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}

start()