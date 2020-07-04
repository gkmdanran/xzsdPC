<template>
  <div class="pchots">
    <div class="contents">
      <div class="search">
            
            <span>商品名称</span><input type="text" v-model="searchForm.goodsName">
            <span>商品编号</span><input type="text" v-model="searchForm.goodsCode">
            <button @click="toSearch()">查询</button>
            <button class="set" @click="setAll()">重置</button>
        </div>
        <div class="bigtables">
           <el-button type="primary" icon="el-icon-edit" @click="editHot()">修改</el-button>
           <el-button type="primary" icon="el-icon-circle-plus" @click="addHot()">添加</el-button>
           <el-button type="danger" icon="el-icon-delete" @click="delHot()">删除</el-button>
           <div class="tables">
              <el-table ref="multipleTable" :data="hotsList" tooltip-effect="dark" style="width: 100%" height="100%" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55" fixed>
              </el-table-column>
             
               <el-table-column prop="hotsSort" label="排序" width="80">
              </el-table-column>
              <el-table-column prop="goodsCode" label="商品编号" width="200">
              </el-table-column>
               <el-table-column prop="goodsName" label="商品名称" width="200">
              </el-table-column>
              <el-table-column prop="goodsSell" label="商品售价" width="150">
              </el-table-column>
              <el-table-column prop="goodsFix" label="商品定价" width="150">
              </el-table-column>
              <el-table-column prop="goodsIntroduce" label="商品介绍" show-overflow-tooltip>
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
    <div class="add">
      <el-dialog title="添加商品分类" :visible.sync="dialogAddVisible">
        <el-form :model="addForm" :inline="true"  ref="addForm" :rules="rules">
          <el-form-item label="商品名称" label-width="100px" prop="hotgood">
            <el-input v-model="addForm.hotgood" readonly></el-input><el-button type="primary" @click="chooseHot()">选择</el-button>
          </el-form-item>
          <el-form-item label="热门位排序" label-width="100px" prop="hotsSort">
            <el-input v-model="addForm.hotsSort"></el-input>
          </el-form-item>
        </el-form>  
        
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogAddVisible=false">取 消</el-button>
          <el-button type="primary" @click="submitaddFrom()">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <div class="add">
      <el-dialog title="修改商品分类" :visible.sync="dialogEditVisible">
        <el-form :model="editForm" :inline="true"  ref="editForm" :rules="rules">
          <el-form-item label="商品名称" label-width="100px" prop="goodsCode">
            <el-input v-model="editForm.goodsCode" readonly></el-input><el-button type="primary" @click="chooseHot()" disabled>选择</el-button>
          </el-form-item>
          <el-form-item label="热门位排序" label-width="100px" prop="hotsSort">
            <el-input v-model="editForm.hotsSort"></el-input>
          </el-form-item>
        </el-form>  
        
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogEditVisible=false">取 消</el-button>
          <el-button type="primary" @click="submiteditFrom()">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <div class="select">
        
      <el-dialog
        title="热门位商品选择"
        :visible.sync="selectVisible">
        <div class="search">
            
            <span>商品名称</span><input type="text" v-model="selectSearchForm.goodsName">
            <span>商品编号</span><input type="text" v-model="selectSearchForm.goodsCode">
            <button @click="selectSearch()">查询</button>
            <button class="set" @click="setSelect()">重置</button>
        </div>
        <el-table  :data="goodsList" tooltip-effect="dark" style="width: 100%;" height="100%" ref="selectGoods" @selection-change="goodsSelectionChange">  
          <el-table-column type="selection" width="55" fixed>
          </el-table-column>
              
          <el-table-column prop="goodsCode" label="商品编码" width="150">
          </el-table-column> 
          <el-table-column prop="goodsName" label="商品名称" width="120">
          </el-table-column>
          <el-table-column prop="goodsStatus" label="商品状态" width="120">
            <template slot-scope="scope">
                  {{scope.row.goodsStatus==1?"在售":scope.row.goodsStatus==0?"已下架":"未发布"}}
            </template>
          </el-table-column>
          <el-table-column prop="goodsFirst" label="一级分类" width="120">
              <template slot-scope="scope">
                  {{toKind(scope.row.goodsFirst)}}
              </template>
          </el-table-column>
          <el-table-column prop="goodsSecond" label="二级分类" width="150">
              <template slot-scope="scope">
                  {{toKind(scope.row.goodsSecond)}}
              </template>
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button @click="selectVisible = false">取消</el-button>
          <el-button type="primary" @click="chooseGoods()">提交</el-button>
        </span>
      </el-dialog>
    </div>
    <div class="tishi">
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
    </div>
  </div>
