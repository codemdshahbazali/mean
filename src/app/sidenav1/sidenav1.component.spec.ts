import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sidenav1Component } from './sidenav1.component';

describe('Sidenav1Component', () => {
  let component: Sidenav1Component;
  let fixture: ComponentFixture<Sidenav1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Sidenav1Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Sidenav1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
