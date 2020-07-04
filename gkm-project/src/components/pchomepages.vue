<template>
  <div class="pchomepages">
    <div class="top">
        <pctop :username="userName" :userid="userId"></pctop>
    </div>
    <div class="slide">
      <pcslide></pcslide>
    </div>
    <router-view/>
  </div>
</template>

<script>
import pctop from './pctop'
import pcslide from './pcslide'

export default {
  name: 'pchomepages',
  data () {
    return {
     userName:'',
     userId:'',
     role:''
    }
  },
  components:{pctop,pcslide},
  methods:{
    async getLoginInfo(){
        var {data:res}=await this.$http.get("common/getLoginInfo")
        
        this.userName=res.user.userName
        this.userId=res.user.userId
        localStorage.setItem('role',res.user.role)
      }
  },
  created:function(){
   this.getLoginInfo()
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.pchomepages {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.top{
  width: 100%;
  height: 68px;
}
.slide {
  width: 15%;
  height: calc(100% - 68px);
  float: left;
  overflow-x: hidden;
  
}

</style>
