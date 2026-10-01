import express, { type Request, type Response, type NextFunction } from "express";
import passport from "../../shared/config/passport.js";
import { googleCallback } from "./Auth.Controller.js";

const router = express.Router()

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

// falier - todo
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/auth/login', session: false}), googleCallback)

export default router