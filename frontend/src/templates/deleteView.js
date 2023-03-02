import {url} from "../common/data/index.js"
import {callApiGet} from '../features/endpoints/index.js'
import {navigateTo} from '../js/index.js'

import AbstractView from "./AbstractView.js";

export default class extends AbstractView{
    constructor(params){
        super(params);
        
        this.setTitle("Delete: "+params.id)
        api_url = url+"delete/"+this.params.id
        }

    
        async getData(){
            try{

                let [response, status] = await callApiGet(api_url);
                console.log(response)
                console.log(status)
                if (response.detail && response.detail == "Not authenticated"){
                    console.log('refreshing token')
                    let refTokenResponse = await tokenRefresh();
                    console.log(refTokenResponse)
                    if (refTokenResponse){
                        let [response, status] = await callApiGet(api_url);
                        console.log(response)
                        console.log('usunięto')
                        navigateTo('/');
                    }else{
                        navigateTo('/login')
                    }
                }else{
                    if (status == 200){
                        console.log('usunięto')
                        navigateTo('/');
                    }else{
                        document.getElementById('err').innerHTML = `
                        <h1>${status}</h1>
                        <p>${response}</p>
                        `
                    }
                }
            }catch (error){
                console.log(error)
                navigateTo('/login')
            }
        }

}