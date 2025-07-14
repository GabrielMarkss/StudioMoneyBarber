import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendamentoFelipeComponent } from '../agendamento-felipe/agendamento-felipe.component';

describe('DashtesteComponent', () => {
  let component: AgendamentoFelipeComponent;
  let fixture: ComponentFixture<AgendamentoFelipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgendamentoFelipeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AgendamentoFelipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
