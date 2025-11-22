import { Component, Input, SimpleChanges, inject } from '@angular/core';
import * as am5 from '@amcharts/amcharts5';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as am5xy from '@amcharts/amcharts5/xy'
import { ChartsService } from '../../../services/charts.service';


export interface BarData {
   monto: number,
   mes: string
}
@Component({
  selector: 'bar-chart',
  templateUrl: './bar.component.html',
  styleUrl: './bar.component.scss'
})
export class BarChart {
   private _charts: ChartsService = inject(ChartsService)
   private root!: am5.Root;
   random = (Math.random() * 10).toFixed(4);
   @Input({ required: true }) data: BarData[] = [];
   new_data: BarData [] = []

   ngOnChanges(changes: SimpleChanges): void {
    console.log(this.data);

      // Cuando detecte los cambios los igualamos a data
      this.new_data = changes["data"]?.currentValue ?? this.new_data

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

       let cursor = chart.set("cursor", am5xy.XYCursor.new(this.root, {}));
       cursor.lineX.set("visible", false);

       let yRenderer = am5xy.AxisRendererY.new(this.root, {
         cellStartLocation: 0.1,
         cellEndLocation: 0.9,
         minorGridEnabled: true
       });

       yRenderer.grid.template.set("location", 1);

       let yAxis = chart.yAxes.push(
         am5xy.CategoryAxis.new(this.root, {
           categoryField: "mes",
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
             minGridDistance:70
           })
         })
       );

       let series = chart.series.push(am5xy.ColumnSeries.new(this.root, {
         name: Object.keys(this.new_data[0]).filter((key: string) => key != 'monto').toString().toUpperCase(),
         xAxis: xAxis,
         yAxis: yAxis,
         valueXField: "monto",
         categoryYField: "mes",
         sequencedInterpolation: true,
         tooltip: am5.Tooltip.new(this.root, {
           pointerOrientation: "horizontal",
           labelText: "{valueX}"/* "[bold]{name}[/]\n{categoryY}: {valueX}" */
         })
       }));

       series.columns.template.setAll({
         height: am5.percent(70)
       });



       series.data.setAll(this.new_data);

       series.appear();

       series.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5, strokeOpacity: 0 });
         series.columns.template.adapters.add("fill", function (fill, target) {
         return chart.get("colors")!.getIndex(series.columns.indexOf(target));
         });

         series.columns.template.adapters.add("stroke", function (stroke, target) {
         return chart.get("colors")!.getIndex(series.columns.indexOf(target));
         });
         // chart.get("colors")?.set("colors", this._charts.colors);

       chart.appear(1000, 100);
   }

}
