import {url} from "../common/data/url.js"
import {Slider} from '../features/swiper/slider.js'
import {Brick} from '../features/brick/brick.js'
import {callApiGet, checkAuth} from '../features/endpoints/endpoints.js'
import {showloader, hideloader} from '../features/loading/loading.js'
import {alerts} from '../features/alerts/alerts.js'

import AbstractView from "./AbstractView.js";

export default class extends AbstractView{
    constructor(params){
        super(params);
    }

    css(){
        document.getElementById('theme').setAttribute('href', "/../src/css/allRaports.css");
    }


    async getData(){
        
        showloader();
        this.bricks = []
        this.api_url = url+"raports/"

        if (this.params.username){
            this.setTitle("Moje raporty")
            this.api_url = url+"raports/"+this.params.username
        }else{
            this.setTitle("Raporty")
        }
        
        try {
            let [re, st] = await checkAuth(url+'auth');
            if (st == 202 && re.detail == "authenticated" || st == 200 && re.access_token){
                let [response, status] = await callApiGet(this.api_url);
                if (status == 200){
                    hideloader();
                    this.show(response);
                    Slider();
                }else{
                    hideloader();
                    alerts(status, response, 'alert-orange')
                }
            }
        }catch (error){
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
