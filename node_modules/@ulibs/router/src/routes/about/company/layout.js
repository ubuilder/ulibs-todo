import { tag } from "../../../ui/index.js"
export default function(content){
    console.log('layout: ', content)
    return tag('div', {}, [
        tag('h3', {}, 'company layout'),
        tag('div', {}, content)
    ])
}