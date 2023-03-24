import {capitalized} from "../upperCase/upperCase.js"
export class statisticsBox{ 
    constructor(key, value){
        this.key = key
        this.value = value
        console.log(this.key, this.value)
    }

    build(){
        let place = document.createElement('div')
        place.classList.add('place')
        let placeLabelBox = document.createElement('div')
        placeLabelBox.classList.add('labelBox')
        let placeLabel = document.createElement('h2')
        placeLabel.innerText = capitalized(this.key)
        
        placeLabelBox.appendChild(placeLabel)
        place.appendChild(placeLabelBox)
        let elemBox = document.createElement('div')
        elemBox.classList.add('elemBox')
        let elemLabelBox = document.createElement('div')
        elemLabelBox.classList.add('elem-style')
        let elemQuantityBox = document.createElement('div')
        elemQuantityBox.classList.add('elem-style')
        let elemQuantityJedn = document.createElement('small')
        
        let elemLabel = document.createElement('p')
        let elemQuantity = document.createElement('p')
        let elemProcentageBox = document.createElement('div')
        elemProcentageBox.classList.add('elem-style')
        let elemProcentage = document.createElement('p')

        if (this.value instanceof Array){
            for(const [k,v] of Object.entries(this.value.items)){
                elemLabel.innerText = k;
                elemQuantity.innerText = v[0]
                elemProcentage.innerText = v[1]
                elemQuantityJedn.innerText = 'szt'
                place.id = this.key
            }
        }else{
            place.id = this.key
            elemQuantity.innerText = this.value

        }
        elemQuantity.appendChild(elemQuantityJedn)
        elemLabelBox.appendChild(elemLabel)
        elemQuantityBox.appendChild(elemQuantity)
        elemProcentageBox.appendChild(elemProcentage)
        elemBox.appendChild(elemLabelBox)
        elemBox.appendChild(elemQuantityBox)
        elemBox.appendChild(elemProcentageBox)
        
        place.appendChild(elemBox)
          
        
        return place
    }
    
}
