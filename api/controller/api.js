const fileDb = require('../model/file')
const {error, sendData} = require('./response')
const { IncomingForm } = require('formidable')
const { rename, readFile, unlinkSync } = require('fs')


//const
const upload_path = 'public/files/'

function update(res, column, id, oldTitle, title){
    if(column[0].length>0){
        fileDb.modify(() => {
            if(oldTitle){ //change file name
                rename("public/files/"+ oldTitle,"public/files/"+ title, err =>{
                    if (err) {
                        console.log(err)
                        error(res, 404)
                    }
                    else {
                        sendData(res, "update success", 'text/html; charset=utf-8')
                    }
                });
            }
            else {
                sendData(res, "update success", 'text/html; charset=utf-8')
            }
        }, id, column)
    }
    else{
        error(res, 400)
    }
}

uploadFile = (req, res) => {
    console.log("upload a file")
    var form = new IncomingForm()
    form.parse(req, (err, fields, files) =>{

        const oldpath = files.filetoupload.path;
        const newpath = upload_path + files.filetoupload.name

        rename(oldpath, newpath, err =>{
            if (err) throw err
            fileDb.create(files.filetoupload.name, "no description", req.headers.host + req.url + "/" + files.filetoupload.name, new Date(), new Date(), () => {
                sendData(res, 'File uploaded', 'text/html; charset=utf-8')
            });
        })
    })
}

accessToAFile = (res, title) => {
    readFile('public/files/' + title, (err, data)=>{
        if(err) {
            error(res, 404)
        }
        else {
            sendData(res, data, 'image/jpeg')
        }
    })
}

readAFile = (res, extrated) => {
    if(extrated !== null){
        fileDb.read((dbRes) => {
            sendData(res, JSON.stringify(dbRes.rows), 'application/json')
        }, extrated[1])
    }
    else {
        fileDb.read((dbRes) => {
            sendData(res, JSON.stringify(dbRes.rows), 'application/json')
        })
    }
}

deleteElementDb = (res, id) => {
    fileDb.getTitle(id, (dbRes) => {
        if(dbRes.rows[0]){
            try {
                unlinkSync('public/files/' + dbRes.rows[0].title)
            } catch(err) {
                console.log(err)
            }
            finally{
                fileDb.delete(id, () => {})
                sendData(res, "success", 'text/html; charset=utf-8')
            }
        }
        else{
            error(res, 404)
        }
    })
}
    
updateElementDb = (req, res) => {
    //get body
    let body = '';
    req.on('data', chunk => {
        body = chunk;
    })

    req.on('end', () => {
        body = JSON.parse(body)
        //get element wich will be update
        column = [[],[]]
        oldTitle = ""
        if(body.description){
            column[0].push("description")
            column[1].push(body.description)
        }
        
        if(body.title){
            column[0].push("title")
            column[1].push(body.title)
            fileDb.getTitle(body.id, (dbRes) => {
                update(res, column, body.id, dbRes.rows[0].title, body.title)
            })
        }
        else {
            update(res, column, body.id)
        }
    })
}

module.exports = {
    uploadFile, accessToAFile, readAFile, deleteElementDb, updateElementDb

}