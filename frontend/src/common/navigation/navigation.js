import {logout} from '../../features/logout/logout.js'
import {navigateTo} from '../../js/index.js'

export function navBar(user){
    const header = document.getElementById("app-header")

    document.getElementById('nav-theme').setAttribute('href', "/src/css/navigation.css");

    const topRow = document.createElement('div');
    topRow.classList.add('top-row')
    topRow.id = 'anim-row'
    const topElements = document.createElement('div');
    topElements.classList.add('top-elements')
    const topElement = document.createElement('div');
    topElement.classList.add('top-element')
    const empty = document.createElement('div')
    empty.classList.add('top-element')
    empty.id = 'empty'
    empty.style.visibility = 'hidden'
    const searchInput = document.createElement('input')
    searchInput.type = 'text'
    searchInput.name = 'search'
    searchInput.id = 'search'
    searchInput.placeholder="Szukaj..."
    searchInput.classList.add('search-input')
    searchInput.addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode == 13 && (searchInput.value).trim() != ''){
            navigateTo('/search/'+searchInput.value);
        }
            
    });
    empty.appendChild(searchInput)
    const navBtn = document.createElement('button');
    navBtn.classList.add('nav-btn')
    const link = document.createElement('span');
    link.classList.add('material-icon')
    link.innerText = 'menu'

    const SearchBox = document.createElement('div')
    SearchBox.classList.add('search')
    const searchBtn = document.createElement('img')
    searchBtn.src = '/src/static/nav_icons/search-line-icon.png'
    searchBtn.id = 'searchBtn'
    searchBtn.addEventListener("click", () =>{
        searchForm();
        searchInput.focus();
    })

    
    const UserBox = document.createElement('div')
    UserBox.classList.add('top-element')
    const preUserLabel = document.createElement('span');
    preUserLabel.classList.add('pre-nav-user')
    preUserLabel.innerText = 'Logged: '
    const userLabel = document.createElement('span');
    userLabel.classList.add('nav-user')
    userLabel.id = 'nav-user'
    userLabel.innerText = user.capitalize();
    const LogoBox = document.createElement('div')
    LogoBox.classList.add('top-element')
    const logo = document.createElement('img')
    logo.src = '/src/static/artgeist.png'
    logo.alt = 'artgeist'
    logo.id = 'logo'
    logo.classList.add('logo')

    navBtn.appendChild(link)
    topElement.appendChild(navBtn)
    SearchBox.appendChild(searchBtn)
    UserBox.appendChild(preUserLabel)
    UserBox.appendChild(userLabel)
    LogoBox.appendChild(logo)
    
    topElements.appendChild(topElement)
    topElements.appendChild(empty)


    const btnsPics = document.createElement('nav');
    btnsPics.classList.add('nav', 'nav-close')
    btnsPics.id = 'btns-pics'

    const home = document.createElement('a');
    home.classList.add('nav-link')
    home.href = '/'
    home.innerText = 'home'
    home.setAttribute('data-link', '')


    const stat = document.createElement('a')
    stat.classList.add('nav-link')
    stat.href = '/statistics'
    stat.innerText = 'statystyki'
    stat.setAttribute('data-link', '')

    const moje = document.createElement('a')
    moje.classList.add('nav-link')
    moje.href = '/user/'+ user
    moje.innerText = 'moje'
    moje.setAttribute('data-link', '')

    const dodaj = document.createElement('a')
    dodaj.classList.add('nav-link')
    dodaj.href = '/create'
    dodaj.innerText = 'dodaj'
    dodaj.setAttribute('data-link', '')

    const wyloguj = document.createElement('a')
    wyloguj.classList.add('nav-link')
    wyloguj.innerText = 'wyloguj'
    wyloguj.addEventListener("click", () =>{
        logout();
    })

    btnsPics.appendChild(home)
    btnsPics.appendChild(stat)
    btnsPics.appendChild(moje)
    btnsPics.appendChild(dodaj)
    btnsPics.appendChild(wyloguj)
    topElements.appendChild(btnsPics)
    topElements.appendChild(SearchBox)
    topElements.appendChild(UserBox)
    topElements.appendChild(LogoBox)
    
    topRow.appendChild(topElements)

    const overlay = document.createElement('div');
    overlay.classList.add('nav-overlay')

    header.appendChild(topRow)
    header.appendChild(overlay)
}

export function navBehav(){

    const navOverlay = document.querySelector(".nav-overlay");
    const navButton = document.querySelector(".nav-btn");
    const btns = document.querySelector("nav");
    const navSecondRow = document.getElementById("btns-pics")
    const empty = document.getElementById('empty')
    const searchInput = document.getElementById('search')

    navButton.addEventListener("click", e =>{
        btns.classList.remove("nav-close")
        navSecondRow.classList.add("nav-btns", "show-anim-nav")
        navOverlay.classList.add("nav-overlay-open");
        empty.classList.add('nav-close')
    });
    
    navOverlay.addEventListener("click", () =>{
        navSecondRow.classList.remove("show-anim-nav")
        btns.classList.add("nav-close")
        navOverlay.classList.remove("nav-overlay-open");
        empty.classList.remove('nav-close')
        empty.style.visibility = 'hidden'
        searchInput.value = ''
    })
}




export function navClose(){

    const navOverlay = document.querySelector(".nav-overlay");
    const btns = document.querySelector("nav");
    const pic = document.getElementById("logo")
    const elem = document.getElementById("anim-row")

    elem.classList.remove("big-row", "show-anim-nav")
    pic.classList.remove('big')
    btns.classList.add("nav-close")
    navOverlay.classList.remove("nav-overlay-open");
}

export function searchBehav(){
    let empty = document.getElementById('empty')
    empty.style.visibility = 'hidden'
    empty.classList.remove('nav-close')
}

function searchForm(){

    const navOverlay = document.querySelector(".nav-overlay");
    const btns = document.querySelector("nav");
    const navSecondRow = document.getElementById("btns-pics")
    const empty = document.getElementById('empty')
    navSecondRow.classList.remove("show-anim-nav")
    btns.classList.add("nav-close")
    navOverlay.classList.add("nav-overlay-open");
    empty.classList.remove('nav-close')
    empty.style.visibility = 'visible'
}

