import express, { type Request, type Response, type NextFunction } from "express";
import passport from "../../shared/config/passport.js";
import { createToken } from "../../lib/jwt.js";

const router = express.Router()

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

// falier - todo
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/auth/login', session: false}),
  (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = createToken(req.user.id);
    res.json({
      token: token
    })
  })

export default router