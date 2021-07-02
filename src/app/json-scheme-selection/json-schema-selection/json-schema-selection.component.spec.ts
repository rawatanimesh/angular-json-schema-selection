import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonSchemaSelectionComponent } from './json-schema-selection.component';

describe('JsonSchemaSelectionComponent', () => {
  let component: JsonSchemaSelectionComponent;
  let fixture: ComponentFixture<JsonSchemaSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JsonSchemaSelectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JsonSchemaSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
