import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExitPopUpComponent } from './exit-pop-up.component';

describe('ExitPopUpComponent', () => {
  let component: ExitPopUpComponent;
  let fixture: ComponentFixture<ExitPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExitPopUpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExitPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
