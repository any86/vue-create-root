# API
### Vue.createRootClass
返回**生成组件的构造函数**, 通过初始化构造函数来渲染组件, 别名**Vue.createRoot** .
###### 函数签名: (component:Object, options:Object)=> Function
|名称|数据类型|说明|
|---|---|---|
|component|Object|vue组件|
|options|Object|target: 目标元素,默认'body', <br> insertPosition: 插入位置,包含值:'append' /  'prepend' / 'insertBefore' / 'insertAfter', 默认'append' |

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
**注意**:  再次强调下, Vue.createRootClass并**不生成组件**, 而是返回**生成组件的构造函数**, 下面我给他起了个名字叫:seedling: **CreateRootClass**. 


### :seedling: CreateRootClass

#### CreateRootClass.constructor
###### 函数签名: ( options:Object, childrenRender:Function )=> this

用来生成组件, 可以指定组件在dom中的位置.

|名称|数据类型|说明|
|---|---|---|
|options|Object|vue的VNodeData类型, 如果只包含props的设置, 可以省略props,<br> 如: A({props: {a:1}}) 等价 A({a:1}).
|childrenRender|Function|就是vue的render函数, 主要用来渲染插槽内的子组件, 具体用法请查看[Vue文档](https://cn.vuejs.org/v2/guide/render-function.html#createElement-%E5%8F%82%E6%95%B0)|

```javascript
const A = Vue.createRootClass(UCom);
Vue.prototype.$abc = (...args)=> new A(...args, h=>h('p', '我在默认插槽内!'));
```


#### CreateRootClass.init
###### 函数签名: ( options:Object, childrenRender:Function )=> this
功能及参数同CreateRootClass.constructor, 但是他渲染出的组件是**单例**模式, 也就是**不论init多少次, 都只会渲染同一个组件**.
```javascript
const C = Vue.createRootClass(UCom);
Vue.prototype.$abc = (...args)=> C.init(...args, h=>h('p', '我在默认插槽内!'));
```

#### CreateRootClass.$update
###### 函数签名: CreateRootClass.$update( options:Object, childrenRender:Function )=> this
更新组件数据, 参数同CreateRootClass.constructor.
```javascript
const C = Vue.createRootClass(UCom);
C.$update({content: '内容更新了'}, h=>h('p', '我在默认插槽内!'));
```


#### CreateRootClass.$destroy()
销毁组件, 无论是否单例模式都通过$destroy方法销毁.
```javascript
const C = Vue.createRootClass(UCom);
C.$destroy();
```


### $createRoot
在任意组件内可以通过this.$createRoot渲染组件到任意位置.
###### 函数签名: (data: object, childrenRender: function, options: object)=> object
前2个参数同[CreateRootClass.constructor](#函数签名-componentobject-optionsobject-function). 第3个参数同[Vue.createRoot](#vuecreaterootclass)的options, 主要用来控制组件插入位置.