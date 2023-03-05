import {url} from "../../common/data/index.js"
import {navUserBehav} from '../../common/navigation/index.js'
import {callApiGet} from '../endpoints/index.js'
import {hideloader} from '../loading/loading.js'
import { navigateTo } from "../../js/index.js"

export class openRaport{

    constructor(id){
        this.id = id;
        this.content = document.querySelector('#content');
        this.user = document.querySelector('#user')
        this.user.innerHTML = ''
        this.raportContent = document.querySelector('#raport-content')
        this.deklContent = document.querySelector('#dekl');
        this.deklContent.innerHTML = '';
        this.issuesContent = document.querySelector('#issues');
        this.issuesContent.innerHTML = '';

    }

    async getData(){
        console.log(this.id)
        try{
            let [response, status] = await callApiGet(url+"raport/"+this.id);
            if (response.detail && response.detail == "Not authenticated"){
                console.log('refreshing token')
                let refTokenResponse = await tokenRefresh();
                console.log(refTokenResponse)
                if (refTokenResponse[1] == 200){
                    let [response, status] = await callApiGet(url+"raport/"+this.id);
                    if (status == 200){
                        hideloader();
                        navUserBehav(response.author.username, this.id);
                        this.buildStructure(response);  
                        localStorage.setItem('active_raport', JSON.stringify(response))
                    }else{
                        hideloader();
                        document.getElementById('err').innerHTML = `
                        <h1>${status}</h1>
                        <p>${response}</p>
                        `
                    }
                }else{
                    navigateTo('/login')
                }   
            }else{
                hideloader();
                console.log(this.id)
                console.log(response.author.username)
                navUserBehav(response.author.username, this.id);
                this.buildStructure(response);
                localStorage.setItem('active_raport', JSON.stringify(response))
            }
        }catch(error){
            console.log(error)
            navigateTo('/') 
        }
    }

    buildStructure(data){

        // USER
        const User = document.createElement('div')
            const userInfo = document.createElement('span');
            User.classList.add('user-label')
            userInfo.innerText = (data.author.username).capitalize()
            User.appendChild(userInfo)
            this.user.appendChild(User)
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
        DeklHeader.classList.add('raport-label', 'header')
        DeklText.classList.add('raport-text')
        Pawel.classList.add('raport-text', 'one')
        Bartek.classList.add('raport-text', 'one')
        Adam.classList.add('raport-text', 'one')
        
        
        namePawel.classList.add('header', 'tresc-raportu')
        nameAdam.classList.add('header', 'tresc-raportu')
        nameBartek.classList.add('header', 'tresc-raportu')
        todoPawel.classList.add('tresc-raportu')
        todoAdam.classList.add('tresc-raportu')
        todoBartek.classList.add('tresc-raportu')

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
        
        this.deklContent.appendChild(Dekl)

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

                const RegionText = document.createElement('p');
                RegionText.innerText = `${value[0][1]}`;
                RegionText.classList.add('tresc-raportu')
                RegionTextHeader.appendChild(RegionText);
                
                // const RegionUnit = document.createElement('p');
            
            
                
                    
            Region.classList.add('single-raport-info-grid')
            RegionHeader.classList.add('raport-label')
            RegionTextHeader.classList.add('raport-text', 'one')
            RegionInfo.innerText = capitalized(`${key}`)
            Region.appendChild(RegionHeader);
            Region.appendChild(RegionTextHeader);
            this.issuesContent.appendChild(Region)
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
            PlexiHeader.classList.add('raport-label')
            PlexiTextHeader.classList.add('raport-text', 'one')
            PlexiText.classList.add('tresc-raportu')
            data.plexi.forEach(each => {
                PlexiInfo.innerText = capitalized(`${Object.keys(each)}`)
                PlexiText.innerText = (`${each['plexi']}`)
            })
            PlexiHeader.appendChild(PlexiInfo)
            PlexiTextHeader.appendChild(PlexiText)
            Plexi.appendChild(PlexiHeader)
            Plexi.appendChild(PlexiTextHeader)
            this.issuesContent.appendChild(Plexi)

            this.raportContent.appendChild(this.deklContent)
            this.raportContent.appendChild(this.issuesContent)
            this.content.appendChild(this.user)
            this.content.appendChild(this.raportContent)
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