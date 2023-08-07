import { tag } from "../../../../ui/index.js"
export default function(prop){
    console.log('layout: ', prop)
    return tag('div', {}, [
        tag('div', {}, [

            tag('h3', {}, 'about layout'),
            tag('a', {href: '/'}, 'home')
        ]),
        tag('div', {}, prop)

    ])
}