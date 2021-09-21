
//require
const { createServer } = require('http')
const route = require('./routes/index')



//const
const port = 8080


//server
createServer().on('request', (req, res) => {
    route(req, res)
}).listen(port)

console.log("server is listening on port " + port)