import {Component, OnInit, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import {MatTable} from '@angular/material';

import {Meal} from '../../model/meal';
import {Ingredient} from '../../model/ingredient';
import {MealIngredient} from '../../model/meal.ingredient';
import {Observable} from 'rxjs';
import {IngredientsService} from 'src/app/ingredients.service';

@Component({
  selector: 'app-meal',
  templateUrl: './meal.component.html',
  styleUrls: ['./meal.component.css']
})
export class MealComponent implements OnInit {
  @Input() meal: Meal;
  @Output() remove: EventEmitter<any> = new EventEmitter();
  @ViewChild(MatTable) table: MatTable<MealIngredient>;
  columnsToDisplay = ['name', 'weight', 'proteins', 'carbohydrates', 'fats', 'nutritionValue', 'removeIngredient'];
  ingredients: Observable<Ingredient[]>;

  constructor(ingredientService: IngredientsService) {
    this.ingredients = ingredientService.getIngredients();
  }

  ngOnInit() {
  }

  removeMeal() {
    this.remove.emit(null);
  }

  addIngredient() {
    this.meal.ingredients.push(new MealIngredient(null, 100));
    this.table.renderRows();
  }

  removeIngredient(index: number) {
    this.meal.ingredients.splice(index, 1);
    this.table.renderRows();
  }
}
