## 示例

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