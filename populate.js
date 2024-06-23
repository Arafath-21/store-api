import dotenv from 'dotenv'
import connectDB from './src/DB/connect.js'
import productModel from './src/models/product.js'
import jsonProducts from './products.json' assert { type: 'json' };

dotenv.config();

const start =  async ()=>{
    try {
        await connectDB(process.env.MONGO_URI);
        console.log('db connected....');
        await productModel.deleteMany()
        await productModel.create(jsonProducts)
        console.log('db populated....');
        process.exit(0);
    } catch (error) {
        console.log('error is happened');   
        process.exit(1);   
    }
}

start();