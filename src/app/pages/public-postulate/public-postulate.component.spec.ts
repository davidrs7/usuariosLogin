import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicPostulateComponent } from './public-postulate.component';

describe('PublicPostulateComponent', () => {
  let component: PublicPostulateComponent;
  let fixture: ComponentFixture<PublicPostulateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicPostulateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicPostulateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
