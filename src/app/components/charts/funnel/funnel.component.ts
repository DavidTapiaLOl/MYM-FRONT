import { Component, Input, inject } from '@angular/core';
import * as am5 from '@amcharts/amcharts5';
import { ChartsService } from '../../../services/charts.service';

export interface FunnelData {
   value: number
   category: string
}

@Component({
  selector: 'funnel-chart',
  standalone: true,
  imports: [],
  templateUrl: './funnel.component.html',
  styleUrl: './funnel.component.scss'
})
export class FunnelChart {
   private root!: am5.Root;
   private _charts: ChartsService = inject(ChartsService)

   @Input({ required: true }) data: FunnelData[] = [];

   random = (Math.random() * 10).toFixed(4);

   ngAfterViewInit(): void {
      this._charts.set_chart('funnel', this.root, 'funnel-chart' + this.random, this.data)
   }


   ngOnDestroy() {
      if (this.root) this.root.dispose();
   }
}
