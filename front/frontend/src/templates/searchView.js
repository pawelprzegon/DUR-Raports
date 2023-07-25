import { url } from '../common/data/url.js';
import { checkAuth, callApiGet } from '../features/endpoints/endpoints.js';
import { alerts } from '../features/alerts/alerts.js';
import { showloader, hideloader } from '../features/loading/loading.js';
import { searchBehav } from '../common/navigation/navigation.js';
import { createCharts } from '../features/chart/createCharts.js';
import { navigateTo } from '../js/index.js';
import AbstractView from './AbstractView.js';

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.params = params;
    this.setTitle('search: ' + this.params.query);
    this.api_url = url + 'search/' + this.params.query;
    this.container = document.querySelector('#cont');
  }

  css() {
    document
      .getElementById('theme')
      .setAttribute('href', '/../src/css/search.css');
  }

  async getData() {
    try {
      let [re, st] = await checkAuth(url + 'auth');
      if (
        (st == 202 && re.detail == 'authenticated') ||
        (st == 200 && re.access_token)
      ) {
        const loader = showloader();
        let [response, status] = await callApiGet(this.api_url);
        if (status == 200) {
          hideloader();
          clearTimeout(loader);
          searchBehav();
          if (response == null) {
            alerts(
              status,
              `Nie znaleziono: ${this.params.query}`,
              'alert-orange'
            );
          } else if ('id' in response) {
            navigateTo('/raport/' + response.id);
          } else {
            this.layout(response);
          }
        } else if (status == 404) {
          hideloader();
          clearTimeout(loader);
          alerts(status, response.detail, 'alert-orange');
        } else {
          hideloader();
          clearTimeout(loader);
          alerts(status, response, 'alert-red');
        }
      }
    } catch (error) {
      clearTimeout(loader);
      alerts('error', error, 'alert-red');
    }
  }

  layout(response) {
    this.css();
    this.container.innerHTML = '';
    this.container.appendChild(this.label(response));

    this.container.appendChild(this.line_chart(response));
    // this.container.appendChild(this.bar_chart(response));

    this.container.appendChild(this.statistics(response));
  }

  label(response) {
    let placeLabelBox = document.createElement('div');
    placeLabelBox.classList.add('labelBox');
    let placeLabel = document.createElement('h2');
    placeLabel.innerText = response.searching.capitalize();
    placeLabelBox.appendChild(placeLabel);
    return placeLabelBox;
  }

  bar_chart(response) {
    const ChartArea = document.createElement('div');
    ChartArea.classList.add('chart-area');
    const Chart = document.createElement('div');
    Chart.classList.add('chart');
    const canvas = document.createElement('canvas');
    canvas.id = 'charts';
    canvas.style = 'null';
    let chart = new createCharts(
      response.searching.chart,
      canvas,
      response.searching.query.capitalize()
    );
    chart.barChart();
    Chart.appendChild(canvas);
    ChartArea.appendChild(Chart);
    return ChartArea;
  }

  line_chart(response) {
    const ChartArea = document.createElement('div');
    ChartArea.classList.add('chart-area');
    const Chart = document.createElement('div');
    Chart.classList.add('chart');
    const canvas = document.createElement('canvas');
    canvas.id = 'charts';
    canvas.style = 'null';
    let chart = new createCharts(
      response.statistics,
      canvas,
      response.searching.capitalize()
    );
    chart.lineChart();
    Chart.appendChild(canvas);
    ChartArea.appendChild(Chart);
    return ChartArea;
  }

  statistics(response) {
    let search = document.createElement('div');
    search.classList.add('searching');
    for (const [key, value] of Object.entries(response.statistics)) {
      let place = document.createElement('div');
      place.classList.add('place');
      place.id = key;
      let obj = Array.isArray(value.items);
      let labelBox = this.labelBox(key);
      place.appendChild(labelBox);
      for (const [k, v] of Object.entries(value.items)) {
        let dateBox = this.dateBox(k, v, obj);
        place.appendChild(dateBox);
      }
      search.appendChild(place);
    }

    return search;
  }

  labelBox(k) {
    let labelBox = document.createElement('p');
    labelBox.classList.add('statistics-label');
    labelBox.innerText = k.capitalize();
    return labelBox;
  }

  dateBox(k, v, obj) {
    let dateBox = document.createElement('div');
    dateBox.classList.add('raport');
    let elemLabel = document.createElement('p');
    dateBox.appendChild(elemLabel);
    if (obj == true) {
      if ('date' in v) {
        elemLabel.innerText = v.date;
        elemLabel.addEventListener('click', () => {
          navigateTo('/raport/' + v.id);
        });
      } else if ('name' in v) {
        let elemQuantity = document.createElement('p');
        let elemQuantityJedn = document.createElement('small');
        elemLabel.innerText = v.name;
        elemLabel.addEventListener('click', () => {
          navigateTo('/search/' + v.name);
        });
        elemQuantity.innerText = v.quantity;
        elemQuantityJedn.innerText = 'szt';
        elemQuantity.appendChild(elemQuantityJedn);
        dateBox.appendChild(elemQuantity);
      }
    }

    return dateBox;
  }
}
