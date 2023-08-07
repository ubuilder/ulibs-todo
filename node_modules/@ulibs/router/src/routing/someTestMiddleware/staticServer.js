import path from 'path'
import { pathToFileURL } from 'url'
import { readFile } from 'fs/promises'

export const staticServer =  (staticFolder)=> {
    staticFolder = path.resolve(staticFolder)
    return async (req, res)=>{
    let staticFile = path.resolve(staticFolder+ req.url)
    if(/\.(js|css|jpg|ico|svg|jpeg)$/.test(req.url)){
        try{
            const data  = await serveStatics(staticFile)
            res.setHeader('Content-type', 'text/javascript')
            res.writeHead(200)
            res.end(data)

        }catch(error){
            console.error('error reading static file: ', error)
            res.send('not found', 404)
        }
        return false
    }
    return true
}
}

async function serveStatics(staticFile){
    var data = await readFile(staticFile, 'utf8' , (err, data)=>{})
    return data
}