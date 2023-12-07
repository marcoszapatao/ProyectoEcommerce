import mongoose from "mongoose"


const UserModel = mongoose.model('users', new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String},
    email: { type: String, unique: true },
    age: Number,
    password: { type: String},
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
    role: { type: String, default: 'user' }
}))

mongoose.set("strictQuery", false)

export default UserModel