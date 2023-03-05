import {url} from "../common/data/index.js"
import {Slider} from '../features/swiper/slider.js'
import {Brick} from '../features/brick/index.js'
import {callApiGet, tokenRefresh} from '../features/endpoints/index.js'
import {hideloader} from '../features/loading/loading.js'
import {navigateTo} from "../js/index.js"

import AbstractView from "./AbstractView.js";

export default class extends AbstractView{
    constructor(params){
        super(params);

        this.bricks = []
        window.scrollTo(0,0);
        $("body").css("overflow", "hidden");
        
        this.api_url = url+"raports/"
        if (this.params.username){
            this.setTitle("Moje raporty")
            this.api_url = url+"raports/"+this.params.username
        }else{
            this.setTitle("Raporty")
        }
        this.prepare();
    }

    prepare(){
        const FormData = document.querySelector('#form-data');
        FormData.innerHTML = '';

        let theme = document.getElementById('theme')
        theme.setAttribute('href', "/../src/css/allRaports.css");
        
        document.getElementById('loading').style.visibility = 'visible';
    }

    async getData(){

        try {
            let [response, status] = await callApiGet(this.api_url);
            if (response.detail && response.detail == "Not authenticated"){
                console.log('refreshing token')
                let refTokenResponse = await tokenRefresh();
                console.log(refTokenResponse)
                if (refTokenResponse[1] == 200){
                    let [response, status] = await callApiGet(this.api_url);
                    if (status == 200){
                        this.show(response);
                        Slider();
                    }else{
                        document.getElementById('err').innerHTML = `
                        <h1>${status}</h1>
                        <p>${response}</p>
                        `
                    }
                    
                }else{
                    hideloader();
                    navigateTo('/login')
                }
                
            }else{
                hideloader();
                console.log(response)
                this.show(response);
                Slider();
            }
        }catch (error){
            hideloader();
            console.log(error)
            navigateTo('/login')
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
