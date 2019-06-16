import Vue, { VueConstructor, ComponentOptions, Component, VNodeData, VNode, AsyncComponent, CreateElement } from 'vue';
import createRoot from './createRoot';
import { throwError, getComponentPlainObject, parseAlias, getMatchProp, isObject, mergeVNodeData } from './utils';
import { RootComponent, InputComponent, ChildrenRender, VNodeDataWithChildrenRender } from './interface';
import CreateRootClassForExport from './CreateRootClassForExport'
// https://www.tslang.cn/docs/handbook/declaration-merging.html (模块扩展章节)
// https://cn.vuejs.org/v2/guide/typescript.html#增强类型以配合插件使用

// ========= 声明 =========
interface CreateRootOptions extends Record<string, any> {
    // 目标容器元素
    target?: string;
    // 名字
    name?: string;
    // 组件默认配置 & 渲染子元素和插槽
    default?: VNodeDataWithChildrenRender;
    // 追加尾部还是头部
    isAppend?: boolean;
    // 单例
    isSingle?: boolean;
}

declare module 'vue' {
    interface VueConstructor {
        createRoot: ((
            component: InputComponent,
            options: CreateRootOptions) => void)
        & { output?: any, list?: () => string[], version?: string };
    }
}

/**
 * 功能实现
 * @param {VueConstructor} Vue构造函数
 *  @param {String} Options.prefix 前缀
 *  @param {String} Options.name $createRoot如果冲突可以改名
 */
export const install = (Vue: VueConstructor, { name = '$createRoot' } = {}) => {
    Vue.createRoot = (component) => {
        // 创建一个地址存储本次运行createRoot生成的实例
        let activeRootComponent:RootComponent|null = null;
        CreateRootClassForExport.initCache(activeRootComponent);
        CreateRootClassForExport.bindComponent(component);
        CreateRootClassForExport.bindVue(Vue);
        return CreateRootClassForExport;
    }

    Vue.createRoot.version = '__VERSION__';
}