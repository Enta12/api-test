const { readFile } = require('fs')
const {error, sendData} = require('./response')

module.exports = (res) => {
    readFile('views/index.html', 'utf8', (err, data)=>{
        if(err) {
            error(res, 404)
        }
        else {
            sendData(res, data, 'text/html; charset=utf-8')
        }
    })
}