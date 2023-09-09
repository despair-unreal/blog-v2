export class imageGassBlur {
  // imageData为canvas的getImageData返回的图像数据
  // radius为模糊半径
  constructor(imageData, radius = 30) {
    const { height, width, data } = imageData;
    this.height = height;
    this.width = width;
    this.pixes = new Uint8ClampedArray(data);
    this.imageData = imageData;
    this.radius = Math.floor(radius);
    this.gaussMatrix = null;
  }
  // 计算高斯矩阵
  setGaussMatrix() {
    const sigma = this.radius / 3;
    const n1 = 1 / (sigma * Math.sqrt(2 * Math.PI));
    const n2 = -1 / (2 * Math.pow(sigma, 2));
    const gauss = [];
    let gaussSum = 0;
    for (let i = -this.radius; i <= this.radius; i++) {
      const g = n1 * Math.exp(n2 * i * i);
      gaussSum += g;
      gauss.push(n1 * Math.exp(n2 * i * i));
    }
    // 归一化
    this.gaussMatrix = gauss.map((value) => value / gaussSum);
  }
  // 卷积
  gassBlur(direction = 'horizontal') {
    this.setGaussMatrix();
    const outerLimit = direction === 'horizontal' ? this.height : this.width;
    const innerLimit = direction === 'horizontal' ? this.width : this.height;
    for (let outer = 0; outer < outerLimit; outer++) {
      for (let inner = 0; inner < innerLimit; inner++) {
        let r = 0,
          g = 0,
          b = 0,
          a = 0;
        // x水平方向遍历像素点 外部for为y; y垂直方向则外部for为x
        const y = direction === 'horizontal' ? outer : inner;
        const x = direction === 'horizontal' ? inner : outer;
        for (let i = -this.radius; i <= this.radius; i++) {
          // 像素相对坐标
          let indexR = inner + i;
          // 保证所取像素点在范围内
          if (indexR < 0 || indexR >= innerLimit) {
            indexR = inner - i;
          }
          const x1 = direction === 'horizontal' ? indexR : x;
          const y1 = direction === 'horizontal' ? y : indexR;
          // 当前像素的r下标即为当前像素点前边所有r，g，b，a的个数
          // 每个像素点都有四个值(rgba),imageData像素点数据是从左到右从上到下排列
          // 让每个点的rgba乘以自己的权重值
          const indexA = (y1 * this.width + x1) * 4;
          const w = this.gaussMatrix[i + this.radius];
          r += this.pixes[indexA] * w;
          g += this.pixes[indexA + 1] * w;
          b += this.pixes[indexA + 2] * w;
          a += this.pixes[indexA + 3] * w;
        }
        const offset = (y * this.width + x) * 4;
        this.imageData.data.set([r, g, b, a], offset);
      }
    }
  }
  // 用来获取imageData数据
  getImageData(img) {
    this.bgCanvas.copyCtx.clearRect(0, 0, this.bgCanvas.width, this.bgCanvas.height);
    this.bgCanvas.copyCtx.drawImage(img, ...this.getDrawImageCoverParameter(img));
    // 提取图像数据
    const imageData = this.bgCanvas.copyCtx.getImageData(0, 0, this.bgCanvas.width, this.bgCanvas.height);
    return imageData;
  }
  getGaussBlurImageData() {
    // x水平方向
    this.gassBlur('horizontal');
    this.pixes.set(this.imageData.data);
    // y垂直方向
    this.gassBlur('vertical');
    // 利用this.bgCanvas.context.putImageData(newImg, 0, 0);就可以画出图像了
    return this.imageData;
  }

}
