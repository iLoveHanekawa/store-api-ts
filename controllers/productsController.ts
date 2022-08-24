import { Request, Response } from "express"
import productsModel from '../models/productsModel'

export const getAllProductsStatic = async(req: Request, res: Response) => {
    const products = await productsModel.find({ price: { $gt: 199 }}).sort('name').select('name price').limit(20).skip(0)
    res.status(200).json({ products, count: products.length })
}

export const getAllProducts = async(req: Request, res: Response) => {
    type QueryObjType<T extends {}> = T

    const { featured, company, name, sort, fields, numericFilters } = req.query
    const queryObj: QueryObjType<{ 
        featured?: boolean,
        company?: 'ikea' | 'marcos' | 'liddy' | 'caressa',
        name?: { $regex: string, $options: string }
    }> = {}

    if(featured) {
        queryObj.featured = featured === 'true'? true: false
    }
    if(company) {
        queryObj.company = company as typeof queryObj.company
    }
    if(name) {
        queryObj.name = { $regex: name as string, $options: 'i' }
    }
    let result = productsModel.find(queryObj)
    if(sort) {
        const sortList = (sort as string).split(',').join(' ')
        result = result.sort(sortList)
    }
    else {
        result = result.sort('createdAt')
    }
    if(fields) {
        const fieldsList = (fields as string).split(',').join(' ')
        result = result.select(fieldsList)
    }
    if(numericFilters) {
        console.log(numericFilters);
        const operatorMap = {
            '>': '$gt',
            '<': '$lt',
            '>=': '$gte',
            '<=': '$lte',
            '=': '$eq'
        }

        type MatchType = keyof typeof operatorMap

        const regEx = /\b(>|<|>=|<=|=)\b/g
        let filters = (numericFilters as string).replace(regEx, (match) => `-${operatorMap[match as MatchType]}-`)
    }
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 1
    const skip = limit * (page - 1)
    result = result.skip(skip).limit(limit)
    const products = await result
    res.status(200).json({ products })
}   