<template>
  <label>
    <input
      type="checkbox"
      class="switch"
      :checked="modelValue"
      @input="$emit('update:modelValue', { value: $event.target.checked, event: $event })"
    >
  </label>
</template>

<script>
export default {
  name: 'Switch',
  props: {
    modelValue: {
      type: Boolean,
      required: true
    }
  }
}
</script>
