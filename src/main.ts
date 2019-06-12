import Vue, { VueConstructor, Component, VNodeData, AsyncComponent } from 'vue';
import createRoot from './createRoot';

// https://www.tslang.cn/docs/handbook/declaration-merging.html (模块扩展章节)
// https://cn.vuejs.org/v2/guide/typescript.html#增强类型以配合插件使用

// ========= 声明 =========
interface CreateRootOptions {
    target?: string;
    isAppend?: boolean;
    isSingle?: boolean;
    as?: string | [string, string];
}
type Options = VNodeData & CreateRootOptions;
type SupportiveComponentFormat = Component<any, any, any, any> | AsyncComponent<any, any, any, any> | (() => Component);
declare module 'vue' {
    interface VueConstructor {
        createRoot: ((component: SupportiveComponentFormat, options: Options) => void) & { list?: () => string[] };
    }
}


const throwError = (msg: string) => {
    throw (`__PKG_NAME__: ${msg}`);
}

// ========= 实现 =========
export const install = (Vue: VueConstructor, { prefix = '$' } = {}) => {

    // 用来方便实现this.$xx.$remove()
    const instanceMap: Record<string, { instance: any }> = {};

    Vue.createRoot = (component, options = {}) => {
        let name = options.as;
        let isSingleGlobal = !!options.isSingle;
        if (undefined === name) {
            // Vue.extends生成的实例
            if ((<any>component).prototype instanceof Vue) {
                name = (<any>component).options.name;
            }
            // 组件对象
            else if (undefined !== component.name) {
                name = component.name;
            } else {
                throwError(`您传入的组件name为空! 您可以通过as给这个命令起个别名.`);
            }
        }
        // 组件选项
        // 生成this.$xx函数
        // 判断api名称是否占用 
        let method = '';
        let scope: string | undefined;
        if (undefined === name) {
            throwError(`请用as给这个命令起个别名!`);
        } 
        else if ('string' === typeof name) {
            method = prefix + name;
        } 
        else if (Array === name.constructor) {
            if(1 < name.length) {
                scope = prefix + name[0];
                method = name[1];
            } else {
                method = prefix + name[0];
            }
        }
        const unique = undefined === scope ? method : [scope, method].join('.');
        // 不存在实例才建立新的$xxx
        // 是否已经建立实例
        // 建立一个新实例
        if (undefined === instanceMap[unique]) {
            let command: any = (options: Options = {}) => {
                // 单例
                if ((options.isSingle || isSingleGlobal) && undefined !== instanceMap[unique]) {
                    instanceMap[unique].instance.$updateProps(options.props);
                } else {
                    // 建立Root并存储
                    instanceMap[unique] = {
                        instance: createRoot(Vue, component, options),
                    }
                }
                return instanceMap[unique].instance;
            }

            command.$remove = () => { instanceMap[unique].instance.$remove() };

            if (undefined === scope) {
                Vue.prototype[method] = command;
            } else {
                Vue.prototype[scope] = {};
                Vue.prototype[scope][method] = command;
            }


            // } else {
            //     throw `__PKG_NAME__: 名称"${commond}"已经存在, 请更换!`
            // }
        }
    }
    // 查看api名称是否占用
    Vue.createRoot.list = () => {
        return Object.keys(instanceMap);
    };

    // 方法同步到实例上
    Vue.prototype.$createRoot = (component: SupportiveComponentFormat, options: Pick<Options, Exclude<keyof Options, 'as'>>) => createRoot(Vue, component, options);
    Vue.prototype.$createRoot.list = Vue.createRoot.list;
}