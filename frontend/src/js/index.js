import {getCookieValue} from '../features/cookie/index.js'
import allRaportsView  from '../templates/allRaportsView.js';
import authView  from '../templates/authView.js';
import {navBar, navClose, navCloseBtns, navBehav} from '../common/navigation/navigation.js'
import statisticsView from '../templates/statisticsView.js';
import createView from '../templates/createView.js';
import deleteView from '../templates/deleteView.js';
import logoutView from '../templates/logoutView.js';
import resetPassword from '../templates/resetPassword.js';


const pathToRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const getParams = match => {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);
    return Object.fromEntries(keys.map((key, i) =>{
        return [key, values[i]];
    }));
}

export const navigateTo = url =>{
    clearAll();
    let menubar =  document.getElementById('anim-row');
    if (typeof(menubar) != 'undefined' && menubar != null){
        navCloseBtns();
    }
    window.scrollTo(0,0);
    // $("body").css("overflow", "hidden");
    history.pushState(null, null, url);
    router();
};


const router = async() =>{
    const routes = [
        { path: '/', view: allRaportsView },
        { path: '/login', view: authView },
        { path: '/statistics', view: statisticsView },
        { path: '/create', view: createView },
        { path: '/edit/:id', view: createView },
        { path: '/my/:username', view: allRaportsView },
        { path: '/delete/:id', view: deleteView },
        { path: '/logout', view: logoutView },
        { path: '/reset-password', view: resetPassword }

    ]


    const potentialMatches = routes.map(route => {
        return{
            route: route,
            result: location.pathname.match(pathToRegex(route.path))
        };
    });
    let match = potentialMatches.find(potentialMatch => potentialMatch.result !== null);

    if (!match){
        console.log('dont match')
        match = {
            route: routes[0],
            result: [location.pathname]
        };
    }

    const view = new match.route.view(getParams(match));
    await view.getData();

    // console.log(match.route.view())
}

window.addEventListener("popstate", router);

document.addEventListener('DOMContentLoaded', () =>{

    document.body.addEventListener("click", e =>{
        if(e.target.matches("[data-link]")){
            e.preventDefault();
            navClose();
            navigateTo(e.target.href);
            
        }
    })
    router();
})

let authorize = getCookieValue('access_token')
if (authorize){
    let user = getCookieValue('user')
    navBar(user);
    navBehav(); 
    window.scrollTo(0,0);
    // $("body").css("overflow", "hidden");
}

function clearAll(){
    document.querySelector('#user').innerHTML = '';
    document.querySelector('#dekl').innerHTML = '';
    document.querySelector('#issues').innerHTML = '';
    document.querySelector('#raport').innerHTML = '';
    document.querySelector('#form-data').innerHTML = '';
}