import AbstractView from "../AbstractView.js";
import {hideloader} from '../../features/loading/loading.js'


export default class extends AbstractView{
    constructor(){
        super();
        this.setTitle("Statystyki")
    }

    async getData(){

      document.getElementById('loading').style.visibility = 'visible';


      let theme = document.getElementById('theme')
      theme.setAttribute('href', "/src/templates/statistics/statist.css");


      const raportList = document.querySelector('#raport');
      raportList.innerHTML = '';
      const createClear = document.querySelector('#form-data');
      createClear.innerHTML = '';

      $("body").css("overflow", "hidden");
      // api url
      const api_url = 
            "https://mocki.io/v1/5f15194a-ce6e-4ae3-bfb3-69c0b3328f96";


      // Storing response
      const response = await fetch(api_url);
      
      // Storing data in form of JSON
      var data = await response.json();

      if (response) {
          hideloader();
      }
          this.layout();
          this.charts(data);

        let chartSize = '350px'
        if ( $(window).width() <= 600) {     
          chartSize = 350
        }
        else if (( $(window).width() > 600) && ( $(window).width() <= 900)){
          chartSize = 600
        }else{
          chartSize = 1000
        }

          let canvas = document.getElementById('charts');
          canvas.style = 'null';
          canvas.width = chartSize /*TUTAJ ZNIANA WIELKOSCI WYKRESU*/

      }

      layout() {
          const statisticsList = document.querySelector('#raport');
          statisticsList.innerHTML = '';
              const ChartsArea = document.createElement('div');
                  ChartsArea.classList.add("chart")
                  const canvas = document.createElement('canvas');
                  canvas.id = 'charts' ;
              
              ChartsArea.appendChild(canvas);
              statisticsList.appendChild(ChartsArea);
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
          labels: data.chart.bibeloty.labels,
          datasets: [
              {
                  label: "Stolarnia",
                  data: data.chart.stolarnia.values,
                  backgroundColor: "rgb(255, 153, 153)",
                  borderColor: "rgb(255, 153, 153)",
                    tension: 0.2,
                    borderWidth: 1,
                    fill: true
              }
              ,{
              label: "Bibeloty",
              data: data.chart.bibeloty.values,
              borderColor: "rgb(255, 255, 179)",
              backgroundColor: "rgb(255, 255, 179)",
                tension: 0.2,
                borderWidth: 1,
                fill: true,
          },{
              label: "Drukarnia",
              data: data.chart.drukarnia.values,
              backgroundColor: "rgb(102, 153, 255)",
              borderColor: "rgb(102, 153, 255)",
                tension: 0.2,
                borderWidth: 1,
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
              stacked: true,
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