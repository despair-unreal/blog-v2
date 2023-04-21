<template>
  <div class="pagination">
    <router-link v-if="currentIndex !== 1" @click.native="preCurrent" to="">
      <i class="iconfont icon-xiangzuo1"></i>
    </router-link>
    <router-link
      v-for="item in showPage"
      :key="item"
      @click.native="changeCurrent(item)"
      :class="[{ current: currentIndex === item }, 'page-number']"
      to=""
    >
      {{ item }}
    </router-link>
    <span class="space" v-if="currentIndex < maxPage - 3">...</span>
    <router-link
      :class="[{ current: currentIndex === maxPage }, 'page-number']"
      @click.native="changeCurrent(maxPage)"
      to=""
    >
      {{ maxPage }}
    </router-link>
    <router-link
      v-if="currentIndex !== maxPage"
      @click.native="nextCurrent"
      to=""
    >
      <i class="iconfont icon-xiangyou1"></i>
    </router-link>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentIndex: 1,
      maxPage: 8,
    };
  },
  computed: {
    // 展示的页码
    showPage: function () {
      // 在显示到倒数第4个页码前，当前页码后需要再显示一个页码
      // 省略号中省略两个及以上的页码
      if (this.currentIndex < this.maxPage - 3) return this.currentIndex + 1;
      // 这边所设置的展示的页码是除了最后一个页码，因为最后一个页码已固定显示
      // 即动态显示的页码为：1 ~ maxPage.length-1
      else return this.maxPage - 1;
    },
  },
  methods: {
    preCurrent: function () {
      this.currentIndex--;
    },
    nextCurrent: function () {
      this.currentIndex++;
    },
    changeCurrent: function (item) {
      this.currentIndex = item;
    },
  },
};
</script>

<style scoped>
.pagination {
  margin-top: 20px;
  text-align: center;
  width: 100%;
  font-size: 16px;
}
.pagination > * {
  display: inline-block;
  text-align: center;
  margin: 0 4px;
  min-width: 24px;
  height: 24px;
  line-height: 24px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.4s;
}
.pagination .current {
  background: #1f2d3d;
  color: #fff;
  transition: all 0.4s;
}
.pagination .current,
.pagination .space {
  cursor: default;
}
.pagination > *:not(.space):hover {
  background: #fff;
  color: #1f2d3d;
  box-shadow: 0 3px 8px 3px rgba(150, 150, 150, 0.1);
}
</style>