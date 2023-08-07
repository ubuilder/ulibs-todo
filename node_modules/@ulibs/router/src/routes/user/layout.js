import { tag } from "../../ui/index.js"
export default function(prop){
    console.log('layout: ', prop)
    return tag('div', {}, [
        tag('div', {}, 'user layout'),
        tag('div', {}, prop)
    ])
}