<template>
  <div class="editable">
    <div v-show="shown" @click="toggle">{{ title }}</div>
    <input ref="input" v-show="!shown" v-model="title" @blur="toggle" @keydown.enter="$event.target.blur"/>
  </div>
</template>

<script>
export default {
  name: 'x-editable',
  props: ['text'],
  data () {
    return {
      shown: true,
      title: this.text
    }
  },
  methods: {
    toggle () {
      if (this.title.length === 0) {
        this.title = '- empty -'
      }
      this.shown = !this.shown
      setTimeout(() => this.$refs.input.focus(), 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.editable {
  display: table-cell;
  width: 1600px;
  input {
    width: 100%;
    border: 0;
    padding: 0;
  }
}
</style>
