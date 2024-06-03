import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface MealApiResponse {
  mealId: number;
  mealType: string;
  mealDate: string;
  mealDay: string;
  item1: string;
  item2: string;
  item3: string;
  item4: string;
  item5: string;
}

@Injectable({
  providedIn: 'root'
})
export class DashbordService {

  private apiUrl = 'http://localhost:8080/mealApp/api';

  constructor(private http: HttpClient,) {}

  getMeals(): Observable<{ [key: string]: { lunch: string[], dinner: string[] } }> {
    return this.http.get<MealApiResponse[]>(this.apiUrl).pipe(
      map((meals) => {
        const menu: { [key: string]: { lunch: string[], dinner: string[] } } = {};
        meals.forEach(meal => {
          const day = meal.mealDay.toUpperCase();
          const items = [meal.item1, meal.item2, meal.item3, meal.item4, meal.item5];
          if (!menu[day]) {
            menu[day] = { lunch: [], dinner: [] };
          }
          if (meal.mealType === 'LUNCH') {
            menu[day].lunch = items;
          } else if (meal.mealType === 'DINNER') {
            menu[day].dinner = items;
          }
        });
        return menu;
      })
    );
  }
}
