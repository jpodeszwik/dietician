import {Component, OnInit} from '@angular/core';
import {Diet} from '../model/diet';
import {Meal} from '../model/meal';
import {DietService} from './diet.service';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'app-diet',
  templateUrl: './diet.component.html',
  styleUrls: ['./diet.component.css']
})
export class DietComponent implements OnInit {
  diet: Diet;
  id: string;

  constructor(private dietService: DietService, private route: ActivatedRoute, private location: Location) {
    this.diet = new Diet([]);
  }

  ngOnInit() {
    this.route.paramMap.subscribe(val => {
      const id = val.get('id');
      if (id) {
        this.dietService.getDiet(id)
          .then(diet => this.diet = diet);
      }
    });
  }

  removeMeal(index: number) {
    this.diet.meals.splice(index, 1);
  }

  addMeal() {
    this.diet.meals.push(new Meal(`Meal ${this.diet.meals.length + 1}`, []));
  }

  saveDiet() {
    this.dietService.saveDiet(this.diet).then(id => this.location.go(`diet/${id}`));
  }
}
