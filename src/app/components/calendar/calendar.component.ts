import { Component, Input } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';

import interactionPlugin from '@fullcalendar/interaction';

export class Event {
   id?: string = ''
   title?: string = ''
   start?: string = ''
   end?: string = ''
   date?: string = ''
}
@Component({
   selector: 'ui-calendar',
   standalone: true,
   imports: [FullCalendarModule],
   templateUrl: './calendar.component.html',
   styleUrl: './calendar.component.scss'
})
export class CalendarComponent {
   @Input() event_click!: (arg: any) => void;
   @Input() date_click!: (arg: any) => void;
   @Input({ required: true }) events: Event[] = [];


   calendarOptions: CalendarOptions = {
      initialView: 'dayGridMonth',
      plugins: [dayGridPlugin, interactionPlugin],
      locale: 'ES'
   };


   ngAfterViewInit(): void {
      this.calendarOptions.events = this.events;
      this.calendarOptions.eventClick = this.event_click;
      this.calendarOptions.dateClick = this.date_click;
   }

}
