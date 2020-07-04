<template>
  <div class="pccustomer">
    <div class="contents">
      <div class="search">
            
            <span>客户姓名</span><input type="text" v-model="searchForm.userName">
            <span>客户账号</span><input type="text" v-model="searchForm.userNumber">
            <button @click="toSearch()">查询</button>
            <button class="set" @click="setAll()">重置</button>
        </div>
        <div class="bigtables">
          <div class="tables">
              <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 80%" height="100%" >
              <el-table-column prop="userNumber" label="客户账号" width="200">
              </el-table-column>
              <el-table-column prop="userName" label="姓名" width="120">
              </el-table-column>        
              <el-table-column prop="userSex" label="性别" width="80">
                <template slot-scope="scope">
                  {{scope.row.userSex==0?"女":scope.row.userSex==1?"男":"未知"}}
                </template>
              </el-table-column>
              <el-table-column prop="userPhone" label="手机号" width="120">
              </el-table-column>
              <el-table-column prop="userEmail" label="客户邮箱" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="userIdcard" label="身份证" show-overflow-tooltip>
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
  </div>
</template>

<script>

import qs from 'Qs'
export default {
  
  name: 'pccustomer',
  data () {
    return {
       tableData:[],
       searchForm:{
            userNumber:'',
            userName:'',
          },
          currentPage:1,
          pageSize:5,
          total:0
    }
  },
  methods:{
     toSearch(){
        if(this.searchForm.userNumber!=''||this.searchForm.userName!=''){
           console.log(this.searchForm)
           this.getUserLists()
        }
      },
      setAll(){
        this.searchForm={
            userNumber:'',
            userName:'',
          }
          this.currentPage=1
          this.pageSize=5
          this.getUserLists()
      },
       handleSizeChange(val) {
       this.pageSize=val
        this.getUserLists()
      },
      handleCurrentChange(val) {
        this.currentPage=val
        this.getUserLists()
      },
      async getUserLists(){
        var data={
          userName:this.searchForm.userNumber,
          userRealName:this.searchForm.userName,
          pageSize:this.pageSize,
          pageNum:this.currentPage
        }
        const {data:res}=await this.$http.post("client/selectclient",qs.stringify(data))
        console.log()
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
              userNumber:res.rows[i].userName,
              userName:res.rows[i].userRealName,
              userSex:res.rows[i].sex,
              userPhone:res.rows[i].phone,
              userEmail:res.rows[i].email,
              userIdcard:res.rows[i].idCard,
             
            }
            userList.push(user)          
         }
         this.tableData=userList
        }
      }
  },
 created(){
    this.getUserLists()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.pccustomer {
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
  margin-right: 20%;
}
</style>
<style >
  .pccustomer .el-table th {
    background: #e0ebff;
} 
</style>
