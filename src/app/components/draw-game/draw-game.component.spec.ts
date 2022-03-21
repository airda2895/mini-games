import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawGame } from './draw-game.component';

describe('DrawGameComponent', () => {
  let component: DrawGame;
  let fixture: ComponentFixture<DrawGame>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrawGame ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawGame);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
