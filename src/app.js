import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))//app.use is generally used for the middlewaresz

app.use(express.json({ limit: "16kb" }))//limit the json storage
app.use(express.urlencoded({ extended: true, limit: "16kb" }))//for the encoding of the url,and there is no need to specify inside the curly brackets we have done but it will also work without the curly bracket inside content
app.use(express.static("public"))//for public folders like pdf and all,and same message above

app.use(express.cookieParser())

export { app }