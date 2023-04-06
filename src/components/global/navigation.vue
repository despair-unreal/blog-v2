<template>
  <div id="nav" :class="{homeFontcolor}">
    <router-link id="blog-name" to="/home">
      <i class="iconfont icon-home"></i>
      <div class="name">
        <span>BAIKONG</span>
        <span>HOME</span>
      </div>
    </router-link>
    <div id="menus">
      <i class="iconfont icon-search" @click="openSearch"></i>
      <div v-for="item in menus" :key="item.name" class="menus-item">
        <router-link :to="item.src">{{item.name}}</router-link>
      </div>
    </div>
    <search :opensearch="opensearch" @closeSearch="closeSearch"></search>
  </div>
</template>

<script>
import search from './search.vue'

export default {
  components: {
    search
  },
  data(){
    return{
      opensearch:false,
      menus:[
        {name:"文章",src:'/article'},
        {name:"归类",src:''},
        {name:"随笔",src:''},
        {name:"留言",src:''},
        {name:"音乐",src:''},
      ]
    }
  },
  computed: {
    homeFontcolor () {
      return this.$route.path === '/home' ? 'homeFontcolor' : ''
    }
  },
  methods:{
    openSearch:function(){
      this.opensearch = true;
    },
    closeSearch:function(){
      this.opensearch = false;
    }
  }
}
</script>

<style>
.homeFontcolor{
  color: #eee !important;
}
#nav{
  width: 100%;
  height: 60px;
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9;
  padding: 0 36px;
  font-size: 16px;
  color: #4c4948;
  user-select: none;
}
#blog-name .icon-home{
  font-size: 25px;
  opacity: .8;
  margin-right: 10px;
}
#blog-name{
  display: flex;
  align-items: center;
  line-height: 1.1;
  font-weight: 700;
  letter-spacing: 2px;
  font-size: 12px;
}
#blog-name .name span{
  display: block;
}
#blog-name .name span:first-child{
  opacity: .8;
}
#blog-name .name span:last-child{
  opacity: .3;
}
#menus{
  display: flex;
  align-items: center;
  margin-left: auto;
}
#menus .icon-search{
  font-size: 20px;
  font-weight: 900;
  padding-right: 14px;
  cursor: pointer;
}
#menus .menus-item{
  display: inline-block;
  font-weight: 700;
  letter-spacing: 4px;
  padding: 0 14px;
}
#menus .menus-item a{
  position: relative;
  padding-bottom: 3px;
}
#menus .menus-item a:after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 3px;
  background: #a1a1a1;
  transition: all .3s ease-in-out;
}
#menus .menus-item a:hover::after {
  width: calc(100% - 4px);
}
</style>