<template>
  <div class="pcorders">
    <div class="contents">
       <div class="search">
            
              <span>下单人</span><input type="text" v-model="searchForm.orderPeople">
              <span>订单编码</span><input type="text" v-model="searchForm.orderCode">
              <span>付款时间</span><input type="date" v-model="searchForm.startTime" style="margin-right:10px">
              <span style="display:inline-block;width:20px">---</span>
              <input type="date" v-model="searchForm.endTime"  style="margin-left:10px">
              <br>
              <span>收货人</span><input type="text" v-model="searchForm.shippingUser">
              <span>订单状态</span><select v-model="searchForm.orderStatus">
              <option value="10">全部</option>
              <option value="0">已下单</option>
              <option value="1">已完成</option>
              <option value="2">已取消</option>
              <option value="3">已到货</option>          
              <option value="4">未到货</option>  
              <option value="5">已取货</option>  
              <option value="6">未取货</option>                       
            </select>
            <button @click="toSearch()">查询</button>
            <button class="set" @click="setAll()">重置</button>
      </div>
      <div class="bigtables">
          <el-button type="primary" icon="el-icon-s-comment" @click="viewDetails()">详情</el-button>
          <el-button type="danger" @click="delOrder()">订单取消</el-button>
          <el-button type="primary" @click="changeOrder(3)">订单到货</el-button>
          <el-button type="primary" @click="changeOrder(4)">取消到货</el-button>
          <el-button type="primary" @click="changeOrder(5)">订单已取货</el-button>
          <el-button type="primary" @click="changeOrder(6)">取消已取货</el-button>
          <div class="tables">
            <el-table ref="multipleTable" :data="ordersList" tooltip-effect="dark" style="width: 98%" height="100%" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55" fixed>
              </el-table-column>

              <el-table-column prop="orderCode" label="订单号" width="200" >
              </el-table-column>
              <el-table-column prop="orderTotal" label="订单总价" width="100">
              </el-table-column>
              <el-table-column prop="orderStatus" label="订单状态" width="120">
                <template slot-scope="scope">
                  {{scope.row.orderStatus==0?"已下单":scope.row.orderStatus==1?"已完成":scope.row.orderStatus=='2'?"已取消":scope.row.orderStatus=='3'?'已到货':scope.row.orderStatus=='4'?'未到货':scope.row.orderStatus=='5'?'已取货':'未取货'}}
                </template>
              </el-table-column>
              <el-table-column prop="shopCode" label="门店编号" width="150" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="orderPeople" label="下单人" width="120">
              </el-table-column>
              <el-table-column prop="shippingUser" label="收货人" width="120">
              </el-table-column>
               <el-table-column prop="orderPhone" label="下单人手机号" width="150">
              </el-table-column>
               <el-table-column prop="payTime" label="付款时间" width="170">
                 <template slot-scope="scope">
                  {{scope.row.payTime|getFormatTime}}
                </template>
              </el-table-column>
            </el-table>
          </div>
           <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[1,3, 5]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
      </div>
    </div>
     <el-dialog
      title="提示"
      :visible.sync="delWarnVisible"
      width="45%"
      >
      <span>取消的订单不能复原！确定取消吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delWarnVisible = false">取 消</el-button>
        <el-button type="primary" @click="SureDel()">确 定</el-button>
      </span>
    </el-dialog>

     <el-dialog
      title="订单详情"
      :visible.sync="detailVisible"
      width="64%"
     
      >
      <el-table  :data="orderDetails" tooltip-effect="dark" style="width: 100%;  max-height:300px;" height="100%" >   
        <el-table-column prop="userId" label="用户id" width="80">
        </el-table-column>
        <el-table-column prop="orderCode" label="订单编码" width="200">
        </el-table-column>
        <el-table-column prop="goodsCode" label="商品编码" width="180">
        </el-table-column> 
         <el-table-column prop="goodsName" label="商品名称" show-overflow-tooltip>
        </el-table-column>
         <el-table-column prop="buyNum" label="购买数量" width="80">
        </el-table-column>
         <el-table-column prop="goodsTotal" label="总金额" width="120">
        </el-table-column>
        <el-table-column prop="goodsSell" label="售价" width="100">
        </el-table-column>
        <!-- <el-table-column prop="goodsFix" label="定价" width="100">
        </el-table-column>      -->
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="detailVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'pcorders',
 
  data () {
    return {
      currentPage: 1,
      pageSize:5,
      total:0,
      multipleSelection: [],
      ordersList:[],
      searchForm:{
        orderPeople:'',
        orderCode:'',
        startTime:'',
        endTime:'',
        shippingUser:'',
        orderStatus:10
      },
      delWarnVisible:false,
      detailVisible:false,
      orderDetails:[],
      orders:[],
    }
  },
  methods:{
    handleSelectionChange(val) {
          this.multipleSelection = val;
         
      },
    handleSizeChange(val) {
        this.pageSize=val
        this.getOrdersList()
    },
    handleCurrentChange(val) {
     this.currentPage=val
       this.getOrdersList()
    },
    async getOrdersList(){
      var search={
        pageSize:this.pageSize,
        pageNum:this.currentPage,
        userRealName:this.searchForm.orderPeople,
        orderNo:this.searchForm.orderCode,
        shippingUser:this.searchForm.shippingUser,
        orderStatus:this.searchForm.orderStatus,
        orderStart:this.searchForm.startTime,
        orderOver:this.searchForm.endTime
      }
      
      const {data:res}=await this.$http.get("/order/selectorder",{params:search})
      console.log(res)
      var list=[]
      for(let x of res.rows){
        var order= {
          id:x.id,
          orderCode:x.orderNo,
          orderTotal:x.orderMoney,
          orderStatus:x.orderStatus,
          shopCode:x.storeNo,
          orderPeople:x.userRealName,
          orderPhone:x.phone,
          payTime:x.payTime,
          shippingUser:x.shippingUser, 
          userId:x.userCode
        }
        list.push(order)
      }
      this.ordersList=list
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
        if(this.searchForm.startTime.valueOf()>this.searchForm.endTime.valueOf()){
          this.$message({
            showClose: true,
            message: '查询时间有误',
            type: 'warning'
          });
          this.searchForm.startTime=''
          this.searchForm.endTime=''
        }
        else{
          
          this.getOrdersList()
        }
        
      }
    },
    setAll(){
      this.searchForm={
         orderPeople:'',
        orderCode:'',
        startTime:'',
        endTime:'',
        shippingUser:'',
        orderStatus:10
      }
      this.pageSize=5
      this.currentPage=1
      this.getOrdersList()
    },
    async delOrder(){
        if(this.multipleSelection.length!=1){
           this.$message({
            showClose: true,
            message: '选择一条订单进行取消',
            type: 'warning'
          });
        }
        else {
          if(this.multipleSelection[0].orderStatus==2)
             return this.$message({
                    message: '取消的订单不能进行改变',
                    type: 'error',
                    duration:800,
                  });
           if(this.multipleSelection[0].orderStatus==3||this.multipleSelection[0].orderStatus==5||this.multipleSelection[0].orderStatus==6)
             return this.$message({
                    message: '该订单不能进行取消',
                    type: 'error',
                    duration:800,
                  });
          const {data:res}=await this.$http.post("order/selectdetails",{orderNo: this.multipleSelection[0].orderCode})
          this.orders=res.data
          this.delWarnVisible=true
        }
    },
    async SureDel(){
        
        var datas={
          orderNo:this.multipleSelection[0].orderCode,
          odFlag:2,
          orderDetails:this.orders
        }
        const {data:res}=await this.$http.post("order/changestatus",datas)
       
        if(res.code!==200)
          return this.$message({
                  message: '取消订单失败',
                  type: 'error',
                  duration:800,
                });
        this.delWarnVisible=false
        this.getOrdersList()
        this.$message({
                  message: '取消订单成功',
                  type: 'success',
                  duration:800,
                });
    },
    async changeOrder(val){
        if(this.multipleSelection.length!=1){
           this.$message({
            showClose: true,
            message: '选择一条订单进行操作',
            type: 'warning'
          });
        }
        else{
           var datas={
            orderNo:this.multipleSelection[0].orderCode,
            odFlag:val
          }
          
          if(this.multipleSelection[0].orderStatus==2)
             return this.$message({
                    message: '取消的订单不能进行改变',
                    type: 'error',
                    duration:800,
                  });
          const {data:res}=await this.$http.post("order/changestatus",datas)
          
          if(res.code!==200)
            return this.$message({
                    message: '改变订单状态失败',
                    type: 'error',
                    duration:800,
                  });
          this.getOrdersList()
          this.$message({
                    message: '改变订单状态成功',
                    type: 'success',
                    duration:800,
                  });
          }
    },
    async viewDetails(){
        if(this.multipleSelection.length!=1){
          this.$message({
            showClose: true,
            message: '请选择一条数据进行查看',
            type: 'warning'
          });
        }
        else {        
          const {data:res}=await this.$http.post("order/selectdetails",{orderNo: this.multipleSelection[0].orderCode})
          
          var detailList=[]
          for(let x of res.data){
            var detail={
              userId:this.multipleSelection[0].userId,
              orderCode:x.orderNo,
              goodsCode:x.skuNo,
              goodsName:x.goodsName,
              buyNum:x.goodsCnt,
              goodsTotal:x.goodsCnt*x.goodsPrice,
              goodsSell:x.goodsPrice,
              // goodsFix:this.multipleSelection[0].ordergoods[i].goodsFix,
            }
            detailList.push(detail)
          }
          this.orderDetails=detailList
          this.detailVisible=true      
        }
            
        
    },
  },
  mounted(){
    this.getOrdersList()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.pcorders {
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
  margin-right: 2%;
}

</style>
<style>
 .pcorders .el-table th {
    background: #e0ebff;
    
}

.pcorders .el-dialog {
  width: 50%;
  min-width: 640px;
}
</style>