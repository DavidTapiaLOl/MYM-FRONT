import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioIngresoComponent } from './formulario-ingreso.component';

describe('FormularioIngresoComponent', () => {
  let component: FormularioIngresoComponent;
  let fixture: ComponentFixture<FormularioIngresoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormularioIngresoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormularioIngresoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
