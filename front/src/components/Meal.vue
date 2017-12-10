<template>
  <b-card :header="meal.name">
    <b-table striped hover :items="meal.ingredients" :fields="fields" foot-clone>
      <template slot="name" slot-scope="row">
        <livesearch @item-selected="setItem(row.index, $event)" :item="row.item"></livesearch>
      </template>
      <template slot="weight" slot-scope="row">
        <b-form-input v-model="row.item.weight"  type="text"></b-form-input>
      </template>
      <template slot="proteins" slot-scope="row">
        {{ weightedValue(row.item, 'proteins') }}
      </template>
      <template slot="carbohydrates" slot-scope="row">
        {{ weightedValue(row.item, 'carbohydrates') }}
      </template>
      <template slot="fats" slot-scope="row">
        {{ weightedValue(row.item, 'fats') }}
      </template>
      <template slot="nutritiveValue" slot-scope="row">
        {{ weightedValue(row.item, 'nutritiveValue') }}
      </template>
      <template slot="delete" slot-scope="row">
        <b-button size="xs" variant="danger" @click="removeItem(row.index)">Delete</b-button>
      </template>

      <template slot="FOOT_name" slot-scope="data">
        <strong>Summary</strong>
      </template>
      <template slot="FOOT_weight" slot-scope="data">
      </template>
      <template slot="FOOT_proteins" slot-scope="data">
        {{ sumField('proteins') }}
      </template>
      <template slot="FOOT_carbohydrates" slot-scope="data">
        {{ sumField('carbohydrates') }}
      </template>
      <template slot="FOOT_fats" slot-scope="data">
        {{ sumField('fats') }}
      </template>
      <template slot="FOOT_nutritiveValue" slot-scope="data">
        {{ sumField('nutritiveValue') }}
      </template>
    </b-table>
  </b-card>
</template>

<script>
import Livesearch from './ingredients/Livesearch';

const fields = [
  'name',
  'weight',
  'proteins',
  'carbohydrates',
  'fats',
  'nutritiveValue',
  {
    key: 'delete',
    label: ' ',
  },
];

export default {
  name: 'meal',
  props: ['meal'],
  components: {
    Livesearch,
  },
  data() {
    return {
      fields,
    };
  },
  methods: {
    setItem(index, item) {
      console.log(`${index}: ${item.name}`);
    },
    removeItem(item) {
      console.log(this.meal.ingredients[item].weight);
    },
    weightedValue(item, key) {
      return (item[key] * item.weight) / 100;
    },
    sumField(key) {
      return this.meal.ingredients
        .reduce((acc, ingredient) => acc + this.weightedValue(ingredient, key), 0);
    },
  },
};
</script>
