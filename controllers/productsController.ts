import { Request, Response } from "express"
import productsModel from '../models/productsModel'

export const getAllProductsStatic = async(req: Request, res: Response) => {
    const products = await productsModel.find({ price: { $gt: 199 }}).sort('name').select('name price').limit(20).skip(0)
    res.status(200).json({ products, count: products.length })
}

export const getAllProducts = async(req: Request, res: Response) => {
    type QueryObjType<T extends {}> = T

    const { featured, company, name, sort, fields, numericFilters } = req.query
    let queryObj: QueryObjType<{ 
        featured?: boolean;
        company?: 'ikea' | 'marcos' | 'liddy' | 'caressa';
        name?: { $regex: string, $options: string };
        'price'?: { [operator: string]: number }
        'rating'?: { [operator: string]: number }
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
        const options = ['price', 'rating']
        filters.split(',').forEach(i => {
            const [field, operator, value] = i.split('-')
            if(field) {
                queryObj[field as 'price' | 'rating'] = { [operator]: Number(value) }
            }
        })
    }
    let result = productsModel.find(queryObj)
    console.log(queryObj)
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
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 30
    const skip = limit * (page - 1)
    result = result.skip(skip).limit(limit)
    const products = await result
    res.status(200).json({ products })
}   