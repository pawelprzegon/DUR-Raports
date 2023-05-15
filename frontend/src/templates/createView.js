import AbstractView from "./AbstractView.js";
import {url} from "../common/data/url.js"
import {callApiPut} from '../features/endpoints/endpoints.js'
import {navigateTo} from "../js/index.js";
import {hideloader} from '../features/loading/loading.js'
import {SliderForm} from '../features/swiper/slider.js'
import {getCookieValue} from '../features/cookie/index.js'
import {checkAuth} from '../features/endpoints/endpoints.js'
import {alerts} from '../features/alerts/alerts.js'
import {capitalized} from '../features/upperCase/upperCase.js'


export default class extends AbstractView{
    constructor(params){
        super(params);
        this.params = params
        // console.log(this.params)
        if ('_id' in this.params){
            this.currentRaport = JSON.parse(localStorage.getItem('active_raport'));
            this.setTitle("Edit "+this.params._id)
            this.api_url = url+'update/'
        }else{
            this.setTitle("New")
            this.api_url = url+'create/'
        }
        
        this.regioList = new Object();
        this.regioList = {}
        this.regioList['Stolarnia'] = ['Pilarki', 'Zbijarki', 'Kompresor', 'Inne'];
        this.regioList['Drukarnia'] = ['Xeikony', 'Mutohy', 'Impale', 'Latex', 'Fotoba', 'Zgrzewarka', 'Kompresor', 'Inne' ]
        this.regioList['Bibeloty'] = ['Cuttery', 'Laminarki', 'Hotpress', 'EBS', 'Mieszalnik', 'Dozownik', 'Summa', 'Inne' ]
        this.users = ['Adam', 'Pawel', 'Bartek'];

        
    }

    css(){
        document.getElementById('theme').setAttribute('href', "../src/css/create.css");
    }


    async getData(){
        try {
            let [re, st] = await checkAuth(url+'auth');
            if (st == 202 && re.detail == "authenticated" || st == 200 && re.access_token){
                this.show();
            }
        }catch (error){
            alerts('error', error, 'alert-red')
        }
        
    }

    show(){
        this.css();
        this.container = document.querySelector('#cont')
        this.container.innerHTML = ''

        this.content = document.createElement('div');
        this.content.classList = 'content'
        this.content.id = 'content'
        this.formBody = document.createElement('div')
        this.formBody.classList.add('form-body', 'swiper')
        this.formBody.id = 'form-data'

        this.form = document.createElement('form')
        this.form.action = "#"
        this.form.id = "form"
        this.form.method = "post"
        this.form.classList.add('slide-content')

        this.formWrapper = document.createElement('div')
        this.formWrapper.classList.add('swiper-wrapper')

        this.form.appendChild(this.formWrapper)
        this.formBody.appendChild(this.form)
        this.content.appendChild(this.formBody)

        this.container.appendChild(this.content)


        this.regions('Stolarnia');
        this.regions('Drukarnia');
        this.regions('Bibeloty');
        this.deklaracje();
        this.plexi();
        
        if ('_id' in this.params){
            this.fillData();
            this.events(this.api_url, this.params._id);
        }else{
            this.events(this.api_url);
        }
        this.SliderNav();
        this.submit();
        this.build();
        SliderForm();
    }


    regions(place){

        this.formField = document.createElement('div')
        this.formField.classList.add('swiper-slide')

        for(const [key, value] of Object.entries(this.regioList)){
            if (key == place){
                let labels = this.createLabels(key)
                let checkboxes = this.createCheckboxes(value, key);
                let text = this.createTextFields(place)
                const elements = document.createElement('div')
                elements.classList.add('elements')
                elements.appendChild(checkboxes);
                elements.appendChild(text)
                this.formField.appendChild(labels);
                this.formField.appendChild(elements);
            }      
        }

        this.formWrapper.appendChild(this.formField)
    }

