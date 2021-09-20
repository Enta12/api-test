let db = require('../../db/index')
module.exports = {
    create : (title, description, url, created_at, last_change, callback) => {
        db.query('INSERT INTO file (title, description, url, created_at, last_change) VALUES ($1, $2, $3, $4, $5)', [
            title,
            description, 
            url, 
            created_at, 
            last_change
        ], (err, res) => {
            if (err) throw err
            callback(err, res)
        })
    },
    modify : () =>{

    },

    delete : (id, callback) =>{
        db.query('DELETE FROM file WHERE id=$1', [id], (err, res) =>{
            if (err) throw err
            callback(err, res)
        })
    },

    read : (callback) =>{
        db.query('SELECT * FROM file', [], (err, res) =>{
            if (err) throw err
            callback(err, res)
        })
    }

}
