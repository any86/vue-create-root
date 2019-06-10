import { VueConstructor, Component, VNodeData } from 'vue';
import createRoot from './createRoot';
export function index({ props, on }: { props: object, on: { [k: string]: () => any } }) {
}

// https://www.tslang.cn/docs/handbook/declaration-merging.html (模块扩展章节)
// https://cn.vuejs.org/v2/guide/typescript.html#增强类型以配合插件使用

interface OtherOptions {
    target: string;
    isAppend: boolean;
}
type Options = VNodeData & OtherOptions;

declare module 'vue/types/vue' {
    interface VueConstructor {
        createRoot: (Component: Component) => void;
    }
}

export function install(Vue: VueConstructor, options: object) {
    Vue.createRoot = (Component: Component) => {
        // Vue.prototype[Component.name]
    }

    Vue.prototype.$createRoot = (Component: Component, { target, isAppend, ...componentOptions }: Options) => {
        console.dir(Component.options.name)
        return createRoot(Vue, Component, componentOptions, { target, isAppend });
    };
}


