<template>
  <main>
    <div v-for="index in 6" :key="index" class="article-item card-box">
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
        <div class="content text-overflow">
          <p>游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录</p>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
export default {};
</script>

<style>
.article-item {
  display: flex;
  align-items: center;
  width: 100%;
  height: 210px;
  transition: all .3s;
}
.article-item:first-child{
  height: 392px;
}
.article-item:not(:first-child){
  margin-top: 20px;
}
.article-item:hover .cover img{
  transform: scale(1.1);
}
.article-item .cover{
  width: 55%;
  height: 100%;
  overflow: hidden;
  border-radius: 12px 0 0 12px;
}
.article-item .cover img{
  height: 100%;
  width: 100%;
  object-fit: cover;
  transition: all .6s;
}
.article-item .info{
  width: 45%;
  height: 90%;
  padding: 0 30px;
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
.article-item:first-child .info .content{
  -webkit-line-clamp: 8;
}
.article-item:not(:first-child) .info .content{
  -webkit-line-clamp: 2;
}
</style>