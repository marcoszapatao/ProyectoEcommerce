import passport from "passport";
import local from 'passport-local'
import passportJWT from 'passport-jwt'
import GutHubStrategy from "passport-github2";
import UserModel from "../dao/models/user.model.js";
import CartModel from "../dao/models/carts.model.js";
import config from './config.js';
import { createHash, generateToken ,isValidPassword } from "../utils.js";

const LocalStratey = local.Strategy
const JWTStrategy = passportJWT.Strategy
const extractCookie = req => {
    return (req && req.cookies) ? req.cookies['cookieJWT'] : null
}

const initializePassport = () => {

    passport.use('register', new LocalStratey({
        passReqToCallback: true,
        usernameField: 'email',
        session: false 
    }, async(req, username, password, done) => {
        const { first_name, last_name, age, email } = req.body
        try {
            const user = await UserModel.findOne({ email: username })
            if (user) {
                console.log('User already exists')
                return done(null, false)
            }
            const newCart = await CartModel.create({ products: [] });
            const newUser = {
                first_name, last_name, age, email, password: createHash(password), cart: newCart._id, role: 'user'
            }
            const result = await UserModel.create(newUser)
            return done(null, result)
        } catch(err) {
            return done('Error to register'+ err)
        }
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

            const token = generateToken(user)
            user.token = token

            return done(null, user)
        } catch(err) {
            return done('Error to login '+err)
        }
    }))

    passport.use('github', new GutHubStrategy(
        {
            clientID: config.GITHUB_CLIENT_ID,
            clientSecret: config.GITHUB_CLIENT_SECRET,
            callbackURL: 'http://localhost:8080/session/githubcallback'
            

        },
        async (accessToken, refreshToken, profile, done) => {
            console.log(profile)
            try{
                let email = profile._json.email && profile._json.email[0].value;
                 if (!email) {
                    email = `${profile._json.username}@github.com`;
                }
                const user = await UserModel.findOne({email: email})
                if(user){
                    console.log('User already exists')
                    return done(null, user)
                }
                const newCart = await CartModel.create({ products: [] });
                const newUser = {
                    first_name: profile._json.name,
                    last_name: '',
                    age: 0,
                    email: email,
                    password: '',
                    cart: newCart._id,
                    role: 'user'
                }
                const result = await UserModel.create(newUser)

                const token = generateToken(user)
                user.token = token

                return done(null, result)
            }catch (error){
                return done('Error to login with github' + error)
            }
        }
    ))
    
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: passportJWT.ExtractJwt.fromExtractors([extractCookie]),
        secretOrKey: config.JWT_SECRET,
    }, async (jwt_payload, done) => {
        console.log("JWT Payload:", jwt_payload._id);
        try {
            const user = await UserModel.findById(jwt_payload.user._id);
            console.log('user en jwt: '+user)
            if (!user) {
                return done(null, false);
            }
            return done(null, user);
        } catch (error) {
            return done(error, false);
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async(id, done) => {
        const user = await UserModel.findById(id)
        done(null, user)
    })

}

export default initializePassport