<template>
  <b-list-group-item class="livesearchItem">
    {{ item.name }}
  </b-list-group-item>
</template>

<script>
export default {
  props: {
    item: { required: true },
  },
};
</script>

<style>
.livesearchItem {
  position:relative;
  z-index:1000;
}
</style>
