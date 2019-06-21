import { VueConstructor } from 'vue';
import { InputComponent, createRootFnExtendOptions, createRootFn, Tail } from './interface';
import CreateRootClassWrapFunction from './CreateRootClassWrapFunction'
import createRoot from './createRoot';
// https://www.tslang.cn/docs/handbook/declaration-merging.html (模块扩展章节)
// https://cn.vuejs.org/v2/guide/typescript.html#增强类型以配合插件使用

// ========= 声明 =========
declare module 'vue' {
    interface VueConstructor {
        createRootClass: ((component: InputComponent,createRootFnExtendOptions:createRootFnExtendOptions) => void)
        & { version?: string };
    }
}

/**
 * 功能实现
 * @param {VueConstructor} Vue构造函数
 *  @param {String} Options.prefix 前缀
 *  @param {String} Options.name $createRoot如果冲突可以改名
 */
function install(Vue: VueConstructor, { name = '$createRoot' } = {}) {
    Vue.createRootClass = (component,createRootFnExtendOptions) => CreateRootClassWrapFunction(Vue, component,createRootFnExtendOptions);
    // 核心功能
    Vue.prototype[name] = (...args: Tail<Parameters<createRootFn>>) => {
        createRoot(Vue, ...args);
    }

    Vue.createRootClass.version = '__VERSION__';
}

export default { install };