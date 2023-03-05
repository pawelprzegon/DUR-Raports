import AbstractView from "./AbstractView.js";
import {url} from "../common/data/index.js"
import {callApiPut, tokenRefresh} from '../features/endpoints/index.js'
import {navigateTo} from "../js/index.js";
import {hideloader} from '../features/loading/loading.js'
import {SliderForm} from '../features/swiper/slider.js'
import {getCookieValue} from '../features/cookie/index.js'


export default class extends AbstractView{
    constructor(params){
        super(params);

        if (this.params.id){
            this.setTitle("Edit "+this.params.id)
            this.data = JSON.parse(localStorage.getItem('active_raport'));
            this.api_url = url+'update/'
        }else{
            this.setTitle("New")
            this.api_url = url+'create/'
        }
        
        window.scrollTo(0,0);
        $("body").css("overflow", "hidden");

        this.regioList = new Object();
        this.regioList = {}
        this.regioList['Stolarnia'] = ['Pilarki', 'Zbijarki', 'Kompresor', 'Inne'];
        this.regioList['Drukarnia'] = ['Xeikony', 'Mutohy', 'Impale', 'Latex', 'Fotoba', 'Zgrzewarka', 'Kompresor', 'Inne' ]
        this.regioList['Bibeloty'] = ['Cuttery', 'Laminarki', 'HotPress', 'EBSy', 'Mieszalnik', 'Dozownik', 'Summa', 'Inne' ]
        this.users = ['Adam', 'Paweł', 'Bartek'];

        this.prepare()
        
    }

    prepare(){
        const user = document.querySelector('#user')
        user.innerHTML = '';
        const dekl = document.querySelector('#dekl')
        dekl.innerHTML = '';
        const issues = document.querySelector('#issues')
        issues.innerHTML = '';
        const raportList = document.querySelector('#raport');
        raportList.innerHTML = '';

        let theme = document.getElementById('theme')
        theme.setAttribute('href', "../src/css/create.css");
    }

    async getData(){

        this.content = document.querySelector('#content');
        this.formBody = document.querySelector('#form-data')

        this.form = document.createElement('form')
        this.form.action = "#"
        this.form.id = "form"
        this.form.method = "post"
        this.form.classList.add('slide-content')

        this.formWrapper = document.createElement('div')
        this.formWrapper.classList.add('swiper-wrapper')

        this.form.appendChild(this.formWrapper)
        this.formBody.appendChild(this.form)


        hideloader();
        this.regions('Stolarnia');
        this.regions('Drukarnia');
        this.regions('Bibeloty');
        this.deklaracje();
        this.plexi();
        this.submit();
        if (this.params.id){
            this.fillData();
            this.events(this.api_url, this.params.id);
        }else{
            this.events(this.api_url);
        }
        this.SliderNav();
        this.build();
        SliderForm();

    }


    regions(place){

        this.formField = document.createElement('div')
        this.formField.classList.add('swiper-slide')

       //dodawanie checkboxów
       function createCheckboxes(lab, data) {
                
        const region = document.createElement('div');
        region.classList.add('regions')
        const LabelBox = document.createElement('div');
        const regionLabel = document.createElement('h4');
        regionLabel.innerText = lab;
        LabelBox.appendChild(regionLabel);
        region.appendChild(LabelBox)
        const CheckBoxesBox = document.createElement('div');
        CheckBoxesBox.classList.add('checkboxes')
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
        
            CheckBoxesBox.appendChild(element);
            region.appendChild(CheckBoxesBox);
            element.appendChild(input);
            element.appendChild(span);
            
        });

