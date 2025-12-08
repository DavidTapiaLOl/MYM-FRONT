import { Component, Input, SimpleChanges, inject, AfterViewInit, OnDestroy, OnChanges, NgZone } from '@angular/core';
import * as am5 from '@amcharts/amcharts5';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as am5xy from '@amcharts/amcharts5/xy';
import { ChartsService } from '../../../services/charts.service';

@Component({
  selector: 'bar-chart',
  templateUrl: './bar.component.html',
  styleUrl: './bar.component.scss' // Asegúrate que este archivo exista, o usa .css
})
export class BarChart implements AfterViewInit, OnChanges, OnDestroy {
   private _charts: ChartsService = inject(ChartsService);
   private zone: NgZone = inject(NgZone);
   private root!: am5.Root;
   
   random = (Math.random() * 10).toFixed(4);
   
   @Input({ required: true }) data: any[] = [];
   new_data: any[] = [];

   ngAfterViewInit() {
      this.initChart();
   }

   ngOnChanges(changes: SimpleChanges): void {
      this.new_data = changes["data"]?.currentValue ?? this.new_data;
      
   
      this.initChart();
   }

   ngOnDestroy(): void {
      this.disposeChart();
   }

   private disposeChart() {
      if (this.root) {
         this.root.dispose();
      }
   }

   private initChart() {
     
      if (!this.new_data || this.new_data.length === 0) {
         return;
      }

     
      const chartDiv = document.getElementById('bar-chart' + this.random);
      if (!chartDiv) {
    
         setTimeout(() => this.initChart(), 100);
         return;
      }

      this.disposeChart();

      this.zone.runOutsideAngular(() => {
         this.root = am5.Root.new('bar-chart' + this.random);
         this.root.setThemes([am5themes_Animated.new(this.root)]);

         let chart = this.root.container.children.push(
            am5xy.XYChart.new(this.root, {
               panX: false,
               panY: false,
               wheelX: "panX",
               wheelY: "zoomX",
               paddingLeft: 0,
               layout: this.root.verticalLayout
            })
         );

         let legend = chart.children.push(
            am5.Legend.new(this.root, {
               centerX: am5.p50,
               x: am5.p50
            })
         );

         let yRenderer = am5xy.AxisRendererY.new(this.root, {
            cellStartLocation: 0.1,
            cellEndLocation: 0.9,
            minorGridEnabled: true
         });

         yRenderer.grid.template.set("location", 1);

         let yAxis = chart.yAxes.push(
            am5xy.CategoryAxis.new(this.root, {
               categoryField: "category",
               renderer: yRenderer,
               tooltip: am5.Tooltip.new(this.root, {})
            })
         );

         yAxis.data.setAll(this.new_data);

         let xAxis = chart.xAxes.push(
            am5xy.ValueAxis.new(this.root, {
               min: 0,
               renderer: am5xy.AxisRendererX.new(this.root, {
                  strokeOpacity: 0.1,
                  minGridDistance: 70
               })
            })
         );

         if (this.new_data.length > 0) {
             let firstItem = this.new_data[0];
             Object.keys(firstItem).forEach(key => {
                 if (key !== 'category') {
                     this.createSeries(chart, key, key, xAxis, yAxis);
                 }
             });
         }
         
         legend.data.setAll(chart.series.values);
         chart.appear(1000, 100);
      });
   }

   private createSeries(chart: am5xy.XYChart, name: string, fieldName: string, xAxis: any, yAxis: any) {
       let series = chart.series.push(am5xy.ColumnSeries.new(this.root, {
           name: name,
           xAxis: xAxis,
           yAxis: yAxis,
           valueXField: fieldName,
           categoryYField: "category",
           sequencedInterpolation: true,
           stacked: true,
           tooltip: am5.Tooltip.new(this.root, {
               pointerOrientation: "horizontal",
               labelText: "[bold]{name}[/]\n{categoryY}: ${valueX}"
           })
       }));

       series.columns.template.setAll({
           height: am5.percent(70),
           cornerRadiusTR: 5,
           cornerRadiusBR: 5
       });

       series.data.setAll(this.new_data);
       series.appear();
   }
}