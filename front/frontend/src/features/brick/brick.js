// import {openRaport} from '../../templates/single_raport/index.js';
import { openRaport } from './openRaport.js';
import { navigateTo } from '../../js/index.js';

export class Brick {
  constructor(each) {
    this.each = each;
    this.id = each.id;
    this.date = each.date_created;
    this.username = each.author.username;
    this.build();
  }

  openRap() {
    const newView = new openRaport(parseInt(this.id, 10));
    newView.getData();
  }

  build() {
    this.raportInfoGrid = document.createElement('div');
    this.raportInfoGrid.classList.add('card', 'swiper-slide');
    this.raportInfoGrid.id = this.id;

    const raportDataUser = document.createElement('div');
    raportDataUser.classList.add('raport-data-user');
    const detailsBox = document.createElement('div');
    detailsBox.classList.add('raport-detail-box');
    // const detailsDate = document.createElement('div');
    // detailsDate.classList.add('raport-details');
    // detailsDate.innerText = this.date;
    const splitedDate = this.date.split('-');
    const dayMonth = document.createElement('p');
    dayMonth.classList.add('raport-day-month');
    dayMonth.innerText = splitedDate[2] + '/' + splitedDate[1];
    const year = document.createElement('p');
    year.classList.add('raport-year');
    year.innerText = '/' + splitedDate[0];

    // const moreButton = document.createElement('div');
    // moreButton.classList.add('arrow');
    this.raportInfoGrid.onclick = () => {
      navigateTo('/raport/' + this.id);
    };

    detailsBox.appendChild(dayMonth);
    detailsBox.appendChild(year);
    // detailsBox.appendChild(detailsDate);
    raportDataUser.appendChild(detailsBox);
    // raportDataUser.appendChild(moreButton);

    this.raportInfoGrid.appendChild(raportDataUser);
    let regions = this.regions(this.each.units);
    this.raportInfoGrid.appendChild(regions);
  }
  regions(units) {
    this.raportRegions = document.createElement('div');
    this.raportRegions.classList.add('raport-regions');

    let numbers = this.count(units);
    for (const [key, value] of Object.entries(numbers)) {
      this.unitBox = document.createElement('div');
      this.raportRegionsUnit = document.createElement('div');
      this.raportCircleUnit = document.createElement('p');

      this.unitBox.classList.add('regio-circle-box');
      this.raportRegionsUnit.classList.add('regions-headers');
      this.raportCircleUnit.classList.add('raport-circle-empty');

      this.raportRegions.appendChild(this.unitBox);
      this.unitBox.appendChild(this.raportRegionsUnit);
      this.unitBox.appendChild(this.raportCircleUnit);

      this.raportRegionsUnit.innerText = key.capitalize();
      this.raportCircleUnit.innerText = value;

      if (value > 0) {
        this.raportCircleUnit.classList.add('full');
      }
    }

    return this.raportRegions;
  }

  count(units) {
    let result = [];
    units.forEach((each) => {
      result[each.region] = result[each.region] + 1 || 1;
    });
    return result;
  }

  getBrick() {
    return this.raportInfoGrid;
  }
}

Object.defineProperty(String.prototype, 'capitalize', {
  value: function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  },
  enumerable: false,
});
