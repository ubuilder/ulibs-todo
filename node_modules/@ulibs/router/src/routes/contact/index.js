import { tag } from "../../ui/index.js"
export default function(prop){
    return tag('div', {}, [
        tag('div', {}, [

            tag('h3', {}, 'contact body'),
            tag('a', {href: './about'}, 'about'),
            tag('a', {href: './contact'}, 'contact'),
            tag('a', {href: './user'}, 'user'),
            tag('a', {href: './'}, 'home'),
            tag('a', {href: './about/sponser'}, 'sponser'),
        ]),
        tag('div', {}, `contact`)
    ])
}