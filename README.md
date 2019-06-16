# vue-create-root   [![NPM Version][npm-image]][npm-url] [![NPM Downloads][downloads-image]][downloads-url] [![npm bundle size (minified + gzip)][size-image]][size-url]

[size-image]: https://img.shields.io/bundlephobia/minzip/vue-create-root.svg
[size-url]: https://bundlephobia.com/result?p=vue-create-root
[npm-image]: https://img.shields.io/npm/v/vue-create-root.svg
[npm-url]: https://npmjs.org/package/vue-create-root

[downloads-image]: https://img.shields.io/npm/dm/vue-create-root.svg
[downloads-url]: https://npmjs.org/package/vue-create-root


![](https://ws1.sinaimg.cn/large/005IQkzXly1g40fdqbmikj30m407udfy.jpg)
## 示例

### 默认命令
初始化后，所有组件内可以用 **this.$createRoot** 渲染组件.
```javascript
// main.js中初始化
Vue.use(createRoot);

// xxx.vue
{
    methods{
        open(){
            // 此处UCom为任意组件
            this.$createRoot(UCom);
        }
    }
}
```

### 自定义命令
```javascript
// main.js中初始化
Vue.use(createRoot);
// 此处UCom为任意组件
Vue.createRoot(UCom, {as: 'alert'});

// xxx.vue
{
    methods{
        open(){
            this.$alert({xxx});
        }
    }
}
```

## 安装 
```shell
npm i -S vue-create-root
```

## 更多例子

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

### 无论多少次调用, 都只想渲染一个组件, 单例模式? (isSingle)

```javascript
// main.js
Vue.createRoot(UCom, {
    isSingle: true,
    as: ['alert']
});

// xxx.vue
// 页面只会渲染出"你好ts"
const {_uid:id1} = this.$alert({value: '你好js'});
const {_uid:id2} = this.$alert({value: '你好ts'});
id1 === id2 // true
```
### 想要类似饿了么 / iView的那种"this.$Message.success()"? (as)
```javascript
// main.js
Vue.createRoot(UCom, {
    as: ['Message', 'success']
});

// xxx.vue
this.$Message.success({value: '你好vue!'});
```

### 有时候我的传的对象只有一个值, 还要写对象吗? (onProp)
```javascript
// main.js
Vue.createRoot(UCom, {
    as: ['alert'],
    // value对应Com组件上的prop中的value字段
    onProp: 'value'
});

// xxx.vue
// 配置后, 以下2种方式均可以使用
this.$alert('你好vue!');
// 等价于
this.$alert({value: '你好vue!'});
```

### 销毁($remove)

#### 单例
单例就很简单了, 直接$remove().
```javascript
this.$alert('你好vue!');
this.$alert('你好朋友!');
this.$alert.$remove();
```

#### 非单例
$remove()会按照生成顺序, 从后想前删除, 先删除刚刚生成.
```javascript
const {_uid:id1} = this.$dialog('你好vue!');
const {_uid:id2} = this.$dialog('你好react!');
const {_uid:id3} = this.$dialog('你好angular!');

// 删除"你好angular"的实例
this.$dialog.remove();

// 删除"你好vue"的实例
this.$dialog.remove(id1);
```
