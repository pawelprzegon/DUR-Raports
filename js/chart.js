 //pie stolarnia
 var ctx = document.getElementById("myChart_stol").getContext('2d');
 var myChart_stol = new Chart(ctx, {
     type: 'line',
     data: {
     labels: lab_stol,
     datasets: [{
         label: "Zgłoszenia",
         data: data_stol,
         borderColor: 'white',
          tension: 0.5,
          borderWidth: 1,
     }]
     },
     options: {
        plugins: {
            legend: {
               display: false
            }
         },
        scales: {
          x: {
            ticks: {
                color: "white",
              },
            grid: {
              display: false,
            }
          },
          y: {
            suggestedMin: 0,
            suggestedMax: 30,
          ticks: {
            precision: 0,
            color: "white",
            font:{
                size: 8,
            }
          },
            grid: {
              display: false
            }
          },
        }
      }
 });

  //pie drukarnia
  var ctx = document.getElementById("myChart_druk").getContext('2d');
  var myChart_druk = new Chart(ctx, {
      type: 'line',
      data: {
      labels: lab_druk,
      datasets: [{
          label: "Zgłoszenia",
          data: data_druk,
          borderColor: 'white',
          tension: 0.5,
          borderWidth: 1,
      }]
      },
      options: {
        plugins: {
            legend: {
               display: false
            }
         },
        scales: {
          x: {
            ticks: {
                color: "white",
              },
            grid: {
              display: false,
            }
          },
          y: {
            suggestedMin: 0,
            suggestedMax: 30,
          ticks: {
            precision: 0,
            color: "white",
            font:{
                size: 8,
            }
          },
            grid: {
              display: false
            }
          },
        }
      }
  });

  //pie bibeloty
  var ctx = document.getElementById("myChart_bib").getContext('2d');
  var myChart_bib = new Chart(ctx, {
      type: 'line',
      data: {
      labels: lab_bib,
      datasets: [{
          label: "Zgłoszenia",
          data: data_bib,
          borderColor: 'white',
          tension: 0.5,
          borderWidth: 1
      }]
      },
      options: {
        plugins: {
            legend: {
               display: false
            }
         },
        scales: {
          x: {
            ticks: {
                color: "white",
              },
            grid: {
              display: false,
            }
          },
          y: {
            suggestedMin: 0,
            suggestedMax: 30,
          ticks: {
            precision: 0,
            color: "white",
            font:{
                size: 8,
            }
          },
            grid: {
              display: false
            }
          },
        }
      }
  });