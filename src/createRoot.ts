// https://cn.vuejs.org/v2/guide/render-function.html#深入数据对象
import Vue, { VueConstructor, CreateElement, VNodeData, VNodeChildren } from 'vue';
import { throwError } from './utils';
// 挂在到root后的实例
import { RootComponent, InputComponent } from './interface';
interface createRoot {
    (
        Vue: VueConstructor,
        component: InputComponent,
        vNodeData: VNodeData,
        childrenRender: (h: CreateElement) => VNodeChildren,
        options: { target?: string | Element, isAppend?: boolean },
        hooks?: Record<string, ((...args: any) => any)>
    ): RootComponent;
}

const createRoot: createRoot = (Vue, component, vNodeData, childrenRender, { target = 'body', isAppend = true } = {}, hooks = {}) => {
    // 组件容器
    const container = 'string' === typeof target ? document.querySelector(target) : target;
    if (!container) {
        throwError('target元素不存在');
    }

    // 什么元素都无所谓, 因为render中会重新渲染, 最终该标签会被组件标签替换
    const el = document.createElement('div');
    // https://developer.mozilla.org/zh-CN/docs/Web/API/Element/insertAdjacentElement
    // 由于throw被封装, ts没办法正确推断container不为空
    container!.insertAdjacentElement(isAppend ? 'beforeend' : 'afterbegin', el);
    const root = new Vue({
        el,

        render(createElement) {
            // https://cn.vuejs.org/v2/guide/render-function.html#createElement-参数
            return createElement(component, vNodeData, childrenRender ? [childrenRender(createElement)] : []);
            // return createElement(component, vNodeData, [createElement('p', {slot:'m'}, 'xxx')]);
        },
    });

    // 对外$romove方法
    const rootComponent = root.$children[0] as RootComponent;

    // 绑定到vue钩子
    for (let hookName in hooks) {
        rootComponent.$on(`hook:${hookName}`, (ev: any) => {
            hooks[hookName](ev);
        });
    }

    rootComponent.$on('hook:destroyed', () => {
        // 按照vue作者的说法$destroy中并没有做事件解绑, 而是等待系统回收内存
        // 所以$destroy因该只是做了解除数据绑定
        // https://github.com/vuejs/vue/issues/5187
        root.$destroy();
        // 删除元素
        container!.removeChild(root.$el);

    });

    // rootComponent.$remove = () => {
    //     // 按照vue作者的说法$destroy中并没有做事件解绑, 而是等待系统回收内存
    //     // 所以$destroy因该只是做了解除数据绑定
    //     // https://github.com/vuejs/vue/issues/5187
    //     root.$destroy();
    //     // 删除元素
    //     container!.removeChild(root.$el);
    // };


    rootComponent.$updateRenderData = (newProps, newChildrenRender) => {
        vNodeData.props = { ...vNodeData.props, ...newProps };
        childrenRender = newChildrenRender
        // https://cn.vuejs.org/v2/api/#vm-forceUpdate
        // 注意它仅仅影响实例本身和插入插槽内容的子组件，而不是所有子组件。
        root.$forceUpdate();
    };

    return rootComponent;
}


export default createRoot;