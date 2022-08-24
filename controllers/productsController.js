"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllProducts = exports.getAllProductsStatic = void 0;
const productsModel_1 = __importDefault(require("../models/productsModel"));
const getAllProductsStatic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield productsModel_1.default.find({ price: { $gt: 199 } }).sort('name').select('name price').limit(20).skip(0);
    res.status(200).json({ products, count: products.length });
});
exports.getAllProductsStatic = getAllProductsStatic;
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { featured, company, name, sort, fields, numericFilters } = req.query;
    let queryObj = {};
    if (featured) {
        queryObj.featured = featured === 'true' ? true : false;
    }
    if (company) {
        queryObj.company = company;
    }
    if (name) {
        queryObj.name = { $regex: name, $options: 'i' };
    }
    if (numericFilters) {
        console.log(numericFilters);
        const operatorMap = {
            '>': '$gt',
            '<': '$lt',
            '>=': '$gte',
            '<=': '$lte',
            '=': '$eq'
        };
        const regEx = /\b(>|<|>=|<=|=)\b/g;
        let filters = numericFilters.replace(regEx, (match) => `-${operatorMap[match]}-`);
        const options = ['price', 'rating'];
        filters.split(',').forEach(i => {
            const [field, operator, value] = i.split('-');
            if (field) {
                queryObj[field] = { [operator]: Number(value) };
            }
        });
    }
    let result = productsModel_1.default.find(queryObj);
    console.log(queryObj);
    if (sort) {
        const sortList = sort.split(',').join(' ');
        result = result.sort(sortList);
    }
    else {
        result = result.sort('createdAt');
    }
    if (fields) {
        const fieldsList = fields.split(',').join(' ');
        result = result.select(fieldsList);
    }
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 30;
    const skip = limit * (page - 1);
    result = result.skip(skip).limit(limit);
    const products = yield result;
    res.status(200).json({ products });
});
exports.getAllProducts = getAllProducts;
