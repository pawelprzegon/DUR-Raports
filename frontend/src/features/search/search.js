
import {url} from "../../common/data/url.js"
import {callApiGet, checkAuth} from '../endpoints/endpoints.js'
import {alerts} from '../alerts/alerts.js'
import {hideloader} from '../loading/loading.js'

export async function search(searching) {
        console.log(searching)
        let api_url = url + "search/" + searching;
        console.log(api_url);
        try {
            let [re, st] = await checkAuth(url + 'auth');
            console.log(re, st)
            if (st == 202 && re.detail == "authenticated") {
                let [response, status] = await callApiGet(api_url);
                if (status == 200) {
                    console.log(status, response);
                } else {
                    hideloader();
                    alerts(status, response, 'alert-red');
                }
            }
        } catch (error) {
            hideloader();
            alerts('error', error, 'alert-red');
        }

}