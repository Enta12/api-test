const { Pool } = require('pg')


const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'apibemobee',
    password: '123456',
    port: 4321,
})

pool.connect()
.then(()=> console.log("Connected successfully"))
.catch(e => console.log(e))

module.exports = {
    query: (text, params, callback) => {
        return pool.query(text, params, (err, res) => {
          callback(err, res)
        })
      },
}