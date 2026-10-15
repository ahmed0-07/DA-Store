import express from "express"
import { isAuthenticated } from "../../shared/middlewares/isAuthenticated.js"
// import { isAuthorized } from "../../shared/middlewares/isAuthorized..js"
import { addOrder, cancelOrder, getOrderById, getOrders } from "./Order.Controller.js"
import { validate } from "../../shared/middlewares/validate.js"
import { createOrderSchema, orderById } from "./Order.Validation.js"

const router = express.Router()

router.get('/', isAuthenticated(), getOrders)

router.post('/', isAuthenticated(), validate(createOrderSchema), addOrder)

router.get('/:id', isAuthenticated(), validate(orderById), getOrderById)

router.post('/:id/cancel', isAuthenticated(), validate(orderById), cancelOrder)

// router.patch('/admin/:id/status', isAuthenticated(), isAuthorized, updateOrderStatus)

// router.get('/admin/all', isAuthenticated(), isAuthorized, getAllOrders)

export default router