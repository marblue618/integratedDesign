<template>
  <el-collapse v-model="activeNames" class="cpheader" >
    <el-collapse-item :title="title" name="1">
      <slot name="contont"></slot>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
export default {
  data() {
    return {
      activeNames: ['1']
    }
  },
  props: {
    title: {
      type: String,
      required: true
    }
  },
  methods: {}
}
</script>

<style>
  .cpheader {
    /* border-top: 4px solid green; */
    margin-bottom: 25px;
  }
  .cpheader .el-collapse-item__arrow {
    line-height: 20px;
  }
  .cpheader .el-collapse-item__header {
    height: 20px;
    font-size: 18px;
    line-height: 20px;
    box-sizing: content-box;
    padding: 10px;
  }
  .cpheader .el-collapse-item__header.is-active {
    border-bottom-color: #ebeef5;
  }
  .cpheader .el-collapse-item__content {
    padding: 10px;
  }
  .el-table th {
    background-color: #fafafa;
  }
</style>