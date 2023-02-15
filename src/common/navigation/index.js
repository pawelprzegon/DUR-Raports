import {openStat} from '../../templates/statistics/index.js';
import {openCreate} from '../../templates/create/index.js';
import {raports} from '../../templates/all_raports/index.js'


export function navBar(){
    const header = document.getElementById("app-header")


    const topRow = document.createElement('div');
    topRow.classList.add('top-row')
    topRow.id = 'anim-row'
        const topElements = document.createElement('div');
        topElements.classList.add('top-elements')
            const topElement = document.createElement('div');
            topElement.classList.add('topElement')
                const navBtn = document.createElement('button');
                navBtn.classList.add('nav-btn')
                    const link = document.createElement('span');
                    link.classList.add('material-icon')
                    link.innerText = 'menu'
            const logoBox = document.createElement('div')
            logoBox.classList.add('top-element')
                const logo = document.createElement('img')
                logo.src = '/static/images/artgeist.png'
                logo.alt = 'artgeist'
                logo.id = 'logo'
                logo.classList.add('logo')

        navBtn.appendChild(link)
        topElement.appendChild(navBtn)
        logoBox.appendChild(logo)
        topElements.appendChild(topElement)
        topElements.appendChild(logoBox)

        const topElementsBtns = document.createElement('div');
        topElementsBtns.classList.add('top-elements')
        const btnsPics = document.createElement('nav');
        btnsPics.classList.add('nav', 'nav-close')
        btnsPics.id = 'btns-pics'
        // tutaj forEach
            const home = document.createElement('a');
            home.classList.add('nav-link')
            home.href = '#'
            home.innerText = 'home'
            home.onclick=function(){
                raports();
                navClose();
            }

            const stat = document.createElement('a')
            stat.classList.add('nav-link')
            stat.href = '#'
            stat.innerText = 'statystyki'
            stat.onclick = function(){
                
                openStat();
                navClose();
            } 
            const moje = document.createElement('a')
            moje.classList.add('nav-link')
            moje.href = '#'
            moje.innerText = 'moje'
            moje.onclick = function(){
                // openStat();
                console.log('moje')
            } 
            const dodaj = document.createElement('a')
            dodaj.classList.add('nav-link')
            dodaj.href = '#'
            dodaj.innerText = 'dodaj'
            dodaj.onclick = function(){
                openCreate();
                navClose();
            } 
            const edytuj = document.createElement('a')
            edytuj.classList.add('nav-link')
            edytuj.href = '#'
            edytuj.innerText = 'edytuj'
            edytuj.onclick = function(){
                // openStat();
                console.log('edytuj')
            }
            const usun = document.createElement('a')
            usun.classList.add('nav-link')
            usun.href = '#'
            usun.innerText = 'usun'
            usun.onclick = function(){
                // openStat();
                console.log('usuń')
            } 
            const wyloguj = document.createElement('a')
            wyloguj.classList.add('nav-link')
            wyloguj.href = '#'
            wyloguj.innerText = 'wyloguj'
            wyloguj.onclick = function(){
                // openStat();
                console.log('wyloguj')
            } 
            
        btnsPics.appendChild(home)
        btnsPics.appendChild(stat)
        btnsPics.appendChild(moje)
        btnsPics.appendChild(dodaj)
        btnsPics.appendChild(edytuj)
        btnsPics.appendChild(usun)
        btnsPics.appendChild(wyloguj)
        topElementsBtns.appendChild(btnsPics)
    
    topRow.appendChild(topElements)
    topRow.appendChild(topElementsBtns)

    const overlay = document.createElement('div');
    overlay.classList.add('nav-overlay')

    header.appendChild(topRow)
    header.appendChild(overlay)
}

export function navBehav(){

    const navOverlay = document.querySelector(".nav-overlay");
    const navButton = document.querySelector(".nav-btn");
    const btns = document.querySelector("nav");
    const pic = document.getElementById("logo")
    const elem = document.getElementById("anim-row")
    const navSecondRow = document.getElementById("btns-pics")
    
    navButton.addEventListener("click", e =>{
        let navSize = '40px';
            if ( $(window).width() <= 600) {     
                navSize = '250px';
            }
            else if (( $(window).width() > 600) && ( $(window).width() <= 900)){
                navSize = '100px';
            }else{
                navSize = '100px';
            }
        elem.style.height = navSize;
        elem.classList.add("big-row", "show-anim")
        pic.classList.add('big')
        btns.classList.remove("nav-close")
        navSecondRow.classList.add("nav-btns")
        navOverlay.classList.add("nav-overlay-open");
    });
    
    
    navOverlay.addEventListener("click", () =>{
        elem.style.height = "40px";
        elem.classList.remove("big-row", "show-anim")
        pic.classList.remove('big')
        btns.classList.add("nav-close")
        navOverlay.classList.remove("nav-overlay-open");
    })
    
    }


function navClose(){

    const navOverlay = document.querySelector(".nav-overlay");
    const btns = document.querySelector("nav");
    const pic = document.getElementById("logo")
    const elem = document.getElementById("anim-row")

    elem.style.height = "40px";
    elem.classList.remove("big-row", "show-anim")
    pic.classList.remove('big')
    btns.classList.add("nav-close")
    navOverlay.classList.remove("nav-overlay-open");
}