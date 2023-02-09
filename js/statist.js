
// api url
const api_url = 
      "https://mocki.io/v1/5f15194a-ce6e-4ae3-bfb3-69c0b3328f96";


  
// Defining async function
async function getapi(url) {
    
    // Storing response
    const response = await fetch(url);
    
    // Storing data in form of JSON
    var data = await response.json();

    
    if (response) {
        hideloader();
    }
        console.log(data);
        layout();
        charts(data);

}
// Calling that async function
getapi(api_url);
  
// Function to hide the loader
function hideloader() {
    document.getElementById('loading').style.display = 'none';
}


function layout() {
    const statisticsList = document.querySelector('#raport');
    statisticsList.innerHTML = '';
        const ChartsArea = document.createElement('div');
            ChartsArea.classList.add("chart")
            const canvas = document.createElement('canvas');
            canvas.id = 'charts' ;
        
        ChartsArea.appendChild(canvas);
        statisticsList.appendChild(ChartsArea);
}

function charts(data){
    
    let max = 0
    
    // var json = jQuery.parseJSON(tst);

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
    console.log(max)
    let ctx = document.getElementById("charts").getContext('2d');
    new Chart(ctx, {
        type: 'line',
     data: {
     labels: data.chart.bibeloty.labels,
     datasets: [
        {
            label: "Stolarnia",
             data: data.chart.stolarnia.values,
             backgroundColor: "rgba(255, 0, 0, 0.6)",
             borderColor: 'red',
              tension: 1,
              borderWidth: 1,
              fill: true
         }
        ,{
         label: "Bibeloty",
         data: data.chart.bibeloty.values,
         borderColor: 'yellow',
         backgroundColor: "rgba(255, 255, 0, 0.6)",
          tension: 1,
          borderWidth: 1,
          fill: true,
     },{
        label: "Drukarnia",
         data: data.chart.drukarnia.values,
         backgroundColor: "rgba(0, 102, 255, 0.6)",
         borderColor: 'blue',
          tension: 1,
          borderWidth: 1,
          fill: true,
     }
    ]
     },
     options: {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: (ctx) => 'Chart.js Line Chart - stacked=' + ctx.chart.options.scales.y.stacked
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