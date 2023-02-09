// api url
const api_url = 
      "https://mocki.io/v1/561b989e-58c0-48dd-a631-3bb55958b69d";

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


function show(data) {
    const raportList = document.querySelector('#raport');
    raportList.innerHTML = '';
    // DEKLARACJE
        const Dekl = document.createElement('div')

            const DeklHeader = document.createElement('div');
                const DeklInfo = document.createElement('p');

            const DeklText = document.createElement('div');
                const Pawel = document.createElement('div');
                    const namePawel = document.createElement('p');
                    const todoPawel = document.createElement('p');
                const Adam = document.createElement('div');
                    const nameAdam = document.createElement('p');
                    const todoAdam = document.createElement('p');
                const Bartek = document.createElement('div');
                    const nameBartek = document.createElement('p');
                    const todoBartek = document.createElement('p');

        Dekl.classList.add('raport-info-grid')
        DeklHeader.classList.add('raport-data-user', 'header')
        DeklText.classList.add('raport-text')
        Pawel.classList.add('raport-text', 'one')
        Bartek.classList.add('raport-text', 'one')
        Adam.classList.add('raport-text', 'one')
        
        
        namePawel.classList.add('header')
        nameAdam.classList.add('header')
        nameBartek.classList.add('header')

        DeklHeader.appendChild(DeklInfo)
        Pawel.appendChild(namePawel)
        Pawel.appendChild(todoPawel)
        DeklText.appendChild(Pawel)
        Adam.appendChild(nameAdam)
        Adam.appendChild(todoAdam)
        DeklText.appendChild(Adam)
        Bartek.appendChild(nameBartek)
        Bartek.appendChild(todoBartek)
        DeklText.appendChild(Bartek)
        Dekl.appendChild(DeklHeader)
        Dekl.appendChild(DeklText)
        
        raportList.appendChild(Dekl)

        if (data.dekl){
            DeklInfo.innerText = "Deklaracje";
            namePawel.innerText = 'Paweł';
            todoPawel.innerText = `${data.dekl[0].dekl}`;
            nameBartek.innerText = 'Bartek'
            todoBartek.innerText = `${data.dekl[1].dekl}`;
            nameAdam.innerText = 'Adam'
            todoAdam.innerText = `${data.dekl[2].dekl}`;
        }  

    // URZĄDZENIA
        let urzadzenia = {}

        data.units.forEach(each => {
            if (!(each.region in urzadzenia)){
                urzadzenia[each.region] =[]
                urzadzenia[each.region].push([each.unit, each.info]);
            }else{
                urzadzenia[each.region].push([each.unit, each.info]);
            }
        })
        // console.log(urzadzenia)

        for (const [key, value] of Object.entries(urzadzenia)) {
            console.log(key, value);

          
                const Region = document.createElement('div')

                const RegionHeader = document.createElement('div');
                    const RegionInfo = document.createElement('p');
                    RegionInfo.classList.add('header')
                    RegionHeader.appendChild(RegionInfo);
                const RegionTextHeader = document.createElement('div');

                    value.forEach(each =>{
                        const RegionUnit = document.createElement('p');
                        RegionUnit.innerText = `${each[0]}`;
                        RegionHeader.appendChild(RegionUnit);

                        const RegionText = document.createElement('p');
                        RegionText.innerText = `${each[1]}`;
                        RegionText.classList.add('tresc-raportu')
                        RegionTextHeader.appendChild(RegionText);
                    })
                    
                    // const RegionUnit = document.createElement('p');
                
                
                    
                        
                Region.classList.add('raport-info-grid')
                RegionHeader.classList.add('raport-data-user')
                RegionTextHeader.classList.add('raport-text', 'one')
                
                RegionInfo.innerText = (`${key}`).capitalize();

                Region.appendChild(RegionHeader);
                Region.appendChild(RegionTextHeader);
                raportList.appendChild(Region)
            }

    // PLEXI
        

        if ((data.plexi).length > 0){

            const Plexi = document.createElement('div')

            const PlexiHeader = document.createElement('div');
                const PlexiInfo = document.createElement('p');
                PlexiInfo.classList.add('header')
            const PlexiTextHeader = document.createElement('div');
                const PlexiText = document.createElement('p');

            Plexi.classList.add('raport-info-grid')
            PlexiHeader.classList.add('raport-data-user')
            PlexiTextHeader.classList.add('raport-text', 'one')
            data.plexi.forEach(each => {
                PlexiInfo.innerText = (`${Object.keys(each)}`).capitalize();
                PlexiText.innerText = (`${each['plexi']}`)
            })
            PlexiHeader.appendChild(PlexiInfo)
            PlexiTextHeader.appendChild(PlexiText)
            Plexi.appendChild(PlexiHeader)
            Plexi.appendChild(PlexiTextHeader)
            raportList.appendChild(Plexi)
        }

    let conts = document.querySelectorAll(".tresc-raportu");
    conts.forEach(item => {
    let txt = item.innerHTML;
    let chunk = txt.substr(0, txt.indexOf(":"));
    txt = txt.replace(chunk, "<b>" + chunk + "</b>");
    item.innerHTML = txt;
    });
}

Object.defineProperty(String.prototype, 'capitalize', {
    value: function() {
      return this.charAt(0).toUpperCase() + this.slice(1);
    },
    enumerable: false
  });

