import {url} from "../../common/data/index.js"
import {getCookieValue} from '../../features/cookie/index.js'

export async function callApiGet(api_url){
    // prepare headers
    let token = getCookieValue('access_token')
    // console.log(token)
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
        return error;
    }

}

export async function callApiPost(api_url, formData){
    // prepare headers
    let token = getCookieValue('access_token')
    // console.log(token)
    const myHeaders = new Headers({
        'accept': 'application/json',
        'Authorization': 'Bearer '+token
    });

    try {
        let resp = await fetch(api_url, {
            method: "POST",
            credentials: 'include',
            headers: myHeaders,
            body: formData,
            })
        return [await resp.json(), resp.status];
    } catch (error) {
        return error;
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
            // console.log('Fetch - Got response: ', res);
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
                var now = new Date();
                now.setTime(Date.parse(data.token_expire));
                document.cookie='access_token='+data.access_token+
                ';expires='+now+';SameSite=lex';
            } 
            return [data, status];
        })
        .catch(err => console.log(err));

        return resp;

    } catch (error) {
        console.log(error)
        return error;
    }
}


export async function callApiPut(api_url, data){
    try{
        let resp = await fetch(api_url, {
            method: "PUT",
            headers: {"content-type" : "application/json"},
            body: data,
        })
        return [await resp.json(), resp.status];
    }catch(error){
        console.log(error)
        return error
    }
}
