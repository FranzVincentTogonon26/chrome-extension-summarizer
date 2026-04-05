import dotenv from 'dotenv'
dotenv.config({ quiet: true})

export const ENV = {
    PORT:process.env.PORT,
    BASE_URL:process.env.OPENROUTER_BASE_URL,
    API_KEY:process.env.OPENROUTER_API_KEY,
}