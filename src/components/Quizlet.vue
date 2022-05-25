<template>
  <Grid classes="grid_col-4 grid_gap-1">
    <Card
      v-for="item in quizzes"
      :key="item._id"
    >
      <h3 class="card__headline">ID: {{ item._id }}</h3>

      <div class="card__row card__row_justify-between card__row_items-center">
        <Switch
          :model-value="item.isActive"
        />

        <div class="card__action-panel">
          <CircleIcon
            v-for="(item, index) in icons"
            :key="index"
            classes="icon_secondary icon_circle"
          >
            <component
              :is="item.component"
              :class="item.classes"
            />
          </CircleIcon>
        </div>
      </div>

      <div class="column mt-1">
        <p class="card__p card__p_font-semibold card__p_secondary">Текст приветствия</p>
        <p class="card__p card__p_primary">{{ item.introductionText }}</p>
      </div>

      <div class="column mt-1">
        <p class="card__p card__p_font-semibold card__p_secondary">Длительность квиза</p>
        <p class="card__p card__p_primary">{{ item.duration }}</p>
      </div>

      <div class="column mt-1">
        <p class="card__p card__p_font-semibold card__p_secondary">Логотип URL</p>
        <p class="card__p card__p_primary">{{ item.logoURL }}</p>
      </div>

      <div class="column mt-1">
        <p class="card__p card__p_font-semibold card__p_secondary">Секция</p>
        <p class="card__p card__p_primary">{{ item.section }}</p>
      </div>
    </Card>
  </Grid>
</template>

<script>
import Card from '@/components/UI/Card'
import CircleIcon from '@/components/UI/CircleIcon'
import Grid from '@/components/UI/Grid'
import Switch from '@/components/UI/Switch'
import {
  DownloadIcon,
  PencilAltIcon,
  TrashIcon
} from '@heroicons/vue/outline'

import { ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'Quizlet',
  components: {
    Card,
    CircleIcon,
    DownloadIcon,
    Grid,
    PencilAltIcon,
    Switch,
    TrashIcon
  },
  setup () {
    const store = useStore()
    const icons = ref([
      {
        component: DownloadIcon,
        classes: 'icon_normal',
        onClick: () => {}
      },
      {
        component: PencilAltIcon,
        classes: 'icon_normal',
        onClick: () => {}
      },
      {
        component: TrashIcon,
        classes: 'icon_normal',
        onClick: () => {}
      }
    ])

    onMounted(async () => {
      await store.dispatch('Quizlet/getQuizzes')
    })

    const quizzes = computed(() => {
      const copyOfQuizzes = JSON.parse(JSON.stringify(store.state.Quizlet.quizzes))

      if (!copyOfQuizzes) return []

      return copyOfQuizzes.map(item => {
        const { _id, isActive, introductionText, duration, logoURL, section } = item

        return {
          _id,
          isActive: !!isActive,
          introductionText,
          duration,
          logoURL,
          section
        }
      })
    })

    return {
      icons,
      quizzes
    }
  }
}
</script>
