
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
function noop() { }
const identity = x => x;
function assign(tar, src) {
    // @ts-ignore
    for (const k in src)
        tar[k] = src[k];
    return tar;
}
// Adapted from https://github.com/then/is-promise/blob/master/index.js
// Distributed under MIT License https://github.com/then/is-promise/blob/master/LICENSE
function is_promise(value) {
    return !!value && (typeof value === 'object' || typeof value === 'function') && typeof value.then === 'function';
}
function add_location(element, file, line, column, char) {
    element.__svelte_meta = {
        loc: { file, line, column, char }
    };
}
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function is_function(thing) {
    return typeof thing === 'function';
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}
let src_url_equal_anchor;
function src_url_equal(element_src, url) {
    if (!src_url_equal_anchor) {
        src_url_equal_anchor = document.createElement('a');
    }
    src_url_equal_anchor.href = url;
    return element_src === src_url_equal_anchor.href;
}
function is_empty(obj) {
    return Object.keys(obj).length === 0;
}
function validate_store(store, name) {
    if (store != null && typeof store.subscribe !== 'function') {
        throw new Error(`'${name}' is not a store with a 'subscribe' method`);
    }
}
function subscribe(store, ...callbacks) {
    if (store == null) {
        return noop;
    }
    const unsub = store.subscribe(...callbacks);
    return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function get_store_value(store) {
    let value;
    subscribe(store, _ => value = _)();
    return value;
}
function component_subscribe(component, store, callback) {
    component.$$.on_destroy.push(subscribe(store, callback));
}
function create_slot(definition, ctx, $$scope, fn) {
    if (definition) {
        const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
        return definition[0](slot_ctx);
    }
}
function get_slot_context(definition, ctx, $$scope, fn) {
    return definition[1] && fn
        ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
        : $$scope.ctx;
}
function get_slot_changes(definition, $$scope, dirty, fn) {
    if (definition[2] && fn) {
        const lets = definition[2](fn(dirty));
        if ($$scope.dirty === undefined) {
            return lets;
        }
        if (typeof lets === 'object') {
            const merged = [];
            const len = Math.max($$scope.dirty.length, lets.length);
            for (let i = 0; i < len; i += 1) {
                merged[i] = $$scope.dirty[i] | lets[i];
            }
            return merged;
        }
        return $$scope.dirty | lets;
    }
    return $$scope.dirty;
}
function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
    if (slot_changes) {
        const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
        slot.p(slot_context, slot_changes);
    }
}
function get_all_dirty_from_scope($$scope) {
    if ($$scope.ctx.length > 32) {
        const dirty = [];
        const length = $$scope.ctx.length / 32;
        for (let i = 0; i < length; i++) {
            dirty[i] = -1;
        }
        return dirty;
    }
    return -1;
}
function exclude_internal_props(props) {
    const result = {};
    for (const k in props)
        if (k[0] !== '$')
            result[k] = props[k];
    return result;
}
function compute_rest_props(props, keys) {
    const rest = {};
    keys = new Set(keys);
    for (const k in props)
        if (!keys.has(k) && k[0] !== '$')
            rest[k] = props[k];
    return rest;
}

const is_client = typeof window !== 'undefined';
let now = is_client
    ? () => window.performance.now()
    : () => Date.now();
let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

const tasks = new Set();
function run_tasks(now) {
    tasks.forEach(task => {
        if (!task.c(now)) {
            tasks.delete(task);
            task.f();
        }
    });
    if (tasks.size !== 0)
        raf(run_tasks);
}
/**
 * Creates a new task that runs on each raf frame
 * until it returns a falsy value or is aborted
 */
function loop(callback) {
    let task;
    if (tasks.size === 0)
        raf(run_tasks);
    return {
        promise: new Promise(fulfill => {
            tasks.add(task = { c: callback, f: fulfill });
        }),
        abort() {
            tasks.delete(task);
        }
    };
}

const globals = (typeof window !== 'undefined'
    ? window
    : typeof globalThis !== 'undefined'
        ? globalThis
        : global);
function append(target, node) {
    target.appendChild(node);
}
function get_root_for_style(node) {
    if (!node)
        return document;
    const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
    if (root && root.host) {
        return root;
    }
    return node.ownerDocument;
}
function append_empty_stylesheet(node) {
    const style_element = element('style');
    append_stylesheet(get_root_for_style(node), style_element);
    return style_element.sheet;
}
function append_stylesheet(node, style) {
    append(node.head || node, style);
    return style.sheet;
}
function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
}
function detach(node) {
    if (node.parentNode) {
        node.parentNode.removeChild(node);
    }
}
function destroy_each(iterations, detaching) {
    for (let i = 0; i < iterations.length; i += 1) {
        if (iterations[i])
            iterations[i].d(detaching);
    }
}
function element(name) {
    return document.createElement(name);
}
function text(data) {
    return document.createTextNode(data);
}
function space() {
    return text(' ');
}
function empty() {
    return text('');
}
function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
}
function attr(node, attribute, value) {
    if (value == null)
        node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
        node.setAttribute(attribute, value);
}
/**
 * List of attributes that should always be set through the attr method,
 * because updating them through the property setter doesn't work reliably.
 * In the example of `width`/`height`, the problem is that the setter only
 * accepts numeric values, but the attribute can also be set to a string like `50%`.
 * If this list becomes too big, rethink this approach.
 */
const always_set_through_set_attribute = ['width', 'height'];
function set_attributes(node, attributes) {
    // @ts-ignore
    const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
    for (const key in attributes) {
        if (attributes[key] == null) {
            node.removeAttribute(key);
        }
        else if (key === 'style') {
            node.style.cssText = attributes[key];
        }
        else if (key === '__value') {
            node.value = node[key] = attributes[key];
        }
        else if (descriptors[key] && descriptors[key].set && always_set_through_set_attribute.indexOf(key) === -1) {
            node[key] = attributes[key];
        }
        else {
            attr(node, key, attributes[key]);
        }
    }
}
function to_number(value) {
    return value === '' ? null : +value;
}
function children(element) {
    return Array.from(element.childNodes);
}
function set_input_value(input, value) {
    input.value = value == null ? '' : value;
}
function set_style(node, key, value, important) {
    if (value == null) {
        node.style.removeProperty(key);
    }
    else {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
}
function select_option(select, value, mounting) {
    for (let i = 0; i < select.options.length; i += 1) {
        const option = select.options[i];
        if (option.__value === value) {
            option.selected = true;
            return;
        }
    }
    if (!mounting || value !== undefined) {
        select.selectedIndex = -1; // no option should be selected
    }
}
function select_value(select) {
    const selected_option = select.querySelector(':checked');
    return selected_option && selected_option.__value;
}
function toggle_class(element, name, toggle) {
    element.classList[toggle ? 'add' : 'remove'](name);
}
function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
    const e = document.createEvent('CustomEvent');
    e.initCustomEvent(type, bubbles, cancelable, detail);
    return e;
}

// we need to store the information for multiple documents because a Svelte application could also contain iframes
// https://github.com/sveltejs/svelte/issues/3624
const managed_styles = new Map();
let active = 0;
// https://github.com/darkskyapp/string-hash/blob/master/index.js
function hash(str) {
    let hash = 5381;
    let i = str.length;
    while (i--)
        hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
    return hash >>> 0;
}
function create_style_information(doc, node) {
    const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
    managed_styles.set(doc, info);
    return info;
}
function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
    const step = 16.666 / duration;
    let keyframes = '{\n';
    for (let p = 0; p <= 1; p += step) {
        const t = a + (b - a) * ease(p);
        keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
    }
    const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
    const name = `__svelte_${hash(rule)}_${uid}`;
    const doc = get_root_for_style(node);
    const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
    if (!rules[name]) {
        rules[name] = true;
        stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
    }
    const animation = node.style.animation || '';
    node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
    active += 1;
    return name;
}
function delete_rule(node, name) {
    const previous = (node.style.animation || '').split(', ');
    const next = previous.filter(name
        ? anim => anim.indexOf(name) < 0 // remove specific animation
        : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
    );
    const deleted = previous.length - next.length;
    if (deleted) {
        node.style.animation = next.join(', ');
        active -= deleted;
        if (!active)
            clear_rules();
    }
}
function clear_rules() {
    raf(() => {
        if (active)
            return;
        managed_styles.forEach(info => {
            const { ownerNode } = info.stylesheet;
            // there is no ownerNode if it runs on jsdom.
            if (ownerNode)
                detach(ownerNode);
        });
        managed_styles.clear();
    });
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
function get_current_component() {
    if (!current_component)
        throw new Error('Function called outside component initialization');
    return current_component;
}
/**
 * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
 * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
 * it can be called from an external module).
 *
 * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
 *
 * https://svelte.dev/docs#run-time-svelte-onmount
 */
function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
}
/**
 * Schedules a callback to run immediately before the component is unmounted.
 *
 * Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
 * only one that runs inside a server-side component.
 *
 * https://svelte.dev/docs#run-time-svelte-ondestroy
 */
function onDestroy(fn) {
    get_current_component().$$.on_destroy.push(fn);
}
/**
 * Creates an event dispatcher that can be used to dispatch [component events](/docs#template-syntax-component-directives-on-eventname).
 * Event dispatchers are functions that can take two arguments: `name` and `detail`.
 *
 * Component events created with `createEventDispatcher` create a
 * [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
 * These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).
 * The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
 * property and can contain any type of data.
 *
 * https://svelte.dev/docs#run-time-svelte-createeventdispatcher
 */
function createEventDispatcher() {
    const component = get_current_component();
    return (type, detail, { cancelable = false } = {}) => {
        const callbacks = component.$$.callbacks[type];
        if (callbacks) {
            // TODO are there situations where events could be dispatched
            // in a server (non-DOM) environment?
            const event = custom_event(type, detail, { cancelable });
            callbacks.slice().forEach(fn => {
                fn.call(component, event);
            });
            return !event.defaultPrevented;
        }
        return true;
    };
}
/**
 * Associates an arbitrary `context` object with the current component and the specified `key`
 * and returns that object. The context is then available to children of the component
 * (including slotted content) with `getContext`.
 *
 * Like lifecycle functions, this must be called during component initialisation.
 *
 * https://svelte.dev/docs#run-time-svelte-setcontext
 */
function setContext(key, context) {
    get_current_component().$$.context.set(key, context);
    return context;
}
/**
 * Retrieves the context that belongs to the closest parent component with the specified `key`.
 * Must be called during component initialisation.
 *
 * https://svelte.dev/docs#run-time-svelte-getcontext
 */
function getContext(key) {
    return get_current_component().$$.context.get(key);
}

const dirty_components = [];
const binding_callbacks = [];
let render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = /* @__PURE__ */ Promise.resolve();
let update_scheduled = false;
function schedule_update() {
    if (!update_scheduled) {
        update_scheduled = true;
        resolved_promise.then(flush);
    }
}
function add_render_callback(fn) {
    render_callbacks.push(fn);
}
// flush() calls callbacks in this order:
// 1. All beforeUpdate callbacks, in order: parents before children
// 2. All bind:this callbacks, in reverse order: children before parents.
// 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
//    for afterUpdates called during the initial onMount, which are called in
//    reverse order: children before parents.
// Since callbacks might update component values, which could trigger another
// call to flush(), the following steps guard against this:
// 1. During beforeUpdate, any updated components will be added to the
//    dirty_components array and will cause a reentrant call to flush(). Because
//    the flush index is kept outside the function, the reentrant call will pick
//    up where the earlier call left off and go through all dirty components. The
//    current_component value is saved and restored so that the reentrant call will
//    not interfere with the "parent" flush() call.
// 2. bind:this callbacks cannot trigger new flush() calls.
// 3. During afterUpdate, any updated components will NOT have their afterUpdate
//    callback called a second time; the seen_callbacks set, outside the flush()
//    function, guarantees this behavior.
const seen_callbacks = new Set();
let flushidx = 0; // Do *not* move this inside the flush() function
function flush() {
    // Do not reenter flush while dirty components are updated, as this can
    // result in an infinite loop. Instead, let the inner flush handle it.
    // Reentrancy is ok afterwards for bindings etc.
    if (flushidx !== 0) {
        return;
    }
    const saved_component = current_component;
    do {
        // first, call beforeUpdate functions
        // and update components
        try {
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update$1(component.$$);
            }
        }
        catch (e) {
            // reset dirty state to not end up in a deadlocked state and then rethrow
            dirty_components.length = 0;
            flushidx = 0;
            throw e;
        }
        set_current_component(null);
        dirty_components.length = 0;
        flushidx = 0;
        while (binding_callbacks.length)
            binding_callbacks.pop()();
        // then, once components are updated, call
        // afterUpdate functions. This may cause
        // subsequent updates...
        for (let i = 0; i < render_callbacks.length; i += 1) {
            const callback = render_callbacks[i];
            if (!seen_callbacks.has(callback)) {
                // ...so guard against infinite loops
                seen_callbacks.add(callback);
                callback();
            }
        }
        render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
        flush_callbacks.pop()();
    }
    update_scheduled = false;
    seen_callbacks.clear();
    set_current_component(saved_component);
}
function update$1($$) {
    if ($$.fragment !== null) {
        $$.update();
        run_all($$.before_update);
        const dirty = $$.dirty;
        $$.dirty = [-1];
        $$.fragment && $$.fragment.p($$.ctx, dirty);
        $$.after_update.forEach(add_render_callback);
    }
}
/**
 * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
 */
function flush_render_callbacks(fns) {
    const filtered = [];
    const targets = [];
    render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
    targets.forEach((c) => c());
    render_callbacks = filtered;
}

let promise;
function wait() {
    if (!promise) {
        promise = Promise.resolve();
        promise.then(() => {
            promise = null;
        });
    }
    return promise;
}
function dispatch(node, direction, kind) {
    node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
}
const outroing = new Set();
let outros;
function group_outros() {
    outros = {
        r: 0,
        c: [],
        p: outros // parent group
    };
}
function check_outros() {
    if (!outros.r) {
        run_all(outros.c);
    }
    outros = outros.p;
}
function transition_in(block, local) {
    if (block && block.i) {
        outroing.delete(block);
        block.i(local);
    }
}
function transition_out(block, local, detach, callback) {
    if (block && block.o) {
        if (outroing.has(block))
            return;
        outroing.add(block);
        outros.c.push(() => {
            outroing.delete(block);
            if (callback) {
                if (detach)
                    block.d(1);
                callback();
            }
        });
        block.o(local);
    }
    else if (callback) {
        callback();
    }
}
const null_transition = { duration: 0 };
function create_in_transition(node, fn, params) {
    const options = { direction: 'in' };
    let config = fn(node, params, options);
    let running = false;
    let animation_name;
    let task;
    let uid = 0;
    function cleanup() {
        if (animation_name)
            delete_rule(node, animation_name);
    }
    function go() {
        const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
        if (css)
            animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
        tick(0, 1);
        const start_time = now() + delay;
        const end_time = start_time + duration;
        if (task)
            task.abort();
        running = true;
        add_render_callback(() => dispatch(node, true, 'start'));
        task = loop(now => {
            if (running) {
                if (now >= end_time) {
                    tick(1, 0);
                    dispatch(node, true, 'end');
                    cleanup();
                    return running = false;
                }
                if (now >= start_time) {
                    const t = easing((now - start_time) / duration);
                    tick(t, 1 - t);
                }
            }
            return running;
        });
    }
    let started = false;
    return {
        start() {
            if (started)
                return;
            started = true;
            delete_rule(node);
            if (is_function(config)) {
                config = config(options);
                wait().then(go);
            }
            else {
                go();
            }
        },
        invalidate() {
            started = false;
        },
        end() {
            if (running) {
                cleanup();
                running = false;
            }
        }
    };
}
function create_out_transition(node, fn, params) {
    const options = { direction: 'out' };
    let config = fn(node, params, options);
    let running = true;
    let animation_name;
    const group = outros;
    group.r += 1;
    function go() {
        const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
        if (css)
            animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
        const start_time = now() + delay;
        const end_time = start_time + duration;
        add_render_callback(() => dispatch(node, false, 'start'));
        loop(now => {
            if (running) {
                if (now >= end_time) {
                    tick(0, 1);
                    dispatch(node, false, 'end');
                    if (!--group.r) {
                        // this will result in `end()` being called,
                        // so we don't need to clean up here
                        run_all(group.c);
                    }
                    return false;
                }
                if (now >= start_time) {
                    const t = easing((now - start_time) / duration);
                    tick(1 - t, t);
                }
            }
            return running;
        });
    }
    if (is_function(config)) {
        wait().then(() => {
            // @ts-ignore
            config = config(options);
            go();
        });
    }
    else {
        go();
    }
    return {
        end(reset) {
            if (reset && config.tick) {
                config.tick(1, 0);
            }
            if (running) {
                if (animation_name)
                    delete_rule(node, animation_name);
                running = false;
            }
        }
    };
}

function handle_promise(promise, info) {
    const token = info.token = {};
    function update(type, index, key, value) {
        if (info.token !== token)
            return;
        info.resolved = value;
        let child_ctx = info.ctx;
        if (key !== undefined) {
            child_ctx = child_ctx.slice();
            child_ctx[key] = value;
        }
        const block = type && (info.current = type)(child_ctx);
        let needs_flush = false;
        if (info.block) {
            if (info.blocks) {
                info.blocks.forEach((block, i) => {
                    if (i !== index && block) {
                        group_outros();
                        transition_out(block, 1, 1, () => {
                            if (info.blocks[i] === block) {
                                info.blocks[i] = null;
                            }
                        });
                        check_outros();
                    }
                });
            }
            else {
                info.block.d(1);
            }
            block.c();
            transition_in(block, 1);
            block.m(info.mount(), info.anchor);
            needs_flush = true;
        }
        info.block = block;
        if (info.blocks)
            info.blocks[index] = block;
        if (needs_flush) {
            flush();
        }
    }
    if (is_promise(promise)) {
        const current_component = get_current_component();
        promise.then(value => {
            set_current_component(current_component);
            update(info.then, 1, info.value, value);
            set_current_component(null);
        }, error => {
            set_current_component(current_component);
            update(info.catch, 2, info.error, error);
            set_current_component(null);
            if (!info.hasCatch) {
                throw error;
            }
        });
        // if we previously had a then/catch block, destroy it
        if (info.current !== info.pending) {
            update(info.pending, 0);
            return true;
        }
    }
    else {
        if (info.current !== info.then) {
            update(info.then, 1, info.value, promise);
            return true;
        }
        info.resolved = promise;
    }
}
function update_await_block_branch(info, ctx, dirty) {
    const child_ctx = ctx.slice();
    const { resolved } = info;
    if (info.current === info.then) {
        child_ctx[info.value] = resolved;
    }
    if (info.current === info.catch) {
        child_ctx[info.error] = resolved;
    }
    info.block.p(child_ctx, dirty);
}
function outro_and_destroy_block(block, lookup) {
    transition_out(block, 1, 1, () => {
        lookup.delete(block.key);
    });
}
function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
    let o = old_blocks.length;
    let n = list.length;
    let i = o;
    const old_indexes = {};
    while (i--)
        old_indexes[old_blocks[i].key] = i;
    const new_blocks = [];
    const new_lookup = new Map();
    const deltas = new Map();
    const updates = [];
    i = n;
    while (i--) {
        const child_ctx = get_context(ctx, list, i);
        const key = get_key(child_ctx);
        let block = lookup.get(key);
        if (!block) {
            block = create_each_block(key, child_ctx);
            block.c();
        }
        else if (dynamic) {
            // defer updates until all the DOM shuffling is done
            updates.push(() => block.p(child_ctx, dirty));
        }
        new_lookup.set(key, new_blocks[i] = block);
        if (key in old_indexes)
            deltas.set(key, Math.abs(i - old_indexes[key]));
    }
    const will_move = new Set();
    const did_move = new Set();
    function insert(block) {
        transition_in(block, 1);
        block.m(node, next);
        lookup.set(block.key, block);
        next = block.first;
        n--;
    }
    while (o && n) {
        const new_block = new_blocks[n - 1];
        const old_block = old_blocks[o - 1];
        const new_key = new_block.key;
        const old_key = old_block.key;
        if (new_block === old_block) {
            // do nothing
            next = new_block.first;
            o--;
            n--;
        }
        else if (!new_lookup.has(old_key)) {
            // remove old block
            destroy(old_block, lookup);
            o--;
        }
        else if (!lookup.has(new_key) || will_move.has(new_key)) {
            insert(new_block);
        }
        else if (did_move.has(old_key)) {
            o--;
        }
        else if (deltas.get(new_key) > deltas.get(old_key)) {
            did_move.add(new_key);
            insert(new_block);
        }
        else {
            will_move.add(old_key);
            o--;
        }
    }
    while (o--) {
        const old_block = old_blocks[o];
        if (!new_lookup.has(old_block.key))
            destroy(old_block, lookup);
    }
    while (n)
        insert(new_blocks[n - 1]);
    run_all(updates);
    return new_blocks;
}
function validate_each_keys(ctx, list, get_context, get_key) {
    const keys = new Set();
    for (let i = 0; i < list.length; i++) {
        const key = get_key(get_context(ctx, list, i));
        if (keys.has(key)) {
            throw new Error('Cannot have duplicate keys in a keyed each');
        }
        keys.add(key);
    }
}

function get_spread_update(levels, updates) {
    const update = {};
    const to_null_out = {};
    const accounted_for = { $$scope: 1 };
    let i = levels.length;
    while (i--) {
        const o = levels[i];
        const n = updates[i];
        if (n) {
            for (const key in o) {
                if (!(key in n))
                    to_null_out[key] = 1;
            }
            for (const key in n) {
                if (!accounted_for[key]) {
                    update[key] = n[key];
                    accounted_for[key] = 1;
                }
            }
            levels[i] = n;
        }
        else {
            for (const key in o) {
                accounted_for[key] = 1;
            }
        }
    }
    for (const key in to_null_out) {
        if (!(key in update))
            update[key] = undefined;
    }
    return update;
}
function get_spread_object(spread_props) {
    return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
}
function create_component(block) {
    block && block.c();
}
function mount_component(component, target, anchor, customElement) {
    const { fragment, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    if (!customElement) {
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
            // if the component was destroyed immediately
            // it will update the `$$.on_destroy` reference to `null`.
            // the destructured on_destroy may still reference to the old array
            if (component.$$.on_destroy) {
                component.$$.on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
    }
    after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
        flush_render_callbacks($$.after_update);
        run_all($$.on_destroy);
        $$.fragment && $$.fragment.d(detaching);
        // TODO null out other refs, including component.$$ (but need to
        // preserve final state?)
        $$.on_destroy = $$.fragment = null;
        $$.ctx = [];
    }
}
function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
        dirty_components.push(component);
        schedule_update();
        component.$$.dirty.fill(0);
    }
    component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
}
function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const $$ = component.$$ = {
        fragment: null,
        ctx: [],
        // state
        props,
        update: noop,
        not_equal,
        bound: blank_object(),
        // lifecycle
        on_mount: [],
        on_destroy: [],
        on_disconnect: [],
        before_update: [],
        after_update: [],
        context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
        // everything else
        callbacks: blank_object(),
        dirty,
        skip_bound: false,
        root: options.target || parent_component.$$.root
    };
    append_styles && append_styles($$.root);
    let ready = false;
    $$.ctx = instance
        ? instance(component, options.props || {}, (i, ret, ...rest) => {
            const value = rest.length ? rest[0] : ret;
            if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                if (!$$.skip_bound && $$.bound[i])
                    $$.bound[i](value);
                if (ready)
                    make_dirty(component, i);
            }
            return ret;
        })
        : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    // `false` as a special case of no DOM component
    $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
    if (options.target) {
        if (options.hydrate) {
            const nodes = children(options.target);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.l(nodes);
            nodes.forEach(detach);
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.c();
        }
        if (options.intro)
            transition_in(component.$$.fragment);
        mount_component(component, options.target, options.anchor, options.customElement);
        flush();
    }
    set_current_component(parent_component);
}
/**
 * Base class for Svelte components. Used when dev=false.
 */
class SvelteComponent {
    $destroy() {
        destroy_component(this, 1);
        this.$destroy = noop;
    }
    $on(type, callback) {
        if (!is_function(callback)) {
            return noop;
        }
        const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
        callbacks.push(callback);
        return () => {
            const index = callbacks.indexOf(callback);
            if (index !== -1)
                callbacks.splice(index, 1);
        };
    }
    $set($$props) {
        if (this.$$set && !is_empty($$props)) {
            this.$$.skip_bound = true;
            this.$$set($$props);
            this.$$.skip_bound = false;
        }
    }
}

function dispatch_dev(type, detail) {
    document.dispatchEvent(custom_event(type, Object.assign({ version: '3.59.2' }, detail), { bubbles: true }));
}
function append_dev(target, node) {
    dispatch_dev('SvelteDOMInsert', { target, node });
    append(target, node);
}
function insert_dev(target, node, anchor) {
    dispatch_dev('SvelteDOMInsert', { target, node, anchor });
    insert(target, node, anchor);
}
function detach_dev(node) {
    dispatch_dev('SvelteDOMRemove', { node });
    detach(node);
}
function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation, has_stop_immediate_propagation) {
    const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
    if (has_prevent_default)
        modifiers.push('preventDefault');
    if (has_stop_propagation)
        modifiers.push('stopPropagation');
    if (has_stop_immediate_propagation)
        modifiers.push('stopImmediatePropagation');
    dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
    const dispose = listen(node, event, handler, options);
    return () => {
        dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
        dispose();
    };
}
function attr_dev(node, attribute, value) {
    attr(node, attribute, value);
    if (value == null)
        dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
    else
        dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
}
function set_data_dev(text, data) {
    data = '' + data;
    if (text.data === data)
        return;
    dispatch_dev('SvelteDOMSetData', { node: text, data });
    text.data = data;
}
function validate_each_argument(arg) {
    if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
        let msg = '{#each} only iterates over array-like objects.';
        if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
            msg += ' You can use a spread to convert this iterable into an array.';
        }
        throw new Error(msg);
    }
}
function validate_slots(name, slot, keys) {
    for (const slot_key of Object.keys(slot)) {
        if (!~keys.indexOf(slot_key)) {
            console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
        }
    }
}
function construct_svelte_component_dev(component, props) {
    const error_message = 'this={...} of <svelte:component> should specify a Svelte component.';
    try {
        const instance = new component(props);
        if (!instance.$$ || !instance.$set || !instance.$on || !instance.$destroy) {
            throw new Error(error_message);
        }
        return instance;
    }
    catch (err) {
        const { message } = err;
        if (typeof message === 'string' && message.indexOf('is not a constructor') !== -1) {
            throw new Error(error_message);
        }
        else {
            throw err;
        }
    }
}
/**
 * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
 */
class SvelteComponentDev extends SvelteComponent {
    constructor(options) {
        if (!options || (!options.target && !options.$$inline)) {
            throw new Error("'target' is a required option");
        }
        super();
    }
    $destroy() {
        super.$destroy();
        this.$destroy = () => {
            console.warn('Component was already destroyed'); // eslint-disable-line no-console
        };
    }
    $capture_state() { }
    $inject_state() { }
}

const subscriber_queue = [];
/**
 * Creates a `Readable` store that allows reading by subscription.
 * @param value initial value
 * @param {StartStopNotifier} [start]
 */
function readable(value, start) {
    return {
        subscribe: writable(value, start).subscribe
    };
}
/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 * @param {*=}value initial value
 * @param {StartStopNotifier=} start
 */
function writable(value, start = noop) {
    let stop;
    const subscribers = new Set();
    function set(new_value) {
        if (safe_not_equal(value, new_value)) {
            value = new_value;
            if (stop) { // store is ready
                const run_queue = !subscriber_queue.length;
                for (const subscriber of subscribers) {
                    subscriber[1]();
                    subscriber_queue.push(subscriber, value);
                }
                if (run_queue) {
                    for (let i = 0; i < subscriber_queue.length; i += 2) {
                        subscriber_queue[i][0](subscriber_queue[i + 1]);
                    }
                    subscriber_queue.length = 0;
                }
            }
        }
    }
    function update(fn) {
        set(fn(value));
    }
    function subscribe(run, invalidate = noop) {
        const subscriber = [run, invalidate];
        subscribers.add(subscriber);
        if (subscribers.size === 1) {
            stop = start(set) || noop;
        }
        run(value);
        return () => {
            subscribers.delete(subscriber);
            if (subscribers.size === 0 && stop) {
                stop();
                stop = null;
            }
        };
    }
    return { set, update, subscribe };
}
function derived(stores, fn, initial_value) {
    const single = !Array.isArray(stores);
    const stores_array = single
        ? [stores]
        : stores;
    const auto = fn.length < 2;
    return readable(initial_value, (set) => {
        let started = false;
        const values = [];
        let pending = 0;
        let cleanup = noop;
        const sync = () => {
            if (pending) {
                return;
            }
            cleanup();
            const result = fn(single ? values[0] : values, set);
            if (auto) {
                set(result);
            }
            else {
                cleanup = is_function(result) ? result : noop;
            }
        };
        const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
            values[i] = value;
            pending &= ~(1 << i);
            if (started) {
                sync();
            }
        }, () => {
            pending |= (1 << i);
        }));
        started = true;
        sync();
        return function stop() {
            run_all(unsubscribers);
            cleanup();
            // We need to set this to false because callbacks can still happen despite having unsubscribed:
            // Callbacks might already be placed in the queue which doesn't know it should no longer
            // invoke this derived store.
            started = false;
        };
    });
}

/**
 * @external Store
 * @see [Svelte stores](https://svelte.dev/docs#component-format-script-4-prefix-stores-with-$-to-access-their-values-store-contract)
 */

