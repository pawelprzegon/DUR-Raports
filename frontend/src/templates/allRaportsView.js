import {url} from "../common/data/url.js"
import {Slider} from '../features/swiper/slider.js'
import {Brick} from '../features/brick/brick.js'
import {callApiGet, checkAuth} from '../features/endpoints/endpoints.js'
import {showloader, hideloader} from '../features/loading/loading.js'
import {alerts} from '../features/alerts/alerts.js'
import {getCookieValue} from '../features/cookie/index.js'
import AbstractView from "./AbstractView.js";
import {openRaport} from '../features/brick/openRaport.js'

export default class extends AbstractView{
    constructor(params){
        super(params);
        this.params = params
        const username = getCookieValue('user')
        if ('user' in this.params){
            this.setTitle("Moje raporty")
            this.api_url = url+"raports/"+ username

        }else if ('id' in this.params){
            this.setTitle("Raport: " + this.params.id)
            this.api_url = url+"raports/"
        }else{
            this.setTitle("Raporty")
            this.api_url = url+"raports/"
        }
        this.bricks = []
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
                    Slider(this.params.id);

                }else{
                    clearTimeout(loader);
                    hideloader();
                    alerts(status, response, 'alert-orange')
                }
            }
        }catch (error){
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

        if ('id' in this.params){
            const showRaport = new openRaport(parseInt(this.params.id, 10));
            
            let animate = document.getElementById('content')
            animate.classList.add('show-anim')

            showRaport.getData();
            let nowSelected = document.getElementsByClassName('selected')

            if (nowSelected.length != 0){
                nowSelected[0].classList.remove('selected')
                
            }
            document.getElementById(this.params.id).classList.add('selected')
            addEventListener("animationend", () => {animate.classList.remove('show-anim')});
        }
    }
}
