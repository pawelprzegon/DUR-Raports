import {url} from "../../common/data/index.js"
import {addPaginate} from '../../common/paginate/index.js'
import {Brick} from '../../features/brick/index.js'
import {getCookieValue} from '../../features/cookie/index.js'

export function raports (username){


    document.getElementById('loading').style.visibility = 'visible';

    // let api_url = url+"raports/"
    let api_url = url+"raports/"
    if (username){
        api_url = url+"raports/"+username
    }

    let theme = document.getElementById('theme')
    theme.setAttribute('href', "/src/templates/all_raports/style.css");

    // $("body").css("overflow", "hidden");
    const raportList = document.querySelector('#raport');
    raportList.innerHTML = '';
        
    const CheckList = document.querySelector('#form-data');
    CheckList.innerHTML='';

    // Defining async function
    async function getapi() {

        let token = getCookieValue('access_token')
        // console.log(token)
        const myHeaders = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+token
        });

        // if (username != undefined){
        //     api_url = api_url+username
        // }

        await fetch(api_url, {
        method: "GET",
        credentials: 'include',
        headers: myHeaders,
        })
        .then(res => res.json())
        .then(data => {

            hideloader();
            console.log('data: '+data);
            show(data);
            addPaginate();
        })
        .catch(err => console.log(err))

        
        
        // const response = await fetch(api_url);
        

    }
    getapi();

 
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

