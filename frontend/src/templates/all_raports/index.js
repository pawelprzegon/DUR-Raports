import {url} from "../../common/data/index.js"
import {addPaginate} from '../../common/paginate/index.js'
import {Brick} from '../../features/brick/index.js'
import {callApi, tokenRefresh} from '../../features/endpoints/index.js'
import {hideloader} from '../../features/loading/loading.js'

import AbstractView from "../AbstractView.js";

export default class extends AbstractView{
    constructor(params){
        super(params);
        this.setTitle("Raporty")
    }

    async getData(){
        console.log(this.params)
        document.getElementById('loading').style.visibility = 'visible';

        let api_url = url+"raports/"
        if (this.params.username){
            api_url = url+"raports/"+this.params.username
        }

        let theme = document.getElementById('theme')
        theme.setAttribute('href', "./src/templates/all_raports/style.css");
        let paginateTheme = document.getElementById('paginate-theme')
        paginateTheme.setAttribute('href', "./src/common/paginate/paginate.css");

        

        // $("body").css("overflow", "hidden");
        const raportList = document.querySelector('#raport');
        raportList.innerHTML = '';
            
        const CheckList = document.querySelector('#form-data');
        CheckList.innerHTML='';


        let [response, status] = await callApi(api_url);
        console.log(response)
        console.log(status)

        if (response.detail && response.detail == "Not authenticated"){
            console.log('refreshing token')
            let refTokenResponse = tokenRefresh();
            console.log(refTokenResponse)
            console.log(this.params.username)
            if (this.params.username){
                raports(this.params.username);
            }else{
                raports();
            }
            
        }else{
            hideloader();
            console.log('data: '+response);
            this.show(response);
            addPaginate();
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


