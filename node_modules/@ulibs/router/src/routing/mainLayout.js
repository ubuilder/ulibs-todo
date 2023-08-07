import { html, tag } from "../ui/index.js"
import {readFile} from 'fs/promises'

async function read(url){
    try {
        url = new URL(url, import.meta.url)
        const data = await readFile(url, {encoding:'utf8'})
        return data
    } catch (error) {
        console.log('Error reading router script: ', error)
    }
}
let script = await read('./script.js')

export default function ({head, body}){
    return html(
        {
            head: head,
            body: [body, tag('script', {}, script)]
        }
    )
}