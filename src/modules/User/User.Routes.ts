import express, { type Request, type Response } from 'express'
import { validate } from '../../shared/middlewares/validate.js'
import { addressIdSchema, addressBodySchema, updateAddressSchema } from './User.Validation.js'
import {
  getAddresses,
  addAddress,
  deleteAddress,
  updateAddress
} from './User.Controller.js'
import { isAuth } from '../../shared/middlewares/isAuth.js'

const router = express.Router()

router.get('/addresses', isAuth, getAddresses)

router.post('/addresses', isAuth, validate(addressBodySchema), addAddress)

router.put('/addresses/:id', isAuth, validate(updateAddressSchema), updateAddress)

router.delete('/addresses/:id', isAuth, validate(addressIdSchema), deleteAddress)

export default router