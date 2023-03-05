// import {openRaport} from '../../templates/single_raport/index.js';
import {openRaport} from './openRaport.js'

export class Brick {

    constructor(each){
        this.each = each;
        this.id = each.id;
        this.date = each.date_created;
        this.username = each.author.username;
        this.build();
        // this.brickEvents();

    }

    openRap(){
            console.log(this.id)
            const newView = new openRaport(parseInt(this.id, 10));
            newView.getData();

    }

    build(){
        
        this.raportInfoGrid = document.createElement('div');
        this.raportDataUser = document.createElement('div');
        this.detailsDate = document.createElement('p');
        this.detailsUser = document.createElement('p');
        this.btnL = document.createElement('a');
        this.moreButton = document.createElement('div');
        this.moreButton.onclick = () => {
            let animate = document.getElementById('raport-content')
            animate.classList.add('show-anim')
            this.openRap();
            let nowSelected = document.getElementsByClassName('selected')
            if (nowSelected.length != 0){
                console.log(nowSelected)
                nowSelected[0].classList.remove('selected')
            }
            this.raportInfoGrid.classList.add('selected')
            addEventListener("animationend", (event) => {animate.classList.remove('show-anim')});
            
        }
        // this.moreButton.setAttribute('data-link', '')

        let regions = this.regions(this.each.units);

        this.raportInfoGrid.classList.add('card', 'swiper-slide');
        this.raportDataUser.classList.add('raport-data-user');
        this.detailsDate.classList.add('raport-details');
        this.detailsDate.classList.add('raport-details');
        this.detailsUser.classList.add('raport-details');
        this.moreButton.classList.add('arrow');

        
        this.detailsDate.innerText = this.date; 
        this.detailsUser.innerText =  this.username.capitalize(); 

        this.raportInfoGrid.appendChild(this.raportDataUser)
        this.raportDataUser.appendChild(this.detailsDate)
        this.raportDataUser.appendChild(this.detailsUser)
        this.btnL.appendChild(this.moreButton)
        this.raportDataUser.appendChild(this.btnL)
        this.raportInfoGrid.appendChild(regions)
    
        
    
        
    }
    regions(units){

        this.raportRegions = document.createElement('div');
        this.raportRegions.classList.add('raport-regions');

        let numbers = this.count(units);
        for (const [key, value] of Object.entries(numbers)){

            this.unitBox = document.createElement('div');
            this.raportRegionsUnit = document.createElement('div');
            this.raportCircleUnit = document.createElement('p');

            this.unitBox.classList.add('regio-circle-box');
            this.raportRegionsUnit.classList.add('regions-headers');
            this.raportCircleUnit.classList.add('raport-circle-empty');

            this.raportRegions.appendChild(this.unitBox)
            this.unitBox.appendChild(this.raportRegionsUnit)
            this.unitBox.appendChild(this.raportCircleUnit)

            this.raportRegionsUnit.innerText = key.capitalize();
            this.raportCircleUnit.innerText = value;

            if (value > 0){
                this.raportCircleUnit.classList.add('full')
            }

        }

        return this.raportRegions
    }

    count(units){
        let result = [];
        units.forEach(each => {
            result[each.region] = (result[each.region]+1) || 1 ;
        })
        return result;
    }
    

    getBrick(){
        return this.raportInfoGrid;
    }

}


Object.defineProperty(String.prototype, 'capitalize', {
    value: function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
    },
    enumerable: false
});