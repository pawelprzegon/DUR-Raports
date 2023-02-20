import {url} from "../../common/data/index.js"
import {addPaginate} from '../../common/paginate/index.js'
import {Brick} from '../../features/brick/index.js'

export function raports (username){

    document.getElementById('loading').style.visibility = 'visible';

    let api_url = url+"raports/"
    // api_url = "http://localhost:8000/raports"
    // api_url = "https://mocki.io/v1/8b49b683-9fea-4932-aac2-6c264b7bc6df"

    let theme = document.getElementById('theme')
    theme.setAttribute('href', "/src/templates/all_raports/style.css");

    // $("body").css("overflow", "hidden");
    const raportList = document.querySelector('#raport');
    raportList.innerHTML = '';
        
    const CheckList = document.querySelector('#form-data');
    CheckList.innerHTML='';


    
    // const api_url = "http://localhost:8000/raports"

    // Defining async function
    async function getapi(username) {
        if (username != undefined){
            api_url = api_url+username
        }
        
        const response = await fetch(api_url);
        var data = await response.json();

        if (response) {
            hideloader();
        }
            console.log(data);
            show(data);
            addPaginate();

    }
    getapi(username);

 
    function hideloader() {
        document.getElementById('loading').style.visibility = 'hidden';
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