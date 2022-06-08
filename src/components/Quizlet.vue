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
      <template #default="{ isLoading, switchLoaderState }">
        <div class="card__row card__row_justify-between card__row_items-center">
          <div class="card__row card__row_items-center">
            <h3 class="card__headline mr-3">ID: {{ item._id }}</h3>

            <Switch
              :model-value="!!item.isActive"
              @update:model-value="switchQuizState(item._id, $event.value)"
            />
          </div>

          <Settings
            :elements="settings"
            :icon="DotsVerticalIcon"
            iconClasses="settings__icon"
          >
            <template #button="{ switchSettingsState }">
              <Button
                v-for="(button, index) in settings"
                :key="index"
                :value="button.label"
                :classes="button.buttonClasses"
                @on-click="button.onClick(item, switchLoaderState, switchSettingsState)"
              >
                <template #icon>
                  <component
                    :is="button.icon"
                    :class="button.iconClasses"
                  />
                </template>
              </Button>
            </template>
          </Settings>
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
import CreateQuizlet from '@/components/Modals/CreateQuizlet/CreateQuizlet'
import Grid from '@/components/UI/Grid'
import ProgressBar from '@/components/UI/ProgressBar'
import Settings from '@/components/Settings'
import Switch from '@/components/UI/Switch'
import {
  DotsVerticalIcon,
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
    Grid,
    ProgressBar,
    Settings,
    Switch
  },
  setup () {
    const store = useStore()
    const $vfm = inject('$vfm')
    const fileURL = ref(null)
    const settings = ref([
      {
        icon: DownloadIcon,
        label: 'Выгрузить отчет',
        buttonClasses: 'button button_big button_justify-start button_outline mb-2',
        iconClasses: 'icon_normal mr-2',
        onClick: async (item, switchLoaderState, switchSettings) => {
          switchLoaderState(true)
          setTimeout(async () => {
            fileURL.value = await store.dispatch('Quizlet/generateReport', item._id)
            switchLoaderState(false)
            await nextTick()
            document.querySelector('a.downloadFile').click()
            switchSettings()
          }, 2000)
        }
      },
      {
        icon: PencilAltIcon,
        label: 'Редактировать',
        buttonClasses: 'button button_big button_justify-start button_outline mb-2',
        iconClasses: 'icon_normal mr-2',
        onClick: (item, switchLoaderState, switchSettingsState) => {
          $vfm.show({
            component: CreateQuizlet,
            bind: {
              element: item
            }
          })
          switchSettingsState()
        }
      },
      {
        icon: TrashIcon,
        label: 'Удалить',
        buttonClasses: 'button button_big button_justify-start button_outline',
        iconClasses: 'icon_normal mr-2',
        onClick: ({ _id }, switchLoaderState, switchSettingsState) => {
          store.dispatch('Quizlet/deleteFromTable', { _id, table: 'quizzes' })
          switchSettingsState()
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
      DotsVerticalIcon,
      fileURL,
      settings,
      quizzes,
      openCreateQuizletModal,
      switchQuizState
    }
  }
}
</script>
