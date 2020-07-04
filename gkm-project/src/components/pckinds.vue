<template>
  <div class="pckinds">
    <div class="contents">
      <div class="smallmenu">
        <div class="title">
          <i class="el-icon-plus"  @click="addKinds()"></i>
          <i class="el-icon-edit-outline"  @click="editKinds()"></i>         
          <i class="el-icon-delete" @click="delKinds()"></i>
          <i class="el-icon-refresh"  @click="reshKinds()"></i>
        </div>
        <div class="body">
          <el-tree :data="datatree" :props="defaultProps" @node-click="handleNodeClick" :default-expand-all="true" :highlight-current="true"></el-tree>
        </div>
      </div>
            <div class="menudetails">
        <div class="head">
            <div class="border"></div><span>分类详情</span>
        </div>
        <div class="main">
          <el-form  label-width="80px" :model="kindsDetail" :inline="true">
              <el-form-item label="分类名称">
                <el-input v-model="kindsDetail.nodeName" readonly></el-input>
              </el-form-item>

              <el-form-item label="分类层级">
                <el-select v-model="kindsDetail.type" disabled>
                  <el-option label="一级分类" value="1"></el-option>
                  <el-option label="二级分类" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="kindsDetail.remark" readonly></el-input>
              </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  
  <el-dialog title="添加商品分类" :visible.sync="dialogAddVisible">
      <el-form :model="addForm" :inline="true"  ref="addForm" :rules="rules">
        <el-form-item label="分类名称" label-width="80px" prop="nodeName">
          <el-input v-model="addForm.nodeName"></el-input>
        </el-form-item>
        
         <el-form-item label="分类层级" label-width="80px" prop="type">
          <el-select  placeholder="请选择层级" v-model="addForm.type" :disabled="flags">
            <el-option label="一级分类" value="1"></el-option>
            <el-option label="二级分类" value="2"></el-option>
          </el-select>
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
  
   <el-dialog title="修改商品分类" :visible.sync="dialogEditVisible">
      <el-form :model="editForm" :inline="true"  ref="editForm" :rules="rules">
        <el-form-item label="分类名称" label-width="80px" prop="nodeName">
          <el-input v-model="editForm.nodeName"></el-input>
        </el-form-item>

        
         <el-form-item label="分类层级" label-width="80px" prop="type">
          <el-select  placeholder="请选择层级" v-model="editForm.type" disabled>
            <el-option label="一级分类" value="1"></el-option>
            <el-option label="二级分类" value="2"></el-option>
          </el-select>
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
  name: 'pckinds',
  data () {
    return {
       datatree:[],
       kindsDetail:{
         nodeId:'',
        nodeName:'',
        type:'',
        remark:'',
       },
       defaultProps: {
          children: 'children',
          label: 'nodeName'
        },
       dialogAddVisible:false,
        delWarnVisible:false,
      dialogEditVisible:false,
      addForm:{
        nodeName:'',
        type:'1',
        remark:'',
      },
       editForm:{

      },
      flags:false,
       rules: {
            nodeName: [
              { required: true, message: '请输入分类名称', trigger: 'blur' },
              {pattern: /^\S*$/,message:'不能输入空格等非法字符',trigger: 'blur'},
              { min: 1, max: 10, message: '长度在1到10个字符', trigger: 'blur' }
            ],
            type:[
              { required: true, message: '请输入层级', trigger: 'change' },
            ],
            remark:[
               {pattern: /^\S*$/,message:'不能输入空格等非法字符',trigger: 'blur'},
               { min: 0, max: 30, message: '不能超过30个字', trigger: 'blur' }
            ]
          },
    }
  },
  methods:{
      handleNodeClick(data) {
          this.kindsDetail=data
      },
      async getKindsLists(){
        const {data:res}=await this.$http.get("cate/getcate")
        console.log(res)
        var catelist=[]
        for(let x of res.data){
          
          if(x.childCate&&x.childCate.length!=0){
            var childlist=[]
             for (let y of x.childCate){
              
              var child={
                nodeName:y.cateName,
                nodeId:y.cateCode,
                type:y.level,
                remark:y.remark
              }
              childlist.push(child)
              x.childCate=childlist
            }
          }
          else{
             x.childCate=[]
          }
          var parent={
            nodeName:x.cateName,
            nodeId:x.cateCode,
            type:x.level,
            remark:x.remark,
            children:x.childCate,

          }
          catelist.push(parent)

        
        }
       this.datatree=catelist
      },
      reshKinds(){
        this.kindsDetail={
         nodeId:'',
        nodeName:'',
        type:'',
        remark:'',
       },
        this.getKindsLists()  
      },
      addKinds(){
        if(this.$refs['addForm']){
            this.$refs['addForm'].resetFields()
         }
        if(this.kindsDetail.nodeId){
          if(1==this.kindsDetail.type){
            this.dialogAddVisible=true
            this.addForm.type='2'
            this.flags=true
          }
          else{
             this.$message({
              showClose: true,
              message: '二级分类下无法新增',
              type: 'warning'
            });
          }
        }
        else {
            this.addForm.type='1'
            this.dialogAddVisible=true
             this.flags=true
        }
      },
       submitaddFrom(){
         this.$refs['addForm'].validate(async (valid) => {
          if (valid) {                 
              var data={
                
                "cateCodeParent": this.kindsDetail.nodeId,
                "cateName": this.addForm.nodeName,
                "level": this.addForm.type,
                "remark": this.addForm.remark,
              }
              const {data:res}=await this.$http.post("cate/addcate",data)
              if(res.code!==200)
                return this.$message({
                  message: '添加分类失败',
                  type: 'error',
                  duration:800,
                });
              this.reshKinds()
              this.dialogAddVisible=false
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
       editKinds(){
         if(this.kindsDetail.nodeId){
            if(this.$refs['editForm']){
              this.$refs['editForm'].resetFields()
            }     
            this.editForm=JSON.parse(JSON.stringify(this.kindsDetail))
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
             var data={ 
                "cateCode": this.editForm.nodeId,
                "cateName": this.editForm.nodeName,
                "remark": this.editForm.remark,
              }
              const{data:res}=await this.$http.post("cate/editcate",data)
               if(res.code!==200)
                return this.$message({
                  message: '修改分类失败',
                  type: 'error',
                  duration:800,
                });
              this.reshKinds()
              this.dialogEditVisible=false
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
       delKinds(){
        var flag=0
        if(this.kindsDetail.children&&this.kindsDetail.children.length!=0){
          flag=1
        }
        if(!this.kindsDetail.nodeId){
           this.$message({
            showClose: true,
            message: '请选择一条数据进行删除',
            type: 'warning'
          });
        }
        else if(flag==1){
           this.$message({
            showClose: true,
            message: '一级分类下存在二级分类，不可直接删除',
            type: 'warning'
          });
        }
        else {
          this.delWarnVisible=true
        }
      },
      async SureDel(){
        const {data:res}=await this.$http.post("cate/delcate?cateCode="+this.kindsDetail.nodeId)
        if(res.code!==200){
            this.$message({
                  message: res.msg,
                  type: 'error',
                  duration:800,
                });
            this.delWarnVisible=false
        }
        else{
              this.delWarnVisible=false
              this.reshKinds()
              this.$message({
                  message: '删除分类成功',
                  type: 'success',
                  duration:800,
                });
        }
              
            
      },
  },
  mounted(){
    this.getKindsLists()
  }
 
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.pckinds {
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

</style>
<style>
.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
    background-color: #0062ba;
    color: #ffffff;
}
  .pckinds .el-tree {
    padding: 0 15px;
    color: #515c6d;
  }
  .pckinds .el-tree-node__content:hover{
    background-color: #0062ba!important;
    color: #ffffff;
}
.pckinds .el-dialog .el-form-item {
  width: 100%;
  
}
.pckinds .el-dialog .el-form-item__content{
  width: calc(100% - 80px);
}
.pckinds .el-dialog {
  width: 30%;
  min-width: 384px;
}
.pckinds .el-dialog__body {
  padding: 20px 82px;
}
</style>
