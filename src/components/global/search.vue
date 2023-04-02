<template>
  <div id="search">
    <div id="mask" :class="{hide:closeSearchFlag}"></div>
    <div id="dialog" :class="{'dialog-hide':closeSearchFlag}">
      <h1>SEARCH</h1>
      <i class="search-close iconfont icon-close" @click="closeSearch"></i>
      <input type="text" placeholder="搜索文章..." v-model="searchText" />
      <i class="input-clear iconfont icon-close" @click="clearInput"></i>
      <div class="result">
        <ul>
          <li><a>我是一条结果</a></li>
          <li><a>我是一条结果</a></li>
        </ul>
        <div class="status">
          <span v-if="false">找到2条结果</span>
          <span v-else>找不到您查询的内容：{{searchText}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props:["opensearch"],
  data(){
    return{
      searchText:'',
      closeSearchFlag:true
    }
  },
  watch:{
    opensearch:function(){
      this.closeSearchFlag = !this.opensearch;
    }
  },
  methods:{
    clearInput:function(){
      this.searchText = '';
    },
    closeSearch:function(){
      this.$emit("closeSearch")
    }
  }
};
</script>

<style>
.hide{
  opacity: 0 !important;
  pointer-events: none;
}

#mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: black;
  opacity: 0.6;
  width: 100%;
  height: 100%;
  transition:all 0.5s ease;
}
.dialog-hide{
  top: 0 !important;
  transform: translateY(-100%);
}
#dialog {
  position: fixed;
  top: 76px;
  left: calc(50% - 210px);
  background: #f6f8fa;
  padding: 14px;
  width: 420px;
  border-radius: 8px;
  font-size: 14px;
  color: #4c4948;
  transition:all 0.5s ease;
}
#dialog h1 {
  padding-bottom: 10px;
  color: #797979;
  font-size: 20px;
  line-height: 1;
  font-weight: normal;
}
#dialog input {
  width: 100%;
  padding: 4px 10px;
  border-radius: 6px;
  border: 2px solid #797979;
  color: #4c4948;
  background: transparent;
  line-height: 1.15;
  margin-bottom: 8px;
}
#dialog input::placeholder {
  color: #4c4948;
}
#dialog input:placeholder-shown + .input-clear{
  display: none;
}
#dialog .input-clear{
  display: inline-block;
  position: absolute;
  right: 16px;
  font-size: 22px;
  line-height: 27.3px;
}
#dialog .icon-close{
  cursor: pointer;
}
#dialog .result ul {
  list-style-position: inside;
  list-style-type: circle;
}
#dialog .result ul li{
  font-size: 28px;
  line-height: 1;
}
#dialog .result ul li a {
  font-size: 14px;
  line-height: 2;
  vertical-align: middle;
  margin-left: -16px;
}
#dialog .status{
  line-height: 2;
}
#dialog .search-close{
  position: absolute;
  top: 8px;
  right: 8px;
  font-weight: 900;
  font-size: 28px;
  color: #797979;
}
</style>