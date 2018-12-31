import { Component, OnInit } from '@angular/core';
import { Diet } from '../model/diet';
import { Meal } from '../model/meal';

@Component({
  selector: 'app-diet',
  templateUrl: './diet.component.html',
  styleUrls: ['./diet.component.css']
})
export class DietComponent implements OnInit {
  diet: Diet;

  constructor() {
    this.diet = new Diet([]);
  }

  ngOnInit() {
  }

  removeMeal(index: number) {
    this.diet.meals.splice(index, 1);
  }

  addMeal() {
    this.diet.meals.push(new Meal(`Meal ${this.diet.meals.length + 1}`, []));
  }
}
