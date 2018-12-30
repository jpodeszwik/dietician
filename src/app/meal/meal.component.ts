import { Component, OnInit, Input } from '@angular/core';
import { Meal } from './meal';
import { Ingredient } from '../ingredient';
@Component({
  selector: 'app-meal',
  templateUrl: './meal.component.html',
  styleUrls: ['./meal.component.css']
})
export class MealComponent implements OnInit {
  @Input() meal: Meal;
  columnsToDisplay = ['name', 'weight', 'proteins', 'carbohydrates', 'fats', 'nutritionValue'];
  ingredients = [new Ingredient('0', 'Milk', 10, 5, 5, 100), new Ingredient('1', 'Butter', 5, 10, 10, 250)];


  constructor() {
  }

  ngOnInit() {
  }
}
