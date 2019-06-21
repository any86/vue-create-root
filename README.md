# vue-create-root   [![NPM Version][npm-image]][npm-url] [![NPM Downloads][downloads-image]][downloads-url] [![npm bundle size (minified + gzip)][size-image]][size-url] [![codecov](https://codecov.io/gh/any86/vue-create-root/branch/develop/graph/badge.svg)](https://codecov.io/gh/any86/vue-create-root)  [![CircleCI](https://circleci.com/gh/any86/vue-create-root.svg?style=svg)](https://circleci.com/gh/any86/vue-create-root)

[size-image]: https://img.shields.io/bundlephobia/minzip/vue-create-root.svg
[size-url]: https://bundlephobia.com/result?p=vue-create-root
[npm-image]: https://img.shields.io/npm/v/vue-create-root.svg
[npm-url]: https://npmjs.org/package/vue-create-root

[downloads-image]: https://img.shields.io/npm/dm/vue-create-root.svg
[downloads-url]: https://npmjs.org/package/vue-create-root


![](https://ws1.sinaimg.cn/large/005IQkzXly1g40fdqbmikj30m407udfy.jpg)

## 导航
[快速开始](#示例)
[API](#API)
[更多示例](#更多示例)


## 安装 
```shell
npm i -S vue-create-root
```

## cdn
```
https://unpkg.com/vue-create-root/dist/vue-create-root.umd.js
```

## 示例

### 默认命令
初始化后，组件内可以用 **this.$createRoot** 渲染组件. [UCom组件](#ucom组件)
```javascript

// main.js中初始化
Vue.use(createRoot);

// xxx.vue
mounted(){
    // 此处UCom为任意组件
    this.$createRoot(UCom);
}
```


### 自定义命令: this.$alert
```javascript
// main.js中初始化
Vue.use(createRoot);

// 此处UCom为任意组件
const C = Vue.createRootClass(UCom);

// 注意此处的new C, 单例模式是C.init
Vue.prototype.$alert = (...args) => new C(...args);

// xxx.vue
this.$alert({content: '你好vue !'});
```

### UCom组件
``` javascript
// UCom.vue
export default {
    name: 'UCom',
    props: {
        title: {
            type: String,
        },
        content: {
            type: String,
        }
    },
    template: `<article>
                    <h1>{{title}}
                        <small><slot name="title"></slot></small>
                    </h1>
                    <p>{{content}}</p>
                    <p><slot></slot></p>
                </article>`
}
```
## API

### Vue.createRootClass
返回**生成组件的构造函数**, 通过初始化构造函数来渲染组件, 别名**Vue.createRoot** .
###### 函数签名: (component:Object, options:Object)=> Function
|名称|数据类型|说明|
|---|---|---|
|component|Object|vue组件|
|options|Object|target: 目标元素,默认'body', <br> insertPosition: 插入位置,包含值:'append' /  'prepend' / 'insertBefore' / 'insertAfter', 默认'append' <br> |

```javascript
// 默认插入到body尾部
const A = Vue.createRootClass(UCom);

// 插入到#container元素的头部
const B = Vue.createRootClass(UCom, {target: '#container', insertPositon: 'prepend'});

// 插入到#container元素的前面
const C = Vue.createRoot(UCom, {target: '#container', insertPositon: 'insertBefore'});

// 插入到#container元素的后面
const D = Vue.createRoot(UCom, {target: '#container', insertPositon: 'insertAfter'});

// ABCD都是构造函数
// 开始渲染组件
new A();
new B({content: 'xxx'});

// 以单例模式渲染
C.init();
D.init({content: 'xxx'});
```
**注意**:  再次强调下, Vue.createRootClass并**不生成组件**, 而是返回**生成组件的构造函数**. 


#### Vue.createRootClass返回的构造函数有哪些方法?

:seedling: 我给这个返回的构造函数起个名字叫**CreateRootClass**.

##### CreateRootClass.constructor( options:Object, childrenRender:Function )=> this

用来生成组件, 可以指定组件在dom中的位置.

|名称|数据类型|说明|
|---|---|---|
|options|Object|vue的VNodeData类型, 如果只包含props的设置, 可以省略props,<br> 如: A({props: {a:1}}) 等价 A({a:1}).
|childrenRender|Function|就是vue的render函数, 主要用来渲染插槽内的子组件, 具体用法请查看[Vue文档](https://cn.vuejs.org/v2/guide/render-function.html#createElement-%E5%8F%82%E6%95%B0)|

```javascript
const A = Vue.createRootClass(UCom);
Vue.prototype.$abc = (...args)=> new A(...args, h=>h('p', '我在默认插槽内!'));
```


##### CreateRootClass.init( options:Object, childrenRender:Function )=> this
功能及参数同CreateRootClass.constructor, 但是他渲染出的组件是**单例**模式, 也就是**不论init多少次, 都只会渲染同一个组件**.
```javascript
const C = Vue.createRootClass(UCom);
Vue.prototype.$abc = (...args)=> C.init(...args, h=>h('p', '我在默认插槽内!'));
```

##### CreateRootClass.$update( options:Object, childrenRender:Function )=> this
更新组件数据, 参数同**CreateRootClass.constructor**.
```javascript
const C = Vue.createRootClass(UCom);
C.$update({content: '内容更新了'}, h=>h('p', '我在默认插槽内!'));
```


##### CreateRootClass.$destroy()
销毁组件, 无论是否单例模式都通过$destroy方法销毁.
```javascript
const C = Vue.createRootClass(UCom);
C.$destroy();
```


### $createRoot
在任意组件内可以通过this.$createRoot渲染组件到任意位置.
###### $createRoot(data: object, childrenRender: function, options: object)=> object
前2个参数同**CreateRootClass.constructor**, 第三个参数同**Vue.createRoot**的options, 主要用来控制组件插入位置



## 更多示例

[监听事件(\$on)](#监听事件on)

[单例模式(init)](#单例模式init)

[this.\$Message.success](#thismessagesuccess)

[渲染插槽内容(childrenRender)](#渲染插槽内容childrenrender)

[$createRoot改名](#createroot改名)

[销毁(\$destroy)](#销毁destroy)


### 监听事件($on)

\$createRoot运行后返回vue实例, 所以我们可以用实例上的$on方法监听组件内部事件.

```javascript
// xxx.vue
const root = this.$createRoot(UCom, {xxx:'xxx'});
root.$on('show', ev=>{
    // code ...
});

root.$on('hide', ev=>{
    // code ...
});

// 如果愿意也可以连续的$on
root.$on('show', ev=>{
    // code ...
}).$on('hide', ev=>{
    // code ...
});



// 我们自定义的命令也一样
this.$alert().$on('show', ()=>{
    // code ...
});
```

### 单例模式(init)
无论多少次调用, 都只渲染同一组件.
```javascript
// main.js
Vue.use(CreateRoot)
const C = Vue.createRootClass(UCom);

// 注意, 单例模式使用C上的init渲染
Vue.prototype.$loading = (text)=> C.init({value: text});

// xxx.vue
// 页面上只会显示一个loading, 显示"你好ts"
this.$loading({value: '正在加载js'});
this.$loading({value: '正在加载ts'});
```
**注意**: 看到这您可能发现了**this.$createRoot**生成的实例**不支持单例**,  这是因为设计他的目的仅仅是为了组件内的某一次临时调用, 如需要复请用**Vue.createRootClass**在**main.js**中生成.

### 渲染插槽内容(childrenRender)
其实就是vue的render函数, 更多render的用法请看官网: https://cn.vuejs.org/v2/guide/render-function.html#深入-data-对象
```javascript
// main.js
Vue.use(CreateRoot)
const B = Vue.createRootClass(UCom);

// 建立$alert
Vue.prototype.$alert = (...args)=> new B(...args);

// xxx.vue
this.$alert({value: '我有2个插槽哦: title和content'}, h=>
    [
        h('h1', {attrs: 
            {align: 'center', slot: 'title'}
        }, '我是标题'),
        
        h('p','我是内容')
    ]
);
```
### this.$Message.success
想要类似"饿了么 / iView"那种 this.$Message.success()?
```javascript
// main.js
const C = Vue.createRootClass(UCom);
Vue.prototype.$Message = {
    success: new C()
};

// xxx.vue
this.$Message.success({value: '你好vue!'});
```

### $createRoot改名
如果嫌名字太长, 可以通过**Vue.use**传入a**s**参数
```javascript
// main.js
Vue.use(createRoot, {as: {$createRoot: '$cRoot'}});

// xxx.vue
this.$cRoot(UCom);
```

### 销毁($destroy)

#### 单例
单例就很简单了, 直接$destroy().
```javascript
this.$alert('你好vue!');
this.$alert('你好朋友!');
this.$alert.$destroy();
```

#### 非单例

```javascript
const v = this.$dialog('你好vue!');
const r = this.$dialog('你好react!');
const a = this.$dialog('你好angular!');

// 删除"你好angular"的实例
a.$destroy();

// 删除"你好vue"的实例
v.$destroy();

// $createRoot的销毁
const xx = this.$createRoot(UCom);
xx.$destroy();
```