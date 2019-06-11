import Vue, { VueConstructor, Component, VNodeData, AsyncComponent } from 'vue';
import createRoot from './createRoot';

// https://www.tslang.cn/docs/handbook/declaration-merging.html (模块扩展章节)
// https://cn.vuejs.org/v2/guide/typescript.html#增强类型以配合插件使用

// ========= 声明 =========
interface OtherOptions {
    target?: string;
    isAppend?: boolean;
    as?: string;
}
type Options = VNodeData & OtherOptions;

declare module 'vue' {
    interface VueConstructor {
        createRoot: ((component: Component<any, any, any, any> | AsyncComponent<any, any, any, any> | (() => Component), options: Options) => void) & { list?: () => string[] };
    }
}

// ========= 实现 =========
export const install = (Vue: VueConstructor, { prefix = '$' } = {}) => {
    const apiMap: Record<string, boolean> = {};
    Vue.createRoot = (component, options = {}) => {
        let name = options.as;
        if (undefined === name) {
            // Vue.extends生成的实例
            if ((<any>component).prototype instanceof Vue) {
                name = (<any>component).options.name;
            }
            // 组件对象
            else if (undefined !== component.name) {
                name = component.name;
            } else {
                throw (`__PKG_NAME__: 您传入的组件name为空! 您可以通过as给这个api起个别名.`);
            }
        }

        // 组件选项
        // 生成this.$xx函数
        // 判断api名称是否占用 
        const apiName = prefix + name![0].toLocaleLowerCase() + name!.substring(1);
        if (undefined === apiMap[apiName]) {
            apiMap[apiName] = true;
            Vue.prototype[apiName] = (options: any) => {
                createRoot(Vue, component, options);
            }
        } else {
            throw `__PKG_NAME__: 名称"${apiName}"已经存在, 请更换!`
        }
    }

    // 查看api名称是否占用
    Vue.createRoot.list = () => {
        return Object.keys(apiMap);
    };

    // 方法同步到实例上
    Vue.prototype.$createRoot = Vue.createRoot;
    Vue.prototype.$createRoot.list = Vue.createRoot.list;
}