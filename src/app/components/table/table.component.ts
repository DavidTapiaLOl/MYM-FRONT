import {
   Component,
   EventEmitter,
   Input,
   Output,
   SimpleChanges,
   ViewChild,
   inject,
} from '@angular/core';
import { LayoutService } from '../../services/layout.service';
import { MatTableDataSource } from '@angular/material/table';
import { FilterComponent } from './filter/filter.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';

@Component({
   selector: 'ui-table',
   templateUrl: './table.component.html',
   styleUrl: './table.component.scss',
})
export class TableComponent {
   private _dialog: MatDialog = inject(MatDialog);
   public _router: Router = inject(Router);
   public _layout: LayoutService = inject(LayoutService);

   _data: any[] = [];
   columns: any[] = [];
   applied_filters: any[] = [];
   ui_data!: MatTableDataSource<any>;

   @Output() eliminar = new EventEmitter<any>
   @Output() clicktabla = new EventEmitter<any>
   @Input() filters: any = [];
   @Input({ required: true }) data: any[] = [];

   @ViewChild(MatSort) sort!: MatSort;
   @ViewChild(MatPaginator) paginator!: MatPaginator;

   async ngOnChanges(changes: SimpleChanges) {
      // --- CORRECCIÓN: Validación de datos ---
      const incomingData = changes['data']?.currentValue;
      
      // Si incomingData es un arreglo real, lo usamos. Si es null, undefined o un error, usamos []
      this._data = Array.isArray(incomingData) ? incomingData : [];

      this.ui_data = new MatTableDataSource(this._data);
      this.ui_data.paginator = this.paginator;
      this.ui_data.sort = this.sort;

      // Solo calculamos columnas si hay datos
      if (this._data.length > 0) {
         this.columns = Object.keys(this._data[0]);
         if (!this.columns.includes('Acciones')) {
            this.columns.push('Acciones');
         }
      } else {
         this.columns = [];
      }
   }

   ngAfterViewInit(): void {
   }

   async filter(query: string) {
      this.ui_data.filter = query
         .trim()
         .normalize('NFD')
         .replace(/[\u0300-\u036f]/g, '')
         .toLowerCase();

      if (this.ui_data.paginator) this.ui_data.paginator.firstPage();
   }

   async open_filters() {
      this._dialog
         .open(FilterComponent, {
            data: {
               data: this._data,
               filters: this.filters,
               applied_filters: this.applied_filters,
            },
         })
         .afterClosed()
         .subscribe(async (filter_data: any[]) => {
            if (filter_data && !Object.values(filter_data).every(x => x == null || x == '')) {
               this.applied_filters = filter_data;
               await this.apply_filter(filter_data);
            }
         });
   }

   async delete_filter(key: any) {
      delete this.applied_filters[key];

      if (Object.keys(this.applied_filters).length > 0)
         await this.apply_filter(this.applied_filters);
      else {
         this.ui_data = new MatTableDataSource(this._data);
         this.ui_data.paginator = this.paginator;
         this.ui_data.sort = this.sort;
      }
   }

   async apply_filter(filter_data: any) {
      this.ui_data.filterPredicate = (data: any) => {
         for (const key in filter_data)
            if (data[key] == filter_data[key]) return true;
         return false;
      };
      this.ui_data.filter = JSON.stringify(filter_data);
   }

   clickElemento(elemento: any){
    this.clicktabla.emit(elemento);
   }

   eliminarElemento(elemento:any){
    this.eliminar.emit(elemento);
   }
}