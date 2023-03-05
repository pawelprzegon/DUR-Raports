import {url} from "../common/data/index.js"
import {callApiPost} from '../features/endpoints/index.js'
import {navigateTo} from '../js/index.js'
import {navBar, navBehav} from '../common/navigation/index.js'
import {hideloader} from '../features/loading/loading.js'
 
import AbstractView from "./AbstractView.js";

export default class extends AbstractView{
    constructor(params){
        super(params);
        
        this.setTitle("Login")
        hideloader();
        this.form = document.querySelector('#form-data');

        this.formField = document.createElement('form')
        this.formField.action = "#"
        this.formField.id = "form"
        this.formField.method = "post"

        this.raportList = document.querySelector('#raport');

        this.prepare();

        }

        prepare(){
            let theme = document.getElementById('theme')
            theme.setAttribute('href', "../src/css/auth.css");
        }

    
        async getData(){
            this.form.innerHTML = ''
            this.raportList.innerHTML = ''
            let data = []
            this.header = document.createElement('h1');
            this.header.innerText = 'Login'
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
            data = ["email", "username", "password", "confirm"]

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
            this.submitButton.innerText = 'Login';


            this.submitButtonBox.appendChild(this.submitButton)
            this.formField.appendChild(this.submitButtonBox)

            this.createUserBox = document.createElement('div')
            this.createUserLink =  document.createElement('a')
            this.createUserLink.innerText = "Utwórz konto"
            this.createUserLink.id = 'createUserLink'
            this.createUserLink.classList.add('create-account')
            this.createUserBox.appendChild(this.createUserLink)

            this.formField.appendChild(this.createUserBox)
            this.form.appendChild(this.formField)

            document.getElementById('div-email').classList.add('hidden-element') 
            document.getElementById('div-confirm').classList.add('hidden-element') 
            // console.log(this.createUserLink.innerText)

            this.createUserLink.addEventListener('click', function(){
                document.getElementById('responseBox').innerHTML = ''
                let inputs = document.getElementsByClassName('input-control')
                Array.from(inputs).forEach(el => {
                    el.children[1].value = ''
                })
                let link = document.getElementById('createUserLink')
                let header = document.getElementById('header')
                if (link.innerText == "Utwórz konto"){
                    document.getElementById('div-email').classList.remove('hidden-element') 
                    document.getElementById('div-confirm').classList.remove('hidden-element') 
                    link.innerText = "Zaloguj się"
                    header.innerText = 'Register'
                }else{
                    document.getElementById('div-email').classList.add('hidden-element') 
                    document.getElementById('div-confirm').classList.add('hidden-element') 
                    link.innerText = "Utwórz konto"
                    header.innerText = 'Login'
                }
                

            }, false)

            this.form.addEventListener('submit', (e) => {

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
                if (validate.valid === true && validate.elements == 2){
                    this.getToken(formData);
                }else if(validate.valid === true && validate.elements == 4){
                    this.createUser(formData)
                }else{
                    console.log("błędne dane")

                }
            })
        }


        validateInputs(formDataObj){
            for (const [key, value] of Object.entries(formDataObj)) {
                let obj = document.getElementById(key) 
                value.trim(); 
                if (value === ''){
                    this.setError(obj, key+" jest wymagany")
                }else if((key === 'email') && (!this.isValidEmail(value))){
                    this.setError(obj, "nieprawidłowy adres email")
                }else if((key === 'password') && (value.length < 6)){
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

        isValidEmail = email => {
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }




        async createUser(formData) {
            await fetch(url+'register', {
                method: "POST",
                body: formData,
            })
            .then(res => {
                // console.log('Fetch - Got response: ', res);
                return res;
              })
            .then(res =>
                res.json().then(data => ({
                  status: res.status,
                  data
                })
            ))
            .then(({ status, data }) => { 
                console.log({ status, data })
                if (status == 200 && data.status == 'success'){
                    // czyszczenie 
                    document.getElementById('responseBox').innerHTML = ''
                    let inputs = document.getElementsByClassName('input-control')
                    Array.from(inputs).forEach(el => {
                        el.children[1].value = ''
                    })
                    // zmiana labeli oraz ukrycie niepotrzebnych pól, usunięcie statusu validacji
                    let link = document.getElementById('createUserLink')
                    let header = document.getElementById('header')
                    document.getElementById('div-email').classList.add('hidden-element') 
                    document.getElementById('div-confirm').classList.add('hidden-element')
                    document.getElementById('div-email').classList.remove('success')
                    document.getElementById('div-username').classList.remove('success')
                    document.getElementById('div-password').classList.remove('success')
                    document.getElementById('div-confirm').classList.remove('success')
                    link.innerText = "Utwórz konto"
                    header.innerText = 'Login'
                    console.log(data.status === 'success')
                }
                else{
                    this.responseBox.innerHTML = ''
                    this.response = document.createElement('div');
                    this.responseStatus = document.createElement('p');
                    this.responseStatus.innerText = status;
                    this.responseStatus.classList.add('response-error')
                    this.responseData = document.createElement('p');
                    this.responseData.innerText = data.status[0];
                    this.responseData.classList.add('response-error')
                    
                    this.responseBox.appendChild(this.responseStatus);
                    this.responseBox.appendChild(this.responseData);
                }
                
             })
            .catch(err => console.log(err));
        }
            
        async getToken(formData) {
            let api_url = url+'login'
            let [response, status] = await callApiPost(api_url, formData);
            console.log(response)
            // console.log(status)
            if (status == 200 && !('status_code' in response)){

                var now = new Date();
                now.setTime(Date.parse(response.token_expire));

                document.cookie='access_token='+response.access_token+
                ';expires='+now+';SameSite=lex';
                document.cookie='refresh_token='+response.refresh_token;
                document.cookie='user='+response.user.username;
                navigateTo('/');
                navBar(response.user.username);
                navBehav();

                
            }else{
                this.responseBox.innerHTML = ''
                this.response = document.createElement('div');
                this.responseStatus = document.createElement('p');
                this.responseStatus.innerText = response.status_code;
                this.responseStatus.classList.add('response-error')
                this.responseData = document.createElement('p');
                this.responseData.innerText = response.detail;
                this.responseData.classList.add('response-error')
                
                this.responseBox.appendChild(this.responseStatus);
                this.responseBox.appendChild(this.responseData);
            }
                
        }
}