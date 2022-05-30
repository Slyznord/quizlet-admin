<template>
  <div class="container column">
    <div class="actions-panel actions-panel_justify-between actions-panel_items-center mb-4">
      <h2 class="headline mb-2">Вопросы</h2>

      <Button
        value="Добавить вопрос"
        classes="button button_normal button_success"
        @on-click="onAddQuestion"
      />
    </div>

    <div
      v-for="(question, questionIndex) in questions"
      :key="question.question"
      class="column container container_shadow-md container_rounded-md container_padding-30 mb-4"
    >
      <div class="actions-panel actions-panel_justify-between actions-panel_items-center mb-4">
        <p class="subtitle subtitle_semibold subtitle_font-base">Вопрос №{{ questionIndex + 1 }}</p>

        <div class="row">
          <Button
            class="button button_success button_normal mr-2"
            value="Добавить ответ"
            @on-click="onAddAnswer(questionIndex)"
          />

          <Button
            class="button button_error button_normal"
            value="Удалить вопрос"
            @on-click="onDeleteQuestion(questionIndex)"
          />
        </div>
      </div>

      <Input
        class="mb-4"
        classes="input"
        :model-value="question.question"
        @update:model-value="onUpdateQuestion(questionIndex, $event)"
      >
        <template #label>
          <Label
            value="Вопрос"
            classes="input-group__label"
          />
        </template>
      </Input>

      <div class="container column">
        <h2 class="subtitle subtitle_semibold subtitle_font-base mb-4">Ответы</h2>
        <div
          v-for="(answer, answerIndex) in question.answers"
          :key="answer.value"
          class="column items-start mb-4"
        >
          <Checkbox
            classes="mb-3"
            label="Правильный ответ"
            :model-value="answer.isRightAnswer"
            @update:model-value="setRightAnswer(questionIndex, answerIndex, $event)"
          />

          <div class="row w-full">
            <Input
              classes="input"
              :model-value="answer.value"
              @update:model-value="onUpdateAnswer(questionIndex, answerIndex, $event, 'value')"
            />

            <Button
              value="Удалить"
              class="button button_error button_normal mt-auto ml-2"
              @on-click="onDeleteAnswer(questionIndex, answerIndex)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

import Button from '@/components/UI/Button'
import Checkbox from '@/components/UI/Checkbox'
import Input from '@/components/UI/Input'
import Label from '@/components/UI/Label'

export default {
  name: 'CreateQuestion',
  components: {
    Button,
    Checkbox,
    Input,
    Label
  },
  setup () {
    const store = useStore()
    const questions = computed(() => {
      return JSON.parse(JSON.stringify(store.state.Quizlet.createdQuiz.questions))
    })

    function onUpdateAnswer (questionIndex, answerIndex, value, key) {
      store.commit('Quizlet/updateAnswer', { questionIndex, answerIndex, value, key })
    }

    function setRightAnswer (questionIndex, answerIndex, value) {
      console.log(2)
      questions.value[questionIndex].answers.forEach((item, index) => {
        if (index === answerIndex) {
          onUpdateAnswer(questionIndex, answerIndex, value, 'isRightAnswer')
        }

        onUpdateAnswer(questionIndex, answerIndex, false, 'isRightAnswer')
      })
    }

    return {
      questions,
      onAddAnswer: (questionIndex) => store.commit('Quizlet/addAnswer', questionIndex),
      onAddQuestion: () => store.commit('Quizlet/addQuestion'),
      onDeleteAnswer: (questionIndex, answerIndex) => store.commit('Quizlet/deleteAnswer', { questionIndex, answerIndex }),
      onDeleteQuestion: (questionIndex) => store.commit('Quizlet/deleteQuestion', questionIndex),
      onUpdateAnswer,
      onUpdateQuestion: (index, value) => store.commit('Quizlet/updateQuestion', { index, value }),
      setRightAnswer
    }
  }
}
</script>
