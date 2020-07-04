<template>
  <div class="pchome">
    <div class="contents">
     
     <div class="title">欢迎使用行走书店后台管理系统</div>
     <div class="writer">开发人员：顾凯铭</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'pchome',
  data () {
    return {
     
    }
  },
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.pchome {
  width: 100%;
  height: 100%;
}
.contents {
  width: 85%;
  height: calc(100% - 68px);
  float: left;
  background-color:#ecf0f4;
  overflow: auto;
}
.title {
  font-size: 24px;
  color: #0062ba;
  font-weight: 700;
  margin-top: 7%;
  margin-left: 5%;
}
.writer {
  margin-left: 5%;
  font-size: 14px;
  margin-top: 10px;
}
</style>
