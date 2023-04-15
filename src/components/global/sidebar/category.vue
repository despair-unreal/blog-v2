<template>
  <div class="category card-box">
      <h2>
        <i class="iconfont icon-grouping"></i>
        <span>分类</span>
      </h2>
      <div class="category-list">
        <router-link v-for="item in 8" :key="item" to="">
          <span>hexo</span>
          <span>2</span>
        </router-link>
        <router-link to="">
          <span>
            <span>查看更多</span><i class="iconfont icon-xiangyou1"></i>
          </span>
        </router-link>
      </div>
    </div>
</template>

<script>
export default {

}
</script>

<style>
.category .category-list a{
  width: 100%;
  display: block;
  padding: 3px 10px;
  transition: all .4s;
}
.category .category-list a:hover{
  background: #1f2d3d;
  color: #fff;
  padding: 3px 17px;
}
.category .category-list a>span{
  display: inline-block;
}
.category .category-list a>span:first-child{
  width: 80%;
}
.category .category-list a>span:last-child{
  width: 20%;
  text-align: right;
}
.category .category-list a:last-child>span{
  text-align: center;
  width: 100%;
}
.category .category-list a:last-child>span span{
  padding-right: 6px;
  transition: padding .4s;
}
.category .category-list a:last-child:hover>span span{
  padding-right: 12px;
}
</style>