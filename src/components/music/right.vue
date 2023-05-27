<template>
  <div class="right">
    <div class="info">
      <div class="disc-cover">
        <div class="CD">
           <img
            class="disc"
            src="~@/assets/images/music/placeholder_disk_play_song.png"
          />
            <img
            class="cover"
            src="~@/assets/images/music/music_defaultCD.jpg"
            />
        </div>
        <img class="needle" src="~@/assets/images/music/needle-ip6.png" />
        <img class="bag"></img>
      </div>
      <p>歌曲名：雪</p>
      <p>歌手名：送</p>
      <p>专辑名：是</p>
    </div>
    <div class="lyric">
      <span>暂无歌词</span>
    </div>
    <div class="other">
      本页面接口源自<a href="https://github.com/Binaryify/NeteaseCloudMusicApi"
        >NeteaseCloudMusicApi</a
      >
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.right {
  display: flex;
  flex-direction: column;
  width: 300px;
  height: 100%;
  margin-left: 10px;
  text-align: center;
}
@media (max-width: 960px) {
  .right {
    display: none;
  }
}
.other {
  font-size: 12px;
}
.info .disc-cover {
  position: relative;
  width: 246px;
  height: 172px;
  margin: 0 auto;
  margin-bottom: 15px;
}
.info .disc-cover::before {
  content: "";
  position: absolute;
  top: 0;
  left: 129px;
  display: block;
  background: radial-gradient(
    86px at right,
    transparent 50%,
    rgba(255, 255, 255, 0.3) 50%
  );
  height: 100%;
  width: 43px;
  z-index: 2;
}
.info .disc-cover::after {
  content: "";
  position: absolute;
  display: block;
  background: rgba(255, 255, 255, 0.3);
  height: 100%;
  width: 129px;
}
.info .disc-cover img.bag {
  display: inline-block;
  position: absolute;
  top: 6px;
  left: 6px;
  background: url(~@/assets/images/music/music_defaultCD.jpg) center/cover;
  height: calc(100% - 12px);
  width: 162px;
}
.info .disc-cover img.disc {
  position: absolute;
  top: 6px;
  left: 86px;
  height: calc(100% - 12px);
  border-radius: 50%;
}
.info .disc-cover img.cover {
  position: absolute;
  top: 50%;
  left: 108px;
  height: 118px;
  width: 118px;
  border-radius: 50%;
  transform: translateY(-50%);
  object-fit: cover;
}
.info .disc-cover img.needle {
  position: absolute;
  top: 14px;
  right: -72px;
  width: 58px;
  transform-origin: top center;
  transform: rotate(28deg); 
  /* transform: rotate(50deg);  */
}
.lyric {
  flex-grow: 1;
}
.lyric > span {
  position: relative;
  top: calc(50% - 10px);
}
</style>