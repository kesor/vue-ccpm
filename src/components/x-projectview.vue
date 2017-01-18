<template>
  <div class="container">
    <x-tasklist></x-tasklist>
    <x-pert></x-pert>
  </div>
</template>

<script>
import xTasklist from './x-tasklist';
import xPert from './x-pert';

export default {
  name: 'x-projectview',
  components: {
    xTasklist,
    xPert,
  },
};
</script>

<style>
</style>
