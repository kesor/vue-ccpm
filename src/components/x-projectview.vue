<template>
  <div class="container">
    <x-tasklist :tasks="tasks"></x-tasklist>
    <x-gantt></x-gantt>
  </div>
</template>

<script>
import xTasklist from './x-tasklist';
import xGantt from './x-gantt';

export default {
  name: 'x-projectview',
  props: ['tasks'],
  components: {
    xTasklist,
    xGantt,
  },
};
</script>

<style>
</style>
