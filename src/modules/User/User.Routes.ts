import express, { type Request, type Response } from 'express'
import { validate } from '../../shared/middlewares/validate.js'
import { addressIdSchema, addressBodySchema, updateAddressSchema } from './User.Validation.js'
import {
  getAddresses,
  addAddress,
  deleteAddress,
  updateAddress
} from './User.Controller.js'
import { isAuthenticated } from '../../shared/middlewares/isAuthenticated.js'

const router = express.Router()

router.get('/addresses', isAuthenticated, getAddresses)

router.post('/addresses', isAuthenticated, validate(addressBodySchema), addAddress)

router.put('/addresses/:id', isAuthenticated, validate(updateAddressSchema), updateAddress)

router.delete('/addresses/:id', isAuthenticated, validate(addressIdSchema), deleteAddress)

export default router