</template>

<script>
import qs from 'Qs'
export default {
  
  name: 'pchots',
  data () {
    return {
      dialogAddVisible:false,
      dialogEditVisible:false,
      delWarnVisible:false,
      selectVisible:false,
      hotsList:[],
      goodsList:[],
      total:0,
      multipleSelection: [],
      selectGoods:[],
      currentPage: 1,
      pageSize:5,
      searchForm:{
        goodsName:'',
        goodsCode:'',
      },
      selectSearchForm:{
        goodsName:'',
        goodsCode:'',
      },
      addForm:{
        hotgood:'',
        hotsSort:''
      },
      editForm:{},
      rules: {
           hotgood: [
              { required: true, message: '请选择商品', trigger: 'change' },
            ],
            hotsSort:[
              { required: true, message: '请输入排序', trigger: 'blur' },
              {pattern: /^\S*$/,message:'不能输入空格等非法字符',trigger: 'blur'},
              {pattern: /^\d{1,2}$/,message:'请输入2位数以内的数字',trigger: 'blur'},
            ]
        
          },
    }
  },
  methods:{
     goodsSelectionChange(val) {
          this.selectGoods = val;
          
      },
     handleSelectionChange(val) {
          this.multipleSelection = val;
         
    },
    handleSizeChange(val) {
        this.pageSize=val
        this.getHotsList()
    },
    handleCurrentChange(val) {
        this.currentPage=val
       this.getHotsList()
    },
    async getHotsList(){
        var data={
          pageSize:this.pageSize,
          pageNum:this.currentPage,
          skuName:this.searchForm.goodsName,
          skuNo:this.searchForm.goodsCode
      }
      const {data:res}=await this.$http.post("hot/selecthot",qs.stringify(data))
      console.log(res)
      var list=[]
     
      
      for(let x of res.rows){
        var hot= {
          id:x.id,
          hotsSort:x.sortNo,
          goodsCode:x.skuNo,
          goodsName:x.skuName,
          goodsSell:x.sellingPrice,
          goodsIntroduce:x.detail,
          goodsFix:x.fixPrice,
          goodsImgs:x.imageUrl
        }
        list.push(hot)
      }
      this.hotsList=list
      this.total=res.total
      
        
    
    },
    async getGoodsList(){
      var list=[]
      var search={
        skuNo:this.selectSearchForm.goodsCode,
        skuName:this.selectSearchForm.goodsName
      }
      const {data:res}=await this.$http.get("goods/selectall",{params:search
      })
      for (let x of res.data){
        var goods= {
          id:x.id,
          goodsName:x.skuName,
          goodsFix:x.fixPrice,
          goodsSell:x.sellingPrice,
          goodsSellNum:x.saleCnt,
          goodsFirst:x.cateOneName,
          goodsSecond:x.cateTwoName,
          goodsAdv:x.advertising,
          goodsIntroduce:x.detail,
          goodsStatus:x.status,
          goodsTime:x.putawayTime,
          goodsViewNum:x.browseCount,
          sellerCode:x.outsideNo,
          sellerName:x.storeName,
          goodsStock:x.amountCnt,
          goodsIsbn:x.isbn,
          goodsImgs:x.surPicUrl,
          goodsWriter:x.author,
          goodsCode:x.skuNo
        }
        list.push(goods)
      }
      this.goodsList=list
       
        

    },
    toSearch(){   
        if(this.searchForm.goodsName!=''||this.searchForm.goodsCode!=''){
           console.log(this.searchForm)
           this.getHotsList()
        }
    },
    setAll(){
       this.searchForm={
              goodsName:'',
              goodsCode:'',
          }
          this.currentPage=1
          this.pageSize=5
          this.getHotsList()
    },
    addHot(){      
       if(this.$refs['addForm']){
          this.$refs['addForm'].resetFields()
       }
       this.dialogAddVisible=true       
    },
    toKind(val){
      var flag=true
      if(flag){
        return val+'名称'
      }
      else {
        return '未知'
      }

    },
    chooseHot(){
      this.getGoodsList()
      this.selectSearchForm={
         goodsName:'',
        goodsCode:'',
      }
      this.selectVisible=true
    },
    chooseGoods(){
      if(this.selectGoods.length!=1){
         this.$message({
            showClose: true,
            message: '请选择一条商品进行提交',
            type: 'warning'
          });
      }
      else{      
          this.addForm.hotgood=this.selectGoods[0].goodsCode      
          this.editForm.goodsCode=this.selectGoods[0].goodsCode    
        this.selectVisible=false
      }
    },
    submitaddFrom(){
         this.$refs['addForm'].validate(async (valid) => {
          if (valid) {   
              var data={
                "detail": this.selectGoods[0].goodsIntroduce,
                "fixPrice": this.selectGoods[0].goodsFix,
                "imageUrl": this.selectGoods[0].goodsImgs,
                "sellingPrice": this.selectGoods[0].goodsSell,
                "skuName": this.selectGoods[0].goodsName,
                "skuNo":this.selectGoods[0].goodsCode,
                "sortNo":this.addForm.hotsSort
              }
              const {data:res}=await this.$http.post("hot/inserthot",data)
              if(res.code!==200)
                return  this.$message({
                    message: '添加热门商品失败',
                    type: 'error',
                    duration:800,
                  });
             
              this.dialogAddVisible=false
              this.getHotsList()
                this.$message({
                message: '添加热门商品成功',
                type: 'success',
                duration:800,
              });
                    
          } else {            
            return false;
          }
        });
    },
    delHot(){
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
        const {data:res}=await this.$http.post("hot/delhot?id="+this.multipleSelection[0].id)
        if(res.code!==200)
          return this.$message({
                message: '删除热门商品失败',
                type: 'error',
                duration:800,
              });
        this.delWarnVisible=false
        this.getHotsList()
         this.$message({
                message: '删除热门商品成功',
                type: 'success',
                duration:800,
              });
    },
    selectSearch(){
      if(this.selectSearchForm.goodsName!=''||this.selectSearchForm.goodsCode!=''){
           console.log(this.selectSearchForm)
           this.getGoodsList()
        }
    },
    setSelect(){
       this.selectSearchForm={
              goodsName:'',
              goodsCode:'',
          }
          this.getGoodsList()
    },
    editHot(){
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
          this.dialogEditVisible=true
        }
    },
    submiteditFrom(){
         this.$refs['editForm'].validate(async (valid) => {
          if (valid) {
            console.log(this.editForm)
            var data={             
              "id": this.editForm.id,
              "sortNo": this.editForm.hotsSort
            }
            const {data:res}=await this.$http.post("hot/edithot",data)
            if(res.code!==200)
               return  this.$message({
                    message: '修改热门商品失败',
                    type: 'error',
                    duration:800,
                  });
            this.dialogEditVisible=false
            this.getHotsList()
            this.$message({
                    message: '修改热门商品成功',
                    type: 'success',
                    duration:800,
                  });
          } else {            
            return false;
          }
        });
    },
    
  },
  mounted(){
    this.getHotsList()
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.pchots {
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
  margin-right: 5%;
}
.select input {
  width: 20%;
  margin-right: 5px;
}
.select .el-table {
 height: 300px!important;
}
</style>
<style >
  .pchots .el-table th {
  background: #e0ebff;
}

.pchots .el-form-item__content{
  width: calc(100% - 100px);
}
.pchots .el-form-item__content .el-select,
.pchots .el-form-item__content .el-input{
  width: 150px;
  margin-right: 10px;
}
.pchots .add .el-dialog {
  width: 30%;
  min-width: 384px;
}
.pchots .select .el-dialog {
  width: 50%;
  min-width: 640px;
}
.pchots .tishi .el-dialog {
  width: 45%;
  min-width: 576px;
}
</style>
