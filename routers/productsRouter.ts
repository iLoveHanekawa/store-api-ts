import * as express from 'express'
import { getAllProducts, getAllProductsStatic } from '../controllers/productsController'

export const productsRouter = express.Router()

productsRouter.route('/').get(getAllProducts)
productsRouter.route('/static').get(getAllProductsStatic)