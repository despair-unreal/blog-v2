<!-- 页面目录-->
<template>
  <div id="home">
    <sectionOne></sectionOne>
  </div>
</template>

<script>
import sectionOne from "../components/Home/section-one.vue";
export default {
  name:"home",
  components:{
    sectionOne
  }
};
</script>
<style>
#home > * {
	height: 100vh;
	width: 100vw;
}
body,html{
  font-size: calc(100vw / 120);
}
</style>
