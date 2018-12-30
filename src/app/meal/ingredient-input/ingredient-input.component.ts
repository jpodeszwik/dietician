import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Ingredient } from 'src/app/ingredient';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-ingredient-input',
  templateUrl: './ingredient-input.component.html',
  styleUrls: ['./ingredient-input.component.css']
})
export class IngredientInputComponent implements OnInit {
  @Input() ingredient: Ingredient;
  filteredIngredients: Observable<Ingredient[]>;
  formControl = new FormControl();

  constructor() {
    const ingredients = [new Ingredient('0', 'Milk', 10, 5, 5, 100), new Ingredient('1', 'Butter', 5, 10, 10, 250)];
    this.filteredIngredients = this.formControl.valueChanges
      .pipe(
        startWith(''),
        map(value => {
          const filterValue = value.toLowerCase();
          return ingredients.filter(option => option.name.toLowerCase().includes(filterValue));
        })
      );
  }

  ngOnInit() {
    this.formControl.setValue(this.ingredient.name);
  }

}
