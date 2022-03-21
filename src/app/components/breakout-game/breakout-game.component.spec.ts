import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreakoutGameComponent } from './breakout-game.component';

describe('BreakoutGameComponent', () => {
  let component: BreakoutGameComponent;
  let fixture: ComponentFixture<BreakoutGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BreakoutGameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BreakoutGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
