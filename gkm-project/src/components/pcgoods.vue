<template>
  <div class="pcgoods">
    <div class="contents">
      <div class="search">
            
            <span>商品名称</span><input type="text" v-model="searchForm.goodsName">
             <span>商品状态</span><select v-model="searchForm.goodsStatus">
               <option value="3">全部</option>
              <option value="0">下架</option>
              <option value="1">在售</option>
              
            </select>
            <span>广告词</span><input type="text" v-model="searchForm.goodsAdv">
            <br>
            <span> 出版社</span><input type="text" v-model="searchForm.sellerName">
            <span>作者</span><input type="text" v-model="searchForm.goodsWriter">
            <button @click="toSearch()">查询</button>
            <button class="set" @click="setAll()">重置</button>
      </div>
      <div class="bigtables">
          
          <el-button type="primary" icon="el-icon-circle-plus" @click="addGoods()">新增</el-button>
          <el-button type="primary" icon="el-icon-edit"  @click="editGoods()">修改</el-button>
          <el-button type="danger" icon="el-icon-delete"   @click="delGoods()">删除</el-button>
          <el-button type="primary" icon="el-icon-upload2"  @click="upGoods()">上架</el-button>
          <el-button type="danger" icon="el-icon-download" @click="downGoods()">下架</el-button>
          <div class="tables">
            <el-table ref="multipleTable" :data="goodsList" tooltip-effect="dark" style="width: 100%" height="100%" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55" fixed>
              </el-table-column>
             
              <el-table-column prop="goodsName" label="商品名称"   width="250">
              </el-table-column>
              
              <el-table-column prop="goodsFix" label="定价" width="80">
              </el-table-column>  
              <el-table-column prop="goodsWriter" label="作者" width="80">
              </el-table-column>   
              <el-table-column prop="goodsSell" label="售价" width="80">
              </el-table-column> 
              <el-table-column prop="goodsSellNum" label="销售量" width="80">
              </el-table-column>
              <el-table-column prop="goodsFirst" label="一级分类" width="100">
                 <template slot-scope="scope">
                  {{scope.row.goodsFirst}}
                </template>
              </el-table-column>
              <el-table-column prop="goodsSecond" label="二级分类" width="100">
                 <template slot-scope="scope">
                  {{scope.row.goodsSecond}}
                </template>
              </el-table-column>
              <el-table-column prop="goodsAdv" label="广告词"  show-overflow-tooltip>
              </el-table-column> 
              <el-table-column prop="goodsIntroduce" label="商品介绍"  show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="goodsStatus" label="商品状态" width="80">
                 <template slot-scope="scope">
                  {{scope.row.goodsStatus==1?"在售":"下架"}}
                </template>
              </el-table-column>
              <el-table-column prop="goodsTime" label="上架时间" width="150">
                <template slot-scope="scope">
                  {{scope.row.goodsTime|getFormatDate}}
                </template>
              </el-table-column>
              <el-table-column prop="goodsViewNum" label="浏览量" width="100">
              </el-table-column>
              <el-table-column prop="sellerCode" label="商家编码" width="200">
              </el-table-column>
              <el-table-column prop="sellerName" label="商家名称" width="120">
              </el-table-column>
              <el-table-column prop="goodsPress" label="出版社" width="120">
              </el-table-column>
              <el-table-column prop="goodsStock" label="库存" width="80">
              </el-table-column>
              <el-table-column prop="goodsIsbn" label="isbn书号" width="200">
              </el-table-column>
            </el-table>
          </div>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[1,3,5]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
      </div>
      
    </div>
      
    <div class="add">
     <el-dialog title="新增商品" :visible.sync="dialogAddVisible" >
      <el-form :model="addForm" :inline="true" :rules="rules" ref="addForm">
        <el-form-item label="商品名称" label-width="120px" prop="goodsName">
          <el-input v-model="addForm.goodsName"></el-input>
        </el-form-item>
        <el-form-item label="ISBN书号" label-width="120px" prop="goodsIsbn">
          <el-input v-model="addForm.goodsIsbn"></el-input>
        </el-form-item>
        <el-form-item label="定价" label-width="120px" prop="goodsFix">
          <el-input v-model="addForm.goodsFix"></el-input>
        </el-form-item>
        <el-form-item label="销售价" label-width="120px" prop="goodsSell">
          <el-input v-model="addForm.goodsSell"></el-input>
        </el-form-item>
        <el-form-item label="一级分类" label-width="120px" prop="goodsFirst">
          <el-select  placeholder="请选择一级分类" v-model="addForm.goodsFirst" @change="addFirst()">
            <el-option :label="x.label" :value="x.value" v-for="x in firstList" :key="x.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类" label-width="120px" prop="goodsSecond">
          <el-select  placeholder="请选择二级分类" v-model="addForm.goodsSecond" >
            <el-option :label="x.label" :value="x.value" v-for="x in secondList" :key="x.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="广告词" label-width="120px" prop="goodsAdv" >
            <el-input v-model="addForm.goodsAdv"  type="textarea" :rows="4" resize=none></el-input>
        </el-form-item>
        <el-form-item label="介绍" label-width="120px" prop="goodsIntroduce">
            <el-input v-model="addForm.goodsIntroduce" type="textarea" :rows="4" resize=none></el-input>
        </el-form-item>
         <el-form-item label="作者" label-width="120px" prop="goodsWriter">
          <el-input v-model="addForm.goodsWriter"></el-input>
        </el-form-item>
        <el-form-item label="出版社" label-width="120px" prop="goodsPress">
          <el-input v-model="addForm.goodsPress"></el-input>
        </el-form-item>
        <el-form-item label="商家编码" label-width="120px" prop="sellerCode">
          <el-input v-model="addForm.sellerCode"></el-input>
        </el-form-item>
        <el-form-item label="数量" label-width="120px" prop="goodsStock">
          <el-input v-model="addForm.goodsStock"></el-input>
        </el-form-item>
        <br>
        <el-form-item label="上传图片" label-width="120px" prop="goodsImgs" class="pics">
          <el-upload 
            action="/api/banner/upload"
            :headers='headerObj'
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :before-upload="beforeUpload"
             :limit="4"
             :on-exceed="handleExceed"
             :on-success="handleAvatarSuccess" ref="my-upload">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
         
      </el-form>  
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddVisible=false">取 消</el-button>
        <el-button type="primary" @click="submitaddFrom()">确 定</el-button>
      </div>
    </el-dialog>
    </div>
    <div class="add">
     <el-dialog title="修改商品" :visible.sync="dialogEditVisible">
      <el-form :model="editForm" :inline="true" :rules="rules" ref="editForm">
        <el-form-item label="商品名称" label-width="120px" prop="goodsName">
          <el-input v-model="editForm.goodsName"></el-input>
        </el-form-item>
        <el-form-item label="ISBN书号" label-width="120px" prop="goodsIsbn">
          <el-input v-model="editForm.goodsIsbn"></el-input>
        </el-form-item>
        <el-form-item label="定价" label-width="120px" prop="goodsFix">
          <el-input v-model="editForm.goodsFix"></el-input>
        </el-form-item>
        <el-form-item label="销售价" label-width="120px" prop="goodsSell">
          <el-input v-model="editForm.goodsSell"></el-input>
        </el-form-item>
        <el-form-item label="一级分类" label-width="120px" prop="goodsFirst">
          <el-select  placeholder="请选择一级分类" v-model="editForm.goodsFirst" @change="editFirst()">
            <el-option :label="x.label" :value="x.value" v-for="x in firstList" :key="x.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类" label-width="120px" prop="goodsSecond">
          <el-select  placeholder="请选择二级分类" v-model="editForm.goodsSecond" >
            <el-option :label="x.label" :value="x.value" v-for="x in secondList" :key="x.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="广告词" label-width="120px" prop="goodsAdv" >
            <el-input v-model="editForm.goodsAdv"  type="textarea" :rows="4" resize=none></el-input>
        </el-form-item>
        <el-form-item label="介绍" label-width="120px" prop="goodsIntroduce">
            <el-input v-model="editForm.goodsIntroduce" type="textarea" :rows="4" resize=none></el-input>
        </el-form-item>
         <el-form-item label="作者" label-width="120px" prop="goodsWriter">
          <el-input v-model="editForm.goodsWriter"></el-input>
        </el-form-item>
        <el-form-item label="出版社" label-width="120px" prop="goodsPress">
          <el-input v-model="editForm.goodsPress"></el-input>
        </el-form-item>
        <el-form-item label="商家编码" label-width="120px" prop="sellerCode">
          <el-input v-model="editForm.sellerCode"></el-input>
        </el-form-item>
        <el-form-item label="数量" label-width="120px" prop="goodsStock">
          <el-input v-model="editForm.goodsStock"></el-input>
        </el-form-item>
        <el-form-item label="上传图片" label-width="120px" prop="goodsImgs" class="pics">
          <el-upload 
            action="/api/banner/upload"
            list-type="picture-card"
            :headers='headerObj'
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemoveEdit"
            :limit="4"
            :file-list="imgsList"
            :on-exceed="handleExceed"
            :before-upload="beforeUpload"
            :on-success="handleAvatarSuccessEdit" ref="my-upload">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
      </el-form>  
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditVisible=false">取 消</el-button>
        <el-button type="primary" @click="submiteditFrom()">确 定</el-button>
      </div>
    </el-dialog>
    </div>
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
    
    <div class="big">
      <el-dialog :visible.sync="ImgVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </div>
  </div>
