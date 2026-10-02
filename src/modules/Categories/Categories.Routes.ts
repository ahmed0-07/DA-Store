import express from "express";
import { isAuthenticated } from "../../shared/middlewares/isAuthenticated.js";
import { isAuthorized } from "../../shared/middlewares/isAuthorized..js";
import { validate } from "../../shared/middlewares/validate.js";
import { categoryParams, categorySchema, updateCategorySchema } from "./Categories.Validation.js";
import { addCategory, deleteCategory, getCategories, updateCategory } from "./Categories.Controller.js";

const router = express.Router()

router.get('/', getCategories)

router.post('/', isAuthenticated, isAuthorized, validate(categorySchema), addCategory)

router.put('/:id', isAuthenticated, isAuthorized, validate(categoryParams.extend(updateCategorySchema.shape)), updateCategory)

router.delete('/:id', isAuthenticated, isAuthorized, validate(categoryParams), deleteCategory)

export default router