import { url } from '../common/data/url.js';
import { callApiPost } from '../features/endpoints/endpoints.js';
import { navigateTo } from '../js/index.js';
import { navBar, navBehav } from '../common/navigation/navigation.js';
import { showPassword } from '../features/showPassword/showPassword.js';
import { alerts } from '../features/alerts/alerts.js';
import AbstractView from './AbstractView.js';
import { showloader, hideloader } from '../features/loading/loading.js';

export default class extends AbstractView {
  constructor() {
    super();
    this.container = document.querySelector('#cont');
    this.data = ['email', 'username', 'password', 'confirm'];
  }

  css() {
    document
      .getElementById('theme')
      .setAttribute('href', '../src/css/auth.css');
    document.getElementById('app-header').setAttribute('style', 'height:0%');
    // document.getElementById('alerts').setAttribute('style', 'height:0%');
  }

  getData() {
    hideloader();
    this.setTitle('Login');
    this.css();
    this.container.innerHTML = '';
    this.createForm();
    this.createInputs();
    this.createSubmit();
    this.createLinks();
  }

  createForm() {
    this.formField = document.createElement('form');
    this.formField.action = '#';
    this.formField.id = 'form';
    this.formField.method = 'post';

    this.header = document.createElement('h1');
    this.header.innerText = 'Login';
    this.header.id = 'header';
    this.formField.appendChild(this.header);

    // Server response section
    this.responseBox = document.createElement('div');
    this.responseBox.id = 'responseBox';
    this.formField.appendChild(this.responseBox);
    this.responseStatus = document.createElement('p');
    this.responseStatus.innerText = '';
    this.responseStatus.classList.add('response-error');
    this.responseData = document.createElement('p');
    this.responseData.innerText = '';
    this.responseData.classList.add('response-error');
    this.responseBox.appendChild(this.responseStatus);
    this.responseBox.appendChild(this.responseData);
  }

  createInputs() {
    // inputs section
    this.data.forEach((each) => {
      const input = document.createElement('div');
      input.classList.add('input-control');
      input.id = 'div-' + each;
      const label = document.createElement('p');
      label.innerText = each;
      const text = document.createElement('input');
      text.name = each;
      text.id = each;
      input.appendChild(label);
      input.appendChild(text);
      if (each === 'password' || each === 'confirm') {
        text.type = 'password';
        const [checkboxBox, checkbox] = this.createCheckBoxes(each);

        if (checkbox != undefined) {
          input.appendChild(checkboxBox);
        }
      } else {
        text.type = 'text';
      }

      const err = document.createElement('div');
      err.classList.add('error');

      input.appendChild(err);
      this.formField.appendChild(input);
    });
  }

  createCheckBoxes(element) {
    const checkboxBox = document.createElement('div');
    checkboxBox.classList.add('show-passwrd');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.onclick = function () {
      showPassword(element);
    };
    const checkboxText = document.createElement('small');
    checkboxText.innerText = 'Show ' + element;
    checkboxBox.appendChild(checkbox);
    checkboxBox.appendChild(checkboxText);
    return [checkboxBox, checkbox];
  }

  createSubmit() {
    const submitButtonBox = document.createElement('div');
    this.submitButton = document.createElement('button');
    this.submitButton.classList.add('submit');
    this.submitButton.innerText = 'Login';

    submitButtonBox.appendChild(this.submitButton);
    this.formField.appendChild(submitButtonBox);
    //Submit
    this.submitButton.addEventListener('click', (e) => {
      e.preventDefault();
      const formData = new FormData(this.formField);
      const formDataObj = {};
      formData.forEach((key, value) => {
        let obj = document.getElementById('div-' + value);
        if (!obj.classList.contains('hidden-element')) {
          formDataObj[value] = key;
        }
      });
      // console.log(formDataObj)
      let validate = this.validateInputs(formDataObj);

      if (validate.valid === true && validate.elements == 2) {
        this.Login(formDataObj);
      } else if (validate.valid === true && validate.elements == 4) {
        this.createUser(formDataObj);
      } else if (validate.valid === true && validate.elements == 1) {
        this.resetPassword(formData);
      } else {
        console.log('błędne dane');
      }
    });
  }

