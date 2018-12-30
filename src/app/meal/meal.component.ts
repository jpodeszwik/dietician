import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material';

import { Meal } from '../model/meal';
import { Ingredient } from '../model/ingredient';
import { MealIngredient } from '../model/meal.ingredient';

@Component({
  selector: 'app-meal',
  templateUrl: './meal.component.html',
  styleUrls: ['./meal.component.css']
})
export class MealComponent implements OnInit {
  @Input() meal: Meal;
  @Output() remove: EventEmitter<any> = new EventEmitter();
  @ViewChild(MatTable) table: MatTable<MealIngredient>;
  columnsToDisplay = ['name', 'weight', 'proteins', 'carbohydrates', 'fats', 'nutritionValue'];
  ingredients = [new Ingredient('0', 'Milk', 10, 5, 5, 100), new Ingredient('1', 'Butter', 5, 10, 10, 250)];

  constructor() {
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
}
