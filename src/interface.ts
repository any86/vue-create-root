import Vue, { VueConstructor, Component, VNode, CreateElement, VNodeData, VNodeChildren, ComponentOptions } from 'vue/types/index';
import {INSERT_POSITION_MAP} from './const';
// 可以解析的组件格式
export type InputComponent = ComponentOptions<Vue>;

// 渲染字元素和插槽内容
export type ChildrenRender = (createElement: CreateElement) => VNodeChildren;

// 包装后返回的组件格式
export type RootComponent = Vue & { _uid: number, $remove: () => void, $updateRenderData: (newProps: Record<string, any>, newChildrenRender?: ChildrenRender) => void }

// 插入位置
type InsertPositionLikeJQ = keyof typeof INSERT_POSITION_MAP;


// 扩展选项
export interface createRootFnExtendlOptions extends Record<string, any> {
    // 目标容器元素
    target?: string | Element;
    // 插入位置
    insertPosition?: InsertPositionLikeJQ;
}


export interface createRootFn {
    (
        Vue: VueConstructor,
        component: InputComponent,
        vNodeData: VNodeData | Record<string, any>,
        childrenRender?: (createElement: CreateElement) => VNodeChildren,
        options?: createRootFnExtendlOptions,
    ): RootComponent;
}



// 删除数组中第一个元素
export type Tail<Tuple extends any[]> = ((...args: Tuple) => void) extends ((a: any, ...args: infer T) => void) ? T : never;
