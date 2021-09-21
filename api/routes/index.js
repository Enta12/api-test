const { uploadFile, accessToAFile, readAFile, deleteElementDb, updateElementDb } = require ('../controller/api')
const form = require('../controller/form')
const {error} = require('../controller/response')

module.exports = (req, res) => {
    //html page to send picture
    if(req.url == '/'){
        form(res)
    }

    //api routes
    else if (req.url == '/fileupload'){
        uploadFile(req, res)
    }

    //complex routes detected by regex
    else {
        const fileAcces = RegExp('\/public\/files\/(.+)', 'g')
        const dbAcces = RegExp('\/db(.*)', 'g')
        let extrated

        if(((extrated = fileAcces.exec(req.url)) !== null)){
            accessToAFile(res, extrated[1])

        } else if (((extrated = dbAcces.exec(req.url)) !== null)){ //DB operation
            const number = RegExp('\/([1-9]+)', 'g')

            //GET
            if(req.method == 'GET'){
                readAFile(res, number.exec(req.url))
            }
            
            //DELETE
            else if(req.method == 'DELETE'){
                if (((extrated = number.exec(req.url)) !== null) ){
                    deleteElementDb(res, extrated[1])
                }
                else{
                    error(res, 400)
                }
            }

            //PUT
            else if(req.method == 'PUT'){
                updateElementDb(req, res)
            }
            else {
                error(res, 404)
            }
        }
        else{
            error(res, 404)
        }
    }
}