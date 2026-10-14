import express from "express";
import { isAuthenticated } from "../../shared/middlewares/isAuthenticated.js";
import { isAuthorized } from "../../shared/middlewares/isAuthorized..js";
import { validate } from "../../shared/middlewares/validate.js";
import { productIdParams, productImageUrlSchema, productSchema, productSlugParams, updateProductSchema } from "./Product.Validation.js";
import { setProductImage, removeProductImage, deleteProduct, getProductBySlug, getProducts, addProduct, updateProduct } from "./Product.Controller.js";

const router = express.Router()

router.get('/', getProducts)

router.get('/:slug', validate(productSlugParams), getProductBySlug)

router.post('/', isAuthenticated(), isAuthorized, validate(productSchema), addProduct)

router.put('/:id', isAuthenticated(), isAuthorized, validate(productIdParams.extend(updateProductSchema.shape)), updateProduct)

router.delete('/:id', isAuthenticated(), isAuthorized, validate(productIdParams), deleteProduct)

router.put('/:id/image', isAuthenticated(), isAuthorized, validate(productIdParams.extend(productImageUrlSchema.shape)), setProductImage)

router.delete('/:id/image', isAuthenticated(), isAuthorized, validate(productIdParams), removeProductImage)

export default router
