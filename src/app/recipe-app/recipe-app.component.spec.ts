import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeAppComponent } from './recipe-app.component';

describe('RecipeAppComponent', () => {
  let component: RecipeAppComponent;
  let fixture: ComponentFixture<RecipeAppComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecipeAppComponent]
    });
    fixture = TestBed.createComponent(RecipeAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
