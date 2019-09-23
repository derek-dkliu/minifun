import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TowersComponent } from './towers.component';

describe('TowersComponent', () => {
  let component: TowersComponent;
  let fixture: ComponentFixture<TowersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TowersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TowersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
