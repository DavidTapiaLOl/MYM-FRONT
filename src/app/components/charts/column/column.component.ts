import { Component, Input, inject } from '@angular/core';
import * as am5 from '@amcharts/amcharts5';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as am5xy from '@amcharts/amcharts5/xy'
import * as tw from '../../../../../tailwind.config';
import { ChartsService } from '../../../services/charts.service';

export interface ColumnData {
   value: number
   category: string
}
@Component({
  selector: 'column-chart',
  standalone: true,
  imports: [],
  templateUrl: './column.component.html',
  styleUrl: './column.component.scss'
})
export class ColumnChart {
   private _charts: ChartsService = inject(ChartsService)
   private root!: am5.Root;

   random = (Math.random() * 10).toFixed(4)
   @Input({ required: true }) data: ColumnData[] = [];

    ngAfterViewInit() {
      this.root = am5.Root.new('column-chart' + this.random);

      this.root.setThemes([am5themes_Animated.new(this.root)]);

      let chart = this.root.container.children.push(
         am5xy.XYChart.new(this.root, {
            panX: true,
            panY: true,
            wheelX: "panX",
            wheelY: "zoomX",
            layout: this.root.verticalLayout
         })
      );

      let cursor = chart.set("cursor", am5xy.XYCursor.new(this.root, {}));
      cursor.lineY.set("visible", false);

      let xRenderer = am5xy.AxisRendererX.new(this.root, {
         minGridDistance: 30,
         minorGridEnabled: true
       });

       xRenderer.labels.template.setAll({
         rotation: -90,
         centerY: am5.p50,
         centerX: am5.p100,
         paddingRight: 15
       });

       xRenderer.grid.template.setAll({
         location: 1
       })

       let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(this.root, {
         maxDeviation: 0.3,
         categoryField: "category",
         renderer: xRenderer,
         tooltip: am5.Tooltip.new(this.root, {})
       }));

       let yRenderer = am5xy.AxisRendererY.new(this.root, {
         strokeOpacity: 0.1
       })

       let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(this.root, {
         maxDeviation: 0.3,
         renderer: yRenderer
       }));

       let series = chart.series.push(am5xy.ColumnSeries.new(this.root, {
         name: "Series 1",
         xAxis: xAxis,
         yAxis: yAxis,
         valueYField: "value",
         sequencedInterpolation: true,
         categoryXField: "category",
         tooltip: am5.Tooltip.new(this.root, {
           labelText: "{valueY}"
         })
       }));

       series.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5, strokeOpacity: 0 });

       series.columns.template.adapters.add("fill", function (fill, target) {
          return chart.get("colors")!.getIndex(series.columns.indexOf(target));
         });

         series.columns.template.adapters.add("stroke", function (stroke, target) {
            return chart.get("colors")!.getIndex(series.columns.indexOf(target));
         });

         xAxis.data.setAll(this.data);
         series.data.setAll(this.data);

         series.appear(1000);
         chart.appear(1000, 100);

   }

   ngOnDestroy() {
      if (this.root) this.root.dispose();
   }
}
