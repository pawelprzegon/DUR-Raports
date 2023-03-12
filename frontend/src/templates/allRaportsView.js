import {url} from "../common/data/url.js"
import {Slider} from '../features/swiper/slider.js'
import {Brick} from '../features/brick/brick.js'
import {callApiGet, tokenRefresh} from '../features/endpoints/index.js'
import {showloader, hideloader} from '../features/loading/loading.js'
import {navigateTo} from "../js/index.js"
import {err} from './error.js'

import AbstractView from "./AbstractView.js";

export default class extends AbstractView{
    constructor(params){
        super(params);

        this.bricks = []
        this.api_url = url+"raports/"

        if (this.params.username){
            this.setTitle("Moje raporty")
            this.api_url = url+"raports/"+this.params.username
        }else{
            this.setTitle("Raporty")
        }
        document.getElementById('theme').setAttribute('href', "/../src/css/allRaports.css");
    }


    async getData(){
        showloader();
        try {
            let [response, status] = await callApiGet(this.api_url);
            if (response.detail && response.detail == "Not authenticated"){
                let refTokenResponse = await tokenRefresh();
                if (refTokenResponse[1] == 200){
                    let [response, status] = await callApiGet(this.api_url);
                    if (status == 200){
                        hideloader();
                        this.show(response);
                        Slider();
                    }else{
                        hideloader();
                        err(status, response)
                    }
                    
                }else{
                    hideloader();
                    navigateTo('/login')
                }
                
            }else{
                hideloader();
                this.show(response);
                Slider();
            }
        }catch (error){
            hideloader();
            err(error)
        }
    }


    show(data) {

        const swiperContent = document.createElement('div')
        swiperContent.classList.add('slide-content')

        const raportList = document.querySelector('#raport');
        raportList.classList.remove('single')
        raportList.innerHTML = '';

        const raportListSwiper = document.createElement('div')
        raportListSwiper.innerHTML=''
        raportListSwiper.classList.add('swiper-wrapper')
        

        data.forEach(each => {

            let raportInfoGrid = new Brick(each)
            let brick = raportInfoGrid.getBrick()
            raportListSwiper.appendChild(brick);
        });

        const next = document.createElement('div')
        next.classList.add('swiper-button-next')
        const prev = document.createElement('div')
        prev.classList.add('swiper-button-prev')
        const paginate = document.createElement('div')
        paginate.classList.add('swiper-pagination')

        
        swiperContent.appendChild(raportListSwiper)
        swiperContent.appendChild(next)
        swiperContent.appendChild(prev)
        swiperContent.appendChild(paginate)
        

        raportList.appendChild(swiperContent)

    }

    
}
