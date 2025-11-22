import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TablerIconsModule.pick(TablerIcons)
  ],
  exports: [
    TablerIconsModule
  ]
})
export class IconsModule { }
