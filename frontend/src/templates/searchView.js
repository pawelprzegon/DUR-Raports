import {url} from "../common/data/url.js"
import {checkAuth, callApiGet} from '../features/endpoints/endpoints.js'
import {alerts} from '../features/alerts/alerts.js'
import {showloader, hideloader} from '../features/loading/loading.js'
import {searchBehav} from '../common/navigation/navigation.js'
import {searchingStatistics} from "../features/statistics/statistics.js"
import {navigateTo} from '../js/index.js'

import AbstractView from "./AbstractView.js";

export default class extends AbstractView{
    constructor(params){
        super(params);
        console.log(params.query)
        this.params = params
        this.setTitle('search: '+ this.params.query)
        this.api_url = url + "search/" + this.params.query;
        console.log(this.api_url);

    }

    css(){
        document.getElementById('theme').setAttribute('href', "/../src/css/search.css");
    }


    async getData(){
        const loader = showloader();
        console.log(this.params)
        try {
            let [re, st] = await checkAuth(url + 'auth');
            console.log(re, st)
            if (st == 202 && re.detail == "authenticated" || st == 200 && re.access_token){
                let [response, status] = await callApiGet(this.api_url);
                if (status == 200) {
                    hideloader();
                    clearTimeout(loader);
                    searchBehav();
                    console.log(response)
                    if (response == null){
                        alerts(status, `Nie znaleziono raportu z dnia: ${this.params.query}`, 'alert-orange');
                    }
                    else if ('id' in response){
                        navigateTo('/raport/'+response.id)
                    }else{
                        this.layout(response)
                    }
                    
                }else if(status == 404){
                    hideloader();
                    clearTimeout(loader);
                    alerts(status, response.detail, 'alert-orange');
                } else{
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

    calculateChartSize(){
        let chartWidth = '500px'
        if ( $(window).width() <= 600) {     
          chartWidth = '450px'
        }
        else if (( $(window).width() > 600) && ( $(window).width() <= 900)){
          chartWidth = '550px'
        }else if (( $(window).width() > 900) && ( $(window).width() <= 1500)){
            chartWidth = '750px'
        }else{
          chartWidth = '900px'
        }
        return chartWidth
      }


    layout(response){
        this.css();
        this.container = document.querySelector('#cont')
        this.container.innerHTML = ''
        console.log(response.query);

        const ChartsArea = document.createElement('div');
        ChartsArea.classList.add("chart")
        ChartsArea.style.width = this.calculateChartSize();
        const canvas = document.createElement('canvas');
        canvas.id = 'charts' ;
        canvas.style = 'null';
        ChartsArea.appendChild(canvas);
        this.container.appendChild(ChartsArea);
        
        let searching = new searchingStatistics(response, this.params.query)
        searching.charts();
        this.container.appendChild(searching.statistics());
        
    }
}