<template>
  <div>
    <el-upload
      style="display: inline-block"
      action="/api/upload/uploadImg"
      :show-file-list="false"
      accept=".mpg, .mpeg, .mp4"
      :http-request="httpRequest"
    >
      <el-button :loading="uploading" type="primary" plain size="small">{{label}}</el-button>
    </el-upload>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getOssData } from '@/api/login'
import axios from 'axios'
export default {
  name: 'uploadVideo',
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
      default: '点击上传'
    }
  },
  data() {
    return {
      uploading: false
    }
  },
  methods: {
    returnFileName (type, name) {
      type = type.split('/')[0]
      var nowTime = new Date()
      var year = nowTime.getFullYear()
      var month = ('0' + (nowTime.getMonth() + 1)).substr(-2)
      var timestamp = Date.parse(new Date())
      var Num = Math.random().toString().substr(2, 6)
      return type + '/' + year + '/' + month + '/' + timestamp + Num + '.' + name.split('.').slice(-1)
    },
    httpRequest({ file }) {
      var formData = new FormData()
      this.uploading = true
      getOssData().then((res) => {
        if (res.code === 0) {
          var fileName = this.returnFileName(file.type, file.name)
          var key = res.data.dir + '/' + fileName
          formData.append('key', key)
          formData.append('policy', res.data.policy)
          formData.append('OSSAccessKeyId', res.data.accessid)
          formData.append('success_action_status', 200)
          formData.append('signature', res.data.signature)
          formData.append('file', file)
          axios({
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            url: res.data.host,
            data: formData,
            method: 'post'
          }).then(red => {
            if (red.status === 200) {
              this.$emit('input', res.data.host + '/' + key)
              this.uploading = false
            } else {
              this.$message({
                type: 'info',
                message: red.statusText
              })
              this.uploading = false
            }
          }).catch((el) => {
            this.$message({
              type: 'info',
              message: '网络异常'
            })
            this.uploading = false
          })
        } else {
          this.$message({
            type: 'info',
            message: res.message
          })
          this.uploading = false
        }
      })
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 300
      if (!isLt2M) {
        this.$message.error('上传视频大小不能超过 300M!')
      }
      return isLt2M
    }
  }
}
</script>

<style lang='scss'>
</style>