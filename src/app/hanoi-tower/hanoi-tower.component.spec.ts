import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HanoiTowerComponent } from './hanoi-tower.component';

describe('HanoiTowerComponent', () => {
  let component: HanoiTowerComponent;
  let fixture: ComponentFixture<HanoiTowerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HanoiTowerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HanoiTowerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
