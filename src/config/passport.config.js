import passport from "passport";
import local from 'passport-local'
import GutHubStrategy from "passport-github2";
import UserModel from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";

const LocalStratey = local.Strategy
const initializePassport = () => {

    passport.use('register', new LocalStratey({
        passReqToCallback: true,
        usernameField: 'email'
    }, async(req, username, password, done) => {
        const { first_name, last_name, age, email } = req.body
        try {
            const user = await UserModel.findOne({ email: username })
            if (user) {
                console.log('User already exists')
                return done(null, false)
            }
            const newUser = {
                first_name, last_name, age, email, password: createHash(password)
            }
            const result = await UserModel.create(newUser)
            return done(null, result)
        } catch(err) {}
    }))

    passport.use('login', new LocalStratey({
        usernameField: 'email'
    }, async(username, password, done) => {
        try {
            const user = await UserModel.findOne({ email: username })
            if (!user) {
                console.log('User doesnot exists')
                return done(null, false)
            }

            if(!isValidPassword(user, password)) return done(null, false)

            return done(null, user)
        } catch(err) {}
    }))

    passport.use('github', new GutHubStrategy(
        {
            clientID: 'Iv1.45047513c887f8d7',
            clientSecret: '844db22ecbee7aebed8be25e70d124ea3905c19c',
            callbackURL: 'http://localhost:8080/session/githubcallback'
        },
        async (accessToken, refreshToken, profile, done) => {
            console.log(profile)
            try{
                const user = await UserModel.findOne({email: profile._json.email})
                if(user){
                    console.log('User already exists')
                    return done(null, user)
                }

                const newUser = {
                    first_name: profile._json.name,
                    last_name: '',
                    age: 0,
                    email: profile._json.email,
                    password: ''

                }
                const result = await UserModel.create(newUser)

                return done(null, result)
            }catch (error){
                return done('Error to login with github' + error)
            }
        }
    ))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async(id, done) => {
        const user = await UserModel.findById(id)
        done(null, user)
    })

}

export default initializePassport