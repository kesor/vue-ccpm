<template>
  <div id="app" class="container">
    <x-title text="Project PERT chart"></x-title>
    <x-navbar></x-navbar>
    <x-timeline></x-timeline>
    <x-projectview :tasks="tasks"></x-projectview>
  </div>
</template>

<script>
import xTitle from './components/x-title';
import xNavbar from './components/x-navbar';
import xTimeline from './components/x-timeline';
import xProjectview from './components/x-projectview';

const projectTasks = [
  { id: 'A',
    name: 'High level analysis',
    length: '1 week',
    resource: [],
    dependon: [],
  },
  { id: 'B',
    name: 'Selection of hardware platform',
    length: '1 day',
    resource: [],
    dependon: ['A'],
  },
  { id: 'C',
    name: 'Installation and commissioning of hardware',
    length: '2 weeks',
    resource: [],
    dependon: ['B'],
  },
  { id: 'D',
    name: 'Detailed analysis of core modules',
    length: '2 weeks',
    resource: [],
    dependon: ['A'],
  },
  { id: 'E',
    name: 'Detailed analysis of supporting modules',
    length: '2 weeks',
    resource: [],
    dependon: ['D'],
  },
  { id: 'F',
    name: 'Programming of core modules',
    length: '2 weeks',
    resource: [],
    dependon: ['D'],
  },
  { id: 'G',
    name: 'Programming of supporting modules',
    length: '3 weeks',
    resource: [],
    dependon: ['E'],
  },
  { id: 'H',
    name: 'Quality assurance of core modules',
    length: '1 week',
    resource: [],
    dependon: ['F'],
  },
  { id: 'I',
    name: 'Quality assurance of supporting modules',
    length: '1 week',
    resource: [],
    dependon: ['G'],
  },
  { id: 'J',
    name: 'Core module training',
    length: '1 day',
    resource: [],
    dependon: ['C', 'H'],
  },
  { id: 'K',
    name: 'Development and QA of accounting reporting',
    length: '1 week',
    resource: [],
    dependon: ['E'],
  },
  { id: 'L',
    name: 'Development and QA of management reporting',
    length: '1 week',
    resource: [],
    dependon: ['E'],
  },
  { id: 'M',
    name: 'Development of Management Information System',
    length: '1 week',
    resource: [],
    dependon: ['E'],
  },
  { id: 'N',
    name: 'Detailed training',
    length: '1 week',
    resource: [],
    dependon: ['I', 'J', 'K', 'M'],
  },
];

export default {
  name: 'app',
  data() {
    return {
      tasks: projectTasks,
    };
  },
  components: {
    'x-title': xTitle,
    'x-navbar': xNavbar,
    'x-timeline': xTimeline,
    'x-projectview': xProjectview,
  },
};
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
