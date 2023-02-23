import {navBar} from './src/common/navigation/index.js';
import {navBehav} from './src/common/navigation/index.js';
import {raports} from './src/templates/all_raports/index.js';
import {Auth} from './src/features/auth/index.js';




window.onload=async function(){
    // MENU

// NAV 
    // navBar();
    // navBehav();


// BODY SECTION
    // raports();
    let newUser = new Auth();
    //tutaj sprawdzać czy jest token w cookies i jeśli tak to validować 
    // newUser.login();
    newUser.register();
    
}