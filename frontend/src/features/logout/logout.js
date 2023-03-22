import {navigateTo} from '../../js/index.js'
import {destroyCookieValue} from '../../features/cookie/index.js'

export function logout(){
    
    document.querySelector('#app-header').innerHTML = ''
    
    window.scrollTo(0,0);
    destroyCookieValue('access_token')
    destroyCookieValue('user')
    destroyCookieValue('refresh_token')
    navigateTo('/login')
}