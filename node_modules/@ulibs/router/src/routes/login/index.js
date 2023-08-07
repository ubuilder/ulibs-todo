import {tag} from '../../ui/index.js'

export const actions = {
    default: (req, res)=>{
        console.log('defalt actions callled')
        req.loggedIn = true
        return true
    },
    register: (req, res)=>{
        console.log('register action callled')
        console.log('form data: ', req.formData)
        res.setStatus(200).json({message: 'ok'})
        return false

    },
    load: async (req, res)=>{
        console.log('load function called in login')
    }

}

export default function(req){
    
    return tag('form', {htmlHead: '<title>login</title>', method: 'post', action: '/login'}, [
        req.loggedIn? tag('div', {}, 'logged in'): '',
        tag('label', { for: 'username' }, 'Username: '),
        tag('input', { type: 'text', id: 'username', name: 'username' }),
      
        tag('br'),
      
        tag('label', { for: 'password' }, 'Password: '),
        tag('input', { type: 'password', id: 'password', name: 'password' }),
      
        tag('br'),
      
        tag('input', { type: 'submit', value: 'Submit' })
      ]);
}