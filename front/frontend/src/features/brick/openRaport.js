import { url } from '../../common/data/url.js';
import { navigateTo } from '../../js/index.js';
import { callApiGet, checkAuth } from '../endpoints/endpoints.js';
import { showloader, hideloader } from '../loading/loading.js';
import { deleteRaport } from '../delete/delete.js';
import { alerts } from '../alerts/alerts.js';
import { getCookieValue } from '../../features/cookie/index.js';

export class openRaport {
  constructor(id) {
    this.id = id;
    this.content = document.querySelector('#content');
    this.content.innerHTML = '';
    this.user = document.createElement('div');
    this.user.id = 'user';
    this.user.classList.add('user');
    this.raportContent = document.createElement('div');
    this.raportContent.id = 'raport-content';
    this.raportContent.classList.add('raport-content');
    this.deklContent = document.createElement('div');
    this.deklContent.classList.add('dekl');
    this.deklContent.id = 'dekl';
    this.issuesContent = document.createElement('div');
    this.issuesContent.classList.add('issues');
    this.issuesContent.id = 'issues';
  }

  async getData() {
    const loader = showloader();
    try {
      let [re, st] = await checkAuth(url + 'auth');
      if (
        (st == 202 && re.detail == 'authenticated') ||
        (st == 200 && re.access_token)
      ) {
        let [response, status] = await callApiGet(url + 'raport/' + this.id);
        if (status == 200) {
          hideloader();
          clearTimeout(loader);
          this.buildStructure(response);
          this.boldImportant();
          sessionStorage.setItem('active_raport', JSON.stringify(response));
          // console.log(this.id)
        } else {
          hideloader();
          clearTimeout(loader);
          alerts(status, response);
        }
      }
    } catch (error) {
      hideloader();
      clearTimeout(loader);
      alerts(error);
    }
  }

