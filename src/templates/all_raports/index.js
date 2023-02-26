import {url} from "../../common/data/index.js"
import {addPaginate} from '../../common/paginate/index.js'
import {Brick} from '../../features/brick/index.js'
import {getCookieValue} from '../../features/cookie/index.js'
import {navBar, navBehav} from '../../common/navigation/index.js'
import {callApi, tokenRefresh} from '../../features/endpoints/index.js'

window.onload=async function(){
    let auth = getCookieValue('access_token')
    console.log(auth)
    if (auth){
        let user = getCookieValue('user')
        navBar(user);
        navBehav();
        raports();
    }else{
        location.href = '/src/templates/error/404.html';
    }
    
}   

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
        let [response, status] = await callApi(api_url);
        console.log(response)
        console.log(status)

        if (response.detail && response.detail == "Not authenticated"){
            console.log('refreshing token')
            let refTokenResponse = tokenRefresh();
            console.log(refTokenResponse)
            console.log(username)
            if (username){
                raports(username);
            }else{
                raports();
            }
            
        }else{
            hideloader();
            console.log('data: '+response);
            show(response);
            addPaginate();
        }

        // let token = getCookieValue('access_token')
        // console.log(token)
        // const myHeaders = new Headers({
        //     'accept': 'application/json',
        //     'Authorization': 'Bearer '+token
        // });



        // let resp = await fetch(api_url, {
        // method: "GET",
        // credentials: 'include',
        // headers: myHeaders,
        // })
        // .then(res => res.json())
        // .then(async data =>{
        //     console.log(data)
        //     if (data.detail && data.detail == "Not authenticated"){
        //         console.log('refreshing token')
        //         tokenRefresh();
        //         console.log(username)
        //         if (username){
        //             raports(username);
        //         }else{
        //             raports();
        //         }
                

        //     }else{
        //         hideloader();
        //         console.log('data: '+data);
        //         show(data);
        //         addPaginate();
        //     }
            
        // })
        // .catch(err => console.log(err))

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

