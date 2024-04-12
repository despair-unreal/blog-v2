<!-- 博客首页 -->
<template>
  <div class="container">
    <main>
      <div v-for="index in 2" :key="index" class="article-item card-box">
        <router-link class="cover" to="/articleDetail">
          <img src="@/assets/images/crowd-loading/crowd-background.jpg" />
        </router-link>
        <div class="info">
          <router-link class="title text-overflow" to="/articleDetail">
            逆光潜入逆光潜入逆光潜入逆光潜入逆光潜入逆光潜入逆光潜入逆光潜入逆光潜入逆光潜入
          </router-link>
          <Meta class="meta"></Meta>
          <div class="content text-overflow sticky-content">
            <p>
              游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录
            </p>
          </div>
        </div>
      </div>
    </main>
    <pagination></pagination>
  </div>
</template>

<script>
import Meta from '../components/ArticleMeta.vue';
import pagination from '../components/global/pagination.vue';
export default {
  components: {
    Meta,
    pagination
  }
};
</script>

<style scoped>
.container {
  padding: 0 !important;
}
@media screen and (max-width: 768px) {
  .article-item {
    flex-direction: column;
    height: auto !important;
  }
  .article-item .cover {
    width: 100% !important;
    height: 230px !important;
    border-radius: 8px 8px 0 0 !important;
  }
  .article-item .info {
    width: 100% !important;
    padding: 20px 20px 30px !important;
  }
  .article-item:first-child .info .content {
    -webkit-line-clamp: 8;
  }
  .article-item:not(:first-child) .info .content {
    -webkit-line-clamp: 3;
  }
}
.article-item {
  display: flex;
  align-items: center;
  width: 100%;
}
.article-item:hover .cover img {
  transform: scale(1.1);
}
.article-item .cover {
  /* position: relative; */
  width: 55%;
  align-self: stretch;
  overflow: hidden;
  border-radius: 12px 0 0 12px;
  background: black;
}
.article-item .cover img {
  /* position: absolute; */
  height: 100%;
  width: 100%;
  object-fit: cover;
  transition: all 0.6s;
}
.article-item .info {
  width: 45%;
  padding: 20px 30px;
  overflow: hidden;
}
.article-item .info .title {
  font-size: 22px;
  font-weight: bolder;
  line-height: 1.4;
  color: #1f2d3d;
  margin-bottom: 6px;
  -webkit-line-clamp: 2;
}
.article-item .info ::v-deep .meta {
  color: #858585;
  font-size: 12.6px;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.article-item .info .content {
  margin-top: 6px;
}
.article-item .info .content {
  -webkit-line-clamp: 3;
}
.article-item .info .sticky-content {
  -webkit-line-clamp: 8;
}
</style>