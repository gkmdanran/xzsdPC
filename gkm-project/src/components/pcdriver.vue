<template>
  <div class="pcdriver">
    <div class="contents">
        <div class="search">
            
            <span>司机编号</span><input type="text" v-model="searchForm.driverCode">
            <span>司机姓名</span><input type="text" v-model="searchForm.driverName">
            
            <span>所在省份</span><select @change="searchProvince()" v-model="searchForm.driverProvince">
              
              <option :value="x.value" v-for="x in provinceList" :key="x.value" v-text="x.label"></option>
            </select>
             <br>
             <span>所在市/区</span><select @change="searchCity()" v-model="searchForm.driverCity" style="width:200px;">
              
              <option :value="x.value" v-for="x in cityList" :key="x.value" v-text="x.label" ></option>

            </select> 
        
            <button @click="toSearch()">查询</button>
            <button class="set" @click="setAll()">重置</button>
      </div>
      <div class="bigtables">
          <!-- <el-button type="primary" icon="el-icon-s-comment" @click="viewDetails()">详情</el-button> -->
          <el-button type="primary" icon="el-icon-circle-plus" @click="addDriver()" :disabled="loginRole==0">新增</el-button>
          <el-button type="primary" icon="el-icon-edit"   @click="editDriver()" :disabled="loginRole==1">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="delDriver()">删除</el-button>
          <div class="tables">
            <el-table ref="multipleTable" :data="driverList" tooltip-effect="dark" style="width: 100%" height="100%" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55" fixed>
              </el-table-column>
             
              <el-table-column prop="driverCode" label="司机编号" width="180">
              </el-table-column>
              <el-table-column prop="driverName" label="司机姓名" width="100">
              </el-table-column>   
              <el-table-column prop="driverPhone" label="手机号" width="120">
              </el-table-column>
              <el-table-column prop="driverIdcard" label="身份证" width="200">
              </el-table-column>
              <el-table-column prop="driverNumber" label="司机账号" width="200">
              </el-table-column>
              <el-table-column prop="driverProvince" label="省"  show-overflow-tooltip>
                 <template slot-scope="scope">
                  {{scope.row.driverProvince}}
                </template>
              </el-table-column>
              
              <el-table-column prop="driverCity" label="市/区" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{scope.row.driverCity}}
                </template>
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

     <el-dialog title="新增司机信息" :visible.sync="dialogAddVisible">
      <el-form :model="addForm" :inline="true" :rules="rules1" ref="addForm">
         <el-form-item label="司机ID" label-width="120px" prop="userCode">
          <el-select  placeholder="请选择司机" v-model="addForm.userCode" @change="getDriverInfo()">
           <el-option :label="x.userId" :value="x.userId" v-for="x in drivers" :key="x.userId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="司机姓名" label-width="120px" prop="driverName">
          <el-input v-model="addForm.driverName" disabled></el-input>
        </el-form-item>
         <el-form-item label="联系电话" label-width="120px" prop="driverPhone">
          <el-input v-model="addForm.driverPhone" disabled></el-input>
        </el-form-item>
         <el-form-item label="账号" label-width="120px" prop="driverNumber">
          <el-input v-model="addForm.driverNumber" disabled></el-input>
        </el-form-item>
         <!-- <el-form-item label="密码" label-width="120px" prop="driverPsd">
          <el-input v-model="addForm.driverPsd"></el-input>
        </el-form-item> -->
         <el-form-item label="身份证" label-width="120px" prop="driverIdcard" >
          <el-input v-model="addForm.driverIdcard" disabled></el-input>
        </el-form-item> 
        <!-- <el-form-item label="所在省" label-width="120px" prop="driverProvince">
          <el-select  placeholder="请选择省" v-model="addForm.driverProvince" @change="addProvince()">
            <el-option :label="x.label" :value="x.value" v-for="x in provinceList" :key="x.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所在市" label-width="120px" prop="driverCity">
          <el-select  placeholder="请选择市" v-model="addForm.driverCity" @change="addCity()">
          <el-option :label="x.label" :value="x.value" v-for="x in cityList" :key="x.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所在区" label-width="120px" prop="driverArea">
          <el-select  placeholder="请选择区" v-model="addForm.driverArea">
           <el-option :label="x.label" :value="x.value" v-for="x in areaList" :key="x.value"></el-option>
          </el-select>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddVisible=false">取 消</el-button>
        <el-button type="primary" @click="submitaddFrom()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改司机信息" :visible.sync="dialogEditVisible">
      <el-form :model="editForm" :inline="true" :rules="rules" ref="editForm">
        <el-form-item label="司机姓名" label-width="120px" prop="driverName">
          <el-input v-model="editForm.driverName"></el-input>
        </el-form-item>
         <el-form-item label="联系电话" label-width="120px" prop="driverPhone">
          <el-input v-model="editForm.driverPhone"></el-input>
        </el-form-item>
         <el-form-item label="账号" label-width="120px"  >
          <el-input v-model="editForm.driverNumber" disabled></el-input>
        </el-form-item>
        
         <el-form-item label="身份证" label-width="120px" prop="driverIdcard">
          <el-input v-model="editForm.driverIdcard"></el-input>
        </el-form-item> 
        <el-form-item label="所在省" label-width="120px" prop="driverProvince">
          <el-select  placeholder="请选择省" v-model="editForm.driverProvince" @change="editProvince()">
            <el-option :label="x.label" :value="x.value" v-for="x in provinceList" :key="x.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所在市" label-width="120px" prop="driverCity">
          <el-select  placeholder="请选择市" v-model="editForm.driverCity" @change="editCity()">
          <el-option :label="x.label" :value="x.value" v-for="x in cityList" :key="x.value"></el-option>
          </el-select>
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
     
      >
      <span>删除的信息将不能复原！确定删除吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delWarnVisible = false">取 消</el-button>
        <el-button type="primary" @click="SureDel()">确 定</el-button>
      </span>
    </el-dialog>
     <el-dialog
      title="司机详情"
      :visible.sync="detailVisible"
      width="30%"
      >
      <span v-text="driverdetailinfos"></span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="detailVisible = false">取 消</el-button>
        <el-button type="primary" @click="detailVisible = false">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import qs from 'Qs'
