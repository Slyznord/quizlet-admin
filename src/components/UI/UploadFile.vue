<template>
  <div class="upload-file">
    <label for="upload" class="upload-file__label">
      <DownloadIcon class="upload-file__icon mr-2" />

      <p class="upload-file__text">Загрузить логотип</p>

      <input
        id="upload"
        type="file"
        class="upload-file__input"
        @change="uploadFile($event)"
      >
    </label>

    <p class="upload-file__text upload-file__text_black ml-2">{{ filename }}</p>
  </div>
</template>

<script>
import { DownloadIcon } from '@heroicons/vue/outline'

export default {
  name: 'UploadFile',
  props: {
    filename: {
      type: String,
      default: ''
    }
  },
  components: {
    DownloadIcon
  },
  setup (props, { emit }) {
    const allowedExtensions = ['png', 'jpg', 'jpeg', 'svg']
    const extractFileExtension = (filename) => {
      const ext = filename.match(/\.([^.]+)$/)
      return ext && ext[1]
    }

    function uploadFile (event) {
      const file = event.target.files[0]
      const fileExtension = extractFileExtension(file.name)

      if (!allowedExtensions.includes(fileExtension)) {
        emit('uploadFile', null)
        return alert('Недопустимое расширение файла, разрешены только png, jpg, jpeg и svg')
      }

      emit('uploadFile', file)
    }

    return {
      uploadFile
    }
  }
}
</script>
