import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelAuxilioComponent } from './panel-auxilio.component';

describe('PanelAuxilioComponent', () => {
  let component: PanelAuxilioComponent;
  let fixture: ComponentFixture<PanelAuxilioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanelAuxilioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelAuxilioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
