import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemovePage } from './remove.page';

describe('RemovePage', () => {
  let component: RemovePage;
  let fixture: ComponentFixture<RemovePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemovePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemovePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
