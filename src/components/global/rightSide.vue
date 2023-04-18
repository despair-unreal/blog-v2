<template>
  <div id="right-side" :class="{ show: isShow }">
    <div class="show">
      <button type="botton" title="设置">
        <i class="iconfont icon-shezhi"></i>
      </button>
      <button type="botton" title="音乐">
        <i class="iconfont icon-music_playlist"></i>
      </button>
      <button v-if="onArticleContent" type="botton" title="目录" @click="openCatalogue">
        <i class="iconfont icon-liebiao"></i>
      </button>
      <button type="botton" title="返回顶部" @click="goTop()">
        <i class="iconfont icon-dingbu"></i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isShow: false,
      isOpenCatalogue:false
    };
  },
  computed:{
    onArticleContent:function(){
        if(this.$route.path === '/articleContent')
          return true;
        else
          return false;
    }
  },
  mounted() {
    window.addEventListener("scroll", () => {
        //处于页面顶部
        if(window.scrollY === 0){
          this.isShow = false;
        }else{
            this.isShow = true;
        }
    });
  },
  watch:{
    isOpenCatalogue:function(){
      this.$bus.$emit('isOpenCatalogue',this.isOpenCatalogue);
    }
  },
  methods:{
    goTop:function(){
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        this.isOpenCatalogue = false;
    },
    openCatalogue:function(){
      this.isOpenCatalogue = !this.isOpenCatalogue;
    }
  }
};
</script>

<style>
#right-side {
  position: fixed;
  bottom: 40px;
  right: -38px;
  opacity: 0;
  transition: all 0.5s;
}
#right-side.show {
  opacity: 1;
  transform: translateX(-38px);
}
#right-side > div button {
  display: block;
  margin-bottom: 2px;
  width: 30px;
  height: 30px;
  background: #fff;
  color: #4c4948;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  border: none;
  line-height: 1;
  transition: all 0.5s;
}
#right-side > div button:hover{
  background: #1f2d3d;
  color: #fff;
}
#right-side > div button .icon-music_playlist {
  font-weight: bold;
}
@media screen and (min-width: 900px) {
  #right-side > div button[title="目录"]{
    display: none;
  }
}
</style>