// https://cn.vuejs.org/v2/guide/render-function.html#深入数据对象
import Vue, { VueConstructor, Component, VNodeData } from 'vue';
export default function (Vue: VueConstructor, Component: Component, ComponentOptions: VNodeData, { target = 'body', isAppend = true } = {}) {
    let _componentOptions = ComponentOptions;
    const container = document.querySelector(target);
    if (!container) {
        throw 'target元素不存在';
    }
    // 什么元素都无所谓, 因为render中会重新渲染, 最终该标签会被组件标签替换
    const el = document.createElement('div');
    // https://developer.mozilla.org/zh-CN/docs/Web/API/Element/insertAdjacentElement
    container.insertAdjacentElement(isAppend ? 'beforeend' : 'afterbegin', el);
    const root = new Vue({
        el,

        render(createElement) {
            return createElement(Component, _componentOptions);
        },

        methods: {
            destroy() {
                // 按照vue作者的说法$destroy中并没有做事件解绑, 而是等待系统回收内存
                // 所以$destroy因该只是做了解除数据绑定
                // https://github.com/vuejs/vue/issues/5187
                this.$destroy();
                // 删除元素
                container.removeChild(this.$el);
            }
        }
    });

    // 对外$romove方法
    const component: Vue & { color?: string, $remove?: () => void, $updateProps?: (props: object) => void } = root.$children[0];
    component.$remove = root.destroy;
    component.$updateProps = (props) => {
        _componentOptions.props = { ..._componentOptions.props, ...props };
        // https://cn.vuejs.org/v2/api/#vm-forceUpdate
        // 注意它仅仅影响实例本身和插入插槽内容的子组件，而不是所有子组件。
        root.$forceUpdate();
    };
    return component;
}