Vue.use(createRoot);

        const Com = {
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
                isShow(isShow) {
                    console.log('watch: ', {
                        isShow
                    })
                }
            },

            template: `
                <transition name="bounce">
                    <article v-if="isShow" class="dialog" @click="close">
                        <h1>{{title}}
                            <small><slot name="title"></slot></small>
                        </h1>
                        <p class="content">{{content}}</p>
                        <p><slot></slot></p>
                    </article>
                </transition>`,
            methods: {
                close() {
                    this.$emit('close');
                }
            },
            destroyed() {
                console.warn('des com')
            },
        };

        // 多例
        const B = Vue.createRootClass(Com);

        Vue.prototype.$alert = (props) => new B({
            isShow: true,
            ...props
        });

        const C = Vue.createRootClass(Com, {
            insertPosition: 'prepend'
        });

        const E = Vue.createRootClass(Com);

        Vue.prototype.$single = (props) => C.init({
            isShow: true,
            ...props
        });

        Vue.prototype.$single.close = () => {
            C.$update({
                isShow: false
            })
        }


        Vue.prototype.$single1 = (props) => E.init({
            isShow: true,
            ...props
        });
        Vue.prototype.$single1.close = () => {
            E.$update({
                isShow: false
            })
        }

        const vm = new Vue({
            el: '#app',

            components: {
                Com
            },

            data() {
                return {
                    store: []
                };
            },


            template: `<section class="fix-bottom">
                <button @click="call">生成对话框</button>
                <button @click="closeAll" class="danger">关闭所有对话框</button>
                <button @click="callSingle">单例1,插入到body的头部</button>
                <button @click="closeSingle" class="danger">关闭单例1</button>
                <button @click="callSingle1">单例2</button>
                <button @click="closeSingle1" class="danger">关闭单例2</button>
            </section>`,

            methods: {
                call() {
                    let i = this.$alert({
                        title: '提示',
                        content: '你好vue!',
                    });
                    this.store.push(i);

                    i.component.$on('close', () => {
                        i.$update({
                            isShow: false
                        })
                        console.log('$emit close')
                    })

                    i.component.$on('hook:destroyed', () => {
                        console.log('$emit hook:destroyed')
                    })
                },


                closeAll() {
                    this.store.forEach(i => {
                        i.$update({
                            isShow: false
                        })
                    })
                },

                callSingle() {
                    this.$single({
                        title: '提示',
                        content: '我是单例1, 只能打开一个哦!',
                    });
                },


                closeSingle() {
                    this.$single.close()
                    console.dir()
                },



                callSingle1() {
                    this.$single1({
                        title: '提示',
                        content: '我是单例2, 只能打开一个哦!',
                    });
                },

                closeSingle1() {
                    this.$single1.close()
                    console.dir()
                },

                destroy() {
                    this.$destroy();
                }
            },

            destroyed() {
                console.warn('des')
            },
        });