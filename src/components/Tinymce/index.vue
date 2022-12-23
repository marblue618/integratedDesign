<template>
  <div v-loading="loading" :element-loading-text="loadingText">
    <textarea :id="'tinymce-' + random"></textarea>
    <input :id="'file-input-' + random" type="file" style="display: none;">
  </div>
</template>
<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
export default {
  name: 'tinymce',
  props: {
    'height': {
      type: Number,
      default: 300
    }
  },
  computed: {
    ...mapGetters({
      tokenData: 'user/tokenData'
    })
  },
  methods: {
    checkAllUploaded() {
      Promise.all(this.uploadPromise).then(res => {
        this.loading = false
      })
    },
    setContent(content) {
      this.Promise.then((editors) => {
        this.editor.setContent(content)
      })
    },
    getContent() {
      // tinymce.activeEditor.dom.setAttrib(tinymce.activeEditor.dom.select('img'), 'style', 'width: 100%;height:auto;')
      // tinymce.activeEditor.dom.setAttrib(tinymce.activeEditor.dom.select('video'), 'style', 'width: 100%;height:auto;')
      // tinymce.activeEditor.dom.setAttrib(tinymce.activeEditor.dom.select('iframe'), 'style', 'width: 100%;height:auto;')
      return this.editor.getContent()
    },
    getContentAfterImagesUploaded() {
      return new Promise(resolve => {
        this.editor.uploadImages(() => {
          // tinymce.activeEditor.dom.setAttrib(tinymce.activeEditor.dom.select('img'), 'style', 'width: 100%;height:auto;')
          // tinymce.activeEditor.dom.setAttrib(tinymce.activeEditor.dom.select('video'), 'style', 'width: 100%;height:auto;')
          // tinymce.activeEditor.dom.setAttrib(tinymce.activeEditor.dom.select('iframe'), 'style', 'width: 100%;height:auto;')
          resolve(this.editor.getContent())
        })
      })
    },
    upload(file, filename) {
      console.log(file, filename)
      var formData = new FormData()
      formData.append('token', this.tokenData)
      formData.append('img', file)
      return axios({
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        url: '/tp/api/upload/uploadImg',
        data: formData,
        method: 'post'
      }).then(res => {
        if (res.data.code === 0) {
          return Promise.resolve(res.data.data.url)
        } else {
          this.$message({
            type: 'info',
            message: res.data.message
          })
          return Promise.reject('')
        }
      }).catch((e) => {
        return Promise.reject(e)
      })
    },
    chooseImage(x) {
      var fileInput = document.getElementById('file-input-' + this.random)
      fileInput.click()
      let self = this
      return new Promise((resolve, reject) => {
        fileInput.onchange = (e) => {
          self.loading = true
          self.loadingText = '请稍后...'
          self.$emit('loadUp', true)
          var file = fileInput.files[0]
          var formData = new FormData()
          formData.append('token', this.tokenData)
          formData.append('img', file)
          axios({
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            url: '/tp/api/upload/uploadImg',
            data: formData,
            method: 'post'
          }).then(res => {
            if (res.data.code === 0) {
              self.loading = false
              this.$emit('loadUp', false)
              resolve(res.data.data.url)
            } else {
              this.$message({
                type: 'info',
                message: res.data.message
              })
              self.loading = false
              reject()
            }
          }).catch((el) => {
            self.loading = false
            reject()
          })
        }
      })
    }
  },
  data() {
    return {
      random: Math.round(Math.random() * 10000),
      Promise: undefined,
      editor: undefined,
      uploadPromise: [],
      loading: true,
      loadingText: '加载中...'
    }
  },
  mounted() {
    var self = this
    this.Promise = tinymce.init({
      selector: `#tinymce-${self.random}`,
      height: self.height,
      theme: 'modern',
      language: 'zh_CN',
      elementpath: false,
      branding: false,
      force_br_newlines : true,
      force_p_newlines : false,
      forced_root_block : '',
      plugins: [
        'lineheight advlist autolink lists link image charmap preview hr anchor ',
        'searchreplace visualblocks visualchars code fullscreen',
        'insertdatetime nonbreaking save table contextmenu directionality',
        'template powerpaste textcolor colorpicker textpattern imagetools'
      ],
      toolbar1: 'fontselect | fontsizeselect | styleselect | lineheightselect | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent link image media | forecolor backcolor emoticons preview',
      font_formats: '宋体=SimSun,STSong;黑体=SimHei,STHeiti;微软雅黑=Microsoft YaHei;楷体=KaiTi,STKaiti;Arial=arial,helvetica,sans-serif;Courier New=courier new,courier,monospace;AkrutiKndPadmini=Akpdmi-n',
      lineheight_formats: '8pt 10pt 12pt 14pt 18pt 24pt 36pt 48pt 60pt 72pt',
      fontsize_formats: '8pt 10pt 12pt 14pt 18pt 24pt 36pt 48pt 60pt 72pt',
      indentation: '2em',
      powerpaste_word_import: 'merge', // propmt, merge, clear
      powerpaste_html_import: 'merge', // propmt, merge, clear
      powerpaste_allow_local_images: true,
      file_picker_callback: function(callback, value, meta) {
        // Provide file and text for the link dialog
        if (meta.filetype === 'file') {
          self.chooseImage().then(res => {
            callback(res)
          })
        }
        // Provide image and alt text for the image dialog
        if (meta.filetype === 'image') {
          self.chooseImage().then(res => {
            callback(res)
          })
        }
        // Provide alternative source and posted for the media dialog
        if (meta.filetype === 'media') {
          self.chooseImage('media').then(res => {
            console.log(res)
            // tinymce.activeEditor.setContent(
            //   `<div class="mce-preview-object mce-object-video" contenteditable="false" data-mce-object="video" data-mce-p-allowfullscreen="allowfullscreen" data-mce-p-frameborder="no" data-mce-p-scrolling="no" data-mce-p-src=${res} data-mce-html="%20">
            //     <video src=${res} width="100%" controls="controls"><source src=${res} /></video><span class="mce-shim"></span>
            //   </div>`
            // )
            callback(res)
          })
        }
      },
      paste_data_images: true,
      images_upload_handler: function(blobInfo, success, failure) {
        self.loading = true
        self.loadingText = '图片上传中，请稍后...'
        self.uploadPromise.push(
          self.upload(blobInfo.blob(), blobInfo.filename()).then(res => {
            success(res)
            self.checkAllUploaded()
            // tinymce.activeEditor.dom.setAttrib(tinymce.activeEditor.dom.select('img'), 'style', 'width: 100%;')
            return Promise.resolve('')
          })
        )
      }
      // content_style: 'body{font-family: sans-serif !important;}'
    }).then((editors) => {
      this.editor = editors[0]
      this.loading = false
    })
  },
  activated() {
    tinymce.EditorManager.execCommand('mceAddEditor', true, `tinymce-${this.random}`)
    this.editor = tinymce.get(`tinymce-${this.random}`)
  },
  deactivated() {
    tinymce.EditorManager.execCommand('mceRemoveEditor', true, `tinymce-${this.random}`)
  }
}
</script>
