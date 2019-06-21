import { VueConstructor } from 'vue';
import { InputComponent, createRootFnExtendOptions, createRootFn, Tail } from './interface';
import CreateRootClassWrapFunction from './CreateRootClassWrapFunction'
import createRoot from './createRoot';
// https://www.tslang.cn/docs/handbook/declaration-merging.html (模块扩展章节)
// https://cn.vuejs.org/v2/guide/typescript.html#增强类型以配合插件使用

// ========= 声明 =========
type createRoot = ((component: InputComponent, createRootFnExtendOptions: createRootFnExtendOptions) => void)
    & { version?: string };
declare module 'vue' {
    interface VueConstructor {
        createRoot: createRoot;

        createRootClass: createRoot;
    }
}

/**
 * 功能实现
 * @param {VueConstructor} Vue构造函数
 *  @param {String} Options.prefix 前缀
 *  @param {String} Options.name $createRoot如果冲突可以改名
 */
function install(Vue: VueConstructor, { as = { $createRoot: '$createRoot' } } = {}) {
    Vue.createRootClass = (component, createRootFnExtendOptions) => CreateRootClassWrapFunction(Vue, component, createRootFnExtendOptions);
    Vue.createRoot = Vue.createRootClass;
    // 核心功能
    Vue.prototype[as.$createRoot] = (...args: Tail<Parameters<createRootFn>>) => {
        createRoot(Vue, ...args);
    }

    Vue.createRootClass.version = '__VERSION__';
}

export default { install };