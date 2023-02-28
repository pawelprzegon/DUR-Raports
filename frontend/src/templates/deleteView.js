import {url} from "../common/data/index.js"
import {callApiGet} from '../features/endpoints/index.js'
import {navigateTo} from '../js/index.js'

import AbstractView from "./AbstractView.js";

export default class extends AbstractView{
    constructor(params){
        super(params);
        
        this.setTitle("Delete: "+params.id)

        }

    
        async getData(){
            let [response, status] = await callApiGet(url+"delete/"+this.params.id);
            console.log(response)
            console.log(status)
            if (status == 200){
                console.log('usunięto')
                navigateTo('/');
            }else{
                console.log('błąd podczas usuwania')
            }
        }
  

}