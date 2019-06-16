import { VueConstructor } from 'vue';
import { CreateRootOptions, InputComponent, VNodeDataWithChildrenRender, RootComponent } from './interface';
import createRoot from './createRoot';
export default class CreateRootClassForExport {
    static Vue: VueConstructor;
    // 单例下的当前组件
    static active: RootComponent | null;
    static inputComponent: InputComponent;

    // 缓存组件实例
    active: RootComponent;
    // 默认配置
    defaultOptions: CreateRootOptions;

    static bindVue = (Vue: VueConstructor) => {
        CreateRootClassForExport.Vue = Vue;
    }

    static bindComponent = (component: InputComponent) => {
        CreateRootClassForExport.inputComponent = component;
    }

    static initCache = (cache: RootComponent | null) => {
        CreateRootClassForExport.active = cache;
    }

    static init = (options: any) => {
        if (null === CreateRootClassForExport.active) {
            const _component = CreateRootClassForExport.inputComponent;
            CreateRootClassForExport.active = createRoot(CreateRootClassForExport.Vue, _component, options || {}, options.childrenRender, {});
        } else {
            CreateRootClassForExport.active.$updateRenderData(options.props, options.childrenRender);
        }
        return CreateRootClassForExport;
    }

    static $destroy() {
        if (null !== CreateRootClassForExport && null !== CreateRootClassForExport.active) {
            CreateRootClassForExport.active.$destroy();
        }
    }

    constructor(options: any) {
        const _component = CreateRootClassForExport.inputComponent;
        this.defaultOptions = options;
        this.active = createRoot(CreateRootClassForExport.Vue, _component, options || {}, options.childrenRender, {});
        return this;
    }

    $destroy() {
        this.active.$destroy();
        return this;
    }
}