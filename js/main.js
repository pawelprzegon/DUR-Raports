// api url
const api_url = 
      "https://mocki.io/v1/1f2aff46-ef0b-4c2c-9863-1dc3c02a1665";

// import api_url from '../data.json' assert {type: "json"};

  
// Defining async function
async function getapi(url) {
    
    // Storing response
    const response = await fetch(url);
    
    // Storing data in form of JSON
    var data = await response.json();

    
    if (response) {
        hideloader();
    }
        console.log(data);
        show(data);

}
// Calling that async function
getapi(api_url);
  
// Function to hide the loader
function hideloader() {
    document.getElementById('loading').style.display = 'none';
}

// Function to define innerHTML for HTML table
function show(data) {
    const raportList = document.querySelector('#raport');
    raportList.innerHTML = '';

    data.items.forEach(each => {

        const raportInfoGrid = document.createElement('div')

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

                const newLine = document.createElement('br')
            
        raportInfoGrid.classList.add('raport-info-grid')
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
        moreButton.innerText = 'Więcej';
        btnL.setAttribute("href","http://google.com");

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
        raportList.appendChild(raportInfoGrid)
});
}

Object.defineProperty(String.prototype, 'capitalize', {
    value: function() {
      return this.charAt(0).toUpperCase() + this.slice(1);
    },
    enumerable: false
  });