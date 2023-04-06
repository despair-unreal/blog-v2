<template>
  <div id="container">
    <router-view id="main-content" />
    <div id="sidebar">this is aside nav</div>
  </div>
</template>

<script>
export default {};
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
#main-content{
  width: 75%;
}
#sidebar{
  width: 25%;
  height: 100%;
  padding-left: 15px;
  border: 1px solid black;
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
  }
}
</style>