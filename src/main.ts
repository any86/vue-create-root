import { VueConstructor } from 'vue';
import { InputComponent, RootComponent, createRootFn, Tail } from './interface';
import CreateRootClassForExport from './CreateRootWrapClass'
import createRoot from './createRoot';
// https://www.tslang.cn/docs/handbook/declaration-merging.html (模块扩展章节)
// https://cn.vuejs.org/v2/guide/typescript.html#增强类型以配合插件使用

// ========= 声明 =========
declare module 'vue' {
    interface VueConstructor {
        createRoot: ((component: InputComponent) => void)
        & { version?: string };
    }
}


/**
 * 功能实现
 * @param {VueConstructor} Vue构造函数
 *  @param {String} Options.prefix 前缀
 *  @param {String} Options.name $createRoot如果冲突可以改名
 */
export default function (Vue: VueConstructor, { name = '$createRoot' } = {}) {
    Vue.createRoot = (component) => {
        // 创建一个地址存储本次运行createRoot生成的实例
        let activeRootComponent: RootComponent | null = null;
        CreateRootClassForExport.initCache(activeRootComponent);
        CreateRootClassForExport.bindComponent(component);
        CreateRootClassForExport.bindVue(Vue);
        return CreateRootClassForExport;
    }
    // 核心功能
    Vue.prototype[name] = (...args: Tail<Parameters<createRootFn>>) => {
        createRoot(Vue, ...args);
    }

    Vue.createRoot.version = '__VERSION__';
}