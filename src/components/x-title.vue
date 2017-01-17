<template>
  <h1>
    <x-editable :text="text"/>
  </h1>
</template>

<script>
import xEditable from './x-editable';

export default {
  name: 'x-title',
  props: ['text'],
  components: {
    xEditable,
  },
};
</script>

<style>
</style>
