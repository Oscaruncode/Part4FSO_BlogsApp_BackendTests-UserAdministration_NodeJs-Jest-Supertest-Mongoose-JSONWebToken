const logger = require("./utils/loggers")
const config = require("./utils/config")
const cors = require("cors")
const mongoose = require("mongoose")
const express = require("express")
const midlewares = require("./utils/midleware")
const blogRouter = require("./controllers/blogroute")
const userRouter = require("./controllers/userroute")
const loginRouter = require("./controllers/login")


const app = express()

logger.info("Conecting to", config.MONGODB_URI )

mongoose.connect(config.MONGODB_URI).then(() => logger.info("connected to DB"))


app.use(cors())
app.use(express.json())
app.use(midlewares.loggerRequest)
app.use(midlewares.tokenExtractor)

app.use("/api/blogs",blogRouter)

app.use("/api/users",userRouter)

app.use("/api/login",loginRouter)

app.use(midlewares.unknownEndPoint)

app.use(midlewares.handleError)


module.exports = app