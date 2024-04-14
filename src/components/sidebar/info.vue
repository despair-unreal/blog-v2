<!-- 个人资料 -->
<template>
  <div class="info">
    <div class="author">
      <img class="cover" src="@/assets/images/avatar.jpg" />
      <h2 class="name">BAIKONG</h2>
      <p class="description">咸鱼仰望星空.gif</p>
    </div>
    <div class="data">
      <router-link v-for="item in infoData" :key="item.title" :to="item.src">
        <p>{{ item.title }}</p>
        <p class="num">{{ item.num }}</p>
      </router-link>
    </div>
    <a class="github" href="https://github.com/despair-unreal/blog-v2" target="_blank">
      <Icon icon="github" />
      <span class="description">Follow Me</span>
    </a>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
const info = [
  { title: '文章', num: '64', src: '' },
  { title: '标签', num: '90', src: '' },
  { title: '分类', num: '18', src: '' }
];
export default {
  computed: {
    ...mapState(['infoData'])
  },
  created() {
    this.setInfoData({ infoData: info });
  },
  methods: {
    ...mapMutations(['setInfoData'])
  }
};
</script>
<style lang="scss" scoped>
.info {
  @include sidebar;
  .author {
    display: flex;
    flex-direction: column;
    align-items: center;
    .cover {
      width: 110px;
      height: 110px;
      object-fit: cover;
      border-radius: 50%;
      transition: transform 0.5s;
      &:hover {
        transform: rotate(360deg);
      }
    }
    .name {
      margin-top: 10px;
      font-weight: 500;
      font-size: 22px;
    }
    .description {
      line-height: 1;
      text-align: center;
      word-break: break-all;
    }
  }
  .data {
    display: flex;
    justify-content: space-around;
    flex-direction: row;
    margin-top: 24px;
    a {
      text-align: center;
      .num {
        font-size: 20px;
        line-height: 1.4;
      }
    }
  }
  .github {
    display: block;
    margin-top: 16px;
    background: $emphasize-black;
    color: white;
    line-height: 2.4;
    text-align: center;
    transition: all 1s;
    &:hover {
      background: #fff;
      color: $emphasize-black;
      box-shadow: 0 3px 8px 3px $block-shadow;
    }
    .description {
      padding-left: 10px;
    }
  }
}
</style>
