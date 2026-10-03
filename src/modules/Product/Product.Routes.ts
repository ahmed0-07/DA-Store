import express from "express";
import { isAuthenticated } from "../../shared/middlewares/isAuthenticated.js";
import { isAuthorized } from "../../shared/middlewares/isAuthorized..js";
import { validate } from "../../shared/middlewares/validate.js";
import { productIdParams, productImageIdParams, productImageSchema, productSchema, productSlugParams, updateProductSchema } from "./Product.Validation.js";
import { addProduct, addProductImage, deleteProduct, deleteProductImage, getProductBySlug, getProducts, updateProduct } from "./Product.Controller.js";

const router = express.Router()

router.get('/', getProducts)

router.get('/:slug', validate(productSlugParams), getProductBySlug)

router.post('/', isAuthenticated, isAuthorized, validate(productSchema), addProduct)

router.put('/:id', isAuthenticated, isAuthorized, validate(productIdParams.extend(updateProductSchema.shape)), updateProduct)

router.delete('/:id', isAuthenticated, isAuthorized, validate(productIdParams), deleteProduct)

router.post('/:id/images', isAuthenticated, isAuthorized, validate(productIdParams.extend(productImageSchema.shape)), addProductImage)

router.delete('/:id/images/:imageId', isAuthenticated, isAuthorized, validate(productImageIdParams), deleteProductImage)

export default router
