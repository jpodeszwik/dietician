import { Component } from '@angular/core';
import { Ingredient } from './model/ingredient'
import { IngredientsService } from './ingredients.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Dietician';
}
