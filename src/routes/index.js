import { Router } from "express";
import productRouter from './product.js'
const router = Router();

router.use('/api/v1/products',productRouter)

export default router;