import {url} from "../common/data/url.js"
import {callApiGet, checkAuth} from '../features/endpoints/endpoints.js'
import {showloader, hideloader} from '../features/loading/loading.js'
import {alerts} from '../features/alerts/alerts.js'
import {allStatistics} from "../features/statistics/statistics.js"

import AbstractView from "./AbstractView.js";



export default class extends AbstractView{
    constructor(){
        super();

        this.loader = showloader();
        this.container = document.querySelector('#cont')
        this.container.innerHTML = ''
        this.setTitle("Statystyki")
        this.api_url = url+'statistics'
    }


    css(){
      document.getElementById('theme').setAttribute('href', "../src/css/statistics.css");
    }
    async getData(){
      

      try {
        let [re, st] = await checkAuth(url+'auth');
          if (st == 202 && re.detail == "authenticated" || st == 200 && re.access_token){
            let [response, status] = await callApiGet(this.api_url);
            if (status == 200){
              // console.log(response)
              hideloader();
              clearTimeout(this.loader);
              this.layout(response);
            }else{
            hideloader();
            clearTimeout(this.loader);
            alerts(status, response, 'alert-orange')
            }
          }
        }
        catch (error){
          hideloader();
          clearTimeout(this.loader);
          alerts('error', error, 'alert-red')
        }
      }

    layout(response) {
      this.css();
      const ChartArea = document.createElement('div');
      ChartArea.classList.add("chart-area")
      const Chart = document.createElement('div')
      Chart.classList.add('chart')
      const canvas = document.createElement('canvas');
      canvas.id = 'charts' ;
      canvas.style = 'null';
      Chart.appendChild(canvas)
      ChartArea.appendChild(Chart);
      this.container.appendChild(ChartArea);
      
      let statistics = new allStatistics(response)
      statistics.charts();
      this.container.appendChild(statistics.users());
      this.container.appendChild(statistics.statistics());
      
    }

}