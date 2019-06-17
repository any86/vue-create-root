// createRoot函数的包装类, 主要用来暴露单例和多例2种接口

import { VueConstructor } from 'vue';
import { CreateRootOptions, InputComponent, VNodeDataWithChildrenRender, RootComponent } from './interface';
import createRoot from './createRoot';

export default class CreateRoot {
    static Vue: VueConstructor;
    // 单例下的当前组件
    static active: RootComponent | null;
    static inputComponent: InputComponent;

    // 缓存组件实例
    active: RootComponent;
    // 默认配置
    defaultOptions: CreateRootOptions;

    static bindVue = (Vue: VueConstructor) => {
        CreateRoot.Vue = Vue;
    }

    static bindComponent = (component: InputComponent) => {
        CreateRoot.inputComponent = component;
    }

    static initCache = (cache: RootComponent | null) => {
        CreateRoot.active = cache;
    }

    static init = (options: VNodeDataWithChildrenRender) => {
        if (null === CreateRoot.active) {
            const _component = CreateRoot.inputComponent;
            CreateRoot.active = createRoot(CreateRoot.Vue, _component, options || {}, options.childrenRender, {});
        } else {
            CreateRoot.active.$updateRenderData(options.props || {}, options.childrenRender);
        }
        return CreateRoot;
    }

    static $destroy() {
        if (null !== CreateRoot && null !== CreateRoot.active) {
            CreateRoot.active.$destroy();
        }
    }

    constructor(options: VNodeDataWithChildrenRender) {
        const _component = CreateRoot.inputComponent;
        this.defaultOptions = options;
        this.active = createRoot(CreateRoot.Vue, _component, options, options.childrenRender, {});
        return this;
    }

    $destroy() {
        this.active.$destroy();
        return this;
    }
}