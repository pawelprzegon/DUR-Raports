import {navBar} from './src/common/navigation/index.js';
import {navBehav} from './src/common/navigation/index.js';
import {raports} from './src/templates/all_raports/index.js';
import {Auth} from './src/features/auth/index.js';




window.onload=function(){
    // MENU

// NAV 
    navBar();
    navBehav();


// BODY SECTION
    // raports();
    let newUser = new Auth();
    newUser.login();

}