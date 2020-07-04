<template>
  <div class="pcmenu">
    <div class="contents">
      <div class="smallmenu">
        <div class="title">
          <i class="el-icon-plus" @click="addMenu()"></i>
          <i class="el-icon-edit-outline" @click="editMenu()"></i>         
          <i class="el-icon-delete" @click="delMenu()"></i>
          <i class="el-icon-refresh" @click="reshMenu()"></i>
        </div>
        <div class="body">
          <el-tree :data="datatree" :props="defaultProps" @node-click="handleNodeClick" :default-expand-all="true" :highlight-current="true"></el-tree>

        </div>
      </div>
      <div class="menudetails">
        <div class="head">
            <div class="border"></div><span>菜单详情</span>
        </div>
        <div class="main">
          <el-form  label-width="80px" :model="menuDetail" :inline="true">
              <el-form-item label="菜单名称">
                <el-input v-model="menuDetail.nodeName" readonly></el-input>
              </el-form-item>
              <el-form-item label="菜单路径">
                <el-input v-model="menuDetail.menuUrl" readonly></el-input>
              </el-form-item>
              <el-form-item label="菜单类型">
                <el-select v-model="menuDetail.type" disabled>
                  <el-option label="目录" value="1"></el-option>
                  <el-option label="菜单" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="权限">
                <el-select v-model="menuDetail.authCode" disabled>
                  <el-option label="管理员" value="0"></el-option>
                  <el-option label="店长" value="1"></el-option>
                  <el-option label="用户" value="3"></el-option>
                </el-select>
              </el-form-item>
               <el-form-item label="图标">
                <el-input v-model="menuDetail.icon" readonly></el-input>
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="menuDetail.remark" readonly></el-input>
              </el-form-item>
          </el-form>
        </div>
      </div>
    </div>

    <el-dialog title="添加菜单" :visible.sync="dialogAddVisible">
      <el-form :model="addForm" :inline="true"  ref="addForm" :rules="rules">
        <el-form-item label="菜单名称" label-width="80px" prop="nodeName">
          <el-input v-model="addForm.nodeName"></el-input>
        </el-form-item>
        <el-form-item label="菜单路径" label-width="80px" prop="menuUrl">
          <el-input v-model="addForm.menuUrl"></el-input>
        </el-form-item>
        
         <el-form-item label="菜单类型" label-width="80px" prop="type">
          <el-select  placeholder="请选择类型" v-model="addForm.type" :disabled="flags">
            <el-option label="目录" value="1"></el-option>
            <el-option label="菜单" value="2"></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="权限" label-width="80px" prop="authCode">
                <el-select v-model="addForm.authCode">
                  <el-option label="管理员" value="0"></el-option>
                  <el-option label="店长" value="1"></el-option>
                  <el-option label="用户" value="3"></el-option>
                </el-select>
        </el-form-item>

        <el-form-item label="图标" label-width="80px" prop="icon">
          <el-input v-model="addForm.icon"></el-input>
        </el-form-item>
        
        <el-form-item label="备注" label-width="80px" prop="remark">
          <el-input v-model="addForm.remark"></el-input>
        </el-form-item>
      </el-form>  
       
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddVisible=false">取 消</el-button>
        <el-button type="primary" @click="submitaddFrom()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改菜单" :visible.sync="dialogEditVisible">
      <el-form :model="editForm" :inline="true"  ref="editForm" :rules="rules">
        <el-form-item label="菜单名称" label-width="80px" prop="nodeName">
          <el-input v-model="editForm.nodeName"></el-input>
        </el-form-item>
        <el-form-item label="菜单路径" label-width="80px" prop="menuUrl">
          <el-input v-model="editForm.menuUrl"></el-input>
        </el-form-item>
        
         <el-form-item label="菜单类型" label-width="80px" prop="type">
          <el-select  placeholder="请选择类型" v-model="editForm.type" disabled>
            <el-option label="目录" value="1"></el-option>
            <el-option label="菜单" value="2"></el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="权限" label-width="80px" prop="authCode">
                <el-select v-model="editForm.authCode">
                  <el-option label="管理员" value="0"></el-option>
                  <el-option label="店长" value="1"></el-option>
                  <el-option label="用户" value="3"></el-option>
                </el-select>
        </el-form-item>
         <el-form-item label="图标" label-width="80px" prop="icon">
          <el-input v-model="editForm.icon"></el-input>
        </el-form-item>
        
        <el-form-item label="备注" label-width="80px" prop="remark">
          <el-input v-model="editForm.remark"></el-input>
        </el-form-item>
      </el-form>  
       
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditVisible=false">取 消</el-button>
        <el-button type="primary" @click="submiteditFrom()">确 定</el-button>
      </div>
    </el-dialog>
   
     <el-dialog
      title="提示"
      :visible.sync="delWarnVisible"
      width="45%"
      >
      <span>删除的信息将不能复原！确定删除吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delWarnVisible = false">取 消</el-button>
        <el-button type="primary" @click="SureDel()">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: 'pcmenu',
  data () {
    return {
      datatree:[],
      defaultProps: {
          children: 'children',
          label: 'nodeName'
      },
      menuDetail:{
        nodeName:'',
        type:'',
        menuUrl:'',
        remark:'',
        icon:'',
        authCode:''
      },
      dialogAddVisible:false,
      delWarnVisible:false,
      dialogEditVisible:false,
      addForm:{
        nodeName:'',
        type:'',
        menuUrl:'',
        remark:'',
        icon:'el-icon-s-opportunity',
        authCode:'3'
      },
      editForm:{

      },
      rules: {
            nodeName: [
              { required: true, message: '请输入菜单名称', trigger: 'blur' },
              {pattern: /^\S*$/,message:'不能输入空格等非法字符',trigger: 'blur'},
              { min: 3, max: 10, message: '长度在3到10个字符', trigger: 'blur' }
            ],
            menuUrl: [
              { required: true, message: '请输入菜单路劲', trigger: 'blur' },
              {pattern: /^\S*$/,message:'不能输入空格等非法字符',trigger: 'blur'},
              { min: 1, max:20, message: '长度在1到20个字符', trigger: 'blur' }
            ],
            type:[
              { required: true, message: '请输入菜单类型', trigger: 'change' },
            ],
            authCode:[
              { required: true, message: '请输入权限', trigger: 'change' },
            ],
            remark:[
               {pattern: /^\S*$/,message:'不能输入空格等非法字符',trigger: 'blur'},
               { min: 0, max: 30, message: '不能超过30个字', trigger: 'blur' }
            ]
          },
        flags:false
    }
  },
   methods: {
      handleNodeClick(data) {
       
        this.menuDetail=data
        
      },
      addMenu(){
        console.log(this.menuDetail)
        if(this.$refs['addForm']){
            this.$refs['addForm'].resetFields()
         }
        if(this.menuDetail.nodeId){
          if(1==this.menuDetail.type){
            this.dialogAddVisible=true
            this.addForm.type='2'
            this.flags=true
          }
          else{
             this.$message({
              showClose: true,
              message: '菜单下无法新增',
              type: 'warning'
            });
          }
        }
        else {
            this.dialogAddVisible=true
             this.flags=true
             this.addForm.type='1'
        }
      },
      submitaddFrom(){
         this.$refs['addForm'].validate(async (valid) => {
          if (valid) {                    
            var datas={
              "menuName":this.addForm.nodeName,
              "menuUrl": this.addForm.menuUrl,
              "parentMenuCode": this.menuDetail.nodeId,
              "icon":this.addForm.icon,
              "remark": this.addForm.remark,
              "type": this.addForm.type,
              "authCode":this.addForm.authCode
            }
            const {data:res}=await this.$http.post("sysmenu/add",datas)
           
            if(res.code!==200)
               return this.$message({
                  message: '添加分类失败',
                  type: 'error',
                  duration:800,
                });
           
            this.dialogAddVisible=false 
            this.reshMenu()
            this.$message({
                  message: '添加分类成功',
                  type: 'success',
                  duration:800,
                });
          } else {            
            return false;
          }
        });
      },
       editMenu(){
         if(this.menuDetail.nodeId){
            if(this.$refs['editForm']){
              this.$refs['editForm'].resetFields()
            }     
            this.editForm=JSON.parse(JSON.stringify(this.menuDetail))
            this.dialogEditVisible=true
         }
         else {
            this.$message({
              showClose: true,
              message: '请选择一条数据进行修改',
              type: 'warning'
            });
         }
        
        
      },
      submiteditFrom(){
         this.$refs['editForm'].validate(async (valid) => {
          if (valid) {
            var datas=
              {
                "menuCode": this.menuDetail.nodeId,
                "menuName": this.editForm.nodeName,
                "menuUrl": this.editForm.menuUrl,
                "remark": this.editForm.remark,
                "type": this.menuDetail.type,
                "icon":this.editForm.icon,
                "authCode":this.editForm.authCode
              }
            console.log(datas)
            const {data:res}=await this.$http.put("sysmenu/editmenu",datas)
             console.log(res)
            if(res.code!==200)
               return this.$message({
                  message: '修改分类失败',
                  type: 'error',
                  duration:800,
                });
             
            this.dialogEditVisible=false 
            this.reshMenu()
            this.$message({
                  message: '修改分类成功',
                  type: 'success',
                  duration:800,
                });
          } else {            
            return false;
          }
        });
      },
      delMenu(){
        var flag=0
        if(this.menuDetail.children&&this.menuDetail.children.length!=0){
          flag=1
        }
        if(!this.menuDetail.nodeId){
           this.$message({
            showClose: true,
            message: '请选择一条数据进行删除',
            type: 'warning'
          });
        }
        else if(flag==1){
           this.$message({
            showClose: true,
            message: '目录下存在菜单，不可直接删除',
            type: 'warning'
          });
        }
        else {
          this.delWarnVisible=true
        }
      },
      async SureDel(){
        const {data:res}=await this.$http.delete("sysmenu/delmenu",{data:{menuCode:this.menuDetail.nodeId}})
        if(res.code!==200)
          return  this.$message({
                  message: '删除分类失败',
                  type: 'error',
                  duration:800,
                });
         this.$message({
                  message: '删除分类成功',
                  type: 'success',
                  duration:800,
                });
        this.getMenuLists()
        this.delWarnVisible=false
      },
      async getMenuLists(){
       const {data:res}=await this.$http.get("sysmenu/getMenu")
      
       var menulist=[]
        for(let x of res.data){
          
          if(x.childMenu&&x.childMenu.length!=0){
            var childlist=[]
             for (let y of x.childMenu){
              
              var child={
                nodeName:y.menuName,
                nodeId:y.menuCode,
                type:y.level+1+'',
                remark:y.remark,
                icon:y.icon,
                menuUrl:y.menuUrl,
                authCode:y.authCode
              }
              childlist.push(child)
              x.childMenu=childlist
            }
          }
          else{
             x.childMenu=[]
          }
          var parent={
            nodeName:x.menuName,
            nodeId:x.menuCode,
            type:x.level+1+'',
            remark:x.remark,
            icon:x.icon,
            menuUrl:x.menuUrl,
            authCode:x.authCode,
            children:x.childMenu,

          }
          menulist.push(parent)       
        }
        this.datatree=menulist
      },
      reshMenu(){
        this.menuDetail={
        nodeName:'',
        type:'',
        menuUrl:'',
        remark:'',
        icon:''
        }
        this.getMenuLists()
        
      }
    },
    mounted(){
      this.getMenuLists()
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.pcmenu {
  width: 100%;
  height: 100%;
}
.contents {
  width: 85%;
  height: calc(100% - 68px);
  float: left;
  background-color:#ecf0f4;
  overflow: auto;
  padding: 20px;
}
.smallmenu {
  width: 20%;
  height: 100%;
  background-color: #ffffff;
  float: left;
}
.menudetails {
  width: calc(80% - 20px);
  height: 100%;
  background-color: #ffffff;
  float: right;
}
.smallmenu .title {
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: right;
  padding-right: 15px;
}
.title i {
  color:#949ba7 ;
  font-size: 20px;
  margin-right:5px;
}
.smallmenu .body {
  width: 100%;
  height: calc(100% - 50px);
  overflow: auto;
}
.menudetails .head {
  width: 100%;
  height: 50px;
  padding-left: 20px;
  line-height: 48px;
  border-bottom: 2px solid #f2f3f6;
  font-size: 15px;
  color: #28374f;
}
.border {
  display: inline-block;
  width: 4px;
  height: 18px;
  border-radius: 2px;
  background-color: #6299fe;
  margin-right: 5px;
  margin-top: -2px;
  vertical-align: middle;
}
.menudetails .main {
  width: 100%;
  height: calc(100% - 50px);
  padding: 0 5%;
  padding-top: 20px;
}
 .menudetails .el-select {
   width: 206.4px;
}

</style>
<style >
  .pcmenu .el-tree {
    padding: 0 15px;
    color: #515c6d;
  }
  .pcmenu .el-tree-node__content:hover{
    background-color: #0062ba!important;
    color: #ffffff;
}

.pcmenu .el-dialog .el-form-item {
  width: 100%;
  
}
.pcmenu .el-dialog .el-form-item__content{
  width: calc(100% - 80px);
}
.pcmenu .el-dialog {
  width: 30%;
  min-width: 384px;
}
.pcmenu .el-dialog__body {
  padding: 20px 82px;
}
.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
    background-color: #0062ba;
    color: #ffffff;
}
</style>
