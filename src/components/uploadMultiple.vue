<template>
  <div>
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
import { getOssData } from '@/api/login'
import axios from 'axios'
export default {
  name: 'uploadMultiple',
  computed: {
    ...mapGetters({
      tokenData: 'user/tokenData'
    })
  },
  components: {},
  props: {
    value: {
      type: Array
    },
    label: {
      type: String,
      required: false,
      default: '选择图片'
    },
    limit: {
      type: Number
    }
  },
  data() {
    return {
      uploading: false,
      list: []
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
      if (this.value.length >= this.limit) {
        this.$message({
          type: 'info',
          message: '上传数量不能超过' + this.limit + '个'
        })
      } else {
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
                this.value.push(res.data.host + '/' + key)
                this.$emit('input', this.value)
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
      }
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2M!')
      }
      return isLt2M
    },
    // 删除图片
    parentHandleclick(index) {
      this.value.splice(index, 1)
      this.$emit('input', this.value)
    }
  }
}
</script>

<style lang='scss'>
</style>