
import {url} from "../../common/data/url.js"
import {callApiGet, checkAuth} from '../endpoints/endpoints.js'
import {navigateTo} from '../../js/index.js'
import {alerts} from '../alerts/alerts.js'
import {hideloader} from '../loading/loading.js'

export async function deleteRaport(id) {
        console.log(id)
        let api_url = url + "delete/" + id;
        console.log(api_url);
        try {
            let [re, st] = await checkAuth(url + 'auth');
            console.log(re, st)
            if (st == 202 && re.detail == "authenticated" || st == 200 && re.access_token){
                let [response, status] = await callApiGet(api_url);
                if (status == 200) {
                    console.log('usunięto');
                    navigateTo('/');
                    alerts('', response.message, 'alert-green');
                } else {
                    hideloader();``
                    alerts(status, response, 'alert-red');
                }
            }
        } catch (error) {
            hideloader();
            alerts('error', error, 'alert-red');
        }

}