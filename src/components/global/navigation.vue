<template>
  <div id="container">
    <div id="nav" :class="[navigationFontColor, isVisible]">
      <router-link id="blog-name" :to="home.src">
        <i :class="['iconfont',home.icon]"></i>
        <div class="name">
          <span>BAIKONG</span>
          <span>{{pageName}}</span>
        </div>
      </router-link>
      <div id="menus">
        <i class="iconfont icon-search" @click="openSearch"></i>
        <div v-for="item in menus" :key="item.name" class="menus-item">
          <router-link :to="item.src">{{ item.name }}</router-link>
        </div>
        <i class="iconfont icon-liebiao" @click="openRightNav"></i>
      </div>
    </div>
    <rightNav :openrightnav="openrightnav" @closeRightNav="closeRightNav" :rightMenus="rightMenus"></rightNav>
    <search :opensearch="opensearch" @closeSearch="closeSearch"></search>
  </div>
</template>

<script>
import search from "./search.vue";
import rightNav from "./rightNav.vue";

export default {
  components: {
    search,
    rightNav,
  },
  data() {
    return {
      opensearch: false,
      openrightnav:false,
      navFontColor: null,
      //记录上一次页面滚动的距离
      prePageYOffset : 0,
      isVisible: null,
      home:{ name: "HOME",pageName:"home", src: "/home", icon:"icon-home"},
      menus: [
        { name: "文章",pageName:"article", src: "/", icon:"icon-fabuwenzhang"},
        { name: "归类",pageName:"classify",  src: "/classify", icon: "icon-guanli"},
        { name: "随笔",pageName:"essay",  src: "", icon: "icon-jurassic_text"},
        { name: "留言",pageName:"board",  src: "", icon: "icon-heiban"},
        { name: "音乐",pageName:"music",  src: "", icon: "icon-yinle1"},
      ],
    };
  },
  computed: {
    rightMenus: function () {
      return [this.home,...this.menus];
    },
    pageName: function(){
      const findPageName = this.rightMenus.find(el=> el.src === this.$route.path)
      if(findPageName)
        return findPageName.pageName.toUpperCase();
      else if(this.$route.path === "/articleContent")
        return "article".toUpperCase();
      else {
        console.log(this.$route.path,findPageName)
        return "home".toUpperCase();
      }
    },
    navigationFontColor: function () {
      switch (this.$route.path) {
        case "/home":
          return "FontcolorLightGrey";
        case "/articleContent": {
          if (this.navFontColor) return this.navFontColor;
          else return "";
        }
        default:
          return "";
      }
    },
  },
  methods: {
    //搜索框
    openSearch: function () {
      this.opensearch = true;
    },
    closeSearch: function () {
      this.opensearch = false;
    },
    //侧边导航栏
    openRightNav: function(){
      this.openrightnav = true;
    },
    closeRightNav: function(){
      this.openrightnav = false;
    },
    //导航栏滚动样式
    setNavScrollClass: function(){
      //根据比较当前与上次的页面滚动距离来判断页面是往哪个方向滚动
      //向下滚动
      if (window.pageYOffset > this.prePageYOffset) this.isVisible = "not-visible";
      else this.isVisible = "fixed";

      if (window.pageYOffset === 0) this.isVisible = "";

      this.prePageYOffset = window.pageYOffset;
    }
  },
  created() {
    this.$bus.$on("navFontColorClass", (res) => {
      this.navFontColor = res;
    });
    
    window.addEventListener("scroll", this.setNavScrollClass);
  },
  beforeDestroy(){
    window.removeEventListener("scroll", this.setNavScrollClass);
  }
};
</script>

<style scoped>
#container{
  position: fixed;
  z-index: 99;
}
#nav {
  width: 100%;
  height: 60px;
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  padding: 0 36px;
  font-size: 16px;
  color: #4c4948;
  user-select: none;
  transition: all 0.5s;
}
#nav.FontcolorLightGrey {
  color: #eee !important;
}
#nav.fixed {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(3px);
  box-shadow: 0 5px 6px -5px rgba(133, 133, 133, 0.6);
  color: inherit !important;
}
#nav.not-visible {
  top: -60px;
}
#blog-name .icon-home {
  font-size: 25px;
  opacity: 0.8;
  margin-right: 10px;
}
#blog-name {
  display: flex;
  align-items: center;
  line-height: 1.1;
  font-weight: 700;
  letter-spacing: 2px;
  font-size: 12px;
}
#blog-name .name span {
  display: block;
}
#blog-name .name span:first-child {
  opacity: 0.8;
}
#blog-name .name span:last-child {
  opacity: 0.3;
}
#menus {
  display: flex;
  align-items: center;
  margin-left: auto;
  flex-shrink: 0;
}
#menus i:not(:last-child) {
  padding-right: 14px;
}
#menus i.icon-liebiao {
  display: none;
}
#menus i {
  font-size: 20px;
  font-weight: 900;
  cursor: pointer;
}
#menus .menus-item {
  display: inline-block;
  font-weight: 700;
  letter-spacing: 4px;
  padding: 0 14px;
}
#menus .menus-item a {
  position: relative;
  padding-bottom: 3px;
}
#menus .menus-item a:after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 3px;
  background: #a1a1a1;
  transition: all 0.3s ease-in-out;
}
#menus .menus-item a:hover::after {
  width: calc(100% - 4px);
}
@media screen and (max-width: 768px) {
  #nav {
    padding: 0 16px;
  }
}
@media screen and (max-width: 600px) {
  #menus .menus-item {
    display: none;
  }
  #menus i.icon-liebiao {
    display: inline-block;
  }
}
</style>