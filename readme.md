# PreLoader 媒体预加载

可用在单页应用中，预加载较大、较多图片、视频、音频等；

如移动端活动类页项目中常用到大量图片及动画效果，可使用该类库进行提前预载，并展示加载进度条；

## 支持的预加载类型

### 会特殊处理的预加载媒体

`图片`：jpg、png、gif

`视频`：mp4

`音频`：mp3

### 其他类型文件

如js、css、json、html、等，上述白名单中未提到的媒体类型，均使用 `iframe` 进行预加载；

## 使用方法

### 基础使用

以数组的形式将文件路径传入类；

```javascript

new PreLoader([
    './audio/1audio.mp3',
    './css/animate.min.css',
    './images/201672716273.png',
    './images/coin.gif',
    './images/yuantiao.jpg',
    './js/vue.min.js',
    './video/movie.mp4',
])

```

### 使用钩子

`update`：当一个预载完成时触发；

`complete`：预载全部完成时触发；

`error`：当一个预载发生错误时触发，不会打断预载进程，错误的触发作为已预载的一项，若要特殊处理，则在该钩子回调中处理即可；


```javascript

new PreLoader([
    './audio/1audio.mp3',
    './css/animate.min.css',
    './images/201672716273.png',
    './images/coin.gif',
    './images/yuantiao.jpg',
    './js/vue.min.js',
    './video/movie.mp4',
]).update(data => {
    console.log(data);
}).complete(() => {
    console.log('preload complete');
}).error(data => {
    console.warn(data);
});

```

其中update、error钩子的回调函数的参数格式为：

```javascript

{
    complete: 6,                //已完成预载数量
    el: 'image',                //预载媒体类型
    error: 1,                   //预载错误的文件数量，如找不到文件等
    map: {
        ...                     //白名单对象
    }
    path: "./video/movie.mp4",  //当前预载路径
    pending: 0,                 //正在预载的文件数量
    progress: 0.86,             //完成百分比，进度条可根据此变量进行展示
    waiting: 0,                 //尚未预载的文件数量
}

```

## 示例

参考 `./test/index.html`