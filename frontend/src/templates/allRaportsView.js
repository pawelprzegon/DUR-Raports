import {url} from "../common/data/url.js"
import {Slider} from '../features/swiper/slider.js'
import {Brick} from '../features/brick/brick.js'
import {callApiGet, checkAuth} from '../features/endpoints/endpoints.js'
import {showloader, hideloader} from '../features/loading/loading.js'
import {alerts} from '../features/alerts/alerts.js'
import {getCookieValue} from '../features/cookie/index.js'

import AbstractView from "./AbstractView.js";

export default class extends AbstractView{
    constructor(){
        super();

        const username = getCookieValue('user')
        this.lastPart = (window.location.href).split("/").pop();

        if (this.lastPart == 'my'){
            this.setTitle("Moje raporty")
            this.api_url = url+"raports/"+ username
        }else{
            this.setTitle("Raporty")
        }
        this.bricks = []
        this.api_url = url+"raports/"
    }

    css(){
        document.getElementById('theme').setAttribute('href', "/../src/css/allRaports.css");
    }


    async getData(){
        
        try {
            let [re, st] = await checkAuth(url+'auth');
            if (st == 202 && re.detail == "authenticated" || st == 200 && re.access_token){
                const loader = showloader();
                let [response, status] = await callApiGet(this.api_url);
                if (status == 200){
                    clearTimeout(loader);
                    hideloader();
                    this.show(response);
                    Slider();
                }else{
                    clearTimeout(loader);
                    hideloader();
                    alerts(status, response, 'alert-orange')
                }
            }
        }catch (error){
            clearTimeout(loader);
            hideloader();
            alerts('error', error, 'alert-red')
            
        }
    }


    show(data) {
        this.css();
        let container = document.querySelector('#cont')
        container.innerHTML = ''
        let content = document.createElement('div')
        content.classList.add('content')
        content.id = 'content'
        let slideConteiner = document.createElement('div');
        slideConteiner.classList.add('slide-container', 'swiper')
        let swiperContent = document.createElement('div')
        swiperContent.classList.add('slide-content')
        let raportListSwiper = document.createElement('div')
        raportListSwiper.classList.add('swiper-wrapper')
        
        data.forEach(each => {
            let raportInfoGrid = new Brick(each)
            let brick = raportInfoGrid.getBrick()
            raportListSwiper.appendChild(brick);
        });

        let next = document.createElement('div')
        next.classList.add('swiper-button-next')
        let prev = document.createElement('div')
        prev.classList.add('swiper-button-prev')
        let paginate = document.createElement('div')
        paginate.classList.add('swiper-pagination')

        swiperContent.appendChild(raportListSwiper)
        swiperContent.appendChild(next)
        swiperContent.appendChild(prev)
        swiperContent.appendChild(paginate)
        slideConteiner.appendChild(swiperContent)
        container.appendChild(content)
        container.appendChild(slideConteiner)

    }

    
}
