import { Router } from "express";
import productcontroller from '../controllers/product.js'
const router = Router();

router.get('/getAllProducts',productcontroller.getAllProducts)


export default router