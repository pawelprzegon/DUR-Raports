import {url} from "../../common/data/index.js"
import {navUserBehav} from '../../common/navigation/index.js'
import {callApi} from '../../features/endpoints/index.js'
import {hideloader} from '../../features/loading/loading.js'

import AbstractView from "../AbstractView.js";

export default class extends AbstractView{
    constructor(params){
        super(params);
        this.setTitle("Raport: "+params.id)
    }

    async getData(){
        console.log(this.params.id)

        document.getElementById('loading').style.visibility = 'visible';

        let theme = document.getElementById('theme')
        theme.setAttribute('href', "/src/templates/single_raport/raport.css");
        let paginateTheme = document.getElementById('paginate-theme')
        paginateTheme.setAttribute('href', "./src/common/paginate/paginate.css");
        
        const raportList = document.querySelector('#raport');
            raportList.innerHTML = '';
        $("body").css("overflow", "initial");


            let [response, status] = await callApi(url+"raport/"+this.params.id);
            console.log(response)
            console.log(status)
            if (status == 200){
                hideloader();
                navUserBehav(response.author.username);
                this.show(response);
            }else{
                hideloader();
                navUserBehav();
                document.getElementById('err').innerText = status +' Raport '+'id '+response.detail
            }
        

    }

    show(data) {
        console.log(data)
        const raportList = document.querySelector('#raport');
        raportList.classList.add('single')
        raportList.innerHTML = '';
        // USER
        const User = document.createElement('div')
            const userInfo = document.createElement('span');
            User.classList.add('user-label')
            userInfo.innerText = (data.author.username).capitalize()
            User.appendChild(userInfo)
            raportList.appendChild(User)
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

        Dekl.classList.add('single-raport-info-grid')
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

        if ((data.dekl).length>0){
            DeklInfo.innerText = "Deklaracje";
            namePawel.innerText = 'Paweł';
            todoPawel.innerText = `${data.dekl[0].dekl}`;
            nameBartek.innerText = 'Bartek'
            todoBartek.innerText = `${data.dekl[1].dekl}`;
            nameAdam.innerText = 'Adam'
            todoAdam.innerText = `${data.dekl[2].dekl}`;
        }  

        // URZĄDZENIA
        function capitalized(word) {
            const capitalized = word.charAt(0).toUpperCase()
            + word.slice(1)
            return capitalized
        }

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
                })
                console.log(value)
                const RegionText = document.createElement('p');
                RegionText.innerText = `${value[0][1]}`;
                RegionText.classList.add('tresc-raportu')
                RegionTextHeader.appendChild(RegionText);
                
                // const RegionUnit = document.createElement('p');
            
            
                
                    
            Region.classList.add('single-raport-info-grid')
            RegionHeader.classList.add('raport-data-user')
            RegionTextHeader.classList.add('raport-text', 'one')
            RegionInfo.innerText = capitalized(`${key}`)
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

            Plexi.classList.add('single-raport-info-grid')
            PlexiHeader.classList.add('raport-data-user')
            PlexiTextHeader.classList.add('raport-text', 'one')
            data.plexi.forEach(each => {
                PlexiInfo.innerText = capitalized(`${Object.keys(each)}`)
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
    
}
