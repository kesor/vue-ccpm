<template>
  <div id="app" class="container">
    <x-title text="Project PERT chart"></x-title>
    <x-navbar></x-navbar>
    <x-timeline></x-timeline>
    <x-projectview></x-projectview>
  </div>
</template>

<script>
import xTitle from './components/x-title'
import xNavbar from './components/x-navbar'
import xTimeline from './components/x-timeline'
import xProjectview from './components/x-projectview'

export default {
  name: 'app',
  components: {
    'x-title': xTitle,
    'x-navbar': xNavbar,
    'x-timeline': xTimeline,
    'x-projectview': xProjectview
  }
}
</script>

<style lang="scss">
$icon-font-path: "~bootstrap-sass/assets/fonts/bootstrap/";
@import "~bootstrap-sass/assets/stylesheets/bootstrap";

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
