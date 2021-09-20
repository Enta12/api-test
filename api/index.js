//require
const http = require('http')
const formidable = require('formidable')
const fs = require('fs')
const fileDb = require('./model/file')


//const
const form = new formidable.IncomingForm()
const port = 8080
const upload_path = 'public/files/'

//send to client
function sendData(res, data, type){
    res.writeHead(200,{
        'Content-type' : type
    })
    res.end(data)
}
function error(res){
    res.end("error 404")
            res.writeHead(404)
            res.end()
}




//server
http.createServer().on('request', (req, res) => {
    //routes
    if(req.url == '/'){
        require('fs').readFile('views/index.html', 'utf8', (err, data)=>{
            if(err) {
                error(res)
            }
            else {
                sendData(res, data, 'text/html; charset=utf-8')
            }
        })
    }

    else if (req.url == '/fileupload'){
        require('fs').readFile('views/index.html', 'utf8', (err, data)=>{
            if(err) {
                error(res, err)
            }
            else {
                
                if (req.url == '/fileupload') {
                    console.log("upload a file")
                    var form = new formidable.IncomingForm()
                    form.parse(req, (err, fields, files) =>{
        
                        const oldpath = files.filetoupload.path;
                        const newpath = upload_path + files.filetoupload.name
        
                        fs.rename(oldpath, newpath, err =>{
                            if (err) throw err
                            res.write('File uploaded')
                            sendData(res, data, 'text/html; charset=utf-8')
                        });
                    })
                }
            }
        })
    }
    else {
        //complex routes detected by regex

        //regex
        //get files
        const fileAcces = RegExp('\/public\/files\/(.+)', 'g')
        const dbAcces = RegExp('\/db\/(.+)', 'g')
        let extrated
        if(((extrated = fileAcces.exec(req.url)) !== null)){
            console.log('public/files/' + extrated[1])
            require('fs').readFile('public/files/' + extrated[1], (err, data)=>{

                if(err) {
                    error(res)
                }
                else {
                    sendData(res, data,  'image/jpeg')
                    fileDb.create(extrated[1], "no description", req.headers.host + req.url + "/" + fileName[1], new Date(), new Date(), (a, e) => {console.log("send")})
                }
            })
        } else if (((extrated = dbAcces.exec(req.url)) !== null)){
            const dbDelete = RegExp('\/delete\/(.+)', 'g')
            const dbUpdate = RegExp('\/update\/(.+)', 'g')
            const dbRead = RegExp('\/(read)', 'g')
            let dbOperationExtrated;
            if(((dbOperationExtrated = dbRead.exec(req.url)) !== null)){
                fileDb.read((err, dbRes) => {
                    sendData(res, JSON.stringify(dbRes.rows), 'application/json')
                })
            }
            else if(((dbOperationExtrated = dbDelete.exec(req.url)) !== null)){
                fileDb.read(1, (err, dbRes) => {})
            }
            else if(false){

            }
            else {
                console.log("ici")
                error(res)
            }
        }
        else{
            error(res)
        }
    }
}).listen(port)

console.log("server is listenning on port " + port)


