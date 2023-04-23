<template>
  <router-link class="more" :to="goLink">
    <span> <span>查看更多</span><i class="iconfont icon-xiangyou1"></i> </span>
  </router-link>
</template>

<script>
export default {
    props:["goLink"]
};
</script>

<style scoped>
.more {
  width: 100%;
  display: block;
  padding: 3px 10px;
  transition: all 0.4s;
}
.more > span {
  display: inline-block;
  text-align: center;
  width: 100%;
}
.more > span span {
  padding-right: 6px;
  transition: padding 0.4s;
}
.more:hover > span span {
  padding-right: 12px;
}
.more:hover {
  background: #1f2d3d;
  color: #fff;
  padding: 3px 17px;
}
</style>