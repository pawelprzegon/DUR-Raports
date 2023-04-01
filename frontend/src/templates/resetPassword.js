import {url} from "../common/data/url.js"
import {callApiPost} from '../features/endpoints/endpoints.js'
import {hideloader} from '../features/loading/loading.js'
import {navigateTo} from "../js/index.js";
import {alerts} from '../features/alerts/alerts.js'
import AbstractView from "./AbstractView.js";

export default class extends AbstractView{
    constructor(params){
        super(params);

        this.actualAddress = new URL(window.location.href);
        console.log(this.actualAddress)
        this.token = this.actualAddress.searchParams.get("token")
        console.log(this.token)
    }

    css(){
        document.getElementById('theme').setAttribute('href', "../src/css/auth.css");
        document.getElementById('app-header').setAttribute('style', 'height:0%')
        document.getElementById('alerts').setAttribute('style', 'height:0%')
    }


    async getData(){
        this.css();
        
        this.bricks = []
        this.api_url = url+"reset_password/"
        this.setTitle("Reset password")

        this.container = document.getElementById('cont');
        this.formField = document.createElement('form')
        this.formField.action = "#"
        this.formField.id = "form"
        this.formField.method = "post"

        
        this.header = document.createElement('h1');
        this.header.innerText = 'Reset password'
        this.header.id = 'header'
        this.formField.appendChild(this.header)
        this.responseBox = document.createElement('div');
        this.responseBox.id = 'responseBox'
        this.formField.appendChild(this.responseBox)

        // Errors section
        this.responseStatus = document.createElement('p');
        this.responseStatus.innerText = '';
        this.responseStatus.classList.add('response-error')
        this.responseData = document.createElement('p');
        this.responseData.innerText = '';
        this.responseData.classList.add('response-error')
        
        this.responseBox.appendChild(this.responseStatus);
        this.responseBox.appendChild(this.responseData);

        // inputs section
        let data = []
        data = ["password", "confirm"]

        data.forEach(each => {
            this.elemBox = document.createElement('div');
            this.elemBox.classList.add('input-control')
            this.elemBox.id = 'div-'+each
            this.elemLabel = document.createElement('p');
            this.elemLabel.innerText = each;
            this.elemText = document.createElement('input');
            this.elemText.type = 'text'       
            this.elemText.name = each
            this.elemText.id = each
            this.Err = document.createElement('div')
            this.Err.classList.add('error')

            this.elemBox.appendChild(this.elemLabel)
            this.elemBox.appendChild(this.elemText)
            this.elemBox.appendChild(this.Err)
            this.formField.appendChild(this.elemBox)
        })

        this.submitButtonBox = document.createElement('div');
        this.submitButton = document.createElement('button');
        this.submitButton.classList.add('submit');
        this.submitButton.type = "submit";
        this.submitButton.innerText = 'Reset';


        this.submitButtonBox.appendChild(this.submitButton)
        this.formField.appendChild(this.submitButtonBox)
        this.container.appendChild(this.formField)

        this.container.addEventListener('submit', (e) => {

            e.preventDefault();

            const formData = new FormData(this.formField);
            const formDataObj = {};

            formData.forEach((key, value) => {
                let obj = document.getElementById('div-'+value)
                if(!obj.classList.contains('hidden-element')){
                    formDataObj[value] = key;
                }
            })
        
            console.log(formDataObj)
            let validate = this.validateInputs(formDataObj);
            if (validate.valid === true){
                this.resetPassword(formDataObj);
            }else{
                console.log("błędne dane")
            }
        })
    }

    validateInputs(formDataObj){
        for (const [key, value] of Object.entries(formDataObj)) {
            let obj = document.getElementById(key) 
            value.trim(); 
            if((key === 'password') && (value.length < 6)){
                this.setError(obj, "hasło musi mieć conajmniej 6 znaków")
            }else if((key === "confirm") && (value !== document.getElementById('password').value)){
                this.setError(obj, "hasła nie pasują")
            }else{
                this.setSuccess(obj)
            }
          
            
        }
        let success = document.getElementsByClassName('success')
        if ((success.length) === Object.keys(formDataObj).length){
            return {'valid': true,
                    'elements':  Object.keys(formDataObj).length}
        }else{
            return false
        }
        
    }

    setError = (element, message) =>{
        const inputControl = element.parentElement;
        const errorDisplay = inputControl.querySelector('.error')

        errorDisplay.innerText = message;
        inputControl.classList.add('error')
        inputControl.classList.remove('success')
    }

    setSuccess = element => {
        const inputControl = element.parentElement;
        const errorDisplay = inputControl.querySelector('.error')

        errorDisplay.innerText = "";
        inputControl.classList.add('success')
        inputControl.classList.remove('error')
    }

    async resetPassword(formData){
        let [response, status] = await callApiPost(this.api_url, JSON.stringify(formData), this.token);
        console.log(status)
        console.log(response)
        if (status == 200){
            alerts('Success', response.message, 'alert-green')
            navigateTo('/login')
            }
            else{
                this.responseBox.innerHTML = ''
                this.response = document.createElement('div');
                this.responseStatus = document.createElement('p');
                this.responseStatus.innerText = status;
                this.responseStatus.classList.add('response-error')
                this.responseData = document.createElement('p');
                this.responseData.innerText = response;
                this.responseData.classList.add('response-error')
                
                this.responseBox.appendChild(this.responseStatus);
                this.responseBox.appendChild(this.responseData);
                alerts('Failed', response.message, 'alert-red')
            }
            
    }


}
