# vue-create-root [![NPM Version][npm-image]][npm-url] [![NPM Downloads][downloads-image]][downloads-url] [![npm bundle size (minified + gzip)][size-image]][size-url] [![codecov](https://codecov.io/gh/any86/vue-create-root/branch/develop/graph/badge.svg)](https://codecov.io/gh/any86/vue-create-root) [![CircleCI](https://circleci.com/gh/any86/vue-create-root.svg?style=svg)](https://circleci.com/gh/any86/vue-create-root)

[size-image]: https://badgen.net/bundlephobia/minzip/vue-create-root
[size-url]: https://bundlephobia.com/result?p=vue-create-root
[npm-image]: https://img.shields.io/npm/v/vue-create-root.svg
[npm-url]: https://npmjs.org/package/vue-create-root
[downloads-image]: https://badgen.net/npm/dt/vue-create-root
[downloads-url]: https://npmjs.org/package/vue-create-root

:lollipop: 不到1kb的小工具, 把任意vue组件**插入到任意dom位置**, 默认`<body>`尾部.

![](https://user-images.githubusercontent.com/8264787/63213406-99901300-c13e-11e9-94e6-839b4125e881.png)

## 实际意义
把一些"**大尺寸的组件**"放到`<body>`尾部, 防止父元素使用`overflow:hidden`而导致组件显示不全.


## 安装

```shell
npm i -S vue-create-root
```

## cdn

```
https://unpkg.com/vue-create-root/dist/vue-create-root.umd.js
```

## 快速开始
下面把**Test**组件插入到`<body>`尾部.

### main.js
```javascript
import createRoot from 'vue-create-root';
Vue.use(createRoot);
```

### Test.vue
```javascript
export default{
    props:['value'],
    template: `<h1>{{value}}</h1>`
}
```

### App.vue
```javascript
import Test from '../Test.vue';
export default{
    mounted(){
        // 默认组件会被插入到<body>尾部
        this.$createRoot(Test, {value:'hello vue!'});
    }
}
```



## API

### $createRoot(tag, data, child,  options)
第3,4个参数选填, options的默认值为:`{ target = 'body', insertPosition = 'append' }`

**\$createRoot**的核心代码依赖于**Vue.prototype.\$createElement**, 所以`tag, data, child`参数就是`$createElement`的参数, 具体使用方法可以参考[Vue文档](https://cn.vuejs.org/v2/guide/render-function.html#createElement-%E5%8F%82%E6%95%B0)


`target`是目标元素的选择器, `insertPosition`有4个值, `append`代表插入到元素(**\<body\>**)尾部, 其他参数:
- beforebegin: 在该元素本身的前面.
- afterbegin:只在该元素当中, 在该元素第一个子孩子前面.
- beforeend:只在该元素当中, 在该元素最后一个子孩子后面.
- afterend: 在该元素本身的后面.

### 简写
如果`$createRoot`的第2个参数只传入`props`属性, 那么可以简写:
```javascript
this.$createRoot(Test, {value:'hello vue!'});
// 完整写法
this.$createRoot(Test, {props:{value:'hello vue!'}});
```

### 返回值
`$createRoot(Test)`返回一个vue根实例(非Test实例), VueCreateRoot在根实例上定义了2个方法:`$update`和`$destroy`.

### $update(data,child)

\$update用来更新**Test**组件(传入的组件), `data,child`同`$createRoot`的`data,child`.
```javascript
const i = this.$createRoot(Test);
i.$update({value:'我变了!'});
```

### $destroy
$destroy用来销毁`$createRoot`创建的根实例, 如:
```javascript
const i = this.$createRoot(Test);

i.$destroy({value:'我变了!'});
```


## 进阶使用

### 自定义`this.$alert`
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
