import { Component, Input, inject } from '@angular/core';
import { ChartsService } from '../../../shared/services/charts.service';
import * as am5 from '@amcharts/amcharts5';

export interface PieData {
   value: number
   category: string
}

@Component({
   selector: 'pie-chart',
   standalone: true,
   imports: [],
   templateUrl: './pie.component.html',
   styleUrl: './pie.component.scss',
})
export class PieChart {
   private _charts: ChartsService = inject(ChartsService)
   private root!: am5.Root;

   @Input({ required: true }) data: PieData[] = [];

   random = (Math.random() * 10).toFixed(4);

   ngAfterViewInit(): void {
      this._charts.set_chart('pie', this.root, 'pie-chart' + this.random, this.data)
   }

   ngOnDestroy() {
      if (this.root) this.root.dispose();
   }
}
