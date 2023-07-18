import { url } from '../common/data/url.js';
import { callApiGet, checkAuth } from '../features/endpoints/endpoints.js';
import { showloader, hideloader } from '../features/loading/loading.js';
import { alerts } from '../features/alerts/alerts.js';
import { createCharts } from '../features/chart/createCharts.js';
import AbstractView from './AbstractView.js';

export default class extends AbstractView {
  constructor() {
    super();
    this.loader = showloader();
    this.container = document.querySelector('#cont');
    this.container.innerHTML = '';
    this.setTitle('Statystyki');
    this.api_url = url + 'statistics';
  }

  css() {
    document
      .getElementById('theme')
      .setAttribute('href', '../src/css/statistics.css');
  }
  async getData() {
    try {
      let [re, st] = await checkAuth(url + 'auth');
      if (
        (st == 202 && re.detail == 'authenticated') ||
        (st == 200 && re.access_token)
      ) {
        let [response, status] = await callApiGet(this.api_url);
        if (status == 200) {
          hideloader();
          clearTimeout(this.loader);
          this.layout(response);
        } else {
          hideloader();
          clearTimeout(this.loader);
          alerts(status, response, 'alert-orange');
        }
      }
    } catch (error) {
      hideloader();
      clearTimeout(this.loader);
      alerts('error', error, 'alert-red');
    }
  }

  layout(response) {
    this.css();
    console.log(response);
    this.departments(response);
    // this.container.appendChild(this.statistics(response));
    this.statistics(response);
    // this.container.appendChild(this.users(response));
    this.users(response);
  }

  departments(response) {
    let departments = document.createElement('div');
    departments.classList.add('departments');
    let chartBox = this.chartBox('Raporty na dział', response.sum_all_raports);
    chartBox.appendChild(this.chart(response, 'linear'));
    chartBox.classList.add('place', 'place-wide');
    departments.appendChild(chartBox);
    this.container.appendChild(departments);
  }

  users(response) {
    let users = document.createElement('div');
    users.classList.add('users', 'place');
    let chartBox = this.chartBox('Raporty użytkowników', response.user.sum);
    chartBox.classList.add('chart-area');
    chartBox.appendChild(this.chart(response.user.user_raports, 'doughnut'));
    users.appendChild(chartBox);
    this.container.appendChild(users);
  }

  statistics(response) {
    let statistics = document.createElement('div');
    statistics.classList.add('statistics');
    for (const [key, value] of Object.entries(response.statistics)) {
      let placeQuantity = this.placeQuantity(value);
      let box = this.department(key, value.items, placeQuantity);
      statistics.appendChild(box);
    }
    this.container.appendChild(statistics);
  }

  department(key, data, placeQuantity) {
    let chartBox = this.chartBox(key, placeQuantity);
    chartBox.classList.add('place');
    chartBox.appendChild(this.chart(data, 'bar', key));
    return chartBox;
  }

  placeQuantity(value) {
    let x = 0;
    for (const v of Object.values(value.chart)) {
      x += v;
    }
    return x;
  }

  chartBox(label, quantity) {
    let chartBox = document.createElement('div');
    chartBox.id = label;
    let placeLabelBox = document.createElement('div');
    placeLabelBox.classList.add('labelBoxChart');
    let placeLabelMain = document.createElement('h4');
    placeLabelMain.innerText = label.capitalize();
    let placeLabelQuantity = document.createElement('h2');
    placeLabelQuantity.innerText = quantity + 'szt';

    placeLabelBox.appendChild(placeLabelMain);
    placeLabelBox.appendChild(placeLabelQuantity);
    chartBox.appendChild(placeLabelBox);
    return chartBox;
  }

  chart(response, chartType, department) {
    const ChartArea = document.createElement('div');
    ChartArea.classList.add('chart-area');
    const Chart = document.createElement('div');
    const canvas = document.createElement('canvas');
    canvas.id = 'charts';
    canvas.style = 'null';
    if (chartType === 'linear') {
      Chart.classList.add('chart-linear');
      let chart = new createCharts(response.statistics, canvas);
      chart.lineChart();
    } else if (chartType === 'doughnut') {
      Chart.classList.add('chart-doughnut');
      let chart = new createCharts(response, canvas);
      chart.doughnutChart();
    } else if (chartType === 'bar') {
      Chart.classList.add('chart-bar');
      let chart = new createCharts(response, canvas, department);
      chart.barChart();
    }
    Chart.appendChild(canvas);
    ChartArea.appendChild(Chart);
    return ChartArea;
  }
}
