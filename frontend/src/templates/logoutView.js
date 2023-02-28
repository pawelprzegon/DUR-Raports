import {navigateTo} from '../js/index.js'
import {destroyCookieValue} from '../features/cookie/index.js'


import AbstractView from "./AbstractView.js";

export default class extends AbstractView{
    constructor(){
        super();
        this.setTitle("Logout")
        this.navbar = document.querySelector('#anim-row')
        }

        async getData(){
            destroyCookieValue('access_token')
            destroyCookieValue('user')
            destroyCookieValue('refresh_token')
            navigateTo('/login')
        }


    }