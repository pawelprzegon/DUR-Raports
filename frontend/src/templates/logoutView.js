import {navigateTo} from '../js/index.js'
import {destroyCookieValue} from '../features/cookie/index.js'


import AbstractView from "./AbstractView.js";

export default class extends AbstractView{
    constructor(){
        super();
        }

        async getData(){
            document.querySelector('#app-header').innerHTML = ''
            window.scrollTo(0,0);
            this.setTitle("Logout")
            destroyCookieValue('access_token')
            destroyCookieValue('user')
            destroyCookieValue('refresh_token')
            navigateTo('/login')
        }


    }