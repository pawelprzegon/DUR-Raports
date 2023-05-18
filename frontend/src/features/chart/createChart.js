

export class createNewChart{ 
    constructor(data, canvas, searching){
        this.data = data
        this.chart
        this.ctx = canvas.getContext('2d');
        this.searching = searching
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

    statisticsData(){
        let color = this.getColors(this.ctx)
        let labels = []
        let readyDataset = []
        for (const value of Object.values(this.data.statistics)) {
            for (const k of Object.keys(value.chart)){
                if (!labels.includes(k)) {
                    labels.push(k);
                }
            }
        }
        
        for (const[index, [key, value]] of Object.entries(Object.entries(this.data.statistics))){
            let data = {
                label: key,
                data: value.chart,
                backgroundColor: color[index][0],
                pointBackgroundColor: 'white',
                borderColor: color[index][1],
                tension: 0.2,
                borderWidth: 2,
                fill: true
            };
            readyDataset.push(data)
        };
        return [labels, readyDataset]
    }

    searchData(){
        let color = this.getColors(this.ctx)
        let labels = []
        let data = []
        for (const k of Object.keys(this.data.searching.chart)) {
            if (!labels.includes(k)) {
                labels.push(k);
            }
        }

        let readyDataset = [{
            label: this.searching,
            data: this.data.searching.chart,
            backgroundColor: color[0][0],
            pointBackgroundColor: 'white',
            borderColor: color[0][1],
            tension: 0.2,
            borderWidth: 2,
            fill: true
        }]
        return [labels, readyDataset]
    }

    newChart(){
        let labels, datasets
        
        if (this.searching != undefined || this.searching != null){
            
            [labels, datasets] = this.searchData()
        }else{
            [labels, datasets] = this.statisticsData()
        }
        
        this.chart = new Chart(this.ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                maintainAspectRatio: false,
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
                    // max: max,
                    ticks: {
                    stepSize: 1
                    }
                }
                }
            }
        });

    }

    getChart(){
        return this.chart
    }

}