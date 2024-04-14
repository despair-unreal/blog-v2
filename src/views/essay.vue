<template>
  <div class="card-box padding">
    <main>
      <h1>咸鱼躺.jpg</h1>
      <div class="content">
        <div class="count-refresh">
          <span>34条评论</span>
          <i class="iconfont icon-refresh"></i>
        </div>
        <div class="item" v-for="item in 8" :key="item">
          <div class="time-action">
            <div class="time">
              <span>置顶</span>
              <time title="2023/12/3">2023-12-3</time>
            </div>
            <div class="action">
              <a class="like">
                <i class="iconfont icon-dianzan"></i>
                <span>4</span>
              </a>
              <a class="comment">
                <i class="iconfont icon-pinglun"></i>
                <span>4</span>
              </a>
            </div>
          </div>
          <div class="content">
            <span>
              咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼咸鱼
            </span>
            <svg>
              <defs>
                <linearGradient id="color" gradientTransform="rotate(132deg)">
                  <stop offset="0%" stop-color="#5ddcff" />
                  <stop offset="43%" stop-color="#3c67e3" />
                  <stop offset="100%" stop-color="#4e00c2" />
                </linearGradient>
                <mask id="maskRect">
                  <rect id="rect" width="100%" height="100%" fill="#fff"></rect>
                  <rect
                    id="rect"
                    rx="8"
                    ry="8"
                    x="2"
                    y="2"
                    width="calc(100% - 4px)"
                    fill="#000"
                    height="calc(100% - 4px)"
                  ></rect>
                </mask>
              </defs>
              <g mask="url(#maskRect)">
                <rect id="rect" x="-25%" y="25%" width="150%" height="50%" fill="url(#color)">
                  <animateTransform
                    attributeName="transform"
                    attributeType="XML"
                    type="rotate"
                    from="0"
                    to="360"
                    dur="4s"
                    repeatCount="indefinite"
                  />
                </rect>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </main>
    <pagination></pagination>
  </div>
</template>

<script>
import pagination from '../components/global/Pagination.vue';
export default {
  components: { pagination }
};
</script>

<style scoped>
main h1 {
  font-size: 32px;
}
main .content {
  padding-left: 20px;
  border-left: 2px solid rgba(189, 195, 199, 0.2);
}
main .content > .count-refresh {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40px;
  padding-top: 15px;
}
main > .content > .count-refresh span {
  opacity: 0.4;
}
main > .content > .count-refresh i {
  font-size: 18px;
  cursor: pointer;
  transition: all 0.6s;
}
main > .content > .count-refresh i:hover {
  transform: rotate(360deg);
}
main > .content > .item {
  position: relative;
  padding-left: 10px;
  margin-top: 20px;
}
main > .content > .item::before {
  content: '•';
  position: absolute;
  font-size: 60px;
  left: -20px;
  top: 10px;
  transform: translateX(-50%);
  line-height: 0;
  color: rgba(189, 195, 199, 0.8);
  transition: all 0.4s;
}
main > .content > .item:hover::before {
  -webkit-text-stroke: 4px #4c4948;
}
main > .content > .item:hover > .time-action {
  opacity: 1;
}
main > .content > .item:hover > .content svg {
  opacity: 1;
}
main > .content > .item > .time-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  opacity: 0.5;
  transition: all 0.3s;
}
main > .content > .item > .time-action > .time span {
  color: #f56c6c;
  display: inline-block;
  padding: 0 6px;
  font-size: 12px;
}
main > .content > .item > .time-action > .time time {
  font-size: 12.8px;
}
main > .content > .item > .time-action > .action a {
  margin-left: 10px;
}
main > .content > .item > .time-action > .action a:hover i {
  color: #f56c6c;
}
main > .content > .item > .time-action > .action a span {
  margin-left: 5px;
  cursor: default;
}
main > .content > .item > .time-action > .action a i {
  transition: all 0.3s;
}
main > .content > .item > .time-action > .action a i.icon-pinglun {
  vertical-align: middle;
}
main > .content > .item > .content {
  position: relative;
  margin-top: 10px;
  padding: 20px;
  border-radius: 10px;
  border: 2px solid rgba(212, 212, 212, 0.3);
  background: rgba(212, 212, 212, 0.1);
  transition: all 0.3s;
  overflow: hidden;
}
main > .content > .item > .content svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: all 0.3s;
}
main > .content > .item > .content svg #rect {
  transform-origin: center center;
}
</style>