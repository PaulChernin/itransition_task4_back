import pg from 'pg'

const config = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: { rejectUnauthorized: false }
}
const pool = new pg.Pool(config)

pool.on('error', error => {
    console.log(error)
})

export default pool