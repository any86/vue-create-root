# vue-create-root [![NPM Version][npm-image]][npm-url] [![NPM Downloads][downloads-image]][downloads-url] [![npm bundle size (minified + gzip)][size-image]][size-url] [![codecov](https://codecov.io/gh/any86/vue-create-root/branch/develop/graph/badge.svg)](https://codecov.io/gh/any86/vue-create-root) [![CircleCI](https://circleci.com/gh/any86/vue-create-root.svg?style=svg)](https://circleci.com/gh/any86/vue-create-root)

[size-image]: https://badgen.net/bundlephobia/minzip/vue-create-root
[size-url]: https://bundlephobia.com/result?p=vue-create-root
[npm-image]: https://img.shields.io/npm/v/vue-create-root.svg
[npm-url]: https://npmjs.org/package/vue-create-root
[downloads-image]: https://badgen.net/npm/dt/vue-create-root
[downloads-url]: https://npmjs.org/package/vue-create-root

:lollipop: 不到1kb的小工具, 把vue组件变成this.$xxx命令, 支持**插入组件到任意dom位置**.

![](https://user-images.githubusercontent.com/8264787/63213406-99901300-c13e-11e9-94e6-839b4125e881.png)



## 安装

```shell
npm i -S vue-create-root
```

## cdn

```
https://unpkg.com/vue-create-root/dist/vue-create-root.umd.js
```

## 快速开始


初始化后，组件内可以直接使用 **this.\$createRoot** 渲染**任意组件**.

```javascript
// main.js
Vue.use(createRoot);

// xxx.vue
import UCom from '../UCom.vue';
{
    mounted(){
        // 默认组件被插入到<body>尾部
        this.$createRoot(UCom, {props: {value:'hello vue!'}});
        // 或者简写为:
        this.$createRoot(UCom, {value:'hello vue!'});
    }
}

```

## 自定义命令: this.\$xxx
你可以定义任意命令类似**饿了么UI**, 比如`this.$alert` / `this.$Message.success`

```javascript
// main.js
// 初始化插件, 把createRootClass方法挂到Vue上
Vue.use(createRoot);

// 包装组件
const C = Vue.createRootClass(UCom);

// 定义this.$alert命令
// props对应组件的props属性
Vue.prototype.$alert = (props) => new C(props);
```

```javascript
// xxx.vue
this.$alert({isShow:true, content: "你好vue !"});
```
**注意**: 这里设计`Vue.createRootClass(UCom)`的意图是为了实现单/多例2种API, 比如上面的C的多例用法就是`new C()`, 而单例就是`C.init()`.

## 更多

[API](docs/API.md)

[更多示例](docs/example.md)

[为什么 Vue.createRootClass 要返回构造函数, 而不是直接生成组件?](docs/why.md)

[:rocket:返回顶部](#vue-create-root-----)
