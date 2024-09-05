
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
function prop_dev(node, property, value) {
    node[property] = value;
    dispatch_dev('SvelteDOMSetProperty', { node, property, value });
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
function create_if_block_2$1(ctx) {
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
		id: create_if_block_2$1.name,
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
function create_if_block$7(ctx) {
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
		id: create_if_block$7.name,
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
	const if_block_creators = [create_if_block_4, create_else_block$7];
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
function create_else_block$7(ctx) {
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
		id: create_else_block$7.name,
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
	const if_block_creators = [create_if_block$7, create_if_block_1$2, create_if_block_2$1];
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
function create_else_block$6(ctx) {
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
		id: create_else_block$6.name,
		type: "else",
		source: "(7:1) {:else}",
		ctx
	});

	return block;
}

// (5:1) {#if typeof toast.message === 'string'}
function create_if_block$6(ctx) {
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
		id: create_if_block$6.name,
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
	const if_block_creators = [create_if_block$6, create_else_block$6];
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
function create_else_block$5(ctx) {
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
		id: create_else_block$5.name,
		type: "else",
		source: "(28:1) {:else}",
		ctx
	});

	return block;
}

// (23:1) {#if Component}
function create_if_block$5(ctx) {
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
		id: create_if_block$5.name,
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
	const if_block_creators = [create_if_block$5, create_else_block$5];
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
function create_else_block$4(ctx) {
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
		id: create_else_block$4.name,
		type: "else",
		source: "(34:1) {:else}",
		ctx
	});

	return block;
}

// (32:1) {#if toast.type === 'custom'}
function create_if_block$4(ctx) {
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
		id: create_if_block$4.name,
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
	const if_block_creators = [create_if_block$4, create_else_block$4];
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

function get_each_context$3(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[11] = list[i];
	return child_ctx;
}

// (30:1) {#each _toasts as toast (toast.id)}
function create_each_block$3(key_1, ctx) {
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
		id: create_each_block$3.name,
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
	validate_each_keys(ctx, each_value, get_each_context$3, get_key);

	for (let i = 0; i < each_value.length; i += 1) {
		let child_ctx = get_each_context$3(ctx, each_value, i);
		let key = get_key(child_ctx);
		each_1_lookup.set(key, each_blocks[i] = create_each_block$3(key, child_ctx));
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
				validate_each_keys(ctx, each_value, get_each_context$3, get_key);
				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div, outro_and_destroy_block, create_each_block$3, null, get_each_context$3);
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

const API_URL = `${window.location.origin}`;
var userModalData = writable({
    event: {
        id: "-1",
        name: "",
        date: "",
        time: "",
        location: "",
        description: "",
    },
    qrCode: "UwU",
});

/*xport var availableCareers = writable([
    "División de las Ciencias Físico-Matemáticas y de las Ingenierías",
    "Ingeniería Civil",
    "Ingeniería en Computación",
    "Ingeniería Eléctrica-Electrónica",
    "Ingeniería Industrial",
    "Ingeniería Mecánica",
]);*/

var availableCareers = writable([
    {
        name: "División de las Ciencias Físico-Matemáticas y de las Ingenierías",
        color: "#3f51b5",
        img_bg: "DIV-Blanco.svg"
    },
    {
        name: "Ingeniería Civil",
        color: "#e91e63",
        img_bg: "ICI-Blanco.svg"
    },
    {
        name: "Ingeniería en Computación",
        color: "#f44336",
        img_bg: "ICO-Blanco.svg"
    },
    {
        name: "Ingeniería Eléctrica-Electrónica",
        color: "#03a9f4",
        img_bg: "IEE-Blanco.svg"
    },
    {
        name: "Ingeniería Industrial",
        color: "#9c27b0",
        img_bg: "IID-Blanco.svg"
    },
    {
        name: "Ingeniería Mecánica",
        color: "#009688",
        img_bg: "IMC-Blanco.svg"
    },
]);

function openDetailModal() {



  var detailModal = new bootstrap.Modal(
    document.getElementById("detail-modal"),
    {
      keyboard: false,
    }
  );
  detailModal.show();
}

/* src/routes/EventCreator.svelte generated by Svelte v3.59.2 */

const { Error: Error_1$1, Object: Object_1$1, console: console_1$3 } = globals;
const file$6 = "src/routes/EventCreator.svelte";

function get_each_context$2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[27] = list[i];
	child_ctx[29] = i;
	return child_ctx;
}

function get_each_context_1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[30] = list[i];
	return child_ctx;
}

// (489:10) {:else}
function create_else_block_1(ctx) {
	let span;

	const block = {
		c: function create() {
			span = element("span");
			span.textContent = "Inactivo";
			attr_dev(span, "class", "badge rounded-pill bg-danger");
			add_location(span, file$6, 489, 10, 13462);
		},
		m: function mount(target, anchor) {
			insert_dev(target, span, anchor);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(span);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block_1.name,
		type: "else",
		source: "(489:10) {:else}",
		ctx
	});

	return block;
}

// (487:10) {#if event.status ==="Activo"}
function create_if_block_2(ctx) {
	let span;

	const block = {
		c: function create() {
			span = element("span");
			span.textContent = "Activo";
			attr_dev(span, "class", "badge rounded-pill bg-success");
			add_location(span, file$6, 487, 10, 13376);
		},
		m: function mount(target, anchor) {
			insert_dev(target, span, anchor);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(span);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_2.name,
		type: "if",
		source: "(487:10) {#if event.status ===\\\"Activo\\\"}",
		ctx
	});

	return block;
}

// (455:4) {#each events as event}
function create_each_block_1(ctx) {
	let div2;
	let div1;
	let div0;
	let img;
	let img_src_value;
	let t0;
	let h5;
	let t1_value = /*event*/ ctx[30].name + "";
	let t1;
	let t2;
	let h60;
	let t3;
	let t4_value = /*event*/ ctx[30].date + "";
	let t4;
	let t5;
	let h61;
	let t6;
	let t7_value = /*event*/ ctx[30].location + "";
	let t7;
	let t8;
	let h62;
	let t9;
	let t10_value = (/*event*/ ctx[30].attendees || 0) + "";
	let t10;
	let t11;
	let t12_value = /*event*/ ctx[30].max_attendees + "";
	let t12;
	let t13;
	let t14;
	let mounted;
	let dispose;

	function func_3(...args) {
		return /*func_3*/ ctx[10](/*event*/ ctx[30], ...args);
	}

	function func_4(...args) {
		return /*func_4*/ ctx[11](/*event*/ ctx[30], ...args);
	}

	function select_block_type(ctx, dirty) {
		if (/*event*/ ctx[30].status === "Activo") return create_if_block_2;
		return create_else_block_1;
	}

	let current_block_type = select_block_type(ctx);
	let if_block = current_block_type(ctx);

	function click_handler_2() {
		return /*click_handler_2*/ ctx[12](/*event*/ ctx[30]);
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
			if_block.c();
			t14 = space();
			if (!src_url_equal(img.src, img_src_value = API_URL + "/img/" + /*$availableCareers*/ ctx[2].find(func_3).img_bg)) attr_dev(img, "src", img_src_value);
			attr_dev(img, "class", "img-thumbnail limg-fluid p-4");
			attr_dev(img, "alt", "...");
			set_style(img, "background-color", /*$availableCareers*/ ctx[2].find(func_4).color);
			add_location(img, file$6, 464, 12, 12503);
			attr_dev(div0, "class", "d-flex justify-content-center p-2");
			add_location(div0, file$6, 463, 10, 12443);
			attr_dev(h5, "class", "card-title text-center");
			add_location(h5, file$6, 475, 10, 12891);
			attr_dev(h60, "class", "card-subtitle mb-2 text-muted text-center");
			add_location(h60, file$6, 476, 10, 12954);
			attr_dev(h61, "class", "card-subtitle mb-2 text-muted text-center");
			add_location(h61, file$6, 479, 10, 13067);
			attr_dev(h62, "class", "card-subtitle mb-2 text-muted text-center");
			add_location(h62, file$6, 482, 10, 13184);
			attr_dev(div1, "class", "card p-3");
			set_style(div1, "height", "100%");
			add_location(div1, file$6, 462, 8, 12388);
			attr_dev(div2, "class", "col-12 col-md-6 col-lg-4 col-xl-3 event-card mb-4 svelte-yjlyqq");
			add_location(div2, file$6, 456, 6, 12231);
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
			append_dev(div1, t13);
			if_block.m(div1, null);
			append_dev(div2, t14);

			if (!mounted) {
				dispose = listen_dev(div2, "click", click_handler_2, false, false, false, false);
				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty[0] & /*$availableCareers, events*/ 5 && !src_url_equal(img.src, img_src_value = API_URL + "/img/" + /*$availableCareers*/ ctx[2].find(func_3).img_bg)) {
				attr_dev(img, "src", img_src_value);
			}

			if (dirty[0] & /*$availableCareers, events*/ 5) {
				set_style(img, "background-color", /*$availableCareers*/ ctx[2].find(func_4).color);
			}

			if (dirty[0] & /*events*/ 1 && t1_value !== (t1_value = /*event*/ ctx[30].name + "")) set_data_dev(t1, t1_value);
			if (dirty[0] & /*events*/ 1 && t4_value !== (t4_value = /*event*/ ctx[30].date + "")) set_data_dev(t4, t4_value);
			if (dirty[0] & /*events*/ 1 && t7_value !== (t7_value = /*event*/ ctx[30].location + "")) set_data_dev(t7, t7_value);
			if (dirty[0] & /*events*/ 1 && t10_value !== (t10_value = (/*event*/ ctx[30].attendees || 0) + "")) set_data_dev(t10, t10_value);
			if (dirty[0] & /*events*/ 1 && t12_value !== (t12_value = /*event*/ ctx[30].max_attendees + "")) set_data_dev(t12, t12_value);

			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
				if_block.d(1);
				if_block = current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(div1, null);
				}
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div2);
			if_block.d();
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_1.name,
		type: "each",
		source: "(455:4) {#each events as event}",
		ctx
	});

	return block;
}

