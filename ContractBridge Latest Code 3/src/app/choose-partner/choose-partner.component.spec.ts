import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoosePartnerComponent } from './choose-partner.component';

describe('ChoosePartnerComponent', () => {
  let component: ChoosePartnerComponent;
  let fixture: ComponentFixture<ChoosePartnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChoosePartnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoosePartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
