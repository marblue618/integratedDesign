<template>
  <div class="">
    <el-upload class="upload-img-box"
      accept=".jpg,.png,.jpeg"
      action="/api/file/common/uploadPic"
      :show-file-list="false"
      :http-request="httpRequest"
      :before-upload="beforeAvatarUpload">
      <div v-if="imgUrl" class="change-pic">
        <img :src="imgUrl">
        <div v-loading="uploading">点击更换</div>
      </div>
      <div v-else>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">点击上传</div>
      </div>
    </el-upload>
    <slot></slot>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getOssData } from '@/api/login'
import axios from 'axios'
export default {
  name: 'uploadSquare',
  computed: {
    ...mapGetters({
      tokenData: 'user/tokenData'
    })
  },
  props: {
    limit: {
      type: Number,
      required: false,
      default: 2
    },
    imgUrl: {
      type: String,
      default: ''
    },
  },
  data () {
    return {
      value: '',
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
    httpRequest ({ file }) {
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
      const isLt2M = file.size / 1024 / 1024 < this.limit
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 ' + this.limit + 'M!')
      }
      return isLt2M
    }
  }
}
</script>

<style lang="scss" scoped>
  .form-desc {
    margin: 10px 0;
    line-height: normal;
    text-align: left;
    font-size: 12px;
    color: #999;
  }
  .upload-img-box {
    overflow: hidden;
    display: inline-block;
    width: 120px;
    height: 120px;
    text-align: center;
    line-height: normal;
    background-color: #f5f5f5;
    vertical-align: middle;

    img {
      max-width: 100%;
      max-height: 120px;
      vertical-align: middle;
    }
    .el-icon-upload {
      margin: 30px auto 5px;
      color: #c0c4cc;
      font-size: 40px;
    }
    .el-upload__text {
      color: #99A9BF;
      font-size: 14px;
    }

    .change-pic {
      display: inline-block;
      position: relative;
      width: 120px;
      height: 120px;
      line-height: 120px;

      div {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 26px;
        line-height: 26px;
        background-color: rgba(0, 0, 0, .3);
        color: #eee;
        font-size: 14px;
        text-align: center;
      }
    }
  }
  .example-pic {
    position: relative;
    display: inline-block;
    margin-left: 10px;
    width: 120px;
    height: 120px;
    text-align: center;
    line-height: 120px;
    background-color: #f5f5f5;
    cursor: pointer;
    vertical-align: middle;

    img {
      max-width: 100%;
      max-height: 120px;
      vertical-align: middle;
    }
    &:before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, .3);
    }
    .el-icon-view {
      position: absolute;
      left: 0;
      top: 40px;
      width: 100%;
      margin: 0 auto;
      color: #fff;
      font-size: 20px;
      line-height: normal;
    }
    .example-pic__text {
      position: absolute;
      left: 0;
      top: 65px;
      width: 100%;
      color: #fff;
      font-size: 14px;
      line-height: normal;
    }
  }

  .modal-box{
    /*display: none;*/
    position: fixed;
    z-index: 2;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,.3);
    text-align: center;
    color: #666;
  }
  .modal{
    display: inline-block;
    vertical-align: middle;
    text-align: left;
  }
  .modal-box:after{
    content: '';
    display: inline-block;
    vertical-align: middle;
    height: 100%;
  }
  .modal-close {
    position: absolute;
    top: -33px;
    right: 0;
    font-size: 18px;
    color: #fff;
    cursor: pointer;
  }
</style>
