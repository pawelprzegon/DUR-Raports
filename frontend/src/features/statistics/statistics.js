import {capitalized} from "../upperCase/upperCase.js"
import {navigateTo} from '../../js/index.js'


function maxChartValue(data){
    let max = 0
    for (const value of Object.values(data)){
        for (let v of Object.values(value.chart)){
        v=parseInt(v, 10)
        if (v > max){
            max = v;
        };
        }
    };

    max += 1;
    return max
}

export class allStatistics{ 
    constructor(data){
        this.data = data
    }

    getColors(ctx){
        let colors = []
        let red = ctx.createLinearGradient(0, 0, 0, 450);
        red.addColorStop(0, 'rgba(215, 72, 72, 0.7)');
        red.addColorStop(0.5, 'rgba(215, 72, 72, 0.3)');
        red.addColorStop(1, 'rgba(215, 72, 72, 0)');
        let green = ctx.createLinearGradient(0, 0, 0, 450);
        green.addColorStop(0, 'rgba(61, 196, 90, 0.7)');
        green.addColorStop(0.5, 'rgba(61, 196, 90, 0.3)');
        green.addColorStop(1, 'rgba(61, 196, 90, 0)');
        let blue = ctx.createLinearGradient(0, 0, 0, 450);
        blue.addColorStop(0, 'rgba(30, 144, 255, 0.7)');
        blue.addColorStop(0.5, 'rgba(30, 144, 255, 0.3)');
        blue.addColorStop(1, 'rgba(30, 144, 255, 0)');
    
        colors.push([green, 'rgb(58, 204, 43)'])
        colors.push([red, 'rgb(228, 63, 63)'])
        colors.push([blue, 'rgb(30, 144, 255)'])
        return colors
    }

    charts(){
    let max = maxChartValue(this.data.statistics);
    let labels = []
    for (const [key, value] of Object.entries(this.data.statistics)) {
        for (const [k, v] of Object.entries(value.chart)){
            if (!labels.includes(k)) {
                labels.push(k);
            }
        }
    }
    
    let ctx = document.getElementById("charts").getContext('2d');
    let color = this.getColors(ctx)
    window.chart = new Chart(ctx, {
        type: 'line',
    data: {
        labels: labels,
        datasets: [
            {   
                label: "Stolarnia",
                data: Object.values(this.data.statistics.stolarnia.chart),
                backgroundColor: color[0][0],
                pointBackgroundColor: 'white',
                borderColor: color[0][1],
                tension: 0.2,
                borderWidth: 2,
                fill: true
            },
            {
                label: "Drukarnia",
                data: Object.values(this.data.statistics.drukarnia.chart),
                backgroundColor: color[1][0],
                pointBackgroundColor: 'white',
                borderColor: color[1][1],
                tension: 0.2,
                borderWidth: 2,
                fill: true
            },
            {
                label: "Bibeloty",
                data: Object.values(this.data.statistics.bibeloty.chart),
                backgroundColor: color[2][0],
                pointBackgroundColor: 'white',
                borderColor: color[2][1],
                tension: 0.2,
                borderWidth: 2,
                fill: true
            }
        ]
    },
    options: {
        maintainAspectRatio: 2,
        responsive: true,
        plugins: {
        title: {
            display: true,
            text: 'Ilość zaraportowanych awarii',
            padding: {
            top: 10,
            bottom: 20
            },
            font: {
            weight: 'bold',
            size: 16,
            }
        },
        tooltip: {
            mode: 'index'
        },
        },
        interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
        },
        scales: {
        x: {
            title: {
            display: true,
            text: 'Month'
            }
        },
        y: {
            stacked: false,
            title: {
            display: true,
            text: 'Value'
            },
            min: 0,
            max: max,
            ticks: {
            stepSize: 1
            }
        }
        }
        }
    });
    }


    users(){
        let users = document.createElement('div')
        users.classList.add('users')
        for(const[key, value] of Object.entries(this.data.user_raport)){
            let user = document.createElement('div')
            user.classList.add('user')
            let userLabelBox = document.createElement('div')
            userLabelBox.classList.add('user-style-label')
            let userLabel = document.createElement('h4')
            userLabel.innerText = capitalized(key)
            let userQuantityBox = document.createElement('div')
            userQuantityBox.classList.add('user-style')
            let userQuantity = document.createElement('p')
            userQuantity.innerText = value +' szt'
            userLabelBox.appendChild(userLabel)
            userQuantityBox.appendChild(userQuantity)
            user.appendChild(userLabelBox)
            user.appendChild(userQuantityBox)
            users.appendChild(user)
        }
        return users
    }

    statistics(){
        let statistics = document.createElement('div')
        statistics.classList.add('statistics')
        for(const [key, value] of Object.entries(this.data.statistics)){
            let box = this.block(key, value)
            statistics.appendChild(box)
        }
        return statistics
    }

    block(key, value){
        let place = document.createElement('div')
        place.id = key
        place.classList.add('place')
        let placeLabelBox = document.createElement('div')
        placeLabelBox.classList.add('labelBox')
        let placeLabel = document.createElement('h2')
        placeLabel.innerText = capitalized(key)

        let placequantity = document.createElement('h3')
        placequantity.innerText = this.placeQuantity(value) +' szt'
        placeLabelBox.appendChild(placeLabel)
        placeLabelBox.appendChild(placequantity)
        place.appendChild(placeLabelBox)
        for(const [k,v] of Object.entries(value.items)){
            let elemBox = document.createElement('div')
            elemBox.classList.add('elemBox')
            let elemLabelBox = document.createElement('div')
            elemLabelBox.classList.add('elem-style')
            let elemLabel = document.createElement('p')
            elemLabel.id = k
            elemLabel.innerText = k;
            elemLabel.addEventListener("click", () => {
                navigateTo('/search/'+capitalized(k));
            })
            let elemQuantityBox = document.createElement('div')
            elemQuantityBox.classList.add('elem-style')
            let elemQuantity = document.createElement('p')
            elemQuantity.innerText = v[0]
            let elemProcentageBox = document.createElement('div')
            elemProcentageBox.classList.add('elem-style')
            let elemProcentage = document.createElement('p')
            elemProcentage.innerText = v[1]
            let elemQuantityJedn = document.createElement('small')
            elemQuantityJedn.innerText = 'szt'

            elemQuantity.appendChild(elemQuantityJedn)
            elemLabelBox.appendChild(elemLabel)
            elemQuantityBox.appendChild(elemQuantity)
            elemProcentageBox.appendChild(elemProcentage)
            elemBox.appendChild(elemLabelBox)
            elemBox.appendChild(elemQuantityBox)
            elemBox.appendChild(elemProcentageBox)
            
            place.appendChild(elemBox)
          
        }
        return place
    }

    placeQuantity(value){
        let x = 0
        for (const v of Object.values(value.chart)){
            x+=v
        }
        return x
    }
}




