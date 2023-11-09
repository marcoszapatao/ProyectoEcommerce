import mongoose from "mongoose"


const UserModel = mongoose.model('users', new mongoose.Schema({
    first_name: String,
    last_name: String,
    age: Number,
    email: String,
    password: String
}))
mongoose.set("strictQuery", false)

export default UserModel