export default class{
    constructor(params){
        this.params = params;
    }
    

    setTitle(title){
        document.title = title;
    }

    async getData(){
        return `
        <div class="alerts" id="alerts">
        <div class="spinner-border" 
             role="status" id="loading">
             <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
        </div>
        <div class="alert" id="alert">
            <span class="alert-close" data-close="alert" title="Close">&times;</span>
        </div>
    </div>
    <div class="container" id="cont">
        <div class="slide-container swiper" id="raport">
          
        </div>
    </div>
        `
    }
    
}