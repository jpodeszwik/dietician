<template>
  <v-autocomplete min-len="1" :items="items" v-model="item" :get-label="getLabel" :component-item='template' @update-items="updateItems">
  </v-autocomplete>
</template>

<script>
import Item from './Item';

export default {
  name: 'livesearch',
  props: ['item'],
  data() {
    return {
      items: [],
      template: Item,
    };
  },
  methods: {
    getLabel(item) {
      return item.name;
    },
    updateItems(text) {
      const body = JSON.stringify({ phrase: text });

      fetch('http://localhost:3000/api/ingredients/_search',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
        })
        .then((response) => {
          if (!response.ok) {
            throw new Error('could not add new record');
          }
          return response.json();
        })
        .then((items) => {
          this.items = items;
        });
    },
  },
};
</script>
