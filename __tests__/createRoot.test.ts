import Vue from 'vue';
import { ComponentOptions, VueConstructor, VNode } from 'vue/types/index';
import { RootComponent } from '../src/interface';
import createRoot from '../src/createRoot';
import './utils/mock';
const mockDestroy = jest.fn();
const Com: ComponentOptions<Vue> = {
    name: 'UCom',
    props: {
        isShow: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: '我是标题'
        },

        content: {
            type: String,
            default: '我是内容'
        },
    },
    data() {
        return {
            fontSize: '36px'
        };
    },

    render(createElement): VNode {
        return createElement('p', (this as any).content);
    },

    methods: {
        close() {
            this.$emit('close');
        }
    },
    destroyed() {
        mockDestroy()
    },
};

test(`是否正确生成实例?`, () => {
    const rootComponent = createRoot(Vue, Com, {});
    expect(rootComponent).toBeInstanceOf(Vue);
    expect(rootComponent.$el).toBeInstanceOf(HTMLElement);
    expect(rootComponent.$updateRenderData).not.toBeUndefined();
});

test(`target元素找不到时, 是否抛出异常?`, () => {
    const _fn = () => createRoot(Vue, Com, {}, undefined, { target: '#app' });
    expect(_fn).toThrow('__PKG_NAME__: target元素不存在');
});

test('$destroyed销毁是否彻底?', () => {
    const rootComponent = createRoot(Vue, Com, {});
    const { $el } = rootComponent;
    rootComponent.$destroy();
    expect(mockDestroy).toBeCalledTimes(1)
    expect(document.body.contains($el)).toBeFalsy();
});

test('$updateRenderData设置是否生效', () => {
    const content = '测试内容!';
    const rootComponent = createRoot(Vue, Com, { content });
    const { $el } = rootComponent;
    setTimeout(() => {
        expect($el.innerHTML).toBe(content);
    }, 0)
})