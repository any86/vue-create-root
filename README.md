# vue-create-root   [![NPM Version][npm-image]][npm-url] [![NPM Downloads][downloads-image]][downloads-url] [![npm bundle size (minified + gzip)][size-image]][size-url] [![codecov](https://codecov.io/gh/any86/vue-create-root/branch/develop/graph/badge.svg)](https://codecov.io/gh/any86/vue-create-root)  [![CircleCI](https://circleci.com/gh/any86/vue-create-root.svg?style=svg)](https://circleci.com/gh/any86/vue-create-root)

[size-image]: https://img.shields.io/bundlephobia/minzip/vue-create-root.svg
[size-url]: https://bundlephobia.com/result?p=vue-create-root
[npm-image]: https://img.shields.io/npm/v/vue-create-root.svg
[npm-url]: https://npmjs.org/package/vue-create-root

[downloads-image]: https://img.shields.io/npm/dm/vue-create-root.svg
[downloads-url]: https://npmjs.org/package/vue-create-root


![](https://ws1.sinaimg.cn/large/005IQkzXly1g40fdqbmikj30m407udfy.jpg)

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
初始化后，组件内可以用 **this.$createRoot** 渲染组件.
```javascript

// main.js中初始化
Vue.use(createRoot);

// xxx.vue
{
    mounted(){
        // 此处UCom为任意组件
        this.$createRoot(UCom);
    }
}
```

### 自定义命令: this.$alert
```javascript
// main.js中初始化
Vue.use(createRoot);

// 此处UCom为任意组件
const C = Vue.createRoot(UCom);

// 注意此处的new, 单例模式是init
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

## 更多例子

[监听事件(\$on)](#监听事件on)

[单例模式(init)](#单例模式init)

[this.\$Message.success](#thismessagesuccess)

[渲染插槽内容(childrenRender)](#渲染插槽内容childrenrender)

[参数简化(是否包含props)](#参数简化是否包含props)

[指定渲染位置](#指定渲染位置)

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
const C = Vue.createRoot(UCom);

// 注意, 单例模式使用C上的init渲染
Vue.prototype.$loading = (text)=> C.init({value: text});

// xxx.vue
// 页面上只会显示一个loading, 显示"你好ts"
this.$loading({value: '正在加载js'});
this.$loading({value: '正在加载ts'});
```
**注意**: 看到这您可能发现了**this.$createRoot**生成的实例**不支持单例**,  这是因为设计他的目的仅仅是为了组件内的某一次临时调用, 如需要复请用**Vue.createRoot**在**main.js**中生成.

### 渲染插槽内容(childrenRender)
其实就是vue的render函数, 更多render的用法请看官网: https://cn.vuejs.org/v2/guide/render-function.html#深入-data-对象
```javascript
// main.js
Vue.use(CreateRoot)
const B = Vue.createRoot(UCom);

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
const C = Vue.createRoot(UCom);
Vue.prototype.$Message = {
    success: new C()
};

// xxx.vue
this.$Message.success({value: '你好vue!'});
```
### 参数简化(是否包含props)
**new C** | **C.init**的第一个(**$createRoot**的第二个)参数支持2种形式, 

**如果**包含**props**字段, 那么传入的就是[VNodeData数据](https://cn.vuejs.org/v2/guide/render-function.html#深入-data-对象), 

**否则**传入的数据会当做props字段, 会自动构造成{props: options}格式;

``` javascript
// 由于没有props字段, 那么C内部会自动构造VNodeData格式, 也就是{props: {value:1}}
new C({value:1});

// 反之那么证明您传入的就是一个VNodeData, C内部就会直接使用.
new C({
    props:{value:1},
    on: {click: e=>{}}
});
```
**再次强调**: 第二种方式**支持完整**的[VNodeData类型](https://cn.vuejs.org/v2/guide/render-function.html#深入-data-对象), 因为内部实现就是包装Vue的render函数.

### 指定渲染位置
默认组件会被插入到body的尾部(`{target: 'body', isAppend: true}`).

```javascript
// 插入到id为my元素内部的第一个位置.
this.$createRoot(UCom, {}, undefined, {target: '#my', isAppend: false});

// Vue.createRoot生成的构造函数也可以
C({content: '我也可以'}, undefined, , {target: '#my', isAppend: false} );
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
