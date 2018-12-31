import { Component, OnInit, Input } from '@angular/core';
import { Diet } from '../../model/diet';

@Component({
  selector: 'app-diet-summary',
  templateUrl: './diet-summary.component.html',
  styleUrls: ['./diet-summary.component.css']
})
export class DietSummaryComponent implements OnInit {
  @Input() diet: Diet;
  columnsToDisplay = ['weight', 'proteins', 'carbohydrates', 'fats', 'nutritionValue'];

  constructor() { }

  ngOnInit() {
  }

}
