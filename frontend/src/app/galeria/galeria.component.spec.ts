import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GaleriaComponent } from '../galeria/galeria.component';

describe('DashtesteComponent', () => {
  let component: GaleriaComponent;
  let fixture: ComponentFixture<GaleriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GaleriaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GaleriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
