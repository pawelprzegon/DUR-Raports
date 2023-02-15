import {addPaginate} from '../../common/paginate/index.js'
import {Brick} from '../../features/brick/index.js'

export function raports (){

    $("body").css("overflow", "hidden");
    const raportList = document.querySelector('#raport');
    raportList.innerHTML = '';
        
    const CheckList = document.querySelector('#form-data');
    CheckList.innerHTML='';

    
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
   

}