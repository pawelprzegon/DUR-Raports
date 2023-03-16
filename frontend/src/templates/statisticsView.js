import {url} from "../common/data/url.js"
import {callApiGet} from '../features/endpoints/index.js'
import {showloader, hideloader} from '../features/loading/loading.js'
import {err} from './error.js'

import AbstractView from "./AbstractView.js";



export default class extends AbstractView{
    constructor(){
        super();
    }


    css(){
      document.getElementById('theme').setAttribute('href', "../src/css/statistics.css");
    }
    async getData(){
      showloader();
      this.container = document.querySelector('#cont')
      this.container.innerHTML = ''
      this.setTitle("Statystyki")
      this.api_url = url+'statistics'

      try {
        let [response, status] = await callApiGet(this.api_url);
        if (response.detail && response.detail == "Not authenticated"){
          let refTokenResponse = await tokenRefresh();
          if (refTokenResponse[1] == 200){
              let [response, status] = await callApiGet(this.api_url);
              if (status == 200){
                this.layout();
                this.charts(response);
              }
          }else{
            hideloader();
            navigateTo('/login')
          }
        
          }else{
              hideloader();
              console.log(response)
              this.layout();
              this.charts(response);
          }
      }
      catch (error){
          hideloader();
          err(error)
      }


    }

      calculateChartSize(){
        let chartSize = '350px'
        if ( $(window).width() <= 600) {     
          chartSize = 350
        }
        else if (( $(window).width() > 600) && ( $(window).width() <= 900)){
          chartSize = 600
        }else{
          chartSize = 1000
        }
        return chartSize
      }

      layout() {
        this.css();
        
        const ChartsArea = document.createElement('div');
        ChartsArea.classList.add("chart")
        const canvas = document.createElement('canvas');
        canvas.id = 'charts' ;
        canvas.style = 'null';
        canvas.width = this.calculateChartSize();
            
        ChartsArea.appendChild(canvas);
        this.container.appendChild(ChartsArea);
      }

      charts(data){
          
          let max = 0

          for (const [key, value] of Object.entries(data)){
              for (const [key2, value2] of Object.entries(value)){
                  for (const [key3, value3] of Object.entries(value2)){
                      if (`${key3}` == 'values'){
                          let result = `${value3}`.split(' ');
                          result.forEach(each =>{
                              each=parseInt(each, 10)
                              if (each > max){
                                  max = each;
                              }
                          })
                      } 
                  }
              }
          };


          max += 1;
          
          
          let ctx = document.getElementById("charts").getContext('2d');
          window.chart = new Chart(ctx, {
              type: 'line',
          data: {
          labels: data.chart.bibeloty.chartLabels,
          datasets: [
              {
                  label: "Stolarnia",
                  data: data.chart.stolarnia.chartValues,
                  backgroundColor: "rgba(12, 143, 3, 0.3)",
                  borderColor: "rgba(12, 143, 3, 0.3",
                    tension: 0.2,
                    borderWidth: 2,
                    fill: true
              }
              ,{
              label: "Bibeloty",
              data: data.chart.bibeloty.chartValues,
              borderColor: "rgba(18, 27, 161, 0.3)",
              backgroundColor: "rgba(18, 27, 161, 0.3)",
                tension: 0.2,
                borderWidth: 2,
                fill: true,
          },{
              label: "Drukarnia",
              data: data.chart.drukarnia.chartValues,
              backgroundColor: "rgba(176, 0, 0,0.3)",
              borderColor: "rgba(176, 0, 0,0.3)",
                tension: 0.2,
                borderWidth: 2,
                fill: true,
          }
          ]
          },
          options: {
          maintainAspectRatio: 2,
          responsive: true,
          plugins: {
            title: {
              display: true,
              color: "rgb(255,255,255)",
              text: (ctx) => 'Ilość zaraportowanych awarii'
            },
            tooltip: {
              mode: 'index'
            },
          },
          interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Month'
              }
            },
            y: {
              stacked: false,
              title: {
                display: true,
                text: 'Value'
              }
            }
          }
        }
      });
      }


}