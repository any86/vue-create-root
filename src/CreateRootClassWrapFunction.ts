import { VueConstructor, VNodeData } from 'vue/types';
import { InputComponent, ChildrenRender, RootComponent, createRootFnExtendOptions, CRootInstance } from './interface';
import createRoot from './createRoot';

// createRoot函数的包装类, 主要用来暴露单例和多例2种接口
export default (Vue: VueConstructor, inputComponent: InputComponent, globalcreateRootFnExtendOptions?: createRootFnExtendOptions) => {
    let cRootInstance: CRootInstance | null;

    // 从外部接收Vue和inputComponent
    return class CreateRoot {
        /**
         * 创建单例
         */
        static init = (options: VNodeData, childrenRender?: ChildrenRender) => {
            if (cRootInstance) {
                cRootInstance.$update(options, childrenRender);
            } else {
                cRootInstance = new CreateRoot(options, childrenRender);
            }
        }

        /**
         * 更新单例
         */
        static $update = (options: VNodeData, childrenRender?: ChildrenRender) => {
            if (undefined !== cRootInstance && null !== cRootInstance) {
                cRootInstance.$update(options, childrenRender)
            }
        }

        /**
         * 销毁单例
         */
        static $destroy = () => {
            if (null !== cRootInstance) {
                cRootInstance.$destroy();
                cRootInstance = null;
            }
        }

        // 缓存组件实例
        component: RootComponent;

        constructor(options: VNodeData, childrenRender?: ChildrenRender) {
            this.component = createRoot(Vue, inputComponent, options, childrenRender, globalcreateRootFnExtendOptions);
            return this;
        }

        $update(...args: Parameters<RootComponent['$updateRenderData']>): RootComponent {
            this.component.$updateRenderData(...args);
            return this.component;
        }

        $destroy(): this {
            this.component.$destroy();
            return this;
        }
    }
}

