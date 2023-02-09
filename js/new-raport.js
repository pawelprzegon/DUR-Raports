
let regioList = new Object();
regioList = {}
regioList['Stolarnia'] = ['Pilarki', 'Zbijarki', 'Kompresor', 'Inne'];
regioList['Drukarnia'] = ['Xeikony', 'Mutohy', 'Impale', 'Latex', 'Fotoba', 'Zgrzewarka', 'Kompresor', 'Inne' ]
regioList['Bibeloty'] = ['Cuttery', 'Laminarki', 'HotPress', 'EBSy', 'Mieszalnik', 'Dozownik', 'Summa', 'Inne' ]
const users = ['Adam', 'Paweł', 'Bartek'];


function showForm () {

    const CheckList = document.querySelector('#form-data');
    

        //dodawanie checkboxów
        function show(lab, data) {
            // hideloader();

            const region = document.createElement('div');
                region.classList.add('regions')
                const LabelBox = document.createElement('div');
                    const StolarniaLabel = document.createElement('h4');
                    StolarniaLabel.innerText = `${lab}`;
                    LabelBox.appendChild(StolarniaLabel);
                    region.appendChild(LabelBox)
                const CheckBoxesBox = document.createElement('div');
                CheckBoxesBox.classList.add('checkboxes')
                let i = 1
                    data.forEach(each => {
                        const element = document.createElement('label');
                            element.classList.add('label-container');
                            element.innerText = `${each}`; 
                    
                        const span = document.createElement('span');
                            span.classList.add('checkmark');

                        const input = document.createElement('input');
                            input.type = 'checkbox';
                            input.id = `${lab}`+i;
                            input.name = `${each}`
                            i+=1;
                            input.onclick = function(){
                                showStolarniaBox(`${lab}`, input.id);
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
            const inputField = document.createElement('textarea');
                
            inputField.hidden = true;
            // inputField.type = 'text';
            inputField.name = `${lab}`;
            inputField.cols = '40';
            inputField.rows = '6';
            inputField.placeholder = `${lab}`;
            
            txtField.appendChild(inputField)
            return txtField
            
        }

    // wywołanie tworzenia checkboxów
    const CheckboxField = document.createElement('div')
        CheckboxField.classList.add('registration-grid')
        for(const [key, value] of Object.entries(regioList)){
            var region = show(key, value);
            CheckboxField.appendChild(region);
            
        }      
    CheckList.appendChild(CheckboxField);
    
    // wywołanie tworzenia pól tekstowych
    const RaportTextField = document.createElement('div')
        RaportTextField.classList.add('text-grid')
        RaportTextField.id = 'RaportTextField'
        RaportTextField.style.display = "none"
        for(const key in regioList){
            var textField = textFields(key)
            RaportTextField.appendChild(textField);
        }
        CheckList.appendChild(RaportTextField);
        
        function showStolarniaBox(name, checkbox_id) {
            console.log(name)
            let checkBoxTriggered = document.getElementById(checkbox_id);
            let text = document.getElementsByName(name);
            let result = checkIfAnyCheckbox(name)
            console.log(text[0])
            if (checkBoxTriggered.checked){
                text[0].value += checkBoxTriggered.name +" : \n"
            }
            if (result == true){
              text[0].hidden = false;
              text[0].classList.add('form-line')
            } else {
              text[0].hidden = true;
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
            if (rtfTrigger == true){
                rtf.style.display = 'block';
            }else{
                rtf.style.display = 'none'  
            }
            
            return checkboxTrigger;
            
          }

    // wywołanie tworzenia delkaracji
    const DeklTextField = document.createElement('div')
        DeklTextField.classList.add('text-grid', "dekl-text-label")

        users.forEach(user => {
            const label = document.createElement('span');
                label.classList.add('DeklTextField');
                label.innerText = `${user}`;
            const inputField = document.createElement('textarea');
                inputField.classList.add("dekl-text-area")
                // inputField.type = 'text';
                inputField.name = 'dekl-'+`${user}`;
                inputField.cols = '40';
                inputField.rows = '8';

            DeklTextField.appendChild(label)
            DeklTextField.appendChild(inputField)
            
        }) 
    
    CheckList.appendChild(DeklTextField)

     // wywołanie tworzenia plexi
    
    const today = new Date();
    if (today.getDay() == 2 ){
        const PlexiTextField = document.createElement('div')
            PlexiTextField.classList.add('text-grid', "dekl-text-area")
            const label = document.createElement('span');
                label.classList.add('DeklTextField');
                label.innerText = "raport plexi";
            const inputField = document.createElement('textarea');
                inputField.classList.add("dekl-text-area")
                inputField.type = 'text';
                inputField.name = 'plexi';
                inputField.cols = '40';
                inputField.rows = '8';
                inputField.value = "W ostatnim tygodniu wydrukowano: XXX formatek plexi z czego YYY \
                zostało uszkodzonych. Współczynnik w skali miesiąca wynosi: ZZZ"

    PlexiTextField.appendChild(label)
    PlexiTextField.appendChild(inputField)
    CheckList.appendChild(PlexiTextField)

    }

    // Submit button
    const SubmitField = document.createElement('div');
        SubmitField.id = 'wrapper'
        const submitButton = document.createElement('button');
        submitButton.classList.add('submit')
        submitButton.type = "button";
        submitButton.innerText = "Zapisz"

        SubmitField.appendChild(submitButton)
    
    CheckList.appendChild(SubmitField)
              
}
showForm()

