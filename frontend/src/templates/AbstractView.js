export default class{
    constructor(params){
        this.params = params;
    }
    

    setTitle(title){
        document.title = title;
    }

    async getData(){
        return `
        
        <div class="d-flex justify-content-center">
            <div class="err" id="err"></div>
            <div class="spinner-border" 
                role="status" id="loading">
                <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
            </div>
        </div>
        <div id="form-data">
            <form action="#" method="post" id="form">
            
            </form>
        </div>
        <ul class="raport-grid" id="raport">
        
        </ul>
        
        `
    }
    
}