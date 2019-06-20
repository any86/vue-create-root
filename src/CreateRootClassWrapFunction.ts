// createRoot函数的包装类, 主要用来暴露单例和多例2种接口
import { VueConstructor, VNodeData } from 'vue';
import { InputComponent, ChildrenRender, RootComponent } from './interface';
import createRoot from './createRoot';
export default (Vue: VueConstructor, inputComponent: InputComponent) => {
    type Instance = {
        $update: (options: VNodeData, childrenRender?: ChildrenRender) => void;
        $destroy: () => void;
        component: RootComponent;
    };
    let instance: Instance | null;

    // 从外部接收Vue和inputComponent
    return class CreateRoot {
        /**
         * 创建单例
         */
        static init = (options: VNodeData, childrenRender?: ChildrenRender) => {
            if (instance) {
                instance.$update(options, childrenRender);
            } else {
                instance = new CreateRoot(options, childrenRender);
            }
        }

        /**
         * 更新单例
         */
        static $update = (options: VNodeData, childrenRender?: ChildrenRender) => {
            if (undefined !== instance && null !== instance) {
                instance.$update(options, childrenRender)
            }
        }

        /**
         * 销毁单例
         */
        static $destroy = () => {
            if (null !== instance) {
                instance.$destroy();
                instance = null;
            }
        }

        // 缓存组件实例
        component: RootComponent;

        constructor(options: VNodeData, childrenRender?: ChildrenRender) {
            this.component = createRoot(Vue, inputComponent, options, childrenRender, {});
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

