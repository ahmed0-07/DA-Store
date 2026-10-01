import passport from "passport";
import { Strategy as googleStrategy } from "passport-google-oauth20";
import prisma from "../../lib/db.js";
import env from "./dotenv.js"

const google = new googleStrategy({
  clientID: env.GOOGLE_CLIENT_ID,
  clientSecret: env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/api/v1/auth/google/callback",
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await prisma.user.findUnique({
      where: {
        googleId: profile.id
      }
    })
  
    if (!user) {
      user = await prisma.user.create({
        data: {
          googleId: profile.id,
          avatarUrl: profile.photos![0]?.value as string,
          email: profile._json.email as string,
          name: profile._json.name as string,
        }
      })
    }

    done(null, user)
  } catch (err) {
    //global error - todo
    done(err)
  }
})

passport.use(google)

export default passport