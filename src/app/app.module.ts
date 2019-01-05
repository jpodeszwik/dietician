import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule, MatTableModule, MatInputModule, MatAutocompleteModule, MatButtonModule} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {AngularFireModule} from '@angular/fire';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {environment} from '../environments/environment';
import {MealComponent} from './diet/meal/meal.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {DietSummaryComponent} from './diet/diet-summary/diet-summary.component';
import {DietComponent} from './diet/diet.component';
import {LoginComponent} from './auth/login/login.component';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {LogoutComponent} from './auth/logout/logout.component';
import {AuthComponent} from './auth/auth.component';
import {RouterModule, Routes} from '@angular/router';

const appRoutes: Routes = [
  {path: '', component: DietComponent},
  {path: 'diet/:id', component: DietComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    MealComponent,
    DietSummaryComponent,
    DietComponent,
    LoginComponent,
    LogoutComponent,
    AuthComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    MatToolbarModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatAutocompleteModule,
    MatTableModule,
    FlexLayoutModule,
    NgSelectModule,
    RouterModule.forRoot(appRoutes),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
