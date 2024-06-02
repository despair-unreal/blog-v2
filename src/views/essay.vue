<template>
  <div class="essay">
    <ol>
      <li v-for="item in 3" :key="item" class="essay-item">
        <div class="top">
          <Message />
        </div>
        <div class="mid">
          <Content />
        </div>
        <div class="bottom">
          <div class="left"></div>
          <div class="right">
            <Interaction />
          </div>
        </div>
      </li>
    </ol>
    <Pagination />
  </div>
</template>
<script>
import Message from '@/components/essay/Message.vue';
import Content from '@/components/essay/Content.vue';
import Interaction from '@/components/essay/Interaction.vue';
import Pagination from '@/components/global/Pagination.vue';
export default {
  components: { Message, Content, Interaction, Pagination }
};
</script>

<style lang="scss" scoped>
.essay .essay-item {
  font-size: 16px;
  margin-bottom: 24px;
  @include block;
  .bottom {
    overflow: hidden;
    .left {
      float: left;
    }
    .right {
      float: right;
    }
  }
}
</style>