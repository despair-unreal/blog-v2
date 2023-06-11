<template>
  <div>
    <div id="mask" :class="{'close':!openrightnav}" @click="closeRightNav"></div>
    <div id="container" :class="[{'close':!openrightnav},'sidebar']">
      <info></info>
      <div class="menus card-box">
        <router-link :to="item.src" v-for="item in rightMenus" :key="item.name">
          <i :class="[item.icon, 'iconfont']"></i>
          <span>{{ item.name }}</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import info from "./sidebar/info.vue";

export default {
  components: { info },
  props: ["rightMenus","openrightnav"],
  methods:{
    closeRightNav:function () {
      this.$emit("closeRightNav");
    }
  }
};
</script>

<style scoped>
#mask {
  opacity: 0.8;
}
#mask.close{
  opacity: 0;
  pointer-events: none;
}
#container {
  position: fixed;
  top: 0;
  right: 0;
  padding: 20px;
  width: 280px;
  height: 100%;
  background: #f6f8fa;
  overflow-x: hidden;
  overflow-y: auto;
  transition: all 0.5s;
}
#container.close{
  right: -280px;
}
#container::-webkit-scrollbar {
  display: none;
}
#container .menus a {
  display: block;
  font-size: 16px;
  padding: 12px 0;
  text-align: center;
  transition: all .4s;
}
#container .menus a i {
  padding-right: 10px;
  transition: padding .4s;
}
#container .menus a:hover{
  color: #fff;
  background: #1f2d3d;
}
#container .menus a:hover i{
  padding-right: 18px;
}
</style>