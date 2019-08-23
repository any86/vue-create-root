# vue-create-root [![NPM Version][npm-image]][npm-url] [![NPM Downloads][downloads-image]][downloads-url] [![npm bundle size (minified + gzip)][size-image]][size-url] [![codecov](https://codecov.io/gh/any86/vue-create-root/branch/develop/graph/badge.svg)](https://codecov.io/gh/any86/vue-create-root) [![CircleCI](https://circleci.com/gh/any86/vue-create-root.svg?style=svg)](https://circleci.com/gh/any86/vue-create-root)

[size-image]: https://badgen.net/bundlephobia/minzip/vue-create-root
[size-url]: https://bundlephobia.com/result?p=vue-create-root
[npm-image]: https://img.shields.io/npm/v/vue-create-root.svg
[npm-url]: https://npmjs.org/package/vue-create-root
[downloads-image]: https://badgen.net/npm/dt/vue-create-root
[downloads-url]: https://npmjs.org/package/vue-create-root

:lollipop: 不到1kb的小工具, 生成this.$xxx驱动你的vue组件., 支持**插入组件到任意dom位置**.

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

### 直接使用: this.\$createRoot

初始化后，组件内可以直接使用 **this.\$createRoot** 渲染**任意组件**. [UCom 组件](#ucom-组件)

```javascript

// main.js
    Vue.use(createRoot);

// xxx.vue
    mounted(){
        // 此处UCom为任意组件
        this.$createRoot(UCom);
    }
```

### 或者, 自定义命令: this.\$xxx

```javascript
// main.js
Vue.use(createRoot);

// 此处UCom为任意组件, 用createRootClass包装vue组件
const C = Vue.createRootClass(UCom);

// 此处的args对应vue的props属性
Vue.prototype.$xxx = (...args) => new C(...args);

// xxx.vue
this.$xxx({ content: "你好vue !" });
```

###### UCom 组件

```javascript
export default {
  name: "UCom",
  props: { title: { type: String }, content: { type: String } },
  template: `<article>
                    <h1>{{title}} - <slot name="title"></slot></h1>
                    <p>{{content}} - <slot></slot></p>
                </article>`
};
```

## 更多

[API](docs/API.md)

[更多示例](docs/example.md)

[为什么 Vue.createRootClass 要返回构造函数, 而不是直接生成组件?](docs/why.md)

[:rocket:返回顶部](#vue-create-root-----)
