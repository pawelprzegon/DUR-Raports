import {openRaport} from '../../../js/raport.js';

export class Brick {
    constructor(each){
        this.each = each;
        this.date = each.date_created;
        this.username = each.author.username;
        
        this.build();
        this.brickEvents();
        this.circles();

    }
    build(){
        this.raportInfoGrid = document.createElement('li');
        this.raportDataUser = document.createElement('div');
        this.detailsDate = document.createElement('p');
        this.detailsUser = document.createElement('p');
        this.btnL = document.createElement('a');
        this.moreButton = document.createElement('button');
    
        this.raportRegions = document.createElement('div');
        this.StolarniaBox = document.createElement('div');
        this.raportRegionsStolarnia = document.createElement('div');
        this.raportCircleStolarnia = document.createElement('p');
        this.DrukarniaBox = document.createElement('div');
        this.raportRegionsDrukarnia = document.createElement('div');
        this.raportCircleDrukarnia = document.createElement('p');
        this.BibelotyBox = document.createElement('div');
        this.raportRegionsBibeloty = document.createElement('div');
        this.raportCircleBibeloty = document.createElement('p');


        this.raportInfoGrid.classList.add('raport-info-grid');
        this.raportDataUser.classList.add('raport-data-user');
        this.detailsDate.classList.add('raport-details');
        this.detailsDate.classList.add('raport-details');
        this.detailsUser.classList.add('raport-details');
        this.moreButton.classList.add('raport-btn');
        this.raportRegions.classList.add('raport-regions');
        this.StolarniaBox.classList.add('regio-circle-box');
        this.DrukarniaBox.classList.add('regio-circle-box');
        this.BibelotyBox.classList.add('regio-circle-box');
        this.raportRegionsStolarnia.classList.add('regions-headers');
        this.raportCircleStolarnia.classList.add('raport-circle-empty');
        this.raportRegionsDrukarnia.classList.add('regions-headers');
        this.raportCircleDrukarnia.classList.add('raport-circle-empty');
        this.raportRegionsBibeloty.classList.add('regions-headers');
        this.raportCircleBibeloty.classList.add('raport-circle-empty');

        this.detailsDate.innerText = this.date; //`${each.date_created}`;
        this.detailsUser.innerText =  this.username.capitalize(); //`${each.author.username.capitalize()}`;
        this.moreButton.innerText = 'WIĘCEJ';

        
        this.raportInfoGrid.appendChild(this.raportDataUser)
        this.raportDataUser.appendChild(this.detailsDate)
        this.raportDataUser.appendChild(this.detailsUser)
        this.btnL.appendChild(this.moreButton)
        this.raportDataUser.appendChild(this.btnL)
        this.raportInfoGrid.appendChild(this.raportRegions)
    
        this.raportRegions.appendChild(this.StolarniaBox)
        this.StolarniaBox.appendChild(this.raportRegionsStolarnia)
        this.StolarniaBox.appendChild(this.raportCircleStolarnia)
    
        this.raportRegions.appendChild(this.DrukarniaBox)
        this.DrukarniaBox.appendChild(this.raportRegionsDrukarnia)
        this.DrukarniaBox.appendChild(this.raportCircleDrukarnia)
    
        this.raportRegions.appendChild(this.BibelotyBox)
        this.BibelotyBox.appendChild(this.raportRegionsBibeloty)
        this.BibelotyBox.appendChild(this.raportCircleBibeloty)
    
        
    }



    brickEvents(){

        this.btnL.onclick = function(){
            openRaport();
        }
        this.raportInfoGrid.addEventListener("mouseover", (e) => {
            if (e.target.firstChild.hasChildNodes())
                if((e.target.firstChild.childNodes.length)>2){
                    e.target.firstChild.children[0].classList.add('bold')
                    e.target.firstChild.children[1].classList.add('bold')
                    if (e.target.firstChild.children[2].hasChildNodes())
                        e.target.firstChild.children[2].children[0].classList.add('hover-btn')
                }
        });
        this.raportInfoGrid.addEventListener("mouseleave", (e) => {
            if (e.target.firstChild.hasChildNodes())
                if((e.target.firstChild.childNodes.length)>2){
                    e.target.firstChild.children[0].classList.remove('bold')
                    e.target.firstChild.children[1].classList.remove('bold')
                    if (e.target.firstChild.children[2].hasChildNodes())
                        e.target.firstChild.children[2].children[0].classList.remove('hover-btn')
                }
        });
    }


    circles(){
        let stolarnia = 0;
        let drukarnia = 0;
        let bibeloty = 0;
    
        this.each.units.forEach(each => {
            if(each.region == 'stolarnia'){
                stolarnia +=1;
            }else if(each.region == 'drukarnia'){
                drukarnia +=1;
            }else{
                bibeloty+=1;
            }
        })
    
        this.raportRegionsStolarnia.innerText = 'Stolarnia';
        this.raportCircleStolarnia.innerText = stolarnia;
        this.raportRegionsDrukarnia.innerText = 'Drukarnia';
        this.raportCircleDrukarnia.innerText = drukarnia;
        this.raportRegionsBibeloty.innerText = 'Bibeloty';
        this.raportCircleBibeloty.innerText = bibeloty;
    
        if (stolarnia > 0){
            this.raportCircleStolarnia.classList.add('full')
        }
        if (drukarnia > 0){
            this.raportCircleDrukarnia.classList.add('full')
        }
        if (bibeloty > 0){
            this.raportCircleBibeloty.classList.add('full')
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