// (663:16) {:else}
function create_else_block$3(ctx) {
	let option;
	let t_value = /*career*/ ctx[27].name + "";
	let t;
	let option_value_value;

	const block = {
		c: function create() {
			option = element("option");
			t = text(t_value);
			option.__value = option_value_value = /*career*/ ctx[27].name;
			option.value = option.__value;
			add_location(option, file$6, 663, 18, 18921);
		},
		m: function mount(target, anchor) {
			insert_dev(target, option, anchor);
			append_dev(option, t);
		},
		p: function update(ctx, dirty) {
			if (dirty[0] & /*$availableCareers*/ 4 && t_value !== (t_value = /*career*/ ctx[27].name + "")) set_data_dev(t, t_value);

			if (dirty[0] & /*$availableCareers*/ 4 && option_value_value !== (option_value_value = /*career*/ ctx[27].name)) {
				prop_dev(option, "__value", option_value_value);
				option.value = option.__value;
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(option);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block$3.name,
		type: "else",
		source: "(663:16) {:else}",
		ctx
	});

	return block;
}

// (661:16) {#if index == 0}
function create_if_block_1$1(ctx) {
	let option;
	let t_value = /*career*/ ctx[27].name + "";
	let t;
	let option_value_value;

	const block = {
		c: function create() {
			option = element("option");
			t = text(t_value);
			option.selected = true;
			option.__value = option_value_value = /*career*/ ctx[27].name;
			option.value = option.__value;
			add_location(option, file$6, 661, 18, 18839);
		},
		m: function mount(target, anchor) {
			insert_dev(target, option, anchor);
			append_dev(option, t);
		},
		p: function update(ctx, dirty) {
			if (dirty[0] & /*$availableCareers*/ 4 && t_value !== (t_value = /*career*/ ctx[27].name + "")) set_data_dev(t, t_value);

			if (dirty[0] & /*$availableCareers*/ 4 && option_value_value !== (option_value_value = /*career*/ ctx[27].name)) {
				prop_dev(option, "__value", option_value_value);
				option.value = option.__value;
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(option);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$1.name,
		type: "if",
		source: "(661:16) {#if index == 0}",
		ctx
	});

	return block;
}

// (660:14) {#each $availableCareers as career, index}
function create_each_block$2(ctx) {
	let if_block_anchor;

	function select_block_type_1(ctx, dirty) {
		if (/*index*/ ctx[29] == 0) return create_if_block_1$1;
		return create_else_block$3;
	}

	let current_block_type = select_block_type_1(ctx);
	let if_block = current_block_type(ctx);

	const block = {
		c: function create() {
			if_block.c();
			if_block_anchor = empty();
		},
		m: function mount(target, anchor) {
			if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
		},
		p: function update(ctx, dirty) {
			if_block.p(ctx, dirty);
		},
		d: function destroy(detaching) {
			if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$2.name,
		type: "each",
		source: "(660:14) {#each $availableCareers as career, index}",
		ctx
	});

	return block;
}

// (703:10) {#if selectedEvent.id}
function create_if_block$3(ctx) {
	let button;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			button = element("button");
			button.textContent = "Eliminar";
			attr_dev(button, "type", "button");
			attr_dev(button, "class", "btn btn-danger");
			add_location(button, file$6, 703, 12, 20172);
		},
		m: function mount(target, anchor) {
			insert_dev(target, button, anchor);

			if (!mounted) {
				dispose = listen_dev(button, "click", /*click_handler_3*/ ctx[22], false, false, false, false);
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
		id: create_if_block$3.name,
		type: "if",
		source: "(703:10) {#if selectedEvent.id}",
		ctx
	});

	return block;
}

function create_fragment$8(ctx) {
	let nav;
	let div1;
	let a;
	let img;
	let img_src_value;
	let t0;
	let t1;
	let div0;
	let button0;
	let i0;
	let t2;
	let t3;
	let input0;
	let t4;
	let button1;
	let i1;
	let t5;
	let t6;
	let br0;
	let t7;
	let br1;
	let t8;
	let br2;
	let t9;
	let br3;
	let t10;
	let div21;
	let div14;
	let div4;
	let div3;
	let i2;
	let t11;
	let div2;
	let h50;
	let t13;
	let h60;
	let t14;
	let t15_value = /*events*/ ctx[0].length + "";
	let t15;
	let t16;
	let div7;
	let div6;
	let i3;
	let t17;
	let div5;
	let h51;
	let t19;
	let h61;
	let t20;
	let t21_value = /*events*/ ctx[0].reduce(func, 0) + "";
	let t21;
	let t22;
	let div10;
	let div9;
	let i4;
	let t23;
	let div8;
	let h52;
	let t25;
	let h62;
	let t26;
	let t27_value = /*events*/ ctx[0].reduce(func_1, 0) + "";
	let t27;
	let t28;
	let div13;
	let div12;
	let i5;
	let t29;
	let div11;
	let h53;
	let t31;
	let h63;
	let t32;
	let t33_value = " " + "";
	let t33;
	let t34;
	let t35_value = /*events*/ ctx[0].reduce(/*func_2*/ ctx[8], 0) + "";
	let t35;
	let t36;
	let div15;
	let hr;
	let t37;
	let br4;
	let t38;
	let div20;
	let div19;
	let div18;
	let div17;
	let div16;
	let i6;
	let t39;
	let h54;
	let t41;
	let t42;
	let div38;
	let div37;
	let div36;
	let div22;
	let h55;
	let t44;
	let button2;
	let t45;
	let div33;
	let div32;
	let div23;
	let span0;
	let i7;
	let t46;
	let input1;
	let t47;
	let div24;
	let span1;
	let i8;
	let t48;
	let input2;
	let t49;
	let div25;
	let span2;
	let i9;
	let t50;
	let input3;
	let t51;
	let div26;
	let span3;
	let i10;
	let t52;
	let input4;
	let t53;
	let div27;
	let span4;
	let i11;
	let t54;
	let input5;
	let t55;
	let div28;
	let span5;
	let i12;
	let t56;
	let input6;
	let t57;
	let div29;
	let span6;
	let i13;
	let t58;
	let select0;
	let t59;
	let div30;
	let span7;
	let i14;
	let t60;
	let input7;
	let t61;
	let div31;
	let span8;
	let i15;
	let t62;
	let select1;
	let option0;
	let option1;
	let t65;
	let div35;
	let div34;
	let t66;
	let button3;
	let mounted;
	let dispose;
	let each_value_1 = /*events*/ ctx[0];
	validate_each_argument(each_value_1);
	let each_blocks_1 = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
	}

	let each_value = /*$availableCareers*/ ctx[2];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
	}

	let if_block = /*selectedEvent*/ ctx[1].id && create_if_block$3(ctx);

	const block = {
		c: function create() {
			nav = element("nav");
			div1 = element("div");
			a = element("a");
			img = element("img");
			t0 = text("\n      Administrador de Eventos");
			t1 = space();
			div0 = element("div");
			button0 = element("button");
			i0 = element("i");
			t2 = text("\n        Subir CSV");
			t3 = space();
			input0 = element("input");
			t4 = space();
			button1 = element("button");
			i1 = element("i");
			t5 = text("\n        Descargar CSV");
			t6 = space();
			br0 = element("br");
			t7 = space();
			br1 = element("br");
			t8 = space();
			br2 = element("br");
			t9 = space();
			br3 = element("br");
			t10 = space();
			div21 = element("div");
			div14 = element("div");
			div4 = element("div");
			div3 = element("div");
			i2 = element("i");
			t11 = space();
			div2 = element("div");
			h50 = element("h5");
			h50.textContent = "Eventos";
			t13 = space();
			h60 = element("h6");
			t14 = text("Total: ");
			t15 = text(t15_value);
			t16 = space();
			div7 = element("div");
			div6 = element("div");
			i3 = element("i");
			t17 = space();
			div5 = element("div");
			h51 = element("h5");
			h51.textContent = "Asistentes";
			t19 = space();
			h61 = element("h6");
			t20 = text("Total: ");
			t21 = text(t21_value);
			t22 = space();
			div10 = element("div");
			div9 = element("div");
			i4 = element("i");
			t23 = space();
			div8 = element("div");
			h52 = element("h5");
			h52.textContent = "Carreras";
			t25 = space();
			h62 = element("h6");
			t26 = text("Total: ");
			t27 = text(t27_value);
			t28 = space();
			div13 = element("div");
			div12 = element("div");
			i5 = element("i");
			t29 = space();
			div11 = element("div");
			h53 = element("h5");
			h53.textContent = "Horas disponibles";
			t31 = space();
			h63 = element("h6");
			t32 = text("Total:");
			t33 = text(t33_value);
			t34 = space();
			t35 = text(t35_value);
			t36 = space();
			div15 = element("div");
			hr = element("hr");
			t37 = space();
			br4 = element("br");
			t38 = space();
			div20 = element("div");
			div19 = element("div");
			div18 = element("div");
			div17 = element("div");
			div16 = element("div");
			i6 = element("i");
			t39 = space();
			h54 = element("h5");
			h54.textContent = "Agregar Evento";
			t41 = space();

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].c();
			}

			t42 = space();
			div38 = element("div");
			div37 = element("div");
			div36 = element("div");
			div22 = element("div");
			h55 = element("h5");
			h55.textContent = "Evento";
			t44 = space();
			button2 = element("button");
			t45 = space();
			div33 = element("div");
			div32 = element("div");
			div23 = element("div");
			span0 = element("span");
			i7 = element("i");
			t46 = space();
			input1 = element("input");
			t47 = space();
			div24 = element("div");
			span1 = element("span");
			i8 = element("i");
			t48 = space();
			input2 = element("input");
			t49 = space();
			div25 = element("div");
			span2 = element("span");
			i9 = element("i");
			t50 = space();
			input3 = element("input");
			t51 = space();
			div26 = element("div");
			span3 = element("span");
			i10 = element("i");
			t52 = space();
			input4 = element("input");
			t53 = space();
			div27 = element("div");
			span4 = element("span");
			i11 = element("i");
			t54 = space();
			input5 = element("input");
			t55 = space();
			div28 = element("div");
			span5 = element("span");
			i12 = element("i");
			t56 = space();
			input6 = element("input");
			t57 = space();
			div29 = element("div");
			span6 = element("span");
			i13 = element("i");
			t58 = space();
			select0 = element("select");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t59 = space();
			div30 = element("div");
			span7 = element("span");
			i14 = element("i");
			t60 = space();
			input7 = element("input");
			t61 = space();
			div31 = element("div");
			span8 = element("span");
			i15 = element("i");
			t62 = space();
			select1 = element("select");
			option0 = element("option");
			option0.textContent = "Activo";
			option1 = element("option");
			option1.textContent = "Inactivo";
			t65 = space();
			div35 = element("div");
			div34 = element("div");
			if (if_block) if_block.c();
			t66 = space();
			button3 = element("button");
			button3.textContent = "Guardar";
			if (!src_url_equal(img.src, img_src_value = "https://propiedadintelectual.unam.mx/assets/img/unamblanco.png")) attr_dev(img, "src", img_src_value);
			attr_dev(img, "alt", "");
			attr_dev(img, "width", "30");
			attr_dev(img, "height", "30");
			attr_dev(img, "class", "d-inline-block align-text-top me-3");
			add_location(img, file$6, 292, 6, 8050);
			attr_dev(a, "class", "navbar-brand");
			attr_dev(a, "href", "#");
			add_location(a, file$6, 291, 4, 8010);
			attr_dev(i0, "class", "bi bi-arrow-up-circle");
			add_location(i0, file$6, 304, 8, 8360);
			attr_dev(button0, "class", "btn btn-success");
			attr_dev(button0, "id", "upload-btn");
			add_location(button0, file$6, 303, 6, 8303);
			attr_dev(input0, "type", "file");
			attr_dev(input0, "id", "upload-file");
			set_style(input0, "display", "none");
			attr_dev(input0, "accept", ".csv");
			add_location(input0, file$6, 307, 6, 8438);
			attr_dev(i1, "class", "bi bi-arrow-down-circle");
			add_location(i1, file$6, 321, 8, 8712);
			attr_dev(button1, "class", "btn btn-primary");
			add_location(button1, file$6, 315, 6, 8586);
			add_location(div0, file$6, 302, 4, 8291);
			attr_dev(div1, "class", "container-fluid");
			add_location(div1, file$6, 290, 2, 7976);
			attr_dev(nav, "class", "navbar navbar-dark bg-dark elevated fixed-top svelte-yjlyqq");
			add_location(nav, file$6, 289, 0, 7914);
			add_location(br0, file$6, 328, 0, 8818);
			add_location(br1, file$6, 329, 0, 8825);
			add_location(br2, file$6, 330, 0, 8832);
			add_location(br3, file$6, 331, 0, 8839);
			attr_dev(i2, "class", "bi bi-calendar2-week text-white ms-3");
			set_style(i2, "font-size", "3rem");
			add_location(i2, file$6, 343, 8, 9142);
			attr_dev(h50, "class", "text-white ");
			add_location(h50, file$6, 346, 10, 9282);
			attr_dev(h60, "class", "text-white ");
			add_location(h60, file$6, 352, 10, 9392);
			attr_dev(div2, "class", "ms-4 mt-auto mb-auto");
			add_location(div2, file$6, 345, 8, 9237);
			attr_dev(div3, "class", "d-flex bg-primary bg-gradient rounded");
			add_location(div3, file$6, 342, 6, 9082);
			attr_dev(div4, "class", "col-3 mb-1 p-2");
			add_location(div4, file$6, 341, 4, 9047);
			attr_dev(i3, "class", "bi bi-person-check text-white ms-3");
			set_style(i3, "font-size", "3rem");
			add_location(i3, file$6, 365, 8, 9668);
			attr_dev(h51, "class", "text-white ");
			add_location(h51, file$6, 368, 10, 9806);
			attr_dev(h61, "class", "text-white ");
			add_location(h61, file$6, 374, 10, 9923);
			attr_dev(div5, "class", "ms-4 mt-auto mb-auto");
			add_location(div5, file$6, 367, 8, 9761);
			attr_dev(div6, "class", "d-flex bg-success bg-gradient rounded");
			add_location(div6, file$6, 364, 6, 9608);
			attr_dev(div7, "class", "col-3 mb-1 p-2");
			add_location(div7, file$6, 363, 4, 9573);
			attr_dev(i4, "class", "bi bi-book text-white ms-3");
			set_style(i4, "font-size", "3rem");
			add_location(i4, file$6, 387, 8, 10235);
			attr_dev(h52, "class", "text-white ");
			add_location(h52, file$6, 393, 10, 10401);
			attr_dev(h62, "class", "text-white ");
			add_location(h62, file$6, 399, 10, 10516);
			attr_dev(div8, "class", "ms-4 mt-auto mb-auto");
			add_location(div8, file$6, 392, 8, 10356);
			attr_dev(div9, "class", "d-flex bg-warning bg-gradient rounded");
			add_location(div9, file$6, 386, 6, 10175);
			attr_dev(div10, "class", "col-3 mb-1 p-2");
			add_location(div10, file$6, 385, 4, 10140);
			attr_dev(i5, "class", "bi bi-clock text-white ms-3");
			set_style(i5, "font-size", "3rem");
			add_location(i5, file$6, 412, 8, 10857);
			attr_dev(h53, "class", "text-white");
			add_location(h53, file$6, 414, 10, 10979);
			attr_dev(h63, "class", "text-white");
			add_location(h63, file$6, 415, 10, 11035);
			attr_dev(div11, "class", "ms-4 mt-auto mb-auto");
			add_location(div11, file$6, 413, 8, 10934);
			attr_dev(div12, "class", "d-flex bg-danger bg-gradient rounded");
			add_location(div12, file$6, 411, 6, 10798);
			attr_dev(div13, "class", "col-3 mb-1 p-2");
			add_location(div13, file$6, 410, 4, 10763);
			attr_dev(div14, "class", "row p-5 pb-2");
			set_style(div14, "margin-bottom", "0px");
			add_location(div14, file$6, 337, 2, 8946);
			add_location(hr, file$6, 431, 4, 11490);
			add_location(br4, file$6, 432, 4, 11501);
			attr_dev(div15, "class", "ps-5 pe-5");
			add_location(div15, file$6, 430, 2, 11462);
			attr_dev(i6, "class", "bi bi-plus-circle text-success");
			set_style(i6, "font-size", "6rem");
			add_location(i6, file$6, 447, 12, 11928);
			attr_dev(div16, "class", "d-flex justify-content-center p-3");
			add_location(div16, file$6, 446, 10, 11868);
			attr_dev(h54, "class", "card-title text-center");
			add_location(h54, file$6, 450, 10, 12040);
			attr_dev(div17, "class", "mt-auto mb-auto");
			add_location(div17, file$6, 445, 8, 11828);
			attr_dev(div18, "class", "card");
			set_style(div18, "height", "100%");
			add_location(div18, file$6, 444, 6, 11779);
			attr_dev(div19, "class", "col-12 col-md-6 col-lg-4 col-xl-3 event-card mb-4 svelte-yjlyqq");
			add_location(div19, file$6, 438, 4, 11639);
			attr_dev(div20, "class", "row p-5 pt-0");
			add_location(div20, file$6, 435, 2, 11520);
			attr_dev(div21, "class", "container card elevated svelte-yjlyqq");
			set_style(div21, "height", "85%");
			set_style(div21, "overflow", "auto");
			set_style(div21, "overflow-x", "hidden");
			add_location(div21, file$6, 333, 0, 8847);
			attr_dev(h55, "class", "modal-title");
			attr_dev(h55, "id", "eventModalLabel");
			add_location(h55, file$6, 511, 8, 13864);
			attr_dev(button2, "type", "button");
			attr_dev(button2, "class", "btn-close");
			attr_dev(button2, "data-bs-dismiss", "modal");
			attr_dev(button2, "aria-label", "Close");
			add_location(button2, file$6, 512, 8, 13929);
			attr_dev(div22, "class", "modal-header");
			add_location(div22, file$6, 510, 6, 13829);
			attr_dev(i7, "class", "bi bi-book");
			add_location(i7, file$6, 547, 15, 14954);
			attr_dev(span0, "class", "input-group-text");
			attr_dev(span0, "id", "basic-addon1");
			add_location(span0, file$6, 546, 12, 14890);
			attr_dev(input1, "type", "text");
			attr_dev(input1, "class", "form-control svelte-yjlyqq");
			attr_dev(input1, "placeholder", "Nombre del evento");
			attr_dev(input1, "aria-label", "eventName");
			attr_dev(input1, "aria-describedby", "basic-addon1");
			add_location(input1, file$6, 549, 12, 15013);
			attr_dev(div23, "class", "input-group mb-3 col-12 svelte-yjlyqq");
			add_location(div23, file$6, 545, 10, 14840);
			attr_dev(i8, "class", "bi bi-calendar3");
			add_location(i8, file$6, 562, 15, 15447);
			attr_dev(span1, "class", "input-group-text");
			attr_dev(span1, "id", "basic-addon1");
			add_location(span1, file$6, 561, 12, 15383);
			attr_dev(input2, "type", "date");
			attr_dev(input2, "class", "form-control");
			attr_dev(input2, "placeholder", "Fecha del evento");
			attr_dev(input2, "aria-label", "eventDate");
			attr_dev(input2, "aria-describedby", "basic-addon1");
			add_location(input2, file$6, 564, 12, 15511);
			attr_dev(div24, "class", "input-group mb-3 col-12");
			add_location(div24, file$6, 560, 10, 15333);
			attr_dev(i9, "class", "bi bi-clock");
			add_location(i9, file$6, 577, 15, 15952);
			attr_dev(span2, "class", "input-group-text");
			attr_dev(span2, "id", "basic-addon1");
			add_location(span2, file$6, 576, 12, 15888);
			attr_dev(input3, "type", "time");
			attr_dev(input3, "class", "form-control");
			attr_dev(input3, "placeholder", "Hora de inicio");
			attr_dev(input3, "aria-label", "eventStartTime");
			attr_dev(input3, "aria-describedby", "basic-addon1");
			add_location(input3, file$6, 579, 12, 16012);
			attr_dev(div25, "class", "input-group mb-3 col-6");
			add_location(div25, file$6, 575, 10, 15839);
			attr_dev(i10, "class", "bi bi-clock");
			add_location(i10, file$6, 592, 15, 16459);
			attr_dev(span3, "class", "input-group-text");
			attr_dev(span3, "id", "basic-addon1");
			add_location(span3, file$6, 591, 12, 16395);
			attr_dev(input4, "type", "time");
			attr_dev(input4, "class", "form-control");
			attr_dev(input4, "placeholder", "Hora de fin");
			attr_dev(input4, "aria-label", "eventEndTime");
			attr_dev(input4, "aria-describedby", "basic-addon1");
			add_location(input4, file$6, 594, 12, 16519);
			attr_dev(div26, "class", "input-group mb-3 col-6");
			add_location(div26, file$6, 590, 10, 16346);
			attr_dev(i11, "class", "bi bi-geo-alt");
			add_location(i11, file$6, 607, 15, 16953);
			attr_dev(span4, "class", "input-group-text");
			attr_dev(span4, "id", "basic-addon1");
			add_location(span4, file$6, 606, 12, 16889);
			attr_dev(input5, "type", "text");
			attr_dev(input5, "class", "form-control svelte-yjlyqq");
			attr_dev(input5, "placeholder", "Lugar");
			attr_dev(input5, "aria-label", "eventLocation");
			attr_dev(input5, "aria-describedby", "basic-addon1");
			add_location(input5, file$6, 609, 12, 17015);
			attr_dev(div27, "class", "input-group mb-3 col-6 svelte-yjlyqq");
			add_location(div27, file$6, 605, 10, 16840);
			attr_dev(i12, "class", "bi bi-person");
			add_location(i12, file$6, 636, 15, 17971);
			attr_dev(span5, "class", "input-group-text");
			attr_dev(span5, "id", "basic-addon1");
			add_location(span5, file$6, 635, 12, 17907);
			attr_dev(input6, "type", "number");
			attr_dev(input6, "class", "form-control");
			attr_dev(input6, "placeholder", "Cupo máximo");
			attr_dev(input6, "aria-label", "eventMaxAttendees");
			attr_dev(input6, "aria-describedby", "basic-addon1");
			add_location(input6, file$6, 638, 12, 18032);
			attr_dev(div28, "class", "input-group mb-3 col-6");
			add_location(div28, file$6, 634, 10, 17858);
			attr_dev(i13, "class", "bi bi-book");
			add_location(i13, file$6, 651, 15, 18481);
			attr_dev(span6, "class", "input-group-text");
			attr_dev(span6, "id", "basic-addon1");
			add_location(span6, file$6, 650, 12, 18417);
			attr_dev(select0, "class", "form-select");
			attr_dev(select0, "aria-label", "eventCareer");
			if (/*selectedEvent*/ ctx[1].career === void 0) add_render_callback(() => /*select0_change_handler*/ ctx[19].call(select0));
			add_location(select0, file$6, 654, 12, 18588);
			attr_dev(div29, "class", "input-group mb-3 col-6");
			add_location(div29, file$6, 649, 10, 18368);
			attr_dev(i14, "class", "bi bi-person");
			add_location(i14, file$6, 672, 15, 19197);
			attr_dev(span7, "class", "input-group-text");
			attr_dev(span7, "id", "basic-addon1");
			add_location(span7, file$6, 671, 12, 19133);
			attr_dev(input7, "type", "text");
			attr_dev(input7, "class", "form-control svelte-yjlyqq");
			attr_dev(input7, "placeholder", "Ponente");
			attr_dev(input7, "aria-label", "eventExponent");
			attr_dev(input7, "aria-describedby", "basic-addon1");
			add_location(input7, file$6, 674, 12, 19258);
			attr_dev(div30, "class", "input-group mb-3 col-6 svelte-yjlyqq");
			add_location(div30, file$6, 670, 10, 19084);
			attr_dev(i15, "class", "bi bi-bookmark-check");
			add_location(i15, file$6, 687, 15, 19690);
			attr_dev(span8, "class", "input-group-text");
			attr_dev(span8, "id", "basic-addon1");
			add_location(span8, file$6, 686, 12, 19626);
			option0.selected = true;
			option0.__value = "Activo";
			option0.value = option0.__value;
			add_location(option0, file$6, 694, 14, 19916);
			option1.__value = "Inactivo";
			option1.value = option1.__value;
			add_location(option1, file$6, 695, 14, 19963);
			attr_dev(select1, "class", "form-select");
			attr_dev(select1, "aria-label", "eventStatus");
			if (/*selectedEvent*/ ctx[1].status === void 0) add_render_callback(() => /*select1_change_handler*/ ctx[21].call(select1));
			add_location(select1, file$6, 689, 12, 19759);
			attr_dev(div31, "class", "input-group mb-3 col-6");
			add_location(div31, file$6, 685, 10, 19577);
			attr_dev(div32, "class", "row");
			add_location(div32, file$6, 520, 8, 14123);
			attr_dev(div33, "class", "modal-body");
			add_location(div33, file$6, 519, 6, 14090);
			add_location(div34, file$6, 701, 8, 20121);
			attr_dev(button3, "type", "button");
			attr_dev(button3, "class", "btn btn-primary");
			add_location(button3, file$6, 715, 8, 20424);
			attr_dev(div35, "class", "modal-footer justify-content-between");
			add_location(div35, file$6, 700, 6, 20062);
			attr_dev(div36, "class", "modal-content");
			add_location(div36, file$6, 509, 4, 13795);
			attr_dev(div37, "class", "modal-dialog modal-dialog-centered modal-lg");
			add_location(div37, file$6, 508, 2, 13733);
			attr_dev(div38, "class", "modal fade");
			attr_dev(div38, "id", "eventModal");
			attr_dev(div38, "tabindex", "-1");
			attr_dev(div38, "aria-labelledby", "eventModalLabel");
			attr_dev(div38, "aria-hidden", "true");
			add_location(div38, file$6, 501, 0, 13612);
		},
		l: function claim(nodes) {
			throw new Error_1$1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, nav, anchor);
			append_dev(nav, div1);
			append_dev(div1, a);
			append_dev(a, img);
			append_dev(a, t0);
			append_dev(div1, t1);
			append_dev(div1, div0);
			append_dev(div0, button0);
			append_dev(button0, i0);
			append_dev(button0, t2);
			append_dev(div0, t3);
			append_dev(div0, input0);
			append_dev(div0, t4);
			append_dev(div0, button1);
			append_dev(button1, i1);
			append_dev(button1, t5);
			insert_dev(target, t6, anchor);
			insert_dev(target, br0, anchor);
			insert_dev(target, t7, anchor);
			insert_dev(target, br1, anchor);
			insert_dev(target, t8, anchor);
			insert_dev(target, br2, anchor);
			insert_dev(target, t9, anchor);
			insert_dev(target, br3, anchor);
			insert_dev(target, t10, anchor);
			insert_dev(target, div21, anchor);
			append_dev(div21, div14);
			append_dev(div14, div4);
			append_dev(div4, div3);
			append_dev(div3, i2);
			append_dev(div3, t11);
			append_dev(div3, div2);
			append_dev(div2, h50);
			append_dev(div2, t13);
			append_dev(div2, h60);
			append_dev(h60, t14);
			append_dev(h60, t15);
			append_dev(div14, t16);
			append_dev(div14, div7);
			append_dev(div7, div6);
			append_dev(div6, i3);
			append_dev(div6, t17);
			append_dev(div6, div5);
			append_dev(div5, h51);
			append_dev(div5, t19);
			append_dev(div5, h61);
			append_dev(h61, t20);
			append_dev(h61, t21);
			append_dev(div14, t22);
			append_dev(div14, div10);
			append_dev(div10, div9);
			append_dev(div9, i4);
			append_dev(div9, t23);
			append_dev(div9, div8);
			append_dev(div8, h52);
			append_dev(div8, t25);
			append_dev(div8, h62);
			append_dev(h62, t26);
			append_dev(h62, t27);
			append_dev(div14, t28);
			append_dev(div14, div13);
			append_dev(div13, div12);
			append_dev(div12, i5);
			append_dev(div12, t29);
			append_dev(div12, div11);
			append_dev(div11, h53);
			append_dev(div11, t31);
			append_dev(div11, h63);
			append_dev(h63, t32);
			append_dev(h63, t33);
			append_dev(h63, t34);
			append_dev(h63, t35);
			append_dev(div21, t36);
			append_dev(div21, div15);
			append_dev(div15, hr);
			append_dev(div15, t37);
			append_dev(div15, br4);
			append_dev(div21, t38);
			append_dev(div21, div20);
			append_dev(div20, div19);
			append_dev(div19, div18);
			append_dev(div18, div17);
			append_dev(div17, div16);
			append_dev(div16, i6);
			append_dev(div17, t39);
			append_dev(div17, h54);
			append_dev(div20, t41);

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				if (each_blocks_1[i]) {
					each_blocks_1[i].m(div20, null);
				}
			}

			insert_dev(target, t42, anchor);
			insert_dev(target, div38, anchor);
			append_dev(div38, div37);
			append_dev(div37, div36);
			append_dev(div36, div22);
			append_dev(div22, h55);
			append_dev(div22, t44);
			append_dev(div22, button2);
			append_dev(div36, t45);
			append_dev(div36, div33);
			append_dev(div33, div32);
			append_dev(div32, div23);
			append_dev(div23, span0);
			append_dev(span0, i7);
			append_dev(div23, t46);
			append_dev(div23, input1);
			set_input_value(input1, /*selectedEvent*/ ctx[1].name);
			append_dev(div32, t47);
			append_dev(div32, div24);
			append_dev(div24, span1);
			append_dev(span1, i8);
			append_dev(div24, t48);
			append_dev(div24, input2);
			set_input_value(input2, /*selectedEvent*/ ctx[1].date);
			append_dev(div32, t49);
			append_dev(div32, div25);
			append_dev(div25, span2);
			append_dev(span2, i9);
			append_dev(div25, t50);
			append_dev(div25, input3);
			set_input_value(input3, /*selectedEvent*/ ctx[1].start_time);
			append_dev(div32, t51);
			append_dev(div32, div26);
			append_dev(div26, span3);
			append_dev(span3, i10);
			append_dev(div26, t52);
			append_dev(div26, input4);
			set_input_value(input4, /*selectedEvent*/ ctx[1].end_time);
			append_dev(div32, t53);
			append_dev(div32, div27);
			append_dev(div27, span4);
			append_dev(span4, i11);
			append_dev(div27, t54);
			append_dev(div27, input5);
			set_input_value(input5, /*selectedEvent*/ ctx[1].location);
			append_dev(div32, t55);
			append_dev(div32, div28);
			append_dev(div28, span5);
			append_dev(span5, i12);
			append_dev(div28, t56);
			append_dev(div28, input6);
			set_input_value(input6, /*selectedEvent*/ ctx[1].max_attendees);
			append_dev(div32, t57);
			append_dev(div32, div29);
			append_dev(div29, span6);
			append_dev(span6, i13);
			append_dev(div29, t58);
			append_dev(div29, select0);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(select0, null);
				}
			}

			select_option(select0, /*selectedEvent*/ ctx[1].career, true);
			append_dev(div32, t59);
			append_dev(div32, div30);
			append_dev(div30, span7);
			append_dev(span7, i14);
			append_dev(div30, t60);
			append_dev(div30, input7);
			set_input_value(input7, /*selectedEvent*/ ctx[1].exponent);
			append_dev(div32, t61);
			append_dev(div32, div31);
			append_dev(div31, span8);
			append_dev(span8, i15);
			append_dev(div31, t62);
			append_dev(div31, select1);
			append_dev(select1, option0);
			append_dev(select1, option1);
			select_option(select1, /*selectedEvent*/ ctx[1].status, true);
			append_dev(div36, t65);
			append_dev(div36, div35);
			append_dev(div35, div34);
			if (if_block) if_block.m(div34, null);
			append_dev(div35, t66);
			append_dev(div35, button3);

			if (!mounted) {
				dispose = [
					listen_dev(button1, "click", /*click_handler*/ ctx[7], false, false, false, false),
					listen_dev(div19, "click", /*click_handler_1*/ ctx[9], false, false, false, false),
					listen_dev(input1, "input", /*input1_input_handler*/ ctx[13]),
					listen_dev(input2, "input", /*input2_input_handler*/ ctx[14]),
					listen_dev(input3, "input", /*input3_input_handler*/ ctx[15]),
					listen_dev(input4, "input", /*input4_input_handler*/ ctx[16]),
					listen_dev(input5, "input", /*input5_input_handler*/ ctx[17]),
					listen_dev(input6, "input", /*input6_input_handler*/ ctx[18]),
					listen_dev(select0, "change", /*select0_change_handler*/ ctx[19]),
					listen_dev(input7, "input", /*input7_input_handler*/ ctx[20]),
					listen_dev(select1, "change", /*select1_change_handler*/ ctx[21]),
					listen_dev(button3, "click", /*click_handler_4*/ ctx[23], false, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (dirty[0] & /*events*/ 1 && t15_value !== (t15_value = /*events*/ ctx[0].length + "")) set_data_dev(t15, t15_value);
			if (dirty[0] & /*events*/ 1 && t21_value !== (t21_value = /*events*/ ctx[0].reduce(func, 0) + "")) set_data_dev(t21, t21_value);
			if (dirty[0] & /*events*/ 1 && t27_value !== (t27_value = /*events*/ ctx[0].reduce(func_1, 0) + "")) set_data_dev(t27, t27_value);
			if (dirty[0] & /*events*/ 1 && t35_value !== (t35_value = /*events*/ ctx[0].reduce(/*func_2*/ ctx[8], 0) + "")) set_data_dev(t35, t35_value);

			if (dirty[0] & /*openEventModal, events, $availableCareers*/ 21) {
				each_value_1 = /*events*/ ctx[0];
				validate_each_argument(each_value_1);
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1(ctx, each_value_1, i);

					if (each_blocks_1[i]) {
						each_blocks_1[i].p(child_ctx, dirty);
					} else {
						each_blocks_1[i] = create_each_block_1(child_ctx);
						each_blocks_1[i].c();
						each_blocks_1[i].m(div20, null);
					}
				}

				for (; i < each_blocks_1.length; i += 1) {
					each_blocks_1[i].d(1);
				}

				each_blocks_1.length = each_value_1.length;
			}

			if (dirty[0] & /*selectedEvent, $availableCareers*/ 6 && input1.value !== /*selectedEvent*/ ctx[1].name) {
				set_input_value(input1, /*selectedEvent*/ ctx[1].name);
			}

			if (dirty[0] & /*selectedEvent, $availableCareers*/ 6) {
				set_input_value(input2, /*selectedEvent*/ ctx[1].date);
			}

			if (dirty[0] & /*selectedEvent, $availableCareers*/ 6) {
				set_input_value(input3, /*selectedEvent*/ ctx[1].start_time);
			}

			if (dirty[0] & /*selectedEvent, $availableCareers*/ 6) {
				set_input_value(input4, /*selectedEvent*/ ctx[1].end_time);
			}

			if (dirty[0] & /*selectedEvent, $availableCareers*/ 6 && input5.value !== /*selectedEvent*/ ctx[1].location) {
				set_input_value(input5, /*selectedEvent*/ ctx[1].location);
			}

			if (dirty[0] & /*selectedEvent, $availableCareers*/ 6 && to_number(input6.value) !== /*selectedEvent*/ ctx[1].max_attendees) {
				set_input_value(input6, /*selectedEvent*/ ctx[1].max_attendees);
			}

			if (dirty[0] & /*$availableCareers*/ 4) {
				each_value = /*$availableCareers*/ ctx[2];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$2(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$2(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(select0, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (dirty[0] & /*selectedEvent, $availableCareers*/ 6) {
				select_option(select0, /*selectedEvent*/ ctx[1].career);
			}

			if (dirty[0] & /*selectedEvent, $availableCareers*/ 6 && input7.value !== /*selectedEvent*/ ctx[1].exponent) {
				set_input_value(input7, /*selectedEvent*/ ctx[1].exponent);
			}

			if (dirty[0] & /*selectedEvent, $availableCareers*/ 6) {
				select_option(select1, /*selectedEvent*/ ctx[1].status);
			}

			if (/*selectedEvent*/ ctx[1].id) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$3(ctx);
					if_block.c();
					if_block.m(div34, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(nav);
			if (detaching) detach_dev(t6);
			if (detaching) detach_dev(br0);
			if (detaching) detach_dev(t7);
			if (detaching) detach_dev(br1);
			if (detaching) detach_dev(t8);
			if (detaching) detach_dev(br2);
			if (detaching) detach_dev(t9);
			if (detaching) detach_dev(br3);
			if (detaching) detach_dev(t10);
			if (detaching) detach_dev(div21);
			destroy_each(each_blocks_1, detaching);
			if (detaching) detach_dev(t42);
			if (detaching) detach_dev(div38);
			destroy_each(each_blocks, detaching);
			if (if_block) if_block.d();
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

function parseCsv(csv) {
	const lines = csv.split("\n");
	const headers = lines[0].split(",");
	const result = [];

	for (let i = 1; i < lines.length; i++) {
		const obj = {};
		const currentline = lines[i].split(",");

		if (currentline.length === headers.length) {
			for (let j = 0; j < headers.length; j++) {
				obj[headers[j].trim()] = currentline[j].trim();
			}

			result.push(obj);
		}
	}

	return result;
}

const func = (acc, e) => acc + e.attendees;
const func_1 = (acc, e) => acc + 1;

function instance$8($$self, $$props, $$invalidate) {
	let $availableCareers;
	validate_store(availableCareers, 'availableCareers');
	component_subscribe($$self, availableCareers, $$value => $$invalidate(2, $availableCareers = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('EventCreator', slots, []);
	let events = [];
	let selectedEvent = {};

	function downloadEventsAsCsv() {
		console.log("downloading events as csv");
		const csvFileTitles = "Nombre, Id, Fecha, Hora de inicio, Hora de fin, Lugar, Cupo máximo, Carrera, Ponente, Maximo de asistentes\n";

		const csvFileData = events.map(event => {
			return `${event.name}, ${event.id}, ${event.date}, ${event.start_time}, ${event.end_time}, ${event.location}, ${event.max_attendees}, ${event.career}, ${event.exponent}, ${event.max_attendees}\n`;
		}).join("");

		const csvFile = csvFileTitles + csvFileData;
		const blob = new Blob([csvFile], { type: "text/csv" });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "EventosSI.csv";
		document.body.appendChild(a); // Agrega el enlace al cuerpo del documento
		a.click(); // Simula un clic en el enlace para iniciar la descarga
		document.body.removeChild(a); // Elimina el enlace del cuerpo del documento
		window.URL.revokeObjectURL(url); // Limpia la URL del objeto
	}

	async function uploadEventsCsv() {
		const fileInput = document.getElementById("upload-file");
		const file = fileInput.files[0];

		if (!file) {
			toast.error("Por favor seleccione un archivo", { duration: 3000, position: "bottom-right" });
			return;
		}

		const reader = new FileReader();

		reader.onload = async function (event) {
			const text = event.target.result;
			const data = parseCsv(text);

			/*for (event of data) {
 
  console.log(event);
saveEvent(event);
}*/
			await Promise.all(data.map(async event => {
				console.log("Event to parse: ", event);

				let newEvent = {
					name: event.Nombre,
					date: event.Fecha,
					start_time: event["Hora de inicio"],
					end_time: event["Hora de fin"],
					location: event.Lugar,
					max_attendees: event["Cupo máximo"],
					career: event.Carrera,
					exponent: event.Ponente,
					status: "Activo"
				};

				console.log("New event: ", newEvent);
				await saveEvent(newEvent);
			}));
		};

		reader.readAsText(file);
	}

	async function getEvents() {
		try {
			const res = await fetch(`${API_URL}/api/eventos_admin`, {
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

	async function saveEvent(eventToSave) {
		if (eventToSave) {
			$$invalidate(1, selectedEvent = eventToSave);
		}

		console.log("Event to save: ", selectedEvent);

		//Check that all fields are filled
		if (!selectedEvent.name || !selectedEvent.date || !selectedEvent.start_time || !selectedEvent.end_time || !selectedEvent.location || //!selectedEvent.description ||
		!selectedEvent.max_attendees || !selectedEvent.career || !selectedEvent.exponent || !selectedEvent.status) {
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

		document.getElementById("upload-btn").addEventListener("click", function () {
			document.getElementById("upload-file").click(); // Abre el diálogo para seleccionar el archivo
		});

		document.getElementById("upload-file").addEventListener("change", async function () {
			// Aquí va tu lógica para manejar el archivo seleccionado
			await uploadEventsCsv();
		});
	});

	const writable_props = [];

	Object_1$1.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$3.warn(`<EventCreator> was created with unknown prop '${key}'`);
	});

	const click_handler = () => {
		downloadEventsAsCsv();
	};

	const func_2 = (acc, e) => {
		const start = e.start_time.split(":");
		const end = e.end_time.split(":");
		const startHour = parseInt(start[0]);
		const endHour = parseInt(end[0]);
		return acc + (endHour - startHour);
	};

	const click_handler_1 = () => {
		openEventModal();
	};

	const func_3 = (event, c) => c.name == event.career;
	const func_4 = (event, c) => c.name == event.career;

	const click_handler_2 = event => {
		openEventModal(event);
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

	function input6_input_handler() {
		selectedEvent.max_attendees = to_number(this.value);
		$$invalidate(1, selectedEvent);
	}

	function select0_change_handler() {
		selectedEvent.career = select_value(this);
		$$invalidate(1, selectedEvent);
	}

	function input7_input_handler() {
		selectedEvent.exponent = this.value;
		$$invalidate(1, selectedEvent);
	}

	function select1_change_handler() {
		selectedEvent.status = select_value(this);
		$$invalidate(1, selectedEvent);
	}

	const click_handler_3 = () => {
		deleteEvent();
	};

	const click_handler_4 = () => {
		saveEvent();
	};

	$$self.$capture_state = () => ({
		toast,
		API_URL,
		availableCareers,
		onMount,
		events,
		selectedEvent,
		downloadEventsAsCsv,
		uploadEventsCsv,
		parseCsv,
		getEvents,
		handleFileUpload,
		openEventModal,
		saveEvent,
		deleteEvent,
		$availableCareers
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
		$availableCareers,
		downloadEventsAsCsv,
		openEventModal,
		saveEvent,
		deleteEvent,
		click_handler,
		func_2,
		click_handler_1,
		func_3,
		func_4,
		click_handler_2,
		input1_input_handler,
		input2_input_handler,
		input3_input_handler,
		input4_input_handler,
		input5_input_handler,
		input6_input_handler,
		select0_change_handler,
		input7_input_handler,
		select1_change_handler,
		click_handler_3,
		click_handler_4
	];
}

class EventCreator extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$8, create_fragment$8, safe_not_equal, {}, null, [-1, -1]);

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "EventCreator",
			options,
			id: create_fragment$8.name
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
const file$5 = "node_modules/svelte-routing/src/Link.svelte";
const get_default_slot_changes$2 = dirty => ({ active: dirty & /*ariaCurrent*/ 4 });
const get_default_slot_context$2 = ctx => ({ active: !!/*ariaCurrent*/ ctx[2] });

function create_fragment$7(ctx) {
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
			add_location(a, file$5, 41, 0, 1414);
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
		id: create_fragment$7.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$7($$self, $$props, $$invalidate) {
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

		init(this, options, instance$7, create_fragment$7, safe_not_equal, {
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
			id: create_fragment$7.name
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
function create_if_block$2(ctx) {
	let current_block_type_index;
	let if_block;
	let if_block_anchor;
	let current;
	const if_block_creators = [create_if_block_1, create_else_block$2];
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
		id: create_if_block$2.name,
		type: "if",
		source: "(42:0) {#if $activeRoute && $activeRoute.route === route}",
		ctx
	});

	return block;
}

// (51:4) {:else}
function create_else_block$2(ctx) {
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
		id: create_else_block$2.name,
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

function create_fragment$6(ctx) {
	let if_block_anchor;
	let current;
	let if_block = /*$activeRoute*/ ctx[1] && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[5] && create_if_block$2(ctx);

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
					if_block = create_if_block$2(ctx);
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
		id: create_fragment$6.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$6($$self, $$props, $$invalidate) {
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
		init(this, options, instance$6, create_fragment$6, safe_not_equal, { path: 6, component: 0 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Route",
			options,
			id: create_fragment$6.name
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
const { navigate } = globalHistory;

/* node_modules/svelte-routing/src/Router.svelte generated by Svelte v3.59.2 */

const { Object: Object_1 } = globals;
const file$4 = "node_modules/svelte-routing/src/Router.svelte";

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
function create_else_block$1(ctx) {
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
		id: create_else_block$1.name,
		type: "else",
		source: "(143:0) {:else}",
		ctx
	});

	return block;
}

// (134:0) {#if viewtransition}
function create_if_block$1(ctx) {
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
		id: create_if_block$1.name,
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
			add_location(div, file$4, 135, 8, 4659);
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

function create_fragment$5(ctx) {
	let current_block_type_index;
	let if_block;
	let if_block_anchor;
	let current;
	const if_block_creators = [create_if_block$1, create_else_block$1];
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
		id: create_fragment$5.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$5($$self, $$props, $$invalidate) {
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

		init(this, options, instance$5, create_fragment$5, safe_not_equal, {
			basepath: 8,
			url: 9,
			viewtransition: 0,
			history: 10
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Router",
			options,
			id: create_fragment$5.name
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

/* src/routes/LoginPage.svelte generated by Svelte v3.59.2 */
const file$3 = "src/routes/LoginPage.svelte";

function create_fragment$4(ctx) {
	let body;
	let section;
	let div0;
	let t0;
	let div1;
	let t1;
	let div12;
	let div11;
	let div10;
	let div9;
	let div8;
	let div7;
	let div6;
	let div4;
	let h2;
	let t3;
	let h4;
	let t5;
	let br0;
	let t6;
	let hr0;
	let t7;
	let div2;
	let label;
	let t9;
	let input;
	let t10;
	let div3;
	let hr1;
	let t11;
	let br1;
	let t12;
	let button;
	let t14;
	let div5;
	let p;
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
			div12 = element("div");
			div11 = element("div");
			div10 = element("div");
			div9 = element("div");
			div8 = element("div");
			div7 = element("div");
			div6 = element("div");
			div4 = element("div");
			h2 = element("h2");
			h2.textContent = "Semanana";
			t3 = space();
			h4 = element("h4");
			h4.textContent = "de la Ingeniería";
			t5 = space();
			br0 = element("br");
			t6 = space();
			hr0 = element("hr");
			t7 = space();
			div2 = element("div");
			label = element("label");
			label.textContent = "Escriba su número de cuenta";
			t9 = space();
			input = element("input");
			t10 = space();
			div3 = element("div");
			hr1 = element("hr");
			t11 = space();
			br1 = element("br");
			t12 = space();
			button = element("button");
			button.textContent = "Ingresar";
			t14 = space();
			div5 = element("div");
			p = element("p");
			p.textContent = "version 0.0.1";
			attr_dev(div0, "class", "bg-gold svelte-1xkchgf");
			add_location(div0, file$3, 24, 4, 582);
			attr_dev(div1, "class", "bg-white svelte-1xkchgf");
			add_location(div1, file$3, 25, 4, 610);
			attr_dev(h2, "class", "fw-bold mb-2 text-uppercase");
			add_location(h2, file$3, 44, 20, 1375);
			attr_dev(h4, "class", "fw-bold mb-2 text-uppercase");
			add_location(h4, file$3, 45, 20, 1449);
			add_location(br0, file$3, 49, 5, 1561);
			add_location(hr0, file$3, 51, 5, 1572);
			attr_dev(label, "class", "form-label");
			attr_dev(label, "for", "username");
			add_location(label, file$3, 54, 22, 1751);
			attr_dev(input, "type", "text");
			attr_dev(input, "id", "");
			attr_dev(input, "class", "input form-control");
			attr_dev(input, "placeholder", "Num. de Cuenta UNAM");
			add_location(input, file$3, 57, 22, 1898);
			attr_dev(div2, "class", "form-outline form-white mb-4");
			add_location(div2, file$3, 52, 20, 1597);
			add_location(hr1, file$3, 67, 22, 2262);
			add_location(br1, file$3, 68, 22, 2291);
			attr_dev(button, "class", "btn btn-success btn-lg px-5");
			add_location(button, file$3, 70, 22, 2321);
			attr_dev(div3, "class", "form-outline form-white mb-4");
			add_location(div3, file$3, 66, 20, 2197);
			attr_dev(div4, "class", "mb-md-5 mt-md-4 pb-5");
			add_location(div4, file$3, 43, 18, 1320);
			attr_dev(p, "class", "text-secondary");
			add_location(p, file$3, 87, 20, 3086);
			attr_dev(div5, "class", "d-flex justify-content-center");
			add_location(div5, file$3, 86, 18, 3022);
			attr_dev(div6, "class", "card-body p-5 text-center");
			add_location(div6, file$3, 42, 16, 1262);
			attr_dev(div7, "class", "card bg-light text-black shadow-lg p-3 mb-5 bg-body rounded");
			set_style(div7, "border-radius", "1rem");
			add_location(div7, file$3, 38, 14, 1096);
			attr_dev(div8, "class", "row d-flex justify-content-center align-items-center h-100");
			add_location(div8, file$3, 35, 12, 982);
			attr_dev(div9, "class", "container h-100");
			add_location(div9, file$3, 33, 10, 886);
			attr_dev(div10, "class", "col-12 col-md-6 col-lg-5 col-xl-4");
			set_style(div10, "max-width", "700px");
			add_location(div10, file$3, 29, 8, 773);
			attr_dev(div11, "class", "row h-100 justify-content-center align-items-center");
			add_location(div11, file$3, 28, 6, 699);
			attr_dev(div12, "class", "container-fluid");
			set_style(div12, "height", "100vh");
			add_location(div12, file$3, 27, 4, 640);
			attr_dev(section, "class", "");
			add_location(section, file$3, 23, 2, 559);
			attr_dev(body, "class", "svelte-1xkchgf");
			add_location(body, file$3, 22, 0, 550);
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
			append_dev(section, div12);
			append_dev(div12, div11);
			append_dev(div11, div10);
			append_dev(div10, div9);
			append_dev(div9, div8);
			append_dev(div8, div7);
			append_dev(div7, div6);
			append_dev(div6, div4);
			append_dev(div4, h2);
			append_dev(div4, t3);
			append_dev(div4, h4);
			append_dev(div4, t5);
			append_dev(div4, br0);
			append_dev(div4, t6);
			append_dev(div4, hr0);
			append_dev(div4, t7);
			append_dev(div4, div2);
			append_dev(div2, label);
			append_dev(div2, t9);
			append_dev(div2, input);
			set_input_value(input, /*boleta*/ ctx[0]);
			append_dev(div4, t10);
			append_dev(div4, div3);
			append_dev(div3, hr1);
			append_dev(div3, t11);
			append_dev(div3, br1);
			append_dev(div3, t12);
			append_dev(div3, button);
			append_dev(div6, t14);
			append_dev(div6, div5);
			append_dev(div5, p);

			if (!mounted) {
				dispose = [
					listen_dev(input, "input", /*input_input_handler*/ ctx[2]),
					listen_dev(button, "click", /*click_handler*/ ctx[3], false, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*boleta*/ 1 && input.value !== /*boleta*/ ctx[0]) {
				set_input_value(input, /*boleta*/ ctx[0]);
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
		id: create_fragment$4.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$4($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('LoginPage', slots, []);

	onMount(() => {
		selectedPage.set("LOGIN_PAGE");
	});

	let boleta = "";

	async function login() {
		//verify thar boleta is a 9 digit number
		if (!(/^\d{9}$/).test(boleta)) {
			toast.error("Por favor, ingrese un número de boleta válido");
			return;
		}

		//save boleta in cookie by name "userId" for 4 hours
		document.cookie = `userId=${boleta}; max-age=14400; path=/`;

		navigate("/events");
	}

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LoginPage> was created with unknown prop '${key}'`);
	});

	function input_input_handler() {
		boleta = this.value;
		$$invalidate(0, boleta);
	}

	const click_handler = () => {
		login();
	};

	$$self.$capture_state = () => ({ onMount, toast, navigate, boleta, login });

	$$self.$inject_state = $$props => {
		if ('boleta' in $$props) $$invalidate(0, boleta = $$props.boleta);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [boleta, login, input_input_handler, click_handler];
}

class LoginPage extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "LoginPage",
			options,
			id: create_fragment$4.name
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

const { console: console_1$2 } = globals;
const file$2 = "src/routes/Scanner.svelte";

function get_each_context$1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[15] = list[i];
	return child_ctx;
}

// (209:10) {#each cameras as camera}
function create_each_block$1(ctx) {
	let div3;
	let div2;
	let div0;
	let img;
	let img_src_value;
	let t0;
	let div1;
	let p;
	let t1_value = /*camera*/ ctx[15].label + "";
	let t1;
	let t2;
	let mounted;
	let dispose;

	function click_handler() {
		return /*click_handler*/ ctx[4](/*camera*/ ctx[15]);
	}

	const block = {
		c: function create() {
			div3 = element("div");
			div2 = element("div");
			div0 = element("div");
			img = element("img");
			t0 = space();
			div1 = element("div");
			p = element("p");
			t1 = text(t1_value);
			t2 = space();
			if (!src_url_equal(img.src, img_src_value = "https://media.istockphoto.com/id/1226328537/vector/image-place-holder-with-a-gray-camera-icon.jpg?s=612x612&w=0&k=20&c=qRydgCNlE44OUSSoz5XadsH7WCkU59-l-dwrvZzhXsI=")) attr_dev(img, "src", img_src_value);
			attr_dev(img, "class", "card-img-top");
			attr_dev(img, "alt", "...");
			add_location(img, file$2, 221, 18, 6012);
			attr_dev(div0, "class", "col-3");
			add_location(div0, file$2, 220, 16, 5974);
			attr_dev(p, "class", "card-text");
			add_location(p, file$2, 231, 18, 6461);
			attr_dev(div1, "class", "col-9 d-flex justify-content-center align-items-center");
			add_location(div1, file$2, 228, 16, 6339);
			attr_dev(div2, "class", "row");
			add_location(div2, file$2, 219, 14, 5940);
			attr_dev(div3, "class", "card mb-3 shadow-sm");
			add_location(div3, file$2, 211, 12, 5681);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div3, anchor);
			append_dev(div3, div2);
			append_dev(div2, div0);
			append_dev(div0, img);
			append_dev(div2, t0);
			append_dev(div2, div1);
			append_dev(div1, p);
			append_dev(p, t1);
			insert_dev(target, t2, anchor);

			if (!mounted) {
				dispose = listen_dev(div3, "click", click_handler, false, false, false, false);
				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty & /*cameras*/ 2 && t1_value !== (t1_value = /*camera*/ ctx[15].label + "")) set_data_dev(t1, t1_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div3);
			if (detaching) detach_dev(t2);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$1.name,
		type: "each",
		source: "(209:10) {#each cameras as camera}",
		ctx
	});

	return block;
}

function create_fragment$3(ctx) {
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
	let i;
	let t3;
	let div2;
	let div1;
	let video;
	let t4;
	let div9;
	let div8;
	let div7;
	let div3;
	let h5;
	let t6;
	let button1;
	let t7;
	let div5;
	let div4;
	let t8;
	let div6;
	let button2;
	let current;
	toaster = new Toaster({ $$inline: true });
	let each_value = /*cameras*/ ctx[1];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
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
			i = element("i");
			t3 = space();
			div2 = element("div");
			div1 = element("div");
			video = element("video");
			t4 = space();
			div9 = element("div");
			div8 = element("div");
			div7 = element("div");
			div3 = element("div");
			h5 = element("h5");
			h5.textContent = "Seleccionar Cámara";
			t6 = space();
			button1 = element("button");
			t7 = space();
			div5 = element("div");
			div4 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t8 = space();
			div6 = element("div");
			button2 = element("button");
			button2.textContent = "Cerrar";
			if (!src_url_equal(img.src, img_src_value = "https://propiedadintelectual.unam.mx/assets/img/unamblanco.png")) attr_dev(img, "src", img_src_value);
			attr_dev(img, "alt", "");
			attr_dev(img, "width", "30");
			attr_dev(img, "height", "24");
			attr_dev(img, "class", "d-inline-block align-text-top");
			add_location(img, file$2, 155, 6, 4162);
			attr_dev(a, "class", "navbar-brand");
			attr_dev(a, "href", "#");
			add_location(a, file$2, 154, 4, 4122);
			attr_dev(i, "class", "bi bi-camera-video-fill");
			add_location(i, file$2, 172, 8, 4607);
			attr_dev(button0, "class", "btn btn-secondary");
			attr_dev(button0, "type", "button");
			set_style(button0, "margin-right", "8px");
			attr_dev(button0, "data-bs-toggle", "modal");
			attr_dev(button0, "data-bs-target", "#cameraModal");
			add_location(button0, file$2, 165, 6, 4423);
			attr_dev(form, "class", "d-flex");
			add_location(form, file$2, 164, 4, 4395);
			attr_dev(div0, "class", "container-fluid");
			add_location(div0, file$2, 153, 2, 4088);
			attr_dev(nav, "class", "navbar navbar-dark bg-primary shadow-lg");
			attr_dev(nav, "style", "");
			add_location(nav, file$2, 152, 0, 4023);
			video.playsInline = true;
			attr_dev(video, "class", "svelte-3eht5a");
			add_location(video, file$2, 183, 4, 4919);
			attr_dev(div1, "class", "video-container shadow-lg svelte-3eht5a");
			add_location(div1, file$2, 182, 2, 4875);
			attr_dev(div2, "class", "d-flex justify-content-center align-items-center");
			add_location(div2, file$2, 181, 0, 4810);
			attr_dev(h5, "class", "modal-title");
			attr_dev(h5, "id", "cameraModalLabel");
			add_location(h5, file$2, 198, 8, 5273);
			attr_dev(button1, "type", "button");
			attr_dev(button1, "class", "btn-close");
			attr_dev(button1, "data-bs-dismiss", "modal");
			attr_dev(button1, "aria-label", "Close");
			add_location(button1, file$2, 199, 8, 5351);
			attr_dev(div3, "class", "modal-header");
			add_location(div3, file$2, 197, 6, 5238);
			attr_dev(div4, "class", "row");
			add_location(div4, file$2, 207, 8, 5545);
			attr_dev(div5, "class", "modal-body");
			add_location(div5, file$2, 206, 6, 5512);
			attr_dev(button2, "type", "button");
			attr_dev(button2, "class", "btn btn-secondary");
			attr_dev(button2, "data-bs-dismiss", "modal");
			add_location(button2, file$2, 260, 8, 7365);
			attr_dev(div6, "class", "modal-footer");
			add_location(div6, file$2, 259, 6, 7330);
			attr_dev(div7, "class", "modal-content");
			add_location(div7, file$2, 196, 4, 5204);
			attr_dev(div8, "class", "modal-dialog modal-dialog-centered modal-dialog-scrollable");
			add_location(div8, file$2, 195, 2, 5127);
			attr_dev(div9, "class", "modal fade");
			attr_dev(div9, "id", "cameraModal");
			attr_dev(div9, "tabindex", "-1");
			attr_dev(div9, "aria-labelledby", "cameraModalLabel");
			attr_dev(div9, "aria-hidden", "true");
			add_location(div9, file$2, 188, 0, 5004);
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
			append_dev(button0, i);
			insert_dev(target, t3, anchor);
			insert_dev(target, div2, anchor);
			append_dev(div2, div1);
			append_dev(div1, video);
			/*video_binding*/ ctx[3](video);
			insert_dev(target, t4, anchor);
			insert_dev(target, div9, anchor);
			append_dev(div9, div8);
			append_dev(div8, div7);
			append_dev(div7, div3);
			append_dev(div3, h5);
			append_dev(div3, t6);
			append_dev(div3, button1);
			append_dev(div7, t7);
			append_dev(div7, div5);
			append_dev(div5, div4);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div4, null);
				}
			}

			append_dev(div7, t8);
			append_dev(div7, div6);
			append_dev(div6, button2);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*selectCamera, cameras, document*/ 6) {
				each_value = /*cameras*/ ctx[1];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$1(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$1(child_ctx);
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
			if (detaching) detach_dev(t3);
			if (detaching) detach_dev(div2);
			/*video_binding*/ ctx[3](null);
			if (detaching) detach_dev(t4);
			if (detaching) detach_dev(div9);
			destroy_each(each_blocks, detaching);
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

					//toast.success("Visita registrada: " + scanResult, toastOptions);
					registerVisit(scanResult);
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

	async function registerVisit(qrReading) {
		try {
			let userId = -1;
			let eventId = "";
			let tranformedQrReading = qrReading.split("-");

			if (tranformedQrReading.length < 2) {
				toast.error("QR inválido");
				return;
			}

			userId = tranformedQrReading[0];

			for (let i = 1; i < tranformedQrReading.length; i++) {
				eventId += tranformedQrReading[i] + "-";
			}

			eventId = eventId.slice(0, -1); //remove last character

			const res = await fetch(`${API_URL}/api/evento/visit`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ user_id: userId, event_id: eventId })
			});

			const result = await res.json();

			if (result.ok) {
				toast.success(result.message);
			} else {
				toast.error(result.error);
			}
		} catch(error) {
			console.log(error);
		}
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
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<Scanner> was created with unknown prop '${key}'`);
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
		API_URL,
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
		startScanner,
		registerVisit
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
		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Scanner",
			options,
			id: create_fragment$3.name
		});
	}
}

var browser = {};

// can-promise has a crash in some versions of react native that dont have
// standard global objects
// https://github.com/soldair/node-qrcode/issues/157

var canPromise$1 = function () {
  return typeof Promise === 'function' && Promise.prototype && Promise.prototype.then
};

var qrcode = {};

var utils$1 = {};

let toSJISFunction;
const CODEWORDS_COUNT = [
  0, // Not used
  26, 44, 70, 100, 134, 172, 196, 242, 292, 346,
  404, 466, 532, 581, 655, 733, 815, 901, 991, 1085,
  1156, 1258, 1364, 1474, 1588, 1706, 1828, 1921, 2051, 2185,
  2323, 2465, 2611, 2761, 2876, 3034, 3196, 3362, 3532, 3706
];

/**
 * Returns the QR Code size for the specified version
 *
 * @param  {Number} version QR Code version
 * @return {Number}         size of QR code
 */
utils$1.getSymbolSize = function getSymbolSize (version) {
  if (!version) throw new Error('"version" cannot be null or undefined')
  if (version < 1 || version > 40) throw new Error('"version" should be in range from 1 to 40')
  return version * 4 + 17
};

/**
 * Returns the total number of codewords used to store data and EC information.
 *
 * @param  {Number} version QR Code version
 * @return {Number}         Data length in bits
 */
utils$1.getSymbolTotalCodewords = function getSymbolTotalCodewords (version) {
  return CODEWORDS_COUNT[version]
};

/**
 * Encode data with Bose-Chaudhuri-Hocquenghem
 *
 * @param  {Number} data Value to encode
 * @return {Number}      Encoded value
 */
utils$1.getBCHDigit = function (data) {
  let digit = 0;

  while (data !== 0) {
    digit++;
    data >>>= 1;
  }

  return digit
};

utils$1.setToSJISFunction = function setToSJISFunction (f) {
  if (typeof f !== 'function') {
    throw new Error('"toSJISFunc" is not a valid function.')
  }

  toSJISFunction = f;
};

utils$1.isKanjiModeEnabled = function () {
  return typeof toSJISFunction !== 'undefined'
};

utils$1.toSJIS = function toSJIS (kanji) {
  return toSJISFunction(kanji)
};

var errorCorrectionLevel = {};

(function (exports) {
	exports.L = { bit: 1 };
	exports.M = { bit: 0 };
	exports.Q = { bit: 3 };
	exports.H = { bit: 2 };

	function fromString (string) {
	  if (typeof string !== 'string') {
	    throw new Error('Param is not a string')
	  }

	  const lcStr = string.toLowerCase();

	  switch (lcStr) {
	    case 'l':
	    case 'low':
	      return exports.L

	    case 'm':
	    case 'medium':
	      return exports.M

	    case 'q':
	    case 'quartile':
	      return exports.Q

	    case 'h':
	    case 'high':
	      return exports.H

	    default:
	      throw new Error('Unknown EC Level: ' + string)
	  }
	}

	exports.isValid = function isValid (level) {
	  return level && typeof level.bit !== 'undefined' &&
	    level.bit >= 0 && level.bit < 4
	};

	exports.from = function from (value, defaultValue) {
	  if (exports.isValid(value)) {
	    return value
	  }

	  try {
	    return fromString(value)
	  } catch (e) {
	    return defaultValue
	  }
	}; 
} (errorCorrectionLevel));

function BitBuffer$1 () {
  this.buffer = [];
  this.length = 0;
}

BitBuffer$1.prototype = {

  get: function (index) {
    const bufIndex = Math.floor(index / 8);
    return ((this.buffer[bufIndex] >>> (7 - index % 8)) & 1) === 1
  },

  put: function (num, length) {
    for (let i = 0; i < length; i++) {
      this.putBit(((num >>> (length - i - 1)) & 1) === 1);
    }
  },

  getLengthInBits: function () {
    return this.length
  },

  putBit: function (bit) {
    const bufIndex = Math.floor(this.length / 8);
    if (this.buffer.length <= bufIndex) {
      this.buffer.push(0);
    }

    if (bit) {
      this.buffer[bufIndex] |= (0x80 >>> (this.length % 8));
    }

    this.length++;
  }
};

var bitBuffer = BitBuffer$1;

/**
 * Helper class to handle QR Code symbol modules
 *
 * @param {Number} size Symbol size
 */

function BitMatrix$1 (size) {
  if (!size || size < 1) {
    throw new Error('BitMatrix size must be defined and greater than 0')
  }

  this.size = size;
  this.data = new Uint8Array(size * size);
  this.reservedBit = new Uint8Array(size * size);
}

/**
 * Set bit value at specified location
 * If reserved flag is set, this bit will be ignored during masking process
 *
 * @param {Number}  row
 * @param {Number}  col
 * @param {Boolean} value
 * @param {Boolean} reserved
 */
BitMatrix$1.prototype.set = function (row, col, value, reserved) {
  const index = row * this.size + col;
  this.data[index] = value;
  if (reserved) this.reservedBit[index] = true;
};

/**
 * Returns bit value at specified location
 *
 * @param  {Number}  row
 * @param  {Number}  col
 * @return {Boolean}
 */
BitMatrix$1.prototype.get = function (row, col) {
  return this.data[row * this.size + col]
};

/**
 * Applies xor operator at specified location
 * (used during masking process)
 *
 * @param {Number}  row
 * @param {Number}  col
 * @param {Boolean} value
 */
BitMatrix$1.prototype.xor = function (row, col, value) {
  this.data[row * this.size + col] ^= value;
};

/**
 * Check if bit at specified location is reserved
 *
 * @param {Number}   row
 * @param {Number}   col
 * @return {Boolean}
 */
BitMatrix$1.prototype.isReserved = function (row, col) {
  return this.reservedBit[row * this.size + col]
};

var bitMatrix = BitMatrix$1;

var alignmentPattern = {};

/**
 * Alignment pattern are fixed reference pattern in defined positions
 * in a matrix symbology, which enables the decode software to re-synchronise
 * the coordinate mapping of the image modules in the event of moderate amounts
 * of distortion of the image.
 *
 * Alignment patterns are present only in QR Code symbols of version 2 or larger
 * and their number depends on the symbol version.
 */

(function (exports) {
	const getSymbolSize = utils$1.getSymbolSize;

	/**
	 * Calculate the row/column coordinates of the center module of each alignment pattern
	 * for the specified QR Code version.
	 *
	 * The alignment patterns are positioned symmetrically on either side of the diagonal
	 * running from the top left corner of the symbol to the bottom right corner.
	 *
	 * Since positions are simmetrical only half of the coordinates are returned.
	 * Each item of the array will represent in turn the x and y coordinate.
	 * @see {@link getPositions}
	 *
	 * @param  {Number} version QR Code version
	 * @return {Array}          Array of coordinate
	 */
	exports.getRowColCoords = function getRowColCoords (version) {
	  if (version === 1) return []

	  const posCount = Math.floor(version / 7) + 2;
	  const size = getSymbolSize(version);
	  const intervals = size === 145 ? 26 : Math.ceil((size - 13) / (2 * posCount - 2)) * 2;
	  const positions = [size - 7]; // Last coord is always (size - 7)

	  for (let i = 1; i < posCount - 1; i++) {
	    positions[i] = positions[i - 1] - intervals;
	  }

	  positions.push(6); // First coord is always 6

	  return positions.reverse()
	};

	/**
	 * Returns an array containing the positions of each alignment pattern.
	 * Each array's element represent the center point of the pattern as (x, y) coordinates
	 *
	 * Coordinates are calculated expanding the row/column coordinates returned by {@link getRowColCoords}
	 * and filtering out the items that overlaps with finder pattern
	 *
	 * @example
	 * For a Version 7 symbol {@link getRowColCoords} returns values 6, 22 and 38.
	 * The alignment patterns, therefore, are to be centered on (row, column)
	 * positions (6,22), (22,6), (22,22), (22,38), (38,22), (38,38).
	 * Note that the coordinates (6,6), (6,38), (38,6) are occupied by finder patterns
	 * and are not therefore used for alignment patterns.
	 *
	 * let pos = getPositions(7)
	 * // [[6,22], [22,6], [22,22], [22,38], [38,22], [38,38]]
	 *
	 * @param  {Number} version QR Code version
	 * @return {Array}          Array of coordinates
	 */
	exports.getPositions = function getPositions (version) {
	  const coords = [];
	  const pos = exports.getRowColCoords(version);
	  const posLength = pos.length;

	  for (let i = 0; i < posLength; i++) {
	    for (let j = 0; j < posLength; j++) {
	      // Skip if position is occupied by finder patterns
	      if ((i === 0 && j === 0) || // top-left
	          (i === 0 && j === posLength - 1) || // bottom-left
	          (i === posLength - 1 && j === 0)) { // top-right
	        continue
	      }

	      coords.push([pos[i], pos[j]]);
	    }
	  }

	  return coords
	}; 
} (alignmentPattern));

var finderPattern = {};

const getSymbolSize = utils$1.getSymbolSize;
const FINDER_PATTERN_SIZE = 7;

/**
 * Returns an array containing the positions of each finder pattern.
 * Each array's element represent the top-left point of the pattern as (x, y) coordinates
 *
 * @param  {Number} version QR Code version
 * @return {Array}          Array of coordinates
 */
finderPattern.getPositions = function getPositions (version) {
  const size = getSymbolSize(version);

  return [
    // top-left
    [0, 0],
    // top-right
    [size - FINDER_PATTERN_SIZE, 0],
    // bottom-left
    [0, size - FINDER_PATTERN_SIZE]
  ]
};

var maskPattern = {};

/**
 * Data mask pattern reference
 * @type {Object}
 */

(function (exports) {
	exports.Patterns = {
	  PATTERN000: 0,
	  PATTERN001: 1,
	  PATTERN010: 2,
	  PATTERN011: 3,
	  PATTERN100: 4,
	  PATTERN101: 5,
	  PATTERN110: 6,
	  PATTERN111: 7
	};

	/**
	 * Weighted penalty scores for the undesirable features
	 * @type {Object}
	 */
	const PenaltyScores = {
	  N1: 3,
	  N2: 3,
	  N3: 40,
	  N4: 10
	};

	/**
	 * Check if mask pattern value is valid
	 *
	 * @param  {Number}  mask    Mask pattern
	 * @return {Boolean}         true if valid, false otherwise
	 */
	exports.isValid = function isValid (mask) {
	  return mask != null && mask !== '' && !isNaN(mask) && mask >= 0 && mask <= 7
	};

	/**
	 * Returns mask pattern from a value.
	 * If value is not valid, returns undefined
	 *
	 * @param  {Number|String} value        Mask pattern value
	 * @return {Number}                     Valid mask pattern or undefined
	 */
	exports.from = function from (value) {
	  return exports.isValid(value) ? parseInt(value, 10) : undefined
	};

	/**
	* Find adjacent modules in row/column with the same color
	* and assign a penalty value.
	*
	* Points: N1 + i
	* i is the amount by which the number of adjacent modules of the same color exceeds 5
	*/
	exports.getPenaltyN1 = function getPenaltyN1 (data) {
	  const size = data.size;
	  let points = 0;
	  let sameCountCol = 0;
	  let sameCountRow = 0;
	  let lastCol = null;
	  let lastRow = null;

	  for (let row = 0; row < size; row++) {
	    sameCountCol = sameCountRow = 0;
	    lastCol = lastRow = null;

	    for (let col = 0; col < size; col++) {
	      let module = data.get(row, col);
	      if (module === lastCol) {
	        sameCountCol++;
	      } else {
	        if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5);
	        lastCol = module;
	        sameCountCol = 1;
	      }

	      module = data.get(col, row);
	      if (module === lastRow) {
	        sameCountRow++;
	      } else {
	        if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5);
	        lastRow = module;
	        sameCountRow = 1;
	      }
	    }

	    if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5);
	    if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5);
	  }

	  return points
	};

	/**
	 * Find 2x2 blocks with the same color and assign a penalty value
	 *
	 * Points: N2 * (m - 1) * (n - 1)
	 */
	exports.getPenaltyN2 = function getPenaltyN2 (data) {
	  const size = data.size;
	  let points = 0;

	  for (let row = 0; row < size - 1; row++) {
	    for (let col = 0; col < size - 1; col++) {
	      const last = data.get(row, col) +
	        data.get(row, col + 1) +
	        data.get(row + 1, col) +
	        data.get(row + 1, col + 1);

	      if (last === 4 || last === 0) points++;
	    }
	  }

	  return points * PenaltyScores.N2
	};

	/**
	 * Find 1:1:3:1:1 ratio (dark:light:dark:light:dark) pattern in row/column,
	 * preceded or followed by light area 4 modules wide
	 *
	 * Points: N3 * number of pattern found
	 */
	exports.getPenaltyN3 = function getPenaltyN3 (data) {
	  const size = data.size;
	  let points = 0;
	  let bitsCol = 0;
	  let bitsRow = 0;

	  for (let row = 0; row < size; row++) {
	    bitsCol = bitsRow = 0;
	    for (let col = 0; col < size; col++) {
	      bitsCol = ((bitsCol << 1) & 0x7FF) | data.get(row, col);
	      if (col >= 10 && (bitsCol === 0x5D0 || bitsCol === 0x05D)) points++;

	      bitsRow = ((bitsRow << 1) & 0x7FF) | data.get(col, row);
	      if (col >= 10 && (bitsRow === 0x5D0 || bitsRow === 0x05D)) points++;
	    }
	  }

	  return points * PenaltyScores.N3
	};

	/**
	 * Calculate proportion of dark modules in entire symbol
	 *
	 * Points: N4 * k
	 *
	 * k is the rating of the deviation of the proportion of dark modules
	 * in the symbol from 50% in steps of 5%
	 */
	exports.getPenaltyN4 = function getPenaltyN4 (data) {
	  let darkCount = 0;
	  const modulesCount = data.data.length;

	  for (let i = 0; i < modulesCount; i++) darkCount += data.data[i];

	  const k = Math.abs(Math.ceil((darkCount * 100 / modulesCount) / 5) - 10);

	  return k * PenaltyScores.N4
	};

	/**
	 * Return mask value at given position
	 *
	 * @param  {Number} maskPattern Pattern reference value
	 * @param  {Number} i           Row
	 * @param  {Number} j           Column
	 * @return {Boolean}            Mask value
	 */
	function getMaskAt (maskPattern, i, j) {
	  switch (maskPattern) {
	    case exports.Patterns.PATTERN000: return (i + j) % 2 === 0
	    case exports.Patterns.PATTERN001: return i % 2 === 0
	    case exports.Patterns.PATTERN010: return j % 3 === 0
	    case exports.Patterns.PATTERN011: return (i + j) % 3 === 0
	    case exports.Patterns.PATTERN100: return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0
	    case exports.Patterns.PATTERN101: return (i * j) % 2 + (i * j) % 3 === 0
	    case exports.Patterns.PATTERN110: return ((i * j) % 2 + (i * j) % 3) % 2 === 0
	    case exports.Patterns.PATTERN111: return ((i * j) % 3 + (i + j) % 2) % 2 === 0

	    default: throw new Error('bad maskPattern:' + maskPattern)
	  }
	}

	/**
	 * Apply a mask pattern to a BitMatrix
	 *
	 * @param  {Number}    pattern Pattern reference number
	 * @param  {BitMatrix} data    BitMatrix data
	 */
	exports.applyMask = function applyMask (pattern, data) {
	  const size = data.size;

	  for (let col = 0; col < size; col++) {
	    for (let row = 0; row < size; row++) {
	      if (data.isReserved(row, col)) continue
	      data.xor(row, col, getMaskAt(pattern, row, col));
	    }
	  }
	};

	/**
	 * Returns the best mask pattern for data
	 *
	 * @param  {BitMatrix} data
	 * @return {Number} Mask pattern reference number
	 */
	exports.getBestMask = function getBestMask (data, setupFormatFunc) {
	  const numPatterns = Object.keys(exports.Patterns).length;
	  let bestPattern = 0;
	  let lowerPenalty = Infinity;

	  for (let p = 0; p < numPatterns; p++) {
	    setupFormatFunc(p);
	    exports.applyMask(p, data);

	    // Calculate penalty
	    const penalty =
	      exports.getPenaltyN1(data) +
	      exports.getPenaltyN2(data) +
	      exports.getPenaltyN3(data) +
	      exports.getPenaltyN4(data);

	    // Undo previously applied mask
	    exports.applyMask(p, data);

	    if (penalty < lowerPenalty) {
	      lowerPenalty = penalty;
	      bestPattern = p;
	    }
	  }

	  return bestPattern
	}; 
} (maskPattern));

var errorCorrectionCode = {};

const ECLevel$1 = errorCorrectionLevel;

const EC_BLOCKS_TABLE = [
// L  M  Q  H
  1, 1, 1, 1,
  1, 1, 1, 1,
  1, 1, 2, 2,
  1, 2, 2, 4,
  1, 2, 4, 4,
  2, 4, 4, 4,
  2, 4, 6, 5,
  2, 4, 6, 6,
  2, 5, 8, 8,
  4, 5, 8, 8,
  4, 5, 8, 11,
  4, 8, 10, 11,
  4, 9, 12, 16,
  4, 9, 16, 16,
  6, 10, 12, 18,
  6, 10, 17, 16,
  6, 11, 16, 19,
  6, 13, 18, 21,
  7, 14, 21, 25,
  8, 16, 20, 25,
  8, 17, 23, 25,
  9, 17, 23, 34,
  9, 18, 25, 30,
  10, 20, 27, 32,
  12, 21, 29, 35,
  12, 23, 34, 37,
  12, 25, 34, 40,
  13, 26, 35, 42,
  14, 28, 38, 45,
  15, 29, 40, 48,
  16, 31, 43, 51,
  17, 33, 45, 54,
  18, 35, 48, 57,
  19, 37, 51, 60,
  19, 38, 53, 63,
  20, 40, 56, 66,
  21, 43, 59, 70,
  22, 45, 62, 74,
  24, 47, 65, 77,
  25, 49, 68, 81
];

const EC_CODEWORDS_TABLE = [
// L  M  Q  H
  7, 10, 13, 17,
  10, 16, 22, 28,
  15, 26, 36, 44,
  20, 36, 52, 64,
  26, 48, 72, 88,
  36, 64, 96, 112,
  40, 72, 108, 130,
  48, 88, 132, 156,
  60, 110, 160, 192,
  72, 130, 192, 224,
  80, 150, 224, 264,
  96, 176, 260, 308,
  104, 198, 288, 352,
  120, 216, 320, 384,
  132, 240, 360, 432,
  144, 280, 408, 480,
  168, 308, 448, 532,
  180, 338, 504, 588,
  196, 364, 546, 650,
  224, 416, 600, 700,
  224, 442, 644, 750,
  252, 476, 690, 816,
  270, 504, 750, 900,
  300, 560, 810, 960,
  312, 588, 870, 1050,
  336, 644, 952, 1110,
  360, 700, 1020, 1200,
  390, 728, 1050, 1260,
  420, 784, 1140, 1350,
  450, 812, 1200, 1440,
  480, 868, 1290, 1530,
  510, 924, 1350, 1620,
  540, 980, 1440, 1710,
  570, 1036, 1530, 1800,
  570, 1064, 1590, 1890,
  600, 1120, 1680, 1980,
  630, 1204, 1770, 2100,
  660, 1260, 1860, 2220,
  720, 1316, 1950, 2310,
  750, 1372, 2040, 2430
];

/**
 * Returns the number of error correction block that the QR Code should contain
 * for the specified version and error correction level.
 *
 * @param  {Number} version              QR Code version
 * @param  {Number} errorCorrectionLevel Error correction level
 * @return {Number}                      Number of error correction blocks
 */
errorCorrectionCode.getBlocksCount = function getBlocksCount (version, errorCorrectionLevel) {
  switch (errorCorrectionLevel) {
    case ECLevel$1.L:
      return EC_BLOCKS_TABLE[(version - 1) * 4 + 0]
    case ECLevel$1.M:
      return EC_BLOCKS_TABLE[(version - 1) * 4 + 1]
    case ECLevel$1.Q:
      return EC_BLOCKS_TABLE[(version - 1) * 4 + 2]
    case ECLevel$1.H:
      return EC_BLOCKS_TABLE[(version - 1) * 4 + 3]
    default:
      return undefined
  }
};

/**
 * Returns the number of error correction codewords to use for the specified
 * version and error correction level.
 *
 * @param  {Number} version              QR Code version
 * @param  {Number} errorCorrectionLevel Error correction level
 * @return {Number}                      Number of error correction codewords
 */
errorCorrectionCode.getTotalCodewordsCount = function getTotalCodewordsCount (version, errorCorrectionLevel) {
  switch (errorCorrectionLevel) {
    case ECLevel$1.L:
      return EC_CODEWORDS_TABLE[(version - 1) * 4 + 0]
    case ECLevel$1.M:
      return EC_CODEWORDS_TABLE[(version - 1) * 4 + 1]
    case ECLevel$1.Q:
      return EC_CODEWORDS_TABLE[(version - 1) * 4 + 2]
    case ECLevel$1.H:
      return EC_CODEWORDS_TABLE[(version - 1) * 4 + 3]
    default:
      return undefined
  }
};

var polynomial = {};

var galoisField = {};

const EXP_TABLE = new Uint8Array(512);
const LOG_TABLE = new Uint8Array(256)
/**
 * Precompute the log and anti-log tables for faster computation later
 *
 * For each possible value in the galois field 2^8, we will pre-compute
 * the logarithm and anti-logarithm (exponential) of this value
 *
 * ref {@link https://en.wikiversity.org/wiki/Reed%E2%80%93Solomon_codes_for_coders#Introduction_to_mathematical_fields}
 */
;(function initTables () {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    EXP_TABLE[i] = x;
    LOG_TABLE[x] = i;

    x <<= 1; // multiply by 2

    // The QR code specification says to use byte-wise modulo 100011101 arithmetic.
    // This means that when a number is 256 or larger, it should be XORed with 0x11D.
    if (x & 0x100) { // similar to x >= 256, but a lot faster (because 0x100 == 256)
      x ^= 0x11D;
    }
  }

  // Optimization: double the size of the anti-log table so that we don't need to mod 255 to
  // stay inside the bounds (because we will mainly use this table for the multiplication of
  // two GF numbers, no more).
  // @see {@link mul}
  for (let i = 255; i < 512; i++) {
    EXP_TABLE[i] = EXP_TABLE[i - 255];
  }
}());

/**
 * Returns log value of n inside Galois Field
 *
 * @param  {Number} n
 * @return {Number}
 */
galoisField.log = function log (n) {
  if (n < 1) throw new Error('log(' + n + ')')
  return LOG_TABLE[n]
};

/**
 * Returns anti-log value of n inside Galois Field
 *
 * @param  {Number} n
 * @return {Number}
 */
galoisField.exp = function exp (n) {
  return EXP_TABLE[n]
};

/**
 * Multiplies two number inside Galois Field
 *
 * @param  {Number} x
 * @param  {Number} y
 * @return {Number}
 */
galoisField.mul = function mul (x, y) {
  if (x === 0 || y === 0) return 0

  // should be EXP_TABLE[(LOG_TABLE[x] + LOG_TABLE[y]) % 255] if EXP_TABLE wasn't oversized
  // @see {@link initTables}
  return EXP_TABLE[LOG_TABLE[x] + LOG_TABLE[y]]
};

(function (exports) {
	const GF = galoisField;

	/**
	 * Multiplies two polynomials inside Galois Field
	 *
	 * @param  {Uint8Array} p1 Polynomial
	 * @param  {Uint8Array} p2 Polynomial
	 * @return {Uint8Array}    Product of p1 and p2
	 */
	exports.mul = function mul (p1, p2) {
	  const coeff = new Uint8Array(p1.length + p2.length - 1);

	  for (let i = 0; i < p1.length; i++) {
	    for (let j = 0; j < p2.length; j++) {
	      coeff[i + j] ^= GF.mul(p1[i], p2[j]);
	    }
	  }

	  return coeff
	};

	/**
	 * Calculate the remainder of polynomials division
	 *
	 * @param  {Uint8Array} divident Polynomial
	 * @param  {Uint8Array} divisor  Polynomial
	 * @return {Uint8Array}          Remainder
	 */
	exports.mod = function mod (divident, divisor) {
	  let result = new Uint8Array(divident);

	  while ((result.length - divisor.length) >= 0) {
	    const coeff = result[0];

	    for (let i = 0; i < divisor.length; i++) {
	      result[i] ^= GF.mul(divisor[i], coeff);
	    }

	    // remove all zeros from buffer head
	    let offset = 0;
	    while (offset < result.length && result[offset] === 0) offset++;
	    result = result.slice(offset);
	  }

	  return result
	};

	/**
	 * Generate an irreducible generator polynomial of specified degree
	 * (used by Reed-Solomon encoder)
	 *
	 * @param  {Number} degree Degree of the generator polynomial
	 * @return {Uint8Array}    Buffer containing polynomial coefficients
	 */
	exports.generateECPolynomial = function generateECPolynomial (degree) {
	  let poly = new Uint8Array([1]);
	  for (let i = 0; i < degree; i++) {
	    poly = exports.mul(poly, new Uint8Array([1, GF.exp(i)]));
	  }

	  return poly
	}; 
} (polynomial));

const Polynomial = polynomial;

function ReedSolomonEncoder$1 (degree) {
  this.genPoly = undefined;
  this.degree = degree;

  if (this.degree) this.initialize(this.degree);
}

/**
 * Initialize the encoder.
 * The input param should correspond to the number of error correction codewords.
 *
 * @param  {Number} degree
 */
ReedSolomonEncoder$1.prototype.initialize = function initialize (degree) {
  // create an irreducible generator polynomial
  this.degree = degree;
  this.genPoly = Polynomial.generateECPolynomial(this.degree);
};

/**
 * Encodes a chunk of data
 *
 * @param  {Uint8Array} data Buffer containing input data
 * @return {Uint8Array}      Buffer containing encoded data
 */
ReedSolomonEncoder$1.prototype.encode = function encode (data) {
  if (!this.genPoly) {
    throw new Error('Encoder not initialized')
  }

  // Calculate EC for this data block
  // extends data size to data+genPoly size
  const paddedData = new Uint8Array(data.length + this.degree);
  paddedData.set(data);

  // The error correction codewords are the remainder after dividing the data codewords
  // by a generator polynomial
  const remainder = Polynomial.mod(paddedData, this.genPoly);

  // return EC data blocks (last n byte, where n is the degree of genPoly)
  // If coefficients number in remainder are less than genPoly degree,
  // pad with 0s to the left to reach the needed number of coefficients
  const start = this.degree - remainder.length;
  if (start > 0) {
    const buff = new Uint8Array(this.degree);
    buff.set(remainder, start);

    return buff
  }

  return remainder
};

var reedSolomonEncoder = ReedSolomonEncoder$1;

var version = {};

var mode = {};

var versionCheck = {};

/**
 * Check if QR Code version is valid
 *
 * @param  {Number}  version QR Code version
 * @return {Boolean}         true if valid version, false otherwise
 */

versionCheck.isValid = function isValid (version) {
  return !isNaN(version) && version >= 1 && version <= 40
};

var regex = {};

const numeric = '[0-9]+';
const alphanumeric = '[A-Z $%*+\\-./:]+';
let kanji = '(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|' +
  '[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|' +
  '[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|' +
  '[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+';
kanji = kanji.replace(/u/g, '\\u');

const byte = '(?:(?![A-Z0-9 $%*+\\-./:]|' + kanji + ')(?:.|[\r\n]))+';

regex.KANJI = new RegExp(kanji, 'g');
regex.BYTE_KANJI = new RegExp('[^A-Z0-9 $%*+\\-./:]+', 'g');
regex.BYTE = new RegExp(byte, 'g');
regex.NUMERIC = new RegExp(numeric, 'g');
regex.ALPHANUMERIC = new RegExp(alphanumeric, 'g');

const TEST_KANJI = new RegExp('^' + kanji + '$');
const TEST_NUMERIC = new RegExp('^' + numeric + '$');
const TEST_ALPHANUMERIC = new RegExp('^[A-Z0-9 $%*+\\-./:]+$');

regex.testKanji = function testKanji (str) {
  return TEST_KANJI.test(str)
};

regex.testNumeric = function testNumeric (str) {
  return TEST_NUMERIC.test(str)
};

regex.testAlphanumeric = function testAlphanumeric (str) {
  return TEST_ALPHANUMERIC.test(str)
};

(function (exports) {
	const VersionCheck = versionCheck;
	const Regex = regex;

	/**
	 * Numeric mode encodes data from the decimal digit set (0 - 9)
	 * (byte values 30HEX to 39HEX).
	 * Normally, 3 data characters are represented by 10 bits.
	 *
	 * @type {Object}
	 */
	exports.NUMERIC = {
	  id: 'Numeric',
	  bit: 1 << 0,
	  ccBits: [10, 12, 14]
	};

	/**
	 * Alphanumeric mode encodes data from a set of 45 characters,
	 * i.e. 10 numeric digits (0 - 9),
	 *      26 alphabetic characters (A - Z),
	 *   and 9 symbols (SP, $, %, *, +, -, ., /, :).
	 * Normally, two input characters are represented by 11 bits.
	 *
	 * @type {Object}
	 */
	exports.ALPHANUMERIC = {
	  id: 'Alphanumeric',
	  bit: 1 << 1,
	  ccBits: [9, 11, 13]
	};

	/**
	 * In byte mode, data is encoded at 8 bits per character.
	 *
	 * @type {Object}
	 */
	exports.BYTE = {
	  id: 'Byte',
	  bit: 1 << 2,
	  ccBits: [8, 16, 16]
	};

	/**
	 * The Kanji mode efficiently encodes Kanji characters in accordance with
	 * the Shift JIS system based on JIS X 0208.
	 * The Shift JIS values are shifted from the JIS X 0208 values.
	 * JIS X 0208 gives details of the shift coded representation.
	 * Each two-byte character value is compacted to a 13-bit binary codeword.
	 *
	 * @type {Object}
	 */
	exports.KANJI = {
	  id: 'Kanji',
	  bit: 1 << 3,
	  ccBits: [8, 10, 12]
	};

	/**
	 * Mixed mode will contain a sequences of data in a combination of any of
	 * the modes described above
	 *
	 * @type {Object}
	 */
	exports.MIXED = {
	  bit: -1
	};

	/**
	 * Returns the number of bits needed to store the data length
	 * according to QR Code specifications.
	 *
	 * @param  {Mode}   mode    Data mode
	 * @param  {Number} version QR Code version
	 * @return {Number}         Number of bits
	 */
	exports.getCharCountIndicator = function getCharCountIndicator (mode, version) {
	  if (!mode.ccBits) throw new Error('Invalid mode: ' + mode)

	  if (!VersionCheck.isValid(version)) {
	    throw new Error('Invalid version: ' + version)
	  }

	  if (version >= 1 && version < 10) return mode.ccBits[0]
	  else if (version < 27) return mode.ccBits[1]
	  return mode.ccBits[2]
	};

	/**
	 * Returns the most efficient mode to store the specified data
	 *
	 * @param  {String} dataStr Input data string
	 * @return {Mode}           Best mode
	 */
	exports.getBestModeForData = function getBestModeForData (dataStr) {
	  if (Regex.testNumeric(dataStr)) return exports.NUMERIC
	  else if (Regex.testAlphanumeric(dataStr)) return exports.ALPHANUMERIC
	  else if (Regex.testKanji(dataStr)) return exports.KANJI
	  else return exports.BYTE
	};

	/**
	 * Return mode name as string
	 *
	 * @param {Mode} mode Mode object
	 * @returns {String}  Mode name
	 */
	exports.toString = function toString (mode) {
	  if (mode && mode.id) return mode.id
	  throw new Error('Invalid mode')
	};

	/**
	 * Check if input param is a valid mode object
	 *
	 * @param   {Mode}    mode Mode object
	 * @returns {Boolean} True if valid mode, false otherwise
	 */
	exports.isValid = function isValid (mode) {
	  return mode && mode.bit && mode.ccBits
	};

	/**
	 * Get mode object from its name
	 *
	 * @param   {String} string Mode name
	 * @returns {Mode}          Mode object
	 */
	function fromString (string) {
	  if (typeof string !== 'string') {
	    throw new Error('Param is not a string')
	  }

	  const lcStr = string.toLowerCase();

	  switch (lcStr) {
	    case 'numeric':
	      return exports.NUMERIC
	    case 'alphanumeric':
	      return exports.ALPHANUMERIC
	    case 'kanji':
	      return exports.KANJI
	    case 'byte':
	      return exports.BYTE
	    default:
	      throw new Error('Unknown mode: ' + string)
	  }
	}

	/**
	 * Returns mode from a value.
	 * If value is not a valid mode, returns defaultValue
	 *
	 * @param  {Mode|String} value        Encoding mode
	 * @param  {Mode}        defaultValue Fallback value
	 * @return {Mode}                     Encoding mode
	 */
	exports.from = function from (value, defaultValue) {
	  if (exports.isValid(value)) {
	    return value
	  }

	  try {
	    return fromString(value)
	  } catch (e) {
	    return defaultValue
	  }
	}; 
} (mode));

(function (exports) {
	const Utils = utils$1;
	const ECCode = errorCorrectionCode;
	const ECLevel = errorCorrectionLevel;
	const Mode = mode;
	const VersionCheck = versionCheck;

	// Generator polynomial used to encode version information
	const G18 = (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0);
	const G18_BCH = Utils.getBCHDigit(G18);

	function getBestVersionForDataLength (mode, length, errorCorrectionLevel) {
	  for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
	    if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel, mode)) {
	      return currentVersion
	    }
	  }

	  return undefined
	}

	function getReservedBitsCount (mode, version) {
	  // Character count indicator + mode indicator bits
	  return Mode.getCharCountIndicator(mode, version) + 4
	}

	function getTotalBitsFromDataArray (segments, version) {
	  let totalBits = 0;

	  segments.forEach(function (data) {
	    const reservedBits = getReservedBitsCount(data.mode, version);
	    totalBits += reservedBits + data.getBitsLength();
	  });

	  return totalBits
	}

	function getBestVersionForMixedData (segments, errorCorrectionLevel) {
	  for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
	    const length = getTotalBitsFromDataArray(segments, currentVersion);
	    if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel, Mode.MIXED)) {
	      return currentVersion
	    }
	  }

	  return undefined
	}

	/**
	 * Returns version number from a value.
	 * If value is not a valid version, returns defaultValue
	 *
	 * @param  {Number|String} value        QR Code version
	 * @param  {Number}        defaultValue Fallback value
	 * @return {Number}                     QR Code version number
	 */
	exports.from = function from (value, defaultValue) {
	  if (VersionCheck.isValid(value)) {
	    return parseInt(value, 10)
	  }

	  return defaultValue
	};

	/**
	 * Returns how much data can be stored with the specified QR code version
	 * and error correction level
	 *
	 * @param  {Number} version              QR Code version (1-40)
	 * @param  {Number} errorCorrectionLevel Error correction level
	 * @param  {Mode}   mode                 Data mode
	 * @return {Number}                      Quantity of storable data
	 */
	exports.getCapacity = function getCapacity (version, errorCorrectionLevel, mode) {
	  if (!VersionCheck.isValid(version)) {
	    throw new Error('Invalid QR Code version')
	  }

	  // Use Byte mode as default
	  if (typeof mode === 'undefined') mode = Mode.BYTE;

	  // Total codewords for this QR code version (Data + Error correction)
	  const totalCodewords = Utils.getSymbolTotalCodewords(version);

	  // Total number of error correction codewords
	  const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);

	  // Total number of data codewords
	  const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;

	  if (mode === Mode.MIXED) return dataTotalCodewordsBits

	  const usableBits = dataTotalCodewordsBits - getReservedBitsCount(mode, version);

	  // Return max number of storable codewords
	  switch (mode) {
	    case Mode.NUMERIC:
	      return Math.floor((usableBits / 10) * 3)

	    case Mode.ALPHANUMERIC:
	      return Math.floor((usableBits / 11) * 2)

	    case Mode.KANJI:
	      return Math.floor(usableBits / 13)

	    case Mode.BYTE:
	    default:
	      return Math.floor(usableBits / 8)
	  }
	};

	/**
	 * Returns the minimum version needed to contain the amount of data
	 *
	 * @param  {Segment} data                    Segment of data
	 * @param  {Number} [errorCorrectionLevel=H] Error correction level
	 * @param  {Mode} mode                       Data mode
	 * @return {Number}                          QR Code version
	 */
	exports.getBestVersionForData = function getBestVersionForData (data, errorCorrectionLevel) {
	  let seg;

	  const ecl = ECLevel.from(errorCorrectionLevel, ECLevel.M);

	  if (Array.isArray(data)) {
	    if (data.length > 1) {
	      return getBestVersionForMixedData(data, ecl)
	    }

	    if (data.length === 0) {
	      return 1
	    }

	    seg = data[0];
	  } else {
	    seg = data;
	  }

	  return getBestVersionForDataLength(seg.mode, seg.getLength(), ecl)
	};

	/**
	 * Returns version information with relative error correction bits
	 *
	 * The version information is included in QR Code symbols of version 7 or larger.
	 * It consists of an 18-bit sequence containing 6 data bits,
	 * with 12 error correction bits calculated using the (18, 6) Golay code.
	 *
	 * @param  {Number} version QR Code version
	 * @return {Number}         Encoded version info bits
	 */
	exports.getEncodedBits = function getEncodedBits (version) {
	  if (!VersionCheck.isValid(version) || version < 7) {
	    throw new Error('Invalid QR Code version')
	  }

	  let d = version << 12;

	  while (Utils.getBCHDigit(d) - G18_BCH >= 0) {
	    d ^= (G18 << (Utils.getBCHDigit(d) - G18_BCH));
	  }

	  return (version << 12) | d
	}; 
} (version));

var formatInfo = {};

const Utils$3 = utils$1;

const G15 = (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0);
const G15_MASK = (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1);
const G15_BCH = Utils$3.getBCHDigit(G15);

/**
 * Returns format information with relative error correction bits
 *
 * The format information is a 15-bit sequence containing 5 data bits,
 * with 10 error correction bits calculated using the (15, 5) BCH code.
 *
 * @param  {Number} errorCorrectionLevel Error correction level
 * @param  {Number} mask                 Mask pattern
 * @return {Number}                      Encoded format information bits
 */
formatInfo.getEncodedBits = function getEncodedBits (errorCorrectionLevel, mask) {
  const data = ((errorCorrectionLevel.bit << 3) | mask);
  let d = data << 10;

  while (Utils$3.getBCHDigit(d) - G15_BCH >= 0) {
    d ^= (G15 << (Utils$3.getBCHDigit(d) - G15_BCH));
  }

  // xor final data with mask pattern in order to ensure that
  // no combination of Error Correction Level and data mask pattern
  // will result in an all-zero data string
  return ((data << 10) | d) ^ G15_MASK
};

var segments = {};

const Mode$4 = mode;

function NumericData (data) {
  this.mode = Mode$4.NUMERIC;
  this.data = data.toString();
}

NumericData.getBitsLength = function getBitsLength (length) {
  return 10 * Math.floor(length / 3) + ((length % 3) ? ((length % 3) * 3 + 1) : 0)
};

NumericData.prototype.getLength = function getLength () {
  return this.data.length
};

NumericData.prototype.getBitsLength = function getBitsLength () {
  return NumericData.getBitsLength(this.data.length)
};

NumericData.prototype.write = function write (bitBuffer) {
  let i, group, value;

  // The input data string is divided into groups of three digits,
  // and each group is converted to its 10-bit binary equivalent.
  for (i = 0; i + 3 <= this.data.length; i += 3) {
    group = this.data.substr(i, 3);
    value = parseInt(group, 10);

    bitBuffer.put(value, 10);
  }

  // If the number of input digits is not an exact multiple of three,
  // the final one or two digits are converted to 4 or 7 bits respectively.
  const remainingNum = this.data.length - i;
  if (remainingNum > 0) {
    group = this.data.substr(i);
    value = parseInt(group, 10);

    bitBuffer.put(value, remainingNum * 3 + 1);
  }
};

var numericData = NumericData;

const Mode$3 = mode;

/**
 * Array of characters available in alphanumeric mode
 *
 * As per QR Code specification, to each character
 * is assigned a value from 0 to 44 which in this case coincides
 * with the array index
 *
 * @type {Array}
 */
const ALPHA_NUM_CHARS = [
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
  ' ', '$', '%', '*', '+', '-', '.', '/', ':'
];

function AlphanumericData (data) {
  this.mode = Mode$3.ALPHANUMERIC;
  this.data = data;
}

AlphanumericData.getBitsLength = function getBitsLength (length) {
  return 11 * Math.floor(length / 2) + 6 * (length % 2)
};

AlphanumericData.prototype.getLength = function getLength () {
  return this.data.length
};

AlphanumericData.prototype.getBitsLength = function getBitsLength () {
  return AlphanumericData.getBitsLength(this.data.length)
};

AlphanumericData.prototype.write = function write (bitBuffer) {
  let i;

  // Input data characters are divided into groups of two characters
  // and encoded as 11-bit binary codes.
  for (i = 0; i + 2 <= this.data.length; i += 2) {
    // The character value of the first character is multiplied by 45
    let value = ALPHA_NUM_CHARS.indexOf(this.data[i]) * 45;

    // The character value of the second digit is added to the product
    value += ALPHA_NUM_CHARS.indexOf(this.data[i + 1]);

    // The sum is then stored as 11-bit binary number
    bitBuffer.put(value, 11);
  }

  // If the number of input data characters is not a multiple of two,
  // the character value of the final character is encoded as a 6-bit binary number.
  if (this.data.length % 2) {
    bitBuffer.put(ALPHA_NUM_CHARS.indexOf(this.data[i]), 6);
  }
};

var alphanumericData = AlphanumericData;

const Mode$2 = mode;

function ByteData (data) {
  this.mode = Mode$2.BYTE;
  if (typeof (data) === 'string') {
    this.data = new TextEncoder().encode(data);
  } else {
    this.data = new Uint8Array(data);
  }
}

ByteData.getBitsLength = function getBitsLength (length) {
  return length * 8
};

ByteData.prototype.getLength = function getLength () {
  return this.data.length
};

ByteData.prototype.getBitsLength = function getBitsLength () {
  return ByteData.getBitsLength(this.data.length)
};

ByteData.prototype.write = function (bitBuffer) {
  for (let i = 0, l = this.data.length; i < l; i++) {
    bitBuffer.put(this.data[i], 8);
  }
};

var byteData = ByteData;

const Mode$1 = mode;
const Utils$2 = utils$1;

function KanjiData (data) {
  this.mode = Mode$1.KANJI;
  this.data = data;
}

KanjiData.getBitsLength = function getBitsLength (length) {
  return length * 13
};

KanjiData.prototype.getLength = function getLength () {
  return this.data.length
};

KanjiData.prototype.getBitsLength = function getBitsLength () {
  return KanjiData.getBitsLength(this.data.length)
};

KanjiData.prototype.write = function (bitBuffer) {
  let i;

  // In the Shift JIS system, Kanji characters are represented by a two byte combination.
  // These byte values are shifted from the JIS X 0208 values.
  // JIS X 0208 gives details of the shift coded representation.
  for (i = 0; i < this.data.length; i++) {
    let value = Utils$2.toSJIS(this.data[i]);

    // For characters with Shift JIS values from 0x8140 to 0x9FFC:
    if (value >= 0x8140 && value <= 0x9FFC) {
      // Subtract 0x8140 from Shift JIS value
      value -= 0x8140;

    // For characters with Shift JIS values from 0xE040 to 0xEBBF
    } else if (value >= 0xE040 && value <= 0xEBBF) {
      // Subtract 0xC140 from Shift JIS value
      value -= 0xC140;
    } else {
      throw new Error(
        'Invalid SJIS character: ' + this.data[i] + '\n' +
        'Make sure your charset is UTF-8')
    }

    // Multiply most significant byte of result by 0xC0
    // and add least significant byte to product
    value = (((value >>> 8) & 0xff) * 0xC0) + (value & 0xff);

    // Convert result to a 13-bit binary string
    bitBuffer.put(value, 13);
  }
};

var kanjiData = KanjiData;

var dijkstra = {exports: {}};

(function (module) {

	/******************************************************************************
	 * Created 2008-08-19.
	 *
	 * Dijkstra path-finding functions. Adapted from the Dijkstar Python project.
	 *
	 * Copyright (C) 2008
	 *   Wyatt Baldwin <self@wyattbaldwin.com>
	 *   All rights reserved
	 *
	 * Licensed under the MIT license.
	 *
	 *   http://www.opensource.org/licenses/mit-license.php
	 *
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	 * THE SOFTWARE.
	 *****************************************************************************/
	var dijkstra = {
	  single_source_shortest_paths: function(graph, s, d) {
	    // Predecessor map for each node that has been encountered.
	    // node ID => predecessor node ID
	    var predecessors = {};

	    // Costs of shortest paths from s to all nodes encountered.
	    // node ID => cost
	    var costs = {};
	    costs[s] = 0;

	    // Costs of shortest paths from s to all nodes encountered; differs from
	    // `costs` in that it provides easy access to the node that currently has
	    // the known shortest path from s.
	    // XXX: Do we actually need both `costs` and `open`?
	    var open = dijkstra.PriorityQueue.make();
	    open.push(s, 0);

	    var closest,
	        u, v,
	        cost_of_s_to_u,
	        adjacent_nodes,
	        cost_of_e,
	        cost_of_s_to_u_plus_cost_of_e,
	        cost_of_s_to_v,
	        first_visit;
	    while (!open.empty()) {
	      // In the nodes remaining in graph that have a known cost from s,
	      // find the node, u, that currently has the shortest path from s.
	      closest = open.pop();
	      u = closest.value;
	      cost_of_s_to_u = closest.cost;

	      // Get nodes adjacent to u...
	      adjacent_nodes = graph[u] || {};

	      // ...and explore the edges that connect u to those nodes, updating
	      // the cost of the shortest paths to any or all of those nodes as
	      // necessary. v is the node across the current edge from u.
	      for (v in adjacent_nodes) {
	        if (adjacent_nodes.hasOwnProperty(v)) {
	          // Get the cost of the edge running from u to v.
	          cost_of_e = adjacent_nodes[v];

	          // Cost of s to u plus the cost of u to v across e--this is *a*
	          // cost from s to v that may or may not be less than the current
	          // known cost to v.
	          cost_of_s_to_u_plus_cost_of_e = cost_of_s_to_u + cost_of_e;

	          // If we haven't visited v yet OR if the current known cost from s to
	          // v is greater than the new cost we just found (cost of s to u plus
	          // cost of u to v across e), update v's cost in the cost list and
	          // update v's predecessor in the predecessor list (it's now u).
	          cost_of_s_to_v = costs[v];
	          first_visit = (typeof costs[v] === 'undefined');
	          if (first_visit || cost_of_s_to_v > cost_of_s_to_u_plus_cost_of_e) {
	            costs[v] = cost_of_s_to_u_plus_cost_of_e;
	            open.push(v, cost_of_s_to_u_plus_cost_of_e);
	            predecessors[v] = u;
	          }
	        }
	      }
	    }

	    if (typeof d !== 'undefined' && typeof costs[d] === 'undefined') {
	      var msg = ['Could not find a path from ', s, ' to ', d, '.'].join('');
	      throw new Error(msg);
	    }

	    return predecessors;
	  },

	  extract_shortest_path_from_predecessor_list: function(predecessors, d) {
	    var nodes = [];
	    var u = d;
	    while (u) {
	      nodes.push(u);
	      predecessors[u];
	      u = predecessors[u];
	    }
	    nodes.reverse();
	    return nodes;
	  },

	  find_path: function(graph, s, d) {
	    var predecessors = dijkstra.single_source_shortest_paths(graph, s, d);
	    return dijkstra.extract_shortest_path_from_predecessor_list(
	      predecessors, d);
	  },

	  /**
	   * A very naive priority queue implementation.
	   */
	  PriorityQueue: {
	    make: function (opts) {
	      var T = dijkstra.PriorityQueue,
	          t = {},
	          key;
	      opts = opts || {};
	      for (key in T) {
	        if (T.hasOwnProperty(key)) {
	          t[key] = T[key];
	        }
	      }
	      t.queue = [];
	      t.sorter = opts.sorter || T.default_sorter;
	      return t;
	    },

	    default_sorter: function (a, b) {
	      return a.cost - b.cost;
	    },

	    /**
	     * Add a new item to the queue and ensure the highest priority element
	     * is at the front of the queue.
	     */
	    push: function (value, cost) {
	      var item = {value: value, cost: cost};
	      this.queue.push(item);
	      this.queue.sort(this.sorter);
	    },

	    /**
	     * Return the highest priority element in the queue.
	     */
	    pop: function () {
	      return this.queue.shift();
	    },

	    empty: function () {
	      return this.queue.length === 0;
	    }
	  }
	};


	// node.js module exports
	{
	  module.exports = dijkstra;
	} 
} (dijkstra));

var dijkstraExports = dijkstra.exports;

(function (exports) {
	const Mode = mode;
	const NumericData = numericData;
	const AlphanumericData = alphanumericData;
	const ByteData = byteData;
	const KanjiData = kanjiData;
	const Regex = regex;
	const Utils = utils$1;
	const dijkstra = dijkstraExports;

	/**
	 * Returns UTF8 byte length
	 *
	 * @param  {String} str Input string
	 * @return {Number}     Number of byte
	 */
	function getStringByteLength (str) {
	  return unescape(encodeURIComponent(str)).length
	}

	/**
	 * Get a list of segments of the specified mode
	 * from a string
	 *
	 * @param  {Mode}   mode Segment mode
	 * @param  {String} str  String to process
	 * @return {Array}       Array of object with segments data
	 */
	function getSegments (regex, mode, str) {
	  const segments = [];
	  let result;

	  while ((result = regex.exec(str)) !== null) {
	    segments.push({
	      data: result[0],
	      index: result.index,
	      mode: mode,
	      length: result[0].length
	    });
	  }

	  return segments
	}

	/**
	 * Extracts a series of segments with the appropriate
	 * modes from a string
	 *
	 * @param  {String} dataStr Input string
	 * @return {Array}          Array of object with segments data
	 */
	function getSegmentsFromString (dataStr) {
	  const numSegs = getSegments(Regex.NUMERIC, Mode.NUMERIC, dataStr);
	  const alphaNumSegs = getSegments(Regex.ALPHANUMERIC, Mode.ALPHANUMERIC, dataStr);
	  let byteSegs;
	  let kanjiSegs;

	  if (Utils.isKanjiModeEnabled()) {
	    byteSegs = getSegments(Regex.BYTE, Mode.BYTE, dataStr);
	    kanjiSegs = getSegments(Regex.KANJI, Mode.KANJI, dataStr);
	  } else {
	    byteSegs = getSegments(Regex.BYTE_KANJI, Mode.BYTE, dataStr);
	    kanjiSegs = [];
	  }

	  const segs = numSegs.concat(alphaNumSegs, byteSegs, kanjiSegs);

	  return segs
	    .sort(function (s1, s2) {
	      return s1.index - s2.index
	    })
	    .map(function (obj) {
	      return {
	        data: obj.data,
	        mode: obj.mode,
	        length: obj.length
	      }
	    })
	}

	/**
	 * Returns how many bits are needed to encode a string of
	 * specified length with the specified mode
	 *
	 * @param  {Number} length String length
	 * @param  {Mode} mode     Segment mode
	 * @return {Number}        Bit length
	 */
	function getSegmentBitsLength (length, mode) {
	  switch (mode) {
	    case Mode.NUMERIC:
	      return NumericData.getBitsLength(length)
	    case Mode.ALPHANUMERIC:
	      return AlphanumericData.getBitsLength(length)
	    case Mode.KANJI:
	      return KanjiData.getBitsLength(length)
	    case Mode.BYTE:
	      return ByteData.getBitsLength(length)
	  }
	}

	/**
	 * Merges adjacent segments which have the same mode
	 *
	 * @param  {Array} segs Array of object with segments data
	 * @return {Array}      Array of object with segments data
	 */
	function mergeSegments (segs) {
	  return segs.reduce(function (acc, curr) {
	    const prevSeg = acc.length - 1 >= 0 ? acc[acc.length - 1] : null;
	    if (prevSeg && prevSeg.mode === curr.mode) {
	      acc[acc.length - 1].data += curr.data;
	      return acc
	    }

	    acc.push(curr);
	    return acc
	  }, [])
	}

	/**
	 * Generates a list of all possible nodes combination which
	 * will be used to build a segments graph.
	 *
	 * Nodes are divided by groups. Each group will contain a list of all the modes
	 * in which is possible to encode the given text.
	 *
	 * For example the text '12345' can be encoded as Numeric, Alphanumeric or Byte.
	 * The group for '12345' will contain then 3 objects, one for each
	 * possible encoding mode.
	 *
	 * Each node represents a possible segment.
	 *
	 * @param  {Array} segs Array of object with segments data
	 * @return {Array}      Array of object with segments data
	 */
	function buildNodes (segs) {
	  const nodes = [];
	  for (let i = 0; i < segs.length; i++) {
	    const seg = segs[i];

	    switch (seg.mode) {
	      case Mode.NUMERIC:
	        nodes.push([seg,
	          { data: seg.data, mode: Mode.ALPHANUMERIC, length: seg.length },
	          { data: seg.data, mode: Mode.BYTE, length: seg.length }
	        ]);
	        break
	      case Mode.ALPHANUMERIC:
	        nodes.push([seg,
	          { data: seg.data, mode: Mode.BYTE, length: seg.length }
	        ]);
	        break
	      case Mode.KANJI:
	        nodes.push([seg,
	          { data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data) }
	        ]);
	        break
	      case Mode.BYTE:
	        nodes.push([
	          { data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data) }
	        ]);
	    }
	  }

	  return nodes
	}

	/**
	 * Builds a graph from a list of nodes.
	 * All segments in each node group will be connected with all the segments of
	 * the next group and so on.
	 *
	 * At each connection will be assigned a weight depending on the
	 * segment's byte length.
	 *
	 * @param  {Array} nodes    Array of object with segments data
	 * @param  {Number} version QR Code version
	 * @return {Object}         Graph of all possible segments
	 */
	function buildGraph (nodes, version) {
	  const table = {};
	  const graph = { start: {} };
	  let prevNodeIds = ['start'];

	  for (let i = 0; i < nodes.length; i++) {
	    const nodeGroup = nodes[i];
	    const currentNodeIds = [];

	    for (let j = 0; j < nodeGroup.length; j++) {
	      const node = nodeGroup[j];
	      const key = '' + i + j;

	      currentNodeIds.push(key);
	      table[key] = { node: node, lastCount: 0 };
	      graph[key] = {};

	      for (let n = 0; n < prevNodeIds.length; n++) {
	        const prevNodeId = prevNodeIds[n];

	        if (table[prevNodeId] && table[prevNodeId].node.mode === node.mode) {
	          graph[prevNodeId][key] =
	            getSegmentBitsLength(table[prevNodeId].lastCount + node.length, node.mode) -
	            getSegmentBitsLength(table[prevNodeId].lastCount, node.mode);

	          table[prevNodeId].lastCount += node.length;
	        } else {
	          if (table[prevNodeId]) table[prevNodeId].lastCount = node.length;

	          graph[prevNodeId][key] = getSegmentBitsLength(node.length, node.mode) +
	            4 + Mode.getCharCountIndicator(node.mode, version); // switch cost
	        }
	      }
	    }

	    prevNodeIds = currentNodeIds;
	  }

	  for (let n = 0; n < prevNodeIds.length; n++) {
	    graph[prevNodeIds[n]].end = 0;
	  }

	  return { map: graph, table: table }
	}

	/**
	 * Builds a segment from a specified data and mode.
	 * If a mode is not specified, the more suitable will be used.
	 *
	 * @param  {String} data             Input data
	 * @param  {Mode | String} modesHint Data mode
	 * @return {Segment}                 Segment
	 */
	function buildSingleSegment (data, modesHint) {
	  let mode;
	  const bestMode = Mode.getBestModeForData(data);

	  mode = Mode.from(modesHint, bestMode);

	  // Make sure data can be encoded
	  if (mode !== Mode.BYTE && mode.bit < bestMode.bit) {
	    throw new Error('"' + data + '"' +
	      ' cannot be encoded with mode ' + Mode.toString(mode) +
	      '.\n Suggested mode is: ' + Mode.toString(bestMode))
	  }

	  // Use Mode.BYTE if Kanji support is disabled
	  if (mode === Mode.KANJI && !Utils.isKanjiModeEnabled()) {
	    mode = Mode.BYTE;
	  }

	  switch (mode) {
	    case Mode.NUMERIC:
	      return new NumericData(data)

	    case Mode.ALPHANUMERIC:
	      return new AlphanumericData(data)

	    case Mode.KANJI:
	      return new KanjiData(data)

	    case Mode.BYTE:
	      return new ByteData(data)
	  }
	}

	/**
	 * Builds a list of segments from an array.
	 * Array can contain Strings or Objects with segment's info.
	 *
	 * For each item which is a string, will be generated a segment with the given
	 * string and the more appropriate encoding mode.
	 *
	 * For each item which is an object, will be generated a segment with the given
	 * data and mode.
	 * Objects must contain at least the property "data".
	 * If property "mode" is not present, the more suitable mode will be used.
	 *
	 * @param  {Array} array Array of objects with segments data
	 * @return {Array}       Array of Segments
	 */
	exports.fromArray = function fromArray (array) {
	  return array.reduce(function (acc, seg) {
	    if (typeof seg === 'string') {
	      acc.push(buildSingleSegment(seg, null));
	    } else if (seg.data) {
	      acc.push(buildSingleSegment(seg.data, seg.mode));
	    }

	    return acc
	  }, [])
	};

	/**
	 * Builds an optimized sequence of segments from a string,
	 * which will produce the shortest possible bitstream.
	 *
	 * @param  {String} data    Input string
	 * @param  {Number} version QR Code version
	 * @return {Array}          Array of segments
	 */
	exports.fromString = function fromString (data, version) {
	  const segs = getSegmentsFromString(data, Utils.isKanjiModeEnabled());

	  const nodes = buildNodes(segs);
	  const graph = buildGraph(nodes, version);
	  const path = dijkstra.find_path(graph.map, 'start', 'end');

	  const optimizedSegs = [];
	  for (let i = 1; i < path.length - 1; i++) {
	    optimizedSegs.push(graph.table[path[i]].node);
	  }

	  return exports.fromArray(mergeSegments(optimizedSegs))
	};

	/**
	 * Splits a string in various segments with the modes which
	 * best represent their content.
	 * The produced segments are far from being optimized.
	 * The output of this function is only used to estimate a QR Code version
	 * which may contain the data.
	 *
	 * @param  {string} data Input string
	 * @return {Array}       Array of segments
	 */
	exports.rawSplit = function rawSplit (data) {
	  return exports.fromArray(
	    getSegmentsFromString(data, Utils.isKanjiModeEnabled())
	  )
	}; 
} (segments));

const Utils$1 = utils$1;
const ECLevel = errorCorrectionLevel;
const BitBuffer = bitBuffer;
const BitMatrix = bitMatrix;
const AlignmentPattern = alignmentPattern;
const FinderPattern = finderPattern;
const MaskPattern = maskPattern;
const ECCode = errorCorrectionCode;
const ReedSolomonEncoder = reedSolomonEncoder;
const Version = version;
const FormatInfo = formatInfo;
const Mode = mode;
const Segments = segments;

/**
 * QRCode for JavaScript
 *
 * modified by Ryan Day for nodejs support
 * Copyright (c) 2011 Ryan Day
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
//---------------------------------------------------------------------
// QRCode for JavaScript
//
// Copyright (c) 2009 Kazuhiko Arase
//
// URL: http://www.d-project.com/
//
// Licensed under the MIT license:
//   http://www.opensource.org/licenses/mit-license.php
//
// The word "QR Code" is registered trademark of
// DENSO WAVE INCORPORATED
//   http://www.denso-wave.com/qrcode/faqpatent-e.html
//
//---------------------------------------------------------------------
*/

/**
 * Add finder patterns bits to matrix
 *
 * @param  {BitMatrix} matrix  Modules matrix
 * @param  {Number}    version QR Code version
 */
function setupFinderPattern (matrix, version) {
  const size = matrix.size;
  const pos = FinderPattern.getPositions(version);

  for (let i = 0; i < pos.length; i++) {
    const row = pos[i][0];
    const col = pos[i][1];

    for (let r = -1; r <= 7; r++) {
      if (row + r <= -1 || size <= row + r) continue

      for (let c = -1; c <= 7; c++) {
        if (col + c <= -1 || size <= col + c) continue

        if ((r >= 0 && r <= 6 && (c === 0 || c === 6)) ||
          (c >= 0 && c <= 6 && (r === 0 || r === 6)) ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
          matrix.set(row + r, col + c, true, true);
        } else {
          matrix.set(row + r, col + c, false, true);
        }
      }
    }
  }
}

/**
 * Add timing pattern bits to matrix
 *
 * Note: this function must be called before {@link setupAlignmentPattern}
 *
 * @param  {BitMatrix} matrix Modules matrix
 */
function setupTimingPattern (matrix) {
  const size = matrix.size;

  for (let r = 8; r < size - 8; r++) {
    const value = r % 2 === 0;
    matrix.set(r, 6, value, true);
    matrix.set(6, r, value, true);
  }
}

/**
 * Add alignment patterns bits to matrix
 *
 * Note: this function must be called after {@link setupTimingPattern}
 *
 * @param  {BitMatrix} matrix  Modules matrix
 * @param  {Number}    version QR Code version
 */
function setupAlignmentPattern (matrix, version) {
  const pos = AlignmentPattern.getPositions(version);

  for (let i = 0; i < pos.length; i++) {
    const row = pos[i][0];
    const col = pos[i][1];

    for (let r = -2; r <= 2; r++) {
      for (let c = -2; c <= 2; c++) {
        if (r === -2 || r === 2 || c === -2 || c === 2 ||
          (r === 0 && c === 0)) {
          matrix.set(row + r, col + c, true, true);
        } else {
          matrix.set(row + r, col + c, false, true);
        }
      }
    }
  }
}

/**
 * Add version info bits to matrix
 *
 * @param  {BitMatrix} matrix  Modules matrix
 * @param  {Number}    version QR Code version
 */
function setupVersionInfo (matrix, version) {
  const size = matrix.size;
  const bits = Version.getEncodedBits(version);
  let row, col, mod;

  for (let i = 0; i < 18; i++) {
    row = Math.floor(i / 3);
    col = i % 3 + size - 8 - 3;
    mod = ((bits >> i) & 1) === 1;

    matrix.set(row, col, mod, true);
    matrix.set(col, row, mod, true);
  }
}

/**
 * Add format info bits to matrix
 *
 * @param  {BitMatrix} matrix               Modules matrix
 * @param  {ErrorCorrectionLevel}    errorCorrectionLevel Error correction level
 * @param  {Number}    maskPattern          Mask pattern reference value
 */
function setupFormatInfo (matrix, errorCorrectionLevel, maskPattern) {
  const size = matrix.size;
  const bits = FormatInfo.getEncodedBits(errorCorrectionLevel, maskPattern);
  let i, mod;

  for (i = 0; i < 15; i++) {
    mod = ((bits >> i) & 1) === 1;

    // vertical
    if (i < 6) {
      matrix.set(i, 8, mod, true);
    } else if (i < 8) {
      matrix.set(i + 1, 8, mod, true);
    } else {
      matrix.set(size - 15 + i, 8, mod, true);
    }

    // horizontal
    if (i < 8) {
      matrix.set(8, size - i - 1, mod, true);
    } else if (i < 9) {
      matrix.set(8, 15 - i - 1 + 1, mod, true);
    } else {
      matrix.set(8, 15 - i - 1, mod, true);
    }
  }

  // fixed module
  matrix.set(size - 8, 8, 1, true);
}

/**
 * Add encoded data bits to matrix
 *
 * @param  {BitMatrix}  matrix Modules matrix
 * @param  {Uint8Array} data   Data codewords
 */
function setupData (matrix, data) {
  const size = matrix.size;
  let inc = -1;
  let row = size - 1;
  let bitIndex = 7;
  let byteIndex = 0;

  for (let col = size - 1; col > 0; col -= 2) {
    if (col === 6) col--;

    while (true) {
      for (let c = 0; c < 2; c++) {
        if (!matrix.isReserved(row, col - c)) {
          let dark = false;

          if (byteIndex < data.length) {
            dark = (((data[byteIndex] >>> bitIndex) & 1) === 1);
          }

          matrix.set(row, col - c, dark);
          bitIndex--;

          if (bitIndex === -1) {
            byteIndex++;
            bitIndex = 7;
          }
        }
      }

      row += inc;

      if (row < 0 || size <= row) {
        row -= inc;
        inc = -inc;
        break
      }
    }
  }
}

/**
 * Create encoded codewords from data input
 *
 * @param  {Number}   version              QR Code version
 * @param  {ErrorCorrectionLevel}   errorCorrectionLevel Error correction level
 * @param  {ByteData} data                 Data input
 * @return {Uint8Array}                    Buffer containing encoded codewords
 */
function createData (version, errorCorrectionLevel, segments) {
  // Prepare data buffer
  const buffer = new BitBuffer();

  segments.forEach(function (data) {
    // prefix data with mode indicator (4 bits)
    buffer.put(data.mode.bit, 4);

    // Prefix data with character count indicator.
    // The character count indicator is a string of bits that represents the
    // number of characters that are being encoded.
    // The character count indicator must be placed after the mode indicator
    // and must be a certain number of bits long, depending on the QR version
    // and data mode
    // @see {@link Mode.getCharCountIndicator}.
    buffer.put(data.getLength(), Mode.getCharCountIndicator(data.mode, version));

    // add binary data sequence to buffer
    data.write(buffer);
  });

  // Calculate required number of bits
  const totalCodewords = Utils$1.getSymbolTotalCodewords(version);
  const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);
  const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;

  // Add a terminator.
  // If the bit string is shorter than the total number of required bits,
  // a terminator of up to four 0s must be added to the right side of the string.
  // If the bit string is more than four bits shorter than the required number of bits,
  // add four 0s to the end.
  if (buffer.getLengthInBits() + 4 <= dataTotalCodewordsBits) {
    buffer.put(0, 4);
  }

  // If the bit string is fewer than four bits shorter, add only the number of 0s that
  // are needed to reach the required number of bits.

  // After adding the terminator, if the number of bits in the string is not a multiple of 8,
  // pad the string on the right with 0s to make the string's length a multiple of 8.
  while (buffer.getLengthInBits() % 8 !== 0) {
    buffer.putBit(0);
  }

  // Add pad bytes if the string is still shorter than the total number of required bits.
  // Extend the buffer to fill the data capacity of the symbol corresponding to
  // the Version and Error Correction Level by adding the Pad Codewords 11101100 (0xEC)
  // and 00010001 (0x11) alternately.
  const remainingByte = (dataTotalCodewordsBits - buffer.getLengthInBits()) / 8;
  for (let i = 0; i < remainingByte; i++) {
    buffer.put(i % 2 ? 0x11 : 0xEC, 8);
  }

  return createCodewords(buffer, version, errorCorrectionLevel)
}

/**
 * Encode input data with Reed-Solomon and return codewords with
 * relative error correction bits
 *
 * @param  {BitBuffer} bitBuffer            Data to encode
 * @param  {Number}    version              QR Code version
 * @param  {ErrorCorrectionLevel} errorCorrectionLevel Error correction level
 * @return {Uint8Array}                     Buffer containing encoded codewords
 */
function createCodewords (bitBuffer, version, errorCorrectionLevel) {
  // Total codewords for this QR code version (Data + Error correction)
  const totalCodewords = Utils$1.getSymbolTotalCodewords(version);

  // Total number of error correction codewords
  const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);

  // Total number of data codewords
  const dataTotalCodewords = totalCodewords - ecTotalCodewords;

  // Total number of blocks
  const ecTotalBlocks = ECCode.getBlocksCount(version, errorCorrectionLevel);

  // Calculate how many blocks each group should contain
  const blocksInGroup2 = totalCodewords % ecTotalBlocks;
  const blocksInGroup1 = ecTotalBlocks - blocksInGroup2;

  const totalCodewordsInGroup1 = Math.floor(totalCodewords / ecTotalBlocks);

  const dataCodewordsInGroup1 = Math.floor(dataTotalCodewords / ecTotalBlocks);
  const dataCodewordsInGroup2 = dataCodewordsInGroup1 + 1;

  // Number of EC codewords is the same for both groups
  const ecCount = totalCodewordsInGroup1 - dataCodewordsInGroup1;

  // Initialize a Reed-Solomon encoder with a generator polynomial of degree ecCount
  const rs = new ReedSolomonEncoder(ecCount);

  let offset = 0;
  const dcData = new Array(ecTotalBlocks);
  const ecData = new Array(ecTotalBlocks);
  let maxDataSize = 0;
  const buffer = new Uint8Array(bitBuffer.buffer);

  // Divide the buffer into the required number of blocks
  for (let b = 0; b < ecTotalBlocks; b++) {
    const dataSize = b < blocksInGroup1 ? dataCodewordsInGroup1 : dataCodewordsInGroup2;

    // extract a block of data from buffer
    dcData[b] = buffer.slice(offset, offset + dataSize);

    // Calculate EC codewords for this data block
    ecData[b] = rs.encode(dcData[b]);

    offset += dataSize;
    maxDataSize = Math.max(maxDataSize, dataSize);
  }

  // Create final data
  // Interleave the data and error correction codewords from each block
  const data = new Uint8Array(totalCodewords);
  let index = 0;
  let i, r;

  // Add data codewords
  for (i = 0; i < maxDataSize; i++) {
    for (r = 0; r < ecTotalBlocks; r++) {
      if (i < dcData[r].length) {
        data[index++] = dcData[r][i];
      }
    }
  }

  // Apped EC codewords
  for (i = 0; i < ecCount; i++) {
    for (r = 0; r < ecTotalBlocks; r++) {
      data[index++] = ecData[r][i];
    }
  }

  return data
}

/**
 * Build QR Code symbol
 *
 * @param  {String} data                 Input string
 * @param  {Number} version              QR Code version
 * @param  {ErrorCorretionLevel} errorCorrectionLevel Error level
 * @param  {MaskPattern} maskPattern     Mask pattern
 * @return {Object}                      Object containing symbol data
 */
function createSymbol (data, version, errorCorrectionLevel, maskPattern) {
  let segments;

  if (Array.isArray(data)) {
    segments = Segments.fromArray(data);
  } else if (typeof data === 'string') {
    let estimatedVersion = version;

    if (!estimatedVersion) {
      const rawSegments = Segments.rawSplit(data);

      // Estimate best version that can contain raw splitted segments
      estimatedVersion = Version.getBestVersionForData(rawSegments, errorCorrectionLevel);
    }

    // Build optimized segments
    // If estimated version is undefined, try with the highest version
    segments = Segments.fromString(data, estimatedVersion || 40);
  } else {
    throw new Error('Invalid data')
  }

  // Get the min version that can contain data
  const bestVersion = Version.getBestVersionForData(segments, errorCorrectionLevel);

  // If no version is found, data cannot be stored
  if (!bestVersion) {
    throw new Error('The amount of data is too big to be stored in a QR Code')
  }

  // If not specified, use min version as default
  if (!version) {
    version = bestVersion;

  // Check if the specified version can contain the data
  } else if (version < bestVersion) {
    throw new Error('\n' +
      'The chosen QR Code version cannot contain this amount of data.\n' +
      'Minimum version required to store current data is: ' + bestVersion + '.\n'
    )
  }

  const dataBits = createData(version, errorCorrectionLevel, segments);

  // Allocate matrix buffer
  const moduleCount = Utils$1.getSymbolSize(version);
  const modules = new BitMatrix(moduleCount);

  // Add function modules
  setupFinderPattern(modules, version);
  setupTimingPattern(modules);
  setupAlignmentPattern(modules, version);

  // Add temporary dummy bits for format info just to set them as reserved.
  // This is needed to prevent these bits from being masked by {@link MaskPattern.applyMask}
  // since the masking operation must be performed only on the encoding region.
  // These blocks will be replaced with correct values later in code.
  setupFormatInfo(modules, errorCorrectionLevel, 0);

  if (version >= 7) {
    setupVersionInfo(modules, version);
  }

  // Add data codewords
  setupData(modules, dataBits);

  if (isNaN(maskPattern)) {
    // Find best mask pattern
    maskPattern = MaskPattern.getBestMask(modules,
      setupFormatInfo.bind(null, modules, errorCorrectionLevel));
  }

  // Apply mask pattern
  MaskPattern.applyMask(maskPattern, modules);

  // Replace format info bits with correct values
  setupFormatInfo(modules, errorCorrectionLevel, maskPattern);

  return {
    modules: modules,
    version: version,
    errorCorrectionLevel: errorCorrectionLevel,
    maskPattern: maskPattern,
    segments: segments
  }
}

/**
 * QR Code
 *
 * @param {String | Array} data                 Input data
 * @param {Object} options                      Optional configurations
 * @param {Number} options.version              QR Code version
 * @param {String} options.errorCorrectionLevel Error correction level
 * @param {Function} options.toSJISFunc         Helper func to convert utf8 to sjis
 */
qrcode.create = function create (data, options) {
  if (typeof data === 'undefined' || data === '') {
    throw new Error('No input text')
  }

  let errorCorrectionLevel = ECLevel.M;
  let version;
  let mask;

  if (typeof options !== 'undefined') {
    // Use higher error correction level as default
    errorCorrectionLevel = ECLevel.from(options.errorCorrectionLevel, ECLevel.M);
    version = Version.from(options.version);
    mask = MaskPattern.from(options.maskPattern);

    if (options.toSJISFunc) {
      Utils$1.setToSJISFunction(options.toSJISFunc);
    }
  }

  return createSymbol(data, version, errorCorrectionLevel, mask)
};

var canvas = {};

var utils = {};

(function (exports) {
	function hex2rgba (hex) {
	  if (typeof hex === 'number') {
	    hex = hex.toString();
	  }

	  if (typeof hex !== 'string') {
	    throw new Error('Color should be defined as hex string')
	  }

	  let hexCode = hex.slice().replace('#', '').split('');
	  if (hexCode.length < 3 || hexCode.length === 5 || hexCode.length > 8) {
	    throw new Error('Invalid hex color: ' + hex)
	  }

	  // Convert from short to long form (fff -> ffffff)
	  if (hexCode.length === 3 || hexCode.length === 4) {
	    hexCode = Array.prototype.concat.apply([], hexCode.map(function (c) {
	      return [c, c]
	    }));
	  }

	  // Add default alpha value
	  if (hexCode.length === 6) hexCode.push('F', 'F');

	  const hexValue = parseInt(hexCode.join(''), 16);

	  return {
	    r: (hexValue >> 24) & 255,
	    g: (hexValue >> 16) & 255,
	    b: (hexValue >> 8) & 255,
	    a: hexValue & 255,
	    hex: '#' + hexCode.slice(0, 6).join('')
	  }
	}

	exports.getOptions = function getOptions (options) {
	  if (!options) options = {};
	  if (!options.color) options.color = {};

	  const margin = typeof options.margin === 'undefined' ||
	    options.margin === null ||
	    options.margin < 0
	    ? 4
	    : options.margin;

	  const width = options.width && options.width >= 21 ? options.width : undefined;
	  const scale = options.scale || 4;

	  return {
	    width: width,
	    scale: width ? 4 : scale,
	    margin: margin,
	    color: {
	      dark: hex2rgba(options.color.dark || '#000000ff'),
	      light: hex2rgba(options.color.light || '#ffffffff')
	    },
	    type: options.type,
	    rendererOpts: options.rendererOpts || {}
	  }
	};

	exports.getScale = function getScale (qrSize, opts) {
	  return opts.width && opts.width >= qrSize + opts.margin * 2
	    ? opts.width / (qrSize + opts.margin * 2)
	    : opts.scale
	};

	exports.getImageWidth = function getImageWidth (qrSize, opts) {
	  const scale = exports.getScale(qrSize, opts);
	  return Math.floor((qrSize + opts.margin * 2) * scale)
	};

	exports.qrToImageData = function qrToImageData (imgData, qr, opts) {
	  const size = qr.modules.size;
	  const data = qr.modules.data;
	  const scale = exports.getScale(size, opts);
	  const symbolSize = Math.floor((size + opts.margin * 2) * scale);
	  const scaledMargin = opts.margin * scale;
	  const palette = [opts.color.light, opts.color.dark];

	  for (let i = 0; i < symbolSize; i++) {
	    for (let j = 0; j < symbolSize; j++) {
	      let posDst = (i * symbolSize + j) * 4;
	      let pxColor = opts.color.light;

	      if (i >= scaledMargin && j >= scaledMargin &&
	        i < symbolSize - scaledMargin && j < symbolSize - scaledMargin) {
	        const iSrc = Math.floor((i - scaledMargin) / scale);
	        const jSrc = Math.floor((j - scaledMargin) / scale);
	        pxColor = palette[data[iSrc * size + jSrc] ? 1 : 0];
	      }

	      imgData[posDst++] = pxColor.r;
	      imgData[posDst++] = pxColor.g;
	      imgData[posDst++] = pxColor.b;
	      imgData[posDst] = pxColor.a;
	    }
	  }
	}; 
} (utils));

(function (exports) {
	const Utils = utils;

	function clearCanvas (ctx, canvas, size) {
	  ctx.clearRect(0, 0, canvas.width, canvas.height);

	  if (!canvas.style) canvas.style = {};
	  canvas.height = size;
	  canvas.width = size;
	  canvas.style.height = size + 'px';
	  canvas.style.width = size + 'px';
	}

	function getCanvasElement () {
	  try {
	    return document.createElement('canvas')
	  } catch (e) {
	    throw new Error('You need to specify a canvas element')
	  }
	}

	exports.render = function render (qrData, canvas, options) {
	  let opts = options;
	  let canvasEl = canvas;

	  if (typeof opts === 'undefined' && (!canvas || !canvas.getContext)) {
	    opts = canvas;
	    canvas = undefined;
	  }

	  if (!canvas) {
	    canvasEl = getCanvasElement();
	  }

	  opts = Utils.getOptions(opts);
	  const size = Utils.getImageWidth(qrData.modules.size, opts);

	  const ctx = canvasEl.getContext('2d');
	  const image = ctx.createImageData(size, size);
	  Utils.qrToImageData(image.data, qrData, opts);

	  clearCanvas(ctx, canvasEl, size);
	  ctx.putImageData(image, 0, 0);

	  return canvasEl
	};

	exports.renderToDataURL = function renderToDataURL (qrData, canvas, options) {
	  let opts = options;

	  if (typeof opts === 'undefined' && (!canvas || !canvas.getContext)) {
	    opts = canvas;
	    canvas = undefined;
	  }

	  if (!opts) opts = {};

	  const canvasEl = exports.render(qrData, canvas, opts);

	  const type = opts.type || 'image/png';
	  const rendererOpts = opts.rendererOpts || {};

	  return canvasEl.toDataURL(type, rendererOpts.quality)
	}; 
} (canvas));

var svgTag = {};

const Utils = utils;

function getColorAttrib (color, attrib) {
  const alpha = color.a / 255;
  const str = attrib + '="' + color.hex + '"';

  return alpha < 1
    ? str + ' ' + attrib + '-opacity="' + alpha.toFixed(2).slice(1) + '"'
    : str
}

function svgCmd (cmd, x, y) {
  let str = cmd + x;
  if (typeof y !== 'undefined') str += ' ' + y;

  return str
}

function qrToPath (data, size, margin) {
  let path = '';
  let moveBy = 0;
  let newRow = false;
  let lineLength = 0;

  for (let i = 0; i < data.length; i++) {
    const col = Math.floor(i % size);
    const row = Math.floor(i / size);

    if (!col && !newRow) newRow = true;

    if (data[i]) {
      lineLength++;

      if (!(i > 0 && col > 0 && data[i - 1])) {
        path += newRow
          ? svgCmd('M', col + margin, 0.5 + row + margin)
          : svgCmd('m', moveBy, 0);

        moveBy = 0;
        newRow = false;
      }

      if (!(col + 1 < size && data[i + 1])) {
        path += svgCmd('h', lineLength);
        lineLength = 0;
      }
    } else {
      moveBy++;
    }
  }

  return path
}

svgTag.render = function render (qrData, options, cb) {
  const opts = Utils.getOptions(options);
  const size = qrData.modules.size;
  const data = qrData.modules.data;
  const qrcodesize = size + opts.margin * 2;

  const bg = !opts.color.light.a
    ? ''
    : '<path ' + getColorAttrib(opts.color.light, 'fill') +
      ' d="M0 0h' + qrcodesize + 'v' + qrcodesize + 'H0z"/>';

  const path =
    '<path ' + getColorAttrib(opts.color.dark, 'stroke') +
    ' d="' + qrToPath(data, size, opts.margin) + '"/>';

  const viewBox = 'viewBox="' + '0 0 ' + qrcodesize + ' ' + qrcodesize + '"';

  const width = !opts.width ? '' : 'width="' + opts.width + '" height="' + opts.width + '" ';

  const svgTag = '<svg xmlns="http://www.w3.org/2000/svg" ' + width + viewBox + ' shape-rendering="crispEdges">' + bg + path + '</svg>\n';

  if (typeof cb === 'function') {
    cb(null, svgTag);
  }

  return svgTag
};

const canPromise = canPromise$1;

const QRCode = qrcode;
const CanvasRenderer = canvas;
const SvgRenderer = svgTag;

function renderCanvas (renderFunc, canvas, text, opts, cb) {
  const args = [].slice.call(arguments, 1);
  const argsNum = args.length;
  const isLastArgCb = typeof args[argsNum - 1] === 'function';

  if (!isLastArgCb && !canPromise()) {
    throw new Error('Callback required as last argument')
  }

  if (isLastArgCb) {
    if (argsNum < 2) {
      throw new Error('Too few arguments provided')
    }

    if (argsNum === 2) {
      cb = text;
      text = canvas;
      canvas = opts = undefined;
    } else if (argsNum === 3) {
      if (canvas.getContext && typeof cb === 'undefined') {
        cb = opts;
        opts = undefined;
      } else {
        cb = opts;
        opts = text;
        text = canvas;
        canvas = undefined;
      }
    }
  } else {
    if (argsNum < 1) {
      throw new Error('Too few arguments provided')
    }

    if (argsNum === 1) {
      text = canvas;
      canvas = opts = undefined;
    } else if (argsNum === 2 && !canvas.getContext) {
      opts = text;
      text = canvas;
      canvas = undefined;
    }

    return new Promise(function (resolve, reject) {
      try {
        const data = QRCode.create(text, opts);
        resolve(renderFunc(data, canvas, opts));
      } catch (e) {
        reject(e);
      }
    })
  }

  try {
    const data = QRCode.create(text, opts);
    cb(null, renderFunc(data, canvas, opts));
  } catch (e) {
    cb(e);
  }
}

browser.create = QRCode.create;
browser.toCanvas = renderCanvas.bind(null, CanvasRenderer.render);
browser.toDataURL = renderCanvas.bind(null, CanvasRenderer.renderToDataURL);

// only svg for now.
browser.toString = renderCanvas.bind(null, function (data, _, opts) {
  return SvgRenderer.render(data, opts)
});

/* src/routes/UserEventCard.svelte generated by Svelte v3.59.2 */

const { console: console_1$1 } = globals;
const file$1 = "src/routes/UserEventCard.svelte";

// (245:6) {:else}
function create_else_block(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("Registrar evento");
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block.name,
		type: "else",
		source: "(245:6) {:else}",
		ctx
	});

	return block;
}

// (243:6) {#if isSuscribed}
function create_if_block(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("Eliminar registro");
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block.name,
		type: "if",
		source: "(243:6) {#if isSuscribed}",
		ctx
	});

	return block;
}

function create_fragment$2(ctx) {
	let div7;
	let img;
	let img_src_value;
	let t0;
	let div5;
	let div2;
	let div0;
	let t4;
	let div1;
	let t5_value = /*event*/ ctx[0].start_time + "";
	let t5;
	let t6;
	let t7_value = /*event*/ ctx[0].end_time + "";
	let t7;
	let t8;
	let t9;
	let div3;
	let t10_value = /*event*/ ctx[0].name.toUpperCase() + "";
	let t10;
	let t11;
	let div4;
	let p0;
	let t12_value = /*event*/ ctx[0].career + "";
	let t12;
	let t13;
	let br0;
	let t14;
	let t15_value = /*event*/ ctx[0].location + "";
	let t15;
	let t16;
	let br1;
	let t17;
	let t18_value = /*event*/ ctx[0].exponent + "";
	let t18;
	let t19;
	let div6;
	let p1;
	let span;
	let t21;
	let t22_value = (/*event*/ ctx[0].attendees || 0) + "";
	let t22;
	let t23;
	let t24_value = /*event*/ ctx[0].max_attendees + "";
	let t24;
	let t25;
	let button;
	let mounted;
	let dispose;

	function select_block_type(ctx, dirty) {
		if (/*isSuscribed*/ ctx[1]) return create_if_block;
		return create_else_block;
	}

	let current_block_type = select_block_type(ctx);
	let if_block = current_block_type(ctx);

	const block = {
		c: function create() {
			div7 = element("div");
			img = element("img");
			t0 = space();
			div5 = element("div");
			div2 = element("div");
			div0 = element("div");

			div0.textContent = `${/*nombreDia*/ ctx[3].toUpperCase()} 
        ${/*numeroDia*/ ctx[4].toUpperCase()}`;

			t4 = space();
			div1 = element("div");
			t5 = text(t5_value);
			t6 = text(" - ");
			t7 = text(t7_value);
			t8 = text(" hrs.");
			t9 = space();
			div3 = element("div");
			t10 = text(t10_value);
			t11 = space();
			div4 = element("div");
			p0 = element("p");
			t12 = text(t12_value);
			t13 = space();
			br0 = element("br");
			t14 = space();
			t15 = text(t15_value);
			t16 = space();
			br1 = element("br");
			t17 = space();
			t18 = text(t18_value);
			t19 = space();
			div6 = element("div");
			p1 = element("p");
			span = element("span");
			span.textContent = "Asistentes:";
			t21 = space();
			t22 = text(t22_value);
			t23 = text(" / ");
			t24 = text(t24_value);
			t25 = space();
			button = element("button");
			if_block.c();
			if (!src_url_equal(img.src, img_src_value = /*cardStyleData*/ ctx[2].img)) attr_dev(img, "src", img_src_value);
			attr_dev(img, "alt", "event");
			attr_dev(img, "class", "background-image svelte-1h6815n");
			set_style(img, "color", "white");
			add_location(img, file$1, 184, 2, 4831);
			attr_dev(div0, "class", "info-box svelte-1h6815n");
			add_location(div0, file$1, 208, 6, 5333);
			attr_dev(div1, "class", "info-box svelte-1h6815n");
			add_location(div1, file$1, 213, 6, 5444);
			attr_dev(div2, "class", "d-flex justify-content-between");
			add_location(div2, file$1, 207, 4, 5282);
			attr_dev(div3, "class", "event-name svelte-1h6815n");
			add_location(div3, file$1, 219, 4, 5575);
			add_location(br0, file$1, 224, 23, 5743);
			add_location(br1, file$1, 225, 25, 5775);
			attr_dev(p0, "class", "event-info svelte-1h6815n");
			add_location(p0, file$1, 223, 6, 5697);
			attr_dev(div4, "class", "d-flex justify-content-start");
			add_location(div4, file$1, 222, 4, 5648);
			add_location(div5, file$1, 191, 2, 4943);
			set_style(span, "font-weight", "300");
			add_location(span, file$1, 232, 6, 5959);
			attr_dev(p1, "class", "event-info svelte-1h6815n");
			set_style(p1, "font-weight", "700");
			set_style(p1, "margin-top", "8px");
			add_location(p1, file$1, 231, 4, 5889);
			attr_dev(button, "class", "btn btn-light");
			add_location(button, file$1, 236, 4, 6079);
			attr_dev(div6, "class", "d-flex justify-content-between");
			add_location(div6, file$1, 230, 2, 5840);
			attr_dev(div7, "class", "main-card-container shadow svelte-1h6815n");
			set_style(div7, "background-color", /*cardStyleData*/ ctx[2].color);
			set_style(div7, "overflow", "hidden");
			set_style(div7, "position", "relative");
			add_location(div7, file$1, 180, 0, 4696);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div7, anchor);
			append_dev(div7, img);
			append_dev(div7, t0);
			append_dev(div7, div5);
			append_dev(div5, div2);
			append_dev(div2, div0);
			append_dev(div2, t4);
			append_dev(div2, div1);
			append_dev(div1, t5);
			append_dev(div1, t6);
			append_dev(div1, t7);
			append_dev(div1, t8);
			append_dev(div5, t9);
			append_dev(div5, div3);
			append_dev(div3, t10);
			append_dev(div5, t11);
			append_dev(div5, div4);
			append_dev(div4, p0);
			append_dev(p0, t12);
			append_dev(p0, t13);
			append_dev(p0, br0);
			append_dev(p0, t14);
			append_dev(p0, t15);
			append_dev(p0, t16);
			append_dev(p0, br1);
			append_dev(p0, t17);
			append_dev(p0, t18);
			append_dev(div7, t19);
			append_dev(div7, div6);
			append_dev(div6, p1);
			append_dev(p1, span);
			append_dev(p1, t21);
			append_dev(p1, t22);
			append_dev(p1, t23);
			append_dev(p1, t24);
			append_dev(div6, t25);
			append_dev(div6, button);
			if_block.m(button, null);

			if (!mounted) {
				dispose = [
					listen_dev(div5, "click", /*click_handler*/ ctx[9], false, false, false, false),
					listen_dev(button, "click", /*click_handler_1*/ ctx[10], false, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*cardStyleData*/ 4 && !src_url_equal(img.src, img_src_value = /*cardStyleData*/ ctx[2].img)) {
				attr_dev(img, "src", img_src_value);
			}

			if (dirty & /*event*/ 1 && t5_value !== (t5_value = /*event*/ ctx[0].start_time + "")) set_data_dev(t5, t5_value);
			if (dirty & /*event*/ 1 && t7_value !== (t7_value = /*event*/ ctx[0].end_time + "")) set_data_dev(t7, t7_value);
			if (dirty & /*event*/ 1 && t10_value !== (t10_value = /*event*/ ctx[0].name.toUpperCase() + "")) set_data_dev(t10, t10_value);
			if (dirty & /*event*/ 1 && t12_value !== (t12_value = /*event*/ ctx[0].career + "")) set_data_dev(t12, t12_value);
			if (dirty & /*event*/ 1 && t15_value !== (t15_value = /*event*/ ctx[0].location + "")) set_data_dev(t15, t15_value);
			if (dirty & /*event*/ 1 && t18_value !== (t18_value = /*event*/ ctx[0].exponent + "")) set_data_dev(t18, t18_value);
			if (dirty & /*event*/ 1 && t22_value !== (t22_value = (/*event*/ ctx[0].attendees || 0) + "")) set_data_dev(t22, t22_value);
			if (dirty & /*event*/ 1 && t24_value !== (t24_value = /*event*/ ctx[0].max_attendees + "")) set_data_dev(t24, t24_value);

			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
				if_block.d(1);
				if_block = current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(button, null);
				}
			}

			if (dirty & /*cardStyleData*/ 4) {
				set_style(div7, "background-color", /*cardStyleData*/ ctx[2].color);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div7);
			if_block.d();
			mounted = false;
			run_all(dispose);
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

function instance$2($$self, $$props, $$invalidate) {
	let $availableCareers;
	validate_store(availableCareers, 'availableCareers');
	component_subscribe($$self, availableCareers, $$value => $$invalidate(11, $availableCareers = $$value));
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

	let cardStyleData = {
		name: "UNAM",
		color: "#8bc34a",
		img: "https://propiedadintelectual.unam.mx/assets/img/unamblanco.png"
	};

	function getCardStyleData() {
		//console.log("Available careers", $availableCareers);
		const careerCatalog = $availableCareers.find(career => career.name === event.career);

		if (careerCatalog) {
			$$invalidate(2, cardStyleData = careerCatalog);
			$$invalidate(2, cardStyleData.img = API_URL + "/img/" + cardStyleData.img_bg, cardStyleData);
			console.log("Career found", event.career);
			console.log("Career data", cardStyleData);
		} else {
			console.log("Career not found", event.career);
		}
	}

	let { color } = $$props;
	let { userId } = $$props;
	let { isSuscribed = false } = $$props;
	const nombreDia = new Date(event.date).toLocaleDateString("es-ES", { weekday: "long" });
	const numeroDia = new Date(event.date).toLocaleDateString("es-ES", { day: "numeric" });
	const nombreMes = new Date(event.date).toLocaleDateString("es-ES", { month: "long" });

	async function generateQR() {
		const qr = await browser.toDataURL(userId + "-" + event.id, {
			errorCorrectionLevel: "H",
			type: "image/jpeg",
			quality: 0.3,
			margin: 1,
			color: { dark: "#000000", light: "#ffffff" }
		});

		console.log("qrBase64", qr);
		return qr;
	}

	/*async function openDetailModal() {
  if (isSuscribed) {
    console.log("Opening modal");

    await generateQR();
    var detailModal = new bootstrap.Modal(
      document.getElementById("detail-modal"),
      {
        keyboard: false,
      }
    );
    detailModal.show();
  } else {
    toast.error("Debes inscribirte para al evento ver tu QR");
  }
}*/
	async function handleSuscription() {
		if (isSuscribed) {
			await unsuscribeEvent();
		} else {
			await incribirEvento();
		}
	}

	async function incribirEvento() {
		try {
			const res = await fetch(`${API_URL}/api/evento/atendees/suscribe`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ event_id: event.id, user_id: userId })
			});

			let response = await res.json();

			//console.log("response catched", response);
			switch (res.status) {
				case 200:
					//console.log("response", response.message);
					toast.success(response.message);
					$$invalidate(1, isSuscribed = true);
					$$invalidate(0, event.attendees++, event);
					break;
				case 400:
					toast.error(response.error);
					break;
				default:
					toast.error("Error al inscribirse");
					break;
			}
		} catch(error) {
			console.log(error);
		}
	}

	async function unsuscribeEvent() {
		try {
			const res = await fetch(`${API_URL}/api/evento/atendees/unsuscribe`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ event_id: event.id, user_id: userId })
			});

			//let response = await res.json();
			//console.log("response", response);
			switch (res.status) {
				case 200:
					toast.success("Se ha dado de baja correctamente");
					$$invalidate(1, isSuscribed = false);
					$$invalidate(0, event.attendees--, event);
					break;
				case 400:
					toast.error("No estás inscrito en este evento");
					break;
				default:
					toast.error("Error al darse de baja");
					break;
			}
		} catch(error) {
			console.log(error);
		}
	}

	onMount(() => {
		//cardClickListener();
		getCardStyleData();
	});

	$$self.$$.on_mount.push(function () {
		if (color === undefined && !('color' in $$props || $$self.$$.bound[$$self.$$.props['color']])) {
			console_1$1.warn("<UserEventCard> was created without expected prop 'color'");
		}

		if (userId === undefined && !('userId' in $$props || $$self.$$.bound[$$self.$$.props['userId']])) {
			console_1$1.warn("<UserEventCard> was created without expected prop 'userId'");
		}
	});

	const writable_props = ['event', 'color', 'userId', 'isSuscribed'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<UserEventCard> was created with unknown prop '${key}'`);
	});

	const click_handler = async () => {
		if (!isSuscribed) {
			toast.error("Debes inscribirte para al evento ver tu QR");
			return;
		} else {
			userModalData.set({ event, qrBase64: await generateQR() });
			openDetailModal();
		}
	};

	const click_handler_1 = async () => {
		await handleSuscription();
	};

	$$self.$$set = $$props => {
		if ('event' in $$props) $$invalidate(0, event = $$props.event);
		if ('color' in $$props) $$invalidate(7, color = $$props.color);
		if ('userId' in $$props) $$invalidate(8, userId = $$props.userId);
		if ('isSuscribed' in $$props) $$invalidate(1, isSuscribed = $$props.isSuscribed);
	};

	$$self.$capture_state = () => ({
		onMount,
		toast,
		API_URL,
		availableCareers,
		openDetailModal,
		userModalData,
		qrCode: browser,
		event,
		cardStyleData,
		getCardStyleData,
		color,
		userId,
		isSuscribed,
		nombreDia,
		numeroDia,
		nombreMes,
		generateQR,
		handleSuscription,
		incribirEvento,
		unsuscribeEvent,
		$availableCareers
	});

	$$self.$inject_state = $$props => {
		if ('event' in $$props) $$invalidate(0, event = $$props.event);
		if ('cardStyleData' in $$props) $$invalidate(2, cardStyleData = $$props.cardStyleData);
		if ('color' in $$props) $$invalidate(7, color = $$props.color);
		if ('userId' in $$props) $$invalidate(8, userId = $$props.userId);
		if ('isSuscribed' in $$props) $$invalidate(1, isSuscribed = $$props.isSuscribed);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		event,
		isSuscribed,
		cardStyleData,
		nombreDia,
		numeroDia,
		generateQR,
		handleSuscription,
		color,
		userId,
		click_handler,
		click_handler_1
	];
}

class UserEventCard extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
			event: 0,
			color: 7,
			userId: 8,
			isSuscribed: 1
		});

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

	get isSuscribed() {
		throw new Error("<UserEventCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set isSuscribed(value) {
		throw new Error("<UserEventCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src/routes/UserEvents.svelte generated by Svelte v3.59.2 */

const { Error: Error_1, console: console_1 } = globals;
const file = "src/routes/UserEvents.svelte";

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[10] = list[i];
	child_ctx[12] = i;
	return child_ctx;
}

// (145:2) {#each events as event, index}
function create_each_block(ctx) {
	let div;
	let usereventcard;
	let t;
	let current;

	usereventcard = new UserEventCard({
			props: {
				event: /*event*/ ctx[10],
				color: /*colors*/ ctx[4][/*index*/ ctx[12] % /*colors*/ ctx[4].length],
				userId: /*userId*/ ctx[2],
				isSuscribed: /*suscribedEvents*/ ctx[1].includes(/*event*/ ctx[10].id)
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			div = element("div");
			create_component(usereventcard.$$.fragment);
			t = space();
			attr_dev(div, "class", "col-sm-12 col-md-6 col-lg-6");
			add_location(div, file, 145, 2, 3425);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			mount_component(usereventcard, div, null);
			append_dev(div, t);
			current = true;
		},
		p: function update(ctx, dirty) {
			const usereventcard_changes = {};
			if (dirty & /*events*/ 1) usereventcard_changes.event = /*event*/ ctx[10];
			if (dirty & /*userId*/ 4) usereventcard_changes.userId = /*userId*/ ctx[2];
			if (dirty & /*suscribedEvents, events*/ 3) usereventcard_changes.isSuscribed = /*suscribedEvents*/ ctx[1].includes(/*event*/ ctx[10].id);
			usereventcard.$set(usereventcard_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(usereventcard.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(usereventcard.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_component(usereventcard);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block.name,
		type: "each",
		source: "(145:2) {#each events as event, index}",
		ctx
	});

	return block;
}

function create_fragment$1(ctx) {
	let div1;
	let nav;
	let div0;
	let a;
	let img0;
	let img0_src_value;
	let t0;
	let t1;
	let button0;
	let i;
	let t2;
	let div2;
	let t3;
	let div10;
	let div9;
	let div8;
	let div3;
	let h1;
	let t4_value = /*$userModalData*/ ctx[3].event.name + "";
	let t4;
	let t5;
	let button1;
	let t6;
	let div6;
	let div4;
	let span0;
	let t7_value = new Date(/*$userModalData*/ ctx[3].event.date).toLocaleDateString("es-ES", { weekday: "long" }) + "";
	let t7;
	let t8;
	let t9_value = new Date(/*$userModalData*/ ctx[3].event.date).toLocaleDateString("es-ES", { day: "numeric" }) + "";
	let t9;
	let t10;
	let t11_value = new Date(/*$userModalData*/ ctx[3].event.date).toLocaleDateString("es-ES", { month: "long" }) + "";
	let t11;
	let t12;
	let span1;
	let t13_value = /*$userModalData*/ ctx[3].event.start_time + "";
	let t13;
	let t14;
	let t15_value = /*$userModalData*/ ctx[3].event.end_time + "";
	let t15;
	let t16;
	let t17;
	let span2;
	let t18_value = /*$userModalData*/ ctx[3].event.location + "";
	let t18;
	let t19;
	let span3;
	let t20_value = /*$userModalData*/ ctx[3].event.attendees + "";
	let t20;
	let t21;
	let t22_value = /*$userModalData*/ ctx[3].event.max_attendees + "";
	let t22;
	let t23;
	let span4;
	let t24_value = /*$userModalData*/ ctx[3].event.career + "";
	let t24;
	let t25;
	let span5;
	let t26_value = /*$userModalData*/ ctx[3].event.exponent + "";
	let t26;
	let t27;
	let hr;
	let t28;
	let div5;
	let img1;
	let img1_src_value;
	let t29;
	let div7;
	let button2;
	let current;
	let mounted;
	let dispose;
	let each_value = /*events*/ ctx[0];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	const block = {
		c: function create() {
			div1 = element("div");
			nav = element("nav");
			div0 = element("div");
			a = element("a");
			img0 = element("img");
			t0 = text("\n        Semana de la ingenería");
			t1 = space();
			button0 = element("button");
			i = element("i");
			t2 = space();
			div2 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t3 = space();
			div10 = element("div");
			div9 = element("div");
			div8 = element("div");
			div3 = element("div");
			h1 = element("h1");
			t4 = text(t4_value);
			t5 = space();
			button1 = element("button");
			t6 = space();
			div6 = element("div");
			div4 = element("div");
			span0 = element("span");
			t7 = text(t7_value);
			t8 = space();
			t9 = text(t9_value);
			t10 = text(" de ");
			t11 = text(t11_value);
			t12 = space();
			span1 = element("span");
			t13 = text(t13_value);
			t14 = text(" - ");
			t15 = text(t15_value);
			t16 = text("\n            hrs.");
			t17 = space();
			span2 = element("span");
			t18 = text(t18_value);
			t19 = space();
			span3 = element("span");
			t20 = text(t20_value);
			t21 = text(" / ");
			t22 = text(t22_value);
			t23 = space();
			span4 = element("span");
			t24 = text(t24_value);
			t25 = space();
			span5 = element("span");
			t26 = text(t26_value);
			t27 = space();
			hr = element("hr");
			t28 = space();
			div5 = element("div");
			img1 = element("img");
			t29 = space();
			div7 = element("div");
			button2 = element("button");
			button2.textContent = "Cerrar";
			if (!src_url_equal(img0.src, img0_src_value = "https://propiedadintelectual.unam.mx/assets/img/unamblanco.png")) attr_dev(img0, "src", img0_src_value);
			attr_dev(img0, "alt", "");
			attr_dev(img0, "width", "25");
			attr_dev(img0, "height", "25");
			attr_dev(img0, "class", "d-inline-block align-text-top");
			add_location(img0, file, 120, 8, 2737);
			attr_dev(a, "class", "navbar-brand");
			attr_dev(a, "href", "#");
			add_location(a, file, 114, 6, 2587);
			attr_dev(i, "class", "bi bi-box-arrow-right");
			add_location(i, file, 137, 8, 3202);
			attr_dev(button0, "class", "btn btn-secondary transparent svelte-qis0ni");
			attr_dev(button0, "type", "button");
			attr_dev(button0, "id", "dropdownMenuButton");
			attr_dev(button0, "data-bs-toggle", "dropdown");
			attr_dev(button0, "aria-expanded", "false");
			add_location(button0, file, 129, 6, 2988);
			attr_dev(div0, "class", "container-fluid");
			add_location(div0, file, 112, 4, 2499);
			attr_dev(nav, "class", "navbar navbar-dark bg-dark fixed-top");
			add_location(nav, file, 111, 2, 2444);
			add_location(div1, file, 109, 0, 2420);
			attr_dev(div2, "id", "main-container");
			attr_dev(div2, "class", "row svelte-qis0ni");
			set_style(div2, "paddding-top", "48px");
			set_style(div2, "padding-bottom", "48px");
			set_style(div2, "margin-top", "48px");
			add_location(div2, file, 143, 0, 3284);
			attr_dev(h1, "class", "modal-title fs-5");
			attr_dev(h1, "id", "detail-modalLabel");
			add_location(h1, file, 170, 8, 3967);
			attr_dev(button1, "type", "button");
			attr_dev(button1, "class", "btn-close");
			attr_dev(button1, "data-bs-dismiss", "modal");
			attr_dev(button1, "aria-label", "Close");
			add_location(button1, file, 173, 8, 4080);
			attr_dev(div3, "class", "modal-header");
			add_location(div3, file, 169, 6, 3932);
			attr_dev(span0, "class", "badge bg-primary");
			add_location(span0, file, 182, 10, 4299);
			attr_dev(span1, "class", "badge bg-success");
			add_location(span1, file, 195, 10, 4771);
			attr_dev(span2, "class", "badge bg-secondary");
			add_location(span2, file, 199, 10, 4928);
			attr_dev(span3, "class", "badge bg-info");
			add_location(span3, file, 202, 10, 5022);
			attr_dev(span4, "class", "badge bg-warning");
			add_location(span4, file, 206, 10, 5178);
			attr_dev(span5, "class", "badge bg-danger");
			add_location(span5, file, 208, 10, 5257);
			attr_dev(div4, "class", "");
			add_location(div4, file, 181, 8, 4274);
			add_location(hr, file, 210, 8, 5349);
			attr_dev(img1, "class", "w-100");
			if (!src_url_equal(img1.src, img1_src_value = /*$userModalData*/ ctx[3].qrBase64)) attr_dev(img1, "src", img1_src_value);
			attr_dev(img1, "alt", "QR");
			add_location(img1, file, 213, 10, 5399);
			attr_dev(div5, "id", "qr-container");
			add_location(div5, file, 212, 8, 5365);
			attr_dev(div6, "class", "modal-body");
			add_location(div6, file, 180, 6, 4241);
			attr_dev(button2, "type", "button");
			attr_dev(button2, "class", "btn btn-secondary");
			attr_dev(button2, "data-bs-dismiss", "modal");
			add_location(button2, file, 217, 8, 5529);
			attr_dev(div7, "class", "modal-footer");
			add_location(div7, file, 216, 6, 5494);
			attr_dev(div8, "class", "modal-content");
			add_location(div8, file, 168, 4, 3898);
			attr_dev(div9, "class", "modal-dialog modal-dialog modal-dialog-centered modal-dialog-scrollable");
			add_location(div9, file, 165, 2, 3801);
			attr_dev(div10, "class", "modal fade");
			attr_dev(div10, "id", "detail-modal");
			attr_dev(div10, "tabindex", "-1");
			attr_dev(div10, "aria-labelledby", "detail-modalLabel");
			attr_dev(div10, "aria-hidden", "true");
			add_location(div10, file, 158, 0, 3676);
		},
		l: function claim(nodes) {
			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div1, anchor);
			append_dev(div1, nav);
			append_dev(nav, div0);
			append_dev(div0, a);
			append_dev(a, img0);
			append_dev(a, t0);
			append_dev(div0, t1);
			append_dev(div0, button0);
			append_dev(button0, i);
			insert_dev(target, t2, anchor);
			insert_dev(target, div2, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div2, null);
				}
			}

			insert_dev(target, t3, anchor);
			insert_dev(target, div10, anchor);
			append_dev(div10, div9);
			append_dev(div9, div8);
			append_dev(div8, div3);
			append_dev(div3, h1);
			append_dev(h1, t4);
			append_dev(div3, t5);
			append_dev(div3, button1);
			append_dev(div8, t6);
			append_dev(div8, div6);
			append_dev(div6, div4);
			append_dev(div4, span0);
			append_dev(span0, t7);
			append_dev(span0, t8);
			append_dev(span0, t9);
			append_dev(span0, t10);
			append_dev(span0, t11);
			append_dev(div4, t12);
			append_dev(div4, span1);
			append_dev(span1, t13);
			append_dev(span1, t14);
			append_dev(span1, t15);
			append_dev(span1, t16);
			append_dev(div4, t17);
			append_dev(div4, span2);
			append_dev(span2, t18);
			append_dev(div4, t19);
			append_dev(div4, span3);
			append_dev(span3, t20);
			append_dev(span3, t21);
			append_dev(span3, t22);
			append_dev(div4, t23);
			append_dev(div4, span4);
			append_dev(span4, t24);
			append_dev(div4, t25);
			append_dev(div4, span5);
			append_dev(span5, t26);
			append_dev(div6, t27);
			append_dev(div6, hr);
			append_dev(div6, t28);
			append_dev(div6, div5);
			append_dev(div5, img1);
			append_dev(div8, t29);
			append_dev(div8, div7);
			append_dev(div7, button2);
			current = true;

			if (!mounted) {
				dispose = [
					listen_dev(a, "click", /*click_handler*/ ctx[5], false, false, false, false),
					listen_dev(button0, "click", logout, false, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*events, colors, userId, suscribedEvents*/ 23) {
				each_value = /*events*/ ctx[0];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(div2, null);
					}
				}

				group_outros();

				for (i = each_value.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				check_outros();
			}

			if ((!current || dirty & /*$userModalData*/ 8) && t4_value !== (t4_value = /*$userModalData*/ ctx[3].event.name + "")) set_data_dev(t4, t4_value);
			if ((!current || dirty & /*$userModalData*/ 8) && t7_value !== (t7_value = new Date(/*$userModalData*/ ctx[3].event.date).toLocaleDateString("es-ES", { weekday: "long" }) + "")) set_data_dev(t7, t7_value);
			if ((!current || dirty & /*$userModalData*/ 8) && t9_value !== (t9_value = new Date(/*$userModalData*/ ctx[3].event.date).toLocaleDateString("es-ES", { day: "numeric" }) + "")) set_data_dev(t9, t9_value);
			if ((!current || dirty & /*$userModalData*/ 8) && t11_value !== (t11_value = new Date(/*$userModalData*/ ctx[3].event.date).toLocaleDateString("es-ES", { month: "long" }) + "")) set_data_dev(t11, t11_value);
			if ((!current || dirty & /*$userModalData*/ 8) && t13_value !== (t13_value = /*$userModalData*/ ctx[3].event.start_time + "")) set_data_dev(t13, t13_value);
			if ((!current || dirty & /*$userModalData*/ 8) && t15_value !== (t15_value = /*$userModalData*/ ctx[3].event.end_time + "")) set_data_dev(t15, t15_value);
			if ((!current || dirty & /*$userModalData*/ 8) && t18_value !== (t18_value = /*$userModalData*/ ctx[3].event.location + "")) set_data_dev(t18, t18_value);
			if ((!current || dirty & /*$userModalData*/ 8) && t20_value !== (t20_value = /*$userModalData*/ ctx[3].event.attendees + "")) set_data_dev(t20, t20_value);
			if ((!current || dirty & /*$userModalData*/ 8) && t22_value !== (t22_value = /*$userModalData*/ ctx[3].event.max_attendees + "")) set_data_dev(t22, t22_value);
			if ((!current || dirty & /*$userModalData*/ 8) && t24_value !== (t24_value = /*$userModalData*/ ctx[3].event.career + "")) set_data_dev(t24, t24_value);
			if ((!current || dirty & /*$userModalData*/ 8) && t26_value !== (t26_value = /*$userModalData*/ ctx[3].event.exponent + "")) set_data_dev(t26, t26_value);

			if (!current || dirty & /*$userModalData*/ 8 && !src_url_equal(img1.src, img1_src_value = /*$userModalData*/ ctx[3].qrBase64)) {
				attr_dev(img1, "src", img1_src_value);
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
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div1);
			if (detaching) detach_dev(t2);
			if (detaching) detach_dev(div2);
			destroy_each(each_blocks, detaching);
			if (detaching) detach_dev(t3);
			if (detaching) detach_dev(div10);
			mounted = false;
			run_all(dispose);
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

function logout() {
	document.cookie = `userId=; max-age=0; path=/`;
	window.location.href = "/login";
}

function instance$1($$self, $$props, $$invalidate) {
	let $userModalData;
	validate_store(userModalData, 'userModalData');
	component_subscribe($$self, userModalData, $$value => $$invalidate(3, $userModalData = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('UserEvents', slots, []);
	let events = [];
	let suscribedEvents = [];
	let userId;

	//lista de colores flat material
	const colors = [
		"#f44336",
		"#e91e63",
		"#9c27b0",
		"#673ab7",
		"#3f51b5",
		"#2196f3",
		"#03a9f4",
		"#00bcd4",
		"#009688",
		"#4caf50",
		"#8bc34a"
	];

	//get user id from cookie
	function getUserId() {
		let isUser = false;
		const cookie = document.cookie;
		const cookieArray = cookie.split(";");

		for (let i = 0; i < cookieArray.length; i++) {
			const cookieItem = cookieArray[i].split("=");

			if (cookieItem[0].trim() === "userId") {
				$$invalidate(2, userId = cookieItem[1]);
				isUser = true;
			}
		}

		if (!isUser) {
			window.location.href = "/login";
		} else {
			toast(`¡Hola!`, { icon: "👋" });
		}
	}

	//fetch events
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
			console.log(error);
		}
	}

	//get suscribed events
	async function getSuscribedEvents() {
		try {
			const res = await fetch(`${API_URL}/api/evento/atendee/${userId}`, {
				method: "GET",
				headers: { "Content-Type": "application/json" }
			});

			console.log("res", res);

			if (res.status === 200) {
				const data = await res.json();
				$$invalidate(1, suscribedEvents = data);
			} else {
				toast.error(res.error.message);
				throw new Error("Error en la solicitud");
			}
		} catch(error) {
			console.log(error);
		}
	}

	async function refreshEvents() {
		await getEvents();
		await getSuscribedEvents();
	}

	onMount(async () => {
		getUserId();
		await getSuscribedEvents();
		await getEvents();

		setInterval(
			async () => {
				await refreshEvents();
			},
			60000
		); //refresh every minute
	});

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<UserEvents> was created with unknown prop '${key}'`);
	});

	const click_handler = () => {
		//prevent default
		event.preventDefault();
	};

	$$self.$capture_state = () => ({
		onMount,
		UserEventCard,
		API_URL,
		userModalData,
		toast,
		events,
		suscribedEvents,
		userId,
		colors,
		getUserId,
		getEvents,
		getSuscribedEvents,
		refreshEvents,
		logout,
		$userModalData
	});

	$$self.$inject_state = $$props => {
		if ('events' in $$props) $$invalidate(0, events = $$props.events);
		if ('suscribedEvents' in $$props) $$invalidate(1, suscribedEvents = $$props.suscribedEvents);
		if ('userId' in $$props) $$invalidate(2, userId = $$props.userId);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [events, suscribedEvents, userId, $userModalData, colors, click_handler];
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

// (11:0) <Router>
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
		source: "(11:0) <Router>",
		ctx
	});

	return block;
}

function create_fragment(ctx) {
	let router;
	let t;
	let toaster;
	let current;

	router = new Router({
			props: {
				$$slots: { default: [create_default_slot] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	toaster = new Toaster({ $$inline: true });

	const block = {
		c: function create() {
			create_component(router.$$.fragment);
			t = space();
			create_component(toaster.$$.fragment);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			mount_component(router, target, anchor);
			insert_dev(target, t, anchor);
			mount_component(toaster, target, anchor);
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
			transition_in(toaster.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(router.$$.fragment, local);
			transition_out(toaster.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(router, detaching);
			if (detaching) detach_dev(t);
			destroy_component(toaster, detaching);
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
		UserEvents,
		Toaster
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
