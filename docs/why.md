## 为什么Vue.createRootClass要返回构造函数, 而不是直接生成组件?

1. 在非Vue组件代码内, 比如路由/vuex/接口定义的文件中默认是没有Vue实例的, 也就是不那么容易拿到this, 这时候用一个变量来控制组件会比this.$xxx方便得多.

2. api的命名交给开发者, 更灵活. 比如this.$Message.warn, 这种API我如果封装在我的代码中会增加开发者的学习成本, 而且我做过[调查](https://juejin.im/pin/5d07447de51d456e13da9adc), 大家都会用**Vue.prototype**, 我就没必要多此一举了.

3. 再就是语义更清晰, 可以通过返回的构造函数上的**init**方法和**new**来标记是否单例.