    deklaracje(){
        

        const deklTextBox = document.createElement('div')
        deklTextBox.classList.add("swiper-slide", "deklaracje")

        const deklLabelBox = document.createElement('div')
        deklLabelBox.classList.add('label-box')
        const deklLabel = document.createElement('p')
        deklLabel.innerText = 'Deklaracje';
        deklLabelBox.appendChild(deklLabel)

        const deklTextField = document.createElement('div')
        deklTextField.classList.add('deklaracje-describe-areas')

        this.users.forEach(user => {
            const box = document.createElement('div')
            box.classList.add('deklaracje-box')
            const label = document.createElement('span');
            label.classList.add('raport-describe-label');
            label.innerText = user;
            const inputField = document.createElement('textarea');
            inputField.classList.add('raport-describe-users')
            inputField.name = 'dekl_'+user;
            inputField.id = 'dekl_'+user;
            inputField.rows = '25';

            box.appendChild(label)
            box.appendChild(inputField)
            deklTextField.appendChild(box)
            // RegionField.appendChild(deklTextField)
            deklTextBox.appendChild(deklLabelBox)
            deklTextBox.appendChild(deklTextField)

            this.formWrapper.appendChild(deklTextBox)
        }) 
    
        
    }

    plexi(){

        const PlexiTextField = document.createElement('div')
        PlexiTextField.classList.add("swiper-slide",'deklaracje')

        const plexiLabelBox = document.createElement('div')
        plexiLabelBox.classList.add('label-box')

        const plexiLabel = document.createElement('p')
        plexiLabel.innerText = 'Raport Plexi';
        plexiLabelBox.appendChild(plexiLabel)


        const box = document.createElement('div')
        box.classList.add('plexi-box')
        let boxes = {'printed_plexi':'Wydrukowano (szt)', 'wrong_plexi':'Błędnie wydrukowano (szt)', 'factor_plexi':'Współczynnik (%)'}
            for (const [key, value] of Object.entries(boxes)){
                let boxN = document.createElement('div')
                boxN.classList.add('input-data')
                let label = document.createElement('p')
                label.classList.add('plexi-input-label')
                label.innerText = value
                let inputPlace = document.createElement('input')
                inputPlace.name = key
                inputPlace.id = key
                inputPlace.classList.add('plexi-input')
    
                boxN.appendChild(label)
                boxN.appendChild(inputPlace)
                box.appendChild(boxN)
            }

            

        PlexiTextField.appendChild(plexiLabelBox)
        PlexiTextField.appendChild(box)
        this.formWrapper.appendChild(PlexiTextField)
 

        
    }


    SliderNav(){
        const next = document.createElement('div')
        next.classList.add('swiper-button-next')
        const prev = document.createElement('div')
        prev.classList.add('swiper-button-prev')
        const paginate = document.createElement('div')
        paginate.classList.add('swiper-pagination')

        this.form.appendChild(next)
        this.form.appendChild(prev)
        this.form.appendChild(paginate)
        
    }

    submit(){
        const SubmitField = document.createElement('div');
        SubmitField.classList.add('submitField')
        SubmitField.id = 'wrapper'
        const submitButton = document.createElement('button');
        submitButton.classList.add('submit');
        submitButton.type = "submit";
        submitButton.innerText = "Zapisz";

        SubmitField.appendChild(submitButton);
        this.form.appendChild(SubmitField)
    }

    build(){
        this.content.appendChild(this.formBody)
    }


