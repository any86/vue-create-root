// https://cn.vuejs.org/v2/guide/render-function.html#深入数据对象
import { VueConstructor, Component, VNodeData } from 'vue';
export default function (Vue: VueConstructor, Component: Component, ComponentOptions: VNodeData, { target = 'body', isAppend = true } = {}) {
    const container = document.querySelector(target);
    if (!container) {
        throw 'target元素不存在';
    }

    // 什么元素都无所谓, 因为render中会重新渲染, 并不会渲染该元素
    const el = document.createElement('div');
    // https://developer.mozilla.org/zh-CN/docs/Web/API/Element/insertAdjacentElement
    container.insertAdjacentElement(isAppend ? 'beforeend' : 'afterbegin', el);

    const app =  new Vue({
        el,

        render(createElement) {
            return createElement(Component, ComponentOptions);
        },

        methods: {
            destroy(){
                this.$destroy();
            }
        }
    });

    const component  = app.$children[0]
    
    // component.$remove = ()=>{
    //     app.$destroy();
    // };
   
    // app.$destroy();
    return component;
}