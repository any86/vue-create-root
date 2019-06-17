import Vue, { VueConstructor, Component, VNode, CreateElement, VNodeData, VNodeChildren, AsyncComponent } from 'vue';
export type InputComponent = Component<Vue>;

// 渲染字元素和插槽内容
export type ChildrenRender = (createElement: CreateElement) => VNodeChildren;

// createRoot函数支持的扩展VNodeData
export type VNodeDataWithChildrenRender = VNodeData & { childrenRender: ChildrenRender };
// 包装后返回的组件格式
export type RootComponent = Vue & { _uid: number, $remove: () => void, $updateRenderData: (newProps: Record<string,any>, newChildrenRender: ChildrenRender) => void }

// 可以解析的组件格式
// export type InputComponent = Component<any, any, any, any> | AsyncComponent<any, any, any, any> | (() => Component);

export interface createRootFn {
    (
        Vue: VueConstructor,
        component: InputComponent,
        vNodeData: VNodeData|Record<string,any>,
        childrenRender: (createElement: CreateElement) => VNodeChildren,
        options: { target?: string | Element, isAppend?: boolean },
    ): RootComponent;
}

type B = Record<string,any>
type C = Omit<B, 'props'>

export interface CreateRootOptions extends Record<string, any> {
    // 目标容器元素
    target?: string;
    // 追加尾部还是头部
    isAppend?: boolean;
}

// 删除数组中第一个元素
export type Tail<Tuple extends any[]> = ((...args: Tuple) => void) extends ((a: any, ...args: infer T) => void) ? T : never;
