<template>
  <b-list-group>
    <v-autocomplete
      :min-len="1"
      :wait="200"
      :auto-select-one-item="false"
      :items="items"
      :value="item"
      :get-label="getLabel"
      :component-item="template"
      @update-items="updateItems"
      @item-selected="itemSelected"
      :input-attrs="attrs"
      />
  </b-list-group>
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
      attrs: { class: 'form-control' },
    };
  },
  methods: {
    itemSelected(item) {
      this.$emit('item-selected', item);
    },
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
