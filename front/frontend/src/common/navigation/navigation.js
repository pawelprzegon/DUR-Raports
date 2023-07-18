import { logout } from '../../features/logout/logout.js';
import { navigateTo } from '../../js/index.js';
import { url } from '../data/url.js';

export function navBar(user) {
  const header = document.getElementById('app-header');

  document
    .getElementById('nav-theme')
    .setAttribute('href', '/src/css/navigation.css');

  const topRow = document.createElement('div');
  topRow.classList.add('top-row');
  topRow.id = 'anim-row';
  const topElements = document.createElement('div');
  topElements.classList.add('top-elements');
  const topElement = document.createElement('div');
  topElement.classList.add('top-element');
  const searchBox = document.createElement('div');
  searchBox.classList.add('top-element-searchBox');
  searchBox.id = 'searchBox';
  searchBox.style.visibility = 'hidden';

  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.name = 'search';
  searchInput.id = 'search';
  searchInput.placeholder = "2023-01-31, 'Impale', 'Drukarnia'";
  searchInput.classList.add('search-input');
  searchInput.addEventListener('keyup', function (event) {
    event.preventDefault();
    if (event.keyCode == 13 && searchInput.value.trim() != '') {
      navigateTo('/search/' + searchInput.value);
      navClose();
    }
  });
  searchBox.appendChild(searchInput);
  const navBtn = document.createElement('button');
  navBtn.classList.add('nav-btn');
  const link = document.createElement('span');
  link.classList.add('material-icon');
  link.innerText = 'menu';

  const searchBtnBox = document.createElement('div');
  searchBtnBox.classList.add('search');
  const searchBtn = document.createElement('img');
  searchBtn.src = '/src/static/nav_icons/search-line-icon.png';
  searchBtn.id = 'searchBtn';
  searchBtn.addEventListener('click', () => {
    searchForm();
    searchInput.focus();
  });

  const UserBox = document.createElement('div');
  UserBox.classList.add('top-element');
  const preUserLabel = document.createElement('span');
  preUserLabel.classList.add('pre-nav-user');
  preUserLabel.innerText = 'Logged: ';

  const userLabel = document.createElement('span');
  userLabel.classList.add('nav-user');
  userLabel.id = 'nav-user';
  userLabel.innerText = user.capitalize();

  const ApiBox = document.createElement('div');
  ApiBox.classList.add('top-element');
  const api = document.createElement('img');
  api.src = '/src/static/nav_icons/api.png';
  api.alt = 'artgeist';
  api.id = 'api';
  api.classList.add('api-logo');
  api.addEventListener('click', () => {
    window.location.href = url + 'docs';
  });

  navBtn.appendChild(link);
  topElement.appendChild(navBtn);
  searchBtnBox.appendChild(searchBtn);
  UserBox.appendChild(preUserLabel);
  UserBox.appendChild(userLabel);
  ApiBox.appendChild(api);

  topElements.appendChild(topElement);
  topElements.appendChild(searchBox);

  const btnsPics = document.createElement('nav');
  btnsPics.classList.add('nav', 'nav-close');
  btnsPics.id = 'btns-pics';

  const home = document.createElement('a');
  home.classList.add('nav-link');
  home.href = '/';
  home.innerText = 'home';
  home.setAttribute('data-link', '');

  const stat = document.createElement('a');
  stat.classList.add('nav-link');
  stat.href = '/statistics';
  stat.innerText = 'statystyki';
  stat.setAttribute('data-link', '');

  const moje = document.createElement('a');
  moje.classList.add('nav-link');
  moje.href = '/user/' + user;
  moje.innerText = 'moje';
  moje.setAttribute('data-link', '');

  const dodaj = document.createElement('a');
  dodaj.classList.add('nav-link');
  dodaj.href = '/create';
  dodaj.innerText = 'dodaj';
  dodaj.setAttribute('data-link', '');

  const wyloguj = document.createElement('a');
  wyloguj.classList.add('nav-link');
  wyloguj.innerText = 'wyloguj';
  wyloguj.addEventListener('click', () => {
    logout();
  });

  btnsPics.appendChild(home);
  btnsPics.appendChild(stat);
  btnsPics.appendChild(moje);
  btnsPics.appendChild(dodaj);
  btnsPics.appendChild(wyloguj);
  topElements.appendChild(btnsPics);
  topElements.appendChild(searchBtnBox);
  topElements.appendChild(UserBox);
  topElements.appendChild(ApiBox);

  topRow.appendChild(topElements);

  const overlay = document.createElement('div');
  overlay.classList.add('nav-overlay');

  header.appendChild(topRow);
  header.appendChild(overlay);
}

export function navBehav() {
  const navButton = document.querySelector('.nav-btn');
  const navOverlay = document.querySelector('.nav-overlay');
  const btns = document.querySelector('nav');

  navButton.addEventListener('click', (e) => {
    if (btns.classList.contains('nav-close')) {
      navOpen(navOverlay, btns);
    } else {
      navClose();
    }
  });

  navOverlay.addEventListener('click', () => {
    navClose();
  });
}

function navOpen(navOverlay, btns) {
  const navSecondRow = document.getElementById('btns-pics');
  const searchBox = document.getElementById('searchBox');
  const btnText = document.querySelector('.material-icon');
  btnText.style.fontWeight = '400';
  btns.classList.remove('nav-close');
  navSecondRow.classList.add('nav-btns', 'show-anim-nav');
  navOverlay.classList.add('nav-overlay-open');
  searchBox.classList.add('nav-close');
}

export function navClose() {
  const navOverlay = document.querySelector('.nav-overlay');
  const btns = document.querySelector('nav');
  const navSecondRow = document.getElementById('btns-pics');
  const searchBox = document.getElementById('searchBox');
  const searchInput = document.getElementById('search');
  const btnText = document.querySelector('.material-icon');
  const topRow = document.getElementById('anim-row');

  topRow.classList.remove('big-row', 'show-anim-nav');
  btnText.style.fontWeight = null;
  navSecondRow.classList.remove('show-anim-nav');
  btns.classList.add('nav-close');
  navOverlay.classList.remove('nav-overlay-open');
  searchBox.classList.remove('nav-close');
  searchBox.style.visibility = 'hidden';
  searchInput.value = '';
}

export function searchBehav() {
  let searchBox = document.getElementById('searchBox');
  searchBox.style.visibility = 'hidden';
  searchBox.classList.remove('nav-close');
}

function searchForm() {
  const navOverlay = document.querySelector('.nav-overlay');
  const btns = document.querySelector('nav');
  const navSecondRow = document.getElementById('btns-pics');
  const searchBox = document.getElementById('searchBox');
  navSecondRow.classList.remove('show-anim-nav');
  btns.classList.add('nav-close');
  navOverlay.classList.add('nav-overlay-open');
  searchBox.classList.remove('nav-close');
  searchBox.style.visibility = 'visible';
}
