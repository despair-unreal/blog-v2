<!-- 文章顶部：封面、标题、分类、日期等 -->
<!-- 根据是否有封面选用不同的样式 -->
<template>
  <header :class="['header', headerClass]" :style="background">
    <div class="article-info">
      <h1 class="title">{{ title }}</h1>
      <ArticleMeta class="meta" />
    </div>
  </header>
</template>

<script>
import ArticleMeta from '@/components/ArticleMeta.vue';

export default {
  components: {
    ArticleMeta
  },
  props: {
    bg: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: '',
      require: true
    }
  },
  computed: {
    background() {
      return {
        backgroundImage: `url(${this.bg})`
      };
    },
    headerClass() {
      return this.bg ? 'has-bg' : 'no-bg';
    }
  }
};
</script>
<style lang='scss' scoped>
$has-bg-font: #fff;
$no-bg-font: $emphasize-black;

.header {
  transition: all 0.5s;
  animation: header-effect 1s;
  .title {
    font-weight: 400;
    line-height: 1.5;
    font-size: 36px;
    @include text-overflow(3);
  }
  &.has-bg {
    position: relative;
    background: {
      size: cover;
      repeat: no-repeat;
      position: center center;
    }
    &::before {
      content: '';
      @include full;
      background: rgba(0, 0, 0, 0.5);
    }
    .article-info {
      position: absolute;
      padding: 0 88px;
      width: 100%;
      bottom: 100px;
      text-align: center;
      .title {
        color: $has-bg-font;
        margin: 20px 0 8px;
      }
      .meta {
        color: #eee;
        justify-content: center;
      }
    }
  }
  &.no-bg {
    margin-bottom: 30px;
    .article-info {
      .title {
        color: $no-bg-font;
        padding-bottom: 4px;
        margin-bottom: 8px;
        border-bottom: 1px solid #eee;
      }
    }
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
}
</style>