<template>
  <div class="pcshop">
    <div class="contents">
       <div class="search">
            <span>门店编号</span><input type="text" v-model="searchForm.shopCode">
            <span>门店名称</span><input type="text" v-model="searchForm.shopName">
            <span>店长名称</span><input type="text" v-model="searchForm.managerName">
            <br>
            <span>所在省份</span><select @change="searchProvince()" v-model="searchForm.shopProvince">
              <option :value="x.value" v-for="x in provinceList" :key="x.value" v-text="x.label"></option>
            </select>
             
             <span>所在市/区</span><select @change="searchCity()" v-model="searchForm.shopCity" style="width:200px;">
            
              <option :value="x.value" v-for="x in cityList" :key="x.value" v-text="x.label"></option>

            </select> 
             <!-- <span>所在区域</span><select v-model="searchForm.shopArea">
              <option style="display:none"></option>
              <option :value="x.value" v-for="x in areaList" :key="x.value" v-text="x.label"></option>
            </select>  -->
            <button @click="toSearch()">查询</button>
            <button class="set" @click="setAll()">重置</button>
      </div>
      <div class="bigtables">
          <!-- <el-button type="primary" icon="el-icon-s-comment" @click="viewDetails()">详情</el-button> -->
          <el-button type="primary" icon="el-icon-circle-plus" @click="addShop()">新增</el-button>
          <el-button type="primary" icon="el-icon-edit"  @click="editShop()">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="delShop()">删除</el-button>
          <div class="tables">
            <el-table ref="multipleTable" :data="shopList" tooltip-effect="dark" style="width: 100%" height="100%" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55" fixed>
              </el-table-column>
             
              <el-table-column prop="shopCode" label="门店编号" width="200">
              </el-table-column>
              <el-table-column prop="shopName" label="门店名称" show-overflow-tooltip>
              </el-table-column>   
              <el-table-column prop="shopPhone" label="电话"  width="120">
              </el-table-column>
              <el-table-column prop="shopProvince" label="省" width="100">
                 <template slot-scope="scope">
                  {{scope.row.shopProvinceName}}
                </template>
              </el-table-column>
              
              <el-table-column prop="shopCity" label="市区"  show-overflow-tooltip>
                <template slot-scope="scope">
                  {{scope.row.shopCityName}}
                </template>
              </el-table-column>
              <!-- <el-table-column prop="shopArea" label="区" width="100" >
                 <template slot-scope="scope">
                  {{toProvince(scope.row.shopArea)}}
                </template>
              </el-table-column>       -->
              <el-table-column prop="shopAddress" label="详细地址"  show-overflow-tooltip>
              </el-table-column>             
              <el-table-column prop="managerName" label="店长姓名" width="80">
              </el-table-column>
              <el-table-column prop="inviteNumber" label="邀请码" width="100">
              </el-table-column>
               <el-table-column prop="shopNumber" label="门店账号" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="bussinessNum" label="营业执照编码" show-overflow-tooltip>
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

     <el-dialog title="新增店铺" :visible.sync="dialogAddVisible">
      <el-form :model="addForm" :inline="true" :rules="rules" ref="addForm">
        <el-form-item label="店铺名称" label-width="120px" prop="shopName">
          <el-input v-model="addForm.shopName"></el-input>
        </el-form-item>
        <el-form-item label="店长编号" label-width="120px" prop="userCode">
          <el-input v-model="addForm.userCode"></el-input>
        </el-form-item>
         
        <el-form-item label="所在省" label-width="120px" prop="shopProvince">
          <el-select  placeholder="请选择省" v-model="addForm.shopProvince" @change="addProvince()" >
            <el-option :label="x.label" :value="x.value" v-for="x in provinceList" :key="x.value" ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所在市" label-width="120px" prop="shopCity">
          <el-select  placeholder="请选择市" v-model="addForm.shopCity" @change="addCity()" >
          <el-option :label="x.label" :value="x.value" v-for="x in cityList" :key="x.value"></el-option>
          </el-select>
        </el-form-item>

      

         <el-form-item label="电话" label-width="120px" prop="shopPhone">
          <el-input v-model="addForm.shopPhone"></el-input>
        </el-form-item>
         <el-form-item label="详细地址" label-width="120px" prop="shopAddress">
          <el-input v-model="addForm.shopAddress"></el-input>
        </el-form-item>
     
        <el-form-item label="营业执照编码" label-width="120px" prop="bussinessNum">
          <el-input v-model="addForm.bussinessNum"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddVisible=false">取 消</el-button>
        <el-button type="primary" @click="submitaddFrom()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改店铺" :visible.sync="dialogEditVisible">
      <el-form :model="editForm" :inline="true" :rules="rules" ref="editForm">
        <el-form-item label="店铺名称" label-width="120px" prop="shopName">
          <el-input v-model="editForm.shopName"></el-input>
        </el-form-item>
        <el-form-item label="店长编码" label-width="120px" prop="managerName">
          <el-input v-model="editForm.userCode"></el-input>
        </el-form-item>
         
        <el-form-item label="所在省" label-width="120px" prop="shopProvince">
          <el-select  placeholder="请选择省" v-model="editForm.shopProvince" @change="editProvince()">
            <el-option :label="x.label" :value="x.value" v-for="x in provinceList" :key="x.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所在市" label-width="120px" prop="shopCity">
          <el-select  placeholder="请选择市" v-model="editForm.shopCity" @change="editCity()">
          <el-option :label="x.label" :value="x.value" v-for="x in cityList" :key="x.value"></el-option>
          </el-select>
        </el-form-item>

         <el-form-item label="电话" label-width="120px" prop="shopPhone">
          <el-input v-model="editForm.shopPhone"></el-input>
        </el-form-item>
         <el-form-item label="详细地址" label-width="120px" prop="shopAddress">
          <el-input v-model="editForm.shopAddress"></el-input>
        </el-form-item>
      
        <el-form-item label="营业执照编码" label-width="120px" prop="bussinessNum">
          <el-input v-model="editForm.bussinessNum"></el-input>
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
      title="门店详情"
      :visible.sync="detailVisible"
     
      >
      <span v-text="shopdetailinfos"></span>
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
  name: 'pcshop',
  data () {
    return {
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
      shopList:[],
      shopdetailinfos:'',
      searchForm:{
            shopCode:'',
            shopName:'',
            managerName:'',
            shopProvince:'',
            shopCity:'',
            shopArea:''
     },
    
     addForm:{
       shopName:'',
       managerName:'',
       shopProvince:'',
       shopCity:'',
       shopArea:'',
       shopPhone:'',
       shopAddress:'',
       bussinessNum:'',
       inviteNumber:'',
       userCode:''
     },
    editForm:{},
     rules: {
            shopName: [
              { required: true, message: '请输入店铺名称', trigger: 'blur' },
              {pattern: /^\S*$/,message:'不能输入空格等非法字符',trigger: 'blur'},
              { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
            ],
           userCode:[
              { required: true, message: '请输入店长编号', trigger: 'blur' },
              {pattern: /^\S*$/,message:'不能输入空格等非法字符',trigger: 'blur'},
              { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
            ],
            shopProvince:[
              { required: true, message: '请输入省', trigger: 'change' },
            ],
            shopCity:[
              { required: true, message: '请输入市', trigger: 'change' },
            ],
            shopArea:[
              { required: true, message: '请输入区', trigger: 'change' },
            ],
            shopPhone:[
              { required: true, message: '请输入手机号', trigger: 'blur' },
              {pattern:/^1[34578]\d{9}$/,message:'请输入合法手机号',trigger: 'blur'}
            ],
            shopAddress:[
              { required: true, message: '请输入详细地址', trigger: 'blur' },
              {pattern: /^\S*$/,message:'不能输入空格等非法字符',trigger: 'blur'},
              { min: 1, max: 40, message: '长度在 1 到 40 个字符', trigger: 'blur' }
            ],
           bussinessNum:[
              { required: true, message: '请输入营业执照编码', trigger: 'blur' },
              {pattern: /^\S*$/,message:'不能输入空格等非法字符',trigger: 'blur'},
              { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
            ],
            inviteNumber:[
              {pattern: /^\S*$/,message:'不能输入空格等非法字符',trigger: 'blur'},
              { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
            ]
          },
    }
    

  },
  methods:{
     handleSelectionChange(val) {
          this.multipleSelection = val;
          
      },
    handleSizeChange(val) {
        this.pageSize=val
        this.getShopList()
    },
    handleCurrentChange(val) {
        this.currentPage=val
       this.getShopList()
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
    async getShopList(){
      var data={
        storeNo:this.searchForm.shopCode,
        storeName:this.searchForm.shopName,
        userRealName:this.searchForm.managerName,
        provinceNo:this.searchForm.shopProvince,
        countyNo:this.searchForm.shopCity,
        pageSize:this.pageSize,
        pageNum:this.currentPage,
        userCode:this.userCode
      }            
     const {data:res}=await this.$http.post("storeinfo/selectstore",qs.stringify(data))
   
     if(res.code!==200){
       this.$message({
                message: '获取门店列表失败',
                type: 'error',
                duration:800,
              });
     }
     else{
       var list=[]
       for(let x of res.rows){
         var data={
           id:x.id,
           shopCode:x.storeNo,
           shopName:x.storeName,
           shopPhone:x.storePhone,
           shopAddress:x.storeAddress,
           managerName:x.userRealName,
           inviteNumber:x.inviteCode,
           shopNumber:x.userCode,
           bussinessNum:x.businessLicense,
           shopProvinceName:x.province,
           shopCityName:x.county,
           shopProvince:x.provinceNo,
           shopCity:x.countyNo,
           userCode:x.userCode,
         }
         list.push(data)
       }
       this.total=res.total
       this.shopList=list
     }
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
        
        this.getShopList()
      }
    },
    setAll(){
      this.searchForm={
            shopNumber:'',
            shopName:'',
            managerName:'',
            shopProvince:'',
            shopCity:'',
            shopArea:''
          }
      this.currentPage=1,
      this.pageSize=5,
      this.getShopList()
      this.cityList=[]
      this.areaList=[]

    },
    addShop(){       
         if(this.$refs['addForm']){
            this.$refs['addForm'].resetFields()
         }
        this.cityList=[]
        this.areaList=[]
        this.dialogAddVisible=true       
    },
    submitaddFrom(){
         this.$refs['addForm'].validate(async (valid) => {
          if (valid) {    
             const province=this.provinceList.find((item)=>{
              return item.value === this.addForm.shopProvince;
             }).label;
             const city=this.cityList.find((item)=>{
              return item.value === this.addForm.shopCity;
             }).label;
             var datas={
                "businessLicense": this.addForm.bussinessNum,
                "county": city,
                "countyNo": this.addForm.shopCity,
                "province": province,
                "provinceNo": this.addForm.shopProvince,
                "storeAddress": this.addForm.shopAddress,
                "storeName": this.addForm.shopName,
                "storePhone": this.addForm.shopPhone,
                "userCode": this.addForm.userCode,              
             }
             console.log(datas)
              const {data:res}=await this.$http.post("storeinfo/addstore",datas)
              if(res.code!==200)
                return  this.$message({
                  message: '添加门店失败',
                  type: 'error',
                  duration:800,
                });
              this.$message({
                  message: '添加门店成功',
                  type: 'success',
                  duration:800,
                });
              this.dialogAddVisible=false
              this.getShopList()                   
          } else {            
            return false;
          }
        });
    },
    editShop(){
      
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
          
          if(this.editForm.shopProvince!=''){
            this.getCityList(this.editForm.shopProvince)
            if(this.editForm.shopCity!=''){
              this.getAreaList()
            }
          }
          this.dialogEditVisible=true
        }
    },
    async submiteditFrom(){
         this.$refs['editForm'].validate(async (valid) => {
          if (valid) {
             const province=this.provinceList.find((item)=>{
              return item.value === this.multipleSelection[0].shopProvince;
             }).label;
             const city=this.cityList.find((item)=>{
              return item.value === this.multipleSelection[0].shopCity;
             }).label;
             var datas={
                "id":this.editForm.id,
                "businessLicense": this.editForm.bussinessNum,
                "county": city,
                "countyNo": this.editForm.shopCity,
                "province": province,
                "provinceNo": this.editForm.shopProvince,
                "storeAddress":this.editForm.shopAddress,
                "storeName":this.editForm.shopName,
                "storePhone":this.editForm.shopPhone,
                "userCode": this.editForm.userCode,              
             }
             const {data:res}=await this.$http.post("storeinfo/editstore",datas)         
            if(res.code!==200)
               return  this.$message({
                  message: '修改门店失败',
                  type: 'error',
                  duration:800,
                });
            this.$message({
                  message: '修改门店成功',
                  type: 'success',
                  duration:800,
                });
            this.dialogEditVisible=false
            this.getShopList()
          } else {            
            return false;
          }
        });
    },
    searchProvince(){
      
      this.searchForm.shopCity=''
      this.searchForm.shopArea=''
      this.getCityList(this.searchForm.shopProvince)
      if(this.searchForm.shopCity==''){
        this.areaList=[]
      }
    },
    searchCity(){
       this.searchForm.shopArea=''
       this.getAreaList()
    },
     addProvince(){
      this.addForm.shopCity=''
      this.addForm.shopArea=''
      
      this.getCityList(this.addForm.shopProvince)
      if(this.addForm.shopCity==''){
        this.areaList=[]
      }
    },
    addCity(){
       this.addForm.shopArea=''
       this.getAreaList()
    },
    editProvince(){
      this.editForm.shopCity=''
      this.editForm.shopArea=''
      this.getCityList(this.editForm.shopProvince)
      if(this.editForm.shopCity==''){
        this.areaList=[]
      }
    },
    editCity(){
       this.editForm.shopArea=''
       this.getAreaList()
    },
    delShop(){
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
      const {data:res}=await this.$http.delete("storeinfo/delstore",{data:{id:this.multipleSelection[0].id}})
      
      if(res.code!==200){
        this.$message({
          message: '删除门店失败',
          type: 'error',
          duration:800,
        });
      }
      else{
        this.$message({
          message: '删除门店成功',
          type: 'success',
          duration:800,
        });
        this.delWarnVisible=false
        this.getShopList()
      }
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
            this.getShopDetails(this.multipleSelection[0].id)
            this.detailVisible=true
        } 
  },
  getShopDetails(val){
    this.shopdetailinfos=val+'详情信息'
  },
    toProvince(val){
      var flag=true
      if(flag){
        return val+'具体地点'
      }
      else {
        return '未知'
      }

    }
  },
  created(){
    this.getShopList()
    this.getProvinceList()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.pcshop {
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
 .pcshop .el-table th {
    background: #e0ebff;
    
}
 .pcshop.el-form--inline,
 .pcshop .el-form-item {
    width: 45%!important;
    margin-bottom: 40px
}
.pcshop .el-dialog .el-form-item__content{
  width: calc(100% - 120px);
}
.pcshop .el-form-item__content .el-select,
.pcshop .el-form-item__content .el-input{
  width: 100%;
}
.pcshop .el-dialog {
  width: 45%;
  min-width: 576px;
}
</style>