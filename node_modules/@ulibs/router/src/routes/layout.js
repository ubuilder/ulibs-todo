import {tag } from "../ui/index.js";

export default function(content){
    return tag('main', {style: 'background-color: rgba(200,200,200, 0.2)'}, 
        [
            tag('header', {class: "header"}, 'hellow: wellcom to ubuildercms'),
            tag('div', {}, [
                tag('a', {href:'./'}, "home"),
                tag('a', {href:'./about/'}, "about"),
                tag('a', {href:'./contact/'}, "contact"),
                tag('a', {href:'./login/'}, "login"),
                tag('a', {href:'./user/'}, "user"),
                tag('a', {href:'./about/company/subcompany'}, "about/company/subcompany"),
                tag('a', {href:'./user/123'}, "user/id"),
            ]),
            tag('div', {}, tag('h1', { style: 'backgroud-color:rgba(100,0,10, 0.5) '}, content)),
            tag('div', {id: 'data-target'}, ),
            
        ]
    )
}