import { Router } from "express";
import UserModel from "../models/user.model.js";

const router = Router();

router.post('/singup', async(res,req) =>{
    const user = req.body
    await UserModel.create(user)

    res.redirect('/login')
})

router.post('/login', async(res,req) =>{
    const {email, password} = req.body
    const user = await UserModel.findOne({email,password})
    if(!user) return res.redirect('/login')
    res.redirect('/profile')

})

export default router;