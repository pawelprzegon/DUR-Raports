import {url} from "../common/data/url.js"
import {callApiGet} from '../features/endpoints/index.js'
import {navigateTo} from '../js/index.js'
import {err} from './error.js'

import AbstractView from "./AbstractView.js";

export default class extends AbstractView{
    constructor(params){
        super(params);
        
        this.setTitle("Delete: "+params.id)
        this.api_url = url+"delete/"+this.params.id
        }

    
        async getData(){
            try{
                let [response, status] = await callApiGet(this.api_url);
                if (response.detail && response.detail == "Not authenticated"){
                    let refTokenResponse = await tokenRefresh();
                    if (refTokenResponse){
                        let [response, status] = await callApiGet(this.api_url);
                        alert(response.message)
                        console.log('usunięto')
                        navigateTo('/');
                    }else{
                        navigateTo('/login')
                    }
                }else{
                    if (status == 200){
                        
                        console.log('usunięto')
                        navigateTo('/');
                        alert(response.message)
                    }else{
                        err(status, response)
                    }
                }
            }catch (error){
                console.log(error)
                navigateTo('/login')
            }
        }

}