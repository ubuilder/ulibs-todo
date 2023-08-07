import { tag } from "../../ui/index.js"
export default function(prop){
    console.log('layout: ', prop)
    return tag('div', {}, [
        tag('div', {}, [

            tag('h3', {}, 'contatct layout'),
            tag('a', {href: './about'}, 'about'),
            tag('a', {href: './contact'}, 'contact'),
            tag('a', {href: './user'}, 'user'),
            // tag('hr')
        ]),
        tag('div', {}, prop)

    ])
}