import { tag } from "../ui/index.js";

export default function(prop){
    return tag('div', {htmlHead: '<title>ubuilder cms</title>'}, 'hellow world this is home page')
}

export function error(prop){
    return tag('div', {}, 'error ocured')
}

export let actions = {
    load: async (req)=>{
        console.log('load function called')
    }
}

