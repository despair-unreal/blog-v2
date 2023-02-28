import anime from "animejs";
export class Circle {
    constructor(startR, endR) {
      this.radius = startR;
      this.animeR = null;
      this.startR = startR;
      this.endR = endR;
    }
    setAnime(onComplete) {
      this.animeR = anime({
        targets: this,
        radius: [this.startR, this.endR],
        easing: "linear",
        duration: 1000,
        complete: onComplete,
      });
    }
    render(stage, ctx, that, bgImg) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(stage.width / 2, stage.height / 2, this.radius, 0, 2 * Math.PI);
      ctx.clip();
      that.$parent.drawFullImg(bgImg, ctx, stage);
      ctx.restore();
    }
  }