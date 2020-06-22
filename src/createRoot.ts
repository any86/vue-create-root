// 核心
// https://cn.vuejs.org/v2/guide/render-function.html#深入-data-对象
import { VNodeData } from 'vue/types/index';
import { RootComponent, createRootFn, ChildrenRender } from './interface';
import { throwError } from './utils';
import { INSERT_POSITION_MAP } from './const';

const createRoot: createRootFn = (Vue, componentObject, data, childrenRender, { target = 'body', insertPosition = 'append' } = {}) => {
    let vNodeData: VNodeData;
    let _childrenRender: ChildrenRender | undefined = childrenRender;
    // 组件容器
    const container = 'string' === typeof target ? document.querySelector(target) : target;
    if (!container) {
        throwError('target元素不存在');
    }

    // 什么元素都无所谓, 因为render中会重新渲染, 最终该标签会被组件标签替换
    const el = document.createElement('div');
    container!.insertAdjacentElement(INSERT_POSITION_MAP[insertPosition], el);

    const root = new Vue({
        el,

        render(createElement) {
            // https://cn.vuejs.org/v2/guide/render-function.html#深入-data-对象
            return createElement(componentObject, vNodeData, _childrenRender && _childrenRender(createElement));
        },
    });

    // 对外$romove方法
    const rootComponent = root.$children[0] as RootComponent;
    rootComponent.$on('hook:destroyed', () => {
        // 按照vue作者的说法$destroy中并没有做事件解绑, 而是等待系统回收内存
        // 所以$destroy因该只是做了解除数据绑定
        // https://github.com/vuejs/vue/issues/5187
        root.$destroy();
        // 删除元素
        container!.removeChild(rootComponent.$el);
    });

    rootComponent.$updateRenderData = (newData, newChildrenRender) => {
        if (undefined !== newData) {
            vNodeData = ('props' in newData) ? newData : { props: newData };
        }
        _childrenRender = newChildrenRender
        // https://cn.vuejs.org/v2/api/#vm-forceUpdate
        // 注意它仅仅影响实例本身和插入插槽内容的子组件，而不是所有子组件。
        root.$forceUpdate();
    };

    // 为了触发vue动画, 所以必须在实例创建后在执行$forceUpdate;
    rootComponent.$updateRenderData(data, _childrenRender);

    return rootComponent;
}

export default createRoot;