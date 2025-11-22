import { Component, Input } from '@angular/core';
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent'
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as am5xy from '@amcharts/amcharts5/xy'
import * as tw from '../../../../../tailwind.config';

export interface LineData {
   value: number
   date: string
}

@Component({
   selector: 'line-chart',
   standalone: true,
   imports: [],
   templateUrl: './line.component.html',
   styleUrl: './line.component.scss'
})
export class LineChart {
   private root!: am5.Root;
   random = (Math.random() * 10).toFixed(4);
   @Input({ required: true }) data: LineData[] = [];


   ngAfterViewInit(): void {
      this.root = am5.Root.new('line-chart' + this.random);

      let chart = this.root.container.children.push(am5xy.XYChart.new(this.root, {
         panX: true,
         panY: true,
         wheelX: "panX",
         wheelY: "zoomX",
         pinchZoomX: true,
         paddingLeft: 0
      }));

      let cursor = chart.set("cursor", am5xy.XYCursor.new(this.root, {
         behavior: "none"
      }));
      cursor.lineY.set("visible", false);

      let xAxis = chart.xAxes.push(am5xy.DateAxis.new(this.root, {
         maxDeviation: 0.2,
         baseInterval: {
            timeUnit: "day",
            count: 1
         },
         renderer: am5xy.AxisRendererX.new(this.root, {
            minorGridEnabled: true
         }),
         tooltip: am5.Tooltip.new(this.root, {})
      }));

      let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(this.root, {
         renderer: am5xy.AxisRendererY.new(this.root, {
            pan: "zoom"
         })
      }));

      let series = chart.series.push(am5xy.LineSeries.new(this.root, {
         name: "Series",
         xAxis: xAxis,
         yAxis: yAxis,
         valueYField: "value",
         valueXField: "date",
         tooltip: am5.Tooltip.new(this.root, {
            labelText: "{valueY}"
         }),
         fill: am5.color((tw.theme?.extend?.colors as any)?.['primary']),
         stroke: am5.color((tw.theme?.extend?.colors as any)?.['primary'])
      }));

      chart.set("scrollbarX", am5.Scrollbar.new(this.root, {
         orientation: "horizontal"
      }));

      series.data.setAll(this.date(this.data));

      series.appear(1000);
      chart.appear(1000, 100);
   }


   date(array: any[]) {
      return array.map((item: any) => { return { ...item, date: new Date(item.date).getTime() } })
   }
}
