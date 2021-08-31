import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxAceComponent } from './ngx-ace.component';

describe('NgxAceComponent', () => {
  let component: NgxAceComponent;
  let fixture: ComponentFixture<NgxAceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxAceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxAceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
