<template>
  <div :class="[
    classes,
    'card'
  ]">
    <slot
      :isLoading="isLoading"
      :switchState="switchState"
    />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'Card',
  props: {
    classes: {
      type: String,
      default: ''
    }
  },
  setup () {
    const isLoading = ref(false)
    const switchState = (value) => {
      isLoading.value = value
    }

    return {
      isLoading,
      switchState
    }
  }
}
</script>
