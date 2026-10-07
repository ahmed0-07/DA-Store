import express from "express"
import { isAuthenticated } from "../../shared/middlewares/isAuthenticated.js"
import { validate } from "../../shared/middlewares/validate.js"
import { itemBodySchema, itemParams, mergeBodySchema, updateQuantityBody } from "./Cart.Validation.js"
import { addItemToCart, getCart, mergeCarts, removeCartItem, updateCartItem } from "./Cart.Controller.js"

const router = express.Router()

router.get("/", isAuthenticated(false), getCart)

router.post("/items", isAuthenticated(false), validate(itemBodySchema), addItemToCart)

router.patch("/items/:id", isAuthenticated(false), validate(itemParams.extend(updateQuantityBody.shape)), updateCartItem)

router.delete("/items/:id", isAuthenticated(false), validate(itemParams), removeCartItem)

router.post("/merge", isAuthenticated(), validate(mergeBodySchema), mergeCarts)

export default router