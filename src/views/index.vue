<!-- 博客首页 -->
<template>
  <div class="container">
    <ul>
      <li v-for="item in 2" :key="item" class="list-item">
        <router-link class="cover" to="/articleDetail">
          <img src="@/assets/images/crowd-loading/crowd-background.jpg" />
        </router-link>
        <div class="info">
          <router-link class="title" to="/articleDetail">
            逆光潜入逆光潜入逆光潜入逆光潜入逆光潜入逆光潜入逆光潜入逆光潜入逆光潜入逆光潜入
          </router-link>
          <Meta class="meta"></Meta>
          <div :class="['content', { 'sticky-content': item === 1 }]">
            <p>
              游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录游戏记录
            </p>
          </div>
        </div>
      </li>
    </ul>
    <Pagination></Pagination>
  </div>
</template>

<script>
import Meta from '@/components/ArticleMeta.vue';
import Pagination from '@/components/global/Pagination.vue';
export default {
  components: {
    Meta,
    Pagination
  }
};
</script>

<style lang="scss" scoped>
$max-width: 768px;
.list-item {
  @include card-box;
  &:not(:first-child) {
    margin-top: 20px;
  }
  display: flex;
  align-items: center;
  width: 100%;
  &:hover .cover img {
    transform: scale(1.1);
  }
  .cover {
    width: 55%;
    align-self: stretch;
    overflow: hidden;
    border-radius: 12px 0 0 12px;
    background: black;
    img {
      height: 100%;
      width: 100%;
      object-fit: cover;
      transition: all 0.6s;
    }
  }
  .info {
    width: 45%;
    padding: 20px 30px;
    overflow: hidden;
    .title {
      font-size: 22px;
      font-weight: bolder;
      line-height: 1.4;
      color: $emphasize-black;
      margin-bottom: 6px;
      @include text-overflow(2);
    }
    .meta {
      font-size: 12.6px;
      justify-content: flex-start;
    }
    .content {
      margin-top: 6px;
      @include text-overflow(3);
    }
    .sticky-content {
      @include text-overflow(8);
    }
  }
  @media screen and (max-width: $max-width) {
    flex-direction: column;
    .cover {
      width: 100%;
      height: 230px;
      border-radius: 8px 8px 0 0;
    }
    .info {
      width: 100%;
      padding: 20px 20px 30px;
    }
  }
}
</style>