  buildStructure(data) {
    // USER $ BUTTONS
    let buttonsBox = document.createElement('div', 'nav-btn-hidden');
    buttonsBox.classList.add('buttons-box', 'btn-hidden');
    let editIconBox = document.createElement('div');
    editIconBox.classList.add('edit-delete-box');
    let editIcon = document.createElement('img');
    editIcon.src = '/src/static/raport_icons/edit.png';
    editIcon.addEventListener('click', () => {
      navigateTo('/edit/' + this.id);
    });

    let deleteIconBox = document.createElement('div');
    deleteIconBox.classList.add('edit-delete-box');
    let deleteIcon = document.createElement('img');
    deleteIcon.src = '/src/static/raport_icons/delete.png';
    deleteIcon.addEventListener('click', () => {
      if (confirm('Czy na pewno chcesz usunąć ten raport? ')) {
        deleteRaport(this.id);
      }
    });

    editIconBox.appendChild(editIcon);
    deleteIconBox.appendChild(deleteIcon);
    buttonsBox.appendChild(editIconBox);
    buttonsBox.appendChild(deleteIconBox);
    this.user.appendChild(buttonsBox);

    let dateUserBox = document.createElement('div');
    dateUserBox.classList.add('date-user-box');

    let w = window.screen.width;
    let h = window.screen.height;
    let resolution = document.createElement('div');
    resolution.innerText = w + ' x ' + h;

    let dateInfo = document.createElement('small');
    let userInfo = document.createElement('small');
    dateInfo.innerText = data.date_created;
    userInfo.innerText = data.author.username.capitalize();
    dateUserBox.appendChild(resolution);
    dateUserBox.appendChild(dateInfo);
    dateUserBox.appendChild(userInfo);
    this.user.appendChild(dateUserBox);

    if (data.author.username === getCookieValue('user')) {
      buttonsBox.classList.remove('btn-hidden');
    } else {
      this.user.style.justifyContent = 'flex-end';
    }

    // DEKLARACJE
    const Dekl = document.createElement('div');

    const DeklHeader = document.createElement('div');
    const DeklInfo = document.createElement('p');

    const DeklText = document.createElement('div');
    const Pawel = document.createElement('div');
    const namePawel = document.createElement('p');
    namePawel.innerText = 'Paweł';
    const todoPawel = document.createElement('p');

    const Adam = document.createElement('div');
    const nameAdam = document.createElement('p');
    nameAdam.innerText = 'Adam';
    const todoAdam = document.createElement('p');
    const Bartek = document.createElement('div');
    const nameBartek = document.createElement('p');
    nameBartek.innerText = 'Bartek';
    const todoBartek = document.createElement('p');

    Dekl.classList.add('single-raport-info-grid');
    DeklHeader.classList.add('raport-label', 'header');
    DeklText.classList.add('raport-text');
    Pawel.classList.add('content-text', 'one');
    Bartek.classList.add('content-text', 'one');
    Adam.classList.add('content-text', 'one');

    namePawel.classList.add('header', 'tresc-dekl');
    nameAdam.classList.add('header', 'tresc-dekl');
    nameBartek.classList.add('header', 'tresc-dekl');
    todoPawel.classList.add('tresc-dekl');
    todoAdam.classList.add('tresc-dekl');
    todoBartek.classList.add('tresc-dekl');

    DeklHeader.appendChild(DeklInfo);
    Pawel.appendChild(namePawel);
    Pawel.appendChild(todoPawel);
    DeklText.appendChild(Pawel);
    Adam.appendChild(nameAdam);
    Adam.appendChild(todoAdam);
    DeklText.appendChild(Adam);
    Bartek.appendChild(nameBartek);
    Bartek.appendChild(todoBartek);
    DeklText.appendChild(Bartek);
    Dekl.appendChild(DeklHeader);
    Dekl.appendChild(DeklText);

    this.deklContent.appendChild(Dekl);
    if (data.dekl.length > 0) {
      DeklInfo.innerText = 'Deklaracje';
      let [adam, pawel, bartek] = this.splitDeklData(data.dekl[0]);
      todoAdam.innerText = adam;
      todoPawel.innerText = pawel;
      todoBartek.innerText = bartek;
    }

    // URZĄDZENIA

    let urzadzenia = {};

    data.units.forEach((each) => {
      if (!(each.region in urzadzenia)) {
        urzadzenia[each.region] = [];
        urzadzenia[each.region].push([each.unit, each.info]);
      } else {
        urzadzenia[each.region].push([each.unit, each.info]);
      }
    });
    Object.entries(urzadzenia).forEach(([key, value], index) => {
      const Region = document.createElement('div');
      const RegionHeader = document.createElement('div');
      const RegionInfo = document.createElement('p');
      RegionInfo.classList.add('header');
      RegionHeader.appendChild(RegionInfo);
      const RegionTextHeader = document.createElement('div');

      value.forEach((element) => {
        const RegionText = document.createElement('p');

        RegionText.innerText = `${element[1]}`;
        RegionText.classList.add('tresc-raportu');
        RegionTextHeader.appendChild(RegionText);
      });
      Region.classList.add('single-raport-info-grid');
      RegionHeader.classList.add('raport-label');
      RegionTextHeader.classList.add('content-text', 'one');
      RegionInfo.innerText = `${key}`.capitalize();
      Region.appendChild(RegionHeader);
      Region.appendChild(RegionTextHeader);
      this.issuesContent.appendChild(Region);
    });

    // PLEXI

    if (data.plexi.length > 0) {
      const Plexi = document.createElement('div');
      const PlexiHeader = document.createElement('div');
      const PlexiInfo = document.createElement('p');
      PlexiInfo.classList.add('header');
      const PlexiTextHeader = document.createElement('div');
      const PlexiText = document.createElement('p');

      Plexi.classList.add('single-raport-info-grid');
      PlexiHeader.classList.add('raport-label');
      PlexiTextHeader.classList.add('content-text', 'one');
      PlexiText.classList.add('tresc-dekl');
      PlexiInfo.innerText = 'Raport Plexi';
      let [printed, wrong, factor] = this.splitPlexiData(data.plexi[0]);
      PlexiText.innerText = `W ostatnim tygodniu wydrukowano ${printed} sztuk plexi, 
            z czego ${wrong} zostało uszkodzonych. Współczynnik w skali miesiąca wynosi: ${factor}%`;
      PlexiHeader.appendChild(PlexiInfo);
      PlexiTextHeader.appendChild(PlexiText);
      Plexi.appendChild(PlexiHeader);
      Plexi.appendChild(PlexiTextHeader);
      this.issuesContent.appendChild(Plexi);
    }

    this.raportContent.appendChild(this.deklContent);
    this.raportContent.appendChild(this.issuesContent);
    this.content.appendChild(this.user);
    this.content.appendChild(this.raportContent);
  }

  splitPlexiData(data) {
    let printed = '';
    let wrong = '';
    let factor = '';
    for (const [key, value] of Object.entries(data)) {
      switch (key) {
        case 'printed':
          printed = value;
          break;
        case 'wrong':
          wrong = value;
          break;
        case 'factor':
          factor = value;
          break;
      }
    }
    return [printed, wrong, factor];
  }

  splitDeklData(data) {
    let adam = '';
    let pawel = '';
    let bartek = '';
    for (const [key, value] of Object.entries(data)) {
      switch (key) {
        case 'adam':
          adam = value;
          break;
        case 'pawel':
          pawel = value;
          break;
        case 'bartek':
          bartek = value;
          break;
      }
    }
    return [adam, pawel, bartek];
  }

  boldImportant() {
    let conts = document.querySelectorAll('.tresc-raportu');
    conts.forEach((item) => {
      let txt = item.innerHTML;
      const regex =
        /[\n]?([A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ]+\s*?[0-9]*?)([A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ0-9_.-])?:($|\s*)?/g;
      txt = txt.replace(regex, '<b>$&</b>');
      item.innerHTML = txt;
    });
  }
}