export class searchingStatistics{
    constructor(response, searching){
        this.response = response
        this.searching = searching
    }

    statistics(){

        let search = document.createElement('div')
        search.classList.add('searching')

        let place = document.createElement('div')
        place.classList.add('place')
        let placeLabelBox = document.createElement('div')
        placeLabelBox.classList.add('labelBox')
        let placeLabel = document.createElement('h2')
        placeLabel.innerText = capitalized(this.searching)
        place.id = Object.keys(this.response)
        placeLabelBox.appendChild(placeLabel)
        place.appendChild(placeLabelBox)
        

        for(const value of Object.values(this.response)){
            let obj = Array.isArray(value.items)
            for(const [k,v] of Object.entries(value.items)){
                let box = this.block(k,v, obj)
                place.appendChild(box)
            }
            
        }

        search.appendChild(place)
        return search
    }

    block(k,v, obj){
        let elemBox = document.createElement('div')
        elemBox.classList.add('elemBox')
        let elemLabelBox = document.createElement('div')
        elemLabelBox.classList.add('elem-style')
        let elemLabel = document.createElement('p')
        let elemQuantity = document.createElement('p')
        let elemQuantityJedn = document.createElement('small')
        if (obj == true){
            elemLabel.innerText = v.date
            elemLabel.addEventListener("click", () => {
                navigateTo('/raport/'+v.id);
            })
        }else{
            elemLabel.innerText = k
            elemQuantity.innerText = v
            elemQuantityJedn.innerText = 'szt'

        }
        elemQuantity.appendChild(elemQuantityJedn)
        elemLabelBox.appendChild(elemLabel)
        elemBox.appendChild(elemLabelBox)
        elemBox.appendChild(elemQuantity)
        return elemBox
    }

    charts(){
        console.log(this.response)
        let max = maxChartValue(this.response);
        let labels = []
        let data = []
        for (const value of Object.values(this.response)) {
            for (const [k, v] of Object.entries(value.chart)){
                if (!labels.includes(k)) {
                    labels.push(k);
                }
                if (!data.includes(v)) {
                    data.push(v);
                }
            }
        }

        
        let ctx = document.getElementById("charts").getContext('2d');
        window.chart = new Chart(ctx, {
            type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: this.searching,
                    data: data,
                    backgroundColor: "rgba(12, 143, 3, 0.3)",
                    borderColor: "rgba(12, 143, 3, 0.3",
                    tension: 0.2,
                    borderWidth: 2,
                    fill: true
                }
            ]
        },
        options: {
            maintainAspectRatio: 2,
            responsive: true,
            plugins: {
            title: {
                display: true,
                text: 'Ilość zaraportowanych awarii',
                padding: {
                top: 10,
                bottom: 20
                },
                font: {
                weight: 'bold',
                size: 16,
                }
            },
            tooltip: {
                mode: 'index'
            },
            },
            interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
            },
            scales: {
            x: {
                title: {
                display: true,
                text: 'Month'
                }
            },
            y: {
                stacked: false,
                title: {
                display: true,
                text: 'Value'
                },
                min: 0,
                max: max,
                ticks: {
                stepSize: 1
                }
            }
            }
            }
        });
    }
}

