import {getCookieValue} from '../features/cookie/index.js'
import all_raports  from '../templates/all_raports/index.js';
import auth  from '../templates/auth/index.js';
import {navBar, navBehav} from '../common/navigation/index.js'
import statistics from '../templates/statistics/index.js';
import create from '../templates/create/index.js';
import single_raport from '../templates/single_raport/index.js';


const pathToRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const getParams = match => {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);
    return Object.fromEntries(keys.map((key, i) =>{
        return [key, values[i]];
    }));
}

const navigateTo = url =>{
    history.pushState(null, null, url);
    router();
};


const router = async() =>{
    const routes = [
        { path: '/', view: all_raports },
        { path: '/login', view: auth },
        { path: '/raport/:id', view: single_raport },
        { path: '/statistics', view: statistics },
        { path: '/:username', view: all_raports },
        { path: '/new', view: create },
        { path: '/logout', view: () => console.log('wyloguj') }
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
        match = {
            route: routes[0],
            isMatch: true
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
            navigateTo(e.target.href);
        }
    })
    router();
})

let authorize = getCookieValue('access_token')
console.log(authorize)
if (authorize){
    let user = getCookieValue('user')
    navBar(user);
    navBehav();
}else{
    navigateTo('/login')
}