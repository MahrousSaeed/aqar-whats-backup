import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AqaratComponent } from './aqarat.component';

describe('AqaratComponent', () => {
  let component: AqaratComponent;
  let fixture: ComponentFixture<AqaratComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AqaratComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AqaratComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
