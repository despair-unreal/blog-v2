<template>
  <div id="container">
    <router-view id="main-content" />
    <sidebar id="sidebar"></sidebar>
  </div>
</template>

<script>
import sidebar from './sidebar.vue'
export default {
  components:{
    sidebar
  }
};
</script>

<style>
#container {
  padding: 40px 15px;
  padding-top: calc(70px + 40px);
  min-height: 100vh;
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
}
#container>*{
  transition: all .3s;
}
#main-content{
  width: 75%;
}
#sidebar{
  width: 25%;
  padding-left: 15px;
}
@media screen and (max-width:900px){
  #container{
    flex-direction: column;
  }
  #main-content{
    width: 100% !important;
  }
  #sidebar{
    width: 100% !important;
    margin-top: 20px;
    padding-left: 0px;
  }
}
</style>