import dotenv from 'dotenv';
import { promises as fs } from 'fs';
import path from 'path';
import connectDB from './src/DB/connect.js';
import productModel from './src/models/product.js';

dotenv.config();

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    // Read the JSON file
    const jsonProductsPath = path.resolve('./products.json');
    const jsonProductsData = await fs.readFile(jsonProductsPath, 'utf-8');
    const jsonProducts = JSON.parse(jsonProductsData);

    await productModel.deleteMany();
    await productModel.create(jsonProducts);

    console.log('Data successfully populated!');
    process.exit(0);
  } catch (error) {
    console.error('An error occurred:', error);
    process.exit(1);
  }
};

start();