        return region
        }

        function createTextFields(key) {

            const txtField = document.createElement('div');
            txtField.classList.add('form-line');
            // const txtFieldLab = document.createElement('p');
            // txtFieldLab.id = 'label-'+key;
            // txtFieldLab.classList.add('form-line-label')
            const inputField = document.createElement('textarea');
            inputField.classList.add('raport-describe')
            inputField.id = 'text_'+key;
            inputField.name = key;
            inputField.cols = '80';
            inputField.rows = '20';
            // inputField.placeholder = key;
            
            // txtField.appendChild(txtFieldLab)
            txtField.appendChild(inputField)
            return txtField
            
        }


        const RegionField = document.createElement('div')
        RegionField.classList.add('registration-grid')
        for(const [key, value] of Object.entries(this.regioList)){
            if (key == place){
                var region = createCheckboxes(key, value);
                var text = createTextFields(place)
                RegionField.appendChild(region);
                RegionField.appendChild(text)
            }      
        }

        

        this.formField.appendChild(RegionField);
        this.formWrapper.appendChild(this.formField)
    }

    deklaracje(){

        const deklTextBox = document.createElement('div')
        deklTextBox.classList.add("swiper-slide", "deklaracje")
        const deklLabelBox = document.createElement('div')
        deklLabelBox.classList.add('regions')
        const deklLabel = document.createElement('h4')
        deklLabel.innerText = 'Deklaracje';
        deklLabelBox.appendChild(deklLabel)
        deklTextBox.appendChild(deklLabelBox)
        const deklTextField = document.createElement('div')
        deklTextField.classList.add('deklaracje-describe-areas')

        this.users.forEach(user => {
            const box = document.createElement('div')
            box.classList.add('deklaracje-box')
            const label = document.createElement('span');
            label.classList.add('raport-describe-label');
            label.innerText = user;
            const inputField = document.createElement('textarea');
            inputField.classList.add('raport-describe')
            inputField.required = true;
            inputField.name = 'dekl_'+user;
            inputField.id = 'dekl_'+user;
            inputField.rows = '18';

            box.appendChild(label)
            box.appendChild(inputField)
            deklTextField.appendChild(box)
            deklTextBox.appendChild(deklTextField)
            this.formWrapper.appendChild(deklTextBox)
        }) 
    
        
    }

    plexi(){
        const today = new Date();
        if (today.getDay() == 0 ){
            const PlexiTextField = document.createElement('div')
            PlexiTextField.classList.add("swiper-slide",'deklaracje')
            const plexiLabelBox = document.createElement('div')
            plexiLabelBox.classList.add('regions')

            const plexiLabel = document.createElement('h4')
            plexiLabel.innerText = 'Raport Plexi';
            plexiLabelBox.appendChild(plexiLabel)


            const box = document.createElement('div')
            box.classList.add('deklaracje-box')
            const inputField = document.createElement('textarea');
            inputField.classList.add('raport-describe');
            inputField.required = true;
            inputField.name = 'plexi';
            inputField.id = 'plexi';
            inputField.rows = '18';
            inputField.value = "W ostatnim tygodniu wydrukowano: XXX formatek plexi z czego YYY \
            zostało uszkodzonych. Współczynnik w skali miesiąca wynosi: ZZZ"
            box.appendChild(inputField)

        PlexiTextField.appendChild(plexiLabelBox)
        PlexiTextField.appendChild(box)
        this.formWrapper.appendChild(PlexiTextField)
        }

        
    }

    submit(){
        const SubmitField = document.createElement('div');
        SubmitField.id = 'wrapper'
        const submitButton = document.createElement('button');
        submitButton.classList.add('submit');
        submitButton.type = "submit";
        submitButton.innerText = "Zapisz";

        SubmitField.appendChild(submitButton);

        form.appendChild(SubmitField);

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
            formData.forEach((key, value) =>{
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
                    formDataObj[value] = key
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
            
            let username = getCookieValue('user')
            formDataObj['username'] = username;
            if (id){
                formDataObj['id'] = id;
            }
            let data = JSON.stringify(formDataObj)

            console.log(formDataObj)
            try{
                let [response, status] = await callApiPut(api_url, data);
                console.log(response)


                if (response.detail && response.detail == "Not authenticated"){
                    console.log('refreshing token')
                    let refTokenResponse = await tokenRefresh();
                    console.log(refTokenResponse)
                    if (refTokenResponse[1] == 200){
                        let [response, status] = await callApiPut(api_url, data);
                        console.log(response)
                        if (status == 200 && response.category == 'success'){
                            navigateTo('/')
                        }else{
                            document.getElementById('err').innerHTML = `
                            <h1>${status}</h1>
                            <p>${response}</p>
                            `
                        }
                    }else{
                        navigateTo('/login')
                    }
                }else{
                    navigateTo('/')
                }

            }catch(error){
                console.log(error)
            }
            
        })
    }

    fillData(){
        this.data.units.forEach(item =>{
            switch (item.region){
                case 'Stolarnia':
                    document.getElementById(`${item.region}`+'_'+`${item.unit}`).checked=true
                    document.getElementById('text_Stolarnia').value = item.info
                case 'Drukarnia':
                    document.getElementById(`${item.region}`+'_'+`${item.unit}`).checked=true
                    document.getElementById('text_Drukarnia').value = item.info
                case 'Bibeloty':
                    document.getElementById(`${item.region}`+'_'+`${item.unit}`).checked=true
                    document.getElementById('text_Bibeloty').value = item.info
            }        
        })

        this.data.dekl.forEach(item =>{
            document.getElementById('dekl_'+item.name).value = item.dekl
        })

        if (this.data.plexi){
            document.getElementById('plexi').value = this.data.plexi[0].plexi
        }
    }
}


    

