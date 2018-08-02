<template>
  <table class="table table-hover table-sm">
    <thead>
      <tr>
        <th class="id">#</th>
        <th class="deps"><nobr>Depends On</nobr></th>
        <th class="name">Task Name</th>
        <th class="resource"><nobr>Key Resource</nobr></th>
        <th class="length">Length</th>
      </tr>
    </thead>
    <tbody v-for="task in tasks" :key="task.id">
      <tr>
        <th>{{ task.id }}</th>
        <td>{{ task.dependon.join(", ") }}</td>
        <td><x-editable :text="task.name"/></td>
        <td><x-editable :text="task.resource.join(', ')"/></td>
        <td><x-editable :text="task.length"/></td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { mapGetters } from 'vuex'
import xEditable from './x-editable'

export default {
  name: 'x-tasklist',
  computed: {
    ...mapGetters({
      tasks: 'tasklist'
    })
  },
  components: {
    xEditable
  }
}
</script>

<style scope lang="scss">
th.id { width: 1%; }
th.deps { width: 5%; }
th.name { width: 50%; }
th.length { width: 15%; }
th.resource { width: 29%; }
td { text-align: left; }
</style>
