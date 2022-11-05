const mariadb = require('mariadb/callback')

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
  getConnection: async function (callback) {
    pool.getConnection(function (err, con) {
      if (err) {
        return callback(err)
      }
      callback(err, con)
    })
  },

  dbQuery: function (query, param, callback) {
    pool.query(query, param, (err, rows) => {
      if (err) {
        callback(undefined, err)
      } else {
        callback(rows, undefined)
      }
    })
  },

  dbGetSingleRow: function (query, param, callback) {
    this.dbQuery(query, param, (rows, err) => {
      if (err) {
        callback(undefined, err)
      } else {
        callback(rows[0], undefined)
      }
    })
  },

  dbGetSingleValue: function (query, param, defaultValue, callback) {
    this.dbGetSingleRow(query, param, (row, err) => {
      if (err) {
        callback(undefined, err)
      } else {
        let data = row ?? {}
        data = data.val ?? defaultValue
        callback(data, undefined)
      }
    })
  },

  dbInsert: function (query, param, callback) {
    this.dbQuery(query, param, (data, err) => {
      if (err) {
        callback(undefined, err)
      } else {
        callback(data.insertId, undefined)
      }
    })
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
