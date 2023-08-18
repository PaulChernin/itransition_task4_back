import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import router from './src/router.js'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import { jwtMiddleware } from './src/jwtMiddleware.js'

const port = process.env.PORT
const app = express()
app.use(cookieParser())
app.use(cors({
    origin: true,
    credentials: true
}))

app.use(
    morgan(
        "[:date[iso]] :remote-addr :method :url",
        {
            immediate: true
        }
    )
)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use('/protected*', jwtMiddleware)
app.use(router)

app.listen(port, () => {
    console.log(`Server is running at port ${port}`)
})