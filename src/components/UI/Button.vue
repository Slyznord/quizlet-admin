<template>
  <div
    :class="classes"
    @click="$emit('onClick')"
  >
    <slot name="icon" />
    {{ value }}
  </div>
</template>

<script>
export default {
  name: 'Button',
  props: {
    value: {
      type: [Number, String],
      default: ''
    },
    classes: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>

</style>
