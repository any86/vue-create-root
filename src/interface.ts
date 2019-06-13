import Vue, { VueConstructor, Component, VNodeData, AsyncComponent } from 'vue';
export type RootComponent = Vue & { $remove: () => void, $updateProps: (props: object) => void }