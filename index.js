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
require("dotenv/config");
require("express-async-errors");
const express_1 = __importDefault(require("express"));
const connect_1 = require("./db/connect");
const notFound_1 = require("./middlewares/notFound");
const productsRouter_1 = require("./routers/productsRouter");
const app = (0, express_1.default)();
const getPort = () => {
    if (process.env.PORT) {
        return parseInt(process.env.PORT);
    }
    else {
        return 5000;
    }
};
const port = getPort();
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send("<h1>Store API</h1><a href = '/api/v1/products'>Products Route</a>");
});
app.use('/api/v1/products', productsRouter_1.productsRouter);
app.use(notFound_1.notFound);
const start = (uri, port) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, connect_1.connectDb)(uri);
        console.log('connected to db');
        app.listen(port, () => {
            console.log(`server listening at port ${port}`);
        });
    }
    catch (error) {
        console.log(error);
    }
});
start(process.env.MONGO_URI, port);
