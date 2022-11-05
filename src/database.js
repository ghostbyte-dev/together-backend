const mariadb = require('mariadb')

const pool = mariadb.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'community',
  connectionLimit: 100,
  charset: 'utf8mb4',
  collation: 'utf8mb4_general_ci',
  supportBigNumbers: true
})

module.exports = {
  getConnection: async function () {
    const con = await pool.getConnection()
    return con
  },

  dbQuery: async function (query, param) {
    pool.on('error', function (err) {
      console.log('Oh shit.')
      throw err
    })
    const data = await pool.query(query, param).catch((err) => {
      console.log(err)
    })
    return data
  },

  dbGetSingleRow: async function (query, param) {
    const data = await this.dbQuery(query, param)
    if (!data) return {}
    return data[0]
  },

  dbGetSingleValue: async function (query, param, defaultValue) {
    let data = await this.dbGetSingleRow(query, param)
    data = data ?? {}
    data = data.val ?? defaultValue
    return data
  },

  dbInsert: async function (query, param) {
    const data = await this.dbQuery(query, param)
    return data.insertId
  },

  resSend (res, data, status, errors) {
    data = data ?? {}
    status = status?.toString() ?? this.resStatuses.ok
    errors = errors ?? []
    if (!Array.isArray(errors)) errors = [errors]

    const rspJson = {}
    rspJson.status = status
    rspJson.errors = errors
    rspJson.data = data

    res.send(JSON.stringify(rspJson))
  },

  resStatuses: Object.freeze({ ok: 'OK', error: 'Error' })
}
