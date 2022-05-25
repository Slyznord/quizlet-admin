<template>
  <div class="user">
    <div class="user__group">
      <img
        v-if="avatarURL"
        :src="avatarURL"
        alt="avatar"
      >
      <div
        v-else
        class="user__avatar user__avatar_default"
      ></div>
    </div>

    <div class="user__group">
      <p class="user__p">{{ username }}</p>
      <ChevronDownIcon class="user__icon" />
    </div>
  </div>
</template>

<script>
import { ChevronDownIcon } from '@heroicons/vue/outline'

// TODO: Реализовать хранение логина пользователя и отображения его данных в этом компоненте
export default {
  name: 'User',
  props: {
    username: {
      type: String,
      default: 'User'
    },
    avatarURL: {
      type: String,
      default: null
    }
  },
  components: {
    ChevronDownIcon
  }
}
</script>

<style scoped>

</style>
