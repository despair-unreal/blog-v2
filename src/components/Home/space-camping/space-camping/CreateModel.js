import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { WebGL } from "./WebGL.js";
import Stats from 'three/examples/jsm/libs/stats.module.js'

export class CreateModel {
    constructor(canvas) {
        this.canvas = canvas;
        this.dpr = window.devicePixelRatio;
        this.stage = null;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.renderCompileFlag = false;
        this.startRenderFlag = false;
        this.loaded = 0;

        this.clock = new THREE.Clock();
        this.mixer = null;
        this.stats = null;
        
        this.unrealBloomPass = null;
        this.renderPass = null;
        this.bloomComposer = null;

        this.useFinalPassFlag = false;
        this.BLOOM_LAYER = 1;
        this.NORMAL_LAYER = 0;
        this.bloomScene = null;
        this.finalPass = null;
        this.finalComposer = null;
    }
    init(params) {
        const { sceneBg, cameraParams, renderParams, LightParams, showStats} = params;
        this.stage = this.setStage(this.canvas);
        this.scene = this.setScene(sceneBg);
        this.camera = this.setCamera(cameraParams);
        this.controls = this.setControls();
        this.renderer = this.setRender(renderParams);
        this.setLight(LightParams);
        if(showStats)
            this.stats = this.setStats();

    }
    setStats() {
        // 创建性能监视器
        const stats = new Stats()
        // 设置监视器面板，传入面板id（0: fps, 1: ms, 2: mb）
        stats.setMode(0)
        // 设置监视器位置
        stats.domElement.style.position = 'absolute'
        stats.domElement.style.left = '0px'
        stats.domElement.style.top = '0px'
        // 将监视器添加到页面中
        document.body.appendChild(stats.domElement);
        return stats;
    }
    setStage(canvas) {
        const stage = {
            width: canvas.clientWidth,
            height: canvas.clientHeight
        };
        return stage;
    }
    setScene(src) {
        //场景
        const scene = new THREE.Scene();
        if (src) {
            const starfield = new THREE.TextureLoader().load(src, scene.background = starfield);
        } else {
            scene.background = new THREE.Color("black");
        }
        return scene;
    }
    setCamera(params) {
        //透视相机
        // fov — 摄像机视锥体垂直视野角度
        // aspect — 摄像机视锥体长宽比，通常是使用画布的宽/画布的高
        // near — 摄像机视锥体近端面
        // far — 摄像机视锥体远端面
        const camera = new THREE.PerspectiveCamera();
        const { position, aspect = this.stage.width / this.stage.height, fov, near, far } = params;
        if (fov)
            camera.fov = fov;
        if (aspect)
            camera.aspect = aspect;
        if (near)
            camera.near = near;
        if (far)
            camera.far = far;
        if (position) {
            const { x, y, z } = position;
            if (x && y && z)
                camera.position.set(x, y, z);
        }
        camera.updateProjectionMatrix();
        return camera;
    }
    setControls() {
        //轨道控制器
        const controls = new OrbitControls(this.camera, this.canvas);
        //启动阻尼，给控制器带来重量感
        controls.enableDamping = true;
        return controls;
    }
    setRender(params) {
        //渲染器
        const renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
        //使用物理上正确的光照模式
        renderer.useLegacyLights = false;
        //定义渲染器是否在渲染每一帧之前自动清除其输出
        renderer.autoClear = false;
        //设置设备像素比。通常用于避免HiDPI设备上绘图模糊
        renderer.setPixelRatio(this.dpr);
        //将输出canvas的大小调整为(width, height)并考虑设备像素比，且将视口从(0, 0)开始调整到适合大小
        //并且禁止对canvas的style做出更改
        renderer.setSize(this.stage.width, this.stage.height, false);
        if (params) {
            const { toneMapping, toneMappingExposure, outputEncoding } = params;
            //标准
            if (toneMapping)
                renderer.toneMapping = this.getToneMapping(toneMapping);
            //曝光
            if (toneMappingExposure)
                renderer.toneMappingExposure = toneMappingExposure;
            //定义渲染器的输出编码
            renderer.outputEncoding = this.getOutputEncoding(outputEncoding);
        }
        return renderer;
    }
    getToneMapping(toneMapping) {
        switch (toneMapping) {
            case "ReinhardToneMapping":
                return THREE.ReinhardToneMapping;
            case "ACESFilmicToneMapping":
                return THREE.ACESFilmicToneMapping;
            case "CineonToneMapping":
                return THREE.CineonToneMapping;
            case "LinearToneMapping":
                return THREE.CineonToneMapping;
            case "NoToneMapping":
            default:
                return THREE.NoToneMapping;
        }
    }
    getOutputEncoding(outputEncoding) {
        switch (outputEncoding) {
            case "sRGBEncoding":
                return THREE.sRGBEncoding;
            case "BasicDepthPacking":
                return THREE.BasicDepthPacking;
            case "RGBADepthPacking":
                return THREE.RGBADepthPacking;
            case "LinearEncoding":
            default:
                return THREE.LinearEncoding;
        }
    }
    setLight(params) {
        //点光源 火堆 0xff5900 0x080820 0xffeeb1
        const pointLight = new THREE.PointLight();
        const { pointLightParams, ambientlightParams } = params;
        if (pointLightParams) {
            const { position } = pointLightParams;
            const { color, intensity, distance, decay } = pointLightParams;
            if (color)
                pointLight.color = new THREE.Color(color);
            if (intensity)
                pointLight.intensity = intensity;
            if (distance)
                pointLight.distance = distance;
            if (decay)
                pointLight.decay = decay;
            if (position) {
                const { x, y, z } = position;
                if (x && y && z)
                    pointLight.position.set(x, y, z);
            }
        }
        this.scene.add(pointLight);

        //环境光
        const ambientlight = new THREE.AmbientLight();
        if (ambientlightParams) {
            const { color, intensity } = ambientlightParams;
            if (color)
                ambientlight.color = new THREE.Color(color);
            if (intensity)
                ambientlight.intensity = intensity;
        }
        this.scene.add(ambientlight);
    }
    setModels(src) {
        const gltfLoader = new GLTFLoader();
        const seneUrl = src;
        gltfLoader.load(
            seneUrl,
            (gltf) => {
                let models = gltf.scene;
                //修改材质
                this.modifyMaterial(models);
                //设置动画
                this.mixer = this.setAnimation(gltf);
                //把模型添加进场景
                this.scene.add(models);
                //预编译场景
                this.renderer.compile(this.scene,this.camera);
                this.renderCompileFlag = true;
            },
            // called while loading is progressing
            (xhr)=>{
                this.loaded = (xhr.loaded / xhr.total) * 100;
            },
            // called when loading has errors
            function (error) {
                console.log(error, "An error happened");
            }
        );
    }
    getModelsLoaded(){
        return this.loaded;
    }
    setAnimation(models) {
        const mixer = new THREE.AnimationMixer(models.scene);
        const clips = models.animations[0];
        mixer.clipAction(clips).play();
        return mixer;
    }
    modifyMaterial(models) {
        //地面
        const ground = models.getObjectByName("Object_6");
        //获取地面的贴图
        const moon_baseColor = ground.material.map;
        //给地面设置一个自发光
        ground.material.emissiveMap = moon_baseColor;
        //将（emissive）自发光的rgb值设为1,1,1
        ground.material.emissive.setScalar(1);
        ground.material.emissiveIntensity = 1;
        //重新编译材质
        ground.material.needsUpdate = true;

        //火光
        const fire = models.getObjectByName("mesh_17");
        fire.material.opacity = 0.8;
        fire.material.needsUpdate = true;

        //蓝光
        const spaceglow = models.getObjectByName("Object_44");
        spaceglow.material.opacity = 0.8;
        spaceglow.material.needsUpdate = true;

        //夜空
        const sky = models.getObjectByName("Object_4");
        //解决纹理闪烁问题
        sky.material.depthWrite = false;
        sky.material.needsUpdate = true;

        //局部辉光
        if (this.useFinalPassFlag) {
            models.traverse((child) => {
                child.layers.enable(this.BLOOM_LAYER);
            });
            spaceglow.layers.set(this.NORMAL_LAYER);
        }
    }
    initEffect(unrealBloomPassParams) {
        this.renderPass = this.setRenderPass();
        this.unrealBloomPass = this.setUnrealBloomPass(unrealBloomPassParams);
        this.bloomComposer = this.setBloomComposer(!this.useFinalPassFlag);
        if (this.useFinalPassFlag) {
            this.bloomScene = this.setBloomScene();
            this.finalPass = this.setFinalPass();
            this.finalComposer = this.setFinalComposer();
        }
    }
    setRenderPass() {
        //渲染通道
        const renderPass = new RenderPass(this.scene, this.camera);
        return renderPass;
    }
    setUnrealBloomPass(params) {
        //辉光通道 增强场景中明亮的区域 近于Unreal3D引擎的Bloom效果
        const unrealBloomPass = new UnrealBloomPass(new THREE.Vector2(this.stage.width, this.stage.height));
        if (params) {
            const { strength, radius, threshold } = params;
            if (strength)
                unrealBloomPass.strength = strength;
            if (radius)
                unrealBloomPass.radius = radius;
            if (threshold)
                unrealBloomPass.threshold = threshold;
        }
        /* //可以进一步减缓色带问题 
        unrealBloomPass.renderTargetsHorizontal.forEach(element => {
            element.texture.type = THREE.FloatType;
        });
        unrealBloomPass.renderTargetsVertical.forEach(element => {
            element.texture.type = THREE.FloatType;
        }); */
        return unrealBloomPass;
    }
    setBloomComposer(renderToScreen) {
        // 预定义渲染目标 
        // 减缓色带问题
        // 让finalPass的ShaderMaterial的bloomTexture的encoding跟renderer一致
        const renderTarget = new THREE.WebGLRenderTarget(
            this.stage.width, this.stage.height,
            { type: THREE.FloatType, encoding: this.renderer.outputEncoding }
        );

        //辉光合成器 效果组合器
        const bloomComposer = new EffectComposer(this.renderer, renderTarget);
        bloomComposer.renderToScreen = renderToScreen;
        bloomComposer.setPixelRatio(this.dpr);
        bloomComposer.setSize(this.stage.width, this.stage.height);
        bloomComposer.addPass(this.renderPass);
        bloomComposer.addPass(this.unrealBloomPass);
        return bloomComposer;
    }
    setBloomScene() {
        const bloomScene = new THREE.Layers();
        bloomScene.set(this.BLOOM_LAYER);
        return bloomScene;
    }
    setFinalPass() {
        const ShaderMaterial = new THREE.ShaderMaterial({
            uniforms: {
                baseTexture: { value: null },
                bloomTexture: { value: this.bloomComposer.renderTarget2.texture },
            },
            vertexShader: WebGL.VERTEX_SHADER,
            fragmentShader: WebGL.FRAGMENT_SHADER,
            defines: {},
        })
        //最终通道
        const finalPass = new ShaderPass(ShaderMaterial, "baseTexture");
        //渲染结果交换到屏幕上
        finalPass.needsSwap = true;
        return finalPass;
    }
    setFinalComposer() {
        // 预定义渲染目标
        const renderTarget = new THREE.WebGLRenderTarget(
            this.stage.width, this.stage.height,
            { encoding: this.renderer.outputEncoding }
        );
        //最终合成器
        const finalComposer = new EffectComposer(this.renderer, renderTarget);
        finalComposer.addPass(this.renderPass);
        finalComposer.addPass(this.finalPass);

        return finalComposer;
    }
    //渲染
    animate() {
        //更新控制器
        this.controls.update();
        // 渲染器清除颜色、深度或模板缓存. 此方法将颜色缓存初始化为当前颜色
        this.renderer.clear();
        //更新帧数
        if(this.stats)
            this.stats.update();
        //动画
        if (this.mixer) {
            const deltaSeconds = this.clock.getDelta()
            this.mixer.update(deltaSeconds);
        }
        if(this.renderCompileFlag && this.startRenderFlag){
            //局部辉光
            if (!this.useFinalPassFlag) {
                this.renderer.clearDepth();
                this.bloomComposer.render();
            } else {
                //非辉光的部分先变黑
                this.scene.traverse(this.darkenMaterial.bind(this));
                //渲染辉光合成器
                this.bloomComposer.render();
                //还原非辉光的材质
                this.scene.traverse(this.restoreMaterial.bind(this));
                //清除深度缓存
                this.renderer.clearDepth();
                //渲染最终合成器
                this.finalComposer.render();
            }
        }
        requestAnimationFrame(this.animate.bind(this));
    }
    setSize() {
        //设置设备像素比。通常用于避免HiDPI设备上绘图模糊
        this.renderer.setPixelRatio(this.dpr);
        this.bloomComposer.setPixelRatio(this.dpr);
        //将输出canvas的大小调整为(width, height)并考虑设备像素比，且将视口从(0, 0)开始调整到适合大小
        this.renderer.setSize(this.stage.width, this.stage.height, false);
        this.bloomComposer.setSize(this.stage.width, this.stage.height, false);
        if (this.useFinalPassFlag) {
            this.finalComposer.setPixelRatio(this.dpr);
            this.finalComposer.setSize(this.stage.width, this.stage.height, false);
        }
    }
    resize() {
        //更新画布大小（css）
        this.stage = this.setStage(this.canvas);
        //更新渲染的canvas的width与height属性
        this.setSize();
        //更新摄像机视锥体的长宽比
        this.camera.aspect = this.stage.width / this.stage.height;
        //更新摄像机投影矩阵
        this.camera.updateProjectionMatrix();
    }
    //非辉光材质颜色设置黑色
    darkenMaterial(obj) {
        const material = obj.material;
        //传入的对象与辉光对象是否属于相同的一组图层
        if (material) {
            if (!this.bloomScene.test(obj.layers)) {
                obj.originalMaterial = material;
                const Proto = Object.getPrototypeOf(material).constructor;
                obj.material = new Proto({ color: 0x000000 });
            }
        }

    }
    //还原材质
    restoreMaterial(obj) {
        if (!obj.originalMaterial) return;
        obj.material = obj.originalMaterial;
        delete obj.originalMaterial;
    }
}