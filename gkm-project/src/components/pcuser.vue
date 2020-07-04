<template>
  <div class="pcuser">
    <div class="contents">
        <div class="search">
            <span>用户账号</span><input type="text" v-model="searchForm.userNumber">
            <span>用户姓名</span><input type="text" v-model="searchForm.userName">
            <span>用户角色</span><select v-model="searchForm.userRole">
              <option value="0">管理员</option>
              <option value="1">店长</option>
              <option value="2">司机</option>
              <option value="3">用户</option>
            </select>
            <button @click="toSearch()">查询</button>
            <button class="set" @click="setAll()">重置</button>
        </div>
        <div class="bigtables">
          <el-button type="primary" icon="el-icon-edit" @click="editUser()">修改</el-button>
           <el-button type="primary" icon="el-icon-circle-plus" @click="addUser()">添加</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="delUser()">删除</el-button>
          <div class="tables">
              <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" height="100%" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55" fixed>
              </el-table-column>
             
              <el-table-column prop="userNumber" label="用户账号" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="userName" label="用户姓名" width="120">
              </el-table-column>
              <el-table-column prop="userRole" label="角色" width="100">
                <template slot-scope="scope">
                  {{scope.row.userRole==0?"管理员":scope.row.userRole==1?"店长":scope.row.userRole==2?"司机":"用户"}}
              </template>
              </el-table-column>           
              <el-table-column prop="userSex" label="性别" width="80">
                <template slot-scope="scope">
                  {{scope.row.userSex==0?"女":scope.row.userSex==1?"男":"未知"}}
                </template>
              </el-table-column>
              <el-table-column prop="userPhone" label="手机号" width="120">
              </el-table-column>
              <el-table-column prop="userEmail" label="用户邮箱" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="userIdcard" label="身份证" show-overflow-tooltip>
              </el-table-column>
               <el-table-column prop="inviteCode" label="邀请码" width="100px">
              </el-table-column>
            </el-table>
          </div>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[1, 3, 5]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
    </div>
    <el-dialog title="添加用户" :visible.sync="dialogAddVisible">
      <el-form :model="addForm" :inline="true" :rules="rules" ref="addForm">
        <el-form-item label="用户账号" label-width="80px" prop="userNumber">
          <el-input v-model="addForm.userNumber"></el-input>
        </el-form-item>
        <el-form-item label="用户姓名" label-width="80px" prop="userName">
          <el-input v-model="addForm.userName"></el-input>
        </el-form-item>
         
         <el-form-item label="手机号" label-width="80px" prop="userPhone">
          <el-input v-model="addForm.userPhone"></el-input>
        </el-form-item>
         <el-form-item label="身份证" label-width="80px" prop="userIdcard">
          <el-input v-model="addForm.userIdcard"></el-input>
        </el-form-item>
        
        <el-form-item label="角色" label-width="80px" prop="userRole">
          <el-select  placeholder="请选择角色" v-model="addForm.userRole">
            <el-option label="管理员" value="0"></el-option>
            <el-option label="店长" value="1"></el-option>
            <el-option label="司机" value="2"></el-option>
            <el-option label="用户" value="3"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="性别" label-width="80px" prop="userSex">
          <el-select  placeholder="请选择性别" v-model="addForm.userSex">
            <el-option label="男" value="1"></el-option>
            <el-option label="女" value="0"></el-option>
           
          </el-select>
        </el-form-item>

        <el-form-item label="邮箱" label-width="80px"  prop="userEmail">
          <el-input v-model="addForm.userEmail"></el-input>
        </el-form-item>

        <el-form-item label="密码" label-width="80px" prop="userPassword">
          <el-input v-model="addForm.userPassword"></el-input>
        </el-form-item>
        <el-form-item label="邀请码" label-width="80px" prop="inviteCode">
          <el-input v-model="addForm.inviteCode"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddVisible=false">取 消</el-button>
        <el-button type="primary" @click="submitaddFrom()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改用户" :visible.sync="dialogEditVisible">
      <el-form :model="editForm" :inline="true" :rules="rules" ref="editForm">
        <el-form-item label="用户账号" label-width="80px" prop="userNumber" >
          <el-input v-model="editForm.userNumber" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户姓名" label-width="80px" prop="userName">
          <el-input v-model="editForm.userName"></el-input>
        </el-form-item>
         
         <el-form-item label="手机号" label-width="80px" prop="userPhone">
          <el-input v-model="editForm.userPhone"></el-input>
        </el-form-item>
         <el-form-item label="身份证" label-width="80px" prop="userIdcard">
          <el-input v-model="editForm.userIdcard"></el-input>
        </el-form-item>
        
        <el-form-item label="角色" label-width="80px" prop="userRole">
          <el-select  placeholder="请选择角色" v-model="editForm.userRole">
            <el-option label="管理员" value="0"></el-option>
            <el-option label="店长" value="1"></el-option>
            <el-option label="司机" value="2"></el-option>
            <el-option label="用户" value="3"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="性别" label-width="80px" prop="userSex">
          <el-select  placeholder="请选择性别" v-model="editForm.userSex">
            <el-option label="男" value="1"></el-option>
            <el-option label="女" value="0"></el-option>
            
          </el-select>
        </el-form-item>

        <el-form-item label="邮箱" label-width="80px"  prop="userEmail">
          <el-input v-model="editForm.userEmail"></el-input>
        </el-form-item>
         <el-form-item label="邀请码" label-width="80px" prop="inviteCode">
          <el-input v-model="editForm.inviteCode"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditVisible=false">取 消</el-button>
        <el-button type="primary" @click="submiteditFrom()">确 定</el-button>
      </div>
    </el-dialog>
    
    <el-dialog
      title="提示"
      :visible.sync="delWarnVisible">
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
  name: 'pcuser',
  data () {
    return {
      tableData:[],
         multipleSelection: [],
         currentPage: 1,
         pageSize:5,
         total:0,
         dialogAddVisible:false,
         dialogEditVisible:false,
         delWarnVisible:false,
         addForm:{
           userNumber:'',
           userName:'',
           userSex:'1',
           userPhone:'',
           userEmail:'',
           userIdcard:'',
           userPassword:'',
           userRole:'3',
           inviteCode:''
         },
         editForm:{},
          rules: {
            userName: [
              { required: true, message: '请输入真实姓名', trigger: 'blur' },
               {pattern: /^\S*$/,message:'不能输入空格等非法字符',trigger: 'blur'},
              { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
            ],
           userSex:[
              { required: true, message: '请选择性别', trigger: 'blur' },
            ],
            userRole:[
              { required: true, message: '请选择角色', trigger: 'blur' },
            ],
            userNumber:[
              { required: true, message: '请输入账号', trigger: 'blur' },
              {pattern:/^[0-9a-zA-Z]{5,12}$/,message:'请输入包含数字或字母的5-12位账号',trigger: 'blur'}
            ],
            userPhone:[
              { required: true, message: '请输入手机号', trigger: 'blur' },
              {pattern:/^1[34578]\d{9}$/,message:'请输入合法手机号',trigger: 'blur'}
            ],
            userPassword:[
              { required: true, message: '请输入密码', trigger: 'blur' },
              {pattern:/^[0-9a-zA-Z]{8,16}$/,message:'请输入包含数字或字母的8-16位密码',trigger: 'blur'}
            ],
            userEmail:[
              {pattern:/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/ ,message:'请输入合法邮箱',trigger: 'blur'}
            ],
            userIdcard:[
              { required: true, message: '请输入身份证号', trigger: 'blur' },
              {pattern:/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/ ,message:'请输入合法身份证号',trigger: 'blur'}
            ]
          },
          searchForm:{
            userNumber:'',
            userName:'',
            userRole:5
          }
    }
  },
  methods:{
      handleSelectionChange(val) {
          this.multipleSelection = val;
          // console.log(this.multipleSelection)
      },
      handleSizeChange(val) {
     
        this.pageSize=val
        this.getUserLists()
      },
      handleCurrentChange(val) {
           this.searchForm={
            userNumber:'',
            userName:'',
            userRole:5
          }
       this.currentPage=val
        this.getUserLists()
      },
      addUser(){       
         if(this.$refs['addForm']){
            this.$refs['addForm'].resetFields()
         }
        this.dialogAddVisible=true       
      },
      submitaddFrom(){
         this.$refs['addForm'].validate(async (valid) => {
          if (valid) {
            var data={
            "email": this.addForm.userEmail,
            "idCard": this.addForm.userIdcard,
            "inviteCode": this.addForm.inviteCode,
            "password": this.addForm.userPassword,
            "nickName": this.addForm.userName,
            "phone": this.addForm.userPhone,
            "role": this.addForm.userRole,
            "sex": this.addForm.userSex,
            "userName": this.addForm.userNumber,
            "userRealname": this.addForm.userName
            }
            const{data:res}=await this.$http.post("systemuser/adduser",data)
         
            if(res.code!==200){
               this.$message({
                message: '添加用户失败',
                type: 'error',
                duration:800,
              });
            }
            else{
              this.dialogAddVisible=false
              this.currentPage=1
              this.getUserLists()
               this.$message({
                message: '添加用户成功',
                type: 'success',
                duration:800,
              });
            }
          } else {            
            return false;
          }
        });
      },
      editUser(){
        if(this.multipleSelection.length!=1){
          this.$message({
            showClose: true,
            message: '请选择一条数据进行修改',
            type: 'warning'
          });
        }
        else {
           if(this.$refs['editForm']){
            this.$refs['editForm'].resetFields()
         }         
          this.editForm=JSON.parse(JSON.stringify(this.multipleSelection[0]))
          this.editForm.userRole=this.multipleSelection[0].userRole+''
          this.editForm.userSex=this.multipleSelection[0].userSex+''
          // console.log(this.editForm)
          this.dialogEditVisible=true
        }
      },
      submiteditFrom(){
         this.$refs['editForm'].validate(async (valid) => {
          if (valid) {
             var data={
            "email": this.editForm.userEmail,
            "idCard": this.editForm.userIdcard,
            "inviteCode": this.editForm.inviteCode,
            "password": this.editForm.userPassword,
            "nickName": this.editForm.userName,
            "phone": this.editForm.userPhone,
            "role": this.editForm.userRole,
            "sex": this.editForm.userSex,
            "userName": this.editForm.userNumber,
            "userRealname": this.editForm.userName,
            "userId":this.editForm.userId,
            }
            const{data:res}=await this.$http.put("systemuser/edituser",data)
           
             if(res.code!==200){
               this.$message({
                message: '修改用户失败',
                type: 'error',
                duration:800,
              });
            }
            else{
              this.dialogEditVisible=false
              this.getUserLists()
               this.$message({
                message: '添加用户成功',
                type: 'success',
                duration:800,
              });
            }
            
          } else {            
            return false;
          }
        });
      },
      delUser(){
        var flag=0
        for (var i=0; i<this.multipleSelection.length;i++){
          if(this.multipleSelection[i].userNumber=='admin'){
            flag=1
            break
          }
        }
        if(this.multipleSelection.length!=1){
           this.$message({
            showClose: true,
            message: '选择一条数据进行删除',
            type: 'warning'
          });
        }
        else if(flag==1){
          this.$message({
            showClose: true,
            message: 'admin账号不能删除',
            type: 'warning'
          });
        }
        else {
          this.delWarnVisible=true
        }
      },
      async SureDel(){
        var data={userId:this.multipleSelection[0].userId}
        const {data:res}=await this.$http.delete("systemuser/deluser",{data:data})
        if(res.code!=200){
          console.log(res)
           this.$message({
            message: '删除用户失败',
            type: 'error',
            duration:800,
          });
        }
        else{
           this.delWarnVisible=false
          this.getUserLists()
          this.$message({
            message: '删除用户成功',
            type: 'success',
            duration:800,
          });
        }
       
      },
      toSearch(){
        if(this.searchForm.userNumber!=''||this.searchForm.userName!=''||this.searchForm.userRole!=null){
          //  console.log(this.searchForm)
           this.getUserLists()
        }
      },
      setAll(){
        this.searchForm={
            userNumber:'',
            userName:'',
            userRole:5
          }
          this.pageSize=5
          this.currentPage=1
          this.getUserLists()
      },
      async getUserLists(){
        
        var data={
          pageSize:this.pageSize,
          pageNum:this.currentPage,
          userName:this.searchForm.userNumber,
          role:this.searchForm.userRole,
          userRealname:this.searchForm.userName,
        }
       const {data:res}=await this.$http.get("systemuser/selectuser",{params:data})
      
       if(res.code!==200){
            this.$message({
            message: '获取用户列表失败',
            type: 'error',
            duration:800,
          });
       }
       else{
          this.total=res.total
           var userList=[]
         for(var i=0;i<res.rows.length;i++){  
           var user={

              userId:res.rows[i].userId,
              userNumber:res.rows[i].userName,
              userName:res.rows[i].userRealname,
              userRole:res.rows[i].role,
              userSex:res.rows[i].sex,
              userPhone:res.rows[i].phone,
              userEmail:res.rows[i].email,
              userIdcard:res.rows[i].idCard,
              inviteCode:res.rows[i].inviteCode
            }
            userList.push(user)          
         }
         this.tableData=userList
         
         
       }
      }

    

  },
  mounted:function(){
    this.getUserLists()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.pcuser {
  width: 100%;
  height: 100%;
}
.contents {
  width: 85%;
  height: calc(100% - 68px);
  float: left;
  background-color:#ecf0f4;
  overflow: auto;
  padding: 20px ;
}
.search {
  width: 100%;
  height: 60px;
  background-color: #fff;
  padding:0 4%;
  line-height: 60px;
  overflow: hidden;
  font-size:0px ;
}
.search span {
  font-size: 14px;
  vertical-align: middle;
}
.search input{
  width: 13%;
  outline: 0;
  height: 30px;
  border-radius: 5px;
  border:1px solid #cccccc;
  margin-left: 10px;
  margin-right: 30px;
  vertical-align: middle;
  padding-left: 5px;
}
.search select {
  outline: 0;
  height: 30px;
  border-radius: 5px;
  border:1px solid #cccccc;
  margin-left: 10px;
  margin-right: 100px;
  vertical-align: middle;
}
.search button {
  display: inline-block;
  width: 60px;
  height: 30px;

  vertical-align: middle;
  background: #6299fe;
  border: 0;
  color: #fff;
  border-radius: 3px;
  margin-right: 10px;
  outline: 0;
   line-height: 30px;
}
.search .set {
  background-color: #fff;
  border: 1px solid #6299fe;
  color: #6299fe;
}
.bigtables {
  padding: 0 2%;
  padding-top: 10px;

  width: 100%;
  margin-top: 10px;
  height: calc(100% - 70px);
  background: #fff;
}
.tables {
  width: 100%;
  margin-top: 10px;
  overflow: auto;
  height: 300px;
  height: calc(100% - 180px); 
}
.el-pagination {
  float: right;
  margin-top: 3%;
}

</style>
<style >
  .pcuser .el-table th {
  background: #e0ebff;
}
 .pcuser.el-form--inline,
 .pcuser .el-form-item {
    width: 45%!important;
    margin-bottom: 40px;
}
.pcuser .el-form-item__content{
  width: calc(100% - 80px);
}
.pcuser .el-form-item__content .el-select,
.pcuser .el-form-item__content .el-input{
  width: 100%;
}
.pcuser .el-dialog {
  width: 45%;
  min-width: 576px;
}

</style>
