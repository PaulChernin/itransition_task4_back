import pool from './dbPool.js'

const dbName = 'public."Users"'

const getUsers = async () => {
    const sql = `SELECT "id", "name", "mail", to_char("signupDate", 'DD.MM.YYYY') as "signupDate", to_char("lastLoginDate", 'DD.MM.YYYY') \
        as "lastLoginDate", "isBlocked" FROM ${dbName} ORDER BY id ASC`
    const results = await pool.query(sql)
    return results.rows
}

const getUserByMail = async (mail) => {
    const sql = `SELECT "passwordHash", "isBlocked" FROM ${dbName} WHERE "mail" = $1`
    const results = await pool.query(sql, [mail])
    return results.rows[0]
}

const createUser = async ({name, mail, passwordHash}) => {
    const sql = `INSERT INTO ${dbName} ("name", "mail", "passwordHash") VALUES ($1, $2, $3);`
    await pool.query(sql, [name, mail, passwordHash])
}

const blockUsers = async (userIds) => {
    const sql = `UPDATE ${dbName} SET "isBlocked" = true WHERE id in (${userIds.join(',')});`
    await pool.query(sql)
}

const unblockUsers = async (userIds) => {
    const sql = `UPDATE ${dbName} SET "isBlocked" = false WHERE id in (${userIds.join(',')});`
    await pool.query(sql)
}

const deleteUsers = async (userIds) => {
    const sql = `DELETE FROM ${dbName} WHERE id in (${userIds.join(',')});`
    await pool.query(sql)
}

export default {
    getUsers,
    getUserByMail,
    createUser,
    blockUsers,
    unblockUsers,
    deleteUsers
}