<!-- 分页码 -->
<template>
  <div class="pagination">
    <div class="item" v-show="currentIndex !== 1" @click="currentIndex !== 1 && currentIndex--">
      <Icon icon="leftArrow" />
    </div>
    <div
      v-for="item in showPage"
      :key="item"
      @click="changeCurrent(content(item))"
      :class="['item page-number', { current: currentIndex === item }]"
      to=""
    >
      {{ content(item) }}
    </div>
    <div class="item" v-show="currentIndex !== maxPage" @click="currentIndex !== maxPage && currentIndex++">
      <Icon icon="rightArrow" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isUnfold: false,
      currentIndex: 1,
      maxPage: 8
    };
  },
  computed: {
    // 是否显示省略号
    isShowAbbr() {
      // 即需要显示省略号的情况为：当前页码后面还有4个以上的页码
      return this.currentIndex <= this.maxPage - 4 && !this.isUnfold;
    },
    // 展示的页码
    showPage() {
      // 当前页码（除了最后一个页码）后面需要至少显示一个页码，省略号中省略两个及以上的页码（占一位），最后一个页码固定显示
      if (this.isShowAbbr) return this.currentIndex + 3;
      return this.maxPage;
    }
  },
  methods: {
    // 页码内容
    content(item) {
      let res = item;
      // 需要显示省略号
      if (this.isShowAbbr) {
        if (item === this.showPage) {
          res = this.maxPage;
        } else if (item === this.showPage - 1) {
          res = '...';
        }
      }
      return res;
    },
    changeCurrent: function (item) {
      if (item !== '...') {
        this.currentIndex = item;
        this.isUnfold = false;
      } else {
        // 展开所有页码
        this.isUnfold = true;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
$transition-time: 0.4s;
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  font-size: 16px;
  user-select: none;
  .item {
    height: 24px;
    min-width: 24px;
    margin: 0 4px;
    border-radius: 8px;
    text-align: center;
    line-height: 24px;
    transition: all $transition-time;
    cursor: pointer;
    &:hover {
      background: #fff;
      color: $emphasize-black;
      box-shadow: 0 3px 8px 3px $block-shadow;
    }
  }
  .current {
    background: $emphasize-black;
    color: #fff;
    transition: all $transition-time;
    cursor: default;
  }
}
</style>