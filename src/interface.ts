import Vue, { VueConstructor, Component, VNode, CreateElement, VNodeData, VNodeChildren, AsyncComponent } from 'vue';
export type InputComponent = Component<Vue>;

// 渲染字元素和插槽内容
export type ChildrenRender = (createElement: CreateElement) => VNodeChildren;

// createRoot函数支持的扩展VNodeData
export type VNodeDataWithChildrenRender = VNodeData & { childrenRender: ChildrenRender };
// 包装后返回的组件格式
export type RootComponent = Vue & { _uid: number, $remove: () => void, $updateRenderData: (newProps: object, newChildrenRender: ChildrenRender) => void }

// 可以解析的组件格式
// export type InputComponent = Component<any, any, any, any> | AsyncComponent<any, any, any, any> | (() => Component);


export interface CreateRootOptions extends Record<string, any> {
    // 目标容器元素
    target?: string;
    // 名字
    name?: string;
    // 组件默认配置 & 渲染子元素和插槽
    default?: VNodeDataWithChildrenRender;
    renderData?: VNodeDataWithChildrenRender;

    // 追加尾部还是头部
    isAppend?: boolean;
    // 单例
    isSingle?: boolean;
}