    async events(api_url, id){
        
        let form = document.getElementById('form')
        

        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = new FormData(form);
            const formDataObj = {};
            let st = {}
            let dr = {}
            let bib = {}
            let stUnits = []
            let drUnits = []
            let bibUnits = []
            let plexi = []
            let dekl = []
            formData.forEach((key, value) =>{
                console.log(key, value)
                if (key=='Stolarnia'){
                    stUnits.push(value)
                    st['units'] = stUnits
                }else if(value=='Stolarnia'){
                    if (key != ""){
                        st['text'] = key
                    }
                }
                else if (key=='Drukarnia'){
                    drUnits.push(value)
                    dr['units'] = drUnits
                }else if(value=='Drukarnia'){
                    if (key != ""){
                        dr['text'] = key
                    }
                }
                else if (key=='Bibeloty'){
                    bibUnits.push(value)
                    bib['units'] = bibUnits
                }else if(value=='Bibeloty'){
                    if (key != ""){
                        bib['text'] = key
                    }
                }
                else{
                    if (value.split('_')[1] == 'plexi' && key != ''){
                        let data = new Object();
                        data[value.split('_')[0]] = key
                        plexi.push(data)
                    }else if(value.split('_')[0] == 'dekl'){
                        let data = new Object();
                        data[value.split('_')[1]] = key
                        dekl.push(data)
                    }
                    // formDataObj[value] = key
                }
                
            });


            if (!$.isEmptyObject(st)){
                formDataObj['Stolarnia'] = st
            }
            if (!$.isEmptyObject(dr)){
                formDataObj['Drukarnia'] = dr
            }
            if (!$.isEmptyObject(bib)){
                formDataObj['Bibeloty'] = bib
            }
            if (!$.isEmptyObject(plexi)){
                formDataObj['plexi'] = plexi
            }
            if (!$.isEmptyObject(dekl)){
                formDataObj['dekl'] = dekl
            }

            
            let username = getCookieValue('user')
            formDataObj['username'] = username;
            if (id){
                formDataObj['id'] = id;
            }
            let data = JSON.stringify(formDataObj)

            console.log(formDataObj)

            try {
                let [re, st] = await checkAuth(url+'auth');
                console.log(re, st)
                if (st == 202 && re.detail == "authenticated" || st == 200 && re.access_token){
                    let [response, status] = await callApiPut(api_url, data);
                    console.log(response, status)
                    if (status == 200 && response.message){
                        alerts(status, response.message, 'alert-green');
                        navigateTo('/')
                    }else{
                        alerts(status, response, 'alert-red');
                    }
                }
            }catch (error){
                hideloader();
                alerts('error', error, 'alert-red')
            }
        })
    }

    

    fillData(){
        console.log(this.currentRaport.plexi.length)
        this.currentRaport.units.forEach(item =>{
            switch (item.region){
                case 'Stolarnia':
                    document.getElementById(`${item.region}`+'_'+`${item.unit}`).checked=true
                    document.getElementById('text_Stolarnia').value = item.info
                    break;
                case 'Drukarnia':
                    document.getElementById(`${item.region}`+'_'+`${item.unit}`).checked=true
                    document.getElementById('text_Drukarnia').value = item.info
                    break;
                case 'Bibeloty':
                    document.getElementById(`${item.region}`+'_'+`${item.unit}`).checked=true
                    document.getElementById('text_Bibeloty').value = item.info
                    break;
            }        
        })

        for(const[key, value] of Object.entries(this.currentRaport.dekl[0])){
            document.getElementById(`dekl_${capitalized(key)}`).value = value
        }
        
        if (this.currentRaport.hasOwnProperty('plexi') && this.currentRaport.plexi.length != 0){
            for (const [key, value] of Object.entries(this.currentRaport.plexi[0])){
                console.log(key, value)
                document.getElementById(key+'_plexi').value = value
            }
        }
    }

    // labele
    createLabels(lab){
        const LabelBox = document.createElement('div');
        LabelBox.classList.add('label-box')
        const regionLabel = document.createElement('p');
        regionLabel.innerText = lab;
        LabelBox.appendChild(regionLabel)
        return LabelBox
    }

    //dodawanie checkboxów
    createCheckboxes(data, lab) {
            
    const region = document.createElement('div');
    region.classList.add('regions');

    const CheckBoxesBox = document.createElement('div');
    CheckBoxesBox.classList.add('checkboxes');
    let i = 1
    data.forEach(each => {
        const element = document.createElement('label');
        element.classList.add('label-container');
        element.innerText = each; 
    
        const span = document.createElement('span');
        span.classList.add('checkmark');

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.id = lab+'_'+each;
        input.name = each;
        input.value = lab;
        i+=1;
    
        element.appendChild(input);
        element.appendChild(span);
        CheckBoxesBox.appendChild(element);
        region.appendChild(CheckBoxesBox);
        
        
    });

    return region
    }

    //tworzenie pól tekstowych
    createTextFields(key) {
        const txtField = document.createElement('div');
        txtField.classList.add('form-line');
        const inputField = document.createElement('textarea');
        inputField.classList.add('raport-describe');
        inputField.id = 'text_'+key;
        inputField.name = key;
        inputField.rows = '25';
        txtField.appendChild(inputField)
        return txtField  
    }
}


    

