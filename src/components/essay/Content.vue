<!-- 内容 -->
<template>
  <div class="content">
    <div class="text">
      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nesciunt nulla et adipisci tenetur eos beatae
        accusantium quisquam ratione excepturi, perferendis recusandae, voluptatum iste, debitis voluptatibus sequi
        dicta magni necessitatibus qui?
      </p>
    </div>
    <div class="imgs">
      <div class="img-item" v-for="item in 6" :key="item">
        <img class="img" src="@/assets/images/avatar.jpg" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>
<style lang='scss' scoped>
.content {
  .imgs {
    margin: 16px 0;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    .img-item {
      &:hover {
        filter: brightness(0.6);
      }
      height: 250px;
      border-radius: 10px;
      overflow: hidden;
      cursor: zoom-in;
      transition: filter 0.3s;
      .img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
}
</style>