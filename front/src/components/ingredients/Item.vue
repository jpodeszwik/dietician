<template>
  <div class="livesearchItem">
    <span>{{ item.name }}</span>
  </div>
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
