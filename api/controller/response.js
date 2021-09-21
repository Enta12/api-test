function sendData(res, data, type){
    res.writeHead(200,{
        'Content-type' : type
    })
    res.end(data)
}
function error(res, err){
    res.end("error "+ err)
            res.writeHead(err)
            res.end()
}

module.exports = {
    sendData, error
}