// import { getColors } from './colors.js';
import { navigateTo } from '../../js/index.js';
import { capitalized } from '../upperCase/upperCase.js';

export class createCharts {
  constructor(data, canvas) {
    this.data = data;
    this.ctx = canvas;
    this.chart;
    this.labels = [];
    this.dataset = [];
  }

  get_labels_and_data() {
    for (const [key, value] of Object.entries(this.data)) {
      this.labels.push(key.capitalize());
      this.dataset.push(value);
    }
  }

  get_labels_and_data_lineChart() {
    for (const value of Object.values(this.data)) {
      for (const k of Object.keys(value.chart)) {
        if (!this.labels.includes(k)) {
          this.labels.push(k);
        }
      }
    }
  }

  line_config() {
    // let color = getColors(this.ctx);
    let colors = ['#E069c1', '#69e0a3', '#Ffcf03'];
    for (const [index, [key, value]] of Object.entries(
      Object.entries(this.data)
    )) {
      let data = {
        label: key,
        data: value.chart,
        pointBackgroundColor: colors[index],
        borderColor: colors[index],
        backgroundColor: '#eeeeee6e',
        tension: 0.2,
        borderWidth: 2,
        fill: true,
      };
      this.dataset.push(data);
    }
  }

  doughnut_config() {
    return {
      data: this.dataset,
      backgroundColor: '#eeeeee6e',
      borderColor: ['#b3b3b3', '#868686', '#5a5a5a'],
      borderWidth: 2,
    };
  }

  bar_config() {
    return {
      data: this.dataset,
      backgroundColor: '#eeeeee6e',
      borderColor: '#b3b3b3',
      borderWidth: 2,
    };
  }

  doughnutChart() {
    this.get_labels_and_data();
    let dataset = this.doughnut_config();
    this.chart = new Chart(this.ctx, {
      type: 'doughnut',
      data: {
        labels: this.labels,
        datasets: [dataset],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        hoverBackgroundColor: ['#b3b3b3', '#868686', '#5a5a5a'],
        plugins: {
          legend: {
            position: 'left',
          },
          title: {
            display: false,
          },
        },
      },
    });
  }

  barChart() {
    this.get_labels_and_data();
    let dataset = this.bar_config();
    this.chart = new Chart(this.ctx, {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [dataset],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        hoverBackgroundColor: '#b3b3b3',
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: false,
          },
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            grid: {
              display: false,
            },
          },
        },
      },
    });
    this.ctx.onclick = this.clickHandler;
  }

  lineChart() {
    this.get_labels_and_data_lineChart();
    this.line_config();
    this.chart = new Chart(this.ctx, {
      type: 'line',
      data: {
        labels: this.labels,
        datasets: this.dataset,
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
            align: 'start',
            labels: {
              font: {
                size: 12,
              },
            },
          },
          tooltip: {
            mode: 'index',
          },
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false,
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'miesiąc',
            },
            grid: {
              display: false,
            },
          },
          y: {
            stacked: false,
            title: {
              display: true,
              text: 'ilość',
            },
            grid: {
              display: false,
            },
            min: 0,
            // max: max,
            ticks: {
              stepSize: 1,
            },
          },
        },
      },
    });
  }

  clickHandler = (click) => {
    const points = this.chart.getElementsAtEventForMode(
      click,
      'nearest',
      { intersect: true },
      true
    );
    if (points.length) {
      const firstPoint = points[0];
      // console.log(firstPoint);
      const value = this.chart.data.labels[firstPoint.index];
      console.log(value);
      navigateTo('/search/' + capitalized(value));
    }
  };
}
