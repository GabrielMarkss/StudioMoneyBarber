import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendamentoEzequielComponent } from './agendamento-ezequiel.component';

describe('AgendamentoEzequielComponent', () => {
  let component: AgendamentoEzequielComponent;
  let fixture: ComponentFixture<AgendamentoEzequielComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgendamentoEzequielComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgendamentoEzequielComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
