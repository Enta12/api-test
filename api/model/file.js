let db = require('../index')



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
            callback()
        })
    },
    modify : (callback, id, column) =>{
        let str = ""
        for(let i = 0; i< column[0].length; i++){
            str += column[0][i] + " = " + "$" + (i+1)
            str += ", "
            
        }
        db.query('UPDATE file SET '+ str + ' last_change = $' + (column[0].length +1) + ' WHERE id=$' + (column[0].length +2), [...column[1], new Date(), id], (err, res) =>{

            if (err) throw err
            callback(res)
        })
    },

    delete : (id, callback) =>{
        db.query('DELETE FROM file WHERE id=$1', [id], (err, res) =>{
            if (err) throw err
            callback()
        })
    },

    read : (callback, id) =>{
        if(id){
            db.query('SELECT * FROM file WHERE id=$1', [id], (err, res) =>{
                if (err) throw err
                callback(res)
            },id)
        }
        else {
            db.query('SELECT * FROM file', [], (err, res) =>{
                if (err) throw err
                callback(res)
            })
        }
    },
    getTitle : (id, callback) =>{
        db.query('SELECT title FROM file WHERE id=$1', [id], (err, res) =>{
            if (err) throw err
            callback(res)
        })
    }

}
