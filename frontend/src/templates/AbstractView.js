export default class{
    constructor(params){
        this.params = params;
    }
    

    setTitle(title){
        document.title = title;
    }

    async getData(){
        return `
        <div class="alerts">
            <div class="err" id="err"></div>
            <div class="spinner-border" 
                 role="status" id="loading">
                 <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
            </div>
        </div>
        <div class='content' id="content">
            <div class="swiper slide-form" id="form-data"></div>
            <div class="user" id="user"></div>
            <div class="raport-content" id="raport-content">
                <div class="dekl" id="dekl"></div>
                <div class="issues" id="issues"></div>
            </div>
        </div>
        <div class="slide-container swiper" id="raport">
          
        </div>
        `
    }
    
}