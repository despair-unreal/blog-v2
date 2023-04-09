<template>
  <div id="sidebar">
    <div class="info card-box">
      <div class="author">
        <img src="@/assets/images/avatar.jpg" />
        <h2>BAIKONG</h2>
        <p>咸鱼仰望星空.gif</p>
      </div>
      <div class="data">
        <router-link v-for="item in infoData" :key="item.title" :to="item.src">
          <p>{{ item.title }}</p>
          <p>{{ item.num }}</p>
        </router-link>
      </div>
      <a
        class="github"
        href="https://github.com/despair-unreal/blog-v2"
        target="_blank"
      >
        <i class="iconfont icon-github-fill"></i>
        <span>Follow Me</span>
      </a>
    </div>
    <div class="recent-article card-box">
      <h2>
        <i class="iconfont icon-banbengengxin"></i>
        <span>最新文章</span>
      </h2>
      <div v-for="item in 6" :key="item" class="list-item">
        <router-link class="text-overflow" to="">
          父子组件的生命周期渲染顺序问题父子组件的生命周期渲染顺序问题
        </router-link>
        <time datetime="2021-12-17 09:39" title="发表于 2021-12-17 09:39"
          >2021-12-17 09:39</time
        >
      </div>
    </div>
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
    <div class="tags card-box">
      <h2>
        <i class="iconfont icon-24gf-tags"></i>
        <span>标签</span>
      </h2>
      <div class="tag-group">
        <router-link
          :style="{ color: $utils.randomColor('html', '#999') }"
          v-for="item in 6"
          :key="item"
          to=""
          >吐槽</router-link
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      infoData: [
        { title: "文章", num: "64", src: "" },
        { title: "标签", num: "90", src: "" },
        { title: "分类", num: "18", src: "" },
      ],
      tagColor: {
        color: "",
      },
    };
  },
  mounted() {
    console.log(this.$utils.randomColor("html", "#999"));
  },
};
</script>

<style>
#sidebar > div {
  padding: 20px 24px;
}
#sidebar > div h2 {
  font-size: 16.8px;
  font-weight: normal;
  padding-bottom: 6px;
}
#sidebar > div h2 i {
  font-size: 18px;
  margin-right: 10px;
  font-weight: bold;
}
.info .author {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.info .author img {
  width: 110px;
  height: 110px;
  object-fit: cover;
  border-radius: 50%;
  transition: all 0.5s;
}
.info .author img:hover {
  transform: rotate(360deg);
}
.info .author h2 {
  margin-top: 10px;
  font-weight: 500;
  font-size: 22px;
}
.info .author p {
  line-height: 1;
  text-align: center;
  word-break: break-all;
}
.info .data {
  display: flex;
  flex-direction: row;
  margin: 24px 0 4px;
}
.info .data a {
  flex-grow: 1;
}
.info .data a p {
  text-align: center;
}
.info .data a p:last-child {
  font-size: 20px;
  margin-top: -6px;
}
.info .github {
  display: block;
  margin-top: 10px;
  background: #1f2d3d;
  color: white;
  line-height: 2.4;
  text-align: center;
  transition: all 1s;
}
.info .github:hover {
  background: #fff;
  color: #1f2d3d;
  box-shadow: 0 3px 8px 3px rgba(150, 150, 150, 0.1);
}
.info .github i {
  padding-right: 10px;
}
.recent-article .list-item {
  padding-left: 10px;
}
.recent-article .list-item:not(:last-child) {
  padding-bottom: 16px;
}
.recent-article .list-item a {
  -webkit-line-clamp: 2;
  font-size: 13.4px;
  line-height: 1.5;
}
.recent-article .list-item a:hover {
  color: #797979;
}
.recent-article .list-item time {
  display: block;
  color: #858585;
  font-size: 12px;
}

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
.tags .tag-group a {
  font-size: 15.4px;
  padding: 0 4px;
}
.tags .tag-group a:hover {
  color: #797979 !important;
}
</style>