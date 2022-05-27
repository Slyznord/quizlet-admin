<template>
  <vue-final-modal
    v-slot="{ close }"
    v-bind="$attrs"
    classes="modal"
    content-class="modal__container modal__container_medium"
    :lock-scroll="false"
    :esc-to-close="true"
    @before-open="overwriteParams($event)"
  >
    <div class="container column">
      <div class="actions-panel actions-panel_justify-between actions-panel_mb-2">
        <h2 class="headline">Создание квиза</h2>

        <div class="row">
          <Button
            value="Сохранить"
            classes="button button_normal button_success mr-2"
            @click="() => {}"
          />

          <Button
            value="Отменить"
            classes="button button_normal button_error"
            @click="close"
          />
        </div>
      </div>

      <component
        v-for="(property, key) in quizlet"
        v-bind="property.component.props"
        :key="key"
        :is="property.component.name"
        @update:model-value="onUpdateInput($event, key)"
        @upload-file="onUploadFile($event, key)"
      >
        <template
          v-if="property.hasOwnProperty('slot')"
          v-slot:[property.slot.name]
        >
          <component
            :is="property.slot.component"
            v-bind="property.slot.props"
          />
        </template>
      </component>
    </div>
  </vue-final-modal>
</template>

<script>
import { ref, defineAsyncComponent } from 'vue'
import { useStore } from 'vuex'

import Button from '@/components/UI/Button'
import ModalMixin from '@/mixins/Modal.mixin'

export default {
  name: 'CreateQuizlet',
  mixins: [ModalMixin],
  components: {
    Button,
    UploadFile: defineAsyncComponent(() => import('@/components/UI/UploadFile')),
    Input: defineAsyncComponent(() => import('@/components/UI/Input')),
    Label: defineAsyncComponent(() => import('@/components/UI/Label'))
  },
  setup () {
    // const quizlet = ref({
    //   introductionText: {
    //     label: 'Текст приветствия',
    //     value: ''
    //   },
    //   duration: {
    //     component: 'Input',
    //     label: 'Длительность квиза',
    //     value: ''
    //   },
    //   logoURL: {
    //     component: 'Input',
    //     label: 'Логотип',
    //     value: ''
    //   },
    //   section: {
    //     component: 'Input',
    //     label: 'Секция',
    //     value: ''
    //   },
    //   bgColor: {
    //     component: 'Input',
    //     label: 'Цвет фона',
    //     value: ''
    //   }
    // })
    const store = useStore()
    const quizlet = ref({
      introductionText: {
        component: {
          name: 'Input',
          props: {
            modelValue: '',
            classes: 'input mb-4'
          }
        },
        slot: {
          name: 'label',
          component: 'Label',
          props: {
            value: 'Текст приветствия',
            classes: 'input-group__label'
          }
        }
      },
      duration: {
        component: {
          name: 'Input',
          props: {
            modelValue: '',
            classes: 'input mb-4'
          }
        },
        slot: {
          name: 'label',
          component: 'Label',
          props: {
            value: 'Длительность квиза',
            classes: 'input-group__label'
          }
        }
      },
      logoURL: {
        component: {
          name: 'UploadFile',
          props: {
            filename: '',
            class: 'mb-4'
          }
        }
      },
      section: {
        component: {
          name: 'Input',
          props: {
            modelValue: '',
            classes: 'input mb-4'
          }
        },
        slot: {
          name: 'label',
          component: 'Label',
          props: {
            value: 'Секция',
            classes: 'input-group__label'
          }
        }
      },
      bgColor: {
        component: {
          name: 'Input',
          props: {
            modelValue: '',
            classes: 'input mb-4'
          }
        },
        slot: {
          name: 'label',
          component: 'Label',
          props: {
            value: 'Цвет фона',
            classes: 'input-group__label'
          }
        }
      }
    })

    function onUpdateInput (value, key) {
      quizlet.value[key].component.props.modelValue = value
    }

    async function onUploadFile (file, key) {
      if (file === null) {
        quizlet.value[key].component.props.filename = ''
        return
      }

      const formData = new FormData()
      formData.append('file', file)

      const result = await store.dispatch('Quizlet/uploadFile', formData)
      quizlet.value[key].component.props.filename = result.name
    }

    return {
      quizlet,
      onUpdateInput,
      onUploadFile
    }
  }
}
</script>
