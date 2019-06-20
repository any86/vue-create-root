import Vue from 'vue';
import { ComponentOptions,VueConstructor,VNode } from 'vue/types/index';
import { RootComponent } from '../src/interface';
import createRoot from '../src/createRoot';

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
    watch: {
        isShow(isShow: boolean) {
            console.log('watch: ', {
                isShow
            })
        }
    },

    render(createElement):VNode{
        return createElement('p', (this as any).content);
    },

    // template: `
    //     <transition name="bounce">
    //         <article v-if="isShow" class="dialog" @click="close">
    //             <h1>{{title}}
    //                 <small><slot name="title"></slot></small>
    //             </h1>
    //             <p class="content">{{content}}</p>
    //             <p><slot></slot></p>
    //         </article>
    //     </transition>`,
    methods: {
        close() {
            this.$emit('close');
        }
    },
    destroyed() {
        console.warn('des com')
    },
};

let rootComponent: RootComponent;
beforeAll(() => {
    rootComponent = createRoot(Vue, Com, { isShow: true });
})

test(`是否正确生成实例?`, () => {
    expect(rootComponent).toBeInstanceOf(Vue);
    expect(rootComponent.$el).toBeInstanceOf(HTMLElement);
    expect(rootComponent.$updateRenderData).not.toBeUndefined();
    
});