import {url} from "../../common/data/url.js"
import {getCookieValue} from '../cookie/index.js'
import {logout} from "../../features/logout/logout.js"
import {hideloader} from "../loading/loading.js"
import {alerts} from '../../features/alerts/alerts.js'

export async function callApiGet(api_url){
    // prepare headers
    let token = getCookieValue('access_token')
    const myHeaders = new Headers({
        'accept': 'application/json',
        'Authorization': 'Bearer '+token
    });

    try {
        let resp = await fetch(api_url, {
            method: "GET",
            credentials: 'include',
            headers: myHeaders,
            })
        return [await resp.json(), resp.status];
    } catch (error) {
        console.log('error: '+error)
        hideloader();
        return ['error', error];
    }
}

export async function callApiPost(api_url, formData, reset_token){
    // prepare headers
    let token = getCookieValue('access_token')
    let address = lastWord(api_url)
    let myHeaders = new Headers()
    switch (address){
        case "login":
            myHeaders = {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+token, 
            };
            break;
        case "register":
        case "reset_password_link":
            myHeaders = {
                'Content-Type': 'application/json',
            };
            break;
        default: 
            console.log('deault')
            myHeaders = {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+reset_token,
            };
    }   
    
    try {
        let resp = await fetch(api_url, {
            method: "POST",
            credentials: 'include',
            headers: myHeaders,
            body: formData,
            })
        return [await resp.json(), resp.status];
    } catch (error) {
        hideloader();
        return ['error', error];
    }

}




export async function tokenRefresh(){
    let ref_token = getCookieValue('refresh_token')
    const myHeaders = new Headers({
        'accept': 'application/json',
        'Authorization': 'Bearer '+ref_token
    });

    try {
        let resp = await fetch(url+'refresh_token', {
        method: "GET",
        credentials: 'include',
        headers: myHeaders,
        })
        .then(res => {
            console.log('Fetch - Got response: ', res);
            return res;
        })
        .then(res => 
            res.json().then(data => ({
            status: res.status,
            data
            })
        ))
        .then(({ status, data }) => {
            console.log({ status, data })
            if (status == 200 && !('status_code' in data)){
                let now = new Date();
                now.setTime(Date.parse(data.token_expire));
                document.cookie='access_token='+data.access_token+
                ';expires='+now+';SameSite=lex';
            } 
            return [data, status];
        })
        .catch(err => {
            hideloader();
            return ['err', err]
        });
        return resp;

    } catch (error) {
        hideloader();
        return ['error', error];
    }
}


export async function callApiPut(api_url, formData){
    let token = getCookieValue('access_token')
    const myHeaders = new Headers({
        'accept': 'application/json',
        'Authorization': 'Bearer '+token
    });
    try{
        let resp = await fetch(api_url, {
            method: "PUT",
            credentials: 'include',
            headers: myHeaders,
            body: formData,
        })
        return [await resp.json(), resp.status];
    }catch(error){
        hideloader();
        return ['error', error];
    }
}


export async function checkAuth(api_url){
    // prepare headers
    let token = getCookieValue('access_token')
    let myHeaders = new Headers()
    myHeaders = {
        'accept': 'application/json',
        'Authorization': 'Bearer '+token, 
    };
    try {
        let resp = await fetch(api_url, {
            method: "GET",
            credentials: 'include',
            headers: myHeaders,
           })
           .then(res => 
                res.json().then(data => ({
                status: res.status,
                data
                })
            ))
            .then(async ({ status, data }) => {
                if (data.detail && data.detail == "Not authenticated" || data.detail && data.detail == "Token expired"){
                    let [tRdata, tRstatus] = await tokenRefresh();
                    console.log('tokenRefresh result: ')
                    console.log(tRdata, tRstatus)
                    if (tRstatus == 200){
                        return [tRdata, tRstatus];
                    }else{
                        // alerts(tRstatus, tRdata.message, 'alert-orange')
                        logout();
                        return [tRdata, tRstatus];
                    }
                }else{
                    return [data, status];
                }
            }) 
            return resp;
    } catch (error) {
        hideloader();
        return ['error', error];
    }
}

export async function callApiDelete(api_url){
    // prepare headers
    let token = getCookieValue('access_token')
    const myHeaders = new Headers({
        'accept': 'application/json',
        'Authorization': 'Bearer '+token
    });

    try {
        let resp = await fetch(api_url, {
            method: "DELETE",
            credentials: 'include',
            headers: myHeaders,
            })
        return [await resp.json(), resp.status];
    } catch (error) {
        console.log('error: '+error)
        hideloader();
        return ['error', error];
    }
}

export async function checkAuthResetPassword(api_url, token){
    // prepare headers
    let myHeaders = new Headers()
    myHeaders = {
        'accept': 'application/json',
        'Authorization': 'Bearer '+token, 
    };
    try {
        let resp = await fetch(api_url, {
            method: "GET",
            credentials: 'include',
            headers: myHeaders,
           })
           .then(res => 
                res.json().then(data => ({
                status: res.status,
                data
                })
            ))
            .then(async ({ status, data }) => {
                return [data, status];
            }) 
            return resp;
    } catch (error) {
        return ['error', error];
    }
}


function lastWord(words) {
    let n = words.split(/[/]+/);
    return n[n.length - 1];
  }