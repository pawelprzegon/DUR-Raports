import {url} from "../common/data/url.js"
import {callApiGet, checkAuth} from '../features/endpoints/endpoints.js'
import {showloader, hideloader} from '../features/loading/loading.js'
import {alerts} from '../features/alerts/alerts.js'
import {createNewChart} from "../features/chart/createChart.js"
import {capitalized} from "../features/upperCase/upperCase.js"
import AbstractView from "./AbstractView.js";
import { navigateTo } from "../js/index.js"



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

      let chart = new createNewChart(response, canvas)
      chart.newChart();

      Chart.appendChild(canvas)
      ChartArea.appendChild(Chart);
      this.container.appendChild(ChartArea);
      
      
      this.container.appendChild(this.users(response));
      this.container.appendChild(this.statistics(response));
      
    }

    users(response){
      console.log('test')
      let users = document.createElement('div')
      users.classList.add('users')
      for(const[key, value] of Object.entries(response.user_raport)){
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
      return users
  }

  statistics(response){
      let statistics = document.createElement('div')
      statistics.classList.add('statistics')
      for(const [key, value] of Object.entries(response.statistics)){
          let box = this.block(key, value)
          statistics.appendChild(box)
      }
      return statistics
  }

  block(key, value){
      let place = document.createElement('div')
      place.id = key
      place.classList.add('place')
      let placeLabelBox = document.createElement('div')
      placeLabelBox.classList.add('labelBox')
      let placeLabel = document.createElement('h2')
      placeLabel.innerText = capitalized(key)

      let placequantity = document.createElement('h3')
      placequantity.innerText = this.placeQuantity(value) +' szt'
      placeLabelBox.appendChild(placeLabel)
      placeLabelBox.appendChild(placequantity)
      place.appendChild(placeLabelBox)
      for(const [k,v] of Object.entries(value.items)){
          let elemBox = document.createElement('div')
          elemBox.classList.add('elemBox')
          let elemLabelBox = document.createElement('div')
          elemLabelBox.classList.add('elem-style')
          let elemLabel = document.createElement('p')
          elemLabel.id = k
          elemLabel.innerText = k;
          elemLabel.addEventListener("click", () => {
              console.log(k)
              navigateTo('/search/'+capitalized(k));
          })
          let elemQuantityBox = document.createElement('div')
          elemQuantityBox.classList.add('elem-style')
          let elemQuantity = document.createElement('p')
          elemQuantity.innerText = v[0]
          let elemProcentageBox = document.createElement('div')
          elemProcentageBox.classList.add('elem-style')
          let elemProcentage = document.createElement('p')
          elemProcentage.innerText = v[1]
          let elemQuantityJedn = document.createElement('small')
          elemQuantityJedn.innerText = 'szt'

          elemQuantity.appendChild(elemQuantityJedn)
          elemLabelBox.appendChild(elemLabel)
          elemQuantityBox.appendChild(elemQuantity)
          elemProcentageBox.appendChild(elemProcentage)
          elemBox.appendChild(elemLabelBox)
          elemBox.appendChild(elemQuantityBox)
          elemBox.appendChild(elemProcentageBox)
          
          place.appendChild(elemBox)
        
      }
      return place
  }

  placeQuantity(value){
      let x = 0
      for (const v of Object.values(value.chart)){
          x+=v
      }
      return x
  }

}