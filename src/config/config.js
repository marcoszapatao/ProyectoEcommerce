import dotenv from 'dotenv';

dotenv.config()

export default {
    PORT: process.env.PORT || 3000,
    MONGO_URL: process.env.MONGO_URL,
    MONGO_DBNAME: process.env.MONGO_DBNAME,
    SESSION_SECRET: process.env.SESSION_SECRET,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    JWT_SECRET: process.env.JWT_SECRET
}
