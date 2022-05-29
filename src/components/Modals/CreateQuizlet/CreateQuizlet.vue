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
    <div
      v-if="quiz"
      class="container container_h-full column"
    >
      <div class="actions-panel actions-panel_sticky-top actions-panel_justify-between actions-panel_mb-2">
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

      <Input
        class="mb-4"
        :classes="[
          'input'
        ]"
        :model-value="quiz.introductionText"
        @update:model-value="onUpdateInput($event, 'introductionText')"
      >
        <template #label>
          <Label
            value="Текст приветствия"
            classes="input-group__label"
          />
        </template>
      </Input>

      <Input
        class="mb-4"
        :classes="[
          'input'
        ]"
        :model-value="quiz.duration"
        @update:model-value="onUpdateInput($event, 'duration')"
      >
        <template #label>
          <Label
            value="Длительность квиза"
            classes="input-group__label"
          />
        </template>
      </Input>

      <Input
        class="mb-4"
        :classes="[
          'input'
        ]"
        :model-value="quiz.section"
        @update:model-value="onUpdateInput($event, 'section')"
      >
        <template #label>
          <Label
            value="Секция"
            classes="input-group__label"
          />
        </template>
      </Input>

      <UploadFile
        :filename="quiz.logoURL"
        class="mb-4"
        @upload-file="onUploadFile($event, 'logoURL')"
      />

      <div class="container column mb-5">
        <Label
          value="Цвет фона"
          classes="input-group__label"
        />

        <ColorPicker
          theme="dark"
          :color="quiz.bgColor"
          :sucker-hide="true"
          :sucker-canvas="suckerCanvas"
          :sucker-area="suckerArea"
          @changeColor="onChangeColor"
        />
      </div>

      <CreateQuestion />
    </div>
  </vue-final-modal>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'

import Button from '@/components/UI/Button'
import { ColorPicker } from 'vue-color-kit'
import CreateQuestion from './CreateQuestion'
import Input from '@/components/UI/Input'
import Label from '@/components/UI/Label'
import UploadFile from '@/components/UI/UploadFile'

import ModalMixin from '@/mixins/Modal.mixin'

import 'vue-color-kit/dist/vue-color-kit.css'

export default {
  name: 'CreateQuizlet',
  mixins: [ModalMixin],
  components: {
    Button,
    ColorPicker,
    CreateQuestion,
    UploadFile,
    Input,
    Label
  },
  setup () {
    const store = useStore()

    onMounted(() => {
      store.commit('Quizlet/initCreatedQuiz')
    })

    const quiz = computed(() => {
      return JSON.parse(JSON.stringify(store.state.Quizlet.createdQuiz))
    })

    function onUpdateInput (value, key) {
      store.commit('Quizlet/updateCreatedQuiz', {
        value,
        key
      })
    }

    async function onUploadFile (file, key) {
      if (file === null) {
        store.commit('Quizlet/updateCreatedQuiz', {
          value: '',
          key
        })
        return
      }

      const formData = new FormData()
      formData.append('file', file)

      const result = await store.dispatch('Quizlet/uploadFile', formData)
      store.commit('Quizlet/updateCreatedQuiz', {
        value: result.name,
        key
      })
    }

    const suckerCanvas = ref(null)
    const suckerArea = ref([])

    function onChangeColor (color) {
      const { rgba: { r, g, b, a } } = color
      store.commit('Quizlet/updateCreatedQuiz', {
        key: 'bgColor',
        value: `rgba(${r}, ${g}, ${b}, ${a})`
      })
    }

    return {
      quiz,
      suckerArea,
      suckerCanvas,
      onChangeColor,
      onUpdateInput,
      onUploadFile
    }
  }
}
</script>
