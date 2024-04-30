<!-- 文章分类 -->
<template>
  <div class="category">
    <!-- <h2 class="title">分类 - 6</h2> -->
    <ul class="list">
      <li class="list-item" v-for="item in 6" :key="item">
        <router-link class="item" to="">技术</router-link>
        <span class="count">(4)</span>
        <ul class="list-item-child">
          <li class="list-item" v-for="item in 6" :key="item">
            <router-link class="item" to="">技术</router-link>
            <span class="count">(4)</span>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
export default {};
</script>
<style lang='scss' scoped>
.category .list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  .list-item {
    margin: 6px 0;
    .list-item-child {
      padding-left: 12px;
    }
    .count {
      margin-left: 8px;
      color: $font-3;
      cursor: default;
    }
    .item {
      position: relative;
      padding-left: 20px;
      &:hover {
        color: $font-2;
        &::before {
          border-color: $orange;
        }
      }
      &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        width: 6px;
        height: 6px;
        border: 2px solid $font-3;
        border-radius: 50%;
        transform: translateY(-50%);
        transition: all 0.3s ease-out;
      }
    }
  }
}
</style>