import {url} from "../common/data/url.js"
import {callApiGet, checkAuth} from '../features/endpoints/endpoints.js'
import {navigateTo} from '../js/index.js'
import {err} from '../features/errors/error.js'
import {hideloader} from '../features/loading/loading.js'
import AbstractView from "./AbstractView.js";

export default class extends AbstractView{
    constructor(params){
        super(params);
        this.setTitle("Delete: "+params.id)
        }

    
        async getData(){
            this.api_url = url+"delete/"+this.params.id
            console.log(this.api_url)
            try{
                let [re, st] = await checkAuth(url+'auth');
                if (st == 202 && re.detail == "authenticated"){
                    let [response, status] = await callApiGet(this.api_url);
                    if (status == 200){
                        console.log('usunięto')
                        navigateTo('/');
                        alert(response.message)
                    }else{
                        hideloader();
                        err(status, response)
                    }
                }
            }catch (error){
                hideloader();
                err(error)
            }
        }

}