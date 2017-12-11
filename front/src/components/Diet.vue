<template>
  <b-container>
    <meal
      v-for="(meal, index) in meals"
      :key="index"
      :meal="meal"
      @ingredient-selected="ingredientSelected(index, $event)"
    ></meal>
  </b-container>
</template>

<script>
import Meal from './Meal';

const meals = [
  {
    name: 'meal 1',
    ingredients: [
      {
        weight: 100,
        name: 'ingredient one',
        proteins: 20,
        carbohydrates: 40,
        fats: 10,
        nutritiveValue: 330,
      },
      {
        name: 'ingredient two',
        weight: 200,
        proteins: 20,
        carbohydrates: 40,
        fats: 10,
        nutritiveValue: 330,
      },
    ],
  },
  {
    name: 'meal 2',
    ingredients: [
      {
        name: 'ingredient three',
        weight: 200,
        proteins: 20,
        carbohydrates: 40,
        fats: 10,
        nutritiveValue: 330,
      },
    ],
  },
];

export default {
  name: 'diet',
  components: {
    Meal,
  },
  data() {
    return {
      meals,
    };
  },
  methods: {
    ingredientSelected(index, item) {
      const ingredient = item.ingredient;
      if (this.meals[index].ingredients[item.index].name === ingredient.name) {
        return;
      }

      const newIngredient = {
        name: ingredient.name,
        fats: ingredient.fats,
        carbohydrates: ingredient.carbohydrates,
        proteins: ingredient.proteins,
        nutritiveValue: ingredient.nutritiveValue,
        weight: this.meals[index].ingredients[item.index].weight,
      };

      this.meals[index].ingredients.splice(item.index, 1, newIngredient);
    },
  },
};
</script>
