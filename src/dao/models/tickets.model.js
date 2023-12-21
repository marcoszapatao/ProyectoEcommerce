import mongoose from "mongoose"

const TicketModel = mongoose.model('tickets', new mongoose.Schema({
    code: { type: String, required: true , unique: true},
    purchase_datetime: { type: Date, required: true },
    amount: { type: Number, required: true },
    purchaser: { type: String, required: true}
}))

mongoose.set('strictQuery', false)

export default TicketModel