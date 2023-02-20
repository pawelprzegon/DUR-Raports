import {url} from "../../common/data/index.js"

export  class Auth {


        constructor() {

            this.data = ["email", "password", "confirm"]
            this.form = document.getElementById('form')

            this.formField = document.createElement('form')
            this.formField.action = "#"
            this.formField.id = "form"
            this.formField.method = "post"

            this.theme();
        }

        theme(){
            let theme = document.getElementById('theme')
            theme.setAttribute('href', "/src/features/auth/style.css");

            this.raportList = document.querySelector('#raport');
            this.raportList.innerHTML = '';
                
            this.FormList = document.querySelector('#form-data');
            this.FormList.innerHTML='';
        }


        validateInputs(formDataObj){

            for (const [key, value] of Object.entries(formDataObj)) {
                let obj = document.getElementById(`${key}`) 
                value.trim();
                if (value === ''){
                    this.setError(obj, key+" jest wymagany")
                }else if((key === 'email') && (!this.isValidEmail(`${value}`))){
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
                return true
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


        async getapi(formDataObj) {
            let data = JSON.stringify(formDataObj);
            console.log(data);
            let h = new Headers();
            h.append('Accept', 'application/json');
            let encoded = window.btoa(`${data['email']}`+':'+`${data['password']}`);
            let auth = 'Basic ' + encoded;
            h.append('Authorization', auth)
            console.log(auth)
            fetch('https://ghsdfgh.onrender.com/login/', {
                method: "PUT",
                headers: h,
                // body: data,
            })
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(err => console.log(err))
      
        }
        


        register(){
            this.header = document.createElement('h1');
            this.header.innerText = "Register"
            this.form.appendChild(this.header)

            this.data.forEach(each => {
                this.elemBox = document.createElement('div');
                this.elemBox.classList.add('input-control')
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
                this.form.appendChild(this.elemBox)
            })

            this.submitButtonBox = document.createElement('div');
            this.submitButton = document.createElement('button');
            this.submitButton.classList.add('submit');
            this.submitButton.type = "submit";
            this.submitButton.innerText = "Register";

            this.submitButtonBox.appendChild(this.submitButton)
            this.form.appendChild(this.submitButtonBox)

            this.FormList.appendChild(this.form)

            
            
            let data = document.getElementById('form')
            data.addEventListener('submit', (e) => {

                e.preventDefault();

                const formData = new FormData(data);
                const formDataObj = {};

                formData.forEach((key, value) => {
                    formDataObj[value] = key;
                })
               
                console.log(formDataObj)
                let validate = this.validateInputs(formDataObj);

                if (validate === true){
                    
                }else{
                    console.log("błędne dane logowania")
                }

            })
            
        }


        login(){

            this.header = document.createElement('h1');
            this.header.innerText = "Login"
            this.form.appendChild(this.header)

            this.data.forEach(each => {
                if (each !== "confirm"){
                    this.elemBox = document.createElement('div');
                    this.elemBox.classList.add('input-control')
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
                    this.form.appendChild(this.elemBox)
                }
            })

            this.submitButtonBox = document.createElement('div');
            this.submitButton = document.createElement('button');
            this.submitButton.classList.add('submit');
            this.submitButton.type = "submit";
            this.submitButton.innerText = "Login";

            this.submitButtonBox.appendChild(this.submitButton)
            this.form.appendChild(this.submitButtonBox)

            this.FormList.appendChild(this.form)


            let data = document.getElementById('form')
            data.addEventListener('submit', (e) => {

                e.preventDefault();

                const formData = new FormData(data);
                const formDataObj = {};

                formData.forEach((key, value) => {
                    formDataObj[value] = key;
                })
               
                console.log(formDataObj)
                let validate = this.validateInputs(formDataObj);

                if (validate === true){
                    this.getapi(formDataObj);
                    
                }else{
                    console.log("błędne dane logowania")
                }

            })
        }
}