/**
 * Create a store similar to [Svelte's `derived`](https://svelte.dev/docs#run-time-svelte-store-writable),
 * but which has its own `set` and `update` methods and can send values back to the origin stores.
 * [Read more...](https://github.com/PixievoltNo1/svelte-writable-derived#default-export-writablederived)
 * 
 * @param {Store|Store[]} origins One or more stores to derive from. Same as
 * [`derived`](https://svelte.dev/docs#run-time-svelte-store-writable)'s 1st parameter.
 * @param {!Function} derive The callback to determine the derived value. Same as
 * [`derived`](https://svelte.dev/docs#run-time-svelte-store-writable)'s 2nd parameter.
 * @param {!Function} reflect Called when the derived store gets a new value via its `set` or
 * `update` methods, and determines new values for the origin stores.
 * [Read more...](https://github.com/PixievoltNo1/svelte-writable-derived#new-parameter-reflect)
 * @param [initial] The new store's initial value. Same as
 * [`derived`](https://svelte.dev/docs#run-time-svelte-store-writable)'s 3rd parameter.
 * 
 * @returns {Store} A writable store.
 */
function writableDerived(origins, derive, reflect, initial) {
	var childDerivedSetter, originValues, blockNextDerive = false;
	var reflectOldValues = reflect.length >= 2;
	var wrappedDerive = (got, set, update) => {
		childDerivedSetter = set;
		if (reflectOldValues) {
			originValues = got;
		}
		if (!blockNextDerive) {
			let returned = derive(got, set, update);
			if (derive.length < 2) {
				set(returned);
			} else {
				return returned;
			}
		}
		blockNextDerive = false;
	};
	var childDerived = derived(origins, wrappedDerive, initial);
	
	var singleOrigin = !Array.isArray(origins);
	function doReflect(reflecting) {
		var setWith = reflect(reflecting, originValues);
		if (singleOrigin) {
			blockNextDerive = true;
			origins.set(setWith);
		} else {
			setWith.forEach( (value, i) => {
				blockNextDerive = true;
				origins[i].set(value);
			} );
		}
		blockNextDerive = false;
	}
	
	var tryingSet = false;
	function update(fn) {
		var isUpdated, mutatedBySubscriptions, oldValue, newValue;
		if (tryingSet) {
			newValue = fn( get_store_value(childDerived) );
			childDerivedSetter(newValue);
			return;
		}
		var unsubscribe = childDerived.subscribe( (value) => {
			if (!tryingSet) {
				oldValue = value;
			} else if (!isUpdated) {
				isUpdated = true;
			} else {
				mutatedBySubscriptions = true;
			}
		} );
		newValue = fn(oldValue);
		tryingSet = true;
		childDerivedSetter(newValue);
		unsubscribe();
		tryingSet = false;
		if (mutatedBySubscriptions) {
			newValue = get_store_value(childDerived);
		}
		if (isUpdated) {
			doReflect(newValue);
		}
	}
	return {
		subscribe: childDerived.subscribe,
		set(value) { update( () => value ); },
		update,
	};
}

const TOAST_LIMIT = 20;
const toasts = writable([]);
const pausedAt = writable(null);
const toastTimeouts = new Map();
const addToRemoveQueue = (toastId) => {
    if (toastTimeouts.has(toastId)) {
        return;
    }
    const timeout = setTimeout(() => {
        toastTimeouts.delete(toastId);
        remove(toastId);
    }, 1000);
    toastTimeouts.set(toastId, timeout);
};
const clearFromRemoveQueue = (toastId) => {
    const timeout = toastTimeouts.get(toastId);
    if (timeout) {
        clearTimeout(timeout);
    }
};
function update(toast) {
    if (toast.id) {
        clearFromRemoveQueue(toast.id);
    }
    toasts.update(($toasts) => $toasts.map((t) => (t.id === toast.id ? { ...t, ...toast } : t)));
}
function add(toast) {
    toasts.update(($toasts) => [toast, ...$toasts].slice(0, TOAST_LIMIT));
}
function upsert(toast) {
    if (get_store_value(toasts).find((t) => t.id === toast.id)) {
        update(toast);
    }
    else {
        add(toast);
    }
}
function dismiss(toastId) {
    toasts.update(($toasts) => {
        if (toastId) {
            addToRemoveQueue(toastId);
        }
        else {
            $toasts.forEach((toast) => {
                addToRemoveQueue(toast.id);
            });
        }
        return $toasts.map((t) => t.id === toastId || toastId === undefined ? { ...t, visible: false } : t);
    });
}
function remove(toastId) {
    toasts.update(($toasts) => {
        if (toastId === undefined) {
            return [];
        }
        return $toasts.filter((t) => t.id !== toastId);
    });
}
function startPause(time) {
    pausedAt.set(time);
}
function endPause(time) {
    let diff;
    pausedAt.update(($pausedAt) => {
        diff = time - ($pausedAt || 0);
        return null;
    });
    toasts.update(($toasts) => $toasts.map((t) => ({
        ...t,
        pauseDuration: t.pauseDuration + diff
    })));
}
const defaultTimeouts = {
    blank: 4000,
    error: 4000,
    success: 2000,
    loading: Infinity,
    custom: 4000
};
function useToasterStore(toastOptions = {}) {
    const mergedToasts = writableDerived(toasts, ($toasts) => $toasts.map((t) => ({
        ...toastOptions,
        ...toastOptions[t.type],
        ...t,
        duration: t.duration ||
            toastOptions[t.type]?.duration ||
            toastOptions?.duration ||
            defaultTimeouts[t.type],
        style: [toastOptions.style, toastOptions[t.type]?.style, t.style].join(';')
    })), ($toasts) => $toasts);
    return {
        toasts: mergedToasts,
        pausedAt
    };
}

const isFunction = (valOrFunction) => typeof valOrFunction === 'function';
const resolveValue = (valOrFunction, arg) => (isFunction(valOrFunction) ? valOrFunction(arg) : valOrFunction);

const genId = (() => {
    let count = 0;
    return () => {
        count += 1;
        return count.toString();
    };
})();
const prefersReducedMotion = (() => {
    // Cache result
    let shouldReduceMotion;
    return () => {
        if (shouldReduceMotion === undefined && typeof window !== 'undefined') {
            const mediaQuery = matchMedia('(prefers-reduced-motion: reduce)');
            shouldReduceMotion = !mediaQuery || mediaQuery.matches;
        }
        return shouldReduceMotion;
    };
})();

const createToast = (message, type = 'blank', opts) => ({
    createdAt: Date.now(),
    visible: true,
    type,
    ariaProps: {
        role: 'status',
        'aria-live': 'polite'
    },
    message,
    pauseDuration: 0,
    ...opts,
    id: opts?.id || genId()
});
const createHandler = (type) => (message, options) => {
    const toast = createToast(message, type, options);
    upsert(toast);
    return toast.id;
};
const toast = (message, opts) => createHandler('blank')(message, opts);
toast.error = createHandler('error');
toast.success = createHandler('success');
toast.loading = createHandler('loading');
toast.custom = createHandler('custom');
toast.dismiss = (toastId) => {
    dismiss(toastId);
};
toast.remove = (toastId) => remove(toastId);
toast.promise = (promise, msgs, opts) => {
    const id = toast.loading(msgs.loading, { ...opts, ...opts?.loading });
    promise
        .then((p) => {
        toast.success(resolveValue(msgs.success, p), {
            id,
            ...opts,
            ...opts?.success
        });
        return p;
    })
        .catch((e) => {
        toast.error(resolveValue(msgs.error, e), {
            id,
            ...opts,
            ...opts?.error
        });
    });
    return promise;
};

function calculateOffset(toast, $toasts, opts) {
    const { reverseOrder, gutter = 8, defaultPosition } = opts || {};
    const relevantToasts = $toasts.filter((t) => (t.position || defaultPosition) === (toast.position || defaultPosition) && t.height);
    const toastIndex = relevantToasts.findIndex((t) => t.id === toast.id);
    const toastsBefore = relevantToasts.filter((toast, i) => i < toastIndex && toast.visible).length;
    const offset = relevantToasts
        .filter((t) => t.visible)
        .slice(...(reverseOrder ? [toastsBefore + 1] : [0, toastsBefore]))
        .reduce((acc, t) => acc + (t.height || 0) + gutter, 0);
    return offset;
}
const handlers = {
    startPause() {
        startPause(Date.now());
    },
    endPause() {
        endPause(Date.now());
    },
    updateHeight: (toastId, height) => {
        update({ id: toastId, height });
    },
    calculateOffset
};
function useToaster(toastOptions) {
    const { toasts, pausedAt } = useToasterStore(toastOptions);
    const timeouts = new Map();
    let _pausedAt;
    const unsubscribes = [
        pausedAt.subscribe(($pausedAt) => {
            if ($pausedAt) {
                for (const [, timeoutId] of timeouts) {
                    clearTimeout(timeoutId);
                }
                timeouts.clear();
            }
            _pausedAt = $pausedAt;
        }),
        toasts.subscribe(($toasts) => {
            if (_pausedAt) {
                return;
            }
            const now = Date.now();
            for (const t of $toasts) {
                if (timeouts.has(t.id)) {
                    continue;
                }
                if (t.duration === Infinity) {
                    continue;
                }
                const durationLeft = (t.duration || 0) + t.pauseDuration - (now - t.createdAt);
                if (durationLeft < 0) {
                    if (t.visible) {
                        // FIXME: This causes a recursive cycle of updates.
                        toast.dismiss(t.id);
                    }
                    return null;
                }
                timeouts.set(t.id, setTimeout(() => toast.dismiss(t.id), durationLeft));
            }
        })
    ];
    onDestroy(() => {
        for (const unsubscribe of unsubscribes) {
            unsubscribe();
        }
    });
    return { toasts, handlers };
}

/* node_modules/svelte-french-toast/dist/components/CheckmarkIcon.svelte generated by Svelte v3.59.2 */

const file$e = "node_modules/svelte-french-toast/dist/components/CheckmarkIcon.svelte";

