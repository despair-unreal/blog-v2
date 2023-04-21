<template>
  <div class="card-box">
    <main>
      <h1>文章总览 - 64</h1>
      <div class="article-sort">
        <div v-for="item in 8" :key="item">
          <div class="item year">2023</div>
          <div class="item" v-for="item in 3" :key="item">
            <router-link class="cover" to=""
              ><img src="@/assets/images/crowd-loading/crowd-background.jpg"
            /></router-link>
            <div class="info">
              <div class="time">
                <i class="iconfont icon-rili"></i>
                <time title="发表于 2023-03-12">2023-03-12</time>
              </div>
              <router-link to="" class="title text-overflow"
                >学习笔记学习笔记学习笔记学习笔记学习笔记学习笔记学习笔记学习笔记学习笔记学习笔记学习笔记学习笔记学习笔记学习笔记</router-link
              >
            </div>
          </div>
        </div>
      </div>
    </main>
    <pagination></pagination>
  </div>
</template>

<script>
import pagination from "../components/global/pagination.vue";

export default {
  components: {
    pagination,
  },
};
</script>

<style scoped>
main h1 {
  position: relative;
  font-weight: normal;
  font-size: 24px;
  padding-left: 20px;
  padding-bottom: 20px;
  margin-left: 10px;
}
main h1::before {
  content: "";
  position: absolute;
  top: 50%;
  transform: translateY(-100%);
  left: -10px;
  width: 10px;
  height: 10px;
  border: 4.8px solid #1f2d3d;
  border-radius: 50%;
  transition: all 0.2s ease-in-out;
}
main h1::after,
main .article-sort::before {
  content: "";
  position: absolute;
  left: 0;
  width: 2px;
  background: #1f2d3d;
  transform: translateX(-50%);
}
main h1::after {
  bottom: 0;
  height: 36px;
}

main .article-sort {
  position: relative;
  margin-left: 10px;
  padding-left: 20px;
}
main .article-sort::before {
  top: 0;
  height: 100%;
}
main .article-sort .item.year {
  font-size: 20px;
}
main .article-sort .item {
  position: relative;
  display: flex;
  align-items: center;
  margin: 0 0 10px 20px;
}
main .article-sort .item::before {
  content: "";
  position: absolute;
  left: -40px;
  width: 6px;
  height: 6px;
  border: 2.4px solid #1f2d3d;
  border-radius: 50%;
  background: #fff;
  transform: translateX(-50%);
  transition: all 0.2s ease-in-out;
}
main .article-sort .item.year::before {
  border-color: #ff7242;
}
main .article-sort .item:hover:before {
  border-color: #ff7242;
}
main:has(.article-sort .item:hover) h1:before {
  border-color: #ff7242;
}
main .article-sort .item .cover {
  width: 80px;
  height: 80px;
  overflow: hidden;
}
main .article-sort .item .cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.6s;
}
main .article-sort .item .cover img:hover {
  transform: scale(1.1);
}
main .article-sort .item .info {
  flex: 1;
  padding: 0 16px;
}
main .article-sort .item .info .time {
  color: #858585;
  font-size: 13px;
}
main .article-sort .item .info .time time {
  padding-left: 6px;
  cursor: default;
}
main .article-sort .item .info .title {
  font-size: 15.4px;
  transition: all 0.3s;
  -webkit-line-clamp: 2;
}
main .article-sort .item .info .title:hover {
  color: #797979;
  transform: translateX(10px);
}
</style>