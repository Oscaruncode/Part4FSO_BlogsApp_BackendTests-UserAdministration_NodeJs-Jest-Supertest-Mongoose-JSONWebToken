const mongoose = require("mongoose")

const userSchema =  mongoose.Schema({
    username: String,
    name: { type: String },
    passwordHash: { type: String },
    blogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
      }
    ],
})

userSchema.set("JSON", {
transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash}
}
)

module.exports = mongoose.model("User",userSchema)


