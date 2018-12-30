import { Component, OnInit, Input } from '@angular/core';
import { Meal } from './meal'
@Component({
  selector: 'app-meal',
  templateUrl: './meal.component.html',
  styleUrls: ['./meal.component.css']
})
export class MealComponent implements OnInit {
  @Input() meal: Meal;
  columnsToDisplay = ['name', 'weight', 'proteins', 'carbohydrates', 'fats', 'nutritionValue'];

  constructor() {
  }

  ngOnInit() {
  }
}
