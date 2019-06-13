import { VueConstructor, Component, VNodeData, AsyncComponent } from 'vue';
import createRoot from './createRoot';
import { throwError } from './utils';
import { RootComponent } from './interface';
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


// ========= 实现 =========
export const install = (Vue: VueConstructor, { prefix = '$' } = {}) => {

    // 用来方便实现this.$xx.$remove()
    // 命令与实例的映射
    const instanceCommandMap: Record<string, { instance: RootComponent, id: number }[]> = {};


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
        // scope+method生成唯一字符串
        const { scope, method, UNIQUE_PATH } = _parseName(name);
        // 绑定函数到Vue实例
        if (undefined === scope) {
            Vue.prototype[method] = _command;
        } else {
            Vue.prototype[scope] = {};
            Vue.prototype[scope][method] = _command;
        }


        function _parseName(name?: string | [string, string]) {
            let method = '';
            let scope: string | undefined;
            if (undefined === name) {
                throwError(`请用as给这个命令起个别名!`);
            }
            else if ('string' === typeof name) {
                method = prefix + name;
            }
            else if (Array === name.constructor) {
                if (1 < name.length) {
                    scope = prefix + name[0];
                    method = name[1];
                } else {
                    method = prefix + name[0];
                }
            }
            return {
                scope,
                method,
                // scope+method生成唯一字符串
                UNIQUE_PATH: undefined === scope ? method : [scope, method].join('.')
            };
        }


        /**
         * 
         * @param options 
         */
        function _command(options: Options = {}): RootComponent {
            // 当前实例
            let instance: RootComponent;
            const activeCommand = instanceCommandMap[UNIQUE_PATH];
            // 单例
            if ((options.isSingle || isSingleGlobal) && undefined !== activeCommand && 0 < activeCommand.length) {
                instance = activeCommand[activeCommand.length - 1].instance;
                instance.$updateProps(options);
            } else {
                // 建立RootComponent并存储
                instance = createRoot(Vue, component, { props: options });
                if (undefined === instanceCommandMap[UNIQUE_PATH]) {
                    instanceCommandMap[UNIQUE_PATH] = [];
                }
                // 存储命令和实例的映射
                const id = (<any>instance)._uid;
                instanceCommandMap[UNIQUE_PATH].push({ instance, id });
            }
            return instance;
        }

        /**
         * 删除实例
         * @param {Number} 实例id, vue生成的组件id
         */
        _command.$remove = (_uid?: number) => {
            const activeCommand = instanceCommandMap[UNIQUE_PATH];
            if (undefined !== activeCommand) {
                const { length } = activeCommand;
                if (0 < length) {
                    if (undefined === _uid) {
                        // 此处ts推断不正确, 通过!标记不为undefined
                        activeCommand.pop()!.instance.$remove();
                    } else {
                        for (let [index, { id }] of activeCommand.entries()) {
                            if (_uid === id) {
                                activeCommand[index].instance.$remove();
                                activeCommand.splice(index, 1);
                            }
                        }
                    }
                }
            }
            console.log(instanceCommandMap)
        }



    }
    // 查看api名称是否占用
    Vue.createRoot.list = () => {
        return Object.keys(instanceCommandMap);
    };

    // 方法同步到实例上
    Vue.prototype.$createRoot = (component: SupportiveComponentFormat, options: Pick<Options, Exclude<keyof Options, 'as'>>) => createRoot(Vue, component, options);
    Vue.prototype.$createRoot.list = Vue.createRoot.list;
}