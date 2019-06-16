import Vue, { VueConstructor, Component, VNodeData, AsyncComponent, ComponentOptions } from 'vue';
import { RootComponent, InputComponent } from './interface';

/**
 * 包装下throw
 * @param {String} 错误描述
 */
export function throwError(message: string): never {
    throw (`__PKG_NAME__: ${message}`);
};

/**
 * 获取组件的描述数据
 * @param {ComponentOptions<Vue>} 支持的组件格式
 */
export function getComponentPlainObject(component: InputComponent): ComponentOptions<Vue> {
    // 暂时只支持componentObject
    return component as ComponentOptions<Vue>;
}

/**
 * 解析别名
 * @param {String|String[]} 组件name字段或as字段
 * @param {String} 前缀 
 * @returns  {scope: string,method: string,UNIQUE_PATH: string} scope: 作用域名, methods: 方法名, UNIQUE_PATH: 命令名
 */
export function parseAlias(name: string | [string, string] = '', prefix: string): {
    scope?: string,
    method: string,
    UNIQUE_PATH: string
} {
    let method = '';
    let scope: string | undefined;
    if (undefined === name || '' === name) {
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
 * 获取快捷方式属性名
 */
export function getMatchProp(defaultProp: string, globalDefautProps: string[], component: ComponentOptions<Vue>): string | void {
    if (undefined !== (<any>component.props)[defaultProp]) {
        return defaultProp;
    }
    // 全局默认属性中是否有
    else {
        for (let propKey of globalDefautProps) {
            if (undefined !== (<any>component.props)[propKey]) {
                return propKey;
            }
        }
    }
}

/**
 * 是否是对象
 * @param {Any} 输入
 * @returns {Boolean} 是否是对象
 */
export function isObject(input: any): boolean {
    return Object === input.constructor;
}


export function mergeVNodeData(oldData: VNodeData|undefined, newData: VNodeData):VNodeData {
    if (undefined !== oldData) {
        let key: keyof VNodeData;
        for (key in newData) {
            oldData[key] = { ...oldData[key], ...newData[key] }
        }
    }
    return oldData || {};
}