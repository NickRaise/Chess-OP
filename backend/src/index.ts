import express from "express"
import dotenv from "dotenv"
dotenv.config()
import authRouter from "./routes/auth"

const app = express()
const port = process.env.PORT || 3000

app.use('/auth', authRouter)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})