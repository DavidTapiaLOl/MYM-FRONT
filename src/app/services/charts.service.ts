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

}
