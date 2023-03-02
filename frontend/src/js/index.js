import {getCookieValue} from '../features/cookie/index.js'
import allRaportsView  from '../templates/allRaportsView.js';
import authView  from '../templates/authView.js';
import {navBar, navBehav, navClose} from '../common/navigation/index.js'
import statisticsView from '../templates/statisticsView.js';
import createView from '../templates/createView.js';
import singleRaportView from '../templates/singleRaportView.js';
import deleteView from '../templates/deleteView.js';
import logoutView from '../templates/logoutView.js';


const pathToRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const getParams = match => {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);
    return Object.fromEntries(keys.map((key, i) =>{
        return [key, values[i]];
    }));
}

export const navigateTo = url =>{
    history.pushState(null, null, url);
    router();
};


const router = async() =>{
    const routes = [
        { path: '/', view: allRaportsView },
        { path: '/login', view: authView },
        { path: '/raport/:id', view: singleRaportView },
        { path: '/statistics', view: statisticsView },
        { path: '/create', view: createView },
        { path: '/my/:username', view: allRaportsView },
        { path: '/delete/:id', view: deleteView },
        { path: '/logout', view: logoutView }
    ]

    //Test routs for potential matches

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
    
}