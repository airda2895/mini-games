import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceInvadersGameComponent } from './space-invaders-game.component';

describe('SpaceInvadersGameComponent', () => {
  let component: SpaceInvadersGameComponent;
  let fixture: ComponentFixture<SpaceInvadersGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpaceInvadersGameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaceInvadersGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
