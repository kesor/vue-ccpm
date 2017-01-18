<template>
  <div class="container">
    <x-tasklist></x-tasklist>
    <x-gantt></x-gantt>
  </div>
</template>

<script>
import xTasklist from './x-tasklist';
import xGantt from './x-gantt';

export default {
  name: 'x-projectview',
  components: {
    xTasklist,
    xGantt,
  },
};
</script>

<style>
</style>
