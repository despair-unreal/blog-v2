<template>
  <div class="info card-box">
      <div class="author">
        <img src="@/assets/images/avatar.jpg" />
        <h2>BAIKONG</h2>
        <p>咸鱼仰望星空.gif</p>
      </div>
      <div class="data">
        <router-link v-for="item in infoData" :key="item.title" :to="item.src">
          <p>{{ item.title }}</p>
          <p>{{ item.num }}</p>
        </router-link>
      </div>
      <a
        class="github"
        href="https://github.com/despair-unreal/blog-v2"
        target="_blank"
      >
        <i class="iconfont icon-github-fill"></i>
        <span>Follow Me</span>
      </a>
    </div>
</template>

<script>
import { mapState,mapMutations } from 'vuex';

export default {
  data(){
    return {
      info: [
        { title: "文章", num: "64", src: "" },
        { title: "标签", num: "90", src: "" },
        { title: "分类", num: "18", src: "" },
      ]
    }
  },
  computed:{
    ...mapState(['infoData'])
  },
  created(){
    this.setInfoData({infoData:this.info});
  },
  methods:{
    ...mapMutations(['setInfoData'])
  }
}
</script>

<style>
.info .author {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.info .author img {
  width: 110px;
  height: 110px;
  object-fit: cover;
  border-radius: 50%;
  transition: all 0.5s;
}
.info .author img:hover {
  transform: rotate(360deg);
}
.info .author h2 {
  margin-top: 10px;
  font-weight: 500;
  font-size: 22px;
}
.info .author p {
  line-height: 1;
  text-align: center;
  word-break: break-all;
}
.info .data {
  display: flex;
  flex-direction: row;
  margin: 24px 0 4px;
}
.info .data a {
  flex-grow: 1;
}
.info .data a p {
  text-align: center;
}
.info .data a p:last-child {
  font-size: 20px;
  margin-top: -6px;
}
.info .github {
  display: block;
  margin-top: 10px;
  background: #1f2d3d;
  color: white;
  line-height: 2.4;
  text-align: center;
  transition: all 1s;
}
.info .github:hover {
  background: #fff;
  color: #1f2d3d;
  box-shadow: 0 3px 8px 3px rgba(150, 150, 150, 0.1);
}
.info .github i {
  padding-right: 10px;
}
</style>