import {url} from "../common/data/url.js"
import {callApiGet, checkAuth} from '../features/endpoints/endpoints.js'
import {showloader, hideloader} from '../features/loading/loading.js'
import {alerts} from '../features/alerts/alerts.js'
import {capitalized} from "../features/upperCase/upperCase.js"
import {statisticsBox} from "../features/statisticsBox/statisticsBox.js"

import AbstractView from "./AbstractView.js";



export default class extends AbstractView{
    constructor(){
        super();
    }


    css(){
      document.getElementById('theme').setAttribute('href', "../src/css/statistics.css");
    }
    async getData(){
      const loader = setTimeout(() => {
        showloader();
      }, 1000)
      this.container = document.querySelector('#cont')
      this.container.innerHTML = ''
      this.setTitle("Statystyki")
      this.api_url = url+'statistics'

      try {
        let [re, st] = await checkAuth(url+'auth');
          if (st == 202 && re.detail == "authenticated" || st == 200 && re.access_token){
            let [response, status] = await callApiGet(this.api_url);
            if (status == 200){
              hideloader();
              clearTimeout(loader);
              this.layout();
              this.charts(response);
              this.users(response);
              this.statistics(response);
            }else{
            hideloader();
            clearTimeout(loader);
            alerts(status, response, 'alert-orange')
            }
          }
        }
        catch (error){
          hideloader();
          clearTimeout(loader);
          alerts('error', error, 'alert-red')
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

    layout() {
      this.css();
      
      const ChartsArea = document.createElement('div');
      ChartsArea.classList.add("chart")
      ChartsArea.style.width = this.calculateChartSize();
      const canvas = document.createElement('canvas');
      canvas.id = 'charts' ;
      canvas.style = 'null';
      
      ChartsArea.appendChild(canvas);
      this.container.appendChild(ChartsArea);
      
    }

    max(data){
      let max = 0
      for (const value of Object.values(data.statistics)){
        for (let v of Object.values(value.chart)){
          v=parseInt(v, 10)
          if (v > max){
            max = v;
          };
        }
    };

    max += 1;
    return max
    }

    charts(data){
      let max = this.max(data);
      let labels = []
      for (const [key, value] of Object.entries(data.statistics)) {
        for (const [k, v] of Object.entries(value.chart)){
          if (!labels.includes(k)) {
            labels.push(k);
          }
        }
      }

      let ctx = document.getElementById("charts").getContext('2d');
      window.chart = new Chart(ctx, {
          type: 'line',
      data: {
        labels: labels,
        datasets: [
            {
                label: "Stolarnia",
                data: Object.values(data.statistics.stolarnia.chart),
                backgroundColor: "rgba(12, 143, 3, 0.3)",
                borderColor: "rgba(12, 143, 3, 0.3",
                  tension: 0.2,
                  borderWidth: 2,
                  fill: true
            },
            {
                label: "Drukarnia",
                data: Object.values(data.statistics.drukarnia.chart),
                backgroundColor: "rgba(176, 0, 0,0.3)",
                borderColor: "rgba(176, 0, 0,0.3)",
                  tension: 0.2,
                  borderWidth: 2,
                  fill: true,
            },
            {
                label: "Bibeloty",
                data: Object.values(data.statistics.bibeloty.chart),
                borderColor: "rgba(18, 27, 161, 0.3)",
                backgroundColor: "rgba(18, 27, 161, 0.3)",
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
            text: 'Ilość zaraportowanych awarii',
            padding: {
              top: 10,
              bottom: 20
            },
            font: {
              weight: 'bold',
              size: 16,
            }
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
            },
            min: 0,
            max: max,
            ticks: {
              stepSize: 1
            }
          }
        }
        }
      });
    }


    users(data){
      let users = document.createElement('div')
      users.classList.add('users')
      for(const[key, value] of Object.entries(data.user_raport)){
        let user = document.createElement('div')
        user.classList.add('user')
        let userLabelBox = document.createElement('div')
        userLabelBox.classList.add('user-style-label')
        let userLabel = document.createElement('h4')
        userLabel.innerText = capitalized(key)
        let userQuantityBox = document.createElement('div')
        userQuantityBox.classList.add('user-style')
        let userQuantity = document.createElement('p')
        userQuantity.innerText = value +' szt'
        userLabelBox.appendChild(userLabel)
        userQuantityBox.appendChild(userQuantity)
        user.appendChild(userLabelBox)
        user.appendChild(userQuantityBox)
        users.appendChild(user)
      }
      this.container.appendChild(users)
    }

    statistics(data){
      let statistics = document.createElement('div')
      statistics.classList.add('statistics')
      for(const [key, value] of Object.entries(data.statistics)){
        let box = new statisticsBox(key, value).build()
        statistics.appendChild(box)
      }
      this.container.appendChild(statistics)
    }


}