import { Injectable } from '@angular/core';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as am5percent from '@amcharts/amcharts5/percent'
import * as tw from '../../../tailwind.config';
import * as am5 from '@amcharts/amcharts5';

export declare type Chart = 'pie' | 'funnel' | 'bar' | 'column';


@Injectable({
   providedIn: 'root',
})
export class ChartsService {
   primary = (tw.theme?.extend?.colors as any)?.['primary'];
   gap = 40;
   // colors = this.colors_array();

   set_chart(type: Chart, root: am5.Root, id: string, data: any[]) {
      root = am5.Root.new(id);

      root.setThemes([am5themes_Animated.new(root)]);
      if(type == 'pie' || type == 'funnel') {
         const chart_type = type == 'pie' ? 'PieChart' : 'SlicedChart';
         const series_type = type == 'pie' ? 'PieSeries' : 'FunnelSeries';

         let chart = root.container.children.push(
            am5percent[chart_type].new(root, {
               layout: root.verticalLayout,
               scale: 0.90,
            })
         );

         let series = (chart as any).series.push(
            am5percent[series_type].new(root, {
               valueField: 'value',
               categoryField: 'category',
               alignLabels: type == 'pie' ? undefined : false,
               orientation: type == 'pie' ? undefined : 'vertical',
            })
         );

         // series.get("colors")?.set("colors", this.colors);
         series.data.setAll(data);
         series.appear(1000, 100);
      }
   }
/*
   colors_array() {
      let rgb: any = this.hex_to_rgb(this.primary);
      let arr: any = Object.values(rgb);
      let max: any = Math.max(...arr);
      let max_key: any = Object.keys(rgb).find((key: any) => rgb[key] === max)?.toString();
      let min: any = Math.min(...arr);
      let min_key: any = Object.keys(rgb).find((key: any) => rgb[key] === min)?.toString();

      let array: any = [
         am5.color('rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')'),
      ];
      while (max >= this.gap) {
         max -= this.gap;
         let nv = { ...rgb, [max_key]: max };
         array.push(am5.color('rgb(' + nv.r + ',' + nv.g + ',' + nv.b + ')'));
      }
      while (min <= 255) {
         min += this.gap
         let nv = { ...rgb, [min_key]: min, [max_key]: max };
         array.push(am5.color('rgb(' + nv.r + ',' + nv.g + ',' + nv.b + ')'));
      }
      return array;
   }

   hex_to_rgb(hex: string) {
      let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
         hex
      ) as RegExpExecArray;
      return {
         r: parseInt(result[1], 16),
         g: parseInt(result[2], 16),
         b: parseInt(result[3], 16),
      };
   } */
}
