/*!
 * AnyTouch.js v0.0.2
 * (c) 2019-2019 Russell
 * https://github.com/any86/vue-create-root
 * Released under the MIT License.
 */
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

function throwError(message) {
    throw ("vue-create-root: " + message);
}
//# sourceMappingURL=utils.js.map

var INSERT_POSITION_MAP = {
    append: 'beforeend',
    prepend: 'afterbegin',
    insertAfter: 'afterend',
    insertBefore: 'beforebegin'
};
//# sourceMappingURL=const.js.map

var createRoot = function (Vue, component, data, childrenRender, options) {
    if (options === void 0) { options = {}; }
    var _a = options.target, target = _a === void 0 ? 'body' : _a, _b = options.insertPosition, insertPosition = _b === void 0 ? 'append' : _b;
    var vNodeData;
    var _childrenRender = childrenRender;
    var container = 'string' === typeof target ? document.querySelector(target) : target;
    if (!container) {
        throwError('target元素不存在');
    }
    var el = document.createElement('div');
    container.insertAdjacentElement(INSERT_POSITION_MAP[insertPosition], el);
    var root = new Vue({
        el: el,
        render: function (createElement) {
            var rootComponent = createElement(component, vNodeData, _childrenRender && _childrenRender(createElement));
            return rootComponent;
        },
    });
    var rootComponent = root.$children[0];
    rootComponent.$on('hook:destroyed', function () {
        root.$destroy();
        container.removeChild(rootComponent.$el);
    });
    rootComponent.$updateRenderData = function (newData, newChildrenRender) {
        if (undefined !== newData) {
            vNodeData = ('props' in newData) ? newData : { props: newData };
        }
        _childrenRender = newChildrenRender;
        root.$forceUpdate();
    };
    rootComponent.$updateRenderData(data, _childrenRender);
    return rootComponent;
};
//# sourceMappingURL=createRoot.js.map

var CreateRootClassWrapFunction = (function (Vue, inputComponent, globalcreateRootFnExtendOptions) {
    var _a;
    var cRootInstance;
    return _a = (function () {
            function CreateRoot(options, childrenRender) {
                this.component = createRoot(Vue, inputComponent, options, childrenRender, globalcreateRootFnExtendOptions);
                return this;
            }
            CreateRoot.prototype.$update = function () {
                var _b;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                (_b = this.component).$updateRenderData.apply(_b, __spread(args));
                return this.component;
            };
            CreateRoot.prototype.$destroy = function () {
                this.component.$destroy();
                return this;
            };
            return CreateRoot;
        }()),
        _a.init = function (options, childrenRender) {
            if (cRootInstance) {
                cRootInstance.$update(options, childrenRender);
            }
            else {
                cRootInstance = new _a(options, childrenRender);
            }
        },
        _a.$update = function (options, childrenRender) {
            if (undefined !== cRootInstance && null !== cRootInstance) {
                cRootInstance.$update(options, childrenRender);
            }
        },
        _a.$destroy = function () {
            if (null !== cRootInstance) {
                cRootInstance.$destroy();
                cRootInstance = null;
            }
        },
        _a;
});
//# sourceMappingURL=CreateRootClassWrapFunction.js.map

function install(Vue, _a) {
    var _b = (_a === void 0 ? {} : _a).as, as = _b === void 0 ? { $createRoot: '$createRoot' } : _b;
    Vue.createRootClass = function (component, createRootFnExtendOptions) { return CreateRootClassWrapFunction(Vue, component, createRootFnExtendOptions); };
    Vue.createRoot = Vue.createRootClass;
    Vue.prototype[as.$createRoot] = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        createRoot.apply(void 0, __spread([Vue], args));
    };
    Vue.createRootClass.version = '0.0.2';
}
var main = { install: install };
//# sourceMappingURL=main.js.map

export default main;
//# sourceMappingURL=vue-create-root.es.js.map
