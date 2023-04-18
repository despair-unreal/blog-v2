<template>
  <div>
    <header v-if="bg.backgroundImage" class="hearder-bg" :style="bg">
      <div class="article-info">
        <h1 class="text-overflow">逆光潜入</h1>
        <articleMeta></articleMeta>
      </div>
    </header>
    <div class="layout">
      <main>
        <div class="content card-box">
          <div v-if="!bg.backgroundImage" class="hearder-only-text">
            <div class="article-info">
              <h1 class="text-overflow">逆光潜入</h1>
              <articleMeta></articleMeta>
            </div>
          </div>
          <div ref="article" class="article">
            <p id="testa">text2</p>
            光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入
            <p id="testb">text2</p>
            光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入
            <h1 id="test1">text1</h1>
            光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入
            <h1 id="test2">text2</h1>
            光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入
            <h1 id="test3"></h1>
            光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入
            <h1 id="test4">text4</h1>
            光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入光潜入逆光潜入逆光潜入
          </div>
          <div class="tags-share">
            <div class="tags">
              <router-link to="" v-for="item in 3" :key="item"
                >课程</router-link
              >
            </div>
            <div class="share">
              <a target="_blank" class="iconfont icon-qq"></a>
              <a target="_blank" class="iconfont icon-wechat"></a>
              <a target="_blank" class="iconfont icon-weibo"></a>
              <a target="_blank" class="iconfont icon-lianjie"></a>
            </div>
          </div>
          <div class="pre-next-article">
            <router-link to="">
              <img
                src="@/assets/images/crowd-loading/crowd-background.jpg"
                alt="cover of previous article"
              />
              <div>
                <span>上一篇</span>
                <span class="text-overflow"
                  >这里是标题标题这里是标题标题这里是标题标题这里是标题标题这里是标题标题这里是标题标题这里是标题标题这里是标题标题这里是标题标题这里是标题标题这里是标题标题这里是标题标题这里是标题标题这里是标题标题这里是标题标题这里是标题标题这里是标题标题这里是标题标题这里是标题标题这里是标题标题这里是标题标题这里是标题标题这里是标题标题这里是标题标题</span
                >
              </div>
            </router-link>
            <router-link to="">
              <!-- <img src="" alt="cover of next article"> -->
              <div>
                <span>下一篇</span>
                <span class="text-overflow">这里是标题标题</span>
              </div>
            </router-link>
          </div>
        </div>
      </main>
      <div class="sidebar">
        <catalogue></catalogue>
        <recent-article></recent-article>
      </div>
    </div>
  </div>
</template>

<script>
import articleMeta from "../components/articleContent/articleMeta.vue";
import catalogue from "../components/articleContent/catalogue.vue";
import recentArticle from "../components/global/sidebar/recentArticle.vue";

export default {
  components: {
    articleMeta,
    catalogue,
    recentArticle,
  },
  data() {
    return {
      bg: {
        backgroundImage: `url(${require("@/assets/images/crowd-loading/crowd-background.jpg")})`,
      },
    };
  },
  mounted(){
    //如果本文章页有设置封面，则让导航栏的字体颜色为#eee即设置的FontcolorLightGrey类
    if(this.bg.backgroundImage)
      this.$bus.$emit("navFontColorClass","FontcolorLightGrey");
  }
};
</script>

<style scoped>
header {
  position: relative;
  height: 400px;
  width: 100%;
  margin-bottom: -70px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  transition: all 0.5s;
  animation: header-effect 1s;
}
header::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}
@keyframes header-effect {
  0% {
    opacity: 0;
    transform: translateY(-50px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
.article-info h1{
  font-weight: 400;
  line-height: 1.5;
  font-size: 36px;
  -webkit-line-clamp: 3;
}
.article-info .meta {
  font-size: 14px;
}
header .article-info {
  position: absolute;
  padding: 0 88px;
  width: 100%;
  bottom: 100px;
  text-align: center;
}
header .article-info h1{
  color: #fff;
  margin: 20px 0 8px;
}
header .article-info .meta {
  color: #eee;
}
.hearder-only-text {
  margin-bottom: 30px;
}
.hearder-only-text .article-info .meta{
  color: #78818a;
}
.hearder-only-text .article-info h1{
  color: #1f2d3d;
  padding-bottom: 4px;
  margin-bottom: 8px;
  border-bottom: 1px solid #eee;
}
main .content {
  padding: 50px 40px;
}
main .content .article {
  margin-bottom: 10px;
}
.sidebar {
  top: 20px;
  position: sticky;
}
main .tags-share {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
main .tags-share > div {
  display: inline-block;
}
main .tags-share > div a {
  display: inline-block;
}
main .tags-share .tags a {
  margin: 8px 8px 8px 0;
  padding: 0 12px;
  border: 1px solid #797979;
  border-radius: 12px;
  font-size: 12px;
  color: #797979;
  transition: all 0.2s ease-in-out;
}
main .tags-share .tags a:hover {
  background: #797979;
  color: #fff;
}
main .tags-share .share {
  margin-left: auto;
}
main .tags-share .share a {
  margin: 8px 4px;
  font-size: 14px;
  border-radius: 50%;
  border: 1px solid #797979;
  width: 26.4px;
  height: 26.4px;
  line-height: 26.4px;
  text-align: center;
  transition: all 0.6s ease-in-out 0s;
}
main .tags-share .share .icon-qq {
  border-color: #56b6e7;
  color: #56b6e7;
}
main .tags-share .share .icon-qq:hover {
  background: #56b6e7;
  color: #fff;
}
main .tags-share .share .icon-wechat {
  border-color: #7bc549;
  color: #7bc549;
}
main .tags-share .share .icon-wechat:hover {
  background: #7bc549;
  color: #fff;
}
main .tags-share .share .icon-weibo {
  border-color: #ff763b;
  color: #ff763b;
}
main .tags-share .share .icon-weibo:hover {
  background: #ff763b;
  color: #fff;
}
main .tags-share .share .icon-lianjie {
  font-weight: bolder;
  border-color: #797979;
  color: #797979;
}
main .tags-share .share .icon-lianjie:hover {
  background: #797979;
  color: #fff;
}
main .pre-next-article {
  margin-top: 40px;
  background: black;
  width: 100%;
  overflow: hidden;
}
@media screen and (max-width: 768px) {
  main .pre-next-article > a {
    width: 100% !important;
  }
}
main .pre-next-article > a:first-child {
  float: left;
}
main .pre-next-article > a:last-child {
  text-align: right;
}
main .pre-next-article > a {
  position: relative;
  width: 50%;
  display: block;
  height: 150px;
  overflow: hidden;
}
main .pre-next-article > a:hover img {
  opacity: 0.8;
  transform: scale(1.1);
}
main .pre-next-article a img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.4;
  transition: all 0.6s;
}
main .pre-next-article a div {
  position: absolute;
  top: 50%;
  padding: 20px 40px;
  width: 100%;
  transform: translate(0, -50%);
}
main .pre-next-article a div span {
  -webkit-line-clamp: 2;
}
main .pre-next-article a div span:first-child {
  font-size: 12.6px;
  color: #eee;
}
main .pre-next-article a div span:last-child {
  color: #fff;
  font-weight: 500;
}
</style>