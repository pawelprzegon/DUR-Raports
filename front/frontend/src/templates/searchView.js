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
    const loader = showloader();
    try {
      let [re, st] = await checkAuth(url + 'auth');
      if (
        (st == 202 && re.detail == 'authenticated') ||
        (st == 200 && re.access_token)
      ) {
        let [response, status] = await callApiGet(this.api_url);
        if (status == 200) {
          hideloader();
          clearTimeout(loader);
          searchBehav();
          if (response == null) {
            alerts(
              status,
              `Nie znaleziono raportu z dnia: ${this.params.query}`,
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
      hideloader();
      clearTimeout(loader);
      alerts('error', error, 'alert-red');
    }
  }

  layout(response) {
    this.css();
    this.container.innerHTML = '';

    this.container.appendChild(this.label());
    this.container.appendChild(this.chart(response));
    this.container.appendChild(this.statistics(response));
  }

  label() {
    let placeLabelBox = document.createElement('div');
    placeLabelBox.classList.add('labelBox');
    let placeLabel = document.createElement('h2');
    placeLabel.innerText = this.params.query.capitalize();
    placeLabelBox.appendChild(placeLabel);
    return placeLabelBox;
  }

  chart(response) {
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
      this.params.query
    );
    chart.barChart();

    Chart.appendChild(canvas);
    ChartArea.appendChild(Chart);
    return ChartArea;
  }

  statistics(response) {
    let search = document.createElement('div');
    search.classList.add('searching');

    let place = document.createElement('div');
    place.classList.add('place');
    place.id = Object.keys(response);
    for (const value of Object.values(response)) {
      let obj = Array.isArray(value.items);
      for (const [k, v] of Object.entries(value.items)) {
        let box = this.block(k, v, obj);
        place.appendChild(box);
      }
    }

    search.appendChild(place);
    return search;
  }

  block(k, v, obj) {
    let elemBox = document.createElement('div');
    elemBox.classList.add('raport');
    let elemLabel = document.createElement('p');
    elemBox.appendChild(elemLabel);
    if (obj == true) {
      elemLabel.innerText = v.date;
      elemLabel.addEventListener('click', () => {
        navigateTo('/raport/' + v.id);
      });
    } else {
      let elemQuantity = document.createElement('p');
      let elemQuantityJedn = document.createElement('small');
      elemLabel.innerText = k;
      elemQuantity.innerText = v;
      elemQuantityJedn.innerText = 'szt';
      elemQuantity.appendChild(elemQuantityJedn);
      elemBox.appendChild(elemQuantity);
    }

    return elemBox;
  }
}