export default {
  name: 'pcdriver',
  data () {
    return {
      drivers:['123','123224'],
      loginRole:'',
      dialogAddVisible:false,
      dialogEditVisible:false,
      delWarnVisible:false,
      detailVisible:false,
      currentPage: 1,
      pageSize:5,
      total:0,
      multipleSelection: [],
      provinceList:[],
      cityList:[],
      areaList:[],
      driverList:[],
      driverdetailinfos:'',
      searchForm:{
            driverCode:'',
            driverName:'',
            driverProvince:'',
            driverCity:'',
            driverArea:''
     },
     addForm:{
       userCode:'',
       driverName:'',
       driverPhone:'',
       driverNumber:'',
       driverPsd:'',
       driverIdcard:'',
       driverProvince:'',
       driverCity:'',
       driverArea:'',
     },
     editForm:{},
     rules: {
            driverName: [
              { required: true, message: '请输入司机姓名', trigger: 'blur' },
              {pattern: /^\S*$/,message:'不能输入空格等非法字符',trigger: 'blur'},
              { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
            ],
            driverPhone:[
              { required: true, message: '请输入手机号', trigger: 'blur' },
              {pattern:/^1[34578]\d{9}$/,message:'请输入合法手机号',trigger: 'blur'}
            ],
            driverNumber:[
              { required: true, message: '请输入账号', trigger: 'blur' },
              {pattern:/^[0-9a-zA-Z]{5,12}$/,message:'请输入包含数字或字母的5-12位账号',trigger: 'blur'}
            ],
            driverPsd:[
              { required: true, message: '请输入密码', trigger: 'blur' },
              {pattern:/^[0-9a-zA-Z]{8,16}$/,message:'请输入包含数字或字母的8-16位密码',trigger: 'blur'}
            ],
            driverIdcard:[
              { required: true, message: '请输入身份证号', trigger: 'blur' },
              {pattern:/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/ ,message:'请输入合法身份证号',trigger: 'blur'}
            ],
           driverProvince:[
              { required: true, message: '请输入省', trigger: 'change' },
            ],
            driverCity:[
              { required: true, message: '请输入市', trigger: 'change' },
            ],
            driverArea:[
              { required: true, message: '请输入区', trigger: 'change' },
            ],
          },
       rules1: {
            userCode: [
              { required: true, message: '请输入司机ID', trigger: 'change' },
          
            ],
       }
    }
  },
  methods:{
    handleSelectionChange(val) {
          this.multipleSelection = val;
    
    },
    handleSizeChange(val) {
        this.pageSize=val
        this.getDriverList()
    },
    handleCurrentChange(val) {
       this.currentPage=val
       this.getDriverList()
    },
    async getDriverList(){
      var list =[];
      var data={
        driverNo:this.searchForm.driverCode,
        driverName:this.searchForm.driverName,
        provinceNo:this.searchForm.driverProvince,
        countyNo:this.searchForm.driverCity,
        pageSize:this.pageSize,
        pageNum:this.currentPage,
      }
      const {data:res}=await this.$http.post("driver/selectdriver" ,qs.stringify(data))
     
      if(res.code!==200)
        return  this.$message({
            message: '司机信息列表获取失败',
            type: 'error',
            duration:800,
          });
      for(let x of res.rows){
        var driver= {
          id:x.id,
          driverCode:x.driverNo,
          driverName:x.driverName,
          driverPhone:x.driverPhone,
          driverIdcard:x.driverIdCard,
          driverNumber:x.userName,
          driverProvince:x.provinceName,
          driverCity:x.countyName,
          driverCityNo:x.countyNo,
          driverProvinceNo:x.provinceNo,
          userCode:x.userCode
        }
        list.push(driver)
      } 
      this.driverList=list;
      this.total=res.total
    },
    async getProvinceList(){
       var list=[];
      const {data:res}=await this.$http.post("storeinfo/selectprovince")
  
      for(let x of res.data){
        list.push({label:x.provinceName,value:x.provinceCode})
      }
      this.provinceList=list
    },
    async getCityList(val){
      var list=[];
      const {data:res}=await this.$http.post(`storeinfo/selectcounty?provinceCode=${val}`)
      
      for(let x of res.data){
        list.push({label:x.countyName,value:x.countyCode})
      }
      this.cityList=list
    },
    getAreaList(){
      
      var list=[
        {value:'1',label:"高新区"},
        {value:'2',label:"虎丘区"},
        {value:'3',label:"园区"},
      ]
        this.areaList=list
    },
    searchProvince(){
      this.searchForm.driverCity=''
      this.searchForm.driverArea=''
      this.getCityList(this.searchForm.driverProvince)
      if(this.searchForm.driverCity==''){
        this.areaList=[]
      }
    },
    searchCity(){
       this.searchForm.driverArea=''
       this.getAreaList()
    },
    addProvince(){
      this.addForm.driverCity=''
      this.addForm.driverArea=''
      this.getCityList(this.addForm.driverProvince)
      if(this.addForm.driverCity==''){
        this.areaList=[]
      }
    },
    addCity(){
       this.addForm.driverArea=''
       this.getAreaList()
    },
    editProvince(){
      this.editForm.driverCity=''
      this.editForm.driverArea=''
      this.getCityList(this.editForm.driverProvince)
      if(this.editForm.driverCity==''){
        this.areaList=[]
      }
    },
    editCity(){
       this.editForm.driverArea=''
       this.getAreaList()
    },
     toSearch(){
      var flag=0
      for(var k in this.searchForm){
        if(this.searchForm[k]!=''){
          flag=1
          break
        }
      }
      if(flag){
       
        this.getDriverList()
      }
    },
    setAll(){
      this.searchForm={
             driverCode:'',
            driverName:'',
            driverProvince:'',
            driverCity:'',
            driverArea:''
          }
      this.getDriverList()
      this.cityList=[]
      this.areaList=[]
    },
     toProvince(val){
      var flag=true
      if(flag){
        return val+'具体地点'
      }
      else {
        return '未知'
      }

    },
    async addDriver(){       
         if(this.$refs['addForm']){
            this.$refs['addForm'].resetFields()
         }
        this.cityList=[]
        this.areaList=[]
          var data={
          role:2,
        }
       const {data:res}=await this.$http.get("systemuser/selectuser",{params:data})
       this.drivers=res.rows
        this.dialogAddVisible=true       
    },
    submitaddFrom(){
         this.$refs['addForm'].validate(async (valid) => {
          if (valid) {    
              const {data:res}=await this.$http.post("driver/adddriver",{userCode:this.addForm.userCode})
              if(res.code!==200)
                return  this.$message({
                  message: '司机添加失败',
                  type: 'error',
                  duration:800,
                });
             
              this.dialogAddVisible=false
              this.getDriverList()
                this.$message({
                  message: '司机添加',
                  type: 'success',
                  duration:800,
                });
          } else {            
            return false;
          }
        });
    },
    editDriver(){
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
         
          this.cityList=[]
          this.areaList=[]       
          this.editForm=JSON.parse(JSON.stringify(this.multipleSelection[0]))
          this.editForm.driverProvince=this.editForm.driverProvinceNo
         this.editForm.driverCity=this.editForm.driverCityNo
          if(this.editForm.driverProvince!=''){
            this.getCityList(this.editForm.driverProvinceNo)
            if(this.editForm.driverCity!=''){
              this.getAreaList()
            }
          }
          this.dialogEditVisible=true
        }
    },
     submiteditFrom(){
         this.$refs['editForm'].validate(async (valid) => {
          if (valid) {
            var datas={
                driverName:this.editForm.driverName,
                driverPhone:this.editForm.driverPhone,
                driverIdCard:this.editForm.driverIdcard,
                provinceNo:this.editForm.driverProvince,
                countyNo:this.editForm.driverCity,
                userCode:this.editForm.userCode
            }
            console.log(datas)
            const {data:res}=await this.$http.post("driver/editdriver",datas)
            if(res.code!==200)
              return this.$message({
                  message: '修改司机失败',
                  type: 'error',
                  duration:800,
                });
            this.$message({
                  message: '修改司机成功',
                  type: 'success',
                  duration:800,
                });
            this.dialogEditVisible=false
            this.getDriverList()
          } else {            
            return false;
          }
        });
    },
    delDriver(){
        if(this.multipleSelection.length!=1){
           this.$message({
            showClose: true,
            message: '选择一条数据进行删除',
            type: 'warning'
          });
        }
        else {
          this.delWarnVisible=true
        }
    },
    async SureDel(){
      console.log(this.multipleSelection[0])
        const {data:res}=await this.$http.post("driver/deldriver",{ "userCode": this.multipleSelection[0].userCode})
        if(res.code!=200)
          return this.$message({
                message: '删除司机失败',
                type: 'error',
                duration:800,
              });
        this.delWarnVisible=false
        this.getDriverList()
       this.$message({
                message: '删除司机成功',
                type: 'success',
                duration:800,
              });
    },
    viewDetails(){
        if(this.multipleSelection.length!=1){
          this.$message({
            showClose: true,
            message: '请选择一条数据进行查看',
            type: 'warning'
          });
        }
        else {
            this.getDriverDetails(this.multipleSelection[0].id)
            this.detailVisible=true
        } 
    },
    getDriverDetails(val){
      this.driverdetailinfos=val+'详情信息'
    },
    async getDriverInfo(){
       var data={
         role:5,
          userId:this.addForm.userCode
        }
       const {data:res}=await this.$http.get("systemuser/selectuser",{params:data})
       this.addForm.driverName=res.rows[0].userRealname
       this.addForm.driverPhone=res.rows[0].phone
       this.addForm.driverNumber=res.rows[0].userName
       this.addForm.driverIdcard=res.rows[0].idCard
    }
  },
  mounted(){
    this.getProvinceList()
    this.getDriverList()
   
    this.loginRole=localStorage.getItem('role')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.pcdriver {
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
.search {
  width: 100%;
  height: 80px;
  background-color: #fff;
  padding:0 4%;
  line-height: 40px;
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
   width: 13%;
  outline: 0;
  height: 30px;
  border-radius: 5px;
  border:1px solid #cccccc;
  margin-left: 10px;
  margin-right: 30px;
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
  height: calc(100% - 90px);
  background: #fff;
}
.tables {
  width: 100%;
  margin-top: 10px;
  overflow: auto;
  height: 300px;
  height: calc(100% - 180px);
  background: pink;
}
.el-pagination {
  float: right;
  margin-top: 3%;
}
</style>
<style>
 .pcdriver .el-table th {
    background: #e0ebff;
    
}
 .pcdriver.el-form--inline,
 .pcdriver .el-form-item {
    width: 45%!important;
    margin-bottom: 40px;
}
.pcdriver .el-dialog .el-form-item__content{
  width: calc(100% - 120px);
}
.pcdriver .el-form-item__content .el-select,
.pcdriver .el-form-item__content .el-input{
  width: 100%;
}
.pcdriver .el-dialog {
  width: 45%;
  min-width: 576px;
}
</style>