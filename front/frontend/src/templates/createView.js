import AbstractView from './AbstractView.js';
import { url } from '../common/data/url.js';
import { callApiPut } from '../features/endpoints/endpoints.js';
import { navigateTo } from '../js/index.js';
import { hideloader } from '../features/loading/loading.js';
import { SliderForm } from '../features/swiper/slider.js';
import { getCookieValue } from '../features/cookie/index.js';
import { checkAuth } from '../features/endpoints/endpoints.js';
import { alerts } from '../features/alerts/alerts.js';

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.params = params;
    if ('_id' in this.params) {
      this.currentRaport = JSON.parse(sessionStorage.getItem('active_raport'));
      this.setTitle('Edit ' + this.params._id);
      this.api_url = url + 'update/';
    } else {
      this.setTitle('New');
      this.api_url = url + 'create/';
    }

    this.regioList = new Object();
    this.regioList = {};
    this.regioList['stolarnia'] = ['pilarka', 'zbijarka', 'kompresor', 'inne'];
    this.regioList['drukarnia'] = [
      'xeikon',
      'mutoh',
      'impala',
      'latex',
      'fotoba',
      'zgrzewarka',
      'kompresor',
      'inne',
    ];
    this.regioList['bibeloty'] = [
      'ZUND',
      'laminarka',
      'hotpress',
      'eBS',
      'mieszalnik',
      'dozownik',
      'summa',
      'inne',
    ];
    this.users = ['Adam', 'Pawel', 'Bartek'];
  }

  css() {
    document
      .getElementById('theme')
      .setAttribute('href', '../src/css/create.css');
  }

  async getData() {
    try {
      let [auth_response, auth_status] = await checkAuth(url + 'auth');
      if (
        (auth_status == 202 && auth_response.detail == 'authenticated') ||
        (auth_status == 200 && auth_response.access_token)
      ) {
        this.show();
      }
    } catch (error) {
      alerts('error', error, 'alert-red');
    }
  }

  show() {
    this.css();
    this.container = document.querySelector('#cont');
    this.container.innerHTML = '';

    this.content = document.createElement('div');
    this.content.classList = 'content';
    this.content.id = 'content';
    this.formBody = document.createElement('div');
    this.formBody.classList.add('form-body', 'swiper');
    this.formBody.id = 'form-data';

    this.form = document.createElement('form');
    this.form.action = '#';
    this.form.id = 'form';
    this.form.method = 'post';
    this.form.classList.add('slide-content');

    this.formWrapper = document.createElement('div');
    this.formWrapper.classList.add('swiper-wrapper');

    this.form.appendChild(this.formWrapper);
    this.formBody.appendChild(this.form);
    this.content.appendChild(this.formBody);

    this.container.appendChild(this.content);

    this.regions('stolarnia');
    this.regions('drukarnia');
    this.regions('bibeloty');
    this.deklaracje();
    this.plexi();

    if ('_id' in this.params) {
      this.fillForm();
      this.events(this.api_url, this.params._id);
    } else {
      this.events(this.api_url);
    }
    this.SliderNav();
    this.submit();
    this.build();
    SliderForm();
  }

  regions(place) {
    this.formField = document.createElement('div');
    this.formField.classList.add('swiper-slide');

    for (const [key, value] of Object.entries(this.regioList)) {
      if (key == place) {
        let labels = this.createLabels(key.capitalize());
        let checkboxes = this.createCheckboxes(value, key);
        // let text = this.createTextFields(place);
        const elements = document.createElement('div');
        elements.classList.add('elements');
        elements.appendChild(checkboxes);
        // elements.appendChild(text);
        this.formField.appendChild(labels);
        this.formField.appendChild(elements);
      }
    }

    this.formWrapper.appendChild(this.formField);
  }

  deklaracje() {
    const deklTextBox = document.createElement('div');
    deklTextBox.classList.add('swiper-slide', 'deklaracje');

    const deklLabelBox = document.createElement('div');
    deklLabelBox.classList.add('label-box');
    const deklLabel = document.createElement('p');
    deklLabel.innerText = 'Deklaracje';
    deklLabelBox.appendChild(deklLabel);

    const deklTextField = document.createElement('div');
    deklTextField.classList.add('deklaracje-describe-areas');

    this.users.forEach((user) => {
      const box = document.createElement('div');
      box.classList.add('deklaracje-box');
      const label = document.createElement('span');
      label.classList.add('raport-describe-label');
      label.innerText = user;
      const inputField = document.createElement('textarea');
      inputField.classList.add('raport-describe-users');
      inputField.name = 'dekl_' + user;
      inputField.id = 'dekl_' + user;
      inputField.rows = '10';

      box.appendChild(label);
      box.appendChild(inputField);
      deklTextField.appendChild(box);
      // RegionField.appendChild(deklTextField)
      deklTextBox.appendChild(deklLabelBox);
      deklTextBox.appendChild(deklTextField);

      this.formWrapper.appendChild(deklTextBox);
    });
  }

  plexi() {
    const PlexiTextField = document.createElement('div');
    PlexiTextField.classList.add('swiper-slide', 'deklaracje');

    const plexiLabelBox = document.createElement('div');
    plexiLabelBox.classList.add('label-box');

    const plexiLabel = document.createElement('p');
    plexiLabel.innerText = 'Raport Plexi';
    plexiLabelBox.appendChild(plexiLabel);

    const box = document.createElement('div');
    box.classList.add('plexi-box');
    let boxes = {
      printed_plexi: 'Wydrukowano (szt)',
      wrong_plexi: 'Błędnie wydrukowano (szt)',
      factor_plexi: 'Współczynnik (%)',
    };
    for (const [key, value] of Object.entries(boxes)) {
      let boxN = document.createElement('div');
      boxN.classList.add('input-data');
      let label = document.createElement('p');
      label.classList.add('plexi-input-label');
      label.innerText = value;
      let inputPlace = document.createElement('input');
      inputPlace.name = key;
      inputPlace.id = key;
      inputPlace.classList.add('plexi-input');

      boxN.appendChild(label);
      boxN.appendChild(inputPlace);
      box.appendChild(boxN);
    }

    PlexiTextField.appendChild(plexiLabelBox);
    PlexiTextField.appendChild(box);
    this.formWrapper.appendChild(PlexiTextField);
  }

  SliderNav() {
    const next = document.createElement('div');
    next.classList.add('swiper-button-next');
    const prev = document.createElement('div');
    prev.classList.add('swiper-button-prev');
    const paginate = document.createElement('div');
    paginate.classList.add('swiper-pagination');

    this.form.appendChild(next);
    this.form.appendChild(prev);
    this.form.appendChild(paginate);
  }

  submit() {
    const SubmitField = document.createElement('div');
    SubmitField.classList.add('submitField');
    SubmitField.id = 'wrapper';
    const submitButton = document.createElement('button');
    submitButton.classList.add('submit');
    submitButton.type = 'submit';
    submitButton.innerText = 'Zapisz';

    SubmitField.appendChild(submitButton);
    this.form.appendChild(SubmitField);
  }

  build() {
    this.content.appendChild(this.formBody);
  }

  async events(api_url, id) {
    let form = document.getElementById('form');

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      const formData = new FormData(form);
      const formDataObj = {};
      let st = {};
      let dr = {};
      let bib = {};
      let plexi = {};
      let dekl = {};
      formData.forEach((key, value) => {
        let splited_value = value.split('-');
        if (key != '' && splited_value[2] == 'text') {
          let name =
            splited_value[0] +
            '-' +
            splited_value[1] +
            '-number-' +
            splited_value[3];
          let unit = splited_value[1];
          let number = formData.get(name);
          let entry =
            unit.capitalize() + ' ' + number.capitalize() + ': ' + key;
          if (splited_value[0] == 'stolarnia') {
            st[unit + '_' + number] = entry;
            formDataObj[splited_value[0]] = st;
          } else if (splited_value[0] == 'drukarnia') {
            dr[unit + '_' + number] = entry;
            formDataObj[splited_value[0]] = dr;
          } else if (splited_value[0] == 'bibeloty') {
            bib[unit + '_' + number] = entry;
            formDataObj[splited_value[0]] = bib;
          }
        } else {
          if (value.split('_')[1] == 'plexi' && key != '') {
            plexi[value.split('_')[0]] = key;
            formDataObj['plexi'] = plexi;
          } else if (value.split('_')[0] == 'dekl') {
            dekl[value.split('_')[1]] = key;
            formDataObj['dekl'] = dekl;
          }
        }
      });

      let username = getCookieValue('user');
      formDataObj['username'] = username;
      if (id) {
        formDataObj['id'] = id;
      }
      let data = JSON.stringify(formDataObj);

      try {
        let [auth_response, auth_status] = await checkAuth(url + 'auth');
        if (
          (auth_status == 202 && auth_response.detail == 'authenticated') ||
          (auth_status == 200 && auth_response.access_token)
        ) {
          let [response, status] = await callApiPut(api_url, data);
          if (status == 200 && response.message) {
            alerts(status, response.message, 'alert-green');
            navigateTo('/');
          } else {
            alerts(status, response, 'alert-red');
          }
        }
      } catch (error) {
        hideloader();
        alerts('error', error, 'alert-red');
      }
    });
  }

  fillForm() {
    this.currentRaport.units.forEach((item) => {
      let text_boxes = document.querySelectorAll(
        `.text-box-${item.region}-${item.unit.toLowerCase()}`
      );
      let counter = text_boxes.length - 1;
      let isTextFieldEmpty = document.querySelector(
        `#${item.region}-${item.unit.toLowerCase()}-text-${counter}`
      ).value;

      // create new empty details-text
      if (isTextFieldEmpty.trim() !== '') {
        this.create_new_entry(item, text_boxes);
        counter += 1;
      }

      // check checkmark
      document.getElementById(
        `${item.region}` + '_' + `${item.unit.toLowerCase()}`
      ).checked = true;
      // if unit have a number then fill number textarea
      if (item.number) {
        console.log(item.number);
        document.querySelector(
          `#${item.region}-${item.unit.toLowerCase()}-number-${counter}`
        ).value = item.number;
      }

      // fill text textarea
      let text = document.querySelector(
        `#${item.region}-${item.unit.toLowerCase()}-text-${counter}`
      );
      console.log(counter);
      console.log(text);
      text.value = item.info.split(': ')[1];
      // unhide number and text textarea
      text.parentNode.parentNode.parentNode.parentNode.classList.remove(
        'hidden'
      );
    });
    console.log(this.currentRaport.dekl[0]);
    console.log(this.currentRaport.plexi[0]);
    for (const [key, value] of Object.entries(this.currentRaport.dekl[0])) {
      document.getElementById(`dekl_${key.capitalize()}`).value = value;
    }

    if (
      this.currentRaport.hasOwnProperty('plexi') &&
      this.currentRaport.plexi.length != 0
    ) {
      for (const [key, value] of Object.entries(this.currentRaport.plexi[0])) {
        document.getElementById(key + '_plexi').value = value;
      }
    }
  }

  create_new_entry(item, text_boxes) {
    let new_text = this.create_details(
      item.region.toLowerCase(),
      item.unit.toLowerCase()
    );
    text_boxes[0].parentNode.appendChild(new_text);
  }

  // labele
  createLabels(lab) {
    const LabelBox = document.createElement('div');
    LabelBox.classList.add('label-box');
    const regionLabel = document.createElement('p');
    regionLabel.innerText = lab;
    LabelBox.appendChild(regionLabel);
    return LabelBox;
  }

  //dodawanie checkboxów
  createCheckboxes(data, lab) {
    const region = document.createElement('div');
    region.classList.add('regions');

    const CheckBoxesBox = document.createElement('div');
    CheckBoxesBox.classList.add('checkboxes');
    let i = 1;
    data.forEach((each) => {
      const unit = document.createElement('div');
      unit.classList.add('checkbox-unit');
      const checkbox = document.createElement('label');
      checkbox.classList.add('label-container');
      const label = document.createElement('div');
      label.classList.add('label');
      label.innerText = each.capitalize();
      checkbox.appendChild(label);
      const span = document.createElement('span');
      span.classList.add('checkmark');
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.id = lab + '_' + each.toLowerCase();
      input.name = each.toLowerCase();
      input.value = lab;
      i += 1;

      checkbox.appendChild(input);
      checkbox.appendChild(span);

      const details = document.createElement('div');
      details.classList.add('details', 'hidden');
      const details_text = document.createElement('div');
      details_text.classList.add('details-text');
      const text_box = this.create_details(lab, each.toLowerCase());
      details_text.appendChild(text_box);
      const buttonBox = document.createElement('div');
      buttonBox.classList.add('addBtnBox');
      const add = document.createElement('button');
      add.type = 'button';
      add.innerText = '+';
      buttonBox.appendChild(add);
      details.appendChild(details_text);
      details.appendChild(buttonBox);

      unit.appendChild(checkbox);
      unit.appendChild(details);

      region.appendChild(unit);

      input.addEventListener('change', (event) => {
        if (event.currentTarget.checked) {
          const opened_text = document.querySelectorAll('.open');
          opened_text.forEach((element) => {
            element.classList.remove('open');
          });
          details.classList.remove('hidden');
        } else {
          details.classList.add('hidden');
          let text_fields = document.querySelectorAll(`.${lab}-${each}-text`);
          text_fields.forEach((element) => {
            element.classList.remove('open');
          });
        }
      });
      add.addEventListener('click', () => {
        let new_text = this.create_details(lab, each);
        details_text.appendChild(new_text);
      });
    });
    return region;
  }

  create_details(lab, each) {
    let number = document.querySelectorAll(`.text-box-${lab}-${each}`).length;
    const text_box = document.createElement('div');
    text_box.classList.add(`text-box-${lab}-${each}`);
    const number_box = document.createElement('div');
    number_box.classList.add('number-box');
    const number_field = document.createElement('textarea');
    number_field.classList.add(`${lab}-${each}-number`);
    number_field.name = `${lab}-${each}-number-${number}`;
    number_field.id = `${lab}-${each}-number-${number}`;
    number_field.rows = '1';
    number_box.appendChild(number_field);

    const descript_box = document.createElement('div');
    descript_box.classList.add('descript-box');
    const text_field = document.createElement('textarea');
    text_field.classList.add(`${lab}-${each}-text`);
    text_field.name = `${lab}-${each}-text-${number}`;
    text_field.id = `${lab}-${each}-text-${number}`;
    text_field.rows = '1';
    text_field.addEventListener('click', function () {
      const opened_text = document.querySelectorAll('.open');
      opened_text.forEach((element) => {
        element.classList.remove('open');
      });
      text_field.classList.toggle('open');
    });
    descript_box.appendChild(text_field);
    text_box.appendChild(number_box);
    text_box.appendChild(descript_box);
    return text_box;
  }
}
