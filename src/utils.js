import {fileURLToPath} from 'url';
import {dirname} from 'path';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
const __filename = fileURLToPath( import.meta.url);
const __dirname = dirname(__filename);


export default __dirname;

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)

// JWT
export const generateToken = user => {
    return jwt.sign( { user }, 'secretForJWT', {expiresIn: '24h'})
}