</template>

<script>
import qs from 'Qs'
export default {
  name: 'pcgoods',
  data () {
    return {
      headerObj:{
        Authorization:window.sessionStorage.getItem('xzsdtoken')
      },
      dialogImageUrl: '',
      ImgVisible: false,
      dialogAddVisible:false,
      dialogEditVisible:false,
      delWarnVisible:false,
      goodsList:[],
      firstList:[],
      secondList:[],
      imgsList:[],
      multipleSelection: [],
       currentPage: 1,
       pageSize:5,
       total:0,
      searchForm:{
        goodsName:'',
        goodsStatus:'3',
        goodsAdv:'',
        sellerName:'',   
        goodsWriter:''
      },
      addForm:{
        goodsName:'',
        goodsIsbn:'',
        goodsFix:'',
        goodsSell:'',
        goodsWriter:'',
        goodsFirst:'',
        goodsSecond:'',
        goodsAdv:'',
        goodsIntroduce:'',
        goodsImgs:[],
        goodsPress:'',
        sellerCode:'',
        goodsStock:1
      },
      editForm:{},
      rules: {
            goodsName: [
              { required: true, message: '请输入商品名称', trigger: 'blur' },
              {pattern: /^\S*$/,message:'不能输入空格等非法字符',trigger: 'blur'},
              { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
            ],   
            goodsIsbn: [
              { required: true, message: '请输入书号', trigger: 'blur' },
              {pattern:/^[0-9a-zA-Z]{1,20}$/,message:'不合法书号',trigger: 'blur'}
            ], 
            // goodsFix: [
            //   { required: true, message: '请输入定价', trigger: 'blur' },
            //   {pattern: /^\d{1,5}$/,message:'请输入5位数以内的数字',trigger: 'blur'},
            // ], 
             goodsStock: [
              { required: true, message: '请输入数量', trigger: 'blur' },
              {pattern: /^\d{1,5}$/,message:'请输入5位数以内的数字',trigger: 'blur'},
            ],  
            // goodsSell: [
            //   { required: true, message: '请输入售价', trigger: 'blur' },
            //   {pattern: /^\d{1,5}$/,message:'请输入5位数以内的数字',trigger: 'blur'},
            // ], 
            goodsFirst:[
               { required: true, message: '请输一级分类', trigger: 'change' },
            ],
            goodsSecond:[
               { required: true, message: '请输二级分类', trigger: 'change' },
            ],
            goodsAdv:[
              { required: true, message: '请输入广告词', trigger: 'blur' },
              {pattern: /^\S*$/,message:'不能输入空格等非法字符',trigger: 'blur'},
              { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
            ],
            goodsIntroduce:[
              { required: true, message: '请输入介绍', trigger: 'blur' },
              {pattern: /^\S*$/,message:'不能输入空格等非法字符',trigger: 'blur'},
              { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
            ],
            goodsWriter:[
              { required: true, message: '请输入作者', trigger: 'blur' },
              {pattern: /^\S*$/,message:'不能输入空格等非法字符',trigger: 'blur'},
              { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
            ],
            outsideNo:[ 
              { required: true, message: '请输入商家编码', trigger: 'blur' },
              {pattern: /^\S*$/,message:'不能输入空格等非法字符',trigger: 'blur'},
              { min: 1, max: 25, message: '长度在 1 到 25个字符', trigger: 'blur' }
            ],
            goodsPress:[
              { required: true, message: '请输入出版社', trigger: 'blur' },
              {pattern: /^\S*$/,message:'不能输入空格等非法字符',trigger: 'blur'},
              { min: 1, max: 10, message: '长度在 1 到 20 个字符', trigger: 'blur' }
            ],
             goodsImgs:[
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
     handleAvatarSuccess(res, file) {
      
       this.imgsList.push(res.url)
      //  console.log(this.imgsList)
      },
    handleAvatarSuccessEdit(res, file) {
     
       this.imgsList.push({name:file.name,url:res.url})
      // console.log(this.imgsList)
      },
    handleExceed(files, fileList) {
        this.$message.warning("最多选择四张图片");
      },
    handleRemove(file, fileList) {
      if (file && file.status==="success"){
      var i=this.imgsList.findIndex(item=>{
        return item==file.response.url
      })
      this.imgsList.splice(i,1)
      // console.log(i)
      // console.log(this.imgsList)
      }
    },
    handleRemoveEdit(file){
      if (file && file.status==="success"){
      var i=this.imgsList.findIndex(item=>{
        return item.url==file.url
      })
      this.imgsList.splice(i,1)
      }
    },
    handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.ImgVisible = true;
    },
    handleSelectionChange(val) {
          this.multipleSelection = val;
          
    },
    handleSizeChange(val) {
        this.pageSize=val
        this.getGoodsList()
    },
    handleCurrentChange(val) {
       this.currentPage=val
       this.getGoodsList()
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
    beforeUploadAdd(file){
      console.log(file.name)
    },
    async getGoodsList(){
      var list=[]
      var data={
        skuName:this.searchForm.goodsName,
        status:this.searchForm.goodsStatus,
        author:this.searchForm.goodsWriter,
        advertising:this.searchForm.goodsAdv,
        press:this.searchForm.sellerName,
        pageSize:this.pageSize,
        pageNum:this.currentPage
      }
     
        const {data:res}=await this.$http.get("goods/selectgoods",{params:data})
        console.log(res)
        for(let x of res.rows){
          var good={
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
              goodsPress:x.press,
              code:x.cateCode
          }
          list.push(good)
        }
        this.goodsList=list
        this.total=res.total  
       
      
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
        this.getGoodsList()
      }
    },
    setAll(){
      this.searchForm={
            goodsName:'',
            goodsStatus:'',
            goodsAdv:'',
            goodsPress:'',   //出版社
            goodsWriter:''
          }
      this.pageSize=5
      this.currentPage=1
      this.getGoodsList()
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
    addGoods(){    
        this.imgsList=[]
         if(this.$refs['addForm']){
            this.$refs['addForm'].resetFields()
         }
        this.secondList=[]     
        this.clearImgs()
        this.getFirstList()
        this.dialogAddVisible=true       
    },
    async submitaddFrom(){
      this.addForm.goodsImgs=this.imgsList
         this.$refs['addForm'].validate(async (valid) => {
          if (valid) {    
              var data={
                "advertising": this.addForm.goodsAdv,
                "author": this.addForm.goodsWriter,
                "cateCode": this.addForm.goodsSecond,
                "detail": this.addForm.goodsIntroduce,
                "fixPrice": this.addForm.goodsFix,
                "isbn": this.addForm.goodsIsbn,
                "outsideNo":this.addForm.sellerCode,
                "press": this.addForm.goodsPress,
                "sellingPrice": this.addForm.goodsSell,
                "skuName": this.addForm.goodsName,
                "surPicUrl": this.addForm.goodsImgs.join(" "),
                "amountCnt": this.addForm.goodsStock,
              }
            const {data:res}=await this.$http.post("goods/insertgood",data)
            console.log(res)
            if(res.code!==200)
              return this.$message({
                    message: '添加商品失败',
                    type: 'error',
                    duration:800,
                  });
             this.$message({
                    message: '添加商品成功',
                    type: 'success',
                    duration:800,
                  });  
            this.dialogAddVisible=false
            this.getGoodsList()    
          } else {            
            return false;
          }
        });
    },
    async getFirstList(){
     const {data:res}=await this.$http.get("cate/getfirst")
    
     var list=[]
     for(let x of res.data){
       var data={
         label:x.cateName,
         value:x.cateCode
       }
       list.push(data)
     }
     this.firstList=list
    },
    async getSecondList(val){
      const {data:res}=await this.$http.get("cate/getsecond?cateCodeParent="+val)
     var list=[]
     for(let x of res.data){
       var data={
         label:x.cateName,
         value:x.cateCode
       }
       list.push(data)
     }
     this.secondList=list
    },
    addFirst(){
      this.addForm.goodsSecond=''
      this.getSecondList(this.addForm.goodsFirst)
    },
    editFirst(){
      this.editForm.goodsSecond=''
      this.getSecondList(this.editForm.goodsFirst)
    },
    editGoods(){
      
      if(this.multipleSelection.length!=1){
          this.$message({
            showClose: true,
            message: '请选择一条数据进行修改',
            type: 'warning'
          });
        }
        else {
          
           this.imgsList=[]
           if(this.$refs['editForm']){
            this.$refs['editForm'].resetFields()
         }  
          this.secondList=[] 
          this.clearImgs()        
          this.editForm=JSON.parse(JSON.stringify(this.multipleSelection[0]))
          this.editForm.goodsSecond=this.editForm.code
          this.imgsList=this.editForm.goodsImgs.split(' ')
          var list=[]    
          this.imgsList.forEach((item,i)=>{
            list.push({name:i,url:item})
          })   
          this.imgsList=list
          this.getFirstList()
          const code=this.firstList.find((item)=>{
              return item.label === this.editForm.goodsFirst;
             }).value;
             this.editForm.goodsFirst=code
          if(this.editForm.goodsFirst!=''){
            this.getSecondList(this.editForm.goodsFirst)

          }
          this.dialogEditVisible=true
          
        }
    },
    submiteditFrom(){
          this.editForm.goodsImgs=this.imgsList
          var pics=[]
          for(let x of this.editForm.goodsImgs){
            pics.push(x.url)
          }
          
          
         this.$refs['editForm'].validate(async (valid) => {
          if (valid) {
             var data={
                "advertising": this.editForm.goodsAdv,
                "author": this.editForm.goodsWriter,
                "cateCode": this.editForm.goodsSecond,
                "detail": this.editForm.goodsIntroduce,
                "fixPrice": this.editForm.goodsFix,
                "isbn": this.editForm.goodsIsbn,
                "outsideNo":this.editForm.sellerCode,
                "press": this.editForm.goodsPress,
                "sellingPrice": this.editForm.goodsSell,
                "skuName": this.editForm.goodsName,
                "surPicUrl": pics.join(" "),
                "amountCnt": this.editForm.goodsStock,
                "id":this.editForm.id
              }
              console.log(data)
            const {data:res}=await this.$http.post("goods/editgood",data)
            if(res.code!==200)
              return  this.$message({
                message: '修改商品失败',
                type: 'error',
                duration:800,
              });
            this.$message({
              message: '修改商品成功',
              type: 'success',
              duration:800,
            });
            this.dialogEditVisible=false
            this.getGoodsList()
          } else {            
            return false;
          }
        });
    },
    delGoods(){
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
        const {data:res}=await this.$http.post("goods/delgoods?id="+this.multipleSelection[0].id)
        
        if(res.code!==200)
           return  this.$message({
            message: '删除商品失败',
            type: 'error',
            duration:800,
          });
        this.delWarnVisible=false
        this.getGoodsList()
        this.$message({
            message: '删除商品成功',
            type: 'success',
            duration:800,
          });
    },
    async upGoods(){
      if(this.multipleSelection.length!=1){
           this.$message({
            showClose: true,
            message: '选择一条商品进行上架',
            type: 'warning'
          });
        }
        else {
        const {data:res}=await this.$http.post("goods/upgoods?id="+this.multipleSelection[0].id)
        
        if(res.code!==200)
           return  this.$message({
            message: '上架商品失败',
            type: 'error',
            duration:800,
          });
        this.delWarnVisible=false
        this.getGoodsList()
        this.$message({
            message: '上架商品成功',
            type: 'success',
            duration:800,
          });
        }
    },
    async downGoods(){
      if(this.multipleSelection.length!=1){
           this.$message({
            showClose: true,
            message: '选择一条商品进行下架',
            type: 'warning'
          });
        }
        else {
          const {data:res}=await this.$http.post("goods/downgoods?id="+this.multipleSelection[0].id)
        
          if(res.code!==200)
            return  this.$message({
              message: '下架商品失败',
              type: 'error',
              duration:800,
            });
          this.delWarnVisible=false
          this.getGoodsList()
          this.$message({
              message: '下架商品成功',
              type: 'success',
              duration:800,
            });
        }
    }
  },
  mounted(){
    this.getGoodsList()
    this.getFirstList()
  },
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.pcgoods {
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
  display: inline-block;
  font-size: 14px;
  vertical-align: middle;
  width: 60px;
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
 
}
.el-pagination {
  float: right;
  margin-top: 3%;
}
.pics {
  width: 100%!important;  
}

</style>

<style>
 .pcgoods .el-table th {
    background: #e0ebff;
    
}
 .pcgoods.el-form--inline,
 .pcgoods .el-form-item {
    width: 45%;
    margin-bottom: 40px

}
.pcgoods .el-form-item__content{
  width: calc(100% - 120px);
}

.pcgoods .el-form-item__content .el-select,
.pcgoods .el-form-item__content .el-input{
  width: 100%;
}
.pcgoods .el-dialog {
  width: 45%;
  min-width: 576px;
}
.pcgoods .big .el-dialog {
  width: 20%!important;
  min-width: 256px!important;
}
.pcgoods .add .el-dialog {
  margin-top: 10px!important;
  margin-bottom: 0!important;
}
</style>