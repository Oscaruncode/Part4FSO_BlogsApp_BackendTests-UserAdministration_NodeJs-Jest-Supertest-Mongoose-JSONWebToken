const logger = require("./loggers")
const jwt = require("jsonwebtoken")
const config = require("./config")

const loggerRequest = (req,res,next) => {
  logger.info("Method", req.method)
  logger.info("Path", req.path)
  logger.info("body", req.body)
  logger.info("---")
  next()
}

const handleError = (error ,req ,res , next) => { 

  logger.error(error.message)

  if(error.name === "CastError"){

    return res.status(400).json( { error:"MalfformedId" } )

  }else if(error.name === "ValidationError"){ console.log("errorrrrrrrrrrrrrrrrrrrrrr");return res.status(400).json({ error:error.message })         }
  next()
}

const unknownEndPoint = (req,res) => {logger.error("UnknownEndPoint"); return res.status(404).json({ error:"unknownEndPoint" }) }


const tokenExtractor = async(request,res,next) => {
  const authorization = request.get("authorization")
  if(authorization && authorization.toLowerCase().startsWith("bearer ")){request.token = authorization.substring(7)}
  else {request.token = null}
  try{
  const decodedToken = jwt.verify(request.token,config.SECRET) 
  request.decodedToken = decodedToken
  } catch (error) { 
    request.decodedToken = null
  }
  next()
}




module.exports = { loggerRequest , handleError , unknownEndPoint, tokenExtractor }