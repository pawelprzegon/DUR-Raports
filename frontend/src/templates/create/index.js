import {url} from "../../common/data/index.js"
import AbstractView from "../AbstractView.js";


export default class extends AbstractView{
    constructor(){
        super();
        this.setTitle("New")
        this.regioList = new Object();
        this.regioList = {}
        this.regioList['Stolarnia'] = ['Pilarki', 'Zbijarki', 'Kompresor', 'Inne'];
        this.regioList['Drukarnia'] = ['Xeikony', 'Mutohy', 'Impale', 'Latex', 'Fotoba', 'Zgrzewarka', 'Kompresor', 'Inne' ]
        this.regioList['Bibeloty'] = ['Cuttery', 'Laminarki', 'HotPress', 'EBSy', 'Mieszalnik', 'Dozownik', 'Summa', 'Inne' ]
        this.users = ['Adam', 'Paweł', 'Bartek'];

        this.raportList = document.querySelector('#raport');
        this.raportList.innerHTML = '';
            
        this.CheckList = document.querySelector('#form-data');
        this.CheckList.innerHTML='';
    }

    async getData(){

        let theme = document.getElementById('theme')
        theme.setAttribute('href', "/src/templates/create/create.css");

        $("body").css("overflow", "initial");

        this.showForm();
        this.events();
 
    }

    showForm () {
        

        const formField = document.createElement('form')
            formField.action = "#"
            formField.id = "form"
            formField.method = "post"

            //dodawanie checkboxów
            function show(lab, data) {
                
                const region = document.createElement('div');
                region.classList.add('regions')
                const LabelBox = document.createElement('div');
                const StolarniaLabel = document.createElement('h4');
                StolarniaLabel.innerText = lab;
                LabelBox.appendChild(StolarniaLabel);
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
                    input.id = lab+i;
                    input.name = each;
                    input.value = lab;
                    i+=1;
                    input.onclick = function(){
                        showTextBox(lab, input.id);
                    }
                
                
                    CheckBoxesBox.appendChild(element);
                    region.appendChild(CheckBoxesBox);
                    element.appendChild(input);
                    element.appendChild(span);
                    
                });

                return region
            
            }

            // Dodawanie pól tekstowych
            function textFields(lab) {

                const txtField = document.createElement('div');
                    txtField.classList.add('form-line');
                    const txtFieldLab = document.createElement('p');
                    txtFieldLab.innerText = lab;
                    txtFieldLab.hidden = true;
                    txtFieldLab.id = 'label-'+lab;
                    txtFieldLab.classList.add('form-line-label')
                    const inputField = document.createElement('textarea');
                    
                inputField.hidden = true;
                inputField.name = lab;
                inputField.cols = '40';
                inputField.rows = '10';
                inputField.placeholder = lab;
                
                txtField.appendChild(txtFieldLab)
                txtField.appendChild(inputField)
                return txtField
                
            }

        // wywołanie tworzenia checkboxów
        const CheckboxField = document.createElement('div')
            CheckboxField.classList.add('registration-grid')
            for(const [key, value] of Object.entries(this.regioList)){
                var region = show(key, value);
                CheckboxField.appendChild(region);
                
            }      
        formField.appendChild(CheckboxField);
        
        // wywołanie tworzenia pól tekstowych
        const RaportTextField = document.createElement('div')
            RaportTextField.classList.add('text-grid')
            RaportTextField.id = 'RaportTextField'
            RaportTextField.style.display = "none"
            for(const key in this.regioList){
                let textField = textFields(key)
                RaportTextField.appendChild(textField);
            }
            formField.appendChild(RaportTextField);
            
            function showTextBox(name, checkbox_id) {
                let checkBoxTriggered = document.getElementById(checkbox_id);
                let textField = document.getElementById('RaportTextField')
                let textLabel = document.getElementById('label-'+name)
                let text = document.getElementsByName(name);
                let result = checkIfAnyCheckbox(name)

                if (checkBoxTriggered.checked){
                    textField.style.display = 'grid'
                    if (text[0].value != ''){
                        text[0].value += "\n"+checkBoxTriggered.name +" : "
                    }else{
                        text[0].value += checkBoxTriggered.name +" : "
                    }
                    
                }
                if (result == true){
                text[0].hidden = false;
                textLabel.hidden = false;
                text[0].classList.add('form-line')
                } else {
                text[0].hidden = true;
                textLabel.hidden = true;
                text[0].value = ''
                text[0].classList.remove('form-line')
                }
            }
            

            function checkIfAnyCheckbox(area){
                let checkboxes = document.getElementsByTagName('input');
                let rtf = document.getElementById('RaportTextField'); 
                let checkboxTrigger = false;
                let rtfTrigger = false;
                for (var i=0; i < checkboxes.length ; i++) {
                    if (checkboxes[i].checked){
                        if (((checkboxes[i].id).split(/(\d+)/))[0] === area ){
                            checkboxTrigger = true;
                        }
                        rtfTrigger = true;
                    } 
                }
                if (rtfTrigger == false){
                    rtf.style.display = 'none';
                }
                
                return checkboxTrigger;
                
            }

        // wywołanie tworzenia delkaracji
        const DeklTextField = document.createElement('div')
            DeklTextField.classList.add('text-grid')

            this.users.forEach(user => {
                const label = document.createElement('span');
                    label.classList.add('form-line-label');
                    label.innerText = user;
                const inputField = document.createElement('textarea');
                    inputField.classList.add("form-line")
                    inputField.required = true;
                    // inputField.type = 'text';
                    inputField.name = 'dekl-'+user;
                    inputField.cols = '40';
                    inputField.rows = '12';

                DeklTextField.appendChild(label)
                DeklTextField.appendChild(inputField)
                
            }) 
        
        formField.appendChild(DeklTextField)

        // wywołanie tworzenia plexi
        
        const today = new Date();
        if (today.getDay() == 0 ){
            const PlexiTextField = document.createElement('div')
                PlexiTextField.classList.add('text-grid', "form-line")
                const label = document.createElement('span');
                    label.classList.add('DeklTextField');
                    label.innerText = "raport plexi";
                const inputField = document.createElement('textarea');
                    inputField.classList.add("form-line");
                    inputField.required = true;
                    inputField.name = 'plexi';
                    inputField.cols = '40';
                    inputField.rows = '8';
                    inputField.value = "W ostatnim tygodniu wydrukowano: XXX formatek plexi z czego YYY \
                    zostało uszkodzonych. Współczynnik w skali miesiąca wynosi: ZZZ"

        PlexiTextField.appendChild(label)
        PlexiTextField.appendChild(inputField)
        formField.appendChild(PlexiTextField)

        }

        // Submit button
        const SubmitField = document.createElement('div');
            SubmitField.id = 'wrapper'
            const submitButton = document.createElement('button');
            submitButton.classList.add('submit');
            submitButton.type = "submit";
            submitButton.innerText = "Zapisz";

            SubmitField.appendChild(submitButton);

        formField.appendChild(SubmitField);
        this.CheckList.appendChild(formField)

        
        
    }

    events(){
        let form = document.getElementById('form')
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(form);
            const formDataObj = {};
            let st = {}
            let dr = {}
            let bib = {}
            let stUnits = []
            let drUnits = []
            let bibUnits = []
            formData.forEach((key, value) => {
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
            
            formDataObj['user_id'] = 2;
            console.log(formDataObj);
            let data = JSON.stringify(formDataObj)
            console.log(data)
            fetch(url+'create/', {
                method: "PUT",
                headers: {"content-type" : "application/json"},
                body: data,
            })
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(err => console.log(err))
        })
    }

}
    
    
    
    

