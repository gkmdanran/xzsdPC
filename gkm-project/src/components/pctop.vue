<template>
  <div class="pctop">
    <div class="title">
      行走书店后台管理系统
    </div>
    <div class="userinfos">        
        <div class="names">
            <el-dropdown @command="handleCommand" trigger="click" >
              <span class="el-dropdown-link">
               {{username}}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown" class="drops">
                <el-dropdown-item command="a">退出登录</el-dropdown-item>
                <el-dropdown-item command="b">修改密码</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
        </div>
        <img src="../img/photo.jpg" alt="">
    </div>
      <el-dialog title="修改密码" :visible.sync="dialogFormVisible">
        <el-form >
          <el-form-item label="请输入原密码" label-width="100px" >
            <el-input  v-model="oldpsd" type="password"></el-input>
          </el-form-item>
          <el-form-item label="请输入新密码" label-width="100px">
            <el-input  v-model="newpsd" type="password"></el-input>
          </el-form-item>
          <el-form-item label="请确认新密码" label-width="100px" >
            <el-input  v-model="checkpsd" type="password" ></el-input>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitPsd()">确 定</el-button>
      </div>
     </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'pctop',
  props:['username','userid'],
  data () {
    return {
      userId:'',
     dialogFormVisible: false,
     oldpsd:'',
     newpsd:'',
     checkpsd:'',
    }  
  },
  methods:{
     async handleCommand(command) {
        if(command=='a'){
           this.loginOut()
        }
        if(command=='b'){
          this.oldpsd=''
          this.newpsd=''
          this.checkpsd=''
          this.dialogFormVisible=true
        }
      },
      async submitPsd(){
        
         if(this.oldpsd!=''&&this.newpsd!=''&&this.checkpsd!=''){
            var flag=true
          var patt1 = new RegExp("^[0-9a-zA-Z]{8,16}$");
          if(!patt1.test(this.newpsd)){
            this.$message({
              message:'请输入包含数字或密码的8-16位新密码',
              showClose: true,
              type: 'warning'
            })
            this.oldpsd=''
            this.newpsd=''
            this.checkpsd=''
            flag=false
          }
          if(this.checkpsd!=this.newpsd){
             this.$message({
              message:'两次输入的请保持一致',
              showClose: true,
              type: 'warning'
            })
            this.oldpsd=''
            this.newpsd=''
            this.checkpsd=''
            flag=false
          }
          if(flag==true){
            var datas={
              "checkPassword": this.checkpsd,
              "newPassword": this.newpsd,
              "oldPassword": this.oldpsd,
              "userId": this.userid
            }
            const {data:res}=await this.$http.put("editpassword/editpassword",datas)
           
            if(res.code!==200)
               return this.$message({
                  message: res.msg,
                  type: 'error',
                  duration:800,
                });
               
            this.dialogFormVisible=false
             this.$message({
                  message: "修改密码成功！请重新登录",
                  type: 'success',
                  duration:800,
                });
            this.loginOut()
          }
         }
        
        
      
      },
      async loginOut(){
        var {data:res}=await this.$http.post("common/logout")
            // console.log(res.code)
            if(res.code!==200){
               this.$message({
                message: '退出异常',
                type: 'error',
                duration:800,
              });
            }
            else{
                window.sessionStorage.clear()
                this.$router.push({
                  path:'/'
                })
                this.$message({
                message: '退出成功',
                type: 'success',
                duration:800,
              });
            }       
      }
  },
  created:function(){
  
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .pctop{
    width: 100%;
    height: 100%;
    border-bottom: 1px solid #dadfe7;    
  }
  .pctop .title {
    float: left;
    width: 50%;
    height: 68px;
    line-height: 68px;
    padding-left: 25px;
    font-size: 25px;
    color: #0062ba;
    font-weight: 700;
  }
  .pctop .userinfos {
    float: left;
    width: 50%;
    height: 68px;
    line-height: 68px;
    padding-right: 25px;
  }
  .userinfos img {
    float: right;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-top: 12px;
    margin-right: 20px;
  }
  .userinfos .names {    
      cursor: pointer; 
      height: 40px;
      line-height: 40px;    
      float: right;
      margin-top: 12px;
      font-size: 16px;
      color: #505568;
  }
</style>
<style >
.pctop .el-dialog{
  width: 30%;
  min-width: 384px;
}
 .el-dropdown-menu.drops {
  width: 100px!important;
}
</style>
