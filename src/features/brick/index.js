export function addBrick(each){
    const raportInfoGrid = document.createElement('li')

    const raportDataUser = document.createElement('div');
    const detailsDate = document.createElement('p');
    const detailsUser = document.createElement('p');
    const btnL = document.createElement('a')
    const moreButton = document.createElement('button');

    const raportRegions = document.createElement('div');
    const StolarniaBox = document.createElement('div');
    const raportRegionsStolarnia = document.createElement('div');
    const raportCircleStolarnia = document.createElement('p');
    const DrukarniaBox = document.createElement('div');
    const raportRegionsDrukarnia = document.createElement('div');
    const raportCircleDrukarnia = document.createElement('p');
    const BibelotyBox = document.createElement('div');
    const raportRegionsBibeloty = document.createElement('div');
    const raportCircleBibeloty = document.createElement('p');
    raportInfoGrid.classList.add('raport-info-grid')

    raportInfoGrid.addEventListener("mouseover", (e) => {
        if (e.target.firstChild.hasChildNodes())
            if((e.target.firstChild.childNodes.length)>2){
                e.target.firstChild.children[0].classList.add('bold')
                e.target.firstChild.children[1].classList.add('bold')
                if (e.target.firstChild.children[2].hasChildNodes())
                    // console.log(e.target.firstChild.children[2].children[0])
                    e.target.firstChild.children[2].children[0].classList.add('hover-btn')
                    // e.target.style.backgroundColor = 'pink'
            }
    });
    raportInfoGrid.addEventListener("mouseleave", (e) => {
        if (e.target.firstChild.hasChildNodes())
            if((e.target.firstChild.childNodes.length)>2){
                e.target.firstChild.children[0].classList.remove('bold')
                e.target.firstChild.children[1].classList.remove('bold')
                if (e.target.firstChild.children[2].hasChildNodes())
                    // console.log(e.target.firstChild.children[2].children[0])
                    e.target.firstChild.children[2].children[0].classList.remove('hover-btn')
                    // e.target.style.backgroundColor = 'var(--bridge)'
            }
    });
    raportDataUser.classList.add('raport-data-user')
    detailsDate.classList.add('raport-details')
    detailsDate.classList.add('raport-details')
    detailsUser.classList.add('raport-details')

    moreButton.classList.add('raport-btn')

    raportRegions.classList.add('raport-regions')
    StolarniaBox.classList.add('regio-circle-box')
    DrukarniaBox.classList.add('regio-circle-box')
    BibelotyBox.classList.add('regio-circle-box')
    raportRegionsStolarnia.classList.add('regions-headers')
    raportCircleStolarnia.classList.add('raport-circle-empty')
    raportRegionsDrukarnia.classList.add('regions-headers')
    raportCircleDrukarnia.classList.add('raport-circle-empty')
    raportRegionsBibeloty.classList.add('regions-headers')
    raportCircleBibeloty.classList.add('raport-circle-empty')



    detailsDate.innerText = `${each.date_created}`;
    detailsUser.innerText = `${each.author.username.capitalize()}`;
    moreButton.innerText = 'WIĘCEJ';


    btnL.onclick = function(){
        openRaport();
    }

    let stolarnia = 0;
    let drukarnia = 0;
    let bibeloty = 0;

    each.units.forEach(each => {
        if(each.region == 'stolarnia'){
            stolarnia +=1;
        }else if(each.region == 'drukarnia'){
            drukarnia +=1;
        }else{
            bibeloty+=1;
        }
    })

    raportRegionsStolarnia.innerText = 'Stolarnia';
    raportCircleStolarnia.innerText = stolarnia;
    raportRegionsDrukarnia.innerText = 'Drukarnia';
    raportCircleDrukarnia.innerText = drukarnia;
    raportRegionsBibeloty.innerText = 'Bibeloty';
    raportCircleBibeloty.innerText = bibeloty;

    if (stolarnia > 0){
        raportCircleStolarnia.classList.add('full')
    }
    if (drukarnia > 0){
        raportCircleDrukarnia.classList.add('full')
    }
    if (bibeloty > 0){
        raportCircleBibeloty.classList.add('full')
    }


    raportInfoGrid.appendChild(raportDataUser)
    raportDataUser.appendChild(detailsDate)
    raportDataUser.appendChild(detailsUser)
    btnL.appendChild(moreButton)
    raportDataUser.appendChild(btnL)
    raportInfoGrid.appendChild(raportRegions)

    raportRegions.appendChild(StolarniaBox)
        StolarniaBox.appendChild(raportRegionsStolarnia)
        StolarniaBox.appendChild(raportCircleStolarnia)

    raportRegions.appendChild(DrukarniaBox)
        DrukarniaBox.appendChild(raportRegionsDrukarnia)
        DrukarniaBox.appendChild(raportCircleDrukarnia)

    raportRegions.appendChild(BibelotyBox)
        BibelotyBox.appendChild(raportRegionsBibeloty)
        BibelotyBox.appendChild(raportCircleBibeloty)

    return raportInfoGrid;
}

Object.defineProperty(String.prototype, 'capitalize', {
    value: function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
    },
    enumerable: false
});