  createLinks() {
    const loginSignupBox = document.createElement('div');
    loginSignupBox.classList.add('loginSignup-box');
    const accountPrefix = document.createElement('p');
    accountPrefix.innerText = "Don't have an account?";
    this.loginSignupLink = document.createElement('a');
    this.loginSignupLink.innerText = 'SignUp';
    this.loginSignupLink.id = 'loginSignup';
    this.loginSignupLink.classList.add('loginSignup');
    loginSignupBox.appendChild(accountPrefix);
    loginSignupBox.appendChild(this.loginSignupLink);
    this.formField.appendChild(loginSignupBox);

    const resetPasswdBox = document.createElement('div');
    resetPasswdBox.classList.add('resetPasswdBox');
    resetPasswdBox.id = 'resetPasswdBox';
    const resetPasswdPrefix = document.createElement('p');
    resetPasswdPrefix.innerText = 'Forgot password?';
    this.resetPasswdLink = document.createElement('a');
    this.resetPasswdLink.innerText = 'Reset your password!';
    resetPasswdBox.appendChild(resetPasswdPrefix);
    resetPasswdBox.appendChild(this.resetPasswdLink);
    this.formField.appendChild(resetPasswdBox);

    this.container.appendChild(this.formField);

    document.getElementById('div-email').classList.add('hidden-element');
    document.getElementById('div-confirm').classList.add('hidden-element');
    // console.log(this.loginSignupLink.innerText)
    //Login SignUp
    this.loginSignupLink.addEventListener(
      'click',
      (e) => {
        document.getElementById('responseBox').innerHTML = '';
        let inputs = document.getElementsByClassName('input-control');
        Array.from(inputs).forEach((el) => {
          el.children[1].value = '';
        });

        if (this.loginSignupLink.innerText == 'SignUp') {
          document
            .getElementById('div-email')
            .classList.remove('hidden-element');
          document
            .getElementById('div-confirm')
            .classList.remove('hidden-element');
          document
            .getElementById('div-username')
            .classList.remove('hidden-element');
          document
            .getElementById('div-password')
            .classList.remove('hidden-element');
          this.header.innerText = 'Register';
          this.submitButton.innerText = 'Register';
          accountPrefix.innerText = 'Already have an account?';
          this.loginSignupLink.innerText = 'Login';
        } else {
          document.getElementById('div-email').classList.add('hidden-element');
          document
            .getElementById('div-confirm')
            .classList.add('hidden-element');
          document
            .getElementById('div-username')
            .classList.remove('hidden-element');
          document
            .getElementById('div-password')
            .classList.remove('hidden-element');
          document
            .getElementById('resetPasswdBox')
            .classList.remove('hidden-element');
          this.header.innerText = 'Login';
          this.submitButton.innerText = 'Login';
          accountPrefix.innerText = "Don't have an account?";
          this.loginSignupLink.innerText = 'SignUp';
        }
      },
      false
    );
    //odzyskiwanie hasła
    this.resetPasswdLink.addEventListener('click', (e) => {
      document.getElementById('responseBox').innerHTML = '';
      let inputs = document.getElementsByClassName('input-control');
      Array.from(inputs).forEach((el) => {
        el.children[1].value = '';
      });
      document.getElementById('div-username').classList.add('hidden-element');
      document.getElementById('div-password').classList.add('hidden-element');
      document.getElementById('div-confirm').classList.add('hidden-element');
      document.getElementById('div-email').classList.remove('hidden-element');
      this.header.innerText = 'Reset';
      submitButton.innerText = 'Reset';
      this.loginSignupLink.innerText = 'Login';
    });
  }

  validateInputs(formDataObj) {
    for (const [key, value] of Object.entries(formDataObj)) {
      let obj = document.getElementById(key);
      let trimedValue = value.trim();
      console.log(trimedValue);
      if (trimedValue === '') {
        this.setError(obj, key + ' jest wymagany');
      } else if (value.indexOf(' ') !== -1) {
        this.setError(obj, 'usuń spacje');
      } else if (key === 'email' && !this.isValidEmail(trimedValue)) {
        this.setError(obj, 'nieprawidłowy adres email');
      } else if (key === 'password' && trimedValue.length < 6) {
        this.setError(obj, 'hasło musi mieć conajmniej 6 znaków');
      } else if (
        key === 'confirm' &&
        trimedValue !== document.getElementById('password').value
      ) {
        this.setError(obj, 'hasła nie pasują');
      } else {
        this.setSuccess(obj);
      }
    }
    let success = document.getElementsByClassName('success');
    if (success.length === Object.keys(formDataObj).length) {
      return { valid: true, elements: Object.keys(formDataObj).length };
    } else {
      return false;
    }
  }

