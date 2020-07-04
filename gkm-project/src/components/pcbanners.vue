<template>
  <div class="pcbanners">
    <div class="contents">
      <div class="search">
            <span>状态</span><select v-model="searchForm.bannerStatus">
              <option value="3" >全部</option>
              <option value="0" >禁用</option>
              <option value="1">启用</option>
              
            </select>
            <button @click="toSearch()">查询</button>
            <button class="set" @click="setAll()">重置</button>
      </div>

      <div class="bigtables">
          <el-button type="primary" icon="el-icon-circle-plus" @click="addBanner()">添加</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="delBanner()">删除</el-button>
          <el-button type="primary" icon="el-icon-success" @click="onBanner()">启用</el-button>
          <el-button type="danger" icon="el-icon-error" @click="offBanner()">禁用</el-button>
          <div class="tables">
              <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 80%" height="100%" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55" fixed>
              </el-table-column>
             
              <el-table-column prop="bannerSort" label="排序" width="80">
              </el-table-column>
              
               <el-table-column prop="bannerSrc" label="图片路径" show-overflow-tooltip>
              </el-table-column>

              <el-table-column prop="bannerStatus" label="状态" width="80">
                <template slot-scope="scope">
                  {{scope.row.bannerStatus==0?"禁用":"启用"}}
                </template>
              </el-table-column>

              <el-table-column label="预览" width="80">
                <template slot-scope="scope">
                  
                  <img :src="scope.row.bannerSrc" alt="" style="width:50px;height:50px" @click="handleClick(scope.row)">
                </template>
              </el-table-column>

               <el-table-column prop="bannerStart" label="有效期起" width="150">
                  <template slot-scope="scope">
                  {{scope.row.bannerStart|getFormatDate}}
                </template>
              </el-table-column>

               <el-table-column prop="bannerEnd" label="有效期止" width="150">
                  <template slot-scope="scope">
                  {{scope.row.bannerEnd|getFormatDate}}
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[1, 2, 4]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
      </div>
    </div>
   
    <div class="imgdialog">
      <el-dialog
        title="预览"
        :visible.sync="imgVisible"
        width="20%"
        class="imgdialog"
        >
        <img :src="previewSrc" alt="" style="width:100%">
      </el-dialog>
    </div>
    
    <el-dialog title="添加轮播图" :visible.sync="dialogAddVisible">
      <el-form :model="addForm" :inline="true"  ref="addForm" :rules="rules">
        <el-form-item label="上传图片" label-width="120px" prop="bannerSrc" class="pics">
          <el-upload 
            action="/api/banner/upload"
            list-type="picture-card"
            :headers='headerObj'
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :before-upload="beforeUpload"
             :limit="1"
             :on-exceed="handleExceed"
             :on-success="handleAvatarSuccess"
              ref="my-upload">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <!-- <el-form-item label="排序" label-width="80px" prop="bannerSort">
          <el-input v-model="addForm.bannerSort"></el-input>
        </el-form-item> -->
        <el-form-item label="轮播时间" label-width="80px" prop="bannerTime">
         
           <el-date-picker
            v-model="addForm.bannerTime"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>         
      </el-form>  
       
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddVisible=false">取 消</el-button>
        <el-button type="primary" @click="submitaddFrom()">确 定</el-button>
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
    <div class="big">
      <el-dialog :visible.sync="bigImgVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: 'pcbanners',
  data () {
    return {
      headerObj:{
        Authorization:window.sessionStorage.getItem('xzsdtoken')
      },
      tempsrc:'',
      dialogImageUrl: '',
      bigImgVisible: false,   
      imgVisible:false,
      dialogAddVisible:false,
      delWarnVisible:false,
      tableData:[],
      multipleSelection: [],
      currentPage: 1,
      pageSize:4,
      total:0,
      bannerList:[],
      searchForm:{
        bannerStatus:3
      },
      addForm:{
        bannerSrc:'',
        bannerSort:'',
        bannerStart:'',
        bannerEnd:'',
        bannerStatus:'0',
        bannerTime:''
      },
      previewSrc:'',
      rules: {
            bannerSort: [
              { required: true, message: '请输入排序', trigger: 'blur' },
              {pattern: /^\S*$/,message:'不能输入空格等非法字符',trigger: 'blur'},
              {pattern: /^\d{1,2}$/,message:'请输入2位数以内的数字',trigger: 'blur'},
            ],
            bannerTime:[
              { required: true, message: '请输入轮播时间', trigger: 'change' },
            ],
            bannerSrc:[
              { required: true, message: '请上传图片', trigger: 'blur' },             
            ]     
          },
    }
  },
  methods:{
     clearImgs () {
        if(this.$refs['my-upload']){
             this.$refs['my-upload'].clearFiles();
        }
          
        },
     handleAvatarSuccess(res) {
       this.addForm.bannerSrc=res.url
      },
    handleExceed(files, fileList) {
      console.log(files)
      console.log(fileList)
        this.$message.warning("只能选择一张图片");
      },
    handleRemove() {
        this.addForm.bannerSrc=""
    },
    handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.bigImgVisible = true;
    },
    beforeUpload(file){
     var exName=file.name.split('.')[1]
     if(exName!=='jpg'&&exName!=='jpeg'&&exName!=='png'){
       this.$message({
          message: '文件格式错误',
          type: 'error',
          duration:800,
        });
      return false
     }
    },
    handleClick(row) {
        this.previewSrc=row.bannerSrc
        this.imgVisible=true
    },
    handleSelectionChange(val) {
          this.multipleSelection = val;
          
    },
    handleSizeChange(val) {
        this.pageSize=val
        this.getBannerList()
    },
    handleCurrentChange(val) {
        this.currentPage=val
        this.getBannerList()
    },
    async getBannerList(){
      var data={
        pageSize:this.pageSize,
        pageNum:this.currentPage,
        status:this.searchForm.bannerStatus
      }
      const {data:res}=await this.$http.get("banner/selectbanner",{params:data})
      var list=[]
     
      for(let x of res.rows){
          var banner={
            id:x.bannerCode,
            bannerSort:x.sortNo,
            bannerSrc:x.imageUrl,
            bannerStatus:x.status,
            bannerStart:x.startTime,
            bannerEnd:x.overTime
          }
        list.push(banner)
      }
      this.tableData=list
      this.total=res.total
    },
    toSearch(){
        if(this.searchForm.bannerStatus!=''){
           console.log(this.searchForm)
           this.getBannerList()
        }
    },
    setAll(){
        this.searchForm={
           bannerStatus:3
        }
        this.pageSize=4,
        this.currentPage=1
        this.getBannerList()
    },
    addBanner(){
      this.clearImgs()
       if(this.$refs['addForm']){
            this.$refs['addForm'].resetFields()
         }
        this.dialogAddVisible=true     
    },
    submitaddFrom(){
         this.$refs['addForm'].validate(async (valid) => {
          if (valid) {
            var data={          
                "imageUrl": this.addForm.bannerSrc,
                "overTime": this.addForm.bannerTime[1],
                "startTime": this.addForm.bannerTime[0],

            }
            
            const {data:res}=await this.$http.post("banner/addbanner",data)
            console.log(res)
            if(res.code!==200)
              return this.$message({
                      message: '添加轮播图失败',
                      type: 'error',
                      duration:800,
                    });
            this.$message({
              message: '添加轮播图成功',
              type: 'success',
              duration:800,
            });   
            this.dialogAddVisible=false
            this.getBannerList();    
          } else {            
            return false;
          }
        });
    },
    delBanner(){      
        if(this.multipleSelection.length!=1){
           this.$message({
            showClose: true,
            message: '至少选择一条数据进行删除',
            type: 'warning'
          });
        }
        else {
          this.delWarnVisible=true
        }
    },
    async SureDel(){
          const {data:res}=await this.$http.post("banner/delbanner",{bannerCode:this.multipleSelection[0].id})
         
          if(res.code!==200)
            return  this.$message({
                  message: '删除失败',
                  type: 'error',
                  duration:800,
                });
          this.getBannerList()
          this.delWarnVisible=false
           this.$message({
                  message: '删除成功',
                  type: 'success',
                  duration:800,
                });
    },
    async onBanner(){
       if(this.multipleSelection.length!=1){
           this.$message({
            showClose: true,
            message: '选择一条数据进行启用',
            type: 'warning'
          });
        }
        else {
          
          const {data:res}=await this.$http.post("banner/startbanner",{bannerCode:this.multipleSelection[0].id})
          
          if(res.code!==200)
            return  this.$message({
                  message: '启用失败',
                  type: 'error',
                  duration:800,
                });
          this.getBannerList()
           this.$message({
                  message: '启用成功',
                  type: 'success',
                  duration:800,
                });
        }
    },
   async offBanner(){
       if(this.multipleSelection.length!=1){
           this.$message({
            showClose: true,
            message: '选择一条数据进行禁用',
            type: 'warning'
          });
        }
        else {
          
          const {data:res}=await this.$http.post("banner/stopbanner",{bannerCode:this.multipleSelection[0].id})
         
          if(res.code!==200)
            return  this.$message({
                  message: '禁用失败',
                  type: 'error',
                  duration:800,
                });
          this.getBannerList()
           this.$message({
                  message: '禁用成功',
                  type: 'success',
                  duration:800,
                });
        }
    },
  },
  mounted(){
    this.getBannerList()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.pcbanners {
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

.search select {
  outline: 0;
  height: 30px;
  border-radius: 5px;
  border:1px solid #cccccc;
  margin-left: 10px;
  margin-right: 100px;
  vertical-align: middle;
  width: 100px;
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
.pics {
  width: 100%!important;  
}
</style>
<style >
  .pcbanners .el-table th {
    background: #e0ebff;
} 

.pcbanners .el-dialog {
  width: 30%;
  min-width: 384px;
}
.imgdialog .el-dialog {
  min-width: 256px;
}

.pcbanners .el-dialog .el-form-item {
  width: 100%;
  
}
.pcbanners .el-dialog .el-form-item__content
{
  width: calc(100% - 80px);
}
.el-range-editor.el-input__inner {
  width: 100%;
}

</style>
