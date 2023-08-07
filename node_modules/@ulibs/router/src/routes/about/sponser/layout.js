import { tag } from "../../../ui/index.js"
export default function(prop){
    console.log('layout: ', prop)
    return tag('div', {}, [
        tag('div', {}, [

            tag('h3', {}, 'sponser layout'),
            tag('a', {href: './'}, 'home'),
            tag('a', {href: './about/mission'}, 'our mission'),
            tag('a', {href: './about/services'}, 'our services'),
            tag('a', {href: './about/sponser'}, 'our sponsers'),
            tag('a', {href: './contact'}, 'contact'),
            // tag('hr', {}, [])
        ]),
        tag('div', {}, prop)

    ])
}