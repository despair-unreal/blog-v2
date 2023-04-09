<template>
  <main>
    <div v-for="index in 2" :key="index" class="article-item card-box">
      <div class="cover">
        <img src="@/assets/images/crowd-loading/crowd-background.jpg" />
      </div>
      <div class="info">
        <router-link class="title text-overflow" to="">逆光潜入逆光潜入逆光潜入逆光潜入逆光潜入逆光潜入逆光潜入逆光潜入逆光潜入逆光潜入</router-link>
        <div class="meta">
          <span class="sticky">
            <i class="iconfont icon-zhiding"></i>
            <span>置顶</span>
          </span>
          <span class="date">
            <i class="iconfont icon-fenge"></i>
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
        </div>
        <div class="content text-overflow sticky-content">
          <p>游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录</p>
        </div>
      </div>
    </div>
    <div class="pagination">
      <router-link v-if="currentIndex !== 1" @click.native="preCurrent" to="">
        <i class="iconfont icon-xiangzuo1"></i>
      </router-link>
      <router-link v-for="item in showPage" :key="item" @click.native="changeCurrent(item)" :class="[{'current':currentIndex === item},'page-number']" to="">
        {{item}}
      </router-link>
      <span class="space" v-if="currentIndex < maxPage-2">...</span>
      <router-link :class="[{'current':currentIndex === maxPage},'page-number']" @click.native="changeCurrent(maxPage)" to="">
        {{maxPage}}
      </router-link>
      <router-link v-if="currentIndex !== maxPage" @click.native="nextCurrent" to="">
        <i class="iconfont icon-xiangyou1"></i>
      </router-link>
    </div>
  </main>
</template>

<script>
export default {
  data(){
    return{
      currentIndex:1,
      maxPage:7
    }
  },
  computed:{
    showPage:function(){
      if(this.currentIndex<this.maxPage-1)
        return this.currentIndex+1;
      else
        return this.maxPage-1;
    }
  },
  methods:{
    preCurrent:function(){
      this.currentIndex--;
    },
    nextCurrent:function(){
      this.currentIndex++;
    },
    changeCurrent:function(item){
      this.currentIndex = item;
    }
  }
};
</script>

<style>
@media screen and (max-width:768px) {
  .article-item {
    flex-direction: column;
    height: auto !important;
  }
  .article-item .cover{
    width: 100% !important;
    height: 230px !important;
    border-radius: 8px 8px 0 0 !important;
  }
  .article-item .info{
    width: 100% !important;
    padding: 20px 20px 30px !important;
  }
  .article-item:first-child .info .content{
    -webkit-line-clamp: 8;
  }
  .article-item:not(:first-child) .info .content{
    -webkit-line-clamp: 3;
  }
}
.article-item {
  display: flex;
  align-items: center;
  width: 100%;
}
.article-item:hover .cover img{
  transform: scale(1.1);
}
.article-item .cover{
  position: relative;
  width: 55%;
  align-self: stretch;
  overflow: hidden;
  border-radius: 12px 0 0 12px;
  background: black;
}
.article-item .cover img{
  position: absolute;
  height: 100%;
  width: 100%;
  object-fit: cover;
  transition: all .6s;
}
.article-item .info{
  width: 45%;
  padding: 20px 30px;
  overflow: hidden;
}
.article-item .info .title{
  font-size: 22px;
  font-weight: bolder;
  line-height: 1.4;
  color: #1f2d3d;
  margin-bottom: 6px;
  -webkit-line-clamp: 2;
}
.article-item .info .meta{
  color: #858585;
  font-size: 12.6px;
}
.article-item .info .meta i:not(.icon-fenge,.icon-xiangyou1){
  margin-right: 4px;
}
.article-item .info .meta .sticky{
  color: #ff7242;
}
.article-item .info .meta>span:not(.category){
  cursor: default;
}
.article-item .info .meta>span{
  display: inline-block;
}
.article-item .info .meta .category a:hover{
  text-decoration:underline;
}
.article-item .info .meta .sticky .icon-zhiding,
.article-item .info .meta .icon-fenge,
.article-item .info .meta .icon-xiangyou1{
  font-weight: bolder;
}
.article-item .info .content{
  margin-top: 6px;
}
.article-item .info .content{
  -webkit-line-clamp: 3;
}
.article-item .info .sticky-content{
  -webkit-line-clamp: 8;
}
.pagination{
  margin-top: 20px;
  text-align: center;
  width: 100%;
  font-size: 16px;
}
.pagination>*{
  display: inline-block;
  text-align: center;
  margin: 0 4px;
  min-width: 24px;
  height: 24px;
  line-height: 24px;
  border-radius: 8px;
  cursor: pointer;
  transition: all .4s;
}
.pagination .current{
  background: #1f2d3d;
  color: #fff;
  transition: all .4s;
}
.pagination .current,
.pagination .space{
  cursor: default;
}
.pagination>*:not(.space):hover{
  background: #fff;
  color: #1f2d3d;
  box-shadow: 0 3px 8px 3px rgba(150, 150, 150, 0.1);
}

</style>