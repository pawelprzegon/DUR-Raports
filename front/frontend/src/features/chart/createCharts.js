import { navigateTo } from '../../js/index.js';
import { sort_dates } from './sort_dates.js';
import { getColors } from './colors.js';

export class createCharts {
  constructor(data, canvas, department) {
    this.data = data;
    this.ctx = canvas.getContext('2d');
    this.department = department;
    this.chart;
    this.labels = [];
    this.dataset = [];
    this.colors = [
      '#69e0a3',
      '#E069c1',
      '#Ffcf03',
      '#ff8503',
      '#ffa600',
      '#b82e2e',
      '#32b82e',
      '#8c11d4',
    ];
    this.labels_color = 'rgb(200,200,200)';
  }

  get_labels_and_data() {
    for (const [key, value] of Object.entries(this.data)) {
      this.labels.push(key);
      this.dataset.push(value);
    }
  }

  get_labels_and_data_lineChart() {
    let labels = [];
    for (const value of Object.values(this.data)) {
      for (const k of Object.keys(value.chart)) {
        if (!labels.includes(k)) {
          labels.push(k);
        }
      }
    }
    this.labels = sort_dates(labels);
  }

  line_config() {
    for (const [index, [key, value]] of Object.entries(
      Object.entries(this.data)
    )) {
      let data = {
        label: key.capitalize(),
        data: value.chart,
        pointBackgroundColor: this.colors[index],
        borderColor: this.colors[index],
        backgroundColor: getColors(this.ctx, this.colors[index]),
        tension: 0.2,
        borderWidth: 2,
        fill: true,
      };
      this.dataset.push(data);
    }
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
              color: this.labels_color,
              font: {
                size: 13,
              },
            },
          },
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false,
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: this.labels_color,
            },
          },
          y: {
            stacked: false,
            title: {
              display: true,
              text: 'ilość',
              color: this.labels_color,
            },
            grid: {
              display: false,
            },
            min: 0,
            // max: max,
            ticks: {
              stepSize: 1,
              color: this.labels_color,
            },
          },
        },
      },
    });
  }

  bar_config(color) {
    return {
      data: this.dataset,
      backgroundColor: getColors(this.ctx, color),
      borderColor: color,
      borderWidth: 2,
    };
  }
  barChart() {
    let color = this.get_department_color();
    this.get_labels_and_data();
    let dataset = this.bar_config(color);
    this.chart = new Chart(this.ctx, {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [dataset],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        hoverBackgroundColor: color,
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
            ticks: {
              stepSize: 1,
              color: this.labels_color,
            },
          },
          y: {
            grid: {
              display: false,
            },
            ticks: {
              stepSize: 1,
              color: this.labels_color,
            },
          },
        },
      },
    });
    this.ctx.onclick = this.clickHandler;
  }

  doughnut_config() {
    return {
      data: this.dataset,
      backgroundColor: [
        getColors(this.ctx, '#78a1bb'),
        getColors(this.ctx, '#ebf5ee'),
        getColors(this.ctx, '#bfa89e'),
      ],
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
        plugins: {
          legend: {
            position: 'left',
            labels: {
              color: this.labels_color,
              font: {
                size: 13,
              },
            },
          },
          title: {
            display: false,
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
      const value = this.chart.data.labels[firstPoint.index];
      navigateTo('/search/' + value.capitalize());
    }
  };

  get_department_color() {
    if (this.department.capitalize() === 'Stolarnia') {
      return this.colors[0];
    } else if (this.department.capitalize() === 'Drukarnia') {
      return this.colors[1];
    } else if (this.department.capitalize() === 'Bibeloty') {
      return this.colors[2];
    } else {
      return '#0084d2';
    }
  }
}
