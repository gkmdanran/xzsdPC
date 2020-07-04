<template>
  <div class="pcslide">
      <el-menu :default-active="onRouters"   class="el-menu-vertical-demo" router >
        <template v-for="x in menuList" >
          <template v-if="x.children&&x.children.length>0">
            <el-submenu :index="x.id" :key="x.id">
              <template slot="title">
                <i :class="x.icon"></i>
                <span v-text="x.name"></span>
              </template>
              <el-menu-item :index="y.path" v-for="y in x.children" :key="y.id">
                <i :class="y.icon"></i>
                <span slot="title" v-text="y.name"></span>
              </el-menu-item>
            </el-submenu>
          </template>
          <template v-else>
            <el-menu-item :index="x.path" :key="x.id">
                <i :class="x.icon"></i>
                <span slot="title" v-text="x.name"></span>
            </el-menu-item>
          </template>
         </template>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'pcslide',
  data () {
    return {
     menuList:[
       {id:'1',name:'系统管理',icon:'el-icon-s-tools',path:'/',children:[
         {id:'1-1',name:'用户管理',icon:'el-icon-user-solid',path:'/pcuser'},
         {id:'1-2',name:'菜单管理',icon:'el-icon-menu',path:'/pcmenu'},
       ]},
       {id:'2',name:'商品管理',icon:'el-icon-goods',path:'/pcgoods'},
       {id:'3',name:'客户管理',icon:'el-icon-user',path:'/pccustomer'},
       {id:'4',name:'商品分类管理',icon:'el-icon-s-grid',path:'/pckinds'},
       {id:'5',name:'门店管理',icon:'el-icon-s-shop',path:'/pcshop'},
       {id:'6',name:'司机信息管理',icon:'el-icon-truck',path:'/pcdriver'},
       {id:'7',name:'首页轮播图管理',icon:'el-icon-picture',path:'/pcbanners'},
       {id:'8',name:'订单管理',icon:'el-icon-tickets',path:'/pcorders'},
       {id:'9',name:'热门商品管理',icon:'el-icon-shopping-cart-full',path:'/pchots'},
     ]
    }
  },
  methods:{
    async getMenuList(){
       const {data:res}=await this.$http.get("sysmenu/getMenu")
      
      var menulist=[]
        for(let x of res.data){
          
          if(x.childMenu&&x.childMenu.length!=0){
            var childlist=[]
             for (let y of x.childMenu){
              
              var child={
                name:y.menuName,
                id:y.menuCode,
                icon:y.icon,
                path:y.menuUrl

              }
              childlist.push(child)
              x.children=childlist
            }
          }
          else{
             x.children=[]
          }
          var parent={
            name:x.menuName,
            id:x.menuCode,
            icon:x.icon,
            path:x.menuUrl,
            children:x.children,

          }
          menulist.push(parent)       
        }
      this.menuList=menulist
      
    }
  },
  computed:{
    onRouters(){
     
      return this.$route.name
    }
  },
  created(){
    this.getMenuList()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 .pcslide{
  width: 100%;
  height: 100%;
  background-color: #04294b;
  }
</style>
<style>
  .pcslide .el-menu {
    background-color: #04294b;
    color: #8b9cac;
  }
  .pcslide .el-menu-item,
  .pcslide .el-submenu__title{
     color: #96a6b4;
  }
  .pcslide .el-menu-item:focus, 
  .pcslide .el-menu-item:hover{
    background-color: #01427f;
    color: #96a6b4;
  }
  .pcslide .el-submenu__title:hover {
      background-color: #01427f;
    color: #96a6b4;
}

.pcslide .el-menu{
  border:0;
}
.el-menu-item.is-active {
     background-color: #01427f;
    color: #96a6b4;
}
</style>