  setError = (element, message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = message;
    inputControl.classList.add('error');
    inputControl.classList.remove('success');
  };

  setSuccess = (element) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = '';
    inputControl.classList.add('success');
    inputControl.classList.remove('error');
  };

  isValidEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  async createUser(formData) {
    // const formDataObj = Object.fromEntries(formData.entries());
    let api_url = url + 'register';
    let [response, status] = await callApiPost(
      api_url,
      JSON.stringify(formData)
    );
    console.log(response);
    console.log(status);
    console.log(formData);
    console.log(formData['username']);
    if (
      status == 200 &&
      response.message == `${formData.username} registered`
    ) {
      // czyszczenie
      document.getElementById('responseBox').innerHTML = '';
      let inputs = document.getElementsByClassName('input-control');
      Array.from(inputs).forEach((el) => {
        el.children[1].value = '';
      });
      // zmiana labeli oraz ukrycie niepotrzebnych pól, usunięcie statusu validacji
      document.getElementById('div-email').classList.add('hidden-element');
      document.getElementById('div-confirm').classList.add('hidden-element');
      removeSuccess();
      this.loginSignupLink.innerText = 'SignUp';
      this.header.innerText = 'Login';
      this.submitButton.innerText = 'Login';
      alerts('Success', response.message, 'alert-green');
    } else {
      this.responseBox.innerHTML = '';
      this.responseStatus = document.createElement('p');
      // this.responseStatus.innerText = status;
      this.responseStatus.classList.add('response-error');
      this.responseData = document.createElement('p');
      // this.responseData.innerText = status
      this.responseData.classList.add('response-error');

      this.responseBox.appendChild(this.responseStatus);
      this.responseBox.appendChild(this.responseData);
      alerts(status + ' Failed', response.detail, 'alert-red');
    }
  }

  async Login(formData) {
    let api_url = url + 'login';
    let [response, status] = await callApiPost(
      api_url,
      JSON.stringify(formData)
    );
    // console.log(response)
    // console.log(status)
    if (status == 200 && !('status_code' in response)) {
      let now = new Date();
      now.setTime(Date.parse(response.token_expire));

      document.cookie =
        'access_token=' +
        response.access_token +
        ';expires=' +
        now +
        ';SameSite=lex';
      document.cookie = 'refresh_token=' + response.refresh_token;
      document.cookie = 'user=' + response.user.username;
      document.getElementById('app-header').removeAttribute('style');
      document.getElementById('alerts').removeAttribute('style');
      navigateTo('/');
      navBar(response.user.username);
      navBehav();
    } else {
      this.responseBox.innerHTML = '';
      this.responseStatus = document.createElement('p');
      this.responseStatus.innerText = response.status_code;
      this.responseStatus.classList.add('response-error');
      this.responseData = document.createElement('p');
      this.responseData.innerText = response.detail;
      this.responseData.classList.add('response-error');

      this.responseBox.appendChild(this.responseStatus);
      this.responseBox.appendChild(this.responseData);
    }
  }

  async resetPassword(formData) {
    const loader = showloader();
    let api_url = url + 'reset_password_link';
    const formDataObj = {};
    formData.forEach((key, value) => {
      let obj = document.getElementById('div-' + value);
      if (!obj.classList.contains('hidden-element')) {
        formDataObj[value] = [key];
      }
    });
    let [response, status] = await callApiPost(
      api_url,
      JSON.stringify(formDataObj)
    );
    console.log(response);
    console.log(status);
    removeSuccess();
    if (status == 200) {
      clearTimeout(loader);
      hideloader();
      this.loginSignupLink.click();
      alerts('Success', response.message, 'alert-green');
    } else {
      alerts(status + ' Failed', response.message, 'alert-red');
    }
  }
}

function removeSuccess() {
  document.getElementById('div-email').classList.remove('success');
  document.getElementById('div-username').classList.remove('success');
  document.getElementById('div-password').classList.remove('success');
  document.getElementById('div-confirm').classList.remove('success');
}
