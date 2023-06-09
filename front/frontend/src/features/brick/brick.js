// import {openRaport} from '../../templates/single_raport/index.js';
import { openRaport } from "./openRaport.js";
import { navigateTo } from "../../js/index.js";

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
    this.raportInfoGrid = document.createElement("div");
    this.raportInfoGrid.id = this.id;
    this.raportDataUser = document.createElement("div");
    this.detailsBox = document.createElement("div");
    this.detailsDate = document.createElement("p");
    this.detailsUser = document.createElement("p");
    this.moreButton = document.createElement("div");
    this.moreButton.onclick = () => {
      navigateTo("/raport/" + this.id);
    };

    let regions = this.regions(this.each.units);

    this.raportInfoGrid.classList.add("card", "swiper-slide");
    this.raportDataUser.classList.add("raport-data-user");
    this.detailsBox.classList.add("raport-detail-box");
    this.detailsDate.classList.add("raport-details");
    this.detailsUser.classList.add("raport-details");
    this.moreButton.classList.add("arrow");

    this.detailsDate.innerText = this.date;
    this.detailsUser.innerText = this.username.capitalize();

    this.raportInfoGrid.appendChild(this.raportDataUser);
    this.detailsBox.appendChild(this.detailsDate);
    this.detailsBox.appendChild(this.detailsUser);
    this.raportDataUser.appendChild(this.detailsBox);
    this.raportDataUser.appendChild(this.moreButton);
    this.raportInfoGrid.appendChild(regions);
  }
  regions(units) {
    this.raportRegions = document.createElement("div");
    this.raportRegions.classList.add("raport-regions");

    let numbers = this.count(units);
    for (const [key, value] of Object.entries(numbers)) {
      this.unitBox = document.createElement("div");
      this.raportRegionsUnit = document.createElement("div");
      this.raportCircleUnit = document.createElement("p");

      this.unitBox.classList.add("regio-circle-box");
      this.raportRegionsUnit.classList.add("regions-headers");
      this.raportCircleUnit.classList.add("raport-circle-empty");

      this.raportRegions.appendChild(this.unitBox);
      this.unitBox.appendChild(this.raportRegionsUnit);
      this.unitBox.appendChild(this.raportCircleUnit);

      this.raportRegionsUnit.innerText = key.capitalize();
      this.raportCircleUnit.innerText = value;

      if (value > 0) {
        this.raportCircleUnit.classList.add("full");
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

Object.defineProperty(String.prototype, "capitalize", {
  value: function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  },
  enumerable: false,
});
