import { Component, OnInit, AfterViewInit } from "@angular/core";
import Chart from "chart.js";
import * as moment from "moment";
import {first} from "rxjs/operators";
import {OrderService} from "../../../services/api/order.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
})
export class DashboardComponent implements OnInit , AfterViewInit {
  private selectedDateStart=new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  private selectedDateEnd= new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
  selectedTypeFilter='days';
  private endDate:any;
  private startDate:any;
  private orders: any;

  config = {
    type: "line",
    data: {
      labels: [],
      datasets: []
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
      title: {
        display: false,
        text: "Sales Charts",
        fontColor: "white",
      },
      legend: {
        labels: {
          fontColor: "white",
        },
        align: "end",
        position: "bottom",
      },
      tooltips: {
        mode: "index",
        intersect: false,
      },
      hover: {
        mode: "nearest",
        intersect: true,
      },
      scales: {
        xAxes: [
          {
            ticks: {
              fontColor: "rgba(255,255,255,.7)",
            },
            display: true,
            scaleLabel: {
              display: false,
              labelString: "Month",
              fontColor: "white",
            },
            gridLines: {
              //display: false,
              //borderDash: [2],
              //borderDashOffset: [2],
              color: "rgba(255, 255, 255, 0.15)",
               zeroLineColor: "rgba(255, 255, 255, 0.15)",
              //zeroLineBorderDash: [2],
              //zeroLineBorderDashOffset: [2],
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              fontColor: "rgba(255,255,255,.7)",
            },
            display: true,
            scaleLabel: {
              display: false,
              labelString: "Value",
              fontColor: "white",
            },
            gridLines: {
              //borderDash: [3],
              //borderDashOffset: [3],
              drawBorder: false,
              color: "rgba(255, 255, 255, 0.15)",
              zeroLineColor: "rgba(255, 255, 255, 0.15)",
              //zeroLineBorderDash: [2],
              //zeroLineBorderDashOffset: [2],
            },
          },
        ],
      },
    },
  };
  config2 = {
    type: "bar",
    data: {
      labels: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
      ],
      datasets: [
      ],
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
      title: {
        display: false,
        text: "Orders Chart",
      },
      tooltips: {
        mode: "index",
        intersect: false,
      },
      hover: {
        mode: "nearest",
        intersect: true,
      },
      legend: {
        labels: {
          fontColor: "rgba(0,0,0,.4)",
        },
        align: "end",
        position: "bottom",
      },
      scales: {
        xAxes: [
          {
            display: false,
            scaleLabel: {
              display: true,
              labelString: "Month",
            },
            gridLines: {
              borderDash: [2],
              borderDashOffset: [2],
              color: "rgba(33, 37, 41, 0.3)",
              zeroLineColor: "rgba(33, 37, 41, 0.3)",
              zeroLineBorderDash: [2],
              zeroLineBorderDashOffset: [2],
            },
          },
        ],
        yAxes: [
          {
            display: true,
            scaleLabel: {
              display: false,
              labelString: "Value",
            },
            gridLines: {
              borderDash: [2],
              drawBorder: false,
              borderDashOffset: [2],
              color: "rgba(33, 37, 41, 0.2)",
              zeroLineColor: "rgba(33, 37, 41, 0.15)",
              zeroLineBorderDash: [2],
              zeroLineBorderDashOffset: [2],
            },
          },
        ],
      },
    },
  };

  constructor(
    private orderService: OrderService,
  ) {
  }

  ngOnInit() {
  }
  getOrders(){
    this.orderService.get()
      .pipe(first())
      .subscribe(
        data => {
          console.log(data);
          this.orders= data;
          console.log(data);


          this.loadChars();

        },
        error => {
          //this.toastr.error('Invalid request', 'Toastr fun!');
          // this.loading = false;
        });
  }

  loadCharData(){
    this.config.data.labels=[];
    this.config.data.datasets=[
      {
        label: 'Ventas',
        fill: false,
        backgroundColor: "#fff",
        borderColor: "#fff",
        data: [],
      }
    ];
    this.config2.data.labels=[];
    this.config2.data.datasets=[
      {
        label: 'Pedidos',
        backgroundColor: "#ed64a6",
        borderColor: "#ed64a6",
        fill: false,
        barThickness: 8,
        data: [],
      }
    ];
  }
  loadChars(){
    console.log(this.orders[0].created_at); // 14
    this.startDate = new Date(this.selectedDateStart);
    this.endDate = new Date(this.selectedDateEnd);
    let startDate;
    let endDate
    let difference;
    switch (this.selectedTypeFilter) {
      case 'days':
        this.loadCharData();
        startDate = moment(this.startDate);
        endDate = moment(this.endDate);
        difference = endDate.diff(startDate, 'days');
        for(let i = 0; i <= difference; i++) {
          let datasets = this.orders.filter(x => moment(x.created_at).format('YYYY-MM-DD') === startDate.format('YYYY-MM-DD'))
          this.config.data.labels.push(startDate.format('DD'));
          this.config2.data.labels.push(startDate.format('DD'));
          if(datasets){
            this.config.data.datasets[0].data.push(datasets.reduce((acc, {total}) => acc + Number(total)/100, 0));
            this.config2.data.datasets[0].data.push(datasets.length);
          }
          startDate.add(1, 'days');
        }
        break;
      case 'months':
        this.loadCharData();
        startDate = moment(this.startDate).subtract(1, 'months');
        endDate = moment(this.endDate);
        difference = endDate.diff(startDate, 'months');
        for(let i = 0; i <= difference; i++) {
          let datasets = this.orders.filter(x => moment(x.created_at).format('YYYY-MM') === startDate.format('YYYY-MM'));
          this.config.data.labels.push(startDate.format('MMMM'));
          this.config2.data.labels.push(startDate.format('MMMM'));

          if(datasets){
            this.config.data.datasets[0].data.push(datasets.reduce((acc, {total}) => acc + Number(total)/100, 0));
            this.config2.data.datasets[0].data.push(datasets.length);
          }

          startDate.add(1, 'months');
        }
        break;
      case 'years':

        break;
    }
    this.loadConfigChar();
    this.loadConfigCharBar();
    this.loadConfigCharDonut();
  }

  ngAfterViewInit() {
    this.getOrders();
  }
  loadConfigChar(){
    let ctx: any = document.getElementById("line-chart") as HTMLCanvasElement;
    ctx = ctx.getContext("2d");
    let chart = new Chart(ctx, this.config); // Crea una instancia del gráfico
    chart.update({ // Actualiza el gráfico con los nuevos datos
      type: "bar",
      data: {
        labels: this.config.data.labels,
        datasets: this.config.data.datasets
      }
    });
  }
  loadConfigCharBar(){
    let ctx: any = document.getElementById("bar-chart");
    ctx = ctx.getContext("2d");
    let chart = new Chart(ctx, this.config2);
    chart.update({ // Actualiza el gráfico con los nuevos datos
      data: {
        labels: this.config2.data.labels,
        datasets: this.config2.data.datasets
      }
    });
  }

  loadConfigCharDonut(){

    let labels=[];
    let data =[];
     const products = this.orders.reduce((accumulator, pedido) => {
      return accumulator.concat(pedido.details);
    }, []);
    console.log('products');
    console.log(products);

    const totalProducts = products.reduce((accumulator, product) => {
      const existingProduct = accumulator.find(p => p.variation.id === product.variation.id);
      console.log('existingProduct');
      console.log(product.variation.id);
      console.log(existingProduct);

      if (existingProduct) {
        existingProduct.quantity = Number(existingProduct.quantity)
        existingProduct.quantity += Number(product.quantity);
        return accumulator;
      }
      console.log(accumulator);

      return accumulator.concat(product);
    }, []);
    console.log('totalProducts');
    console.log(totalProducts);
    const topFive = totalProducts
      .map(p => ({ ...p, rank: 1 / p.quantity }))
      .sort((a, b) => a.rank - b.rank)
      .slice(0, 5);
    topFive.forEach(product => {
      labels.push(product.variation.product.name);
      data.push(product.quantity);
      console.log(`Producto: ${product.producto}, Cantidad: ${product.cantidad}, Rango: ${product.rank}`);
    });
    console.log(topFive);
    const config = {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          label: 'My First Dataset',
          data,
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
            'rgb(40, 100, 70)',
            'rgb(54, 50, 200)'
          ],
          hoverOffset: 4
        }]
      },
    };
    let ctx: any = document.getElementById("donut-chart");
    ctx = ctx.getContext("2d");
    let chart = new Chart(ctx, config);
  }
  onDateChangeStart(event: any) {
    this.selectedDateStart = event.target.value;
    console.log(this.selectedDateStart);
    this.loadChars();
  }
  onDateChangeEnd(event: any) {
    this.selectedDateEnd = event.target.value;
    console.log(this.selectedDateEnd);
    this.loadChars();
  }

  onTypeFilter(event: any) {
    this.selectedTypeFilter = event.target.value;
    console.log(this.selectedTypeFilter);
    this.loadChars();
  }
}
