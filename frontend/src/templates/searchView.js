import {url} from "../common/data/url.js"
import {checkAuth, callApiGet} from '../features/endpoints/endpoints.js'
import {alerts} from '../features/alerts/alerts.js'
import {showloader, hideloader} from '../features/loading/loading.js'
import {searchBehav} from '../common/navigation/navigation.js'
import {statisticsBox} from "../features/statisticsBox/statisticsBox.js"
import {capitalized} from '../features/upperCase/upperCase.js'

import AbstractView from "./AbstractView.js";

export default class extends AbstractView{
    constructor(){
        super();
        this.searching = document.getElementById('search').value
        this.setTitle('search: '+ this.searching)
        this.api_url = url + "search/" + this.searching;
        console.log(this.api_url);

    }

    css(){
        document.getElementById('theme').setAttribute('href', "/../src/css/search.css");
    }


    async getData(){
        const loader = showloader();
        
        try {
            let [re, st] = await checkAuth(url + 'auth');
            console.log(re, st)
            if (st == 202 && re.detail == "authenticated" || st == 200 && re.access_token){
                let [response, status] = await callApiGet(this.api_url);
                if (status == 200) {
                    searchBehav();
                    this.show(response)
                } else {
                    hideloader();
                    clearTimeout(loader);
                    alerts(status, response, 'alert-red');
                }
            }
        } catch (error) {
            hideloader();
            clearTimeout(loader);
            alerts('error', error, 'alert-red');
        }

    }
    show(data){
        this.css();
        this.container = document.querySelector('#cont')
        this.container.innerHTML = ''
        console.log(data);

        let search = document.createElement('div')
        search.classList.add('search')
        data.forEach(element => {
            for(const [key,value] of Object.entries(element)){
                value.forEach(element => {
                    console.log(element)
                    if (element.region == capitalized(this.searching)){
                        console.log(element.unit)
                        let box = new statisticsBox(element.region, element.unit).build()
                        search.appendChild(box)
                    }
                    
                });
                
            }
            
            this.container.appendChild(search)  
        });
        
    }
}