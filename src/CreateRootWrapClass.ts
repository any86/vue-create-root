// createRoot函数的包装类, 主要用来暴露单例和多例2种接口

import { VueConstructor, VNodeData } from 'vue';
import { CreateRootOptions, InputComponent, ChildrenRender, RootComponent } from './interface';
import createRoot from './createRoot';

export default class CreateRoot {
    static Vue: VueConstructor;
    // 单例下的当前组件
    static component: RootComponent | null;
    static inputComponent: InputComponent;

    // 缓存组件实例
    component: RootComponent;
    // 默认配置
    defaultOptions: CreateRootOptions;

    static bindVue = (Vue: VueConstructor):typeof CreateRoot => {
        CreateRoot.Vue = Vue;
        return CreateRoot;
    }

    static bindComponent = (component: InputComponent): typeof CreateRoot => {
        CreateRoot.inputComponent = component;
        return CreateRoot;
    }

    static initCache = (cache: RootComponent | null):typeof CreateRoot => {
        CreateRoot.component = cache;
        return CreateRoot;
    }

    static init = (options: VNodeData, childrenRender: ChildrenRender):typeof CreateRoot => {
        if (null === CreateRoot.component) {
            const _component = CreateRoot.inputComponent;
            CreateRoot.component = createRoot(CreateRoot.Vue, _component, options || {}, childrenRender, {});
        } else {

            CreateRoot.component.$updateRenderData(options|| {}, childrenRender);
        }
        return CreateRoot;
    }

    static $destroy() {
        if (null !== CreateRoot && null !== CreateRoot.component) {
            CreateRoot.component.$destroy();
            CreateRoot.component = null;
        }
        
    }

    constructor(options: VNodeData, childrenRender:ChildrenRender) {
        const _component = CreateRoot.inputComponent;
        this.defaultOptions = options;
        this.component = createRoot(CreateRoot.Vue, _component, options, childrenRender, {});
        return this;
    }

    $update(...args:Parameters<RootComponent['$updateRenderData']>):RootComponent{
        this.component.$updateRenderData(...args);
        return this.component;
    }

    $destroy():this {
        this.component.$destroy();
        return this;
    }
}