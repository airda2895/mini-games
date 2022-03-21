import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MazeGame } from './maze-game.component';

describe('MazeComponent', () => {
  let component: MazeGame;
  let fixture: ComponentFixture<MazeGame>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MazeGame ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MazeGame);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
