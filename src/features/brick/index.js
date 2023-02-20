import {openRaport} from '../../templates/single_raport/index.js';

export class Brick {

    constructor(each){
        this.each = each;
        this.id = each.id;
        this.date = each.date_created;
        this.username = each.author.username;
        
        this.build();
        this.brickEvents();

    }
    build(){
        this.raportInfoGrid = document.createElement('li');
        this.raportDataUser = document.createElement('div');
        this.detailsDate = document.createElement('p');
        this.detailsUser = document.createElement('p');
        this.btnL = document.createElement('a');
        this.moreButton = document.createElement('button');

        let regions = this.regions(this.each.units);

        this.raportInfoGrid.classList.add('raport-info-grid');
        this.raportDataUser.classList.add('raport-data-user');
        this.detailsDate.classList.add('raport-details');
        this.detailsDate.classList.add('raport-details');
        this.detailsUser.classList.add('raport-details');
        this.moreButton.classList.add('raport-btn');

        
        this.detailsDate.innerText = this.date; //`${each.date_created}`;
        this.detailsUser.innerText =  this.username.capitalize(); //`${each.author.username.capitalize()}`;
        this.moreButton.innerText = 'WIĘCEJ';

        
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
    

    

    brickEvents(){
        let test = parseInt(this.id, 10)
        this.btnL.onclick = function(){
            openRaport(test);
        }
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