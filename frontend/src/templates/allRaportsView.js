import {url} from "../common/data/index.js"
import {addPaginate} from '../common/paginate/index.js'
import {Brick} from '../features/brick/index.js'
import {callApiGet, tokenRefresh} from '../features/endpoints/index.js'
import {hideloader} from '../features/loading/loading.js'
import { navigateTo } from "../js/index.js"

import AbstractView from "./AbstractView.js";

export default class extends AbstractView{
    constructor(params){
        super(params);
        window.scrollTo(0,0);
        if (this.params.username){
            this.setTitle("Moje raporty")
        }else{
            this.setTitle("Raporty")
        }
    }

    async getData(){
        // console.log(this.params)
        document.getElementById('loading').style.visibility = 'visible';

        let api_url = url+"raports/"
        if (this.params.username){
            api_url = url+"raports/"+this.params.username
        }

        let theme = document.getElementById('theme')
        theme.setAttribute('href', "/../src/css/allRaports.css");

        

        $("body").css("overflow", "hidden");
        const raportList = document.querySelector('#raport');
        raportList.innerHTML = '';
            
        const clearForm = document.querySelector('#form');
        clearForm.innerHTML='';

        try {
            let [response, status] = await callApiGet(api_url);
            if (response.detail && response.detail == "Not authenticated"){
                console.log('refreshing token')
                let refTokenResponse = await tokenRefresh();
                console.log(refTokenResponse)
                if (refTokenResponse[1] == 200){
                    let [response, status] = await callApiGet(api_url);
                    if (status == 200){
                        console.log(response)
                        this.show(response);
                    }else{
                        document.getElementById('err').innerHTML = `
                        <h1>${status}</h1>
                        <p>${response}</p>
                        `
                    }
                    
                }else{
                    navigateTo('/login')
                }
                
            }else{
                hideloader();
                // console.log('data: '+response);
                this.show(response);
                addPaginate();
            }
        }catch (error){
            console.log(error)
            navigateTo('/login')
        }
    }


    show(data) {
        const raportList = document.querySelector('#raport');
        raportList.classList.remove('single')
        raportList.innerHTML = '';

        data.forEach(each => {
            let raportInfoGrid = new Brick(each)
            let brick = raportInfoGrid.getBrick()
            raportList.appendChild(brick);
        });
    }
}


