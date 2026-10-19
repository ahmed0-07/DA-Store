import express from "express"
import { checkOut, handleStripeWebhook } from "./Payment.Controller.js"
import { isAuthenticated } from "../../shared/middlewares/isAuthenticated.js"
import { validate } from "../../shared/middlewares/validate.js"
import { paymentSchema } from "./Payment.validation.js"

const router = express.Router()

router.post('/intent', isAuthenticated(), validate(paymentSchema), checkOut)

router.post('/webhooks/stripe', handleStripeWebhook)

// router.get('/checkout/success', isAuthenticated)

export default router