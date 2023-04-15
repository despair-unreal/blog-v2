<template>
  <div class="meta">
    <span v-if="sticky" class="sticky">
      <i class="iconfont icon-zhiding"></i>
      <span>置顶</span>
      <i class="iconfont icon-fenge"></i>
    </span>
    <span class="date">
      <time title="发表于 2021-12-06">
        <i class="iconfont icon-rili"></i>
        <span>发表于16个月前</span>
      </time>
    </span>
    <span class="date">
      <i class="iconfont icon-fenge"></i>
      <time title="更新于 2021-12-10">
        <i class="iconfont icon-banbengengxin"></i>
        <span>更新于15个月前</span>
      </time>
    </span>
    <span class="category">
      <i class="iconfont icon-fenge"></i>
      <i class="iconfont icon-grouping"></i>
      <router-link to="">游戏记录</router-link>
      <i class="iconfont icon-xiangyou1"></i>
      <router-link to="">记录</router-link>
    </span>
    <span v-if="!sticky" class="readership">
      <i class="iconfont icon-fenge"></i>
      <i class="iconfont icon-yueduliang"></i>
      <span>阅读量：255</span>
    </span>
  </div>
</template>

<script>
export default {
    computed:{
        sticky:function(){
            return this.$route.path === '/article' ? true : false
        }
    }
};
</script>

<style scoped>
.meta i:not(.icon-fenge,.icon-xiangyou1){
  margin-right: 4px;
}
.meta .sticky *:not(.icon-fenge){
  color: #ff7242;
}

.meta>span:not(.category){
  cursor: default;
}
.meta>span{
  display: inline-block;
}
.meta .category a:hover{
  text-decoration:underline;
}
.meta .sticky .icon-zhiding,
.meta .icon-fenge,
.meta .icon-xiangyou1,
.meta .icon-yueduliang{
  font-weight: bolder;
}
</style>