<template>
  <div :class="[
    classes,
    'card'
  ]">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'Card',
  props: {
    classes: {
      type: String,
      default: ''
    }
  }
}
</script>
