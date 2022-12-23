<template>
  <div style="display: inline-block;">
    <el-upload
      style="display: inline-block"
      action="/api/upload/uploadImg"
      :show-file-list="false"
      accept=".jpg,.png,.jpeg"
      :http-request="httpRequest"
    >
      <el-button :loading="uploading" type="primary" plain size="small">{{label}}</el-button>
    </el-upload>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'
export default {
  name: 'uploadPicture',
  computed: {
    ...mapGetters({
      tokenData: 'user/tokenData'
    })
  },
  components: {},
  props: {
    value: {
      type: String
    },
    label: {
      type: String,
      required: false,
      default: '上传图片'
    },
    limit: {
      type: Number,
      required: false,
      default: 2
    }
  },
  data() {
    return {
      uploading: false
    }
  },
  methods: {
    httpRequest({ file }) {
      this.uploading = true
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
          this.$emit('input', res.data.data.url)
        } else {
          this.$message({
            type: 'info',
            message: res.data.message
          })
        }
        this.uploading = false
      }).catch(() => {
        this.uploading = false
      })
    }
  },
  mounted() {
  }
}
</script>

<style lang='scss'>
</style>