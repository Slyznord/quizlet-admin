<template>
  <div class="actions-panel actions-panel_justify-end actions-panel_mb-2">
    <Button
      value="Создать квиз"
      classes="button button_normal button_success"
      @click="openCreateQuizletModal"
    />
  </div>

  <Grid classes="grid_col-4 grid_gap-1">
    <Card
      v-for="item in quizzes"
      :key="item._id"
    >
      <template #default="{ isLoading, switchState }">
        <h3 class="card__headline">ID: {{ item._id }}</h3>

        <div class="card__row card__row_justify-between card__row_items-center">
          <Switch
            :model-value="!!item.isActive"
            @update:model-value="switchQuizState(item._id, $event.value)"
          />

          <div class="card__action-panel">
            <CircleIcon
              v-for="(icon, index) in icons"
              :key="index"
              classes="icon_secondary icon_circle"
              @click="icon.onClick(item, switchState)"
            >
              <component
                :is="icon.component"
                :class="icon.classes"
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

        <div
          v-show="isLoading"
          class="progress-bar__layout"
        >
          <ProgressBar />
        </div>
      </template>
    </Card>
  </Grid>

  <a
    v-if="fileURL && fileURL.path"
    class="downloadFile"
    target="_blank"
    :href="fileURL.path"
  />
</template>

<script>
import Button from '@/components/UI/Button'
import Card from '@/components/UI/Card'
import CircleIcon from '@/components/UI/CircleIcon'
import CreateQuizlet from '@/components/Modals/CreateQuizlet/CreateQuizlet'
import Grid from '@/components/UI/Grid'
import ProgressBar from '@/components/UI/ProgressBar'
import Switch from '@/components/UI/Switch'
import {
  DownloadIcon,
  PencilAltIcon,
  TrashIcon
} from '@heroicons/vue/outline'

import { ref, onMounted, computed, inject, nextTick } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'Quizlet',
  components: {
    Button,
    Card,
    CircleIcon,
    DownloadIcon,
    Grid,
    PencilAltIcon,
    ProgressBar,
    Switch,
    TrashIcon
  },
  setup () {
    const store = useStore()
    const $vfm = inject('$vfm')
    const fileURL = ref(null)
    const icons = ref([
      {
        component: DownloadIcon,
        classes: 'icon_normal',
        onClick: async (item, fn) => {
          fn(true)
          setTimeout(async () => {
            fileURL.value = await store.dispatch('Quizlet/generateReport', item._id)
            fn(false)
            await nextTick()
            document.querySelector('a.downloadFile').click()
          }, 2000)
        }
      },
      {
        component: PencilAltIcon,
        classes: 'icon_normal',
        onClick: (item) => {
          $vfm.show({
            component: CreateQuizlet,
            bind: {
              element: item
            }
          })
        }
      },
      {
        component: TrashIcon,
        classes: 'icon_normal',
        onClick: ({ _id }) => {
          store.dispatch('Quizlet/deleteFromTable', { _id, table: 'quizzes' })
        }
      }
    ])

    onMounted(async () => {
      await store.dispatch('Quizlet/getQuizzes')
    })

    const quizzes = computed(() => {
      return JSON.parse(JSON.stringify(store.state.Quizlet.quizzes)) ?? []
    })

    function openCreateQuizletModal () {
      $vfm.show({ component: CreateQuizlet })
    }

    async function switchQuizState (_id, value) {
      await store.dispatch('Quizlet/updateQuizByKey', {
        _id,
        key: 'isActive',
        table: 'quizzes',
        value
      })
    }

    return {
      fileURL,
      icons,
      quizzes,
      openCreateQuizletModal,
      switchQuizState
    }
  }
}
</script>
