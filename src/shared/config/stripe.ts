import Stripe from "stripe";
import env from './dotenv.js'

const stripeClient = new Stripe(env.STRIPE_SECRET_KEY)

export default stripeClient