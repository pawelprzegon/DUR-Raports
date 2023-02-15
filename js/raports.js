import {navBar} from '../src/common/navigation/index.js';
import {navBehav} from '../src/common/navigation/index.js';
// import '../src/common/navigation/style.css';
import {addPaginate} from '../src/common/paginate/index.js'
import {Brick} from '../src/features/brick/index.js'



window.onload=function(){
    // MENU

    $("body").css("overflow", "hidden");

 
// NAV 
    navBar();
    navBehav();


// BODY SECTION

    function hideloader() {
        document.getElementById('loading').style.display = 'none';
    }

    function show(data) {
        
    const raportList = document.querySelector('#raport');
    raportList.classList.remove('single')
    raportList.innerHTML = '';

    data.forEach(each => {

        let raportInfoGrid = new Brick(each)
        let brick = raportInfoGrid.getBrick()
        raportList.appendChild(brick);

    });

    }
    const api_url = 
        "https://mocki.io/v1/a0e2c838-c640-49ec-9111-2eb40f9296df";

    // Defining async function
    async function getapi(url) {
        const response = await fetch(url);
        var data = await response.json();

        if (response) {
            hideloader();
        }
            console.log(data);
            show(data);
            addPaginate();

    }

    getapi(api_url);

}