function create_fragment$g(ctx) {
	let div;

	const block = {
		c: function create() {
			div = element("div");
			attr_dev(div, "class", "svelte-11kvm4p");
			set_style(div, "--primary", /*primary*/ ctx[0]);
			set_style(div, "--secondary", /*secondary*/ ctx[1]);
			add_location(div, file$e, 5, 0, 148);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*primary*/ 1) {
				set_style(div, "--primary", /*primary*/ ctx[0]);
			}

			if (dirty & /*secondary*/ 2) {
				set_style(div, "--secondary", /*secondary*/ ctx[1]);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$g.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$g($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('CheckmarkIcon', slots, []);
	let { primary = "#61d345" } = $$props;
	let { secondary = "#fff" } = $$props;
	const writable_props = ['primary', 'secondary'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CheckmarkIcon> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('primary' in $$props) $$invalidate(0, primary = $$props.primary);
		if ('secondary' in $$props) $$invalidate(1, secondary = $$props.secondary);
	};

	$$self.$capture_state = () => ({ primary, secondary });

	$$self.$inject_state = $$props => {
		if ('primary' in $$props) $$invalidate(0, primary = $$props.primary);
		if ('secondary' in $$props) $$invalidate(1, secondary = $$props.secondary);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [primary, secondary];
}

class CheckmarkIcon extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$g, create_fragment$g, safe_not_equal, { primary: 0, secondary: 1 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "CheckmarkIcon",
			options,
			id: create_fragment$g.name
		});
	}

	get primary() {
		throw new Error("<CheckmarkIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set primary(value) {
		throw new Error("<CheckmarkIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get secondary() {
		throw new Error("<CheckmarkIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set secondary(value) {
		throw new Error("<CheckmarkIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* node_modules/svelte-french-toast/dist/components/ErrorIcon.svelte generated by Svelte v3.59.2 */

const file$d = "node_modules/svelte-french-toast/dist/components/ErrorIcon.svelte";

function create_fragment$f(ctx) {
	let div;

	const block = {
		c: function create() {
			div = element("div");
			attr_dev(div, "class", "svelte-1ee93ns");
			set_style(div, "--primary", /*primary*/ ctx[0]);
			set_style(div, "--secondary", /*secondary*/ ctx[1]);
			add_location(div, file$d, 5, 0, 148);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*primary*/ 1) {
				set_style(div, "--primary", /*primary*/ ctx[0]);
			}

			if (dirty & /*secondary*/ 2) {
				set_style(div, "--secondary", /*secondary*/ ctx[1]);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$f.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$f($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('ErrorIcon', slots, []);
	let { primary = "#ff4b4b" } = $$props;
	let { secondary = "#fff" } = $$props;
	const writable_props = ['primary', 'secondary'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ErrorIcon> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('primary' in $$props) $$invalidate(0, primary = $$props.primary);
		if ('secondary' in $$props) $$invalidate(1, secondary = $$props.secondary);
	};

	$$self.$capture_state = () => ({ primary, secondary });

	$$self.$inject_state = $$props => {
		if ('primary' in $$props) $$invalidate(0, primary = $$props.primary);
		if ('secondary' in $$props) $$invalidate(1, secondary = $$props.secondary);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [primary, secondary];
}

class ErrorIcon extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$f, create_fragment$f, safe_not_equal, { primary: 0, secondary: 1 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "ErrorIcon",
			options,
			id: create_fragment$f.name
		});
	}

	get primary() {
		throw new Error("<ErrorIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set primary(value) {
		throw new Error("<ErrorIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get secondary() {
		throw new Error("<ErrorIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set secondary(value) {
		throw new Error("<ErrorIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* node_modules/svelte-french-toast/dist/components/LoaderIcon.svelte generated by Svelte v3.59.2 */

const file$c = "node_modules/svelte-french-toast/dist/components/LoaderIcon.svelte";

function create_fragment$e(ctx) {
	let div;

	const block = {
		c: function create() {
			div = element("div");
			attr_dev(div, "class", "svelte-1j7dflg");
			set_style(div, "--primary", /*primary*/ ctx[0]);
			set_style(div, "--secondary", /*secondary*/ ctx[1]);
			add_location(div, file$c, 5, 0, 151);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*primary*/ 1) {
				set_style(div, "--primary", /*primary*/ ctx[0]);
			}

			if (dirty & /*secondary*/ 2) {
				set_style(div, "--secondary", /*secondary*/ ctx[1]);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$e.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$e($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('LoaderIcon', slots, []);
	let { primary = "#616161" } = $$props;
	let { secondary = "#e0e0e0" } = $$props;
	const writable_props = ['primary', 'secondary'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LoaderIcon> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('primary' in $$props) $$invalidate(0, primary = $$props.primary);
		if ('secondary' in $$props) $$invalidate(1, secondary = $$props.secondary);
	};

	$$self.$capture_state = () => ({ primary, secondary });

	$$self.$inject_state = $$props => {
		if ('primary' in $$props) $$invalidate(0, primary = $$props.primary);
		if ('secondary' in $$props) $$invalidate(1, secondary = $$props.secondary);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [primary, secondary];
}

class LoaderIcon extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$e, create_fragment$e, safe_not_equal, { primary: 0, secondary: 1 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "LoaderIcon",
			options,
			id: create_fragment$e.name
		});
	}

	get primary() {
		throw new Error("<LoaderIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set primary(value) {
		throw new Error("<LoaderIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get secondary() {
		throw new Error("<LoaderIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set secondary(value) {
		throw new Error("<LoaderIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* node_modules/svelte-french-toast/dist/components/ToastIcon.svelte generated by Svelte v3.59.2 */
const file$b = "node_modules/svelte-french-toast/dist/components/ToastIcon.svelte";

// (13:27) 
function create_if_block_2(ctx) {
	let div;
	let loadericon;
	let t;
	let current;
	const loadericon_spread_levels = [/*iconTheme*/ ctx[0]];
	let loadericon_props = {};

	for (let i = 0; i < loadericon_spread_levels.length; i += 1) {
		loadericon_props = assign(loadericon_props, loadericon_spread_levels[i]);
	}

	loadericon = new LoaderIcon({ props: loadericon_props, $$inline: true });
	let if_block = /*type*/ ctx[2] !== 'loading' && create_if_block_3(ctx);

	const block = {
		c: function create() {
			div = element("div");
			create_component(loadericon.$$.fragment);
			t = space();
			if (if_block) if_block.c();
			attr_dev(div, "class", "indicator svelte-1kgeier");
			add_location(div, file$b, 13, 1, 390);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			mount_component(loadericon, div, null);
			append_dev(div, t);
			if (if_block) if_block.m(div, null);
			current = true;
		},
		p: function update(ctx, dirty) {
			const loadericon_changes = (dirty & /*iconTheme*/ 1)
			? get_spread_update(loadericon_spread_levels, [get_spread_object(/*iconTheme*/ ctx[0])])
			: {};

			loadericon.$set(loadericon_changes);

			if (/*type*/ ctx[2] !== 'loading') {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*type*/ 4) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block_3(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(div, null);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(loadericon.$$.fragment, local);
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(loadericon.$$.fragment, local);
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_component(loadericon);
			if (if_block) if_block.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_2.name,
		type: "if",
		source: "(13:27) ",
		ctx
	});

	return block;
}

// (11:38) 
function create_if_block_1$2(ctx) {
	let switch_instance;
	let switch_instance_anchor;
	let current;
	var switch_value = /*icon*/ ctx[1];

	function switch_props(ctx) {
		return { $$inline: true };
	}

	if (switch_value) {
		switch_instance = construct_svelte_component_dev(switch_value, switch_props());
	}

	const block = {
		c: function create() {
			if (switch_instance) create_component(switch_instance.$$.fragment);
			switch_instance_anchor = empty();
		},
		m: function mount(target, anchor) {
			if (switch_instance) mount_component(switch_instance, target, anchor);
			insert_dev(target, switch_instance_anchor, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			if (dirty & /*icon*/ 2 && switch_value !== (switch_value = /*icon*/ ctx[1])) {
				if (switch_instance) {
					group_outros();
					const old_component = switch_instance;

					transition_out(old_component.$$.fragment, 1, 0, () => {
						destroy_component(old_component, 1);
					});

					check_outros();
				}

				if (switch_value) {
					switch_instance = construct_svelte_component_dev(switch_value, switch_props());
					create_component(switch_instance.$$.fragment);
					transition_in(switch_instance.$$.fragment, 1);
					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
				} else {
					switch_instance = null;
				}
			}
		},
		i: function intro(local) {
			if (current) return;
			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(switch_instance_anchor);
			if (switch_instance) destroy_component(switch_instance, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$2.name,
		type: "if",
		source: "(11:38) ",
		ctx
	});

	return block;
}

// (9:0) {#if typeof icon === 'string'}
function create_if_block$6(ctx) {
	let div;
	let t;

	const block = {
		c: function create() {
			div = element("div");
			t = text(/*icon*/ ctx[1]);
			attr_dev(div, "class", "animated svelte-1kgeier");
			add_location(div, file$b, 9, 1, 253);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*icon*/ 2) set_data_dev(t, /*icon*/ ctx[1]);
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$6.name,
		type: "if",
		source: "(9:0) {#if typeof icon === 'string'}",
		ctx
	});

	return block;
}

// (16:2) {#if type !== 'loading'}
function create_if_block_3(ctx) {
	let div;
	let current_block_type_index;
	let if_block;
	let current;
	const if_block_creators = [create_if_block_4, create_else_block$5];
	const if_blocks = [];

	function select_block_type_1(ctx, dirty) {
		if (/*type*/ ctx[2] === 'error') return 0;
		return 1;
	}

	current_block_type_index = select_block_type_1(ctx);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	const block = {
		c: function create() {
			div = element("div");
			if_block.c();
			attr_dev(div, "class", "status svelte-1kgeier");
			add_location(div, file$b, 16, 3, 476);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			if_blocks[current_block_type_index].m(div, null);
			current = true;
		},
		p: function update(ctx, dirty) {
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type_1(ctx);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(ctx, dirty);
			} else {
				group_outros();

				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				check_outros();
				if_block = if_blocks[current_block_type_index];

				if (!if_block) {
					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block.c();
				} else {
					if_block.p(ctx, dirty);
				}

				transition_in(if_block, 1);
				if_block.m(div, null);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if_blocks[current_block_type_index].d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_3.name,
		type: "if",
		source: "(16:2) {#if type !== 'loading'}",
		ctx
	});

	return block;
}

// (20:4) {:else}
function create_else_block$5(ctx) {
	let checkmarkicon;
	let current;
	const checkmarkicon_spread_levels = [/*iconTheme*/ ctx[0]];
	let checkmarkicon_props = {};

	for (let i = 0; i < checkmarkicon_spread_levels.length; i += 1) {
		checkmarkicon_props = assign(checkmarkicon_props, checkmarkicon_spread_levels[i]);
	}

	checkmarkicon = new CheckmarkIcon({
			props: checkmarkicon_props,
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(checkmarkicon.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(checkmarkicon, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const checkmarkicon_changes = (dirty & /*iconTheme*/ 1)
			? get_spread_update(checkmarkicon_spread_levels, [get_spread_object(/*iconTheme*/ ctx[0])])
			: {};

			checkmarkicon.$set(checkmarkicon_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(checkmarkicon.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(checkmarkicon.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(checkmarkicon, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block$5.name,
		type: "else",
		source: "(20:4) {:else}",
		ctx
	});

	return block;
}

// (18:4) {#if type === 'error'}
function create_if_block_4(ctx) {
	let erroricon;
	let current;
	const erroricon_spread_levels = [/*iconTheme*/ ctx[0]];
	let erroricon_props = {};

	for (let i = 0; i < erroricon_spread_levels.length; i += 1) {
		erroricon_props = assign(erroricon_props, erroricon_spread_levels[i]);
	}

	erroricon = new ErrorIcon({ props: erroricon_props, $$inline: true });

	const block = {
		c: function create() {
			create_component(erroricon.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(erroricon, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const erroricon_changes = (dirty & /*iconTheme*/ 1)
			? get_spread_update(erroricon_spread_levels, [get_spread_object(/*iconTheme*/ ctx[0])])
			: {};

			erroricon.$set(erroricon_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(erroricon.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(erroricon.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(erroricon, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_4.name,
		type: "if",
		source: "(18:4) {#if type === 'error'}",
		ctx
	});

	return block;
}

function create_fragment$d(ctx) {
	let current_block_type_index;
	let if_block;
	let if_block_anchor;
	let current;
	const if_block_creators = [create_if_block$6, create_if_block_1$2, create_if_block_2];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (typeof /*icon*/ ctx[1] === 'string') return 0;
		if (typeof /*icon*/ ctx[1] !== 'undefined') return 1;
		if (/*type*/ ctx[2] !== 'blank') return 2;
		return -1;
	}

	if (~(current_block_type_index = select_block_type(ctx))) {
		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
	}

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if (~current_block_type_index) {
				if_blocks[current_block_type_index].m(target, anchor);
			}

			insert_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx);

			if (current_block_type_index === previous_block_index) {
				if (~current_block_type_index) {
					if_blocks[current_block_type_index].p(ctx, dirty);
				}
			} else {
				if (if_block) {
					group_outros();

					transition_out(if_blocks[previous_block_index], 1, 1, () => {
						if_blocks[previous_block_index] = null;
					});

					check_outros();
				}

				if (~current_block_type_index) {
					if_block = if_blocks[current_block_type_index];

					if (!if_block) {
						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
						if_block.c();
					} else {
						if_block.p(ctx, dirty);
					}

					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				} else {
					if_block = null;
				}
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (~current_block_type_index) {
				if_blocks[current_block_type_index].d(detaching);
			}

			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$d.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$d($$self, $$props, $$invalidate) {
	let type;
	let icon;
	let iconTheme;
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('ToastIcon', slots, []);
	let { toast } = $$props;

	$$self.$$.on_mount.push(function () {
		if (toast === undefined && !('toast' in $$props || $$self.$$.bound[$$self.$$.props['toast']])) {
			console.warn("<ToastIcon> was created without expected prop 'toast'");
		}
	});

	const writable_props = ['toast'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ToastIcon> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('toast' in $$props) $$invalidate(3, toast = $$props.toast);
	};

	$$self.$capture_state = () => ({
		CheckmarkIcon,
		ErrorIcon,
		LoaderIcon,
		toast,
		iconTheme,
		icon,
		type
	});

	$$self.$inject_state = $$props => {
		if ('toast' in $$props) $$invalidate(3, toast = $$props.toast);
		if ('iconTheme' in $$props) $$invalidate(0, iconTheme = $$props.iconTheme);
		if ('icon' in $$props) $$invalidate(1, icon = $$props.icon);
		if ('type' in $$props) $$invalidate(2, type = $$props.type);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*toast*/ 8) {
			$$invalidate(2, { type, icon, iconTheme } = toast, type, ($$invalidate(1, icon), $$invalidate(3, toast)), ($$invalidate(0, iconTheme), $$invalidate(3, toast)));
		}
	};

	return [iconTheme, icon, type, toast];
}

class ToastIcon extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$d, create_fragment$d, safe_not_equal, { toast: 3 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "ToastIcon",
			options,
			id: create_fragment$d.name
		});
	}

	get toast() {
		throw new Error("<ToastIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set toast(value) {
		throw new Error("<ToastIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* node_modules/svelte-french-toast/dist/components/ToastMessage.svelte generated by Svelte v3.59.2 */

const file$a = "node_modules/svelte-french-toast/dist/components/ToastMessage.svelte";

// (7:1) {:else}
function create_else_block$4(ctx) {
	let switch_instance;
	let switch_instance_anchor;
	let current;
	var switch_value = /*toast*/ ctx[0].message;

	function switch_props(ctx) {
		return {
			props: { toast: /*toast*/ ctx[0] },
			$$inline: true
		};
	}

	if (switch_value) {
		switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
	}

	const block = {
		c: function create() {
			if (switch_instance) create_component(switch_instance.$$.fragment);
			switch_instance_anchor = empty();
		},
		m: function mount(target, anchor) {
			if (switch_instance) mount_component(switch_instance, target, anchor);
			insert_dev(target, switch_instance_anchor, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const switch_instance_changes = {};
			if (dirty & /*toast*/ 1) switch_instance_changes.toast = /*toast*/ ctx[0];

			if (dirty & /*toast*/ 1 && switch_value !== (switch_value = /*toast*/ ctx[0].message)) {
				if (switch_instance) {
					group_outros();
					const old_component = switch_instance;

					transition_out(old_component.$$.fragment, 1, 0, () => {
						destroy_component(old_component, 1);
					});

					check_outros();
				}

				if (switch_value) {
					switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
					create_component(switch_instance.$$.fragment);
					transition_in(switch_instance.$$.fragment, 1);
					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
				} else {
					switch_instance = null;
				}
			} else if (switch_value) {
				switch_instance.$set(switch_instance_changes);
			}
		},
		i: function intro(local) {
			if (current) return;
			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(switch_instance_anchor);
			if (switch_instance) destroy_component(switch_instance, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block$4.name,
		type: "else",
		source: "(7:1) {:else}",
		ctx
	});

	return block;
}

// (5:1) {#if typeof toast.message === 'string'}
function create_if_block$5(ctx) {
	let t_value = /*toast*/ ctx[0].message + "";
	let t;

	const block = {
		c: function create() {
			t = text(t_value);
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*toast*/ 1 && t_value !== (t_value = /*toast*/ ctx[0].message + "")) set_data_dev(t, t_value);
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$5.name,
		type: "if",
		source: "(5:1) {#if typeof toast.message === 'string'}",
		ctx
	});

	return block;
}

function create_fragment$c(ctx) {
	let div;
	let current_block_type_index;
	let if_block;
	let current;
	const if_block_creators = [create_if_block$5, create_else_block$4];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (typeof /*toast*/ ctx[0].message === 'string') return 0;
		return 1;
	}

	current_block_type_index = select_block_type(ctx);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
	let div_levels = [{ class: "message" }, /*toast*/ ctx[0].ariaProps];
	let div_data = {};

	for (let i = 0; i < div_levels.length; i += 1) {
		div_data = assign(div_data, div_levels[i]);
	}

	const block = {
		c: function create() {
			div = element("div");
			if_block.c();
			set_attributes(div, div_data);
			toggle_class(div, "svelte-1nauejd", true);
			add_location(div, file$a, 3, 0, 37);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			if_blocks[current_block_type_index].m(div, null);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(ctx, dirty);
			} else {
				group_outros();

				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				check_outros();
				if_block = if_blocks[current_block_type_index];

				if (!if_block) {
					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block.c();
				} else {
					if_block.p(ctx, dirty);
				}

				transition_in(if_block, 1);
				if_block.m(div, null);
			}

			set_attributes(div, div_data = get_spread_update(div_levels, [{ class: "message" }, dirty & /*toast*/ 1 && /*toast*/ ctx[0].ariaProps]));
			toggle_class(div, "svelte-1nauejd", true);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if_blocks[current_block_type_index].d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$c.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$c($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('ToastMessage', slots, []);
	let { toast } = $$props;

	$$self.$$.on_mount.push(function () {
		if (toast === undefined && !('toast' in $$props || $$self.$$.bound[$$self.$$.props['toast']])) {
			console.warn("<ToastMessage> was created without expected prop 'toast'");
		}
	});

	const writable_props = ['toast'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ToastMessage> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('toast' in $$props) $$invalidate(0, toast = $$props.toast);
	};

	$$self.$capture_state = () => ({ toast });

	$$self.$inject_state = $$props => {
		if ('toast' in $$props) $$invalidate(0, toast = $$props.toast);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [toast];
}

class ToastMessage extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$c, create_fragment$c, safe_not_equal, { toast: 0 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "ToastMessage",
			options,
			id: create_fragment$c.name
		});
	}

	get toast() {
		throw new Error("<ToastMessage>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set toast(value) {
		throw new Error("<ToastMessage>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* node_modules/svelte-french-toast/dist/components/ToastBar.svelte generated by Svelte v3.59.2 */
const file$9 = "node_modules/svelte-french-toast/dist/components/ToastBar.svelte";
const get_default_slot_changes$4 = dirty => ({ toast: dirty & /*toast*/ 1 });

const get_default_slot_context$4 = ctx => ({
	ToastIcon,
	ToastMessage,
	toast: /*toast*/ ctx[0]
});

// (28:1) {:else}
function create_else_block$3(ctx) {
	let current;
	const default_slot_template = /*#slots*/ ctx[6].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], get_default_slot_context$4);
	const default_slot_or_fallback = default_slot || fallback_block$1(ctx);

	const block = {
		c: function create() {
			if (default_slot_or_fallback) default_slot_or_fallback.c();
		},
		m: function mount(target, anchor) {
			if (default_slot_or_fallback) {
				default_slot_or_fallback.m(target, anchor);
			}

			current = true;
		},
		p: function update(ctx, dirty) {
			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope, toast*/ 129)) {
					update_slot_base(
						default_slot,
						default_slot_template,
						ctx,
						/*$$scope*/ ctx[7],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[7], dirty, get_default_slot_changes$4),
						get_default_slot_context$4
					);
				}
			} else {
				if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty & /*toast*/ 1)) {
					default_slot_or_fallback.p(ctx, !current ? -1 : dirty);
				}
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot_or_fallback, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot_or_fallback, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block$3.name,
		type: "else",
		source: "(28:1) {:else}",
		ctx
	});

	return block;
}

// (23:1) {#if Component}
function create_if_block$4(ctx) {
	let switch_instance;
	let switch_instance_anchor;
	let current;
	var switch_value = /*Component*/ ctx[2];

	function switch_props(ctx) {
		return {
			props: {
				$$slots: {
					message: [create_message_slot],
					icon: [create_icon_slot]
				},
				$$scope: { ctx }
			},
			$$inline: true
		};
	}

	if (switch_value) {
		switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
	}

	const block = {
		c: function create() {
			if (switch_instance) create_component(switch_instance.$$.fragment);
			switch_instance_anchor = empty();
		},
		m: function mount(target, anchor) {
			if (switch_instance) mount_component(switch_instance, target, anchor);
			insert_dev(target, switch_instance_anchor, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const switch_instance_changes = {};

			if (dirty & /*$$scope, toast*/ 129) {
				switch_instance_changes.$$scope = { dirty, ctx };
			}

			if (dirty & /*Component*/ 4 && switch_value !== (switch_value = /*Component*/ ctx[2])) {
				if (switch_instance) {
					group_outros();
					const old_component = switch_instance;

					transition_out(old_component.$$.fragment, 1, 0, () => {
						destroy_component(old_component, 1);
					});

					check_outros();
				}

				if (switch_value) {
					switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
					create_component(switch_instance.$$.fragment);
					transition_in(switch_instance.$$.fragment, 1);
					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
				} else {
					switch_instance = null;
				}
			} else if (switch_value) {
				switch_instance.$set(switch_instance_changes);
			}
		},
		i: function intro(local) {
			if (current) return;
			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(switch_instance_anchor);
			if (switch_instance) destroy_component(switch_instance, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$4.name,
		type: "if",
		source: "(23:1) {#if Component}",
		ctx
	});

	return block;
}

// (29:43)     
function fallback_block$1(ctx) {
	let toasticon;
	let t;
	let toastmessage;
	let current;

	toasticon = new ToastIcon({
			props: { toast: /*toast*/ ctx[0] },
			$$inline: true
		});

	toastmessage = new ToastMessage({
			props: { toast: /*toast*/ ctx[0] },
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(toasticon.$$.fragment);
			t = space();
			create_component(toastmessage.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(toasticon, target, anchor);
			insert_dev(target, t, anchor);
			mount_component(toastmessage, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const toasticon_changes = {};
			if (dirty & /*toast*/ 1) toasticon_changes.toast = /*toast*/ ctx[0];
			toasticon.$set(toasticon_changes);
			const toastmessage_changes = {};
			if (dirty & /*toast*/ 1) toastmessage_changes.toast = /*toast*/ ctx[0];
			toastmessage.$set(toastmessage_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(toasticon.$$.fragment, local);
			transition_in(toastmessage.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(toasticon.$$.fragment, local);
			transition_out(toastmessage.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(toasticon, detaching);
			if (detaching) detach_dev(t);
			destroy_component(toastmessage, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: fallback_block$1.name,
		type: "fallback",
		source: "(29:43)     ",
		ctx
	});

	return block;
}

// (25:3) 
function create_icon_slot(ctx) {
	let toasticon;
	let current;

	toasticon = new ToastIcon({
			props: { toast: /*toast*/ ctx[0], slot: "icon" },
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(toasticon.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(toasticon, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const toasticon_changes = {};
			if (dirty & /*toast*/ 1) toasticon_changes.toast = /*toast*/ ctx[0];
			toasticon.$set(toasticon_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(toasticon.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(toasticon.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(toasticon, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_icon_slot.name,
		type: "slot",
		source: "(25:3) ",
		ctx
	});

	return block;
}

// (26:3) 
function create_message_slot(ctx) {
	let toastmessage;
	let current;

	toastmessage = new ToastMessage({
			props: { toast: /*toast*/ ctx[0], slot: "message" },
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(toastmessage.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(toastmessage, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const toastmessage_changes = {};
			if (dirty & /*toast*/ 1) toastmessage_changes.toast = /*toast*/ ctx[0];
			toastmessage.$set(toastmessage_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(toastmessage.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(toastmessage.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(toastmessage, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_message_slot.name,
		type: "slot",
		source: "(26:3) ",
		ctx
	});

	return block;
}

function create_fragment$b(ctx) {
	let div;
	let current_block_type_index;
	let if_block;
	let div_class_value;
	let div_style_value;
	let current;
	const if_block_creators = [create_if_block$4, create_else_block$3];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*Component*/ ctx[2]) return 0;
		return 1;
	}

	current_block_type_index = select_block_type(ctx);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	const block = {
		c: function create() {
			div = element("div");
			if_block.c();

			attr_dev(div, "class", div_class_value = "base " + (/*toast*/ ctx[0].height
			? /*animation*/ ctx[4]
			: 'transparent') + " " + (/*toast*/ ctx[0].className || '') + " svelte-ug60r4");

			attr_dev(div, "style", div_style_value = "" + (/*style*/ ctx[1] + "; " + /*toast*/ ctx[0].style));
			set_style(div, "--factor", /*factor*/ ctx[3]);
			add_location(div, file$9, 17, 0, 540);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			if_blocks[current_block_type_index].m(div, null);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(ctx, dirty);
			} else {
				group_outros();

				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				check_outros();
				if_block = if_blocks[current_block_type_index];

				if (!if_block) {
					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block.c();
				} else {
					if_block.p(ctx, dirty);
				}

				transition_in(if_block, 1);
				if_block.m(div, null);
			}

			if (!current || dirty & /*toast, animation*/ 17 && div_class_value !== (div_class_value = "base " + (/*toast*/ ctx[0].height
			? /*animation*/ ctx[4]
			: 'transparent') + " " + (/*toast*/ ctx[0].className || '') + " svelte-ug60r4")) {
				attr_dev(div, "class", div_class_value);
			}

			if (!current || dirty & /*style, toast*/ 3 && div_style_value !== (div_style_value = "" + (/*style*/ ctx[1] + "; " + /*toast*/ ctx[0].style))) {
				attr_dev(div, "style", div_style_value);
			}

			const style_changed = dirty & /*style, toast*/ 3;

			if (style_changed || dirty & /*factor, style, toast*/ 11) {
				set_style(div, "--factor", /*factor*/ ctx[3]);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if_blocks[current_block_type_index].d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$b.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$b($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('ToastBar', slots, ['default']);
	let { toast } = $$props;
	let { position = void 0 } = $$props;
	let { style = "" } = $$props;
	let { Component = void 0 } = $$props;
	let factor;
	let animation;

	$$self.$$.on_mount.push(function () {
		if (toast === undefined && !('toast' in $$props || $$self.$$.bound[$$self.$$.props['toast']])) {
			console.warn("<ToastBar> was created without expected prop 'toast'");
		}
	});

	const writable_props = ['toast', 'position', 'style', 'Component'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ToastBar> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('toast' in $$props) $$invalidate(0, toast = $$props.toast);
		if ('position' in $$props) $$invalidate(5, position = $$props.position);
		if ('style' in $$props) $$invalidate(1, style = $$props.style);
		if ('Component' in $$props) $$invalidate(2, Component = $$props.Component);
		if ('$$scope' in $$props) $$invalidate(7, $$scope = $$props.$$scope);
	};

	$$self.$capture_state = () => ({
		ToastIcon,
		prefersReducedMotion,
		ToastMessage,
		toast,
		position,
		style,
		Component,
		factor,
		animation
	});

	$$self.$inject_state = $$props => {
		if ('toast' in $$props) $$invalidate(0, toast = $$props.toast);
		if ('position' in $$props) $$invalidate(5, position = $$props.position);
		if ('style' in $$props) $$invalidate(1, style = $$props.style);
		if ('Component' in $$props) $$invalidate(2, Component = $$props.Component);
		if ('factor' in $$props) $$invalidate(3, factor = $$props.factor);
		if ('animation' in $$props) $$invalidate(4, animation = $$props.animation);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*toast, position*/ 33) {
			{
				const top = (toast.position || position || "top-center").includes("top");
				$$invalidate(3, factor = top ? 1 : -1);

				const [enter, exit] = prefersReducedMotion()
				? ["fadeIn", "fadeOut"]
				: ["enter", "exit"];

				$$invalidate(4, animation = toast.visible ? enter : exit);
			}
		}
	};

	return [toast, style, Component, factor, animation, position, slots, $$scope];
}

class ToastBar extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$b, create_fragment$b, safe_not_equal, {
			toast: 0,
			position: 5,
			style: 1,
			Component: 2
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "ToastBar",
			options,
			id: create_fragment$b.name
		});
	}

	get toast() {
		throw new Error("<ToastBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set toast(value) {
		throw new Error("<ToastBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get position() {
		throw new Error("<ToastBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set position(value) {
		throw new Error("<ToastBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get style() {
		throw new Error("<ToastBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set style(value) {
		throw new Error("<ToastBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get Component() {
		throw new Error("<ToastBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set Component(value) {
		throw new Error("<ToastBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* node_modules/svelte-french-toast/dist/components/ToastWrapper.svelte generated by Svelte v3.59.2 */
const file$8 = "node_modules/svelte-french-toast/dist/components/ToastWrapper.svelte";
const get_default_slot_changes$3 = dirty => ({ toast: dirty & /*toast*/ 1 });
const get_default_slot_context$3 = ctx => ({ toast: /*toast*/ ctx[0] });

// (34:1) {:else}
function create_else_block$2(ctx) {
	let current;
	const default_slot_template = /*#slots*/ ctx[8].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], get_default_slot_context$3);
	const default_slot_or_fallback = default_slot || fallback_block(ctx);

	const block = {
		c: function create() {
			if (default_slot_or_fallback) default_slot_or_fallback.c();
		},
		m: function mount(target, anchor) {
			if (default_slot_or_fallback) {
				default_slot_or_fallback.m(target, anchor);
			}

			current = true;
		},
		p: function update(ctx, dirty) {
			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope, toast*/ 129)) {
					update_slot_base(
						default_slot,
						default_slot_template,
						ctx,
						/*$$scope*/ ctx[7],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[7], dirty, get_default_slot_changes$3),
						get_default_slot_context$3
					);
				}
			} else {
				if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty & /*toast*/ 1)) {
					default_slot_or_fallback.p(ctx, !current ? -1 : dirty);
				}
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot_or_fallback, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot_or_fallback, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block$2.name,
		type: "else",
		source: "(34:1) {:else}",
		ctx
	});

	return block;
}

// (32:1) {#if toast.type === 'custom'}
function create_if_block$3(ctx) {
	let toastmessage;
	let current;

	toastmessage = new ToastMessage({
			props: { toast: /*toast*/ ctx[0] },
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(toastmessage.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(toastmessage, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const toastmessage_changes = {};
			if (dirty & /*toast*/ 1) toastmessage_changes.toast = /*toast*/ ctx[0];
			toastmessage.$set(toastmessage_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(toastmessage.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(toastmessage.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(toastmessage, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$3.name,
		type: "if",
		source: "(32:1) {#if toast.type === 'custom'}",
		ctx
	});

	return block;
}

// (35:16)     
function fallback_block(ctx) {
	let toastbar;
	let current;

	toastbar = new ToastBar({
			props: {
				toast: /*toast*/ ctx[0],
				position: /*toast*/ ctx[0].position
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(toastbar.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(toastbar, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const toastbar_changes = {};
			if (dirty & /*toast*/ 1) toastbar_changes.toast = /*toast*/ ctx[0];
			if (dirty & /*toast*/ 1) toastbar_changes.position = /*toast*/ ctx[0].position;
			toastbar.$set(toastbar_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(toastbar.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(toastbar.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(toastbar, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: fallback_block.name,
		type: "fallback",
		source: "(35:16)     ",
		ctx
	});

	return block;
}

function create_fragment$a(ctx) {
	let div;
	let current_block_type_index;
	let if_block;
	let current;
	const if_block_creators = [create_if_block$3, create_else_block$2];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*toast*/ ctx[0].type === 'custom') return 0;
		return 1;
	}

	current_block_type_index = select_block_type(ctx);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	const block = {
		c: function create() {
			div = element("div");
			if_block.c();
			attr_dev(div, "class", "wrapper svelte-v01oml");
			toggle_class(div, "active", /*toast*/ ctx[0].visible);
			toggle_class(div, "transition", !prefersReducedMotion());
			set_style(div, "--factor", /*factor*/ ctx[3]);
			set_style(div, "--offset", /*toast*/ ctx[0].offset);
			set_style(div, "top", /*top*/ ctx[5]);
			set_style(div, "bottom", /*bottom*/ ctx[4]);
			set_style(div, "justify-content", /*justifyContent*/ ctx[2]);
			add_location(div, file$8, 20, 0, 667);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			if_blocks[current_block_type_index].m(div, null);
			/*div_binding*/ ctx[9](div);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(ctx, dirty);
			} else {
				group_outros();

				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				check_outros();
				if_block = if_blocks[current_block_type_index];

				if (!if_block) {
					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block.c();
				} else {
					if_block.p(ctx, dirty);
				}

				transition_in(if_block, 1);
				if_block.m(div, null);
			}

			if (!current || dirty & /*toast*/ 1) {
				toggle_class(div, "active", /*toast*/ ctx[0].visible);
			}

			if (dirty & /*factor*/ 8) {
				set_style(div, "--factor", /*factor*/ ctx[3]);
			}

			if (dirty & /*toast*/ 1) {
				set_style(div, "--offset", /*toast*/ ctx[0].offset);
			}

			if (dirty & /*top*/ 32) {
				set_style(div, "top", /*top*/ ctx[5]);
			}

			if (dirty & /*bottom*/ 16) {
				set_style(div, "bottom", /*bottom*/ ctx[4]);
			}

			if (dirty & /*justifyContent*/ 4) {
				set_style(div, "justify-content", /*justifyContent*/ ctx[2]);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if_blocks[current_block_type_index].d();
			/*div_binding*/ ctx[9](null);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$a.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$a($$self, $$props, $$invalidate) {
	let top;
	let bottom;
	let factor;
	let justifyContent;
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('ToastWrapper', slots, ['default']);
	let { toast } = $$props;
	let { setHeight } = $$props;
	let wrapperEl;

	onMount(() => {
		setHeight(wrapperEl.getBoundingClientRect().height);
	});

	$$self.$$.on_mount.push(function () {
		if (toast === undefined && !('toast' in $$props || $$self.$$.bound[$$self.$$.props['toast']])) {
			console.warn("<ToastWrapper> was created without expected prop 'toast'");
		}

		if (setHeight === undefined && !('setHeight' in $$props || $$self.$$.bound[$$self.$$.props['setHeight']])) {
			console.warn("<ToastWrapper> was created without expected prop 'setHeight'");
		}
	});

	const writable_props = ['toast', 'setHeight'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ToastWrapper> was created with unknown prop '${key}'`);
	});

	function div_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			wrapperEl = $$value;
			$$invalidate(1, wrapperEl);
		});
	}

	$$self.$$set = $$props => {
		if ('toast' in $$props) $$invalidate(0, toast = $$props.toast);
		if ('setHeight' in $$props) $$invalidate(6, setHeight = $$props.setHeight);
		if ('$$scope' in $$props) $$invalidate(7, $$scope = $$props.$$scope);
	};

	$$self.$capture_state = () => ({
		onMount,
		prefersReducedMotion,
		ToastBar,
		ToastMessage,
		toast,
		setHeight,
		wrapperEl,
		justifyContent,
		factor,
		bottom,
		top
	});

	$$self.$inject_state = $$props => {
		if ('toast' in $$props) $$invalidate(0, toast = $$props.toast);
		if ('setHeight' in $$props) $$invalidate(6, setHeight = $$props.setHeight);
		if ('wrapperEl' in $$props) $$invalidate(1, wrapperEl = $$props.wrapperEl);
		if ('justifyContent' in $$props) $$invalidate(2, justifyContent = $$props.justifyContent);
		if ('factor' in $$props) $$invalidate(3, factor = $$props.factor);
		if ('bottom' in $$props) $$invalidate(4, bottom = $$props.bottom);
		if ('top' in $$props) $$invalidate(5, top = $$props.top);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*toast*/ 1) {
			$$invalidate(5, top = (toast.position?.includes("top")) ? 0 : null);
		}

		if ($$self.$$.dirty & /*toast*/ 1) {
			$$invalidate(4, bottom = (toast.position?.includes("bottom")) ? 0 : null);
		}

		if ($$self.$$.dirty & /*toast*/ 1) {
			$$invalidate(3, factor = (toast.position?.includes("top")) ? 1 : -1);
		}

		if ($$self.$$.dirty & /*toast*/ 1) {
			$$invalidate(2, justifyContent = toast.position?.includes("center") && "center" || (toast.position?.includes("right") || toast.position?.includes("end")) && "flex-end" || null);
		}
	};

	return [
		toast,
		wrapperEl,
		justifyContent,
		factor,
		bottom,
		top,
		setHeight,
		$$scope,
		slots,
		div_binding
	];
}

class ToastWrapper extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$a, create_fragment$a, safe_not_equal, { toast: 0, setHeight: 6 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "ToastWrapper",
			options,
			id: create_fragment$a.name
		});
	}

	get toast() {
		throw new Error("<ToastWrapper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set toast(value) {
		throw new Error("<ToastWrapper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get setHeight() {
		throw new Error("<ToastWrapper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set setHeight(value) {
		throw new Error("<ToastWrapper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* node_modules/svelte-french-toast/dist/components/Toaster.svelte generated by Svelte v3.59.2 */
const file$7 = "node_modules/svelte-french-toast/dist/components/Toaster.svelte";

function get_each_context$2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[11] = list[i];
	return child_ctx;
}

// (30:1) {#each _toasts as toast (toast.id)}
function create_each_block$2(key_1, ctx) {
	let first;
	let toastwrapper;
	let current;

	function func(...args) {
		return /*func*/ ctx[10](/*toast*/ ctx[11], ...args);
	}

	toastwrapper = new ToastWrapper({
			props: {
				toast: /*toast*/ ctx[11],
				setHeight: func
			},
			$$inline: true
		});

	const block = {
		key: key_1,
		first: null,
		c: function create() {
			first = empty();
			create_component(toastwrapper.$$.fragment);
			this.first = first;
		},
		m: function mount(target, anchor) {
			insert_dev(target, first, anchor);
			mount_component(toastwrapper, target, anchor);
			current = true;
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;
			const toastwrapper_changes = {};
			if (dirty & /*_toasts*/ 4) toastwrapper_changes.toast = /*toast*/ ctx[11];
			if (dirty & /*_toasts*/ 4) toastwrapper_changes.setHeight = func;
			toastwrapper.$set(toastwrapper_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(toastwrapper.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(toastwrapper.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(first);
			destroy_component(toastwrapper, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$2.name,
		type: "each",
		source: "(30:1) {#each _toasts as toast (toast.id)}",
		ctx
	});

	return block;
}

function create_fragment$9(ctx) {
	let div;
	let each_blocks = [];
	let each_1_lookup = new Map();
	let div_class_value;
	let current;
	let mounted;
	let dispose;
	let each_value = /*_toasts*/ ctx[2];
	validate_each_argument(each_value);
	const get_key = ctx => /*toast*/ ctx[11].id;
	validate_each_keys(ctx, each_value, get_each_context$2, get_key);

	for (let i = 0; i < each_value.length; i += 1) {
		let child_ctx = get_each_context$2(ctx, each_value, i);
		let key = get_key(child_ctx);
		each_1_lookup.set(key, each_blocks[i] = create_each_block$2(key, child_ctx));
	}

	const block = {
		c: function create() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(div, "class", div_class_value = "toaster " + (/*containerClassName*/ ctx[1] || '') + " svelte-1phplh9");
			attr_dev(div, "style", /*containerStyle*/ ctx[0]);
			attr_dev(div, "role", "alert");
			add_location(div, file$7, 22, 0, 617);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div, null);
				}
			}

			current = true;

			if (!mounted) {
				dispose = [
					listen_dev(div, "mouseenter", /*handlers*/ ctx[4].startPause, false, false, false, false),
					listen_dev(div, "mouseleave", /*handlers*/ ctx[4].endPause, false, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*_toasts, handlers*/ 20) {
				each_value = /*_toasts*/ ctx[2];
				validate_each_argument(each_value);
				group_outros();
				validate_each_keys(ctx, each_value, get_each_context$2, get_key);
				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div, outro_and_destroy_block, create_each_block$2, null, get_each_context$2);
				check_outros();
			}

			if (!current || dirty & /*containerClassName*/ 2 && div_class_value !== (div_class_value = "toaster " + (/*containerClassName*/ ctx[1] || '') + " svelte-1phplh9")) {
				attr_dev(div, "class", div_class_value);
			}

			if (!current || dirty & /*containerStyle*/ 1) {
				attr_dev(div, "style", /*containerStyle*/ ctx[0]);
			}
		},
		i: function intro(local) {
			if (current) return;

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o: function outro(local) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].d();
			}

			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$9.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$9($$self, $$props, $$invalidate) {
	let $toasts;
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Toaster', slots, []);
	let { reverseOrder = false } = $$props;
	let { position = "top-center" } = $$props;
	let { toastOptions = void 0 } = $$props;
	let { gutter = 8 } = $$props;
	let { containerStyle = void 0 } = $$props;
	let { containerClassName = void 0 } = $$props;
	const { toasts, handlers } = useToaster(toastOptions);
	validate_store(toasts, 'toasts');
	component_subscribe($$self, toasts, value => $$invalidate(9, $toasts = value));
	let _toasts;

	const writable_props = [
		'reverseOrder',
		'position',
		'toastOptions',
		'gutter',
		'containerStyle',
		'containerClassName'
	];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Toaster> was created with unknown prop '${key}'`);
	});

	const func = (toast, height) => handlers.updateHeight(toast.id, height);

	$$self.$$set = $$props => {
		if ('reverseOrder' in $$props) $$invalidate(5, reverseOrder = $$props.reverseOrder);
		if ('position' in $$props) $$invalidate(6, position = $$props.position);
		if ('toastOptions' in $$props) $$invalidate(7, toastOptions = $$props.toastOptions);
		if ('gutter' in $$props) $$invalidate(8, gutter = $$props.gutter);
		if ('containerStyle' in $$props) $$invalidate(0, containerStyle = $$props.containerStyle);
		if ('containerClassName' in $$props) $$invalidate(1, containerClassName = $$props.containerClassName);
	};

	$$self.$capture_state = () => ({
		useToaster,
		ToastWrapper,
		reverseOrder,
		position,
		toastOptions,
		gutter,
		containerStyle,
		containerClassName,
		toasts,
		handlers,
		_toasts,
		$toasts
	});

	$$self.$inject_state = $$props => {
		if ('reverseOrder' in $$props) $$invalidate(5, reverseOrder = $$props.reverseOrder);
		if ('position' in $$props) $$invalidate(6, position = $$props.position);
		if ('toastOptions' in $$props) $$invalidate(7, toastOptions = $$props.toastOptions);
		if ('gutter' in $$props) $$invalidate(8, gutter = $$props.gutter);
		if ('containerStyle' in $$props) $$invalidate(0, containerStyle = $$props.containerStyle);
		if ('containerClassName' in $$props) $$invalidate(1, containerClassName = $$props.containerClassName);
		if ('_toasts' in $$props) $$invalidate(2, _toasts = $$props._toasts);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*$toasts, position, reverseOrder, gutter*/ 864) {
			$$invalidate(2, _toasts = $toasts.map(toast => ({
				...toast,
				position: toast.position || position,
				offset: handlers.calculateOffset(toast, $toasts, {
					reverseOrder,
					gutter,
					defaultPosition: position
				})
			})));
		}
	};

	return [
		containerStyle,
		containerClassName,
		_toasts,
		toasts,
		handlers,
		reverseOrder,
		position,
		toastOptions,
		gutter,
		$toasts,
		func
	];
}

class Toaster extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$9, create_fragment$9, safe_not_equal, {
			reverseOrder: 5,
			position: 6,
			toastOptions: 7,
			gutter: 8,
			containerStyle: 0,
			containerClassName: 1
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Toaster",
			options,
			id: create_fragment$9.name
		});
	}

	get reverseOrder() {
		throw new Error("<Toaster>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set reverseOrder(value) {
		throw new Error("<Toaster>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get position() {
		throw new Error("<Toaster>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set position(value) {
		throw new Error("<Toaster>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get toastOptions() {
		throw new Error("<Toaster>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set toastOptions(value) {
		throw new Error("<Toaster>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get gutter() {
		throw new Error("<Toaster>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set gutter(value) {
		throw new Error("<Toaster>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get containerStyle() {
		throw new Error("<Toaster>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set containerStyle(value) {
		throw new Error("<Toaster>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get containerClassName() {
		throw new Error("<Toaster>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set containerClassName(value) {
		throw new Error("<Toaster>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

const API_URL = 'https://localhost:3000';

/* src/routes/EventCreator.svelte generated by Svelte v3.59.2 */

const { Error: Error_1, Object: Object_1$1, console: console_1$2 } = globals;
const file$6 = "src/routes/EventCreator.svelte";

function get_each_context$1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[22] = list[i];
	return child_ctx;
}

// (387:4) {#each events as event}
function create_each_block$1(ctx) {
	let div2;
	let div1;
	let div0;
	let img;
	let img_src_value;
	let t0;
	let h5;
	let t1_value = /*event*/ ctx[22].name + "";
	let t1;
	let t2;
	let h60;
	let t3;
	let t4_value = /*event*/ ctx[22].date + "";
	let t4;
	let t5;
	let h61;
	let t6;
	let t7_value = /*event*/ ctx[22].location + "";
	let t7;
	let t8;
	let h62;
	let t9;
	let t10_value = (/*event*/ ctx[22].attendees || 0) + "";
	let t10;
	let t11;
	let t12_value = /*event*/ ctx[22].max_attendees + "";
	let t12;
	let t13;
	let mounted;
	let dispose;

	function click_handler() {
		return /*click_handler*/ ctx[7](/*event*/ ctx[22]);
	}

	const block = {
		c: function create() {
			div2 = element("div");
			div1 = element("div");
			div0 = element("div");
			img = element("img");
			t0 = space();
			h5 = element("h5");
			t1 = text(t1_value);
			t2 = space();
			h60 = element("h6");
			t3 = text("Fecha: ");
			t4 = text(t4_value);
			t5 = space();
			h61 = element("h6");
			t6 = text("Lugar: ");
			t7 = text(t7_value);
			t8 = space();
			h62 = element("h6");
			t9 = text("Asistentes: ");
			t10 = text(t10_value);
			t11 = text("/");
			t12 = text(t12_value);
			t13 = space();
			if (!src_url_equal(img.src, img_src_value = /*event*/ ctx[22].img || "https://propiedadintelectual.unam.mx/assets/img/unamblanco.png")) attr_dev(img, "src", img_src_value);
			attr_dev(img, "class", "card-img-top img-thumbnai0 limg-fluid p-4 svelte-yjlyqq");
			attr_dev(img, "alt", "...");
			add_location(img, file$6, 396, 12, 10316);
			attr_dev(div0, "class", "d-flex justify-content-center p-2");
			add_location(div0, file$6, 395, 10, 10256);
			attr_dev(h5, "class", "card-title text-center");
			add_location(h5, file$6, 403, 10, 10565);
			attr_dev(h60, "class", "card-subtitle mb-2 text-muted text-center");
			add_location(h60, file$6, 404, 10, 10628);
			attr_dev(h61, "class", "card-subtitle mb-2 text-muted text-center");
			add_location(h61, file$6, 407, 10, 10741);
			attr_dev(h62, "class", "card-subtitle mb-2 text-muted text-center");
			add_location(h62, file$6, 410, 10, 10858);
			attr_dev(div1, "class", "card p-3");
			set_style(div1, "height", "100%");
			add_location(div1, file$6, 394, 8, 10201);
			attr_dev(div2, "class", "col-12 col-md-6 col-lg-4 col-xl-3 event-card mb-4 svelte-yjlyqq");
			add_location(div2, file$6, 388, 6, 10044);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div2, anchor);
			append_dev(div2, div1);
			append_dev(div1, div0);
			append_dev(div0, img);
			append_dev(div1, t0);
			append_dev(div1, h5);
			append_dev(h5, t1);
			append_dev(div1, t2);
			append_dev(div1, h60);
			append_dev(h60, t3);
			append_dev(h60, t4);
			append_dev(div1, t5);
			append_dev(div1, h61);
			append_dev(h61, t6);
			append_dev(h61, t7);
			append_dev(div1, t8);
			append_dev(div1, h62);
			append_dev(h62, t9);
			append_dev(h62, t10);
			append_dev(h62, t11);
			append_dev(h62, t12);
			append_dev(div2, t13);

			if (!mounted) {
				dispose = listen_dev(div2, "click", click_handler, false, false, false, false);
				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty & /*events*/ 1 && !src_url_equal(img.src, img_src_value = /*event*/ ctx[22].img || "https://propiedadintelectual.unam.mx/assets/img/unamblanco.png")) {
				attr_dev(img, "src", img_src_value);
			}

			if (dirty & /*events*/ 1 && t1_value !== (t1_value = /*event*/ ctx[22].name + "")) set_data_dev(t1, t1_value);
			if (dirty & /*events*/ 1 && t4_value !== (t4_value = /*event*/ ctx[22].date + "")) set_data_dev(t4, t4_value);
			if (dirty & /*events*/ 1 && t7_value !== (t7_value = /*event*/ ctx[22].location + "")) set_data_dev(t7, t7_value);
			if (dirty & /*events*/ 1 && t10_value !== (t10_value = (/*event*/ ctx[22].attendees || 0) + "")) set_data_dev(t10, t10_value);
			if (dirty & /*events*/ 1 && t12_value !== (t12_value = /*event*/ ctx[22].max_attendees + "")) set_data_dev(t12, t12_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div2);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$1.name,
		type: "each",
		source: "(387:4) {#each events as event}",
		ctx
	});

	return block;
}

// (463:10) {#if selectedEvent.imageUrl}
function create_if_block_1$1(ctx) {
	let div1;
	let div0;
	let img;
	let img_src_value;

	const block = {
		c: function create() {
			div1 = element("div");
			div0 = element("div");
			img = element("img");
			if (!src_url_equal(img.src, img_src_value = /*selectedEvent*/ ctx[1].imageUrl)) attr_dev(img, "src", img_src_value);
			attr_dev(img, "alt", "Preview");
			attr_dev(img, "class", "img-thumbnail svelte-yjlyqq");
			add_location(img, file$6, 465, 16, 12371);
			attr_dev(div0, "class", "image-preview mb-3 svelte-yjlyqq");
			add_location(div0, file$6, 464, 14, 12322);
			attr_dev(div1, "class", "d-flex justify-content-center");
			add_location(div1, file$6, 463, 12, 12264);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div1, anchor);
			append_dev(div1, div0);
			append_dev(div0, img);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*selectedEvent*/ 2 && !src_url_equal(img.src, img_src_value = /*selectedEvent*/ ctx[1].imageUrl)) {
				attr_dev(img, "src", img_src_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div1);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$1.name,
		type: "if",
		source: "(463:10) {#if selectedEvent.imageUrl}",
		ctx
	});

	return block;
}

// (636:10) {#if selectedEvent.id}
function create_if_block$2(ctx) {
	let button;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			button = element("button");
			button.textContent = "Eliminar";
			attr_dev(button, "type", "button");
			attr_dev(button, "class", "btn btn-danger");
			add_location(button, file$6, 636, 12, 17981);
		},
		m: function mount(target, anchor) {
			insert_dev(target, button, anchor);

			if (!mounted) {
				dispose = listen_dev(button, "click", /*click_handler_2*/ ctx[19], false, false, false, false);
				mounted = true;
			}
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(button);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$2.name,
		type: "if",
		source: "(636:10) {#if selectedEvent.id}",
		ctx
	});

	return block;
}

function create_fragment$8(ctx) {
	let toaster;
	let t0;
	let nav;
	let div0;
	let a;
	let img;
	let img_src_value;
	let t1;
	let t2;
	let br0;
	let t3;
	let br1;
	let t4;
	let br2;
	let t5;
	let br3;
	let t6;
	let div20;
	let div13;
	let div3;
	let div2;
	let i0;
	let t7;
	let div1;
	let h50;
	let t9;
	let h60;
	let t10;
	let t11_value = /*events*/ ctx[0].length + "";
	let t11;
	let t12;
	let div6;
	let div5;
	let i1;
	let t13;
	let div4;
	let h51;
	let t15;
	let h61;
	let t16;
	let t17_value = /*events*/ ctx[0].reduce(func, 0) + "";
	let t17;
	let t18;
	let div9;
	let div8;
	let i2;
	let t19;
	let div7;
	let h52;
	let t21;
	let h62;
	let t22;
	let t23_value = /*events*/ ctx[0].reduce(func_1, 0) + "";
	let t23;
	let t24;
	let div12;
	let div11;
	let i3;
	let t25;
	let div10;
	let h53;
	let t27;
	let h63;
	let t28;
	let t29_value = " " + "";
	let t29;
	let t30;
	let t31_value = /*events*/ ctx[0].reduce(/*func_2*/ ctx[6], 0) + "";
	let t31;
	let t32;
	let div14;
	let hr;
	let t33;
	let br4;
	let t34;
	let div19;
	let t35;
	let div18;
	let div17;
	let div16;
	let div15;
	let i4;
	let t36;
	let h54;
	let t38;
	let div39;
	let div38;
	let div37;
	let div21;
	let h55;
	let t40;
	let button0;
	let t41;
	let div34;
	let div33;
	let t42;
	let div22;
	let input0;
	let t43;
	let div23;
	let span0;
	let i5;
	let t44;
	let input1;
	let t45;
	let div24;
	let span1;
	let i6;
	let t46;
	let input2;
	let t47;
	let div25;
	let span2;
	let i7;
	let t48;
	let input3;
	let t49;
	let div26;
	let span3;
	let i8;
	let t50;
	let input4;
	let t51;
	let div27;
	let span4;
	let i9;
	let t52;
	let input5;
	let t53;
	let div28;
	let span5;
	let i10;
	let t54;
	let textarea;
	let t55;
	let div29;
	let span6;
	let i11;
	let t56;
	let input6;
	let t57;
	let div30;
	let span7;
	let i12;
	let t58;
	let input7;
	let t59;
	let div31;
	let span8;
	let i13;
	let t60;
	let input8;
	let t61;
	let div32;
	let span9;
	let i14;
	let t62;
	let select;
	let option0;
	let option1;
	let t65;
	let div36;
	let div35;
	let t66;
	let button1;
	let current;
	let mounted;
	let dispose;
	toaster = new Toaster({ $$inline: true });
	let each_value = /*events*/ ctx[0];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
	}

	let if_block0 = /*selectedEvent*/ ctx[1].imageUrl && create_if_block_1$1(ctx);
	let if_block1 = /*selectedEvent*/ ctx[1].id && create_if_block$2(ctx);

	const block = {
		c: function create() {
			create_component(toaster.$$.fragment);
			t0 = space();
			nav = element("nav");
			div0 = element("div");
			a = element("a");
			img = element("img");
			t1 = text("\n      Administrador de Eventos");
			t2 = space();
			br0 = element("br");
			t3 = space();
			br1 = element("br");
			t4 = space();
			br2 = element("br");
			t5 = space();
			br3 = element("br");
			t6 = space();
			div20 = element("div");
			div13 = element("div");
			div3 = element("div");
			div2 = element("div");
			i0 = element("i");
			t7 = space();
			div1 = element("div");
			h50 = element("h5");
			h50.textContent = "Eventos";
			t9 = space();
			h60 = element("h6");
			t10 = text("Total: ");
			t11 = text(t11_value);
			t12 = space();
			div6 = element("div");
			div5 = element("div");
			i1 = element("i");
			t13 = space();
			div4 = element("div");
			h51 = element("h5");
			h51.textContent = "Asistentes";
			t15 = space();
			h61 = element("h6");
			t16 = text("Total: ");
			t17 = text(t17_value);
			t18 = space();
			div9 = element("div");
			div8 = element("div");
			i2 = element("i");
			t19 = space();
			div7 = element("div");
			h52 = element("h5");
			h52.textContent = "Carreras";
			t21 = space();
			h62 = element("h6");
			t22 = text("Total: ");
			t23 = text(t23_value);
			t24 = space();
			div12 = element("div");
			div11 = element("div");
			i3 = element("i");
			t25 = space();
			div10 = element("div");
			h53 = element("h5");
			h53.textContent = "Horas disponibles";
			t27 = space();
			h63 = element("h6");
			t28 = text("Total:");
			t29 = text(t29_value);
			t30 = space();
			t31 = text(t31_value);
			t32 = space();
			div14 = element("div");
			hr = element("hr");
			t33 = space();
			br4 = element("br");
			t34 = space();
			div19 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t35 = space();
			div18 = element("div");
			div17 = element("div");
			div16 = element("div");
			div15 = element("div");
			i4 = element("i");
			t36 = space();
			h54 = element("h5");
			h54.textContent = "Agregar Evento";
			t38 = space();
			div39 = element("div");
			div38 = element("div");
			div37 = element("div");
			div21 = element("div");
			h55 = element("h5");
			h55.textContent = "Evento";
			t40 = space();
			button0 = element("button");
			t41 = space();
			div34 = element("div");
			div33 = element("div");
			if (if_block0) if_block0.c();
			t42 = space();
			div22 = element("div");
			input0 = element("input");
			t43 = space();
			div23 = element("div");
			span0 = element("span");
			i5 = element("i");
			t44 = space();
			input1 = element("input");
			t45 = space();
			div24 = element("div");
			span1 = element("span");
			i6 = element("i");
			t46 = space();
			input2 = element("input");
			t47 = space();
			div25 = element("div");
			span2 = element("span");
			i7 = element("i");
			t48 = space();
			input3 = element("input");
			t49 = space();
			div26 = element("div");
			span3 = element("span");
			i8 = element("i");
			t50 = space();
			input4 = element("input");
			t51 = space();
			div27 = element("div");
			span4 = element("span");
			i9 = element("i");
			t52 = space();
			input5 = element("input");
			t53 = space();
			div28 = element("div");
			span5 = element("span");
			i10 = element("i");
			t54 = space();
			textarea = element("textarea");
			t55 = space();
			div29 = element("div");
			span6 = element("span");
			i11 = element("i");
			t56 = space();
			input6 = element("input");
			t57 = space();
			div30 = element("div");
			span7 = element("span");
			i12 = element("i");
			t58 = space();
			input7 = element("input");
			t59 = space();
			div31 = element("div");
			span8 = element("span");
			i13 = element("i");
			t60 = space();
			input8 = element("input");
			t61 = space();
			div32 = element("div");
			span9 = element("span");
			i14 = element("i");
			t62 = space();
			select = element("select");
			option0 = element("option");
			option0.textContent = "Activo";
			option1 = element("option");
			option1.textContent = "Inactivo";
			t65 = space();
			div36 = element("div");
			div35 = element("div");
			if (if_block1) if_block1.c();
			t66 = space();
			button1 = element("button");
			button1.textContent = "Guardar";
			if (!src_url_equal(img.src, img_src_value = "https://propiedadintelectual.unam.mx/assets/img/unamblanco.png")) attr_dev(img, "src", img_src_value);
			attr_dev(img, "alt", "");
			attr_dev(img, "width", "30");
			attr_dev(img, "height", "30");
			attr_dev(img, "class", "d-inline-block align-text-top me-3");
			add_location(img, file$6, 269, 6, 6987);
			attr_dev(a, "class", "navbar-brand");
			attr_dev(a, "href", "#");
			add_location(a, file$6, 268, 4, 6947);
			attr_dev(div0, "class", "container-fluid");
			add_location(div0, file$6, 267, 2, 6913);
			attr_dev(nav, "class", "navbar navbar-dark bg-dark elevated fixed-top svelte-yjlyqq");
			add_location(nav, file$6, 266, 0, 6851);
			add_location(br0, file$6, 281, 0, 7240);
			add_location(br1, file$6, 282, 0, 7247);
			add_location(br2, file$6, 283, 0, 7254);
			add_location(br3, file$6, 284, 0, 7261);
			attr_dev(i0, "class", "bi bi-calendar2-week text-white ms-3");
			set_style(i0, "font-size", "3rem");
			add_location(i0, file$6, 293, 8, 7542);
			attr_dev(h50, "class", "text-white ");
			add_location(h50, file$6, 296, 10, 7682);
			attr_dev(h60, "class", "text-white ");
			add_location(h60, file$6, 302, 10, 7792);
			attr_dev(div1, "class", "ms-4 mt-auto mb-auto");
			add_location(div1, file$6, 295, 8, 7637);
			attr_dev(div2, "class", "d-flex bg-primary bg-gradient rounded");
			add_location(div2, file$6, 292, 6, 7482);
			attr_dev(div3, "class", "col-3 mb-1 p-2");
			add_location(div3, file$6, 291, 4, 7447);
			attr_dev(i1, "class", "bi bi-person-check text-white ms-3");
			set_style(i1, "font-size", "3rem");
			add_location(i1, file$6, 315, 8, 8068);
			attr_dev(h51, "class", "text-white ");
			add_location(h51, file$6, 318, 10, 8206);
			attr_dev(h61, "class", "text-white ");
			add_location(h61, file$6, 324, 10, 8323);
			attr_dev(div4, "class", "ms-4 mt-auto mb-auto");
			add_location(div4, file$6, 317, 8, 8161);
			attr_dev(div5, "class", "d-flex bg-success bg-gradient rounded");
			add_location(div5, file$6, 314, 6, 8008);
			attr_dev(div6, "class", "col-3 mb-1 p-2");
			add_location(div6, file$6, 313, 4, 7973);
			attr_dev(i2, "class", "bi bi-book text-white ms-3");
			set_style(i2, "font-size", "3rem");
			add_location(i2, file$6, 337, 8, 8635);
			attr_dev(h52, "class", "text-white ");
			add_location(h52, file$6, 343, 10, 8801);
			attr_dev(h62, "class", "text-white ");
			add_location(h62, file$6, 349, 10, 8916);
			attr_dev(div7, "class", "ms-4 mt-auto mb-auto");
			add_location(div7, file$6, 342, 8, 8756);
			attr_dev(div8, "class", "d-flex bg-warning bg-gradient rounded");
			add_location(div8, file$6, 336, 6, 8575);
			attr_dev(div9, "class", "col-3 mb-1 p-2");
			add_location(div9, file$6, 335, 4, 8540);
			attr_dev(i3, "class", "bi bi-clock text-white ms-3");
			set_style(i3, "font-size", "3rem");
			add_location(i3, file$6, 362, 8, 9257);
			attr_dev(h53, "class", "text-white");
			add_location(h53, file$6, 364, 10, 9379);
			attr_dev(h63, "class", "text-white");
			add_location(h63, file$6, 365, 10, 9435);
			attr_dev(div10, "class", "ms-4 mt-auto mb-auto");
			add_location(div10, file$6, 363, 8, 9334);
			attr_dev(div11, "class", "d-flex bg-danger bg-gradient rounded");
			add_location(div11, file$6, 361, 6, 9198);
			attr_dev(div12, "class", "col-3 mb-1 p-2");
			add_location(div12, file$6, 360, 4, 9163);
			attr_dev(div13, "class", "row p-5 pb-2");
			set_style(div13, "margin-bottom", "0px");
			add_location(div13, file$6, 287, 2, 7346);
			add_location(hr, file$6, 381, 4, 9890);
			add_location(br4, file$6, 382, 4, 9901);
			attr_dev(div14, "class", "ps-5 pe-5");
			add_location(div14, file$6, 380, 2, 9862);
			attr_dev(i4, "class", "bi bi-plus-circle text-success");
			set_style(i4, "font-size", "6rem");
			add_location(i4, file$6, 428, 12, 11420);
			attr_dev(div15, "class", "d-flex justify-content-center p-3");
			add_location(div15, file$6, 427, 10, 11360);
			attr_dev(h54, "class", "card-title text-center");
			add_location(h54, file$6, 431, 10, 11532);
			attr_dev(div16, "class", "mt-auto mb-auto");
			add_location(div16, file$6, 426, 8, 11320);
			attr_dev(div17, "class", "card");
			set_style(div17, "height", "100%");
			add_location(div17, file$6, 425, 6, 11271);
			attr_dev(div18, "class", "col-12 col-md-6 col-lg-4 col-xl-3 event-card mb-4 svelte-yjlyqq");
			add_location(div18, file$6, 419, 4, 11131);
			attr_dev(div19, "class", "row p-5 pt-0");
			add_location(div19, file$6, 385, 2, 9920);
			attr_dev(div20, "class", "container card elevated svelte-yjlyqq");
			set_style(div20, "height", "100%");
			set_style(div20, "overflow", "auto");
			add_location(div20, file$6, 286, 0, 7269);
			attr_dev(h55, "class", "modal-title");
			attr_dev(h55, "id", "eventModalLabel");
			add_location(h55, file$6, 450, 8, 11911);
			attr_dev(button0, "type", "button");
			attr_dev(button0, "class", "btn-close");
			attr_dev(button0, "data-bs-dismiss", "modal");
			attr_dev(button0, "aria-label", "Close");
			add_location(button0, file$6, 451, 8, 11976);
			attr_dev(div21, "class", "modal-header");
			add_location(div21, file$6, 449, 6, 11876);
			attr_dev(input0, "type", "file");
			attr_dev(input0, "class", "form-control svelte-yjlyqq");
			attr_dev(input0, "id", "eventImage");
			attr_dev(input0, "accept", "image/*");
			add_location(input0, file$6, 474, 12, 12630);
			attr_dev(div22, "class", "input-group mb-3 col-12 svelte-yjlyqq");
			add_location(div22, file$6, 473, 10, 12580);
			attr_dev(i5, "class", "bi bi-book");
			add_location(i5, file$6, 486, 15, 12994);
			attr_dev(span0, "class", "input-group-text");
			attr_dev(span0, "id", "basic-addon1");
			add_location(span0, file$6, 485, 12, 12930);
			attr_dev(input1, "type", "text");
			attr_dev(input1, "class", "form-control svelte-yjlyqq");
			attr_dev(input1, "placeholder", "Nombre del evento");
			attr_dev(input1, "aria-label", "eventName");
			attr_dev(input1, "aria-describedby", "basic-addon1");
			add_location(input1, file$6, 488, 12, 13053);
			attr_dev(div23, "class", "input-group mb-3 col-12 svelte-yjlyqq");
			add_location(div23, file$6, 484, 10, 12880);
			attr_dev(i6, "class", "bi bi-calendar3");
			add_location(i6, file$6, 501, 15, 13487);
			attr_dev(span1, "class", "input-group-text");
			attr_dev(span1, "id", "basic-addon1");
			add_location(span1, file$6, 500, 12, 13423);
			attr_dev(input2, "type", "date");
			attr_dev(input2, "class", "form-control");
			attr_dev(input2, "placeholder", "Fecha del evento");
			attr_dev(input2, "aria-label", "eventDate");
			attr_dev(input2, "aria-describedby", "basic-addon1");
			add_location(input2, file$6, 503, 12, 13551);
			attr_dev(div24, "class", "input-group mb-3 col-12");
			add_location(div24, file$6, 499, 10, 13373);
			attr_dev(i7, "class", "bi bi-clock");
			add_location(i7, file$6, 516, 15, 13992);
			attr_dev(span2, "class", "input-group-text");
			attr_dev(span2, "id", "basic-addon1");
			add_location(span2, file$6, 515, 12, 13928);
			attr_dev(input3, "type", "time");
			attr_dev(input3, "class", "form-control");
			attr_dev(input3, "placeholder", "Hora de inicio");
			attr_dev(input3, "aria-label", "eventStartTime");
			attr_dev(input3, "aria-describedby", "basic-addon1");
			add_location(input3, file$6, 518, 12, 14052);
			attr_dev(div25, "class", "input-group mb-3 col-6");
			add_location(div25, file$6, 514, 10, 13879);
			attr_dev(i8, "class", "bi bi-clock");
			add_location(i8, file$6, 531, 15, 14499);
			attr_dev(span3, "class", "input-group-text");
			attr_dev(span3, "id", "basic-addon1");
			add_location(span3, file$6, 530, 12, 14435);
			attr_dev(input4, "type", "time");
			attr_dev(input4, "class", "form-control");
			attr_dev(input4, "placeholder", "Hora de fin");
			attr_dev(input4, "aria-label", "eventEndTime");
			attr_dev(input4, "aria-describedby", "basic-addon1");
			add_location(input4, file$6, 533, 12, 14559);
			attr_dev(div26, "class", "input-group mb-3 col-6");
			add_location(div26, file$6, 529, 10, 14386);
			attr_dev(i9, "class", "bi bi-geo-alt");
			add_location(i9, file$6, 546, 15, 14993);
			attr_dev(span4, "class", "input-group-text");
			attr_dev(span4, "id", "basic-addon1");
			add_location(span4, file$6, 545, 12, 14929);
			attr_dev(input5, "type", "text");
			attr_dev(input5, "class", "form-control svelte-yjlyqq");
			attr_dev(input5, "placeholder", "Lugar");
			attr_dev(input5, "aria-label", "eventLocation");
			attr_dev(input5, "aria-describedby", "basic-addon1");
			add_location(input5, file$6, 548, 12, 15055);
			attr_dev(div27, "class", "input-group mb-3 col-6 svelte-yjlyqq");
			add_location(div27, file$6, 544, 10, 14880);
			attr_dev(i10, "class", "bi bi-card-text");
			add_location(i10, file$6, 561, 15, 15503);
			attr_dev(span5, "class", "input-group-text");
			attr_dev(span5, "id", "basic-addon1");
			add_location(span5, file$6, 560, 12, 15439);
			attr_dev(textarea, "class", "form-control");
			attr_dev(textarea, "placeholder", "Descripción");
			attr_dev(textarea, "aria-label", "eventDescription");
			attr_dev(textarea, "aria-describedby", "basic-addon1");
			add_location(textarea, file$6, 563, 12, 15567);
			attr_dev(div28, "class", "input-group mb-3 col-12");
			add_location(div28, file$6, 559, 10, 15389);
			attr_dev(i11, "class", "bi bi-person");
			add_location(i11, file$6, 575, 15, 16004);
			attr_dev(span6, "class", "input-group-text");
			attr_dev(span6, "id", "basic-addon1");
			add_location(span6, file$6, 574, 12, 15940);
			attr_dev(input6, "type", "number");
			attr_dev(input6, "class", "form-control");
			attr_dev(input6, "placeholder", "Cupo máximo");
			attr_dev(input6, "aria-label", "eventMaxAttendees");
			attr_dev(input6, "aria-describedby", "basic-addon1");
			add_location(input6, file$6, 577, 12, 16065);
			attr_dev(div29, "class", "input-group mb-3 col-6");
			add_location(div29, file$6, 573, 10, 15891);
			attr_dev(i12, "class", "bi bi-book");
			add_location(i12, file$6, 590, 15, 16514);
			attr_dev(span7, "class", "input-group-text");
			attr_dev(span7, "id", "basic-addon1");
			add_location(span7, file$6, 589, 12, 16450);
			attr_dev(input7, "type", "text");
			attr_dev(input7, "class", "form-control svelte-yjlyqq");
			attr_dev(input7, "placeholder", "Carrera");
			attr_dev(input7, "aria-label", "eventCareer");
			attr_dev(input7, "aria-describedby", "basic-addon1");
			add_location(input7, file$6, 592, 12, 16573);
			attr_dev(div30, "class", "input-group mb-3 col-6 svelte-yjlyqq");
			add_location(div30, file$6, 588, 10, 16401);
			attr_dev(i13, "class", "bi bi-person");
			add_location(i13, file$6, 605, 15, 17004);
			attr_dev(span8, "class", "input-group-text");
			attr_dev(span8, "id", "basic-addon1");
			add_location(span8, file$6, 604, 12, 16940);
			attr_dev(input8, "type", "text");
			attr_dev(input8, "class", "form-control svelte-yjlyqq");
			attr_dev(input8, "placeholder", "Exponente");
			attr_dev(input8, "aria-label", "eventExponent");
			attr_dev(input8, "aria-describedby", "basic-addon1");
			add_location(input8, file$6, 607, 12, 17065);
			attr_dev(div31, "class", "input-group mb-3 col-6 svelte-yjlyqq");
			add_location(div31, file$6, 603, 10, 16891);
			attr_dev(i14, "class", "bi bi-bookmark-check");
			add_location(i14, file$6, 620, 15, 17499);
			attr_dev(span9, "class", "input-group-text");
			attr_dev(span9, "id", "basic-addon1");
			add_location(span9, file$6, 619, 12, 17435);
			option0.selected = true;
			option0.__value = "Activo";
			option0.value = option0.__value;
			add_location(option0, file$6, 627, 14, 17725);
			option1.__value = "Inactivo";
			option1.value = option1.__value;
			add_location(option1, file$6, 628, 14, 17772);
			attr_dev(select, "class", "form-select");
			attr_dev(select, "aria-label", "eventStatus");
			if (/*selectedEvent*/ ctx[1].status === void 0) add_render_callback(() => /*select_change_handler*/ ctx[18].call(select));
			add_location(select, file$6, 622, 12, 17568);
			attr_dev(div32, "class", "input-group mb-3 col-6");
			add_location(div32, file$6, 618, 10, 17386);
			attr_dev(div33, "class", "row");
			add_location(div33, file$6, 459, 8, 12170);
			attr_dev(div34, "class", "modal-body");
			add_location(div34, file$6, 458, 6, 12137);
			add_location(div35, file$6, 634, 8, 17930);
			attr_dev(button1, "type", "button");
			attr_dev(button1, "class", "btn btn-primary");
			add_location(button1, file$6, 648, 8, 18233);
			attr_dev(div36, "class", "modal-footer justify-content-between");
			add_location(div36, file$6, 633, 6, 17871);
			attr_dev(div37, "class", "modal-content");
			add_location(div37, file$6, 448, 4, 11842);
			attr_dev(div38, "class", "modal-dialog modal-dialog-centered modal-lg");
			add_location(div38, file$6, 447, 2, 11780);
			attr_dev(div39, "class", "modal fade");
			attr_dev(div39, "id", "eventModal");
			attr_dev(div39, "tabindex", "-1");
			attr_dev(div39, "aria-labelledby", "eventModalLabel");
			attr_dev(div39, "aria-hidden", "true");
			add_location(div39, file$6, 440, 0, 11659);
		},
		l: function claim(nodes) {
			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			mount_component(toaster, target, anchor);
			insert_dev(target, t0, anchor);
			insert_dev(target, nav, anchor);
			append_dev(nav, div0);
			append_dev(div0, a);
			append_dev(a, img);
			append_dev(a, t1);
			insert_dev(target, t2, anchor);
			insert_dev(target, br0, anchor);
			insert_dev(target, t3, anchor);
			insert_dev(target, br1, anchor);
			insert_dev(target, t4, anchor);
			insert_dev(target, br2, anchor);
			insert_dev(target, t5, anchor);
			insert_dev(target, br3, anchor);
			insert_dev(target, t6, anchor);
			insert_dev(target, div20, anchor);
			append_dev(div20, div13);
			append_dev(div13, div3);
			append_dev(div3, div2);
			append_dev(div2, i0);
			append_dev(div2, t7);
			append_dev(div2, div1);
			append_dev(div1, h50);
			append_dev(div1, t9);
			append_dev(div1, h60);
			append_dev(h60, t10);
			append_dev(h60, t11);
			append_dev(div13, t12);
			append_dev(div13, div6);
			append_dev(div6, div5);
			append_dev(div5, i1);
			append_dev(div5, t13);
			append_dev(div5, div4);
			append_dev(div4, h51);
			append_dev(div4, t15);
			append_dev(div4, h61);
			append_dev(h61, t16);
			append_dev(h61, t17);
			append_dev(div13, t18);
			append_dev(div13, div9);
			append_dev(div9, div8);
			append_dev(div8, i2);
			append_dev(div8, t19);
			append_dev(div8, div7);
			append_dev(div7, h52);
			append_dev(div7, t21);
			append_dev(div7, h62);
			append_dev(h62, t22);
			append_dev(h62, t23);
			append_dev(div13, t24);
			append_dev(div13, div12);
			append_dev(div12, div11);
			append_dev(div11, i3);
			append_dev(div11, t25);
			append_dev(div11, div10);
			append_dev(div10, h53);
			append_dev(div10, t27);
			append_dev(div10, h63);
			append_dev(h63, t28);
			append_dev(h63, t29);
			append_dev(h63, t30);
			append_dev(h63, t31);
			append_dev(div20, t32);
			append_dev(div20, div14);
			append_dev(div14, hr);
			append_dev(div14, t33);
			append_dev(div14, br4);
			append_dev(div20, t34);
			append_dev(div20, div19);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div19, null);
				}
			}

			append_dev(div19, t35);
			append_dev(div19, div18);
			append_dev(div18, div17);
			append_dev(div17, div16);
			append_dev(div16, div15);
			append_dev(div15, i4);
			append_dev(div16, t36);
			append_dev(div16, h54);
			insert_dev(target, t38, anchor);
			insert_dev(target, div39, anchor);
			append_dev(div39, div38);
			append_dev(div38, div37);
			append_dev(div37, div21);
			append_dev(div21, h55);
			append_dev(div21, t40);
			append_dev(div21, button0);
			append_dev(div37, t41);
			append_dev(div37, div34);
			append_dev(div34, div33);
			if (if_block0) if_block0.m(div33, null);
			append_dev(div33, t42);
			append_dev(div33, div22);
			append_dev(div22, input0);
			append_dev(div33, t43);
			append_dev(div33, div23);
			append_dev(div23, span0);
			append_dev(span0, i5);
			append_dev(div23, t44);
			append_dev(div23, input1);
			set_input_value(input1, /*selectedEvent*/ ctx[1].name);
			append_dev(div33, t45);
			append_dev(div33, div24);
			append_dev(div24, span1);
			append_dev(span1, i6);
			append_dev(div24, t46);
			append_dev(div24, input2);
			set_input_value(input2, /*selectedEvent*/ ctx[1].date);
			append_dev(div33, t47);
			append_dev(div33, div25);
			append_dev(div25, span2);
			append_dev(span2, i7);
			append_dev(div25, t48);
			append_dev(div25, input3);
			set_input_value(input3, /*selectedEvent*/ ctx[1].start_time);
			append_dev(div33, t49);
			append_dev(div33, div26);
			append_dev(div26, span3);
			append_dev(span3, i8);
			append_dev(div26, t50);
			append_dev(div26, input4);
			set_input_value(input4, /*selectedEvent*/ ctx[1].end_time);
			append_dev(div33, t51);
			append_dev(div33, div27);
			append_dev(div27, span4);
			append_dev(span4, i9);
			append_dev(div27, t52);
			append_dev(div27, input5);
			set_input_value(input5, /*selectedEvent*/ ctx[1].location);
			append_dev(div33, t53);
			append_dev(div33, div28);
			append_dev(div28, span5);
			append_dev(span5, i10);
			append_dev(div28, t54);
			append_dev(div28, textarea);
			set_input_value(textarea, /*selectedEvent*/ ctx[1].description);
			append_dev(div33, t55);
			append_dev(div33, div29);
			append_dev(div29, span6);
			append_dev(span6, i11);
			append_dev(div29, t56);
			append_dev(div29, input6);
			set_input_value(input6, /*selectedEvent*/ ctx[1].max_attendees);
			append_dev(div33, t57);
			append_dev(div33, div30);
			append_dev(div30, span7);
			append_dev(span7, i12);
			append_dev(div30, t58);
			append_dev(div30, input7);
			set_input_value(input7, /*selectedEvent*/ ctx[1].career);
			append_dev(div33, t59);
			append_dev(div33, div31);
			append_dev(div31, span8);
			append_dev(span8, i13);
			append_dev(div31, t60);
			append_dev(div31, input8);
			set_input_value(input8, /*selectedEvent*/ ctx[1].exponent);
			append_dev(div33, t61);
			append_dev(div33, div32);
			append_dev(div32, span9);
			append_dev(span9, i14);
			append_dev(div32, t62);
			append_dev(div32, select);
			append_dev(select, option0);
			append_dev(select, option1);
			select_option(select, /*selectedEvent*/ ctx[1].status, true);
			append_dev(div37, t65);
			append_dev(div37, div36);
			append_dev(div36, div35);
			if (if_block1) if_block1.m(div35, null);
			append_dev(div36, t66);
			append_dev(div36, button1);
			current = true;

			if (!mounted) {
				dispose = [
					listen_dev(div18, "click", /*click_handler_1*/ ctx[8], false, false, false, false),
					listen_dev(input0, "change", /*handleFileUpload*/ ctx[2], false, false, false, false),
					listen_dev(input1, "input", /*input1_input_handler*/ ctx[9]),
					listen_dev(input2, "input", /*input2_input_handler*/ ctx[10]),
					listen_dev(input3, "input", /*input3_input_handler*/ ctx[11]),
					listen_dev(input4, "input", /*input4_input_handler*/ ctx[12]),
					listen_dev(input5, "input", /*input5_input_handler*/ ctx[13]),
					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[14]),
					listen_dev(input6, "input", /*input6_input_handler*/ ctx[15]),
					listen_dev(input7, "input", /*input7_input_handler*/ ctx[16]),
					listen_dev(input8, "input", /*input8_input_handler*/ ctx[17]),
					listen_dev(select, "change", /*select_change_handler*/ ctx[18]),
					listen_dev(button1, "click", /*click_handler_3*/ ctx[20], false, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if ((!current || dirty & /*events*/ 1) && t11_value !== (t11_value = /*events*/ ctx[0].length + "")) set_data_dev(t11, t11_value);
			if ((!current || dirty & /*events*/ 1) && t17_value !== (t17_value = /*events*/ ctx[0].reduce(func, 0) + "")) set_data_dev(t17, t17_value);
			if ((!current || dirty & /*events*/ 1) && t23_value !== (t23_value = /*events*/ ctx[0].reduce(func_1, 0) + "")) set_data_dev(t23, t23_value);
			if ((!current || dirty & /*events*/ 1) && t31_value !== (t31_value = /*events*/ ctx[0].reduce(/*func_2*/ ctx[6], 0) + "")) set_data_dev(t31, t31_value);

			if (dirty & /*openEventModal, events*/ 9) {
				each_value = /*events*/ ctx[0];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$1(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$1(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div19, t35);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (/*selectedEvent*/ ctx[1].imageUrl) {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = create_if_block_1$1(ctx);
					if_block0.c();
					if_block0.m(div33, t42);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (dirty & /*selectedEvent*/ 2 && input1.value !== /*selectedEvent*/ ctx[1].name) {
				set_input_value(input1, /*selectedEvent*/ ctx[1].name);
			}

			if (dirty & /*selectedEvent*/ 2) {
				set_input_value(input2, /*selectedEvent*/ ctx[1].date);
			}

			if (dirty & /*selectedEvent*/ 2) {
				set_input_value(input3, /*selectedEvent*/ ctx[1].start_time);
			}

			if (dirty & /*selectedEvent*/ 2) {
				set_input_value(input4, /*selectedEvent*/ ctx[1].end_time);
			}

			if (dirty & /*selectedEvent*/ 2 && input5.value !== /*selectedEvent*/ ctx[1].location) {
				set_input_value(input5, /*selectedEvent*/ ctx[1].location);
			}

			if (dirty & /*selectedEvent*/ 2) {
				set_input_value(textarea, /*selectedEvent*/ ctx[1].description);
			}

			if (dirty & /*selectedEvent*/ 2 && to_number(input6.value) !== /*selectedEvent*/ ctx[1].max_attendees) {
				set_input_value(input6, /*selectedEvent*/ ctx[1].max_attendees);
			}

			if (dirty & /*selectedEvent*/ 2 && input7.value !== /*selectedEvent*/ ctx[1].career) {
				set_input_value(input7, /*selectedEvent*/ ctx[1].career);
			}

			if (dirty & /*selectedEvent*/ 2 && input8.value !== /*selectedEvent*/ ctx[1].exponent) {
				set_input_value(input8, /*selectedEvent*/ ctx[1].exponent);
			}

			if (dirty & /*selectedEvent*/ 2) {
				select_option(select, /*selectedEvent*/ ctx[1].status);
			}

			if (/*selectedEvent*/ ctx[1].id) {
				if (if_block1) {
					if_block1.p(ctx, dirty);
				} else {
					if_block1 = create_if_block$2(ctx);
					if_block1.c();
					if_block1.m(div35, null);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(toaster.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(toaster.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(toaster, detaching);
			if (detaching) detach_dev(t0);
			if (detaching) detach_dev(nav);
			if (detaching) detach_dev(t2);
			if (detaching) detach_dev(br0);
			if (detaching) detach_dev(t3);
			if (detaching) detach_dev(br1);
			if (detaching) detach_dev(t4);
			if (detaching) detach_dev(br2);
			if (detaching) detach_dev(t5);
			if (detaching) detach_dev(br3);
			if (detaching) detach_dev(t6);
			if (detaching) detach_dev(div20);
			destroy_each(each_blocks, detaching);
			if (detaching) detach_dev(t38);
			if (detaching) detach_dev(div39);
			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d();
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$8.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

const func = (acc, e) => acc + e.attendees;
const func_1 = (acc, e) => acc + 1;

function instance$8($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('EventCreator', slots, []);
	let events = [];

	/*let events = [
  {
    id: 1,
    name: "Evento 1",
    date: "2021-10-10",
    start_time: "10:00",
    end_time: "12:00",
    location: "Facultad de Ciencias",
    description: "Evento de prueba 1",
    attendees: 0,
    max_attendees: 100,
    career: "Ingeniería en Computación",
    exponent: "Dr. Exponente 1",
    status: "Activo",
    img: "https://propiedadintelectual.unam.mx/assets/img/unamblanco.png",
  },
  {
    id: 2,
    name: "Evento 2",
    date: "2021-10-11",
    start_time: "10:00",
    end_time: "12:00",
    location: "Facultad de Ciencias",
    description: "Evento de prueba 2",
    attendees: 0,
    max_attendees: 100,
    career: "Ingeniería en Computación",
    exponent: "Dr. Exponente 2",
    status: "Activo",
    img: "https://propiedadintelectual.unam.mx/assets/img/unamblanco.png",
  },
  {
    id: 3,
    name: "Evento 3",
    date: "2021-10-12",
    start_time: "10:00",
    end_time: "12:00",
    location: "Facultad de Ciencias",
    description: "Evento de prueba 3",
    attendees: 0,
    max_attendees: 100,
    career: "Ingeniería en Computación",
    exponent: "Dr. Exponente 3",
    status: "Activo",
    img: "https://propiedadintelectual.unam.mx/assets/img/unamblanco.png",
  },

  {
    id: 4,
    name: "Evento 4",
    date: "2021-10-13",
    start_time: "10:00",
    end_time: "12:00",
    location: "Facultad de Ciencias",
    description: "Evento de prueba 4",
    attendees: 0,
    max_attendees: 100,
    career: "Ingeniería en Computación",
    exponent: "Dr. Exponente 4",
    status: "Activo",
    img: "https://propiedadintelectual.unam.mx/assets/img/unamblanco.png",
  },
  {
    id: 5,
    name: "Evento 5",
    date: "2021-10-14",
    start_time: "10:00",
    end_time: "12:00",
    location: "Facultad de Ciencias",
    description: "Evento de prueba 5",
    attendees: 0,
    max_attendees: 100,
    career: "Ingeniería en Computación",
    exponent: "Dr. Exponente 5",
    status: "Activo",
    img: "https://propiedadintelectual.unam.mx/assets/img/unamblanco.png",
  },
];*/
	let selectedEvent = {};

	async function getEvents() {
		try {
			const res = await fetch(`${API_URL}/api/eventos`, {
				method: "GET",
				headers: { "Content-Type": "application/json" }
			});

			if (res.ok) {
				const data = await res.json();
				$$invalidate(0, events = data);
			} else {
				throw new Error("Error en la solicitud");
			}
		} catch(error) {
			console.log("Error:", error);
		}
	}

	function handleFileUpload(event) {
		const file = event.target.files[0];

		if (file) {
			const reader = new FileReader();

			reader.onload = e => {
				$$invalidate(1, selectedEvent.imageUrl = e.target.result, selectedEvent); // Carga la imagen como base64
			};

			reader.readAsDataURL(file);
		}
	}

	function openEventModal(event = null) {
		$$invalidate(1, selectedEvent = {});

		if (event) {
			$$invalidate(1, selectedEvent = Object.assign({}, event));
		}

		// Limpiar el input de archivo
		const fileInput = document.getElementById("eventImage");

		if (fileInput) {
			fileInput.value = ""; // Restablece el input de archivo
		}

		//open modal
		const modal = new bootstrap.Modal(document.getElementById("eventModal"), { keyboard: false });

		modal.show();
	}

	async function saveEvent() {
		console.log(selectedEvent);

		//Check that all fields are filled
		if (!selectedEvent.name || !selectedEvent.date || !selectedEvent.start_time || !selectedEvent.end_time || !selectedEvent.location || !selectedEvent.description || !selectedEvent.max_attendees || !selectedEvent.career || !selectedEvent.exponent || !selectedEvent.status) {
			toast.error("Por favor llena todos los campos", { duration: 3000, position: "bottom-right" });
			return;
		}

		if (selectedEvent.id) {
			//update event
			try {
				// console.log(selectedEvent);
				const res = await fetch(`${API_URL}/api/evento`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*"
					},
					body: JSON.stringify(selectedEvent)
				});

				//console.log(res.status);
				if (res.status === 200) {
					toast.success("Evento actualizado", { duration: 3000, position: "bottom-right" });
					await getEvents();
				} else {
					throw new Error("Error en la solicitud");
				}
			} catch(error) {
				//console.log("Error:", error);
				toast.error("Error al actualizar el evento", { duration: 3000, position: "bottom-right" });
			}
		} else {
			//add event
			try {
				const res = await fetch(`${API_URL}/api/evento`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*"
					},
					body: JSON.stringify(selectedEvent)
				});

				if (res.ok) {
					toast.success("Evento agregado", { duration: 3000, position: "bottom-right" });
					await getEvents();
				} else {
					throw new Error("Error en la solicitud");
				}
			} catch(error) {
				toast.error("Error al agregar el evento", { duration: 3000, position: "bottom-right" });
			}
		}

		const modal = bootstrap.Modal.getInstance(document.getElementById("eventModal"));
		modal.hide();
	}

	async function deleteEvent() {
		try {
			const res = await fetch(`${API_URL}/api/evento/${selectedEvent.id}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*"
				}
			});

			if (res.status === 200) {
				toast.success("Evento eliminado", { duration: 3000, position: "bottom-right" });
				await getEvents();
			} else {
				throw new Error("Error en la solicitud");
			}
		} catch(error) {
			toast.error("Error al eliminar el evento", { duration: 3000, position: "bottom-right" });
		}

		const modal = bootstrap.Modal.getInstance(document.getElementById("eventModal"));
		modal.hide();
	}

	onMount(async () => {
		await getEvents();
	});

	const writable_props = [];

	Object_1$1.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<EventCreator> was created with unknown prop '${key}'`);
	});

	const func_2 = (acc, e) => {
		const start = e.start_time.split(":");
		const end = e.end_time.split(":");
		const startHour = parseInt(start[0]);
		const endHour = parseInt(end[0]);
		return acc + (endHour - startHour);
	};

	const click_handler = event => {
		openEventModal(event);
	};

	const click_handler_1 = () => {
		openEventModal();
	};

	function input1_input_handler() {
		selectedEvent.name = this.value;
		$$invalidate(1, selectedEvent);
	}

	function input2_input_handler() {
		selectedEvent.date = this.value;
		$$invalidate(1, selectedEvent);
	}

	function input3_input_handler() {
		selectedEvent.start_time = this.value;
		$$invalidate(1, selectedEvent);
	}

	function input4_input_handler() {
		selectedEvent.end_time = this.value;
		$$invalidate(1, selectedEvent);
	}

	function input5_input_handler() {
		selectedEvent.location = this.value;
		$$invalidate(1, selectedEvent);
	}

	function textarea_input_handler() {
		selectedEvent.description = this.value;
		$$invalidate(1, selectedEvent);
	}

	function input6_input_handler() {
		selectedEvent.max_attendees = to_number(this.value);
		$$invalidate(1, selectedEvent);
	}

	function input7_input_handler() {
		selectedEvent.career = this.value;
		$$invalidate(1, selectedEvent);
	}

	function input8_input_handler() {
		selectedEvent.exponent = this.value;
		$$invalidate(1, selectedEvent);
	}

	function select_change_handler() {
		selectedEvent.status = select_value(this);
		$$invalidate(1, selectedEvent);
	}

	const click_handler_2 = () => {
		deleteEvent();
	};

	const click_handler_3 = () => {
		saveEvent();
	};

	$$self.$capture_state = () => ({
		toast,
		Toaster,
		API_URL,
		onMount,
		events,
		selectedEvent,
		getEvents,
		handleFileUpload,
		openEventModal,
		saveEvent,
		deleteEvent
	});

	$$self.$inject_state = $$props => {
		if ('events' in $$props) $$invalidate(0, events = $$props.events);
		if ('selectedEvent' in $$props) $$invalidate(1, selectedEvent = $$props.selectedEvent);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		events,
		selectedEvent,
		handleFileUpload,
		openEventModal,
		saveEvent,
		deleteEvent,
		func_2,
		click_handler,
		click_handler_1,
		input1_input_handler,
		input2_input_handler,
		input3_input_handler,
		input4_input_handler,
		input5_input_handler,
		textarea_input_handler,
		input6_input_handler,
		input7_input_handler,
		input8_input_handler,
		select_change_handler,
		click_handler_2,
		click_handler_3
	];
}

class EventCreator extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "EventCreator",
			options,
			id: create_fragment$8.name
		});
	}
}

/* src/routes/LoginPage.svelte generated by Svelte v3.59.2 */
const file$5 = "src/routes/LoginPage.svelte";

function create_fragment$7(ctx) {
	let body;
	let section;
	let div0;
	let t0;
	let div1;
	let t1;
	let div14;
	let div13;
	let div12;
	let div11;
	let div10;
	let div9;
	let div8;
	let div6;
	let h2;
	let t3;
	let h4;
	let t5;
	let p0;
	let t7;
	let div2;
	let label0;
	let t9;
	let input0;
	let t10;
	let div5;
	let label1;
	let t12;
	let div4;
	let input1;
	let t13;
	let div3;
	let span;
	let i0;
	let t14;
	let i1;
	let t15;
	let br0;
	let t16;
	let hr;
	let t17;
	let br1;
	let t18;
	let button;
	let t20;
	let div7;
	let p1;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			body = element("body");
			section = element("section");
			div0 = element("div");
			t0 = space();
			div1 = element("div");
			t1 = space();
			div14 = element("div");
			div13 = element("div");
			div12 = element("div");
			div11 = element("div");
			div10 = element("div");
			div9 = element("div");
			div8 = element("div");
			div6 = element("div");
			h2 = element("h2");
			h2.textContent = "CRONOS";
			t3 = space();
			h4 = element("h4");
			h4.textContent = "V3";
			t5 = space();
			p0 = element("p");
			p0.textContent = "Ingrese correo y contraseña";
			t7 = space();
			div2 = element("div");
			label0 = element("label");
			label0.textContent = "Usuario";
			t9 = space();
			input0 = element("input");
			t10 = space();
			div5 = element("div");
			label1 = element("label");
			label1.textContent = "Contraseña";
			t12 = space();
			div4 = element("div");
			input1 = element("input");
			t13 = space();
			div3 = element("div");
			span = element("span");
			i0 = element("i");
			t14 = space();
			i1 = element("i");
			t15 = space();
			br0 = element("br");
			t16 = space();
			hr = element("hr");
			t17 = space();
			br1 = element("br");
			t18 = space();
			button = element("button");
			button.textContent = "Ingresar";
			t20 = space();
			div7 = element("div");
			p1 = element("p");
			p1.textContent = "version 0.0.1";
			attr_dev(div0, "class", "bg-gold svelte-ny55m5");
			add_location(div0, file$5, 67, 2, 1792);
			attr_dev(div1, "class", "bg-white svelte-ny55m5");
			add_location(div1, file$5, 68, 2, 1818);
			attr_dev(h2, "class", "fw-bold mb-2 text-uppercase");
			add_location(h2, file$5, 82, 11, 2457);
			attr_dev(h4, "class", "fw-bold mb-2 text-uppercase");
			add_location(h4, file$5, 83, 11, 2520);
			attr_dev(p0, "class", "text-black-50 mb-5");
			add_location(p0, file$5, 84, 11, 2579);
			attr_dev(label0, "class", "form-label");
			attr_dev(label0, "for", "username");
			add_location(label0, file$5, 88, 12, 2787);
			attr_dev(input0, "type", "email");
			attr_dev(input0, "id", "");
			attr_dev(input0, "class", "input form-control ");
			attr_dev(input0, "placeholder", "usuario");
			add_location(input0, file$5, 91, 12, 2884);
			attr_dev(div2, "class", "form-outline form-white mb-4");
			add_location(div2, file$5, 86, 11, 2653);
			attr_dev(label1, "class", "form-label");
			attr_dev(label1, "for", "typePasswordX");
			add_location(label1, file$5, 101, 12, 3160);
			attr_dev(input1, "name", "password");
			attr_dev(input1, "type", "password");
			attr_dev(input1, "class", "input form-control");
			attr_dev(input1, "id", "password");
			attr_dev(input1, "placeholder", "contraseña");
			input1.required = "true";
			attr_dev(input1, "aria-label", "password");
			attr_dev(input1, "aria-describedby", "basic-addon1");
			add_location(input1, file$5, 103, 13, 3300);
			attr_dev(i0, "class", "bi bi-eye-fill");
			attr_dev(i0, "id", "show_eye");
			add_location(i0, file$5, 120, 15, 3858);
			attr_dev(i1, "class", "bi bi-eye-slash-fill d-none");
			attr_dev(i1, "id", "hide_eye");
			add_location(i1, file$5, 121, 15, 3916);
			attr_dev(span, "class", "input-group-text");
			add_location(span, file$5, 115, 14, 3699);
			attr_dev(div3, "class", "input-group-append");
			add_location(div3, file$5, 114, 13, 3652);
			attr_dev(div4, "class", "input-group");
			attr_dev(div4, "id", "show_hide_password");
			add_location(div4, file$5, 102, 12, 3237);
			add_location(br0, file$5, 126, 12, 4046);
			add_location(hr, file$5, 128, 12, 4066);
			add_location(br1, file$5, 129, 12, 4085);
			attr_dev(button, "class", "btn btn-success btn-lg px-5");
			add_location(button, file$5, 131, 12, 4105);
			attr_dev(div5, "class", "form-outline form-white mb-4");
			add_location(div5, file$5, 100, 11, 3105);
			attr_dev(div6, "class", "mb-md-5 mt-md-4 pb-5");
			add_location(div6, file$5, 81, 10, 2411);
			attr_dev(p1, "class", "text-secondary");
			add_location(p1, file$5, 148, 11, 4796);
			attr_dev(div7, "class", "d-flex justify-content-center");
			add_location(div7, file$5, 147, 10, 4741);
			attr_dev(div8, "class", "card-body p-5 text-center");
			add_location(div8, file$5, 80, 9, 2361);
			attr_dev(div9, "class", "card bg-light text-black shadow-lg p-3 mb-5 bg-body rounded");
			set_style(div9, "border-radius", "1rem");
			add_location(div9, file$5, 76, 8, 2222);
			attr_dev(div10, "class", "row d-flex justify-content-center align-items-center h-100");
			add_location(div10, file$5, 75, 6, 2141);
			attr_dev(div11, "class", "container h-100");
			add_location(div11, file$5, 73, 5, 2051);
			attr_dev(div12, "class", "col-12 col-md-6 col-lg-5 col-xl-4");
			set_style(div12, "max-width", "700px");
			add_location(div12, file$5, 72, 4, 1972);
			attr_dev(div13, "class", "row h-100 justify-content-center align-items-center");
			add_location(div13, file$5, 71, 3, 1902);
			attr_dev(div14, "class", "container-fluid");
			set_style(div14, "height", "100vh");
			add_location(div14, file$5, 70, 2, 1846);
			attr_dev(section, "class", "");
			add_location(section, file$5, 66, 1, 1771);
			attr_dev(body, "class", "svelte-ny55m5");
			add_location(body, file$5, 65, 0, 1763);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, body, anchor);
			append_dev(body, section);
			append_dev(section, div0);
			append_dev(section, t0);
			append_dev(section, div1);
			append_dev(section, t1);
			append_dev(section, div14);
			append_dev(div14, div13);
			append_dev(div13, div12);
			append_dev(div12, div11);
			append_dev(div11, div10);
			append_dev(div10, div9);
			append_dev(div9, div8);
			append_dev(div8, div6);
			append_dev(div6, h2);
			append_dev(div6, t3);
			append_dev(div6, h4);
			append_dev(div6, t5);
			append_dev(div6, p0);
			append_dev(div6, t7);
			append_dev(div6, div2);
			append_dev(div2, label0);
			append_dev(div2, t9);
			append_dev(div2, input0);
			set_input_value(input0, /*username*/ ctx[0]);
			append_dev(div6, t10);
			append_dev(div6, div5);
			append_dev(div5, label1);
			append_dev(div5, t12);
			append_dev(div5, div4);
			append_dev(div4, input1);
			set_input_value(input1, /*password*/ ctx[1]);
			append_dev(div4, t13);
			append_dev(div4, div3);
			append_dev(div3, span);
			append_dev(span, i0);
			append_dev(span, t14);
			append_dev(span, i1);
			append_dev(div5, t15);
			append_dev(div5, br0);
			append_dev(div5, t16);
			append_dev(div5, hr);
			append_dev(div5, t17);
			append_dev(div5, br1);
			append_dev(div5, t18);
			append_dev(div5, button);
			append_dev(div8, t20);
			append_dev(div8, div7);
			append_dev(div7, p1);

			if (!mounted) {
				dispose = [
					listen_dev(input0, "input", /*input0_input_handler*/ ctx[3]),
					listen_dev(input1, "input", /*input1_input_handler*/ ctx[4]),
					listen_dev(span, "click", password_show_hide, false, false, false, false),
					listen_dev(span, "keydown", keydown_handler, false, false, false, false),
					listen_dev(
						button,
						"click",
						function () {
							if (is_function(/*login*/ ctx[2](/*username*/ ctx[0], /*password*/ ctx[1]))) /*login*/ ctx[2](/*username*/ ctx[0], /*password*/ ctx[1]).apply(this, arguments);
						},
						false,
						false,
						false,
						false
					)
				];

				mounted = true;
			}
		},
		p: function update(new_ctx, [dirty]) {
			ctx = new_ctx;

			if (dirty & /*username*/ 1 && input0.value !== /*username*/ ctx[0]) {
				set_input_value(input0, /*username*/ ctx[0]);
			}

			if (dirty & /*password*/ 2 && input1.value !== /*password*/ ctx[1]) {
				set_input_value(input1, /*password*/ ctx[1]);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(body);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$7.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function password_show_hide() {
	var x = document.getElementById('password');
	var show_eye = document.getElementById('show_eye');
	var hide_eye = document.getElementById('hide_eye');
	hide_eye.classList.remove('d-none');

	if (x.type === 'password') {
		x.type = 'text';
		show_eye.style.display = 'none';
		hide_eye.style.display = 'block';
	} else {
		x.type = 'password';
		show_eye.style.display = 'block';
		hide_eye.style.display = 'none';
	}
}

const keydown_handler = () => {
	
};

function instance$7($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('LoginPage', slots, []);

	onMount(() => {
		selectedPage.set("LOGIN_PAGE");
	});

	let isLogged = false;
	let username = "";
	let password = "";

	async function login(username, password) {
		isLogged.set(true);
	} /*try {
      const response = await fetch(`${$API_DIR}/api/v1/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Inicio de sesión exitoso:", data);
        currentPage.set("MAIN_PAGE");

        localStorage.setItem($SESSION_LS, data.session_id);
        localStorage.setItem($USERNAME_LS, data.username);
        //USERNAME_LS.set(data.username);
      } else if (response.status === 401) {
        const errorData = await response.json();
        console.log("Error en la solicitud:", errorData);
        alert("Credenciales inválidas");
      } else {
        throw new Error("Error en la solicitud");
      }
    } catch (error) {
      console.error("Error:", error);
    }*/

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LoginPage> was created with unknown prop '${key}'`);
	});

	function input0_input_handler() {
		username = this.value;
		$$invalidate(0, username);
	}

	function input1_input_handler() {
		password = this.value;
		$$invalidate(1, password);
	}

	$$self.$capture_state = () => ({
		onMount,
		isLogged,
		username,
		password,
		password_show_hide,
		login
	});

	$$self.$inject_state = $$props => {
		if ('isLogged' in $$props) isLogged = $$props.isLogged;
		if ('username' in $$props) $$invalidate(0, username = $$props.username);
		if ('password' in $$props) $$invalidate(1, password = $$props.password);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [username, password, login, input0_input_handler, input1_input_handler];
}

class LoginPage extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "LoginPage",
			options,
			id: create_fragment$7.name
		});
	}
}

class e{constructor(a,b,c,d,f){this._legacyCanvasSize=e.DEFAULT_CANVAS_SIZE;this._preferredCamera="environment";this._maxScansPerSecond=25;this._lastScanTimestamp=-1;this._destroyed=this._flashOn=this._paused=this._active=!1;this.$video=a;this.$canvas=document.createElement("canvas");c&&"object"===typeof c?this._onDecode=b:(c||d||f?console.warn("You're using a deprecated version of the QrScanner constructor which will be removed in the future"):console.warn("Note that the type of the scan result passed to onDecode will change in the future. To already switch to the new api today, you can pass returnDetailedScanResult: true."),
this._legacyOnDecode=b);b="object"===typeof c?c:{};this._onDecodeError=b.onDecodeError||("function"===typeof c?c:this._onDecodeError);this._calculateScanRegion=b.calculateScanRegion||("function"===typeof d?d:this._calculateScanRegion);this._preferredCamera=b.preferredCamera||f||this._preferredCamera;this._legacyCanvasSize="number"===typeof c?c:"number"===typeof d?d:this._legacyCanvasSize;this._maxScansPerSecond=b.maxScansPerSecond||this._maxScansPerSecond;this._onPlay=this._onPlay.bind(this);this._onLoadedMetaData=
this._onLoadedMetaData.bind(this);this._onVisibilityChange=this._onVisibilityChange.bind(this);this._updateOverlay=this._updateOverlay.bind(this);a.disablePictureInPicture=!0;a.playsInline=!0;a.muted=!0;let h=!1;a.hidden&&(a.hidden=!1,h=!0);document.body.contains(a)||(document.body.appendChild(a),h=!0);c=a.parentElement;if(b.highlightScanRegion||b.highlightCodeOutline){d=!!b.overlay;this.$overlay=b.overlay||document.createElement("div");f=this.$overlay.style;f.position="absolute";f.display="none";
f.pointerEvents="none";this.$overlay.classList.add("scan-region-highlight");if(!d&&b.highlightScanRegion){this.$overlay.innerHTML='<svg class="scan-region-highlight-svg" viewBox="0 0 238 238" preserveAspectRatio="none" style="position:absolute;width:100%;height:100%;left:0;top:0;fill:none;stroke:#e9b213;stroke-width:4;stroke-linecap:round;stroke-linejoin:round"><path d="M31 2H10a8 8 0 0 0-8 8v21M207 2h21a8 8 0 0 1 8 8v21m0 176v21a8 8 0 0 1-8 8h-21m-176 0H10a8 8 0 0 1-8-8v-21"/></svg>';try{this.$overlay.firstElementChild.animate({transform:["scale(.98)",
"scale(1.01)"]},{duration:400,iterations:Infinity,direction:"alternate",easing:"ease-in-out"});}catch(m){}c.insertBefore(this.$overlay,this.$video.nextSibling);}b.highlightCodeOutline&&(this.$overlay.insertAdjacentHTML("beforeend",'<svg class="code-outline-highlight" preserveAspectRatio="none" style="display:none;width:100%;height:100%;fill:none;stroke:#e9b213;stroke-width:5;stroke-dasharray:25;stroke-linecap:round;stroke-linejoin:round"><polygon/></svg>'),this.$codeOutlineHighlight=this.$overlay.lastElementChild);}this._scanRegion=
this._calculateScanRegion(a);requestAnimationFrame(()=>{let m=window.getComputedStyle(a);"none"===m.display&&(a.style.setProperty("display","block","important"),h=!0);"visible"!==m.visibility&&(a.style.setProperty("visibility","visible","important"),h=!0);h&&(console.warn("QrScanner has overwritten the video hiding style to avoid Safari stopping the playback."),a.style.opacity="0",a.style.width="0",a.style.height="0",this.$overlay&&this.$overlay.parentElement&&this.$overlay.parentElement.removeChild(this.$overlay),
delete this.$overlay,delete this.$codeOutlineHighlight);this.$overlay&&this._updateOverlay();});a.addEventListener("play",this._onPlay);a.addEventListener("loadedmetadata",this._onLoadedMetaData);document.addEventListener("visibilitychange",this._onVisibilityChange);window.addEventListener("resize",this._updateOverlay);this._qrEnginePromise=e.createQrEngine();}static set WORKER_PATH(a){console.warn("Setting QrScanner.WORKER_PATH is not required and not supported anymore. Have a look at the README for new setup instructions.");}static async hasCamera(){try{return !!(await e.listCameras(!1)).length}catch(a){return !1}}static async listCameras(a=
!1){if(!navigator.mediaDevices)return [];let b=async()=>(await navigator.mediaDevices.enumerateDevices()).filter(d=>"videoinput"===d.kind),c;try{a&&(await b()).every(d=>!d.label)&&(c=await navigator.mediaDevices.getUserMedia({audio:!1,video:!0}));}catch(d){}try{return (await b()).map((d,f)=>({id:d.deviceId,label:d.label||(0===f?"Default Camera":`Camera ${f+1}`)}))}finally{c&&(console.warn("Call listCameras after successfully starting a QR scanner to avoid creating a temporary video stream"),e._stopVideoStream(c));}}async hasFlash(){let a;
try{if(this.$video.srcObject){if(!(this.$video.srcObject instanceof MediaStream))return !1;a=this.$video.srcObject;}else a=(await this._getCameraStream()).stream;return "torch"in a.getVideoTracks()[0].getSettings()}catch(b){return !1}finally{a&&a!==this.$video.srcObject&&(console.warn("Call hasFlash after successfully starting the scanner to avoid creating a temporary video stream"),e._stopVideoStream(a));}}isFlashOn(){return this._flashOn}async toggleFlash(){this._flashOn?await this.turnFlashOff():await this.turnFlashOn();}async turnFlashOn(){if(!this._flashOn&&
!this._destroyed&&(this._flashOn=!0,this._active&&!this._paused))try{if(!await this.hasFlash())throw "No flash available";await this.$video.srcObject.getVideoTracks()[0].applyConstraints({advanced:[{torch:!0}]});}catch(a){throw this._flashOn=!1,a;}}async turnFlashOff(){this._flashOn&&(this._flashOn=!1,await this._restartVideoStream());}destroy(){this.$video.removeEventListener("loadedmetadata",this._onLoadedMetaData);this.$video.removeEventListener("play",this._onPlay);document.removeEventListener("visibilitychange",
this._onVisibilityChange);window.removeEventListener("resize",this._updateOverlay);this._destroyed=!0;this._flashOn=!1;this.stop();e._postWorkerMessage(this._qrEnginePromise,"close");}async start(){if(this._destroyed)throw Error("The QR scanner can not be started as it had been destroyed.");if(!this._active||this._paused)if("https:"!==window.location.protocol&&console.warn("The camera stream is only accessible if the page is transferred via https."),this._active=!0,!document.hidden)if(this._paused=
!1,this.$video.srcObject)await this.$video.play();else try{let {stream:a,facingMode:b}=await this._getCameraStream();!this._active||this._paused?e._stopVideoStream(a):(this._setVideoMirror(b),this.$video.srcObject=a,await this.$video.play(),this._flashOn&&(this._flashOn=!1,this.turnFlashOn().catch(()=>{})));}catch(a){if(!this._paused)throw this._active=!1,a;}}stop(){this.pause();this._active=!1;}async pause(a=!1){this._paused=!0;if(!this._active)return !0;this.$video.pause();this.$overlay&&(this.$overlay.style.display=
"none");let b=()=>{this.$video.srcObject instanceof MediaStream&&(e._stopVideoStream(this.$video.srcObject),this.$video.srcObject=null);};if(a)return b(),!0;await new Promise(c=>setTimeout(c,300));if(!this._paused)return !1;b();return !0}async setCamera(a){a!==this._preferredCamera&&(this._preferredCamera=a,await this._restartVideoStream());}static async scanImage(a,b,c,d,f=!1,h=!1){let m,n=!1;b&&("scanRegion"in b||"qrEngine"in b||"canvas"in b||"disallowCanvasResizing"in b||"alsoTryWithoutScanRegion"in
b||"returnDetailedScanResult"in b)?(m=b.scanRegion,c=b.qrEngine,d=b.canvas,f=b.disallowCanvasResizing||!1,h=b.alsoTryWithoutScanRegion||!1,n=!0):b||c||d||f||h?console.warn("You're using a deprecated api for scanImage which will be removed in the future."):console.warn("Note that the return type of scanImage will change in the future. To already switch to the new api today, you can pass returnDetailedScanResult: true.");b=!!c;try{let p,k;[c,p]=await Promise.all([c||e.createQrEngine(),e._loadImage(a)]);
[d,k]=e._drawToCanvas(p,m,d,f);let q;if(c instanceof Worker){let g=c;b||e._postWorkerMessageSync(g,"inversionMode","both");q=await new Promise((l,v)=>{let w,u,r,y=-1;u=t=>{t.data.id===y&&(g.removeEventListener("message",u),g.removeEventListener("error",r),clearTimeout(w),null!==t.data.data?l({data:t.data.data,cornerPoints:e._convertPoints(t.data.cornerPoints,m)}):v(e.NO_QR_CODE_FOUND));};r=t=>{g.removeEventListener("message",u);g.removeEventListener("error",r);clearTimeout(w);v("Scanner error: "+(t?
t.message||t:"Unknown Error"));};g.addEventListener("message",u);g.addEventListener("error",r);w=setTimeout(()=>r("timeout"),1E4);let x=k.getImageData(0,0,d.width,d.height);y=e._postWorkerMessageSync(g,"decode",x,[x.data.buffer]);});}else q=await Promise.race([new Promise((g,l)=>window.setTimeout(()=>l("Scanner error: timeout"),1E4)),(async()=>{try{var [g]=await c.detect(d);if(!g)throw e.NO_QR_CODE_FOUND;return {data:g.rawValue,cornerPoints:e._convertPoints(g.cornerPoints,m)}}catch(l){g=l.message||l;
if(/not implemented|service unavailable/.test(g))return e._disableBarcodeDetector=!0,e.scanImage(a,{scanRegion:m,canvas:d,disallowCanvasResizing:f,alsoTryWithoutScanRegion:h});throw `Scanner error: ${g}`;}})()]);return n?q:q.data}catch(p){if(!m||!h)throw p;let k=await e.scanImage(a,{qrEngine:c,canvas:d,disallowCanvasResizing:f});return n?k:k.data}finally{b||e._postWorkerMessage(c,"close");}}setGrayscaleWeights(a,b,c,d=!0){e._postWorkerMessage(this._qrEnginePromise,"grayscaleWeights",{red:a,green:b,
blue:c,useIntegerApproximation:d});}setInversionMode(a){e._postWorkerMessage(this._qrEnginePromise,"inversionMode",a);}static async createQrEngine(a){a&&console.warn("Specifying a worker path is not required and not supported anymore.");a=()=>import('./qr-scanner-worker.min-f6019ae0.js').then(c=>c.createWorker());if(!(!e._disableBarcodeDetector&&"BarcodeDetector"in window&&BarcodeDetector.getSupportedFormats&&(await BarcodeDetector.getSupportedFormats()).includes("qr_code")))return a();let b=navigator.userAgentData;
return b&&b.brands.some(({brand:c})=>/Chromium/i.test(c))&&/mac ?OS/i.test(b.platform)&&await b.getHighEntropyValues(["architecture","platformVersion"]).then(({architecture:c,platformVersion:d})=>/arm/i.test(c||"arm")&&13<=parseInt(d||"13")).catch(()=>!0)?a():new BarcodeDetector({formats:["qr_code"]})}_onPlay(){this._scanRegion=this._calculateScanRegion(this.$video);this._updateOverlay();this.$overlay&&(this.$overlay.style.display="");this._scanFrame();}_onLoadedMetaData(){this._scanRegion=this._calculateScanRegion(this.$video);
this._updateOverlay();}_onVisibilityChange(){document.hidden?this.pause():this._active&&this.start();}_calculateScanRegion(a){let b=Math.round(2/3*Math.min(a.videoWidth,a.videoHeight));return {x:Math.round((a.videoWidth-b)/2),y:Math.round((a.videoHeight-b)/2),width:b,height:b,downScaledWidth:this._legacyCanvasSize,downScaledHeight:this._legacyCanvasSize}}_updateOverlay(){requestAnimationFrame(()=>{if(this.$overlay){var a=this.$video,b=a.videoWidth,c=a.videoHeight,d=a.offsetWidth,f=a.offsetHeight,h=a.offsetLeft,
m=a.offsetTop,n=window.getComputedStyle(a),p=n.objectFit,k=b/c,q=d/f;switch(p){case "none":var g=b;var l=c;break;case "fill":g=d;l=f;break;default:("cover"===p?k>q:k<q)?(l=f,g=l*k):(g=d,l=g/k),"scale-down"===p&&(g=Math.min(g,b),l=Math.min(l,c));}var [v,w]=n.objectPosition.split(" ").map((r,y)=>{const x=parseFloat(r);return r.endsWith("%")?(y?f-l:d-g)*x/100:x});n=this._scanRegion.width||b;q=this._scanRegion.height||c;p=this._scanRegion.x||0;var u=this._scanRegion.y||0;k=this.$overlay.style;k.width=
`${n/b*g}px`;k.height=`${q/c*l}px`;k.top=`${m+w+u/c*l}px`;c=/scaleX\(-1\)/.test(a.style.transform);k.left=`${h+(c?d-v-g:v)+(c?b-p-n:p)/b*g}px`;k.transform=a.style.transform;}});}static _convertPoints(a,b){if(!b)return a;let c=b.x||0,d=b.y||0,f=b.width&&b.downScaledWidth?b.width/b.downScaledWidth:1;b=b.height&&b.downScaledHeight?b.height/b.downScaledHeight:1;for(let h of a)h.x=h.x*f+c,h.y=h.y*b+d;return a}_scanFrame(){!this._active||this.$video.paused||this.$video.ended||("requestVideoFrameCallback"in
this.$video?this.$video.requestVideoFrameCallback.bind(this.$video):requestAnimationFrame)(async()=>{if(!(1>=this.$video.readyState)){var a=Date.now()-this._lastScanTimestamp,b=1E3/this._maxScansPerSecond;a<b&&await new Promise(d=>setTimeout(d,b-a));this._lastScanTimestamp=Date.now();try{var c=await e.scanImage(this.$video,{scanRegion:this._scanRegion,qrEngine:this._qrEnginePromise,canvas:this.$canvas});}catch(d){if(!this._active)return;this._onDecodeError(d);}!e._disableBarcodeDetector||await this._qrEnginePromise instanceof
Worker||(this._qrEnginePromise=e.createQrEngine());c?(this._onDecode?this._onDecode(c):this._legacyOnDecode&&this._legacyOnDecode(c.data),this.$codeOutlineHighlight&&(clearTimeout(this._codeOutlineHighlightRemovalTimeout),this._codeOutlineHighlightRemovalTimeout=void 0,this.$codeOutlineHighlight.setAttribute("viewBox",`${this._scanRegion.x||0} `+`${this._scanRegion.y||0} `+`${this._scanRegion.width||this.$video.videoWidth} `+`${this._scanRegion.height||this.$video.videoHeight}`),this.$codeOutlineHighlight.firstElementChild.setAttribute("points",
c.cornerPoints.map(({x:d,y:f})=>`${d},${f}`).join(" ")),this.$codeOutlineHighlight.style.display="")):this.$codeOutlineHighlight&&!this._codeOutlineHighlightRemovalTimeout&&(this._codeOutlineHighlightRemovalTimeout=setTimeout(()=>this.$codeOutlineHighlight.style.display="none",100));}this._scanFrame();});}_onDecodeError(a){a!==e.NO_QR_CODE_FOUND&&console.log(a);}async _getCameraStream(){if(!navigator.mediaDevices)throw "Camera not found.";let a=/^(environment|user)$/.test(this._preferredCamera)?"facingMode":
"deviceId",b=[{width:{min:1024}},{width:{min:768}},{}],c=b.map(d=>Object.assign({},d,{[a]:{exact:this._preferredCamera}}));for(let d of [...c,...b])try{let f=await navigator.mediaDevices.getUserMedia({video:d,audio:!1}),h=this._getFacingMode(f)||(d.facingMode?this._preferredCamera:"environment"===this._preferredCamera?"user":"environment");return {stream:f,facingMode:h}}catch(f){}throw "Camera not found.";}async _restartVideoStream(){let a=this._paused;await this.pause(!0)&&!a&&this._active&&await this.start();}static _stopVideoStream(a){for(let b of a.getTracks())b.stop(),
a.removeTrack(b);}_setVideoMirror(a){this.$video.style.transform="scaleX("+("user"===a?-1:1)+")";}_getFacingMode(a){return (a=a.getVideoTracks()[0])?/rear|back|environment/i.test(a.label)?"environment":/front|user|face/i.test(a.label)?"user":null:null}static _drawToCanvas(a,b,c,d=!1){c=c||document.createElement("canvas");let f=b&&b.x?b.x:0,h=b&&b.y?b.y:0,m=b&&b.width?b.width:a.videoWidth||a.width,n=b&&b.height?b.height:a.videoHeight||a.height;d||(d=b&&b.downScaledWidth?b.downScaledWidth:m,b=b&&b.downScaledHeight?
b.downScaledHeight:n,c.width!==d&&(c.width=d),c.height!==b&&(c.height=b));b=c.getContext("2d",{alpha:!1});b.imageSmoothingEnabled=!1;b.drawImage(a,f,h,m,n,0,0,c.width,c.height);return [c,b]}static async _loadImage(a){if(a instanceof Image)return await e._awaitImageLoad(a),a;if(a instanceof HTMLVideoElement||a instanceof HTMLCanvasElement||a instanceof SVGImageElement||"OffscreenCanvas"in window&&a instanceof OffscreenCanvas||"ImageBitmap"in window&&a instanceof ImageBitmap)return a;if(a instanceof
File||a instanceof Blob||a instanceof URL||"string"===typeof a){let b=new Image;b.src=a instanceof File||a instanceof Blob?URL.createObjectURL(a):a.toString();try{return await e._awaitImageLoad(b),b}finally{(a instanceof File||a instanceof Blob)&&URL.revokeObjectURL(b.src);}}else throw "Unsupported image type.";}static async _awaitImageLoad(a){a.complete&&0!==a.naturalWidth||await new Promise((b,c)=>{let d=f=>{a.removeEventListener("load",d);a.removeEventListener("error",d);f instanceof ErrorEvent?
c("Image load error"):b();};a.addEventListener("load",d);a.addEventListener("error",d);});}static async _postWorkerMessage(a,b,c,d){return e._postWorkerMessageSync(await a,b,c,d)}static _postWorkerMessageSync(a,b,c,d){if(!(a instanceof Worker))return -1;let f=e._workerMessageId++;a.postMessage({id:f,type:b,data:c},d);return f}}e.DEFAULT_CANVAS_SIZE=400;e.NO_QR_CODE_FOUND="No QR code found";e._disableBarcodeDetector=!1;e._workerMessageId=0;

/* src/routes/Scanner.svelte generated by Svelte v3.59.2 */

const { console: console_1$1 } = globals;
const file$4 = "src/routes/Scanner.svelte";

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[14] = list[i];
	return child_ctx;
}

// (167:10) {#each cameras as camera}
function create_each_block(ctx) {
	let div1;
	let img;
	let img_src_value;
	let t0;
	let div0;
	let p;
	let t1_value = /*camera*/ ctx[14].label + "";
	let t1;
	let t2;
	let mounted;
	let dispose;

	function click_handler() {
		return /*click_handler*/ ctx[4](/*camera*/ ctx[14]);
	}

	const block = {
		c: function create() {
			div1 = element("div");
			img = element("img");
			t0 = space();
			div0 = element("div");
			p = element("p");
			t1 = text(t1_value);
			t2 = space();
			if (!src_url_equal(img.src, img_src_value = "https://media.istockphoto.com/id/1226328537/vector/image-place-holder-with-a-gray-camera-icon.jpg?s=612x612&w=0&k=20&c=qRydgCNlE44OUSSoz5XadsH7WCkU59-l-dwrvZzhXsI=")) attr_dev(img, "src", img_src_value);
			attr_dev(img, "class", "card-img-top");
			attr_dev(img, "alt", "...");
			add_location(img, file$4, 175, 14, 4829);
			attr_dev(p, "class", "card-text");
			add_location(p, file$4, 182, 16, 5155);
			attr_dev(div0, "class", "card-body");
			add_location(div0, file$4, 181, 14, 5115);
			attr_dev(div1, "class", "card text-center col-sm-6");
			add_location(div1, file$4, 167, 12, 4564);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div1, anchor);
			append_dev(div1, img);
			append_dev(div1, t0);
			append_dev(div1, div0);
			append_dev(div0, p);
			append_dev(p, t1);
			append_dev(div1, t2);

			if (!mounted) {
				dispose = listen_dev(div1, "click", click_handler, false, false, false, false);
				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty & /*cameras*/ 2 && t1_value !== (t1_value = /*camera*/ ctx[14].label + "")) set_data_dev(t1, t1_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div1);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block.name,
		type: "each",
		source: "(167:10) {#each cameras as camera}",
		ctx
	});

	return block;
}

function create_fragment$6(ctx) {
	let toaster;
	let t0;
	let nav;
	let div0;
	let a;
	let img;
	let img_src_value;
	let t1;
	let t2;
	let form;
	let button0;
	let i0;
	let t3;
	let button1;
	let i1;
	let t4;
	let div2;
	let div1;
	let video;
	let t5;
	let div9;
	let div8;
	let div7;
	let div3;
	let h5;
	let t7;
	let button2;
	let t8;
	let div5;
	let div4;
	let t9;
	let div6;
	let button3;
	let current;
	toaster = new Toaster({ $$inline: true });
	let each_value = /*cameras*/ ctx[1];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			create_component(toaster.$$.fragment);
			t0 = space();
			nav = element("nav");
			div0 = element("div");
			a = element("a");
			img = element("img");
			t1 = text("\n      Semana de la ingenería");
			t2 = space();
			form = element("form");
			button0 = element("button");
			i0 = element("i");
			t3 = space();
			button1 = element("button");
			i1 = element("i");
			t4 = space();
			div2 = element("div");
			div1 = element("div");
			video = element("video");
			t5 = space();
			div9 = element("div");
			div8 = element("div");
			div7 = element("div");
			div3 = element("div");
			h5 = element("h5");
			h5.textContent = "Seleccionar Cámara";
			t7 = space();
			button2 = element("button");
			t8 = space();
			div5 = element("div");
			div4 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t9 = space();
			div6 = element("div");
			button3 = element("button");
			button3.textContent = "Cerrar";
			if (!src_url_equal(img.src, img_src_value = "https://propiedadintelectual.unam.mx/assets/img/unamblanco.png")) attr_dev(img, "src", img_src_value);
			attr_dev(img, "alt", "");
			attr_dev(img, "width", "30");
			attr_dev(img, "height", "24");
			attr_dev(img, "class", "d-inline-block align-text-top");
			add_location(img, file$4, 113, 6, 3122);
			attr_dev(a, "class", "navbar-brand");
			attr_dev(a, "href", "#");
			add_location(a, file$4, 112, 4, 3082);
			attr_dev(i0, "class", "bi bi-camera-video-fill");
			add_location(i0, file$4, 130, 8, 3567);
			attr_dev(button0, "class", "btn btn-secondary");
			attr_dev(button0, "type", "button");
			set_style(button0, "margin-right", "8px");
			attr_dev(button0, "data-bs-toggle", "modal");
			attr_dev(button0, "data-bs-target", "#cameraModal");
			add_location(button0, file$4, 123, 6, 3383);
			attr_dev(i1, "class", "bi bi-grid-fill");
			add_location(i1, file$4, 133, 8, 3686);
			attr_dev(button1, "class", "btn btn-secondary");
			attr_dev(button1, "type", "submit");
			add_location(button1, file$4, 132, 6, 3629);
			attr_dev(form, "class", "d-flex");
			add_location(form, file$4, 122, 4, 3355);
			attr_dev(div0, "class", "container-fluid");
			add_location(div0, file$4, 111, 2, 3048);
			attr_dev(nav, "class", "navbar navbar-dark bg-primary");
			set_style(nav, "border-radius", "12px");
			add_location(nav, file$4, 110, 0, 2973);
			video.playsInline = true;
			attr_dev(video, "class", "svelte-3eht5a");
			add_location(video, file$4, 141, 4, 3872);
			attr_dev(div1, "class", "video-container shadow-lg svelte-3eht5a");
			add_location(div1, file$4, 140, 2, 3828);
			attr_dev(div2, "class", "d-flex justify-content-center align-items-center");
			add_location(div2, file$4, 139, 0, 3763);
			attr_dev(h5, "class", "modal-title");
			attr_dev(h5, "id", "cameraModalLabel");
			add_location(h5, file$4, 156, 8, 4226);
			attr_dev(button2, "type", "button");
			attr_dev(button2, "class", "btn-close");
			attr_dev(button2, "data-bs-dismiss", "modal");
			attr_dev(button2, "aria-label", "Close");
			add_location(button2, file$4, 157, 8, 4304);
			attr_dev(div3, "class", "modal-header");
			add_location(div3, file$4, 155, 6, 4191);
			attr_dev(div4, "class", "row");
			add_location(div4, file$4, 165, 8, 4498);
			attr_dev(div5, "class", "modal-body");
			add_location(div5, file$4, 164, 6, 4465);
			attr_dev(button3, "type", "button");
			attr_dev(button3, "class", "btn btn-secondary");
			attr_dev(button3, "data-bs-dismiss", "modal");
			add_location(button3, file$4, 189, 8, 5322);
			attr_dev(div6, "class", "modal-footer");
			add_location(div6, file$4, 188, 6, 5287);
			attr_dev(div7, "class", "modal-content");
			add_location(div7, file$4, 154, 4, 4157);
			attr_dev(div8, "class", "modal-dialog modal-dialog-centered modal-dialog-scrollable");
			add_location(div8, file$4, 153, 2, 4080);
			attr_dev(div9, "class", "modal fade");
			attr_dev(div9, "id", "cameraModal");
			attr_dev(div9, "tabindex", "-1");
			attr_dev(div9, "aria-labelledby", "cameraModalLabel");
			attr_dev(div9, "aria-hidden", "true");
			add_location(div9, file$4, 146, 0, 3957);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			mount_component(toaster, target, anchor);
			insert_dev(target, t0, anchor);
			insert_dev(target, nav, anchor);
			append_dev(nav, div0);
			append_dev(div0, a);
			append_dev(a, img);
			append_dev(a, t1);
			append_dev(div0, t2);
			append_dev(div0, form);
			append_dev(form, button0);
			append_dev(button0, i0);
			append_dev(form, t3);
			append_dev(form, button1);
			append_dev(button1, i1);
			insert_dev(target, t4, anchor);
			insert_dev(target, div2, anchor);
			append_dev(div2, div1);
			append_dev(div1, video);
			/*video_binding*/ ctx[3](video);
			insert_dev(target, t5, anchor);
			insert_dev(target, div9, anchor);
			append_dev(div9, div8);
			append_dev(div8, div7);
			append_dev(div7, div3);
			append_dev(div3, h5);
			append_dev(div3, t7);
			append_dev(div3, button2);
			append_dev(div7, t8);
			append_dev(div7, div5);
			append_dev(div5, div4);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div4, null);
				}
			}

			append_dev(div7, t9);
			append_dev(div7, div6);
			append_dev(div6, button3);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*selectCamera, cameras, document*/ 6) {
				each_value = /*cameras*/ ctx[1];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div4, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(toaster.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(toaster.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(toaster, detaching);
			if (detaching) detach_dev(t0);
			if (detaching) detach_dev(nav);
			if (detaching) detach_dev(t4);
			if (detaching) detach_dev(div2);
			/*video_binding*/ ctx[3](null);
			if (detaching) detach_dev(t5);
			if (detaching) detach_dev(div9);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$6.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$6($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Scanner', slots, []);
	let videoElement;
	let qrScanner;
	let scanResult;
	let cameras = [];
	let currentCameraIndex = 0;
	let cameraNames = [];
	let currentCameraLabel = "";
	let lastToastTime = 0;

	let toastOptions = {
		duration: 5000,
		position: "bottom-center",
		type: "success",
		showIcon: true,
		showCloseButton: true,
		closeOnClick: true,
		pauseOnHover: true,
		pauseOnFocusLoss: true,
		closeOnEscape: true
	};

	function selectCamera(cameraId) {
		qrScanner.setCamera(cameraId).then(() => {
			console.log("Camera switched to: " + cameraId);
			currentCameraLabel = cameras.find(camera => camera.id === cameraId).label;

			qrScanner.start().catch(err => {
				console.error("Error starting QR Scanner with selected camera: ", err);
				alert("Error starting QR Scanner with selected camera: " + err);
			});
		}).catch(err => {
			console.error("Error setting camera: ", err);
		});
	}

	function switchCamera() {
		currentCameraIndex = (currentCameraIndex + 1) % cameras.length;
		currentCameraLabel = cameras[currentCameraIndex].label; // Actualiza la etiqueta de la cámara actual

		qrScanner.setCamera(cameras[currentCameraIndex].id).then(() => {
			console.log("Switched to camera: " + currentCameraLabel);
		}).catch(err => {
			console.error("Error switching cameras:", err);
		});
	}

	function startScanner(cameraId) {
		qrScanner = new e(videoElement,
		result => {
				const now = Date.now();

				if (now - lastToastTime > 3000) {
					lastToastTime = now;
					console.log("QR code scanned:", result);
					scanResult = result.data;
					toast.success("Visita registrada: " + scanResult, toastOptions);
				}
			},
		{
				highlightScanRegion: true,
				highlightCodeOutline: true
			});

		qrScanner.setCamera(cameraId).then(() => {
			qrScanner.start().catch(err => {
				console.error("Error starting QR Scanner: ", err);
				alert("Error starting QR Scanner: " + err);
			});
		});
	}

	onMount(() => {
		e.listCameras(true).then(foundCameras => {
			$$invalidate(1, cameras = foundCameras);
			cameraNames = cameras.map(camera => camera.label);
			const rearCamera = cameras.find(camera => camera.label.toLowerCase().includes("back"));
			startScanner(rearCamera ? rearCamera.id : cameras[0].id);
		}).catch(error => {
			console.error("Could not list cameras:", error);
			alert("Could not list cameras. Please check camera permissions.");
		});
	});

	onDestroy(() => {
		qrScanner.stop();
	});

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<Scanner> was created with unknown prop '${key}'`);
	});

	function video_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			videoElement = $$value;
			$$invalidate(0, videoElement);
		});
	}

	const click_handler = camera => {
		selectCamera(camera.id);

		//close modal
		document.getElementById("cameraModal").click();
	};

	$$self.$capture_state = () => ({
		onMount,
		onDestroy,
		QrScanner: e,
		toast,
		Toaster,
		videoElement,
		qrScanner,
		scanResult,
		cameras,
		currentCameraIndex,
		cameraNames,
		currentCameraLabel,
		lastToastTime,
		toastOptions,
		selectCamera,
		switchCamera,
		startScanner
	});

	$$self.$inject_state = $$props => {
		if ('videoElement' in $$props) $$invalidate(0, videoElement = $$props.videoElement);
		if ('qrScanner' in $$props) qrScanner = $$props.qrScanner;
		if ('scanResult' in $$props) scanResult = $$props.scanResult;
		if ('cameras' in $$props) $$invalidate(1, cameras = $$props.cameras);
		if ('currentCameraIndex' in $$props) currentCameraIndex = $$props.currentCameraIndex;
		if ('cameraNames' in $$props) cameraNames = $$props.cameraNames;
		if ('currentCameraLabel' in $$props) currentCameraLabel = $$props.currentCameraLabel;
		if ('lastToastTime' in $$props) lastToastTime = $$props.lastToastTime;
		if ('toastOptions' in $$props) toastOptions = $$props.toastOptions;
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [videoElement, cameras, selectCamera, video_binding, click_handler];
}

class Scanner extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Scanner",
			options,
			id: create_fragment$6.name
		});
	}
}

const LOCATION = {};
const ROUTER = {};
const HISTORY = {};

/**
 * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
 * https://github.com/reach/router/blob/master/LICENSE
 */

const PARAM = /^:(.+)/;
const SEGMENT_POINTS = 4;
const STATIC_POINTS = 3;
const DYNAMIC_POINTS = 2;
const SPLAT_PENALTY = 1;
const ROOT_POINTS = 1;

/**
 * Split up the URI into segments delimited by `/`
 * Strip starting/ending `/`
 * @param {string} uri
 * @return {string[]}
 */
const segmentize = (uri) => uri.replace(/(^\/+|\/+$)/g, "").split("/");
/**
 * Strip `str` of potential start and end `/`
 * @param {string} string
 * @return {string}
 */
const stripSlashes = (string) => string.replace(/(^\/+|\/+$)/g, "");
/**
 * Score a route depending on how its individual segments look
 * @param {object} route
 * @param {number} index
 * @return {object}
 */
const rankRoute = (route, index) => {
    const score = route.default
        ? 0
        : segmentize(route.path).reduce((score, segment) => {
              score += SEGMENT_POINTS;

              if (segment === "") {
                  score += ROOT_POINTS;
              } else if (PARAM.test(segment)) {
                  score += DYNAMIC_POINTS;
              } else if (segment[0] === "*") {
                  score -= SEGMENT_POINTS + SPLAT_PENALTY;
              } else {
                  score += STATIC_POINTS;
              }

              return score;
          }, 0);

    return { route, score, index };
};
/**
 * Give a score to all routes and sort them on that
 * If two routes have the exact same score, we go by index instead
 * @param {object[]} routes
 * @return {object[]}
 */
const rankRoutes = (routes) =>
    routes
        .map(rankRoute)
        .sort((a, b) =>
            a.score < b.score ? 1 : a.score > b.score ? -1 : a.index - b.index
        );
/**
 * Ranks and picks the best route to match. Each segment gets the highest
 * amount of points, then the type of segment gets an additional amount of
 * points where
 *
 *  static > dynamic > splat > root
 *
 * This way we don't have to worry about the order of our routes, let the
 * computers do it.
 *
 * A route looks like this
 *
 *  { path, default, value }
 *
 * And a returned match looks like:
 *
 *  { route, params, uri }
 *
 * @param {object[]} routes
 * @param {string} uri
 * @return {?object}
 */
const pick = (routes, uri) => {
    let match;
    let default_;

    const [uriPathname] = uri.split("?");
    const uriSegments = segmentize(uriPathname);
    const isRootUri = uriSegments[0] === "";
    const ranked = rankRoutes(routes);

    for (let i = 0, l = ranked.length; i < l; i++) {
        const route = ranked[i].route;
        let missed = false;

        if (route.default) {
            default_ = {
                route,
                params: {},
                uri,
            };
            continue;
        }

        const routeSegments = segmentize(route.path);
        const params = {};
        const max = Math.max(uriSegments.length, routeSegments.length);
        let index = 0;

        for (; index < max; index++) {
            const routeSegment = routeSegments[index];
            const uriSegment = uriSegments[index];

            if (routeSegment && routeSegment[0] === "*") {
                // Hit a splat, just grab the rest, and return a match
                // uri:   /files/documents/work
                // route: /files/* or /files/*splatname
                const splatName =
                    routeSegment === "*" ? "*" : routeSegment.slice(1);

                params[splatName] = uriSegments
                    .slice(index)
                    .map(decodeURIComponent)
                    .join("/");
                break;
            }

            if (typeof uriSegment === "undefined") {
                // URI is shorter than the route, no match
                // uri:   /users
                // route: /users/:userId
                missed = true;
                break;
            }

            const dynamicMatch = PARAM.exec(routeSegment);

            if (dynamicMatch && !isRootUri) {
                const value = decodeURIComponent(uriSegment);
                params[dynamicMatch[1]] = value;
            } else if (routeSegment !== uriSegment) {
                // Current segments don't match, not dynamic, not splat, so no match
                // uri:   /users/123/settings
                // route: /users/:id/profile
                missed = true;
                break;
            }
        }

        if (!missed) {
            match = {
                route,
                params,
                uri: "/" + uriSegments.slice(0, index).join("/"),
            };
            break;
        }
    }

    return match || default_ || null;
};
/**
 * Add the query to the pathname if a query is given
 * @param {string} pathname
 * @param {string} [query]
 * @return {string}
 */
const addQuery = (pathname, query) => pathname + (query ? `?${query}` : "");
/**
 * Resolve URIs as though every path is a directory, no files. Relative URIs
 * in the browser can feel awkward because not only can you be "in a directory",
 * you can be "at a file", too. For example:
 *
 *  browserSpecResolve('foo', '/bar/') => /bar/foo
 *  browserSpecResolve('foo', '/bar') => /foo
 *
 * But on the command line of a file system, it's not as complicated. You can't
 * `cd` from a file, only directories. This way, links have to know less about
 * their current path. To go deeper you can do this:
 *
 *  <Link to="deeper"/>
 *  // instead of
 *  <Link to=`{${props.uri}/deeper}`/>
 *
 * Just like `cd`, if you want to go deeper from the command line, you do this:
 *
 *  cd deeper
 *  # not
 *  cd $(pwd)/deeper
 *
 * By treating every path as a directory, linking to relative paths should
 * require less contextual information and (fingers crossed) be more intuitive.
 * @param {string} to
 * @param {string} base
 * @return {string}
 */
const resolve = (to, base) => {
    // /foo/bar, /baz/qux => /foo/bar
    if (to.startsWith("/")) return to;

    const [toPathname, toQuery] = to.split("?");
    const [basePathname] = base.split("?");
    const toSegments = segmentize(toPathname);
    const baseSegments = segmentize(basePathname);

    // ?a=b, /users?b=c => /users?a=b
    if (toSegments[0] === "") return addQuery(basePathname, toQuery);

    // profile, /users/789 => /users/789/profile

    if (!toSegments[0].startsWith(".")) {
        const pathname = baseSegments.concat(toSegments).join("/");
        return addQuery((basePathname === "/" ? "" : "/") + pathname, toQuery);
    }

    // ./       , /users/123 => /users/123
    // ../      , /users/123 => /users
    // ../..    , /users/123 => /
    // ../../one, /a/b/c/d   => /a/b/one
    // .././one , /a/b/c/d   => /a/b/c/one
    const allSegments = baseSegments.concat(toSegments);
    const segments = [];

    allSegments.forEach((segment) => {
        if (segment === "..") segments.pop();
        else if (segment !== ".") segments.push(segment);
    });

    return addQuery("/" + segments.join("/"), toQuery);
};
/**
 * Combines the `basepath` and the `path` into one path.
 * @param {string} basepath
 * @param {string} path
 */
const combinePaths = (basepath, path) =>
    `${stripSlashes(
        path === "/"
            ? basepath
            : `${stripSlashes(basepath)}/${stripSlashes(path)}`
    )}/`;
/**
 * Decides whether a given `event` should result in a navigation or not.
 * @param {object} event
 */
const shouldNavigate = (event) =>
    !event.defaultPrevented &&
    event.button === 0 &&
    !(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);

const canUseDOM = () =>
    typeof window !== "undefined" &&
    "document" in window &&
    "location" in window;

/* node_modules/svelte-routing/src/Link.svelte generated by Svelte v3.59.2 */
const file$3 = "node_modules/svelte-routing/src/Link.svelte";
const get_default_slot_changes$2 = dirty => ({ active: dirty & /*ariaCurrent*/ 4 });
const get_default_slot_context$2 = ctx => ({ active: !!/*ariaCurrent*/ ctx[2] });

function create_fragment$5(ctx) {
	let a;
	let current;
	let mounted;
	let dispose;
	const default_slot_template = /*#slots*/ ctx[17].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[16], get_default_slot_context$2);

	let a_levels = [
		{ href: /*href*/ ctx[0] },
		{ "aria-current": /*ariaCurrent*/ ctx[2] },
		/*props*/ ctx[1],
		/*$$restProps*/ ctx[6]
	];

	let a_data = {};

	for (let i = 0; i < a_levels.length; i += 1) {
		a_data = assign(a_data, a_levels[i]);
	}

	const block = {
		c: function create() {
			a = element("a");
			if (default_slot) default_slot.c();
			set_attributes(a, a_data);
			add_location(a, file$3, 41, 0, 1414);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, a, anchor);

			if (default_slot) {
				default_slot.m(a, null);
			}

			current = true;

			if (!mounted) {
				dispose = listen_dev(a, "click", /*onClick*/ ctx[5], false, false, false, false);
				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope, ariaCurrent*/ 65540)) {
					update_slot_base(
						default_slot,
						default_slot_template,
						ctx,
						/*$$scope*/ ctx[16],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[16])
						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[16], dirty, get_default_slot_changes$2),
						get_default_slot_context$2
					);
				}
			}

			set_attributes(a, a_data = get_spread_update(a_levels, [
				(!current || dirty & /*href*/ 1) && { href: /*href*/ ctx[0] },
				(!current || dirty & /*ariaCurrent*/ 4) && { "aria-current": /*ariaCurrent*/ ctx[2] },
				dirty & /*props*/ 2 && /*props*/ ctx[1],
				dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6]
			]));
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(a);
			if (default_slot) default_slot.d(detaching);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$5.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$5($$self, $$props, $$invalidate) {
	let ariaCurrent;
	const omit_props_names = ["to","replace","state","getProps","preserveScroll"];
	let $$restProps = compute_rest_props($$props, omit_props_names);
	let $location;
	let $base;
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Link', slots, ['default']);
	let { to = "#" } = $$props;
	let { replace = false } = $$props;
	let { state = {} } = $$props;
	let { getProps = () => ({}) } = $$props;
	let { preserveScroll = false } = $$props;
	const location = getContext(LOCATION);
	validate_store(location, 'location');
	component_subscribe($$self, location, value => $$invalidate(14, $location = value));
	const { base } = getContext(ROUTER);
	validate_store(base, 'base');
	component_subscribe($$self, base, value => $$invalidate(15, $base = value));
	const { navigate } = getContext(HISTORY);
	const dispatch = createEventDispatcher();
	let href, isPartiallyCurrent, isCurrent, props;

	const onClick = event => {
		dispatch("click", event);

		if (shouldNavigate(event)) {
			event.preventDefault();

			// Don't push another entry to the history stack when the user
			// clicks on a Link to the page they are currently on.
			const shouldReplace = $location.pathname === href || replace;

			navigate(href, {
				state,
				replace: shouldReplace,
				preserveScroll
			});
		}
	};

	$$self.$$set = $$new_props => {
		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
		$$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
		if ('to' in $$new_props) $$invalidate(7, to = $$new_props.to);
		if ('replace' in $$new_props) $$invalidate(8, replace = $$new_props.replace);
		if ('state' in $$new_props) $$invalidate(9, state = $$new_props.state);
		if ('getProps' in $$new_props) $$invalidate(10, getProps = $$new_props.getProps);
		if ('preserveScroll' in $$new_props) $$invalidate(11, preserveScroll = $$new_props.preserveScroll);
		if ('$$scope' in $$new_props) $$invalidate(16, $$scope = $$new_props.$$scope);
	};

	$$self.$capture_state = () => ({
		createEventDispatcher,
		getContext,
		HISTORY,
		LOCATION,
		ROUTER,
		resolve,
		shouldNavigate,
		to,
		replace,
		state,
		getProps,
		preserveScroll,
		location,
		base,
		navigate,
		dispatch,
		href,
		isPartiallyCurrent,
		isCurrent,
		props,
		onClick,
		ariaCurrent,
		$location,
		$base
	});

	$$self.$inject_state = $$new_props => {
		if ('to' in $$props) $$invalidate(7, to = $$new_props.to);
		if ('replace' in $$props) $$invalidate(8, replace = $$new_props.replace);
		if ('state' in $$props) $$invalidate(9, state = $$new_props.state);
		if ('getProps' in $$props) $$invalidate(10, getProps = $$new_props.getProps);
		if ('preserveScroll' in $$props) $$invalidate(11, preserveScroll = $$new_props.preserveScroll);
		if ('href' in $$props) $$invalidate(0, href = $$new_props.href);
		if ('isPartiallyCurrent' in $$props) $$invalidate(12, isPartiallyCurrent = $$new_props.isPartiallyCurrent);
		if ('isCurrent' in $$props) $$invalidate(13, isCurrent = $$new_props.isCurrent);
		if ('props' in $$props) $$invalidate(1, props = $$new_props.props);
		if ('ariaCurrent' in $$props) $$invalidate(2, ariaCurrent = $$new_props.ariaCurrent);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*to, $base*/ 32896) {
			$$invalidate(0, href = resolve(to, $base.uri));
		}

		if ($$self.$$.dirty & /*$location, href*/ 16385) {
			$$invalidate(12, isPartiallyCurrent = $location.pathname.startsWith(href));
		}

		if ($$self.$$.dirty & /*href, $location*/ 16385) {
			$$invalidate(13, isCurrent = href === $location.pathname);
		}

		if ($$self.$$.dirty & /*isCurrent*/ 8192) {
			$$invalidate(2, ariaCurrent = isCurrent ? "page" : undefined);
		}

		$$invalidate(1, props = getProps({
			location: $location,
			href,
			isPartiallyCurrent,
			isCurrent,
			existingProps: $$restProps
		}));
	};

	return [
		href,
		props,
		ariaCurrent,
		location,
		base,
		onClick,
		$$restProps,
		to,
		replace,
		state,
		getProps,
		preserveScroll,
		isPartiallyCurrent,
		isCurrent,
		$location,
		$base,
		$$scope,
		slots
	];
}

class Link extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$5, create_fragment$5, safe_not_equal, {
			to: 7,
			replace: 8,
			state: 9,
			getProps: 10,
			preserveScroll: 11
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Link",
			options,
			id: create_fragment$5.name
		});
	}

	get to() {
		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set to(value) {
		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get replace() {
		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set replace(value) {
		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get state() {
		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set state(value) {
		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get getProps() {
		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set getProps(value) {
		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get preserveScroll() {
		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set preserveScroll(value) {
		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* node_modules/svelte-routing/src/Route.svelte generated by Svelte v3.59.2 */
const get_default_slot_changes$1 = dirty => ({ params: dirty & /*routeParams*/ 4 });
const get_default_slot_context$1 = ctx => ({ params: /*routeParams*/ ctx[2] });

// (42:0) {#if $activeRoute && $activeRoute.route === route}
function create_if_block$1(ctx) {
	let current_block_type_index;
	let if_block;
	let if_block_anchor;
	let current;
	const if_block_creators = [create_if_block_1, create_else_block$1];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*component*/ ctx[0]) return 0;
		return 1;
	}

	current_block_type_index = select_block_type(ctx);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	const block = {
		c: function create() {
			if_block.c();
			if_block_anchor = empty();
		},
		m: function mount(target, anchor) {
			if_blocks[current_block_type_index].m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(ctx, dirty);
			} else {
				group_outros();

				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				check_outros();
				if_block = if_blocks[current_block_type_index];

				if (!if_block) {
					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block.c();
				} else {
					if_block.p(ctx, dirty);
				}

				transition_in(if_block, 1);
				if_block.m(if_block_anchor.parentNode, if_block_anchor);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if_blocks[current_block_type_index].d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$1.name,
		type: "if",
		source: "(42:0) {#if $activeRoute && $activeRoute.route === route}",
		ctx
	});

	return block;
}

// (51:4) {:else}
function create_else_block$1(ctx) {
	let current;
	const default_slot_template = /*#slots*/ ctx[8].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], get_default_slot_context$1);

	const block = {
		c: function create() {
			if (default_slot) default_slot.c();
		},
		m: function mount(target, anchor) {
			if (default_slot) {
				default_slot.m(target, anchor);
			}

			current = true;
		},
		p: function update(ctx, dirty) {
			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope, routeParams*/ 132)) {
					update_slot_base(
						default_slot,
						default_slot_template,
						ctx,
						/*$$scope*/ ctx[7],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[7], dirty, get_default_slot_changes$1),
						get_default_slot_context$1
					);
				}
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (default_slot) default_slot.d(detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block$1.name,
		type: "else",
		source: "(51:4) {:else}",
		ctx
	});

	return block;
}

// (43:4) {#if component}
function create_if_block_1(ctx) {
	let await_block_anchor;
	let promise;
	let current;

	let info = {
		ctx,
		current: null,
		token: null,
		hasCatch: false,
		pending: create_pending_block,
		then: create_then_block,
		catch: create_catch_block,
		value: 12,
		blocks: [,,,]
	};

	handle_promise(promise = /*component*/ ctx[0], info);

	const block = {
		c: function create() {
			await_block_anchor = empty();
			info.block.c();
		},
		m: function mount(target, anchor) {
			insert_dev(target, await_block_anchor, anchor);
			info.block.m(target, info.anchor = anchor);
			info.mount = () => await_block_anchor.parentNode;
			info.anchor = await_block_anchor;
			current = true;
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;
			info.ctx = ctx;

			if (dirty & /*component*/ 1 && promise !== (promise = /*component*/ ctx[0]) && handle_promise(promise, info)) ; else {
				update_await_block_branch(info, ctx, dirty);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(info.block);
			current = true;
		},
		o: function outro(local) {
			for (let i = 0; i < 3; i += 1) {
				const block = info.blocks[i];
				transition_out(block);
			}

			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(await_block_anchor);
			info.block.d(detaching);
			info.token = null;
			info = null;
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1.name,
		type: "if",
		source: "(43:4) {#if component}",
		ctx
	});

	return block;
}

// (1:0) <script>     import { getContext, onDestroy }
function create_catch_block(ctx) {
	const block = {
		c: noop,
		m: noop,
		p: noop,
		i: noop,
		o: noop,
		d: noop
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_catch_block.name,
		type: "catch",
		source: "(1:0) <script>     import { getContext, onDestroy }",
		ctx
	});

	return block;
}

// (44:49)              <svelte:component                 this={resolvedComponent?.default || resolvedComponent}
function create_then_block(ctx) {
	let switch_instance;
	let switch_instance_anchor;
	let current;
	const switch_instance_spread_levels = [/*routeParams*/ ctx[2], /*routeProps*/ ctx[3]];
	var switch_value = /*resolvedComponent*/ ctx[12]?.default || /*resolvedComponent*/ ctx[12];

	function switch_props(ctx) {
		let switch_instance_props = {};

		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
		}

		return {
			props: switch_instance_props,
			$$inline: true
		};
	}

	if (switch_value) {
		switch_instance = construct_svelte_component_dev(switch_value, switch_props());
	}

	const block = {
		c: function create() {
			if (switch_instance) create_component(switch_instance.$$.fragment);
			switch_instance_anchor = empty();
		},
		m: function mount(target, anchor) {
			if (switch_instance) mount_component(switch_instance, target, anchor);
			insert_dev(target, switch_instance_anchor, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const switch_instance_changes = (dirty & /*routeParams, routeProps*/ 12)
			? get_spread_update(switch_instance_spread_levels, [
					dirty & /*routeParams*/ 4 && get_spread_object(/*routeParams*/ ctx[2]),
					dirty & /*routeProps*/ 8 && get_spread_object(/*routeProps*/ ctx[3])
				])
			: {};

			if (dirty & /*component*/ 1 && switch_value !== (switch_value = /*resolvedComponent*/ ctx[12]?.default || /*resolvedComponent*/ ctx[12])) {
				if (switch_instance) {
					group_outros();
					const old_component = switch_instance;

					transition_out(old_component.$$.fragment, 1, 0, () => {
						destroy_component(old_component, 1);
					});

					check_outros();
				}

				if (switch_value) {
					switch_instance = construct_svelte_component_dev(switch_value, switch_props());
					create_component(switch_instance.$$.fragment);
					transition_in(switch_instance.$$.fragment, 1);
					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
				} else {
					switch_instance = null;
				}
			} else if (switch_value) {
				switch_instance.$set(switch_instance_changes);
			}
		},
		i: function intro(local) {
			if (current) return;
			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(switch_instance_anchor);
			if (switch_instance) destroy_component(switch_instance, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_then_block.name,
		type: "then",
		source: "(44:49)              <svelte:component                 this={resolvedComponent?.default || resolvedComponent}",
		ctx
	});

	return block;
}

// (1:0) <script>     import { getContext, onDestroy }
function create_pending_block(ctx) {
	const block = {
		c: noop,
		m: noop,
		p: noop,
		i: noop,
		o: noop,
		d: noop
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_pending_block.name,
		type: "pending",
		source: "(1:0) <script>     import { getContext, onDestroy }",
		ctx
	});

	return block;
}

function create_fragment$4(ctx) {
	let if_block_anchor;
	let current;
	let if_block = /*$activeRoute*/ ctx[1] && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[5] && create_if_block$1(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (/*$activeRoute*/ ctx[1] && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[5]) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*$activeRoute*/ 2) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block$1(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$4.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$4($$self, $$props, $$invalidate) {
	let $activeRoute;
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Route', slots, ['default']);
	let { path = "" } = $$props;
	let { component = null } = $$props;
	let routeParams = {};
	let routeProps = {};
	const { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER);
	validate_store(activeRoute, 'activeRoute');
	component_subscribe($$self, activeRoute, value => $$invalidate(1, $activeRoute = value));

	const route = {
		path,
		// If no path prop is given, this Route will act as the default Route
		// that is rendered if no other Route in the Router is a match.
		default: path === ""
	};

	registerRoute(route);

	onDestroy(() => {
		unregisterRoute(route);
	});

	$$self.$$set = $$new_props => {
		$$invalidate(11, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
		if ('path' in $$new_props) $$invalidate(6, path = $$new_props.path);
		if ('component' in $$new_props) $$invalidate(0, component = $$new_props.component);
		if ('$$scope' in $$new_props) $$invalidate(7, $$scope = $$new_props.$$scope);
	};

	$$self.$capture_state = () => ({
		getContext,
		onDestroy,
		ROUTER,
		canUseDOM,
		path,
		component,
		routeParams,
		routeProps,
		registerRoute,
		unregisterRoute,
		activeRoute,
		route,
		$activeRoute
	});

	$$self.$inject_state = $$new_props => {
		$$invalidate(11, $$props = assign(assign({}, $$props), $$new_props));
		if ('path' in $$props) $$invalidate(6, path = $$new_props.path);
		if ('component' in $$props) $$invalidate(0, component = $$new_props.component);
		if ('routeParams' in $$props) $$invalidate(2, routeParams = $$new_props.routeParams);
		if ('routeProps' in $$props) $$invalidate(3, routeProps = $$new_props.routeProps);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($activeRoute && $activeRoute.route === route) {
			$$invalidate(2, routeParams = $activeRoute.params);
			const { component: c, path, ...rest } = $$props;
			$$invalidate(3, routeProps = rest);

			if (c) {
				if (c.toString().startsWith("class ")) $$invalidate(0, component = c); else $$invalidate(0, component = c());
			}

			canUseDOM() && !$activeRoute.preserveScroll && window?.scrollTo(0, 0);
		}
	};

	$$props = exclude_internal_props($$props);

	return [
		component,
		$activeRoute,
		routeParams,
		routeProps,
		activeRoute,
		route,
		path,
		$$scope,
		slots
	];
}

class Route extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$4, create_fragment$4, safe_not_equal, { path: 6, component: 0 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Route",
			options,
			id: create_fragment$4.name
		});
	}

	get path() {
		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set path(value) {
		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get component() {
		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set component(value) {
		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/**
 * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/history.js
 * https://github.com/reach/router/blob/master/LICENSE
 */

const getLocation = (source) => {
    return {
        ...source.location,
        state: source.history.state,
        key: (source.history.state && source.history.state.key) || "initial",
    };
};
const createHistory = (source) => {
    const listeners = [];
    let location = getLocation(source);

    return {
        get location() {
            return location;
        },

        listen(listener) {
            listeners.push(listener);

            const popstateListener = () => {
                location = getLocation(source);
                listener({ location, action: "POP" });
            };

            source.addEventListener("popstate", popstateListener);

            return () => {
                source.removeEventListener("popstate", popstateListener);
                const index = listeners.indexOf(listener);
                listeners.splice(index, 1);
            };
        },

        navigate(to, { state, replace = false, preserveScroll = false, blurActiveElement = true } = {}) {
            state = { ...state, key: Date.now() + "" };
            // try...catch iOS Safari limits to 100 pushState calls
            try {
                if (replace) source.history.replaceState(state, "", to);
                else source.history.pushState(state, "", to);
            } catch (e) {
                source.location[replace ? "replace" : "assign"](to);
            }
            location = getLocation(source);
            listeners.forEach((listener) =>
                listener({ location, action: "PUSH", preserveScroll })
            );
            if(blurActiveElement) document.activeElement.blur();
        },
    };
};
// Stores history entries in memory for testing or other platforms like Native
const createMemorySource = (initialPathname = "/") => {
    let index = 0;
    const stack = [{ pathname: initialPathname, search: "" }];
    const states = [];

    return {
        get location() {
            return stack[index];
        },
        addEventListener(name, fn) {},
        removeEventListener(name, fn) {},
        history: {
            get entries() {
                return stack;
            },
            get index() {
                return index;
            },
            get state() {
                return states[index];
            },
            pushState(state, _, uri) {
                const [pathname, search = ""] = uri.split("?");
                index++;
                stack.push({ pathname, search });
                states.push(state);
            },
            replaceState(state, _, uri) {
                const [pathname, search = ""] = uri.split("?");
                stack[index] = { pathname, search };
                states[index] = state;
            },
        },
    };
};
// Global history uses window.history as the source if available,
// otherwise a memory history
const globalHistory = createHistory(
    canUseDOM() ? window : createMemorySource()
);

/* node_modules/svelte-routing/src/Router.svelte generated by Svelte v3.59.2 */

const { Object: Object_1 } = globals;
const file$2 = "node_modules/svelte-routing/src/Router.svelte";

const get_default_slot_changes_1 = dirty => ({
	route: dirty & /*$activeRoute*/ 4,
	location: dirty & /*$location*/ 2
});

const get_default_slot_context_1 = ctx => ({
	route: /*$activeRoute*/ ctx[2] && /*$activeRoute*/ ctx[2].uri,
	location: /*$location*/ ctx[1]
});

const get_default_slot_changes = dirty => ({
	route: dirty & /*$activeRoute*/ 4,
	location: dirty & /*$location*/ 2
});

const get_default_slot_context = ctx => ({
	route: /*$activeRoute*/ ctx[2] && /*$activeRoute*/ ctx[2].uri,
	location: /*$location*/ ctx[1]
});

// (143:0) {:else}
function create_else_block(ctx) {
	let current;
	const default_slot_template = /*#slots*/ ctx[15].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[14], get_default_slot_context_1);

	const block = {
		c: function create() {
			if (default_slot) default_slot.c();
		},
		m: function mount(target, anchor) {
			if (default_slot) {
				default_slot.m(target, anchor);
			}

			current = true;
		},
		p: function update(ctx, dirty) {
			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope, $activeRoute, $location*/ 16390)) {
					update_slot_base(
						default_slot,
						default_slot_template,
						ctx,
						/*$$scope*/ ctx[14],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[14])
						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[14], dirty, get_default_slot_changes_1),
						get_default_slot_context_1
					);
				}
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (default_slot) default_slot.d(detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block.name,
		type: "else",
		source: "(143:0) {:else}",
		ctx
	});

	return block;
}

// (134:0) {#if viewtransition}
function create_if_block(ctx) {
	let previous_key = /*$location*/ ctx[1].pathname;
	let key_block_anchor;
	let current;
	let key_block = create_key_block(ctx);

	const block = {
		c: function create() {
			key_block.c();
			key_block_anchor = empty();
		},
		m: function mount(target, anchor) {
			key_block.m(target, anchor);
			insert_dev(target, key_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			if (dirty & /*$location*/ 2 && safe_not_equal(previous_key, previous_key = /*$location*/ ctx[1].pathname)) {
				group_outros();
				transition_out(key_block, 1, 1, noop);
				check_outros();
				key_block = create_key_block(ctx);
				key_block.c();
				transition_in(key_block, 1);
				key_block.m(key_block_anchor.parentNode, key_block_anchor);
			} else {
				key_block.p(ctx, dirty);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(key_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(key_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(key_block_anchor);
			key_block.d(detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block.name,
		type: "if",
		source: "(134:0) {#if viewtransition}",
		ctx
	});

	return block;
}

// (135:4) {#key $location.pathname}
function create_key_block(ctx) {
	let div;
	let div_intro;
	let div_outro;
	let current;
	const default_slot_template = /*#slots*/ ctx[15].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[14], get_default_slot_context);

	const block = {
		c: function create() {
			div = element("div");
			if (default_slot) default_slot.c();
			add_location(div, file$2, 135, 8, 4659);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			if (default_slot) {
				default_slot.m(div, null);
			}

			current = true;
		},
		p: function update(ctx, dirty) {
			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope, $activeRoute, $location*/ 16390)) {
					update_slot_base(
						default_slot,
						default_slot_template,
						ctx,
						/*$$scope*/ ctx[14],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[14])
						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[14], dirty, get_default_slot_changes),
						get_default_slot_context
					);
				}
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);

			add_render_callback(() => {
				if (!current) return;
				if (div_outro) div_outro.end(1);
				div_intro = create_in_transition(div, /*viewtransitionFn*/ ctx[3], {});
				div_intro.start();
			});

			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			if (div_intro) div_intro.invalidate();
			div_outro = create_out_transition(div, /*viewtransitionFn*/ ctx[3], {});
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if (default_slot) default_slot.d(detaching);
			if (detaching && div_outro) div_outro.end();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_key_block.name,
		type: "key",
		source: "(135:4) {#key $location.pathname}",
		ctx
	});

	return block;
}

function create_fragment$3(ctx) {
	let current_block_type_index;
	let if_block;
	let if_block_anchor;
	let current;
	const if_block_creators = [create_if_block, create_else_block];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*viewtransition*/ ctx[0]) return 0;
		return 1;
	}

	current_block_type_index = select_block_type(ctx);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	const block = {
		c: function create() {
			if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if_blocks[current_block_type_index].m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(ctx, dirty);
			} else {
				group_outros();

				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				check_outros();
				if_block = if_blocks[current_block_type_index];

				if (!if_block) {
					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block.c();
				} else {
					if_block.p(ctx, dirty);
				}

				transition_in(if_block, 1);
				if_block.m(if_block_anchor.parentNode, if_block_anchor);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if_blocks[current_block_type_index].d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$3.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$3($$self, $$props, $$invalidate) {
	let $location;
	let $routes;
	let $base;
	let $activeRoute;
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Router', slots, ['default']);
	let { basepath = "/" } = $$props;
	let { url = null } = $$props;
	let { viewtransition = null } = $$props;
	let { history = globalHistory } = $$props;

	const viewtransitionFn = (node, _, direction) => {
		const vt = viewtransition(direction);
		if (typeof vt?.fn === "function") return vt.fn(node, vt); else return vt;
	};

	setContext(HISTORY, history);
	const locationContext = getContext(LOCATION);
	const routerContext = getContext(ROUTER);
	const routes = writable([]);
	validate_store(routes, 'routes');
	component_subscribe($$self, routes, value => $$invalidate(12, $routes = value));
	const activeRoute = writable(null);
	validate_store(activeRoute, 'activeRoute');
	component_subscribe($$self, activeRoute, value => $$invalidate(2, $activeRoute = value));
	let hasActiveRoute = false; // Used in SSR to synchronously set that a Route is active.

	// If locationContext is not set, this is the topmost Router in the tree.
	// If the `url` prop is given we force the location to it.
	const location = locationContext || writable(url ? { pathname: url } : history.location);

	validate_store(location, 'location');
	component_subscribe($$self, location, value => $$invalidate(1, $location = value));

	// If routerContext is set, the routerBase of the parent Router
	// will be the base for this Router's descendants.
	// If routerContext is not set, the path and resolved uri will both
	// have the value of the basepath prop.
	const base = routerContext
	? routerContext.routerBase
	: writable({ path: basepath, uri: basepath });

	validate_store(base, 'base');
	component_subscribe($$self, base, value => $$invalidate(13, $base = value));

	const routerBase = derived([base, activeRoute], ([base, activeRoute]) => {
		// If there is no activeRoute, the routerBase will be identical to the base.
		if (!activeRoute) return base;

		const { path: basepath } = base;
		const { route, uri } = activeRoute;

		// Remove the potential /* or /*splatname from
		// the end of the child Routes relative paths.
		const path = route.default
		? basepath
		: route.path.replace(/\*.*$/, "");

		return { path, uri };
	});

	const registerRoute = route => {
		const { path: basepath } = $base;
		let { path } = route;

		// We store the original path in the _path property so we can reuse
		// it when the basepath changes. The only thing that matters is that
		// the route reference is intact, so mutation is fine.
		route._path = path;

		route.path = combinePaths(basepath, path);

		if (typeof window === "undefined") {
			// In SSR we should set the activeRoute immediately if it is a match.
			// If there are more Routes being registered after a match is found,
			// we just skip them.
			if (hasActiveRoute) return;

			const matchingRoute = pick([route], $location.pathname);

			if (matchingRoute) {
				activeRoute.set(matchingRoute);
				hasActiveRoute = true;
			}
		} else {
			routes.update(rs => [...rs, route]);
		}
	};

	const unregisterRoute = route => {
		routes.update(rs => rs.filter(r => r !== route));
	};

	let preserveScroll = false;

	if (!locationContext) {
		// The topmost Router in the tree is responsible for updating
		// the location store and supplying it through context.
		onMount(() => {
			const unlisten = history.listen(event => {
				$$invalidate(11, preserveScroll = event.preserveScroll || false);
				location.set(event.location);
			});

			return unlisten;
		});

		setContext(LOCATION, location);
	}

	setContext(ROUTER, {
		activeRoute,
		base,
		routerBase,
		registerRoute,
		unregisterRoute
	});

	const writable_props = ['basepath', 'url', 'viewtransition', 'history'];

	Object_1.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Router> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('basepath' in $$props) $$invalidate(8, basepath = $$props.basepath);
		if ('url' in $$props) $$invalidate(9, url = $$props.url);
		if ('viewtransition' in $$props) $$invalidate(0, viewtransition = $$props.viewtransition);
		if ('history' in $$props) $$invalidate(10, history = $$props.history);
		if ('$$scope' in $$props) $$invalidate(14, $$scope = $$props.$$scope);
	};

	$$self.$capture_state = () => ({
		getContext,
		onMount,
		setContext,
		derived,
		writable,
		HISTORY,
		LOCATION,
		ROUTER,
		globalHistory,
		combinePaths,
		pick,
		basepath,
		url,
		viewtransition,
		history,
		viewtransitionFn,
		locationContext,
		routerContext,
		routes,
		activeRoute,
		hasActiveRoute,
		location,
		base,
		routerBase,
		registerRoute,
		unregisterRoute,
		preserveScroll,
		$location,
		$routes,
		$base,
		$activeRoute
	});

	$$self.$inject_state = $$props => {
		if ('basepath' in $$props) $$invalidate(8, basepath = $$props.basepath);
		if ('url' in $$props) $$invalidate(9, url = $$props.url);
		if ('viewtransition' in $$props) $$invalidate(0, viewtransition = $$props.viewtransition);
		if ('history' in $$props) $$invalidate(10, history = $$props.history);
		if ('hasActiveRoute' in $$props) hasActiveRoute = $$props.hasActiveRoute;
		if ('preserveScroll' in $$props) $$invalidate(11, preserveScroll = $$props.preserveScroll);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*$base*/ 8192) {
			// This reactive statement will update all the Routes' path when
			// the basepath changes.
			{
				const { path: basepath } = $base;
				routes.update(rs => rs.map(r => Object.assign(r, { path: combinePaths(basepath, r._path) })));
			}
		}

		if ($$self.$$.dirty & /*$routes, $location, preserveScroll*/ 6146) {
			// This reactive statement will be run when the Router is created
			// when there are no Routes and then again the following tick, so it
			// will not find an active Route in SSR and in the browser it will only
			// pick an active Route after all Routes have been registered.
			{
				const bestMatch = pick($routes, $location.pathname);
				activeRoute.set(bestMatch ? { ...bestMatch, preserveScroll } : bestMatch);
			}
		}
	};

	return [
		viewtransition,
		$location,
		$activeRoute,
		viewtransitionFn,
		routes,
		activeRoute,
		location,
		base,
		basepath,
		url,
		history,
		preserveScroll,
		$routes,
		$base,
		$$scope,
		slots
	];
}

class Router extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
			basepath: 8,
			url: 9,
			viewtransition: 0,
			history: 10
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Router",
			options,
			id: create_fragment$3.name
		});
	}

	get basepath() {
		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set basepath(value) {
		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get url() {
		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set url(value) {
		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get viewtransition() {
		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set viewtransition(value) {
		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get history() {
		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set history(value) {
		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src/routes/UserEventCard.svelte generated by Svelte v3.59.2 */

const { console: console_1 } = globals;
const file$1 = "src/routes/UserEventCard.svelte";

function create_fragment$2(ctx) {
	let div6;
	let div2;
	let div0;
	let t3;
	let div1;
	let t4_value = /*event*/ ctx[0].start_time + "";
	let t4;
	let t5;
	let t6_value = /*event*/ ctx[0].end_time + "";
	let t6;
	let t7;
	let t8;
	let div3;
	let t9_value = /*event*/ ctx[0].name.toUpperCase() + "";
	let t9;
	let t10;
	let div4;
	let p0;
	let t11_value = /*event*/ ctx[0].career + "";
	let t11;
	let t12;
	let br0;
	let t13;
	let t14_value = /*event*/ ctx[0].location + "";
	let t14;
	let t15;
	let br1;
	let t16;
	let t17_value = /*event*/ ctx[0].exponent + "";
	let t17;
	let t18;
	let div5;
	let p1;
	let span0;
	let t20;
	let t21_value = /*event*/ ctx[0].attendees + "";
	let t21;
	let t22;
	let t23_value = /*event*/ ctx[0].max_attendees + "";
	let t23;
	let t24;
	let button0;
	let t26;
	let div14;
	let div13;
	let div12;
	let div7;
	let h1;
	let t27_value = /*event*/ ctx[0].name + "";
	let t27;
	let t28;
	let button1;
	let t29;
	let div10;
	let div8;
	let span1;
	let t35;
	let span2;
	let t36_value = /*event*/ ctx[0].start_time + "";
	let t36;
	let t37;
	let t38_value = /*event*/ ctx[0].end_time + "";
	let t38;
	let t39;
	let t40;
	let span3;
	let t41_value = /*event*/ ctx[0].location + "";
	let t41;
	let t42;
	let span4;
	let t43_value = /*event*/ ctx[0].attendees + "";
	let t43;
	let t44;
	let t45_value = /*event*/ ctx[0].max_attendees + "";
	let t45;
	let t46;
	let span5;
	let t47_value = /*event*/ ctx[0].career + "";
	let t47;
	let t48;
	let hr;
	let t49;
	let div9;
	let h5;
	let t51;
	let p2;
	let t52_value = /*event*/ ctx[0].exponent + "";
	let t52;
	let t53;
	let div11;
	let button2;
	let t55;
	let button3;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			div6 = element("div");
			div2 = element("div");
			div0 = element("div");

			div0.textContent = `${/*nombreDia*/ ctx[2].toUpperCase()} 
      ${/*numeroDia*/ ctx[3].toUpperCase()}`;

			t3 = space();
			div1 = element("div");
			t4 = text(t4_value);
			t5 = text(" - ");
			t6 = text(t6_value);
			t7 = text(" hrs.");
			t8 = space();
			div3 = element("div");
			t9 = text(t9_value);
			t10 = space();
			div4 = element("div");
			p0 = element("p");
			t11 = text(t11_value);
			t12 = space();
			br0 = element("br");
			t13 = space();
			t14 = text(t14_value);
			t15 = space();
			br1 = element("br");
			t16 = space();
			t17 = text(t17_value);
			t18 = space();
			div5 = element("div");
			p1 = element("p");
			span0 = element("span");
			span0.textContent = "Asistentes:";
			t20 = space();
			t21 = text(t21_value);
			t22 = text(" / ");
			t23 = text(t23_value);
			t24 = space();
			button0 = element("button");
			button0.textContent = "Inscribirse";
			t26 = space();
			div14 = element("div");
			div13 = element("div");
			div12 = element("div");
			div7 = element("div");
			h1 = element("h1");
			t27 = text(t27_value);
			t28 = space();
			button1 = element("button");
			t29 = space();
			div10 = element("div");
			div8 = element("div");
			span1 = element("span");
			span1.textContent = `${/*nombreDia*/ ctx[2]}  ${/*numeroDia*/ ctx[3]} de ${/*nombreMes*/ ctx[4]}`;
			t35 = space();
			span2 = element("span");
			t36 = text(t36_value);
			t37 = text(" - ");
			t38 = text(t38_value);
			t39 = text(" hrs.");
			t40 = space();
			span3 = element("span");
			t41 = text(t41_value);
			t42 = space();
			span4 = element("span");
			t43 = text(t43_value);
			t44 = text(" / ");
			t45 = text(t45_value);
			t46 = space();
			span5 = element("span");
			t47 = text(t47_value);
			t48 = space();
			hr = element("hr");
			t49 = space();
			div9 = element("div");
			h5 = element("h5");
			h5.textContent = "Exponente:";
			t51 = space();
			p2 = element("p");
			t52 = text(t52_value);
			t53 = space();
			div11 = element("div");
			button2 = element("button");
			button2.textContent = "Cerrar";
			t55 = space();
			button3 = element("button");
			button3.textContent = "Inscribirse";
			attr_dev(div0, "class", "info-box svelte-ul19px");
			add_location(div0, file$1, 65, 4, 1721);
			attr_dev(div1, "class", "info-box svelte-ul19px");
			add_location(div1, file$1, 70, 4, 1824);
			attr_dev(div2, "class", "d-flex justify-content-between");
			add_location(div2, file$1, 64, 2, 1672);
			attr_dev(div3, "class", "event-name svelte-ul19px");
			add_location(div3, file$1, 76, 2, 1945);
			add_location(br0, file$1, 81, 21, 2103);
			add_location(br1, file$1, 82, 23, 2133);
			attr_dev(p0, "class", "event-info svelte-ul19px");
			add_location(p0, file$1, 80, 4, 2059);
			attr_dev(div4, "class", "d-flex justify-content-start");
			add_location(div4, file$1, 79, 2, 2012);
			set_style(span0, "font-weight", "300");
			add_location(span0, file$1, 88, 6, 2302);
			attr_dev(p1, "class", "event-info svelte-ul19px");
			set_style(p1, "font-weight", "700");
			set_style(p1, "margin-top", "8px");
			add_location(p1, file$1, 87, 4, 2232);
			attr_dev(button0, "class", "btn btn-light");
			add_location(button0, file$1, 92, 4, 2417);
			attr_dev(div5, "class", "d-flex justify-content-between");
			add_location(div5, file$1, 86, 2, 2183);
			attr_dev(div6, "class", "main-card-container svelte-ul19px");
			set_style(div6, "background-color", /*color*/ ctx[1]);
			add_location(div6, file$1, 62, 0, 1576);
			attr_dev(h1, "class", "modal-title fs-5");
			attr_dev(h1, "id", "detail-modalLabel");
			add_location(h1, file$1, 125, 8, 3077);
			attr_dev(button1, "type", "button");
			attr_dev(button1, "class", "btn-close");
			attr_dev(button1, "data-bs-dismiss", "modal");
			attr_dev(button1, "aria-label", "Close");
			add_location(button1, file$1, 126, 8, 3155);
			attr_dev(div7, "class", "modal-header");
			add_location(div7, file$1, 124, 6, 3042);
			attr_dev(span1, "class", "badge bg-primary svelte-ul19px");
			add_location(span1, file$1, 136, 10, 3414);
			attr_dev(span2, "class", "badge bg-success svelte-ul19px");
			add_location(span2, file$1, 139, 10, 3525);
			attr_dev(span3, "class", "badge bg-secondary svelte-ul19px");
			add_location(span3, file$1, 142, 10, 3640);
			attr_dev(span4, "class", "badge bg-info svelte-ul19px");
			add_location(span4, file$1, 144, 10, 3708);
			attr_dev(span5, "class", "badge bg-warning svelte-ul19px");
			add_location(span5, file$1, 145, 10, 3795);
			attr_dev(div8, "class", "");
			add_location(div8, file$1, 135, 8, 3389);
			add_location(hr, file$1, 148, 8, 3872);
			add_location(h5, file$1, 151, 12, 3904);
			add_location(p2, file$1, 152, 12, 3936);
			add_location(div9, file$1, 150, 8, 3886);
			attr_dev(div10, "class", "modal-body");
			add_location(div10, file$1, 133, 6, 3316);
			attr_dev(button2, "type", "button");
			attr_dev(button2, "class", "btn btn-secondary");
			attr_dev(button2, "data-bs-dismiss", "modal");
			add_location(button2, file$1, 156, 8, 4029);
			attr_dev(button3, "type", "button");
			attr_dev(button3, "class", "btn btn-primary");
			add_location(button3, file$1, 159, 8, 4145);
			attr_dev(div11, "class", "modal-footer");
			add_location(div11, file$1, 155, 6, 3994);
			attr_dev(div12, "class", "modal-content");
			add_location(div12, file$1, 123, 4, 3008);
			attr_dev(div13, "class", "modal-dialog");
			add_location(div13, file$1, 122, 2, 2977);
			attr_dev(div14, "class", "modal fade modal-dialog-scrollable");
			attr_dev(div14, "id", "detail-modal");
			attr_dev(div14, "tabindex", "-1");
			attr_dev(div14, "aria-labelledby", "detail-modalLabel");
			attr_dev(div14, "aria-hidden", "true");
			add_location(div14, file$1, 115, 0, 2828);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div6, anchor);
			append_dev(div6, div2);
			append_dev(div2, div0);
			append_dev(div2, t3);
			append_dev(div2, div1);
			append_dev(div1, t4);
			append_dev(div1, t5);
			append_dev(div1, t6);
			append_dev(div1, t7);
			append_dev(div6, t8);
			append_dev(div6, div3);
			append_dev(div3, t9);
			append_dev(div6, t10);
			append_dev(div6, div4);
			append_dev(div4, p0);
			append_dev(p0, t11);
			append_dev(p0, t12);
			append_dev(p0, br0);
			append_dev(p0, t13);
			append_dev(p0, t14);
			append_dev(p0, t15);
			append_dev(p0, br1);
			append_dev(p0, t16);
			append_dev(p0, t17);
			append_dev(div6, t18);
			append_dev(div6, div5);
			append_dev(div5, p1);
			append_dev(p1, span0);
			append_dev(p1, t20);
			append_dev(p1, t21);
			append_dev(p1, t22);
			append_dev(p1, t23);
			append_dev(div5, t24);
			append_dev(div5, button0);
			insert_dev(target, t26, anchor);
			insert_dev(target, div14, anchor);
			append_dev(div14, div13);
			append_dev(div13, div12);
			append_dev(div12, div7);
			append_dev(div7, h1);
			append_dev(h1, t27);
			append_dev(div7, t28);
			append_dev(div7, button1);
			append_dev(div12, t29);
			append_dev(div12, div10);
			append_dev(div10, div8);
			append_dev(div8, span1);
			append_dev(div8, t35);
			append_dev(div8, span2);
			append_dev(span2, t36);
			append_dev(span2, t37);
			append_dev(span2, t38);
			append_dev(span2, t39);
			append_dev(div8, t40);
			append_dev(div8, span3);
			append_dev(span3, t41);
			append_dev(div8, t42);
			append_dev(div8, span4);
			append_dev(span4, t43);
			append_dev(span4, t44);
			append_dev(span4, t45);
			append_dev(div8, t46);
			append_dev(div8, span5);
			append_dev(span5, t47);
			append_dev(div10, t48);
			append_dev(div10, hr);
			append_dev(div10, t49);
			append_dev(div10, div9);
			append_dev(div9, h5);
			append_dev(div9, t51);
			append_dev(div9, p2);
			append_dev(p2, t52);
			append_dev(div12, t53);
			append_dev(div12, div11);
			append_dev(div11, button2);
			append_dev(div11, t55);
			append_dev(div11, button3);

			if (!mounted) {
				dispose = listen_dev(button0, "click", /*click_handler*/ ctx[6], false, false, false, false);
				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*event*/ 1 && t4_value !== (t4_value = /*event*/ ctx[0].start_time + "")) set_data_dev(t4, t4_value);
			if (dirty & /*event*/ 1 && t6_value !== (t6_value = /*event*/ ctx[0].end_time + "")) set_data_dev(t6, t6_value);
			if (dirty & /*event*/ 1 && t9_value !== (t9_value = /*event*/ ctx[0].name.toUpperCase() + "")) set_data_dev(t9, t9_value);
			if (dirty & /*event*/ 1 && t11_value !== (t11_value = /*event*/ ctx[0].career + "")) set_data_dev(t11, t11_value);
			if (dirty & /*event*/ 1 && t14_value !== (t14_value = /*event*/ ctx[0].location + "")) set_data_dev(t14, t14_value);
			if (dirty & /*event*/ 1 && t17_value !== (t17_value = /*event*/ ctx[0].exponent + "")) set_data_dev(t17, t17_value);
			if (dirty & /*event*/ 1 && t21_value !== (t21_value = /*event*/ ctx[0].attendees + "")) set_data_dev(t21, t21_value);
			if (dirty & /*event*/ 1 && t23_value !== (t23_value = /*event*/ ctx[0].max_attendees + "")) set_data_dev(t23, t23_value);

			if (dirty & /*color*/ 2) {
				set_style(div6, "background-color", /*color*/ ctx[1]);
			}

			if (dirty & /*event*/ 1 && t27_value !== (t27_value = /*event*/ ctx[0].name + "")) set_data_dev(t27, t27_value);
			if (dirty & /*event*/ 1 && t36_value !== (t36_value = /*event*/ ctx[0].start_time + "")) set_data_dev(t36, t36_value);
			if (dirty & /*event*/ 1 && t38_value !== (t38_value = /*event*/ ctx[0].end_time + "")) set_data_dev(t38, t38_value);
			if (dirty & /*event*/ 1 && t41_value !== (t41_value = /*event*/ ctx[0].location + "")) set_data_dev(t41, t41_value);
			if (dirty & /*event*/ 1 && t43_value !== (t43_value = /*event*/ ctx[0].attendees + "")) set_data_dev(t43, t43_value);
			if (dirty & /*event*/ 1 && t45_value !== (t45_value = /*event*/ ctx[0].max_attendees + "")) set_data_dev(t45, t45_value);
			if (dirty & /*event*/ 1 && t47_value !== (t47_value = /*event*/ ctx[0].career + "")) set_data_dev(t47, t47_value);
			if (dirty & /*event*/ 1 && t52_value !== (t52_value = /*event*/ ctx[0].exponent + "")) set_data_dev(t52, t52_value);
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div6);
			if (detaching) detach_dev(t26);
			if (detaching) detach_dev(div14);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$2.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function openDetailModal() {
	console.log("Opening modal");
	var detailModal = new bootstrap.Modal(document.getElementById("detail-modal"), { keyboard: false });
	detailModal.show();
}

function incribirEvento() {
	console.log("Inscribiendo");
}

function instance$2($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('UserEventCard', slots, []);

	let { event = {
		id: 1,
		name: "Evento de prueba 1",
		date: "2021-10-10",
		start_time: "10:00",
		end_time: "12:00",
		location: "Facultad de Ciencias",
		description: "loremp ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus feugiat, molestie ipsum id, tincidunt nunc. Nulla facilisi. Nulla nec purus feugiat, molestie ipsum id, tincidunt nunc. Nulla facilisi.",
		attendees: 0,
		max_attendees: 100,
		career: "Ingeniería en Computación",
		exponent: "Dr. Exponente 1",
		status: "Activo",
		img: "https://propiedadintelectual.unam.mx/assets/img/unamblanco.png"
	} } = $$props;

	let { color = "#85c1e9" } = $$props;
	let { userId = 1 } = $$props;
	const nombreDia = new Date(event.date).toLocaleDateString("es-ES", { weekday: "long" });
	const numeroDia = new Date(event.date).toLocaleDateString("es-ES", { day: "numeric" });
	const nombreMes = new Date(event.date).toLocaleDateString("es-ES", { month: "long" });

	onMount(() => {
		
	}); //cardClickListener();

	const writable_props = ['event', 'color', 'userId'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<UserEventCard> was created with unknown prop '${key}'`);
	});

	const click_handler = () => {
		incribirEvento();
	};

	$$self.$$set = $$props => {
		if ('event' in $$props) $$invalidate(0, event = $$props.event);
		if ('color' in $$props) $$invalidate(1, color = $$props.color);
		if ('userId' in $$props) $$invalidate(5, userId = $$props.userId);
	};

	$$self.$capture_state = () => ({
		onMount,
		event,
		color,
		userId,
		nombreDia,
		numeroDia,
		nombreMes,
		openDetailModal,
		incribirEvento
	});

	$$self.$inject_state = $$props => {
		if ('event' in $$props) $$invalidate(0, event = $$props.event);
		if ('color' in $$props) $$invalidate(1, color = $$props.color);
		if ('userId' in $$props) $$invalidate(5, userId = $$props.userId);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [event, color, nombreDia, numeroDia, nombreMes, userId, click_handler];
}

class UserEventCard extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$2, create_fragment$2, safe_not_equal, { event: 0, color: 1, userId: 5 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "UserEventCard",
			options,
			id: create_fragment$2.name
		});
	}

	get event() {
		throw new Error("<UserEventCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set event(value) {
		throw new Error("<UserEventCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get color() {
		throw new Error("<UserEventCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set color(value) {
		throw new Error("<UserEventCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get userId() {
		throw new Error("<UserEventCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set userId(value) {
		throw new Error("<UserEventCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src/routes/UserEvents.svelte generated by Svelte v3.59.2 */
const file = "src/routes/UserEvents.svelte";

function create_fragment$1(ctx) {
	let div;
	let usereventcard0;
	let t0;
	let usereventcard1;
	let t1;
	let usereventcard2;
	let t2;
	let usereventcard3;
	let t3;
	let usereventcard4;
	let current;
	usereventcard0 = new UserEventCard({ $$inline: true });
	usereventcard1 = new UserEventCard({ $$inline: true });
	usereventcard2 = new UserEventCard({ $$inline: true });
	usereventcard3 = new UserEventCard({ $$inline: true });
	usereventcard4 = new UserEventCard({ $$inline: true });

	const block = {
		c: function create() {
			div = element("div");
			create_component(usereventcard0.$$.fragment);
			t0 = space();
			create_component(usereventcard1.$$.fragment);
			t1 = space();
			create_component(usereventcard2.$$.fragment);
			t2 = space();
			create_component(usereventcard3.$$.fragment);
			t3 = space();
			create_component(usereventcard4.$$.fragment);
			attr_dev(div, "id", "main-container");
			attr_dev(div, "class", "svelte-d9z3b");
			add_location(div, file, 5, 0, 75);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			mount_component(usereventcard0, div, null);
			append_dev(div, t0);
			mount_component(usereventcard1, div, null);
			append_dev(div, t1);
			mount_component(usereventcard2, div, null);
			append_dev(div, t2);
			mount_component(usereventcard3, div, null);
			append_dev(div, t3);
			mount_component(usereventcard4, div, null);
			current = true;
		},
		p: noop,
		i: function intro(local) {
			if (current) return;
			transition_in(usereventcard0.$$.fragment, local);
			transition_in(usereventcard1.$$.fragment, local);
			transition_in(usereventcard2.$$.fragment, local);
			transition_in(usereventcard3.$$.fragment, local);
			transition_in(usereventcard4.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(usereventcard0.$$.fragment, local);
			transition_out(usereventcard1.$$.fragment, local);
			transition_out(usereventcard2.$$.fragment, local);
			transition_out(usereventcard3.$$.fragment, local);
			transition_out(usereventcard4.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_component(usereventcard0);
			destroy_component(usereventcard1);
			destroy_component(usereventcard2);
			destroy_component(usereventcard3);
			destroy_component(usereventcard4);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$1.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$1($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('UserEvents', slots, []);
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<UserEvents> was created with unknown prop '${key}'`);
	});

	$$self.$capture_state = () => ({ UserEventCard });
	return [];
}

class UserEvents extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "UserEvents",
			options,
			id: create_fragment$1.name
		});
	}
}

/* src/App.svelte generated by Svelte v3.59.2 */

// (10:0) <Router>
function create_default_slot(ctx) {
	let route0;
	let t0;
	let route1;
	let t1;
	let route2;
	let t2;
	let route3;
	let current;

	route0 = new Route({
			props: { path: "/login", component: LoginPage },
			$$inline: true
		});

	route1 = new Route({
			props: { path: "/scanner", component: Scanner },
			$$inline: true
		});

	route2 = new Route({
			props: { path: "/create", component: EventCreator },
			$$inline: true
		});

	route3 = new Route({
			props: { path: "/events", component: UserEvents },
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(route0.$$.fragment);
			t0 = space();
			create_component(route1.$$.fragment);
			t1 = space();
			create_component(route2.$$.fragment);
			t2 = space();
			create_component(route3.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(route0, target, anchor);
			insert_dev(target, t0, anchor);
			mount_component(route1, target, anchor);
			insert_dev(target, t1, anchor);
			mount_component(route2, target, anchor);
			insert_dev(target, t2, anchor);
			mount_component(route3, target, anchor);
			current = true;
		},
		p: noop,
		i: function intro(local) {
			if (current) return;
			transition_in(route0.$$.fragment, local);
			transition_in(route1.$$.fragment, local);
			transition_in(route2.$$.fragment, local);
			transition_in(route3.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(route0.$$.fragment, local);
			transition_out(route1.$$.fragment, local);
			transition_out(route2.$$.fragment, local);
			transition_out(route3.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(route0, detaching);
			if (detaching) detach_dev(t0);
			destroy_component(route1, detaching);
			if (detaching) detach_dev(t1);
			destroy_component(route2, detaching);
			if (detaching) detach_dev(t2);
			destroy_component(route3, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot.name,
		type: "slot",
		source: "(10:0) <Router>",
		ctx
	});

	return block;
}

function create_fragment(ctx) {
	let router;
	let current;

	router = new Router({
			props: {
				$$slots: { default: [create_default_slot] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(router.$$.fragment);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			mount_component(router, target, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			const router_changes = {};

			if (dirty & /*$$scope*/ 1) {
				router_changes.$$scope = { dirty, ctx };
			}

			router.$set(router_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(router.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(router.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(router, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('App', slots, []);
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
	});

	$$self.$capture_state = () => ({
		EventCreator,
		LoginPage,
		Scanner,
		Router,
		Route,
		Link,
		UserEvents
	});

	return [];
}

class App extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance, create_fragment, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "App",
			options,
			id: create_fragment.name
		});
	}
}

const app = new App({
	target: document.body,
	props: {
		name: 'world'
	}
});

export { app as default };
//# sourceMappingURL=bundle.js.map
