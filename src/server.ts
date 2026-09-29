import http from "http"
import app from "./app.js"
import env from './common/config/dotenv.js'

const server = http.createServer(app)
const port = Number(env.PORT)

server.listen(port, () => {
  console.log("server started")
})