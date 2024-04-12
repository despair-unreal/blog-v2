<!-- 分享文章链接 -->
<template>
  <div class="share">
    <a class="btn" target="_blank">
      <Icon icon="qq" extraClass="qq"></Icon>
    </a>
    <a class="btn" target="_blank">
      <Icon icon="wechat" extraClass="wechat"></Icon>
    </a>
    <a class="btn" target="_blank">
      <Icon icon="weibo" extraClass="weibo"></Icon>
    </a>
    <a class="btn" target="_blank">
      <Icon icon="link" extraClass="link"></Icon>
    </a>
  </div>
</template>

<script>
export default {};
</script>
<style lang='scss' scoped>
$darkGray: $font-2;
$btnColor: (
  qq: #56b6e7,
  wechat: #7bc549,
  weibo: #ff763b,
  link: $darkGray
);
$transition: all 0.6s ease-in-out 0s;
.share {
  margin-left: auto;
  .btn {
    display: block;
    float: left;
    margin: 8px 4px;
    font-size: 14px;
    border: 1px solid $darkGray {
      radius: 50%;
    }
    width: 26.4px;
    height: 26.4px;
    line-height: 26.4px;
    text-align: center;
    transition: $transition;
    .link {
      font-weight: bolder;
    }
    @each $name, $color in $btnColor {
      ::v-deep .#{$name} {
        color: $color;
        transition: $transition;
      }
      &:hover {
        ::v-deep .#{$name} {
          color: #fff;
        }
        &:has(.#{$name}) {
          border-color: $color;
          background: $color;
        }
      }
    }
  }
}
</style>