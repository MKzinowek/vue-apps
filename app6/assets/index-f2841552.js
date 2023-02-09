(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(script) {
    const fetchOpts = {};
    if (script.integrity)
      fetchOpts.integrity = script.integrity;
    if (script.referrerpolicy)
      fetchOpts.referrerPolicy = script.referrerpolicy;
    if (script.crossorigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (script.crossorigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
function makeMap(str, expectsLowerCase) {
  const map = /* @__PURE__ */ Object.create(null);
  const list = str.split(",");
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase ? (val) => !!map[val.toLowerCase()] : (val) => !!map[val];
}
function normalizeStyle(value) {
  if (isArray(value)) {
    const res = {};
    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
      if (normalized) {
        for (const key in normalized) {
          res[key] = normalized[key];
        }
      }
    }
    return res;
  } else if (isString(value)) {
    return value;
  } else if (isObject(value)) {
    return value;
  }
}
const listDelimiterRE = /;(?![^(]*\))/g;
const propertyDelimiterRE = /:([^]+)/;
const styleCommentRE = /\/\*.*?\*\//gs;
function parseStringStyle(cssText) {
  const ret = {};
  cssText.replace(styleCommentRE, "").split(listDelimiterRE).forEach((item) => {
    if (item) {
      const tmp = item.split(propertyDelimiterRE);
      tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return ret;
}
function normalizeClass(value) {
  let res = "";
  if (isString(value)) {
    res = value;
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const normalized = normalizeClass(value[i]);
      if (normalized) {
        res += normalized + " ";
      }
    }
  } else if (isObject(value)) {
    for (const name in value) {
      if (value[name]) {
        res += name + " ";
      }
    }
  }
  return res.trim();
}
const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
const isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
function includeBooleanAttr(value) {
  return !!value || value === "";
}
const EMPTY_OBJ = {};
const EMPTY_ARR = [];
const NOOP = () => {
};
const NO = () => false;
const onRE = /^on[^a-z]/;
const isOn = (key) => onRE.test(key);
const isModelListener = (key) => key.startsWith("onUpdate:");
const extend = Object.assign;
const remove = (arr, el) => {
  const i = arr.indexOf(el);
  if (i > -1) {
    arr.splice(i, 1);
  }
};
const hasOwnProperty$1 = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty$1.call(val, key);
const isArray = Array.isArray;
const isMap = (val) => toTypeString(val) === "[object Map]";
const isSet = (val) => toTypeString(val) === "[object Set]";
const isFunction = (val) => typeof val === "function";
const isString = (val) => typeof val === "string";
const isSymbol = (val) => typeof val === "symbol";
const isObject = (val) => val !== null && typeof val === "object";
const isPromise = (val) => {
  return isObject(val) && isFunction(val.then) && isFunction(val.catch);
};
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const toRawType = (value) => {
  return toTypeString(value).slice(8, -1);
};
const isPlainObject = (val) => toTypeString(val) === "[object Object]";
const isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
const isReservedProp = /* @__PURE__ */ makeMap(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
);
const cacheStringFunction = (fn) => {
  const cache = /* @__PURE__ */ Object.create(null);
  return (str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
};
const camelizeRE = /-(\w)/g;
const camelize = cacheStringFunction((str) => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
});
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = cacheStringFunction((str) => str.replace(hyphenateRE, "-$1").toLowerCase());
const capitalize = cacheStringFunction((str) => str.charAt(0).toUpperCase() + str.slice(1));
const toHandlerKey = cacheStringFunction((str) => str ? `on${capitalize(str)}` : ``);
const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
const invokeArrayFns = (fns, arg) => {
  for (let i = 0; i < fns.length; i++) {
    fns[i](arg);
  }
};
const def = (obj, key, value) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    value
  });
};
const looseToNumber = (val) => {
  const n = parseFloat(val);
  return isNaN(n) ? val : n;
};
let _globalThis;
const getGlobalThis = () => {
  return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
};
let activeEffectScope;
class EffectScope {
  constructor(detached = false) {
    this.detached = detached;
    this._active = true;
    this.effects = [];
    this.cleanups = [];
    this.parent = activeEffectScope;
    if (!detached && activeEffectScope) {
      this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(this) - 1;
    }
  }
  get active() {
    return this._active;
  }
  run(fn) {
    if (this._active) {
      const currentEffectScope = activeEffectScope;
      try {
        activeEffectScope = this;
        return fn();
      } finally {
        activeEffectScope = currentEffectScope;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    activeEffectScope = this;
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    activeEffectScope = this.parent;
  }
  stop(fromParent) {
    if (this._active) {
      let i, l;
      for (i = 0, l = this.effects.length; i < l; i++) {
        this.effects[i].stop();
      }
      for (i = 0, l = this.cleanups.length; i < l; i++) {
        this.cleanups[i]();
      }
      if (this.scopes) {
        for (i = 0, l = this.scopes.length; i < l; i++) {
          this.scopes[i].stop(true);
        }
      }
      if (!this.detached && this.parent && !fromParent) {
        const last = this.parent.scopes.pop();
        if (last && last !== this) {
          this.parent.scopes[this.index] = last;
          last.index = this.index;
        }
      }
      this.parent = void 0;
      this._active = false;
    }
  }
}
function recordEffectScope(effect, scope = activeEffectScope) {
  if (scope && scope.active) {
    scope.effects.push(effect);
  }
}
function getCurrentScope() {
  return activeEffectScope;
}
const createDep = (effects) => {
  const dep = new Set(effects);
  dep.w = 0;
  dep.n = 0;
  return dep;
};
const wasTracked = (dep) => (dep.w & trackOpBit) > 0;
const newTracked = (dep) => (dep.n & trackOpBit) > 0;
const initDepMarkers = ({ deps }) => {
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].w |= trackOpBit;
    }
  }
};
const finalizeDepMarkers = (effect) => {
  const { deps } = effect;
  if (deps.length) {
    let ptr = 0;
    for (let i = 0; i < deps.length; i++) {
      const dep = deps[i];
      if (wasTracked(dep) && !newTracked(dep)) {
        dep.delete(effect);
      } else {
        deps[ptr++] = dep;
      }
      dep.w &= ~trackOpBit;
      dep.n &= ~trackOpBit;
    }
    deps.length = ptr;
  }
};
const targetMap = /* @__PURE__ */ new WeakMap();
let effectTrackDepth = 0;
let trackOpBit = 1;
const maxMarkerBits = 30;
let activeEffect;
const ITERATE_KEY = Symbol("");
const MAP_KEY_ITERATE_KEY = Symbol("");
class ReactiveEffect {
  constructor(fn, scheduler = null, scope) {
    this.fn = fn;
    this.scheduler = scheduler;
    this.active = true;
    this.deps = [];
    this.parent = void 0;
    recordEffectScope(this, scope);
  }
  run() {
    if (!this.active) {
      return this.fn();
    }
    let parent = activeEffect;
    let lastShouldTrack = shouldTrack;
    while (parent) {
      if (parent === this) {
        return;
      }
      parent = parent.parent;
    }
    try {
      this.parent = activeEffect;
      activeEffect = this;
      shouldTrack = true;
      trackOpBit = 1 << ++effectTrackDepth;
      if (effectTrackDepth <= maxMarkerBits) {
        initDepMarkers(this);
      } else {
        cleanupEffect(this);
      }
      return this.fn();
    } finally {
      if (effectTrackDepth <= maxMarkerBits) {
        finalizeDepMarkers(this);
      }
      trackOpBit = 1 << --effectTrackDepth;
      activeEffect = this.parent;
      shouldTrack = lastShouldTrack;
      this.parent = void 0;
      if (this.deferStop) {
        this.stop();
      }
    }
  }
  stop() {
    if (activeEffect === this) {
      this.deferStop = true;
    } else if (this.active) {
      cleanupEffect(this);
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
}
function cleanupEffect(effect) {
  const { deps } = effect;
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].delete(effect);
    }
    deps.length = 0;
  }
}
let shouldTrack = true;
const trackStack = [];
function pauseTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = false;
}
function resetTracking() {
  const last = trackStack.pop();
  shouldTrack = last === void 0 ? true : last;
}
function track(target, type, key) {
  if (shouldTrack && activeEffect) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, dep = createDep());
    }
    trackEffects(dep);
  }
}
function trackEffects(dep, debuggerEventExtraInfo) {
  let shouldTrack2 = false;
  if (effectTrackDepth <= maxMarkerBits) {
    if (!newTracked(dep)) {
      dep.n |= trackOpBit;
      shouldTrack2 = !wasTracked(dep);
    }
  } else {
    shouldTrack2 = !dep.has(activeEffect);
  }
  if (shouldTrack2) {
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
  }
}
function trigger(target, type, key, newValue, oldValue, oldTarget) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  let deps = [];
  if (type === "clear") {
    deps = [...depsMap.values()];
  } else if (key === "length" && isArray(target)) {
    const newLength = Number(newValue);
    depsMap.forEach((dep, key2) => {
      if (key2 === "length" || key2 >= newLength) {
        deps.push(dep);
      }
    });
  } else {
    if (key !== void 0) {
      deps.push(depsMap.get(key));
    }
    switch (type) {
      case "add":
        if (!isArray(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        } else if (isIntegerKey(key)) {
          deps.push(depsMap.get("length"));
        }
        break;
      case "delete":
        if (!isArray(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        }
        break;
      case "set":
        if (isMap(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
        }
        break;
    }
  }
  if (deps.length === 1) {
    if (deps[0]) {
      {
        triggerEffects(deps[0]);
      }
    }
  } else {
    const effects = [];
    for (const dep of deps) {
      if (dep) {
        effects.push(...dep);
      }
    }
    {
      triggerEffects(createDep(effects));
    }
  }
}
function triggerEffects(dep, debuggerEventExtraInfo) {
  const effects = isArray(dep) ? dep : [...dep];
  for (const effect of effects) {
    if (effect.computed) {
      triggerEffect(effect);
    }
  }
  for (const effect of effects) {
    if (!effect.computed) {
      triggerEffect(effect);
    }
  }
}
function triggerEffect(effect, debuggerEventExtraInfo) {
  if (effect !== activeEffect || effect.allowRecurse) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}
const isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
const builtInSymbols = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol)
);
const get$1 = /* @__PURE__ */ createGetter();
const shallowGet = /* @__PURE__ */ createGetter(false, true);
const readonlyGet = /* @__PURE__ */ createGetter(true);
const arrayInstrumentations = /* @__PURE__ */ createArrayInstrumentations();
function createArrayInstrumentations() {
  const instrumentations = {};
  ["includes", "indexOf", "lastIndexOf"].forEach((key) => {
    instrumentations[key] = function(...args) {
      const arr = toRaw(this);
      for (let i = 0, l = this.length; i < l; i++) {
        track(arr, "get", i + "");
      }
      const res = arr[key](...args);
      if (res === -1 || res === false) {
        return arr[key](...args.map(toRaw));
      } else {
        return res;
      }
    };
  });
  ["push", "pop", "shift", "unshift", "splice"].forEach((key) => {
    instrumentations[key] = function(...args) {
      pauseTracking();
      const res = toRaw(this)[key].apply(this, args);
      resetTracking();
      return res;
    };
  });
  return instrumentations;
}
function hasOwnProperty(key) {
  const obj = toRaw(this);
  track(obj, "has", key);
  return obj.hasOwnProperty(key);
}
function createGetter(isReadonly2 = false, shallow = false) {
  return function get2(target, key, receiver) {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_isShallow") {
      return shallow;
    } else if (key === "__v_raw" && receiver === (isReadonly2 ? shallow ? shallowReadonlyMap : readonlyMap : shallow ? shallowReactiveMap : reactiveMap).get(target)) {
      return target;
    }
    const targetIsArray = isArray(target);
    if (!isReadonly2) {
      if (targetIsArray && hasOwn(arrayInstrumentations, key)) {
        return Reflect.get(arrayInstrumentations, key, receiver);
      }
      if (key === "hasOwnProperty") {
        return hasOwnProperty;
      }
    }
    const res = Reflect.get(target, key, receiver);
    if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
      return res;
    }
    if (!isReadonly2) {
      track(target, "get", key);
    }
    if (shallow) {
      return res;
    }
    if (isRef(res)) {
      return targetIsArray && isIntegerKey(key) ? res : res.value;
    }
    if (isObject(res)) {
      return isReadonly2 ? readonly(res) : reactive(res);
    }
    return res;
  };
}
const set$1 = /* @__PURE__ */ createSetter();
const shallowSet = /* @__PURE__ */ createSetter(true);
function createSetter(shallow = false) {
  return function set2(target, key, value, receiver) {
    let oldValue = target[key];
    if (isReadonly(oldValue) && isRef(oldValue) && !isRef(value)) {
      return false;
    }
    if (!shallow) {
      if (!isShallow(value) && !isReadonly(value)) {
        oldValue = toRaw(oldValue);
        value = toRaw(value);
      }
      if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
        oldValue.value = value;
        return true;
      }
    }
    const hadKey = isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
    const result = Reflect.set(target, key, value, receiver);
    if (target === toRaw(receiver)) {
      if (!hadKey) {
        trigger(target, "add", key, value);
      } else if (hasChanged(value, oldValue)) {
        trigger(target, "set", key, value);
      }
    }
    return result;
  };
}
function deleteProperty(target, key) {
  const hadKey = hasOwn(target, key);
  target[key];
  const result = Reflect.deleteProperty(target, key);
  if (result && hadKey) {
    trigger(target, "delete", key, void 0);
  }
  return result;
}
function has$1(target, key) {
  const result = Reflect.has(target, key);
  if (!isSymbol(key) || !builtInSymbols.has(key)) {
    track(target, "has", key);
  }
  return result;
}
function ownKeys(target) {
  track(target, "iterate", isArray(target) ? "length" : ITERATE_KEY);
  return Reflect.ownKeys(target);
}
const mutableHandlers = {
  get: get$1,
  set: set$1,
  deleteProperty,
  has: has$1,
  ownKeys
};
const readonlyHandlers = {
  get: readonlyGet,
  set(target, key) {
    return true;
  },
  deleteProperty(target, key) {
    return true;
  }
};
const shallowReactiveHandlers = /* @__PURE__ */ extend({}, mutableHandlers, {
  get: shallowGet,
  set: shallowSet
});
const toShallow = (value) => value;
const getProto = (v) => Reflect.getPrototypeOf(v);
function get(target, key, isReadonly2 = false, isShallow2 = false) {
  target = target[
    "__v_raw"
    /* ReactiveFlags.RAW */
  ];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (!isReadonly2) {
    if (key !== rawKey) {
      track(rawTarget, "get", key);
    }
    track(rawTarget, "get", rawKey);
  }
  const { has: has2 } = getProto(rawTarget);
  const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
  if (has2.call(rawTarget, key)) {
    return wrap(target.get(key));
  } else if (has2.call(rawTarget, rawKey)) {
    return wrap(target.get(rawKey));
  } else if (target !== rawTarget) {
    target.get(key);
  }
}
function has(key, isReadonly2 = false) {
  const target = this[
    "__v_raw"
    /* ReactiveFlags.RAW */
  ];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (!isReadonly2) {
    if (key !== rawKey) {
      track(rawTarget, "has", key);
    }
    track(rawTarget, "has", rawKey);
  }
  return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
}
function size(target, isReadonly2 = false) {
  target = target[
    "__v_raw"
    /* ReactiveFlags.RAW */
  ];
  !isReadonly2 && track(toRaw(target), "iterate", ITERATE_KEY);
  return Reflect.get(target, "size", target);
}
function add(value) {
  value = toRaw(value);
  const target = toRaw(this);
  const proto = getProto(target);
  const hadKey = proto.has.call(target, value);
  if (!hadKey) {
    target.add(value);
    trigger(target, "add", value, value);
  }
  return this;
}
function set(key, value) {
  value = toRaw(value);
  const target = toRaw(this);
  const { has: has2, get: get2 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  }
  const oldValue = get2.call(target, key);
  target.set(key, value);
  if (!hadKey) {
    trigger(target, "add", key, value);
  } else if (hasChanged(value, oldValue)) {
    trigger(target, "set", key, value);
  }
  return this;
}
function deleteEntry(key) {
  const target = toRaw(this);
  const { has: has2, get: get2 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  }
  get2 ? get2.call(target, key) : void 0;
  const result = target.delete(key);
  if (hadKey) {
    trigger(target, "delete", key, void 0);
  }
  return result;
}
function clear() {
  const target = toRaw(this);
  const hadItems = target.size !== 0;
  const result = target.clear();
  if (hadItems) {
    trigger(target, "clear", void 0, void 0);
  }
  return result;
}
function createForEach(isReadonly2, isShallow2) {
  return function forEach(callback, thisArg) {
    const observed = this;
    const target = observed[
      "__v_raw"
      /* ReactiveFlags.RAW */
    ];
    const rawTarget = toRaw(target);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(rawTarget, "iterate", ITERATE_KEY);
    return target.forEach((value, key) => {
      return callback.call(thisArg, wrap(value), wrap(key), observed);
    });
  };
}
function createIterableMethod(method, isReadonly2, isShallow2) {
  return function(...args) {
    const target = this[
      "__v_raw"
      /* ReactiveFlags.RAW */
    ];
    const rawTarget = toRaw(target);
    const targetIsMap = isMap(rawTarget);
    const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
    const isKeyOnly = method === "keys" && targetIsMap;
    const innerIterator = target[method](...args);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(rawTarget, "iterate", isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY);
    return {
      // iterator protocol
      next() {
        const { value, done } = innerIterator.next();
        return done ? { value, done } : {
          value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
          done
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function createReadonlyMethod(type) {
  return function(...args) {
    return type === "delete" ? false : this;
  };
}
function createInstrumentations() {
  const mutableInstrumentations2 = {
    get(key) {
      return get(this, key);
    },
    get size() {
      return size(this);
    },
    has,
    add,
    set,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, false)
  };
  const shallowInstrumentations2 = {
    get(key) {
      return get(this, key, false, true);
    },
    get size() {
      return size(this);
    },
    has,
    add,
    set,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, true)
  };
  const readonlyInstrumentations2 = {
    get(key) {
      return get(this, key, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has.call(this, key, true);
    },
    add: createReadonlyMethod(
      "add"
      /* TriggerOpTypes.ADD */
    ),
    set: createReadonlyMethod(
      "set"
      /* TriggerOpTypes.SET */
    ),
    delete: createReadonlyMethod(
      "delete"
      /* TriggerOpTypes.DELETE */
    ),
    clear: createReadonlyMethod(
      "clear"
      /* TriggerOpTypes.CLEAR */
    ),
    forEach: createForEach(true, false)
  };
  const shallowReadonlyInstrumentations2 = {
    get(key) {
      return get(this, key, true, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has.call(this, key, true);
    },
    add: createReadonlyMethod(
      "add"
      /* TriggerOpTypes.ADD */
    ),
    set: createReadonlyMethod(
      "set"
      /* TriggerOpTypes.SET */
    ),
    delete: createReadonlyMethod(
      "delete"
      /* TriggerOpTypes.DELETE */
    ),
    clear: createReadonlyMethod(
      "clear"
      /* TriggerOpTypes.CLEAR */
    ),
    forEach: createForEach(true, true)
  };
  const iteratorMethods = ["keys", "values", "entries", Symbol.iterator];
  iteratorMethods.forEach((method) => {
    mutableInstrumentations2[method] = createIterableMethod(method, false, false);
    readonlyInstrumentations2[method] = createIterableMethod(method, true, false);
    shallowInstrumentations2[method] = createIterableMethod(method, false, true);
    shallowReadonlyInstrumentations2[method] = createIterableMethod(method, true, true);
  });
  return [
    mutableInstrumentations2,
    readonlyInstrumentations2,
    shallowInstrumentations2,
    shallowReadonlyInstrumentations2
  ];
}
const [mutableInstrumentations, readonlyInstrumentations, shallowInstrumentations, shallowReadonlyInstrumentations] = /* @__PURE__ */ createInstrumentations();
function createInstrumentationGetter(isReadonly2, shallow) {
  const instrumentations = shallow ? isReadonly2 ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly2 ? readonlyInstrumentations : mutableInstrumentations;
  return (target, key, receiver) => {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_raw") {
      return target;
    }
    return Reflect.get(hasOwn(instrumentations, key) && key in target ? instrumentations : target, key, receiver);
  };
}
const mutableCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, false)
};
const shallowCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, true)
};
const readonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, false)
};
const reactiveMap = /* @__PURE__ */ new WeakMap();
const shallowReactiveMap = /* @__PURE__ */ new WeakMap();
const readonlyMap = /* @__PURE__ */ new WeakMap();
const shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
function targetTypeMap(rawType) {
  switch (rawType) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function getTargetType(value) {
  return value[
    "__v_skip"
    /* ReactiveFlags.SKIP */
  ] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
}
function reactive(target) {
  if (isReadonly(target)) {
    return target;
  }
  return createReactiveObject(target, false, mutableHandlers, mutableCollectionHandlers, reactiveMap);
}
function shallowReactive(target) {
  return createReactiveObject(target, false, shallowReactiveHandlers, shallowCollectionHandlers, shallowReactiveMap);
}
function readonly(target) {
  return createReactiveObject(target, true, readonlyHandlers, readonlyCollectionHandlers, readonlyMap);
}
function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
  if (!isObject(target)) {
    return target;
  }
  if (target[
    "__v_raw"
    /* ReactiveFlags.RAW */
  ] && !(isReadonly2 && target[
    "__v_isReactive"
    /* ReactiveFlags.IS_REACTIVE */
  ])) {
    return target;
  }
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }
  const targetType = getTargetType(target);
  if (targetType === 0) {
    return target;
  }
  const proxy = new Proxy(target, targetType === 2 ? collectionHandlers : baseHandlers);
  proxyMap.set(target, proxy);
  return proxy;
}
function isReactive(value) {
  if (isReadonly(value)) {
    return isReactive(value[
      "__v_raw"
      /* ReactiveFlags.RAW */
    ]);
  }
  return !!(value && value[
    "__v_isReactive"
    /* ReactiveFlags.IS_REACTIVE */
  ]);
}
function isReadonly(value) {
  return !!(value && value[
    "__v_isReadonly"
    /* ReactiveFlags.IS_READONLY */
  ]);
}
function isShallow(value) {
  return !!(value && value[
    "__v_isShallow"
    /* ReactiveFlags.IS_SHALLOW */
  ]);
}
function isProxy(value) {
  return isReactive(value) || isReadonly(value);
}
function toRaw(observed) {
  const raw = observed && observed[
    "__v_raw"
    /* ReactiveFlags.RAW */
  ];
  return raw ? toRaw(raw) : observed;
}
function markRaw(value) {
  def(value, "__v_skip", true);
  return value;
}
const toReactive = (value) => isObject(value) ? reactive(value) : value;
const toReadonly = (value) => isObject(value) ? readonly(value) : value;
function trackRefValue(ref) {
  if (shouldTrack && activeEffect) {
    ref = toRaw(ref);
    {
      trackEffects(ref.dep || (ref.dep = createDep()));
    }
  }
}
function triggerRefValue(ref, newVal) {
  ref = toRaw(ref);
  const dep = ref.dep;
  if (dep) {
    {
      triggerEffects(dep);
    }
  }
}
function isRef(r) {
  return !!(r && r.__v_isRef === true);
}
function unref(ref) {
  return isRef(ref) ? ref.value : ref;
}
const shallowUnwrapHandlers = {
  get: (target, key, receiver) => unref(Reflect.get(target, key, receiver)),
  set: (target, key, value, receiver) => {
    const oldValue = target[key];
    if (isRef(oldValue) && !isRef(value)) {
      oldValue.value = value;
      return true;
    } else {
      return Reflect.set(target, key, value, receiver);
    }
  }
};
function proxyRefs(objectWithRefs) {
  return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
}
var _a$1;
class ComputedRefImpl {
  constructor(getter, _setter, isReadonly2, isSSR) {
    this._setter = _setter;
    this.dep = void 0;
    this.__v_isRef = true;
    this[_a$1] = false;
    this._dirty = true;
    this.effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true;
        triggerRefValue(this);
      }
    });
    this.effect.computed = this;
    this.effect.active = this._cacheable = !isSSR;
    this[
      "__v_isReadonly"
      /* ReactiveFlags.IS_READONLY */
    ] = isReadonly2;
  }
  get value() {
    const self2 = toRaw(this);
    trackRefValue(self2);
    if (self2._dirty || !self2._cacheable) {
      self2._dirty = false;
      self2._value = self2.effect.run();
    }
    return self2._value;
  }
  set value(newValue) {
    this._setter(newValue);
  }
}
_a$1 = "__v_isReadonly";
function computed$1(getterOrOptions, debugOptions, isSSR = false) {
  let getter;
  let setter;
  const onlyGetter = isFunction(getterOrOptions);
  if (onlyGetter) {
    getter = getterOrOptions;
    setter = NOOP;
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter, isSSR);
  return cRef;
}
function warn(msg, ...args) {
  return;
}
function callWithErrorHandling(fn, instance, type, args) {
  let res;
  try {
    res = args ? fn(...args) : fn();
  } catch (err) {
    handleError(err, instance, type);
  }
  return res;
}
function callWithAsyncErrorHandling(fn, instance, type, args) {
  if (isFunction(fn)) {
    const res = callWithErrorHandling(fn, instance, type, args);
    if (res && isPromise(res)) {
      res.catch((err) => {
        handleError(err, instance, type);
      });
    }
    return res;
  }
  const values = [];
  for (let i = 0; i < fn.length; i++) {
    values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
  }
  return values;
}
function handleError(err, instance, type, throwInDev = true) {
  const contextVNode = instance ? instance.vnode : null;
  if (instance) {
    let cur = instance.parent;
    const exposedInstance = instance.proxy;
    const errorInfo = type;
    while (cur) {
      const errorCapturedHooks = cur.ec;
      if (errorCapturedHooks) {
        for (let i = 0; i < errorCapturedHooks.length; i++) {
          if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
            return;
          }
        }
      }
      cur = cur.parent;
    }
    const appErrorHandler = instance.appContext.config.errorHandler;
    if (appErrorHandler) {
      callWithErrorHandling(appErrorHandler, null, 10, [err, exposedInstance, errorInfo]);
      return;
    }
  }
  logError(err, type, contextVNode, throwInDev);
}
function logError(err, type, contextVNode, throwInDev = true) {
  {
    console.error(err);
  }
}
let isFlushing = false;
let isFlushPending = false;
const queue = [];
let flushIndex = 0;
const pendingPostFlushCbs = [];
let activePostFlushCbs = null;
let postFlushIndex = 0;
const resolvedPromise = /* @__PURE__ */ Promise.resolve();
let currentFlushPromise = null;
function nextTick(fn) {
  const p2 = currentFlushPromise || resolvedPromise;
  return fn ? p2.then(this ? fn.bind(this) : fn) : p2;
}
function findInsertionIndex(id) {
  let start = flushIndex + 1;
  let end = queue.length;
  while (start < end) {
    const middle = start + end >>> 1;
    const middleJobId = getId(queue[middle]);
    middleJobId < id ? start = middle + 1 : end = middle;
  }
  return start;
}
function queueJob(job) {
  if (!queue.length || !queue.includes(job, isFlushing && job.allowRecurse ? flushIndex + 1 : flushIndex)) {
    if (job.id == null) {
      queue.push(job);
    } else {
      queue.splice(findInsertionIndex(job.id), 0, job);
    }
    queueFlush();
  }
}
function queueFlush() {
  if (!isFlushing && !isFlushPending) {
    isFlushPending = true;
    currentFlushPromise = resolvedPromise.then(flushJobs);
  }
}
function invalidateJob(job) {
  const i = queue.indexOf(job);
  if (i > flushIndex) {
    queue.splice(i, 1);
  }
}
function queuePostFlushCb(cb) {
  if (!isArray(cb)) {
    if (!activePostFlushCbs || !activePostFlushCbs.includes(cb, cb.allowRecurse ? postFlushIndex + 1 : postFlushIndex)) {
      pendingPostFlushCbs.push(cb);
    }
  } else {
    pendingPostFlushCbs.push(...cb);
  }
  queueFlush();
}
function flushPreFlushCbs(seen, i = isFlushing ? flushIndex + 1 : 0) {
  for (; i < queue.length; i++) {
    const cb = queue[i];
    if (cb && cb.pre) {
      queue.splice(i, 1);
      i--;
      cb();
    }
  }
}
function flushPostFlushCbs(seen) {
  if (pendingPostFlushCbs.length) {
    const deduped = [...new Set(pendingPostFlushCbs)];
    pendingPostFlushCbs.length = 0;
    if (activePostFlushCbs) {
      activePostFlushCbs.push(...deduped);
      return;
    }
    activePostFlushCbs = deduped;
    activePostFlushCbs.sort((a, b) => getId(a) - getId(b));
    for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
      activePostFlushCbs[postFlushIndex]();
    }
    activePostFlushCbs = null;
    postFlushIndex = 0;
  }
}
const getId = (job) => job.id == null ? Infinity : job.id;
const comparator = (a, b) => {
  const diff = getId(a) - getId(b);
  if (diff === 0) {
    if (a.pre && !b.pre)
      return -1;
    if (b.pre && !a.pre)
      return 1;
  }
  return diff;
};
function flushJobs(seen) {
  isFlushPending = false;
  isFlushing = true;
  queue.sort(comparator);
  const check = NOOP;
  try {
    for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
      const job = queue[flushIndex];
      if (job && job.active !== false) {
        if (false)
          ;
        callWithErrorHandling(
          job,
          null,
          14
          /* ErrorCodes.SCHEDULER */
        );
      }
    }
  } finally {
    flushIndex = 0;
    queue.length = 0;
    flushPostFlushCbs();
    isFlushing = false;
    currentFlushPromise = null;
    if (queue.length || pendingPostFlushCbs.length) {
      flushJobs();
    }
  }
}
function emit(instance, event, ...rawArgs) {
  if (instance.isUnmounted)
    return;
  const props = instance.vnode.props || EMPTY_OBJ;
  let args = rawArgs;
  const isModelListener2 = event.startsWith("update:");
  const modelArg = isModelListener2 && event.slice(7);
  if (modelArg && modelArg in props) {
    const modifiersKey = `${modelArg === "modelValue" ? "model" : modelArg}Modifiers`;
    const { number, trim } = props[modifiersKey] || EMPTY_OBJ;
    if (trim) {
      args = rawArgs.map((a) => isString(a) ? a.trim() : a);
    }
    if (number) {
      args = rawArgs.map(looseToNumber);
    }
  }
  let handlerName;
  let handler = props[handlerName = toHandlerKey(event)] || // also try camelCase event handler (#2249)
  props[handlerName = toHandlerKey(camelize(event))];
  if (!handler && isModelListener2) {
    handler = props[handlerName = toHandlerKey(hyphenate(event))];
  }
  if (handler) {
    callWithAsyncErrorHandling(handler, instance, 6, args);
  }
  const onceHandler = props[handlerName + `Once`];
  if (onceHandler) {
    if (!instance.emitted) {
      instance.emitted = {};
    } else if (instance.emitted[handlerName]) {
      return;
    }
    instance.emitted[handlerName] = true;
    callWithAsyncErrorHandling(onceHandler, instance, 6, args);
  }
}
function normalizeEmitsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.emitsCache;
  const cached = cache.get(comp);
  if (cached !== void 0) {
    return cached;
  }
  const raw = comp.emits;
  let normalized = {};
  let hasExtends = false;
  if (!isFunction(comp)) {
    const extendEmits = (raw2) => {
      const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
      if (normalizedFromExtend) {
        hasExtends = true;
        extend(normalized, normalizedFromExtend);
      }
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendEmits);
    }
    if (comp.extends) {
      extendEmits(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendEmits);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject(comp)) {
      cache.set(comp, null);
    }
    return null;
  }
  if (isArray(raw)) {
    raw.forEach((key) => normalized[key] = null);
  } else {
    extend(normalized, raw);
  }
  if (isObject(comp)) {
    cache.set(comp, normalized);
  }
  return normalized;
}
function isEmitListener(options, key) {
  if (!options || !isOn(key)) {
    return false;
  }
  key = key.slice(2).replace(/Once$/, "");
  return hasOwn(options, key[0].toLowerCase() + key.slice(1)) || hasOwn(options, hyphenate(key)) || hasOwn(options, key);
}
let currentRenderingInstance = null;
let currentScopeId = null;
function setCurrentRenderingInstance(instance) {
  const prev = currentRenderingInstance;
  currentRenderingInstance = instance;
  currentScopeId = instance && instance.type.__scopeId || null;
  return prev;
}
function withCtx(fn, ctx = currentRenderingInstance, isNonScopedSlot) {
  if (!ctx)
    return fn;
  if (fn._n) {
    return fn;
  }
  const renderFnWithContext = (...args) => {
    if (renderFnWithContext._d) {
      setBlockTracking(-1);
    }
    const prevInstance = setCurrentRenderingInstance(ctx);
    let res;
    try {
      res = fn(...args);
    } finally {
      setCurrentRenderingInstance(prevInstance);
      if (renderFnWithContext._d) {
        setBlockTracking(1);
      }
    }
    return res;
  };
  renderFnWithContext._n = true;
  renderFnWithContext._c = true;
  renderFnWithContext._d = true;
  return renderFnWithContext;
}
function markAttrsAccessed() {
}
function renderComponentRoot(instance) {
  const { type: Component, vnode, proxy, withProxy, props, propsOptions: [propsOptions], slots, attrs, emit: emit2, render, renderCache, data, setupState, ctx, inheritAttrs } = instance;
  let result;
  let fallthroughAttrs;
  const prev = setCurrentRenderingInstance(instance);
  try {
    if (vnode.shapeFlag & 4) {
      const proxyToUse = withProxy || proxy;
      result = normalizeVNode(render.call(proxyToUse, proxyToUse, renderCache, props, setupState, data, ctx));
      fallthroughAttrs = attrs;
    } else {
      const render2 = Component;
      if (false)
        ;
      result = normalizeVNode(render2.length > 1 ? render2(props, false ? {
        get attrs() {
          markAttrsAccessed();
          return attrs;
        },
        slots,
        emit: emit2
      } : { attrs, slots, emit: emit2 }) : render2(
        props,
        null
        /* we know it doesn't need it */
      ));
      fallthroughAttrs = Component.props ? attrs : getFunctionalFallthrough(attrs);
    }
  } catch (err) {
    blockStack.length = 0;
    handleError(
      err,
      instance,
      1
      /* ErrorCodes.RENDER_FUNCTION */
    );
    result = createVNode(Comment);
  }
  let root = result;
  if (fallthroughAttrs && inheritAttrs !== false) {
    const keys = Object.keys(fallthroughAttrs);
    const { shapeFlag } = root;
    if (keys.length) {
      if (shapeFlag & (1 | 6)) {
        if (propsOptions && keys.some(isModelListener)) {
          fallthroughAttrs = filterModelListeners(fallthroughAttrs, propsOptions);
        }
        root = cloneVNode(root, fallthroughAttrs);
      }
    }
  }
  if (vnode.dirs) {
    root = cloneVNode(root);
    root.dirs = root.dirs ? root.dirs.concat(vnode.dirs) : vnode.dirs;
  }
  if (vnode.transition) {
    root.transition = vnode.transition;
  }
  {
    result = root;
  }
  setCurrentRenderingInstance(prev);
  return result;
}
const getFunctionalFallthrough = (attrs) => {
  let res;
  for (const key in attrs) {
    if (key === "class" || key === "style" || isOn(key)) {
      (res || (res = {}))[key] = attrs[key];
    }
  }
  return res;
};
const filterModelListeners = (attrs, props) => {
  const res = {};
  for (const key in attrs) {
    if (!isModelListener(key) || !(key.slice(9) in props)) {
      res[key] = attrs[key];
    }
  }
  return res;
};
function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
  const { props: prevProps, children: prevChildren, component } = prevVNode;
  const { props: nextProps, children: nextChildren, patchFlag } = nextVNode;
  const emits = component.emitsOptions;
  if (nextVNode.dirs || nextVNode.transition) {
    return true;
  }
  if (optimized && patchFlag >= 0) {
    if (patchFlag & 1024) {
      return true;
    }
    if (patchFlag & 16) {
      if (!prevProps) {
        return !!nextProps;
      }
      return hasPropsChanged(prevProps, nextProps, emits);
    } else if (patchFlag & 8) {
      const dynamicProps = nextVNode.dynamicProps;
      for (let i = 0; i < dynamicProps.length; i++) {
        const key = dynamicProps[i];
        if (nextProps[key] !== prevProps[key] && !isEmitListener(emits, key)) {
          return true;
        }
      }
    }
  } else {
    if (prevChildren || nextChildren) {
      if (!nextChildren || !nextChildren.$stable) {
        return true;
      }
    }
    if (prevProps === nextProps) {
      return false;
    }
    if (!prevProps) {
      return !!nextProps;
    }
    if (!nextProps) {
      return true;
    }
    return hasPropsChanged(prevProps, nextProps, emits);
  }
  return false;
}
function hasPropsChanged(prevProps, nextProps, emitsOptions) {
  const nextKeys = Object.keys(nextProps);
  if (nextKeys.length !== Object.keys(prevProps).length) {
    return true;
  }
  for (let i = 0; i < nextKeys.length; i++) {
    const key = nextKeys[i];
    if (nextProps[key] !== prevProps[key] && !isEmitListener(emitsOptions, key)) {
      return true;
    }
  }
  return false;
}
function updateHOCHostEl({ vnode, parent }, el) {
  while (parent && parent.subTree === vnode) {
    (vnode = parent.vnode).el = el;
    parent = parent.parent;
  }
}
const isSuspense = (type) => type.__isSuspense;
function queueEffectWithSuspense(fn, suspense) {
  if (suspense && suspense.pendingBranch) {
    if (isArray(fn)) {
      suspense.effects.push(...fn);
    } else {
      suspense.effects.push(fn);
    }
  } else {
    queuePostFlushCb(fn);
  }
}
function provide(key, value) {
  if (!currentInstance)
    ;
  else {
    let provides = currentInstance.provides;
    const parentProvides = currentInstance.parent && currentInstance.parent.provides;
    if (parentProvides === provides) {
      provides = currentInstance.provides = Object.create(parentProvides);
    }
    provides[key] = value;
  }
}
function inject(key, defaultValue, treatDefaultAsFactory = false) {
  const instance = currentInstance || currentRenderingInstance;
  if (instance) {
    const provides = instance.parent == null ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides;
    if (provides && key in provides) {
      return provides[key];
    } else if (arguments.length > 1) {
      return treatDefaultAsFactory && isFunction(defaultValue) ? defaultValue.call(instance.proxy) : defaultValue;
    } else
      ;
  }
}
const INITIAL_WATCHER_VALUE = {};
function watch(source, cb, options) {
  return doWatch(source, cb, options);
}
function doWatch(source, cb, { immediate, deep, flush, onTrack, onTrigger } = EMPTY_OBJ) {
  const instance = getCurrentScope() === (currentInstance === null || currentInstance === void 0 ? void 0 : currentInstance.scope) ? currentInstance : null;
  let getter;
  let forceTrigger = false;
  let isMultiSource = false;
  if (isRef(source)) {
    getter = () => source.value;
    forceTrigger = isShallow(source);
  } else if (isReactive(source)) {
    getter = () => source;
    deep = true;
  } else if (isArray(source)) {
    isMultiSource = true;
    forceTrigger = source.some((s) => isReactive(s) || isShallow(s));
    getter = () => source.map((s) => {
      if (isRef(s)) {
        return s.value;
      } else if (isReactive(s)) {
        return traverse(s);
      } else if (isFunction(s)) {
        return callWithErrorHandling(
          s,
          instance,
          2
          /* ErrorCodes.WATCH_GETTER */
        );
      } else
        ;
    });
  } else if (isFunction(source)) {
    if (cb) {
      getter = () => callWithErrorHandling(
        source,
        instance,
        2
        /* ErrorCodes.WATCH_GETTER */
      );
    } else {
      getter = () => {
        if (instance && instance.isUnmounted) {
          return;
        }
        if (cleanup) {
          cleanup();
        }
        return callWithAsyncErrorHandling(source, instance, 3, [onCleanup]);
      };
    }
  } else {
    getter = NOOP;
  }
  if (cb && deep) {
    const baseGetter = getter;
    getter = () => traverse(baseGetter());
  }
  let cleanup;
  let onCleanup = (fn) => {
    cleanup = effect.onStop = () => {
      callWithErrorHandling(
        fn,
        instance,
        4
        /* ErrorCodes.WATCH_CLEANUP */
      );
    };
  };
  let ssrCleanup;
  if (isInSSRComponentSetup) {
    onCleanup = NOOP;
    if (!cb) {
      getter();
    } else if (immediate) {
      callWithAsyncErrorHandling(cb, instance, 3, [
        getter(),
        isMultiSource ? [] : void 0,
        onCleanup
      ]);
    }
    if (flush === "sync") {
      const ctx = useSSRContext();
      ssrCleanup = ctx.__watcherHandles || (ctx.__watcherHandles = []);
    } else {
      return NOOP;
    }
  }
  let oldValue = isMultiSource ? new Array(source.length).fill(INITIAL_WATCHER_VALUE) : INITIAL_WATCHER_VALUE;
  const job = () => {
    if (!effect.active) {
      return;
    }
    if (cb) {
      const newValue = effect.run();
      if (deep || forceTrigger || (isMultiSource ? newValue.some((v, i) => hasChanged(v, oldValue[i])) : hasChanged(newValue, oldValue)) || false) {
        if (cleanup) {
          cleanup();
        }
        callWithAsyncErrorHandling(cb, instance, 3, [
          newValue,
          // pass undefined as the old value when it's changed for the first time
          oldValue === INITIAL_WATCHER_VALUE ? void 0 : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE ? [] : oldValue,
          onCleanup
        ]);
        oldValue = newValue;
      }
    } else {
      effect.run();
    }
  };
  job.allowRecurse = !!cb;
  let scheduler;
  if (flush === "sync") {
    scheduler = job;
  } else if (flush === "post") {
    scheduler = () => queuePostRenderEffect(job, instance && instance.suspense);
  } else {
    job.pre = true;
    if (instance)
      job.id = instance.uid;
    scheduler = () => queueJob(job);
  }
  const effect = new ReactiveEffect(getter, scheduler);
  if (cb) {
    if (immediate) {
      job();
    } else {
      oldValue = effect.run();
    }
  } else if (flush === "post") {
    queuePostRenderEffect(effect.run.bind(effect), instance && instance.suspense);
  } else {
    effect.run();
  }
  const unwatch = () => {
    effect.stop();
    if (instance && instance.scope) {
      remove(instance.scope.effects, effect);
    }
  };
  if (ssrCleanup)
    ssrCleanup.push(unwatch);
  return unwatch;
}
function instanceWatch(source, value, options) {
  const publicThis = this.proxy;
  const getter = isString(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
  let cb;
  if (isFunction(value)) {
    cb = value;
  } else {
    cb = value.handler;
    options = value;
  }
  const cur = currentInstance;
  setCurrentInstance(this);
  const res = doWatch(getter, cb.bind(publicThis), options);
  if (cur) {
    setCurrentInstance(cur);
  } else {
    unsetCurrentInstance();
  }
  return res;
}
function createPathGetter(ctx, path) {
  const segments = path.split(".");
  return () => {
    let cur = ctx;
    for (let i = 0; i < segments.length && cur; i++) {
      cur = cur[segments[i]];
    }
    return cur;
  };
}
function traverse(value, seen) {
  if (!isObject(value) || value[
    "__v_skip"
    /* ReactiveFlags.SKIP */
  ]) {
    return value;
  }
  seen = seen || /* @__PURE__ */ new Set();
  if (seen.has(value)) {
    return value;
  }
  seen.add(value);
  if (isRef(value)) {
    traverse(value.value, seen);
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      traverse(value[i], seen);
    }
  } else if (isSet(value) || isMap(value)) {
    value.forEach((v) => {
      traverse(v, seen);
    });
  } else if (isPlainObject(value)) {
    for (const key in value) {
      traverse(value[key], seen);
    }
  }
  return value;
}
function useTransitionState() {
  const state = {
    isMounted: false,
    isLeaving: false,
    isUnmounting: false,
    leavingVNodes: /* @__PURE__ */ new Map()
  };
  onMounted(() => {
    state.isMounted = true;
  });
  onBeforeUnmount(() => {
    state.isUnmounting = true;
  });
  return state;
}
const TransitionHookValidator = [Function, Array];
const BaseTransitionImpl = {
  name: `BaseTransition`,
  props: {
    mode: String,
    appear: Boolean,
    persisted: Boolean,
    // enter
    onBeforeEnter: TransitionHookValidator,
    onEnter: TransitionHookValidator,
    onAfterEnter: TransitionHookValidator,
    onEnterCancelled: TransitionHookValidator,
    // leave
    onBeforeLeave: TransitionHookValidator,
    onLeave: TransitionHookValidator,
    onAfterLeave: TransitionHookValidator,
    onLeaveCancelled: TransitionHookValidator,
    // appear
    onBeforeAppear: TransitionHookValidator,
    onAppear: TransitionHookValidator,
    onAfterAppear: TransitionHookValidator,
    onAppearCancelled: TransitionHookValidator
  },
  setup(props, { slots }) {
    const instance = getCurrentInstance();
    const state = useTransitionState();
    let prevTransitionKey;
    return () => {
      const children = slots.default && getTransitionRawChildren(slots.default(), true);
      if (!children || !children.length) {
        return;
      }
      let child = children[0];
      if (children.length > 1) {
        for (const c of children) {
          if (c.type !== Comment) {
            child = c;
            break;
          }
        }
      }
      const rawProps = toRaw(props);
      const { mode } = rawProps;
      if (state.isLeaving) {
        return emptyPlaceholder(child);
      }
      const innerChild = getKeepAliveChild(child);
      if (!innerChild) {
        return emptyPlaceholder(child);
      }
      const enterHooks = resolveTransitionHooks(innerChild, rawProps, state, instance);
      setTransitionHooks(innerChild, enterHooks);
      const oldChild = instance.subTree;
      const oldInnerChild = oldChild && getKeepAliveChild(oldChild);
      let transitionKeyChanged = false;
      const { getTransitionKey } = innerChild.type;
      if (getTransitionKey) {
        const key = getTransitionKey();
        if (prevTransitionKey === void 0) {
          prevTransitionKey = key;
        } else if (key !== prevTransitionKey) {
          prevTransitionKey = key;
          transitionKeyChanged = true;
        }
      }
      if (oldInnerChild && oldInnerChild.type !== Comment && (!isSameVNodeType(innerChild, oldInnerChild) || transitionKeyChanged)) {
        const leavingHooks = resolveTransitionHooks(oldInnerChild, rawProps, state, instance);
        setTransitionHooks(oldInnerChild, leavingHooks);
        if (mode === "out-in") {
          state.isLeaving = true;
          leavingHooks.afterLeave = () => {
            state.isLeaving = false;
            if (instance.update.active !== false) {
              instance.update();
            }
          };
          return emptyPlaceholder(child);
        } else if (mode === "in-out" && innerChild.type !== Comment) {
          leavingHooks.delayLeave = (el, earlyRemove, delayedLeave) => {
            const leavingVNodesCache = getLeavingNodesForType(state, oldInnerChild);
            leavingVNodesCache[String(oldInnerChild.key)] = oldInnerChild;
            el._leaveCb = () => {
              earlyRemove();
              el._leaveCb = void 0;
              delete enterHooks.delayedLeave;
            };
            enterHooks.delayedLeave = delayedLeave;
          };
        }
      }
      return child;
    };
  }
};
const BaseTransition = BaseTransitionImpl;
function getLeavingNodesForType(state, vnode) {
  const { leavingVNodes } = state;
  let leavingVNodesCache = leavingVNodes.get(vnode.type);
  if (!leavingVNodesCache) {
    leavingVNodesCache = /* @__PURE__ */ Object.create(null);
    leavingVNodes.set(vnode.type, leavingVNodesCache);
  }
  return leavingVNodesCache;
}
function resolveTransitionHooks(vnode, props, state, instance) {
  const { appear, mode, persisted = false, onBeforeEnter, onEnter, onAfterEnter, onEnterCancelled, onBeforeLeave, onLeave, onAfterLeave, onLeaveCancelled, onBeforeAppear, onAppear, onAfterAppear, onAppearCancelled } = props;
  const key = String(vnode.key);
  const leavingVNodesCache = getLeavingNodesForType(state, vnode);
  const callHook2 = (hook, args) => {
    hook && callWithAsyncErrorHandling(hook, instance, 9, args);
  };
  const callAsyncHook = (hook, args) => {
    const done = args[1];
    callHook2(hook, args);
    if (isArray(hook)) {
      if (hook.every((hook2) => hook2.length <= 1))
        done();
    } else if (hook.length <= 1) {
      done();
    }
  };
  const hooks = {
    mode,
    persisted,
    beforeEnter(el) {
      let hook = onBeforeEnter;
      if (!state.isMounted) {
        if (appear) {
          hook = onBeforeAppear || onBeforeEnter;
        } else {
          return;
        }
      }
      if (el._leaveCb) {
        el._leaveCb(
          true
          /* cancelled */
        );
      }
      const leavingVNode = leavingVNodesCache[key];
      if (leavingVNode && isSameVNodeType(vnode, leavingVNode) && leavingVNode.el._leaveCb) {
        leavingVNode.el._leaveCb();
      }
      callHook2(hook, [el]);
    },
    enter(el) {
      let hook = onEnter;
      let afterHook = onAfterEnter;
      let cancelHook = onEnterCancelled;
      if (!state.isMounted) {
        if (appear) {
          hook = onAppear || onEnter;
          afterHook = onAfterAppear || onAfterEnter;
          cancelHook = onAppearCancelled || onEnterCancelled;
        } else {
          return;
        }
      }
      let called = false;
      const done = el._enterCb = (cancelled) => {
        if (called)
          return;
        called = true;
        if (cancelled) {
          callHook2(cancelHook, [el]);
        } else {
          callHook2(afterHook, [el]);
        }
        if (hooks.delayedLeave) {
          hooks.delayedLeave();
        }
        el._enterCb = void 0;
      };
      if (hook) {
        callAsyncHook(hook, [el, done]);
      } else {
        done();
      }
    },
    leave(el, remove2) {
      const key2 = String(vnode.key);
      if (el._enterCb) {
        el._enterCb(
          true
          /* cancelled */
        );
      }
      if (state.isUnmounting) {
        return remove2();
      }
      callHook2(onBeforeLeave, [el]);
      let called = false;
      const done = el._leaveCb = (cancelled) => {
        if (called)
          return;
        called = true;
        remove2();
        if (cancelled) {
          callHook2(onLeaveCancelled, [el]);
        } else {
          callHook2(onAfterLeave, [el]);
        }
        el._leaveCb = void 0;
        if (leavingVNodesCache[key2] === vnode) {
          delete leavingVNodesCache[key2];
        }
      };
      leavingVNodesCache[key2] = vnode;
      if (onLeave) {
        callAsyncHook(onLeave, [el, done]);
      } else {
        done();
      }
    },
    clone(vnode2) {
      return resolveTransitionHooks(vnode2, props, state, instance);
    }
  };
  return hooks;
}
function emptyPlaceholder(vnode) {
  if (isKeepAlive(vnode)) {
    vnode = cloneVNode(vnode);
    vnode.children = null;
    return vnode;
  }
}
function getKeepAliveChild(vnode) {
  return isKeepAlive(vnode) ? vnode.children ? vnode.children[0] : void 0 : vnode;
}
function setTransitionHooks(vnode, hooks) {
  if (vnode.shapeFlag & 6 && vnode.component) {
    setTransitionHooks(vnode.component.subTree, hooks);
  } else if (vnode.shapeFlag & 128) {
    vnode.ssContent.transition = hooks.clone(vnode.ssContent);
    vnode.ssFallback.transition = hooks.clone(vnode.ssFallback);
  } else {
    vnode.transition = hooks;
  }
}
function getTransitionRawChildren(children, keepComment = false, parentKey) {
  let ret = [];
  let keyedFragmentCount = 0;
  for (let i = 0; i < children.length; i++) {
    let child = children[i];
    const key = parentKey == null ? child.key : String(parentKey) + String(child.key != null ? child.key : i);
    if (child.type === Fragment) {
      if (child.patchFlag & 128)
        keyedFragmentCount++;
      ret = ret.concat(getTransitionRawChildren(child.children, keepComment, key));
    } else if (keepComment || child.type !== Comment) {
      ret.push(key != null ? cloneVNode(child, { key }) : child);
    }
  }
  if (keyedFragmentCount > 1) {
    for (let i = 0; i < ret.length; i++) {
      ret[i].patchFlag = -2;
    }
  }
  return ret;
}
const isAsyncWrapper = (i) => !!i.type.__asyncLoader;
const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
function onActivated(hook, target) {
  registerKeepAliveHook(hook, "a", target);
}
function onDeactivated(hook, target) {
  registerKeepAliveHook(hook, "da", target);
}
function registerKeepAliveHook(hook, type, target = currentInstance) {
  const wrappedHook = hook.__wdc || (hook.__wdc = () => {
    let current = target;
    while (current) {
      if (current.isDeactivated) {
        return;
      }
      current = current.parent;
    }
    return hook();
  });
  injectHook(type, wrappedHook, target);
  if (target) {
    let current = target.parent;
    while (current && current.parent) {
      if (isKeepAlive(current.parent.vnode)) {
        injectToKeepAliveRoot(wrappedHook, type, target, current);
      }
      current = current.parent;
    }
  }
}
function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
  const injected = injectHook(
    type,
    hook,
    keepAliveRoot,
    true
    /* prepend */
  );
  onUnmounted(() => {
    remove(keepAliveRoot[type], injected);
  }, target);
}
function injectHook(type, hook, target = currentInstance, prepend = false) {
  if (target) {
    const hooks = target[type] || (target[type] = []);
    const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
      if (target.isUnmounted) {
        return;
      }
      pauseTracking();
      setCurrentInstance(target);
      const res = callWithAsyncErrorHandling(hook, target, type, args);
      unsetCurrentInstance();
      resetTracking();
      return res;
    });
    if (prepend) {
      hooks.unshift(wrappedHook);
    } else {
      hooks.push(wrappedHook);
    }
    return wrappedHook;
  }
}
const createHook = (lifecycle) => (hook, target = currentInstance) => (
  // post-create lifecycle registrations are noops during SSR (except for serverPrefetch)
  (!isInSSRComponentSetup || lifecycle === "sp") && injectHook(lifecycle, (...args) => hook(...args), target)
);
const onBeforeMount = createHook(
  "bm"
  /* LifecycleHooks.BEFORE_MOUNT */
);
const onMounted = createHook(
  "m"
  /* LifecycleHooks.MOUNTED */
);
const onBeforeUpdate = createHook(
  "bu"
  /* LifecycleHooks.BEFORE_UPDATE */
);
const onUpdated = createHook(
  "u"
  /* LifecycleHooks.UPDATED */
);
const onBeforeUnmount = createHook(
  "bum"
  /* LifecycleHooks.BEFORE_UNMOUNT */
);
const onUnmounted = createHook(
  "um"
  /* LifecycleHooks.UNMOUNTED */
);
const onServerPrefetch = createHook(
  "sp"
  /* LifecycleHooks.SERVER_PREFETCH */
);
const onRenderTriggered = createHook(
  "rtg"
  /* LifecycleHooks.RENDER_TRIGGERED */
);
const onRenderTracked = createHook(
  "rtc"
  /* LifecycleHooks.RENDER_TRACKED */
);
function onErrorCaptured(hook, target = currentInstance) {
  injectHook("ec", hook, target);
}
function withDirectives(vnode, directives) {
  const internalInstance = currentRenderingInstance;
  if (internalInstance === null) {
    return vnode;
  }
  const instance = getExposeProxy(internalInstance) || internalInstance.proxy;
  const bindings = vnode.dirs || (vnode.dirs = []);
  for (let i = 0; i < directives.length; i++) {
    let [dir, value, arg, modifiers = EMPTY_OBJ] = directives[i];
    if (dir) {
      if (isFunction(dir)) {
        dir = {
          mounted: dir,
          updated: dir
        };
      }
      if (dir.deep) {
        traverse(value);
      }
      bindings.push({
        dir,
        instance,
        value,
        oldValue: void 0,
        arg,
        modifiers
      });
    }
  }
  return vnode;
}
function invokeDirectiveHook(vnode, prevVNode, instance, name) {
  const bindings = vnode.dirs;
  const oldBindings = prevVNode && prevVNode.dirs;
  for (let i = 0; i < bindings.length; i++) {
    const binding = bindings[i];
    if (oldBindings) {
      binding.oldValue = oldBindings[i].value;
    }
    let hook = binding.dir[name];
    if (hook) {
      pauseTracking();
      callWithAsyncErrorHandling(hook, instance, 8, [
        vnode.el,
        binding,
        vnode,
        prevVNode
      ]);
      resetTracking();
    }
  }
}
const NULL_DYNAMIC_COMPONENT = Symbol();
const getPublicInstance = (i) => {
  if (!i)
    return null;
  if (isStatefulComponent(i))
    return getExposeProxy(i) || i.proxy;
  return getPublicInstance(i.parent);
};
const publicPropertiesMap = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ extend(/* @__PURE__ */ Object.create(null), {
    $: (i) => i,
    $el: (i) => i.vnode.el,
    $data: (i) => i.data,
    $props: (i) => i.props,
    $attrs: (i) => i.attrs,
    $slots: (i) => i.slots,
    $refs: (i) => i.refs,
    $parent: (i) => getPublicInstance(i.parent),
    $root: (i) => getPublicInstance(i.root),
    $emit: (i) => i.emit,
    $options: (i) => resolveMergedOptions(i),
    $forceUpdate: (i) => i.f || (i.f = () => queueJob(i.update)),
    $nextTick: (i) => i.n || (i.n = nextTick.bind(i.proxy)),
    $watch: (i) => instanceWatch.bind(i)
  })
);
const hasSetupBinding = (state, key) => state !== EMPTY_OBJ && !state.__isScriptSetup && hasOwn(state, key);
const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    const { ctx, setupState, data, props, accessCache, type, appContext } = instance;
    let normalizedProps;
    if (key[0] !== "$") {
      const n = accessCache[key];
      if (n !== void 0) {
        switch (n) {
          case 1:
            return setupState[key];
          case 2:
            return data[key];
          case 4:
            return ctx[key];
          case 3:
            return props[key];
        }
      } else if (hasSetupBinding(setupState, key)) {
        accessCache[key] = 1;
        return setupState[key];
      } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
        accessCache[key] = 2;
        return data[key];
      } else if (
        // only cache other properties when instance has declared (thus stable)
        // props
        (normalizedProps = instance.propsOptions[0]) && hasOwn(normalizedProps, key)
      ) {
        accessCache[key] = 3;
        return props[key];
      } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
        accessCache[key] = 4;
        return ctx[key];
      } else if (shouldCacheAccess) {
        accessCache[key] = 0;
      }
    }
    const publicGetter = publicPropertiesMap[key];
    let cssModule, globalProperties;
    if (publicGetter) {
      if (key === "$attrs") {
        track(instance, "get", key);
      }
      return publicGetter(instance);
    } else if (
      // css module (injected by vue-loader)
      (cssModule = type.__cssModules) && (cssModule = cssModule[key])
    ) {
      return cssModule;
    } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
      accessCache[key] = 4;
      return ctx[key];
    } else if (
      // global properties
      globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)
    ) {
      {
        return globalProperties[key];
      }
    } else
      ;
  },
  set({ _: instance }, key, value) {
    const { data, setupState, ctx } = instance;
    if (hasSetupBinding(setupState, key)) {
      setupState[key] = value;
      return true;
    } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
      data[key] = value;
      return true;
    } else if (hasOwn(instance.props, key)) {
      return false;
    }
    if (key[0] === "$" && key.slice(1) in instance) {
      return false;
    } else {
      {
        ctx[key] = value;
      }
    }
    return true;
  },
  has({ _: { data, setupState, accessCache, ctx, appContext, propsOptions } }, key) {
    let normalizedProps;
    return !!accessCache[key] || data !== EMPTY_OBJ && hasOwn(data, key) || hasSetupBinding(setupState, key) || (normalizedProps = propsOptions[0]) && hasOwn(normalizedProps, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key);
  },
  defineProperty(target, key, descriptor) {
    if (descriptor.get != null) {
      target._.accessCache[key] = 0;
    } else if (hasOwn(descriptor, "value")) {
      this.set(target, key, descriptor.value, null);
    }
    return Reflect.defineProperty(target, key, descriptor);
  }
};
let shouldCacheAccess = true;
function applyOptions(instance) {
  const options = resolveMergedOptions(instance);
  const publicThis = instance.proxy;
  const ctx = instance.ctx;
  shouldCacheAccess = false;
  if (options.beforeCreate) {
    callHook(
      options.beforeCreate,
      instance,
      "bc"
      /* LifecycleHooks.BEFORE_CREATE */
    );
  }
  const {
    // state
    data: dataOptions,
    computed: computedOptions,
    methods,
    watch: watchOptions,
    provide: provideOptions,
    inject: injectOptions,
    // lifecycle
    created,
    beforeMount,
    mounted,
    beforeUpdate,
    updated,
    activated,
    deactivated,
    beforeDestroy,
    beforeUnmount,
    destroyed,
    unmounted,
    render,
    renderTracked,
    renderTriggered,
    errorCaptured,
    serverPrefetch,
    // public API
    expose,
    inheritAttrs,
    // assets
    components,
    directives,
    filters
  } = options;
  const checkDuplicateProperties = null;
  if (injectOptions) {
    resolveInjections(injectOptions, ctx, checkDuplicateProperties, instance.appContext.config.unwrapInjectedRef);
  }
  if (methods) {
    for (const key in methods) {
      const methodHandler = methods[key];
      if (isFunction(methodHandler)) {
        {
          ctx[key] = methodHandler.bind(publicThis);
        }
      }
    }
  }
  if (dataOptions) {
    const data = dataOptions.call(publicThis, publicThis);
    if (!isObject(data))
      ;
    else {
      instance.data = reactive(data);
    }
  }
  shouldCacheAccess = true;
  if (computedOptions) {
    for (const key in computedOptions) {
      const opt = computedOptions[key];
      const get2 = isFunction(opt) ? opt.bind(publicThis, publicThis) : isFunction(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
      const set2 = !isFunction(opt) && isFunction(opt.set) ? opt.set.bind(publicThis) : NOOP;
      const c = computed({
        get: get2,
        set: set2
      });
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => c.value,
        set: (v) => c.value = v
      });
    }
  }
  if (watchOptions) {
    for (const key in watchOptions) {
      createWatcher(watchOptions[key], ctx, publicThis, key);
    }
  }
  if (provideOptions) {
    const provides = isFunction(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
    Reflect.ownKeys(provides).forEach((key) => {
      provide(key, provides[key]);
    });
  }
  if (created) {
    callHook(
      created,
      instance,
      "c"
      /* LifecycleHooks.CREATED */
    );
  }
  function registerLifecycleHook(register, hook) {
    if (isArray(hook)) {
      hook.forEach((_hook) => register(_hook.bind(publicThis)));
    } else if (hook) {
      register(hook.bind(publicThis));
    }
  }
  registerLifecycleHook(onBeforeMount, beforeMount);
  registerLifecycleHook(onMounted, mounted);
  registerLifecycleHook(onBeforeUpdate, beforeUpdate);
  registerLifecycleHook(onUpdated, updated);
  registerLifecycleHook(onActivated, activated);
  registerLifecycleHook(onDeactivated, deactivated);
  registerLifecycleHook(onErrorCaptured, errorCaptured);
  registerLifecycleHook(onRenderTracked, renderTracked);
  registerLifecycleHook(onRenderTriggered, renderTriggered);
  registerLifecycleHook(onBeforeUnmount, beforeUnmount);
  registerLifecycleHook(onUnmounted, unmounted);
  registerLifecycleHook(onServerPrefetch, serverPrefetch);
  if (isArray(expose)) {
    if (expose.length) {
      const exposed = instance.exposed || (instance.exposed = {});
      expose.forEach((key) => {
        Object.defineProperty(exposed, key, {
          get: () => publicThis[key],
          set: (val) => publicThis[key] = val
        });
      });
    } else if (!instance.exposed) {
      instance.exposed = {};
    }
  }
  if (render && instance.render === NOOP) {
    instance.render = render;
  }
  if (inheritAttrs != null) {
    instance.inheritAttrs = inheritAttrs;
  }
  if (components)
    instance.components = components;
  if (directives)
    instance.directives = directives;
}
function resolveInjections(injectOptions, ctx, checkDuplicateProperties = NOOP, unwrapRef = false) {
  if (isArray(injectOptions)) {
    injectOptions = normalizeInject(injectOptions);
  }
  for (const key in injectOptions) {
    const opt = injectOptions[key];
    let injected;
    if (isObject(opt)) {
      if ("default" in opt) {
        injected = inject(
          opt.from || key,
          opt.default,
          true
          /* treat default function as factory */
        );
      } else {
        injected = inject(opt.from || key);
      }
    } else {
      injected = inject(opt);
    }
    if (isRef(injected)) {
      if (unwrapRef) {
        Object.defineProperty(ctx, key, {
          enumerable: true,
          configurable: true,
          get: () => injected.value,
          set: (v) => injected.value = v
        });
      } else {
        ctx[key] = injected;
      }
    } else {
      ctx[key] = injected;
    }
  }
}
function callHook(hook, instance, type) {
  callWithAsyncErrorHandling(isArray(hook) ? hook.map((h) => h.bind(instance.proxy)) : hook.bind(instance.proxy), instance, type);
}
function createWatcher(raw, ctx, publicThis, key) {
  const getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
  if (isString(raw)) {
    const handler = ctx[raw];
    if (isFunction(handler)) {
      watch(getter, handler);
    }
  } else if (isFunction(raw)) {
    watch(getter, raw.bind(publicThis));
  } else if (isObject(raw)) {
    if (isArray(raw)) {
      raw.forEach((r) => createWatcher(r, ctx, publicThis, key));
    } else {
      const handler = isFunction(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
      if (isFunction(handler)) {
        watch(getter, handler, raw);
      }
    }
  } else
    ;
}
function resolveMergedOptions(instance) {
  const base = instance.type;
  const { mixins, extends: extendsOptions } = base;
  const { mixins: globalMixins, optionsCache: cache, config: { optionMergeStrategies } } = instance.appContext;
  const cached = cache.get(base);
  let resolved;
  if (cached) {
    resolved = cached;
  } else if (!globalMixins.length && !mixins && !extendsOptions) {
    {
      resolved = base;
    }
  } else {
    resolved = {};
    if (globalMixins.length) {
      globalMixins.forEach((m) => mergeOptions(resolved, m, optionMergeStrategies, true));
    }
    mergeOptions(resolved, base, optionMergeStrategies);
  }
  if (isObject(base)) {
    cache.set(base, resolved);
  }
  return resolved;
}
function mergeOptions(to, from, strats, asMixin = false) {
  const { mixins, extends: extendsOptions } = from;
  if (extendsOptions) {
    mergeOptions(to, extendsOptions, strats, true);
  }
  if (mixins) {
    mixins.forEach((m) => mergeOptions(to, m, strats, true));
  }
  for (const key in from) {
    if (asMixin && key === "expose")
      ;
    else {
      const strat = internalOptionMergeStrats[key] || strats && strats[key];
      to[key] = strat ? strat(to[key], from[key]) : from[key];
    }
  }
  return to;
}
const internalOptionMergeStrats = {
  data: mergeDataFn,
  props: mergeObjectOptions,
  emits: mergeObjectOptions,
  // objects
  methods: mergeObjectOptions,
  computed: mergeObjectOptions,
  // lifecycle
  beforeCreate: mergeAsArray,
  created: mergeAsArray,
  beforeMount: mergeAsArray,
  mounted: mergeAsArray,
  beforeUpdate: mergeAsArray,
  updated: mergeAsArray,
  beforeDestroy: mergeAsArray,
  beforeUnmount: mergeAsArray,
  destroyed: mergeAsArray,
  unmounted: mergeAsArray,
  activated: mergeAsArray,
  deactivated: mergeAsArray,
  errorCaptured: mergeAsArray,
  serverPrefetch: mergeAsArray,
  // assets
  components: mergeObjectOptions,
  directives: mergeObjectOptions,
  // watch
  watch: mergeWatchOptions,
  // provide / inject
  provide: mergeDataFn,
  inject: mergeInject
};
function mergeDataFn(to, from) {
  if (!from) {
    return to;
  }
  if (!to) {
    return from;
  }
  return function mergedDataFn() {
    return extend(isFunction(to) ? to.call(this, this) : to, isFunction(from) ? from.call(this, this) : from);
  };
}
function mergeInject(to, from) {
  return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
}
function normalizeInject(raw) {
  if (isArray(raw)) {
    const res = {};
    for (let i = 0; i < raw.length; i++) {
      res[raw[i]] = raw[i];
    }
    return res;
  }
  return raw;
}
function mergeAsArray(to, from) {
  return to ? [...new Set([].concat(to, from))] : from;
}
function mergeObjectOptions(to, from) {
  return to ? extend(extend(/* @__PURE__ */ Object.create(null), to), from) : from;
}
function mergeWatchOptions(to, from) {
  if (!to)
    return from;
  if (!from)
    return to;
  const merged = extend(/* @__PURE__ */ Object.create(null), to);
  for (const key in from) {
    merged[key] = mergeAsArray(to[key], from[key]);
  }
  return merged;
}
function initProps(instance, rawProps, isStateful, isSSR = false) {
  const props = {};
  const attrs = {};
  def(attrs, InternalObjectKey, 1);
  instance.propsDefaults = /* @__PURE__ */ Object.create(null);
  setFullProps(instance, rawProps, props, attrs);
  for (const key in instance.propsOptions[0]) {
    if (!(key in props)) {
      props[key] = void 0;
    }
  }
  if (isStateful) {
    instance.props = isSSR ? props : shallowReactive(props);
  } else {
    if (!instance.type.props) {
      instance.props = attrs;
    } else {
      instance.props = props;
    }
  }
  instance.attrs = attrs;
}
function updateProps(instance, rawProps, rawPrevProps, optimized) {
  const { props, attrs, vnode: { patchFlag } } = instance;
  const rawCurrentProps = toRaw(props);
  const [options] = instance.propsOptions;
  let hasAttrsChanged = false;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    (optimized || patchFlag > 0) && !(patchFlag & 16)
  ) {
    if (patchFlag & 8) {
      const propsToUpdate = instance.vnode.dynamicProps;
      for (let i = 0; i < propsToUpdate.length; i++) {
        let key = propsToUpdate[i];
        if (isEmitListener(instance.emitsOptions, key)) {
          continue;
        }
        const value = rawProps[key];
        if (options) {
          if (hasOwn(attrs, key)) {
            if (value !== attrs[key]) {
              attrs[key] = value;
              hasAttrsChanged = true;
            }
          } else {
            const camelizedKey = camelize(key);
            props[camelizedKey] = resolvePropValue(
              options,
              rawCurrentProps,
              camelizedKey,
              value,
              instance,
              false
              /* isAbsent */
            );
          }
        } else {
          if (value !== attrs[key]) {
            attrs[key] = value;
            hasAttrsChanged = true;
          }
        }
      }
    }
  } else {
    if (setFullProps(instance, rawProps, props, attrs)) {
      hasAttrsChanged = true;
    }
    let kebabKey;
    for (const key in rawCurrentProps) {
      if (!rawProps || // for camelCase
      !hasOwn(rawProps, key) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey))) {
        if (options) {
          if (rawPrevProps && // for camelCase
          (rawPrevProps[key] !== void 0 || // for kebab-case
          rawPrevProps[kebabKey] !== void 0)) {
            props[key] = resolvePropValue(
              options,
              rawCurrentProps,
              key,
              void 0,
              instance,
              true
              /* isAbsent */
            );
          }
        } else {
          delete props[key];
        }
      }
    }
    if (attrs !== rawCurrentProps) {
      for (const key in attrs) {
        if (!rawProps || !hasOwn(rawProps, key) && true) {
          delete attrs[key];
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (hasAttrsChanged) {
    trigger(instance, "set", "$attrs");
  }
}
function setFullProps(instance, rawProps, props, attrs) {
  const [options, needCastKeys] = instance.propsOptions;
  let hasAttrsChanged = false;
  let rawCastValues;
  if (rawProps) {
    for (let key in rawProps) {
      if (isReservedProp(key)) {
        continue;
      }
      const value = rawProps[key];
      let camelKey;
      if (options && hasOwn(options, camelKey = camelize(key))) {
        if (!needCastKeys || !needCastKeys.includes(camelKey)) {
          props[camelKey] = value;
        } else {
          (rawCastValues || (rawCastValues = {}))[camelKey] = value;
        }
      } else if (!isEmitListener(instance.emitsOptions, key)) {
        if (!(key in attrs) || value !== attrs[key]) {
          attrs[key] = value;
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (needCastKeys) {
    const rawCurrentProps = toRaw(props);
    const castValues = rawCastValues || EMPTY_OBJ;
    for (let i = 0; i < needCastKeys.length; i++) {
      const key = needCastKeys[i];
      props[key] = resolvePropValue(options, rawCurrentProps, key, castValues[key], instance, !hasOwn(castValues, key));
    }
  }
  return hasAttrsChanged;
}
function resolvePropValue(options, props, key, value, instance, isAbsent) {
  const opt = options[key];
  if (opt != null) {
    const hasDefault = hasOwn(opt, "default");
    if (hasDefault && value === void 0) {
      const defaultValue = opt.default;
      if (opt.type !== Function && isFunction(defaultValue)) {
        const { propsDefaults } = instance;
        if (key in propsDefaults) {
          value = propsDefaults[key];
        } else {
          setCurrentInstance(instance);
          value = propsDefaults[key] = defaultValue.call(null, props);
          unsetCurrentInstance();
        }
      } else {
        value = defaultValue;
      }
    }
    if (opt[
      0
      /* BooleanFlags.shouldCast */
    ]) {
      if (isAbsent && !hasDefault) {
        value = false;
      } else if (opt[
        1
        /* BooleanFlags.shouldCastTrue */
      ] && (value === "" || value === hyphenate(key))) {
        value = true;
      }
    }
  }
  return value;
}
function normalizePropsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.propsCache;
  const cached = cache.get(comp);
  if (cached) {
    return cached;
  }
  const raw = comp.props;
  const normalized = {};
  const needCastKeys = [];
  let hasExtends = false;
  if (!isFunction(comp)) {
    const extendProps = (raw2) => {
      hasExtends = true;
      const [props, keys] = normalizePropsOptions(raw2, appContext, true);
      extend(normalized, props);
      if (keys)
        needCastKeys.push(...keys);
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendProps);
    }
    if (comp.extends) {
      extendProps(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendProps);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject(comp)) {
      cache.set(comp, EMPTY_ARR);
    }
    return EMPTY_ARR;
  }
  if (isArray(raw)) {
    for (let i = 0; i < raw.length; i++) {
      const normalizedKey = camelize(raw[i]);
      if (validatePropName(normalizedKey)) {
        normalized[normalizedKey] = EMPTY_OBJ;
      }
    }
  } else if (raw) {
    for (const key in raw) {
      const normalizedKey = camelize(key);
      if (validatePropName(normalizedKey)) {
        const opt = raw[key];
        const prop = normalized[normalizedKey] = isArray(opt) || isFunction(opt) ? { type: opt } : Object.assign({}, opt);
        if (prop) {
          const booleanIndex = getTypeIndex(Boolean, prop.type);
          const stringIndex = getTypeIndex(String, prop.type);
          prop[
            0
            /* BooleanFlags.shouldCast */
          ] = booleanIndex > -1;
          prop[
            1
            /* BooleanFlags.shouldCastTrue */
          ] = stringIndex < 0 || booleanIndex < stringIndex;
          if (booleanIndex > -1 || hasOwn(prop, "default")) {
            needCastKeys.push(normalizedKey);
          }
        }
      }
    }
  }
  const res = [normalized, needCastKeys];
  if (isObject(comp)) {
    cache.set(comp, res);
  }
  return res;
}
function validatePropName(key) {
  if (key[0] !== "$") {
    return true;
  }
  return false;
}
function getType(ctor) {
  const match = ctor && ctor.toString().match(/^\s*(function|class) (\w+)/);
  return match ? match[2] : ctor === null ? "null" : "";
}
function isSameType(a, b) {
  return getType(a) === getType(b);
}
function getTypeIndex(type, expectedTypes) {
  if (isArray(expectedTypes)) {
    return expectedTypes.findIndex((t) => isSameType(t, type));
  } else if (isFunction(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1;
  }
  return -1;
}
const isInternalKey = (key) => key[0] === "_" || key === "$stable";
const normalizeSlotValue = (value) => isArray(value) ? value.map(normalizeVNode) : [normalizeVNode(value)];
const normalizeSlot = (key, rawSlot, ctx) => {
  if (rawSlot._n) {
    return rawSlot;
  }
  const normalized = withCtx((...args) => {
    if (false)
      ;
    return normalizeSlotValue(rawSlot(...args));
  }, ctx);
  normalized._c = false;
  return normalized;
};
const normalizeObjectSlots = (rawSlots, slots, instance) => {
  const ctx = rawSlots._ctx;
  for (const key in rawSlots) {
    if (isInternalKey(key))
      continue;
    const value = rawSlots[key];
    if (isFunction(value)) {
      slots[key] = normalizeSlot(key, value, ctx);
    } else if (value != null) {
      const normalized = normalizeSlotValue(value);
      slots[key] = () => normalized;
    }
  }
};
const normalizeVNodeSlots = (instance, children) => {
  const normalized = normalizeSlotValue(children);
  instance.slots.default = () => normalized;
};
const initSlots = (instance, children) => {
  if (instance.vnode.shapeFlag & 32) {
    const type = children._;
    if (type) {
      instance.slots = toRaw(children);
      def(children, "_", type);
    } else {
      normalizeObjectSlots(children, instance.slots = {});
    }
  } else {
    instance.slots = {};
    if (children) {
      normalizeVNodeSlots(instance, children);
    }
  }
  def(instance.slots, InternalObjectKey, 1);
};
const updateSlots = (instance, children, optimized) => {
  const { vnode, slots } = instance;
  let needDeletionCheck = true;
  let deletionComparisonTarget = EMPTY_OBJ;
  if (vnode.shapeFlag & 32) {
    const type = children._;
    if (type) {
      if (optimized && type === 1) {
        needDeletionCheck = false;
      } else {
        extend(slots, children);
        if (!optimized && type === 1) {
          delete slots._;
        }
      }
    } else {
      needDeletionCheck = !children.$stable;
      normalizeObjectSlots(children, slots);
    }
    deletionComparisonTarget = children;
  } else if (children) {
    normalizeVNodeSlots(instance, children);
    deletionComparisonTarget = { default: 1 };
  }
  if (needDeletionCheck) {
    for (const key in slots) {
      if (!isInternalKey(key) && !(key in deletionComparisonTarget)) {
        delete slots[key];
      }
    }
  }
};
function createAppContext() {
  return {
    app: null,
    config: {
      isNativeTag: NO,
      performance: false,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let uid$1 = 0;
function createAppAPI(render, hydrate) {
  return function createApp2(rootComponent, rootProps = null) {
    if (!isFunction(rootComponent)) {
      rootComponent = Object.assign({}, rootComponent);
    }
    if (rootProps != null && !isObject(rootProps)) {
      rootProps = null;
    }
    const context = createAppContext();
    const installedPlugins = /* @__PURE__ */ new Set();
    let isMounted = false;
    const app = context.app = {
      _uid: uid$1++,
      _component: rootComponent,
      _props: rootProps,
      _container: null,
      _context: context,
      _instance: null,
      version,
      get config() {
        return context.config;
      },
      set config(v) {
      },
      use(plugin, ...options) {
        if (installedPlugins.has(plugin))
          ;
        else if (plugin && isFunction(plugin.install)) {
          installedPlugins.add(plugin);
          plugin.install(app, ...options);
        } else if (isFunction(plugin)) {
          installedPlugins.add(plugin);
          plugin(app, ...options);
        } else
          ;
        return app;
      },
      mixin(mixin) {
        {
          if (!context.mixins.includes(mixin)) {
            context.mixins.push(mixin);
          }
        }
        return app;
      },
      component(name, component) {
        if (!component) {
          return context.components[name];
        }
        context.components[name] = component;
        return app;
      },
      directive(name, directive) {
        if (!directive) {
          return context.directives[name];
        }
        context.directives[name] = directive;
        return app;
      },
      mount(rootContainer, isHydrate, isSVG) {
        if (!isMounted) {
          const vnode = createVNode(rootComponent, rootProps);
          vnode.appContext = context;
          if (isHydrate && hydrate) {
            hydrate(vnode, rootContainer);
          } else {
            render(vnode, rootContainer, isSVG);
          }
          isMounted = true;
          app._container = rootContainer;
          rootContainer.__vue_app__ = app;
          return getExposeProxy(vnode.component) || vnode.component.proxy;
        }
      },
      unmount() {
        if (isMounted) {
          render(null, app._container);
          delete app._container.__vue_app__;
        }
      },
      provide(key, value) {
        context.provides[key] = value;
        return app;
      }
    };
    return app;
  };
}
function setRef(rawRef, oldRawRef, parentSuspense, vnode, isUnmount = false) {
  if (isArray(rawRef)) {
    rawRef.forEach((r, i) => setRef(r, oldRawRef && (isArray(oldRawRef) ? oldRawRef[i] : oldRawRef), parentSuspense, vnode, isUnmount));
    return;
  }
  if (isAsyncWrapper(vnode) && !isUnmount) {
    return;
  }
  const refValue = vnode.shapeFlag & 4 ? getExposeProxy(vnode.component) || vnode.component.proxy : vnode.el;
  const value = isUnmount ? null : refValue;
  const { i: owner, r: ref } = rawRef;
  const oldRef = oldRawRef && oldRawRef.r;
  const refs = owner.refs === EMPTY_OBJ ? owner.refs = {} : owner.refs;
  const setupState = owner.setupState;
  if (oldRef != null && oldRef !== ref) {
    if (isString(oldRef)) {
      refs[oldRef] = null;
      if (hasOwn(setupState, oldRef)) {
        setupState[oldRef] = null;
      }
    } else if (isRef(oldRef)) {
      oldRef.value = null;
    }
  }
  if (isFunction(ref)) {
    callWithErrorHandling(ref, owner, 12, [value, refs]);
  } else {
    const _isString = isString(ref);
    const _isRef = isRef(ref);
    if (_isString || _isRef) {
      const doSet = () => {
        if (rawRef.f) {
          const existing = _isString ? hasOwn(setupState, ref) ? setupState[ref] : refs[ref] : ref.value;
          if (isUnmount) {
            isArray(existing) && remove(existing, refValue);
          } else {
            if (!isArray(existing)) {
              if (_isString) {
                refs[ref] = [refValue];
                if (hasOwn(setupState, ref)) {
                  setupState[ref] = refs[ref];
                }
              } else {
                ref.value = [refValue];
                if (rawRef.k)
                  refs[rawRef.k] = ref.value;
              }
            } else if (!existing.includes(refValue)) {
              existing.push(refValue);
            }
          }
        } else if (_isString) {
          refs[ref] = value;
          if (hasOwn(setupState, ref)) {
            setupState[ref] = value;
          }
        } else if (_isRef) {
          ref.value = value;
          if (rawRef.k)
            refs[rawRef.k] = value;
        } else
          ;
      };
      if (value) {
        doSet.id = -1;
        queuePostRenderEffect(doSet, parentSuspense);
      } else {
        doSet();
      }
    }
  }
}
const queuePostRenderEffect = queueEffectWithSuspense;
function createRenderer(options) {
  return baseCreateRenderer(options);
}
function baseCreateRenderer(options, createHydrationFns) {
  const target = getGlobalThis();
  target.__VUE__ = true;
  const { insert: hostInsert, remove: hostRemove, patchProp: hostPatchProp, createElement: hostCreateElement, createText: hostCreateText, createComment: hostCreateComment, setText: hostSetText, setElementText: hostSetElementText, parentNode: hostParentNode, nextSibling: hostNextSibling, setScopeId: hostSetScopeId = NOOP, insertStaticContent: hostInsertStaticContent } = options;
  const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, isSVG = false, slotScopeIds = null, optimized = !!n2.dynamicChildren) => {
    if (n1 === n2) {
      return;
    }
    if (n1 && !isSameVNodeType(n1, n2)) {
      anchor = getNextHostNode(n1);
      unmount(n1, parentComponent, parentSuspense, true);
      n1 = null;
    }
    if (n2.patchFlag === -2) {
      optimized = false;
      n2.dynamicChildren = null;
    }
    const { type, ref, shapeFlag } = n2;
    switch (type) {
      case Text:
        processText(n1, n2, container, anchor);
        break;
      case Comment:
        processCommentNode(n1, n2, container, anchor);
        break;
      case Static:
        if (n1 == null) {
          mountStaticNode(n2, container, anchor, isSVG);
        }
        break;
      case Fragment:
        processFragment(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        break;
      default:
        if (shapeFlag & 1) {
          processElement(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else if (shapeFlag & 6) {
          processComponent(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else if (shapeFlag & 64) {
          type.process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, internals);
        } else if (shapeFlag & 128) {
          type.process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, internals);
        } else
          ;
    }
    if (ref != null && parentComponent) {
      setRef(ref, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
    }
  };
  const processText = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(n2.el = hostCreateText(n2.children), container, anchor);
    } else {
      const el = n2.el = n1.el;
      if (n2.children !== n1.children) {
        hostSetText(el, n2.children);
      }
    }
  };
  const processCommentNode = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(n2.el = hostCreateComment(n2.children || ""), container, anchor);
    } else {
      n2.el = n1.el;
    }
  };
  const mountStaticNode = (n2, container, anchor, isSVG) => {
    [n2.el, n2.anchor] = hostInsertStaticContent(n2.children, container, anchor, isSVG, n2.el, n2.anchor);
  };
  const moveStaticNode = ({ el, anchor }, container, nextSibling) => {
    let next;
    while (el && el !== anchor) {
      next = hostNextSibling(el);
      hostInsert(el, container, nextSibling);
      el = next;
    }
    hostInsert(anchor, container, nextSibling);
  };
  const removeStaticNode = ({ el, anchor }) => {
    let next;
    while (el && el !== anchor) {
      next = hostNextSibling(el);
      hostRemove(el);
      el = next;
    }
    hostRemove(anchor);
  };
  const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    isSVG = isSVG || n2.type === "svg";
    if (n1 == null) {
      mountElement(n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    } else {
      patchElement(n1, n2, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    }
  };
  const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    let el;
    let vnodeHook;
    const { type, props, shapeFlag, transition, dirs } = vnode;
    el = vnode.el = hostCreateElement(vnode.type, isSVG, props && props.is, props);
    if (shapeFlag & 8) {
      hostSetElementText(el, vnode.children);
    } else if (shapeFlag & 16) {
      mountChildren(vnode.children, el, null, parentComponent, parentSuspense, isSVG && type !== "foreignObject", slotScopeIds, optimized);
    }
    if (dirs) {
      invokeDirectiveHook(vnode, null, parentComponent, "created");
    }
    setScopeId(el, vnode, vnode.scopeId, slotScopeIds, parentComponent);
    if (props) {
      for (const key in props) {
        if (key !== "value" && !isReservedProp(key)) {
          hostPatchProp(el, key, null, props[key], isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
        }
      }
      if ("value" in props) {
        hostPatchProp(el, "value", null, props.value);
      }
      if (vnodeHook = props.onVnodeBeforeMount) {
        invokeVNodeHook(vnodeHook, parentComponent, vnode);
      }
    }
    if (dirs) {
      invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
    }
    const needCallTransitionHooks = (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;
    if (needCallTransitionHooks) {
      transition.beforeEnter(el);
    }
    hostInsert(el, container, anchor);
    if ((vnodeHook = props && props.onVnodeMounted) || needCallTransitionHooks || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        needCallTransitionHooks && transition.enter(el);
        dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
      }, parentSuspense);
    }
  };
  const setScopeId = (el, vnode, scopeId, slotScopeIds, parentComponent) => {
    if (scopeId) {
      hostSetScopeId(el, scopeId);
    }
    if (slotScopeIds) {
      for (let i = 0; i < slotScopeIds.length; i++) {
        hostSetScopeId(el, slotScopeIds[i]);
      }
    }
    if (parentComponent) {
      let subTree = parentComponent.subTree;
      if (vnode === subTree) {
        const parentVNode = parentComponent.vnode;
        setScopeId(el, parentVNode, parentVNode.scopeId, parentVNode.slotScopeIds, parentComponent.parent);
      }
    }
  };
  const mountChildren = (children, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, start = 0) => {
    for (let i = start; i < children.length; i++) {
      const child = children[i] = optimized ? cloneIfMounted(children[i]) : normalizeVNode(children[i]);
      patch(null, child, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    }
  };
  const patchElement = (n1, n2, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    const el = n2.el = n1.el;
    let { patchFlag, dynamicChildren, dirs } = n2;
    patchFlag |= n1.patchFlag & 16;
    const oldProps = n1.props || EMPTY_OBJ;
    const newProps = n2.props || EMPTY_OBJ;
    let vnodeHook;
    parentComponent && toggleRecurse(parentComponent, false);
    if (vnodeHook = newProps.onVnodeBeforeUpdate) {
      invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
    }
    if (dirs) {
      invokeDirectiveHook(n2, n1, parentComponent, "beforeUpdate");
    }
    parentComponent && toggleRecurse(parentComponent, true);
    const areChildrenSVG = isSVG && n2.type !== "foreignObject";
    if (dynamicChildren) {
      patchBlockChildren(n1.dynamicChildren, dynamicChildren, el, parentComponent, parentSuspense, areChildrenSVG, slotScopeIds);
    } else if (!optimized) {
      patchChildren(n1, n2, el, null, parentComponent, parentSuspense, areChildrenSVG, slotScopeIds, false);
    }
    if (patchFlag > 0) {
      if (patchFlag & 16) {
        patchProps(el, n2, oldProps, newProps, parentComponent, parentSuspense, isSVG);
      } else {
        if (patchFlag & 2) {
          if (oldProps.class !== newProps.class) {
            hostPatchProp(el, "class", null, newProps.class, isSVG);
          }
        }
        if (patchFlag & 4) {
          hostPatchProp(el, "style", oldProps.style, newProps.style, isSVG);
        }
        if (patchFlag & 8) {
          const propsToUpdate = n2.dynamicProps;
          for (let i = 0; i < propsToUpdate.length; i++) {
            const key = propsToUpdate[i];
            const prev = oldProps[key];
            const next = newProps[key];
            if (next !== prev || key === "value") {
              hostPatchProp(el, key, prev, next, isSVG, n1.children, parentComponent, parentSuspense, unmountChildren);
            }
          }
        }
      }
      if (patchFlag & 1) {
        if (n1.children !== n2.children) {
          hostSetElementText(el, n2.children);
        }
      }
    } else if (!optimized && dynamicChildren == null) {
      patchProps(el, n2, oldProps, newProps, parentComponent, parentSuspense, isSVG);
    }
    if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
        dirs && invokeDirectiveHook(n2, n1, parentComponent, "updated");
      }, parentSuspense);
    }
  };
  const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, isSVG, slotScopeIds) => {
    for (let i = 0; i < newChildren.length; i++) {
      const oldVNode = oldChildren[i];
      const newVNode = newChildren[i];
      const container = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        oldVNode.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (oldVNode.type === Fragment || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !isSameVNodeType(oldVNode, newVNode) || // - In the case of a component, it could contain anything.
        oldVNode.shapeFlag & (6 | 64)) ? hostParentNode(oldVNode.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          fallbackContainer
        )
      );
      patch(oldVNode, newVNode, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, true);
    }
  };
  const patchProps = (el, vnode, oldProps, newProps, parentComponent, parentSuspense, isSVG) => {
    if (oldProps !== newProps) {
      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!isReservedProp(key) && !(key in newProps)) {
            hostPatchProp(el, key, oldProps[key], null, isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
          }
        }
      }
      for (const key in newProps) {
        if (isReservedProp(key))
          continue;
        const next = newProps[key];
        const prev = oldProps[key];
        if (next !== prev && key !== "value") {
          hostPatchProp(el, key, prev, next, isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
        }
      }
      if ("value" in newProps) {
        hostPatchProp(el, "value", oldProps.value, newProps.value);
      }
    }
  };
  const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    const fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText("");
    const fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText("");
    let { patchFlag, dynamicChildren, slotScopeIds: fragmentSlotScopeIds } = n2;
    if (fragmentSlotScopeIds) {
      slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
    }
    if (n1 == null) {
      hostInsert(fragmentStartAnchor, container, anchor);
      hostInsert(fragmentEndAnchor, container, anchor);
      mountChildren(n2.children, container, fragmentEndAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    } else {
      if (patchFlag > 0 && patchFlag & 64 && dynamicChildren && // #2715 the previous fragment could've been a BAILed one as a result
      // of renderSlot() with no valid children
      n1.dynamicChildren) {
        patchBlockChildren(n1.dynamicChildren, dynamicChildren, container, parentComponent, parentSuspense, isSVG, slotScopeIds);
        if (
          // #2080 if the stable fragment has a key, it's a <template v-for> that may
          //  get moved around. Make sure all root level vnodes inherit el.
          // #2134 or if it's a component root, it may also get moved around
          // as the component is being moved.
          n2.key != null || parentComponent && n2 === parentComponent.subTree
        ) {
          traverseStaticChildren(
            n1,
            n2,
            true
            /* shallow */
          );
        }
      } else {
        patchChildren(n1, n2, container, fragmentEndAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
      }
    }
  };
  const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    n2.slotScopeIds = slotScopeIds;
    if (n1 == null) {
      if (n2.shapeFlag & 512) {
        parentComponent.ctx.activate(n2, container, anchor, isSVG, optimized);
      } else {
        mountComponent(n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
      }
    } else {
      updateComponent(n1, n2, optimized);
    }
  };
  const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
    const instance = initialVNode.component = createComponentInstance(initialVNode, parentComponent, parentSuspense);
    if (isKeepAlive(initialVNode)) {
      instance.ctx.renderer = internals;
    }
    {
      setupComponent(instance);
    }
    if (instance.asyncDep) {
      parentSuspense && parentSuspense.registerDep(instance, setupRenderEffect);
      if (!initialVNode.el) {
        const placeholder = instance.subTree = createVNode(Comment);
        processCommentNode(null, placeholder, container, anchor);
      }
      return;
    }
    setupRenderEffect(instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized);
  };
  const updateComponent = (n1, n2, optimized) => {
    const instance = n2.component = n1.component;
    if (shouldUpdateComponent(n1, n2, optimized)) {
      if (instance.asyncDep && !instance.asyncResolved) {
        updateComponentPreRender(instance, n2, optimized);
        return;
      } else {
        instance.next = n2;
        invalidateJob(instance.update);
        instance.update();
      }
    } else {
      n2.el = n1.el;
      instance.vnode = n2;
    }
  };
  const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized) => {
    const componentUpdateFn = () => {
      if (!instance.isMounted) {
        let vnodeHook;
        const { el, props } = initialVNode;
        const { bm, m, parent } = instance;
        const isAsyncWrapperVNode = isAsyncWrapper(initialVNode);
        toggleRecurse(instance, false);
        if (bm) {
          invokeArrayFns(bm);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeBeforeMount)) {
          invokeVNodeHook(vnodeHook, parent, initialVNode);
        }
        toggleRecurse(instance, true);
        if (el && hydrateNode) {
          const hydrateSubTree = () => {
            instance.subTree = renderComponentRoot(instance);
            hydrateNode(el, instance.subTree, instance, parentSuspense, null);
          };
          if (isAsyncWrapperVNode) {
            initialVNode.type.__asyncLoader().then(
              // note: we are moving the render call into an async callback,
              // which means it won't track dependencies - but it's ok because
              // a server-rendered async wrapper is already in resolved state
              // and it will never need to change.
              () => !instance.isUnmounted && hydrateSubTree()
            );
          } else {
            hydrateSubTree();
          }
        } else {
          const subTree = instance.subTree = renderComponentRoot(instance);
          patch(null, subTree, container, anchor, instance, parentSuspense, isSVG);
          initialVNode.el = subTree.el;
        }
        if (m) {
          queuePostRenderEffect(m, parentSuspense);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeMounted)) {
          const scopedInitialVNode = initialVNode;
          queuePostRenderEffect(() => invokeVNodeHook(vnodeHook, parent, scopedInitialVNode), parentSuspense);
        }
        if (initialVNode.shapeFlag & 256 || parent && isAsyncWrapper(parent.vnode) && parent.vnode.shapeFlag & 256) {
          instance.a && queuePostRenderEffect(instance.a, parentSuspense);
        }
        instance.isMounted = true;
        initialVNode = container = anchor = null;
      } else {
        let { next, bu, u, parent, vnode } = instance;
        let originNext = next;
        let vnodeHook;
        toggleRecurse(instance, false);
        if (next) {
          next.el = vnode.el;
          updateComponentPreRender(instance, next, optimized);
        } else {
          next = vnode;
        }
        if (bu) {
          invokeArrayFns(bu);
        }
        if (vnodeHook = next.props && next.props.onVnodeBeforeUpdate) {
          invokeVNodeHook(vnodeHook, parent, next, vnode);
        }
        toggleRecurse(instance, true);
        const nextTree = renderComponentRoot(instance);
        const prevTree = instance.subTree;
        instance.subTree = nextTree;
        patch(
          prevTree,
          nextTree,
          // parent may have changed if it's in a teleport
          hostParentNode(prevTree.el),
          // anchor may have changed if it's in a fragment
          getNextHostNode(prevTree),
          instance,
          parentSuspense,
          isSVG
        );
        next.el = nextTree.el;
        if (originNext === null) {
          updateHOCHostEl(instance, nextTree.el);
        }
        if (u) {
          queuePostRenderEffect(u, parentSuspense);
        }
        if (vnodeHook = next.props && next.props.onVnodeUpdated) {
          queuePostRenderEffect(() => invokeVNodeHook(vnodeHook, parent, next, vnode), parentSuspense);
        }
      }
    };
    const effect = instance.effect = new ReactiveEffect(
      componentUpdateFn,
      () => queueJob(update),
      instance.scope
      // track it in component's effect scope
    );
    const update = instance.update = () => effect.run();
    update.id = instance.uid;
    toggleRecurse(instance, true);
    update();
  };
  const updateComponentPreRender = (instance, nextVNode, optimized) => {
    nextVNode.component = instance;
    const prevProps = instance.vnode.props;
    instance.vnode = nextVNode;
    instance.next = null;
    updateProps(instance, nextVNode.props, prevProps, optimized);
    updateSlots(instance, nextVNode.children, optimized);
    pauseTracking();
    flushPreFlushCbs();
    resetTracking();
  };
  const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized = false) => {
    const c1 = n1 && n1.children;
    const prevShapeFlag = n1 ? n1.shapeFlag : 0;
    const c2 = n2.children;
    const { patchFlag, shapeFlag } = n2;
    if (patchFlag > 0) {
      if (patchFlag & 128) {
        patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        return;
      } else if (patchFlag & 256) {
        patchUnkeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        return;
      }
    }
    if (shapeFlag & 8) {
      if (prevShapeFlag & 16) {
        unmountChildren(c1, parentComponent, parentSuspense);
      }
      if (c2 !== c1) {
        hostSetElementText(container, c2);
      }
    } else {
      if (prevShapeFlag & 16) {
        if (shapeFlag & 16) {
          patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else {
          unmountChildren(c1, parentComponent, parentSuspense, true);
        }
      } else {
        if (prevShapeFlag & 8) {
          hostSetElementText(container, "");
        }
        if (shapeFlag & 16) {
          mountChildren(c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        }
      }
    }
  };
  const patchUnkeyedChildren = (c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    c1 = c1 || EMPTY_ARR;
    c2 = c2 || EMPTY_ARR;
    const oldLength = c1.length;
    const newLength = c2.length;
    const commonLength = Math.min(oldLength, newLength);
    let i;
    for (i = 0; i < commonLength; i++) {
      const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
      patch(c1[i], nextChild, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    }
    if (oldLength > newLength) {
      unmountChildren(c1, parentComponent, parentSuspense, true, false, commonLength);
    } else {
      mountChildren(c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, commonLength);
    }
  };
  const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    let i = 0;
    const l2 = c2.length;
    let e1 = c1.length - 1;
    let e2 = l2 - 1;
    while (i <= e1 && i <= e2) {
      const n1 = c1[i];
      const n2 = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
      } else {
        break;
      }
      i++;
    }
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1];
      const n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);
      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
      } else {
        break;
      }
      e1--;
      e2--;
    }
    if (i > e1) {
      if (i <= e2) {
        const nextPos = e2 + 1;
        const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
        while (i <= e2) {
          patch(null, c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]), container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
          i++;
        }
      }
    } else if (i > e2) {
      while (i <= e1) {
        unmount(c1[i], parentComponent, parentSuspense, true);
        i++;
      }
    } else {
      const s1 = i;
      const s2 = i;
      const keyToNewIndexMap = /* @__PURE__ */ new Map();
      for (i = s2; i <= e2; i++) {
        const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
        if (nextChild.key != null) {
          keyToNewIndexMap.set(nextChild.key, i);
        }
      }
      let j;
      let patched = 0;
      const toBePatched = e2 - s2 + 1;
      let moved = false;
      let maxNewIndexSoFar = 0;
      const newIndexToOldIndexMap = new Array(toBePatched);
      for (i = 0; i < toBePatched; i++)
        newIndexToOldIndexMap[i] = 0;
      for (i = s1; i <= e1; i++) {
        const prevChild = c1[i];
        if (patched >= toBePatched) {
          unmount(prevChild, parentComponent, parentSuspense, true);
          continue;
        }
        let newIndex;
        if (prevChild.key != null) {
          newIndex = keyToNewIndexMap.get(prevChild.key);
        } else {
          for (j = s2; j <= e2; j++) {
            if (newIndexToOldIndexMap[j - s2] === 0 && isSameVNodeType(prevChild, c2[j])) {
              newIndex = j;
              break;
            }
          }
        }
        if (newIndex === void 0) {
          unmount(prevChild, parentComponent, parentSuspense, true);
        } else {
          newIndexToOldIndexMap[newIndex - s2] = i + 1;
          if (newIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = newIndex;
          } else {
            moved = true;
          }
          patch(prevChild, c2[newIndex], container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
          patched++;
        }
      }
      const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : EMPTY_ARR;
      j = increasingNewIndexSequence.length - 1;
      for (i = toBePatched - 1; i >= 0; i--) {
        const nextIndex = s2 + i;
        const nextChild = c2[nextIndex];
        const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : parentAnchor;
        if (newIndexToOldIndexMap[i] === 0) {
          patch(null, nextChild, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else if (moved) {
          if (j < 0 || i !== increasingNewIndexSequence[j]) {
            move(
              nextChild,
              container,
              anchor,
              2
              /* MoveType.REORDER */
            );
          } else {
            j--;
          }
        }
      }
    }
  };
  const move = (vnode, container, anchor, moveType, parentSuspense = null) => {
    const { el, type, transition, children, shapeFlag } = vnode;
    if (shapeFlag & 6) {
      move(vnode.component.subTree, container, anchor, moveType);
      return;
    }
    if (shapeFlag & 128) {
      vnode.suspense.move(container, anchor, moveType);
      return;
    }
    if (shapeFlag & 64) {
      type.move(vnode, container, anchor, internals);
      return;
    }
    if (type === Fragment) {
      hostInsert(el, container, anchor);
      for (let i = 0; i < children.length; i++) {
        move(children[i], container, anchor, moveType);
      }
      hostInsert(vnode.anchor, container, anchor);
      return;
    }
    if (type === Static) {
      moveStaticNode(vnode, container, anchor);
      return;
    }
    const needTransition = moveType !== 2 && shapeFlag & 1 && transition;
    if (needTransition) {
      if (moveType === 0) {
        transition.beforeEnter(el);
        hostInsert(el, container, anchor);
        queuePostRenderEffect(() => transition.enter(el), parentSuspense);
      } else {
        const { leave, delayLeave, afterLeave } = transition;
        const remove3 = () => hostInsert(el, container, anchor);
        const performLeave = () => {
          leave(el, () => {
            remove3();
            afterLeave && afterLeave();
          });
        };
        if (delayLeave) {
          delayLeave(el, remove3, performLeave);
        } else {
          performLeave();
        }
      }
    } else {
      hostInsert(el, container, anchor);
    }
  };
  const unmount = (vnode, parentComponent, parentSuspense, doRemove = false, optimized = false) => {
    const { type, props, ref, children, dynamicChildren, shapeFlag, patchFlag, dirs } = vnode;
    if (ref != null) {
      setRef(ref, null, parentSuspense, vnode, true);
    }
    if (shapeFlag & 256) {
      parentComponent.ctx.deactivate(vnode);
      return;
    }
    const shouldInvokeDirs = shapeFlag & 1 && dirs;
    const shouldInvokeVnodeHook = !isAsyncWrapper(vnode);
    let vnodeHook;
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeBeforeUnmount)) {
      invokeVNodeHook(vnodeHook, parentComponent, vnode);
    }
    if (shapeFlag & 6) {
      unmountComponent(vnode.component, parentSuspense, doRemove);
    } else {
      if (shapeFlag & 128) {
        vnode.suspense.unmount(parentSuspense, doRemove);
        return;
      }
      if (shouldInvokeDirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "beforeUnmount");
      }
      if (shapeFlag & 64) {
        vnode.type.remove(vnode, parentComponent, parentSuspense, optimized, internals, doRemove);
      } else if (dynamicChildren && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (type !== Fragment || patchFlag > 0 && patchFlag & 64)) {
        unmountChildren(dynamicChildren, parentComponent, parentSuspense, false, true);
      } else if (type === Fragment && patchFlag & (128 | 256) || !optimized && shapeFlag & 16) {
        unmountChildren(children, parentComponent, parentSuspense);
      }
      if (doRemove) {
        remove2(vnode);
      }
    }
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, "unmounted");
      }, parentSuspense);
    }
  };
  const remove2 = (vnode) => {
    const { type, el, anchor, transition } = vnode;
    if (type === Fragment) {
      {
        removeFragment(el, anchor);
      }
      return;
    }
    if (type === Static) {
      removeStaticNode(vnode);
      return;
    }
    const performRemove = () => {
      hostRemove(el);
      if (transition && !transition.persisted && transition.afterLeave) {
        transition.afterLeave();
      }
    };
    if (vnode.shapeFlag & 1 && transition && !transition.persisted) {
      const { leave, delayLeave } = transition;
      const performLeave = () => leave(el, performRemove);
      if (delayLeave) {
        delayLeave(vnode.el, performRemove, performLeave);
      } else {
        performLeave();
      }
    } else {
      performRemove();
    }
  };
  const removeFragment = (cur, end) => {
    let next;
    while (cur !== end) {
      next = hostNextSibling(cur);
      hostRemove(cur);
      cur = next;
    }
    hostRemove(end);
  };
  const unmountComponent = (instance, parentSuspense, doRemove) => {
    const { bum, scope, update, subTree, um } = instance;
    if (bum) {
      invokeArrayFns(bum);
    }
    scope.stop();
    if (update) {
      update.active = false;
      unmount(subTree, instance, parentSuspense, doRemove);
    }
    if (um) {
      queuePostRenderEffect(um, parentSuspense);
    }
    queuePostRenderEffect(() => {
      instance.isUnmounted = true;
    }, parentSuspense);
    if (parentSuspense && parentSuspense.pendingBranch && !parentSuspense.isUnmounted && instance.asyncDep && !instance.asyncResolved && instance.suspenseId === parentSuspense.pendingId) {
      parentSuspense.deps--;
      if (parentSuspense.deps === 0) {
        parentSuspense.resolve();
      }
    }
  };
  const unmountChildren = (children, parentComponent, parentSuspense, doRemove = false, optimized = false, start = 0) => {
    for (let i = start; i < children.length; i++) {
      unmount(children[i], parentComponent, parentSuspense, doRemove, optimized);
    }
  };
  const getNextHostNode = (vnode) => {
    if (vnode.shapeFlag & 6) {
      return getNextHostNode(vnode.component.subTree);
    }
    if (vnode.shapeFlag & 128) {
      return vnode.suspense.next();
    }
    return hostNextSibling(vnode.anchor || vnode.el);
  };
  const render = (vnode, container, isSVG) => {
    if (vnode == null) {
      if (container._vnode) {
        unmount(container._vnode, null, null, true);
      }
    } else {
      patch(container._vnode || null, vnode, container, null, null, null, isSVG);
    }
    flushPreFlushCbs();
    flushPostFlushCbs();
    container._vnode = vnode;
  };
  const internals = {
    p: patch,
    um: unmount,
    m: move,
    r: remove2,
    mt: mountComponent,
    mc: mountChildren,
    pc: patchChildren,
    pbc: patchBlockChildren,
    n: getNextHostNode,
    o: options
  };
  let hydrate;
  let hydrateNode;
  if (createHydrationFns) {
    [hydrate, hydrateNode] = createHydrationFns(internals);
  }
  return {
    render,
    hydrate,
    createApp: createAppAPI(render, hydrate)
  };
}
function toggleRecurse({ effect, update }, allowed) {
  effect.allowRecurse = update.allowRecurse = allowed;
}
function traverseStaticChildren(n1, n2, shallow = false) {
  const ch1 = n1.children;
  const ch2 = n2.children;
  if (isArray(ch1) && isArray(ch2)) {
    for (let i = 0; i < ch1.length; i++) {
      const c1 = ch1[i];
      let c2 = ch2[i];
      if (c2.shapeFlag & 1 && !c2.dynamicChildren) {
        if (c2.patchFlag <= 0 || c2.patchFlag === 32) {
          c2 = ch2[i] = cloneIfMounted(ch2[i]);
          c2.el = c1.el;
        }
        if (!shallow)
          traverseStaticChildren(c1, c2);
      }
      if (c2.type === Text) {
        c2.el = c1.el;
      }
    }
  }
}
function getSequence(arr) {
  const p2 = arr.slice();
  const result = [0];
  let i, j, u, v, c;
  const len = arr.length;
  for (i = 0; i < len; i++) {
    const arrI = arr[i];
    if (arrI !== 0) {
      j = result[result.length - 1];
      if (arr[j] < arrI) {
        p2[i] = j;
        result.push(i);
        continue;
      }
      u = 0;
      v = result.length - 1;
      while (u < v) {
        c = u + v >> 1;
        if (arr[result[c]] < arrI) {
          u = c + 1;
        } else {
          v = c;
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p2[i] = result[u - 1];
        }
        result[u] = i;
      }
    }
  }
  u = result.length;
  v = result[u - 1];
  while (u-- > 0) {
    result[u] = v;
    v = p2[v];
  }
  return result;
}
const isTeleport = (type) => type.__isTeleport;
const Fragment = Symbol(void 0);
const Text = Symbol(void 0);
const Comment = Symbol(void 0);
const Static = Symbol(void 0);
const blockStack = [];
let currentBlock = null;
function openBlock(disableTracking = false) {
  blockStack.push(currentBlock = disableTracking ? null : []);
}
function closeBlock() {
  blockStack.pop();
  currentBlock = blockStack[blockStack.length - 1] || null;
}
let isBlockTreeEnabled = 1;
function setBlockTracking(value) {
  isBlockTreeEnabled += value;
}
function setupBlock(vnode) {
  vnode.dynamicChildren = isBlockTreeEnabled > 0 ? currentBlock || EMPTY_ARR : null;
  closeBlock();
  if (isBlockTreeEnabled > 0 && currentBlock) {
    currentBlock.push(vnode);
  }
  return vnode;
}
function createElementBlock(type, props, children, patchFlag, dynamicProps, shapeFlag) {
  return setupBlock(createBaseVNode(
    type,
    props,
    children,
    patchFlag,
    dynamicProps,
    shapeFlag,
    true
    /* isBlock */
  ));
}
function isVNode(value) {
  return value ? value.__v_isVNode === true : false;
}
function isSameVNodeType(n1, n2) {
  return n1.type === n2.type && n1.key === n2.key;
}
const InternalObjectKey = `__vInternal`;
const normalizeKey = ({ key }) => key != null ? key : null;
const normalizeRef = ({ ref, ref_key, ref_for }) => {
  return ref != null ? isString(ref) || isRef(ref) || isFunction(ref) ? { i: currentRenderingInstance, r: ref, k: ref_key, f: !!ref_for } : ref : null;
};
function createBaseVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, shapeFlag = type === Fragment ? 0 : 1, isBlockNode = false, needFullChildrenNormalization = false) {
  const vnode = {
    __v_isVNode: true,
    __v_skip: true,
    type,
    props,
    key: props && normalizeKey(props),
    ref: props && normalizeRef(props),
    scopeId: currentScopeId,
    slotScopeIds: null,
    children,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag,
    patchFlag,
    dynamicProps,
    dynamicChildren: null,
    appContext: null,
    ctx: currentRenderingInstance
  };
  if (needFullChildrenNormalization) {
    normalizeChildren(vnode, children);
    if (shapeFlag & 128) {
      type.normalize(vnode);
    }
  } else if (children) {
    vnode.shapeFlag |= isString(children) ? 8 : 16;
  }
  if (isBlockTreeEnabled > 0 && // avoid a block node from tracking itself
  !isBlockNode && // has current parent block
  currentBlock && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (vnode.patchFlag > 0 || shapeFlag & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  vnode.patchFlag !== 32) {
    currentBlock.push(vnode);
  }
  return vnode;
}
const createVNode = _createVNode;
function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
  if (!type || type === NULL_DYNAMIC_COMPONENT) {
    type = Comment;
  }
  if (isVNode(type)) {
    const cloned = cloneVNode(
      type,
      props,
      true
      /* mergeRef: true */
    );
    if (children) {
      normalizeChildren(cloned, children);
    }
    if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock) {
      if (cloned.shapeFlag & 6) {
        currentBlock[currentBlock.indexOf(type)] = cloned;
      } else {
        currentBlock.push(cloned);
      }
    }
    cloned.patchFlag |= -2;
    return cloned;
  }
  if (isClassComponent(type)) {
    type = type.__vccOpts;
  }
  if (props) {
    props = guardReactiveProps(props);
    let { class: klass, style } = props;
    if (klass && !isString(klass)) {
      props.class = normalizeClass(klass);
    }
    if (isObject(style)) {
      if (isProxy(style) && !isArray(style)) {
        style = extend({}, style);
      }
      props.style = normalizeStyle(style);
    }
  }
  const shapeFlag = isString(type) ? 1 : isSuspense(type) ? 128 : isTeleport(type) ? 64 : isObject(type) ? 4 : isFunction(type) ? 2 : 0;
  return createBaseVNode(type, props, children, patchFlag, dynamicProps, shapeFlag, isBlockNode, true);
}
function guardReactiveProps(props) {
  if (!props)
    return null;
  return isProxy(props) || InternalObjectKey in props ? extend({}, props) : props;
}
function cloneVNode(vnode, extraProps, mergeRef = false) {
  const { props, ref, patchFlag, children } = vnode;
  const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
  const cloned = {
    __v_isVNode: true,
    __v_skip: true,
    type: vnode.type,
    props: mergedProps,
    key: mergedProps && normalizeKey(mergedProps),
    ref: extraProps && extraProps.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      mergeRef && ref ? isArray(ref) ? ref.concat(normalizeRef(extraProps)) : [ref, normalizeRef(extraProps)] : normalizeRef(extraProps)
    ) : ref,
    scopeId: vnode.scopeId,
    slotScopeIds: vnode.slotScopeIds,
    children,
    target: vnode.target,
    targetAnchor: vnode.targetAnchor,
    staticCount: vnode.staticCount,
    shapeFlag: vnode.shapeFlag,
    // if the vnode is cloned with extra props, we can no longer assume its
    // existing patch flag to be reliable and need to add the FULL_PROPS flag.
    // note: preserve flag for fragments since they use the flag for children
    // fast paths only.
    patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 ? 16 : patchFlag | 16 : patchFlag,
    dynamicProps: vnode.dynamicProps,
    dynamicChildren: vnode.dynamicChildren,
    appContext: vnode.appContext,
    dirs: vnode.dirs,
    transition: vnode.transition,
    // These should technically only be non-null on mounted VNodes. However,
    // they *should* be copied for kept-alive vnodes. So we just always copy
    // them since them being non-null during a mount doesn't affect the logic as
    // they will simply be overwritten.
    component: vnode.component,
    suspense: vnode.suspense,
    ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
    ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
    el: vnode.el,
    anchor: vnode.anchor,
    ctx: vnode.ctx,
    ce: vnode.ce
  };
  return cloned;
}
function createTextVNode(text = " ", flag = 0) {
  return createVNode(Text, null, text, flag);
}
function createStaticVNode(content, numberOfNodes) {
  const vnode = createVNode(Static, null, content);
  vnode.staticCount = numberOfNodes;
  return vnode;
}
function normalizeVNode(child) {
  if (child == null || typeof child === "boolean") {
    return createVNode(Comment);
  } else if (isArray(child)) {
    return createVNode(
      Fragment,
      null,
      // #3666, avoid reference pollution when reusing vnode
      child.slice()
    );
  } else if (typeof child === "object") {
    return cloneIfMounted(child);
  } else {
    return createVNode(Text, null, String(child));
  }
}
function cloneIfMounted(child) {
  return child.el === null && child.patchFlag !== -1 || child.memo ? child : cloneVNode(child);
}
function normalizeChildren(vnode, children) {
  let type = 0;
  const { shapeFlag } = vnode;
  if (children == null) {
    children = null;
  } else if (isArray(children)) {
    type = 16;
  } else if (typeof children === "object") {
    if (shapeFlag & (1 | 64)) {
      const slot = children.default;
      if (slot) {
        slot._c && (slot._d = false);
        normalizeChildren(vnode, slot());
        slot._c && (slot._d = true);
      }
      return;
    } else {
      type = 32;
      const slotFlag = children._;
      if (!slotFlag && !(InternalObjectKey in children)) {
        children._ctx = currentRenderingInstance;
      } else if (slotFlag === 3 && currentRenderingInstance) {
        if (currentRenderingInstance.slots._ === 1) {
          children._ = 1;
        } else {
          children._ = 2;
          vnode.patchFlag |= 1024;
        }
      }
    }
  } else if (isFunction(children)) {
    children = { default: children, _ctx: currentRenderingInstance };
    type = 32;
  } else {
    children = String(children);
    if (shapeFlag & 64) {
      type = 16;
      children = [createTextVNode(children)];
    } else {
      type = 8;
    }
  }
  vnode.children = children;
  vnode.shapeFlag |= type;
}
function mergeProps(...args) {
  const ret = {};
  for (let i = 0; i < args.length; i++) {
    const toMerge = args[i];
    for (const key in toMerge) {
      if (key === "class") {
        if (ret.class !== toMerge.class) {
          ret.class = normalizeClass([ret.class, toMerge.class]);
        }
      } else if (key === "style") {
        ret.style = normalizeStyle([ret.style, toMerge.style]);
      } else if (isOn(key)) {
        const existing = ret[key];
        const incoming = toMerge[key];
        if (incoming && existing !== incoming && !(isArray(existing) && existing.includes(incoming))) {
          ret[key] = existing ? [].concat(existing, incoming) : incoming;
        }
      } else if (key !== "") {
        ret[key] = toMerge[key];
      }
    }
  }
  return ret;
}
function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
  callWithAsyncErrorHandling(hook, instance, 7, [
    vnode,
    prevVNode
  ]);
}
const emptyAppContext = createAppContext();
let uid = 0;
function createComponentInstance(vnode, parent, suspense) {
  const type = vnode.type;
  const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
  const instance = {
    uid: uid++,
    vnode,
    type,
    parent,
    appContext,
    root: null,
    next: null,
    subTree: null,
    effect: null,
    update: null,
    scope: new EffectScope(
      true
      /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: parent ? parent.provides : Object.create(appContext.provides),
    accessCache: null,
    renderCache: [],
    // local resolved assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: normalizePropsOptions(type, appContext),
    emitsOptions: normalizeEmitsOptions(type, appContext),
    // emit
    emit: null,
    emitted: null,
    // props default value
    propsDefaults: EMPTY_OBJ,
    // inheritAttrs
    inheritAttrs: type.inheritAttrs,
    // state
    ctx: EMPTY_OBJ,
    data: EMPTY_OBJ,
    props: EMPTY_OBJ,
    attrs: EMPTY_OBJ,
    slots: EMPTY_OBJ,
    refs: EMPTY_OBJ,
    setupState: EMPTY_OBJ,
    setupContext: null,
    // suspense related
    suspense,
    suspenseId: suspense ? suspense.pendingId : 0,
    asyncDep: null,
    asyncResolved: false,
    // lifecycle hooks
    // not using enums here because it results in computed properties
    isMounted: false,
    isUnmounted: false,
    isDeactivated: false,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null
  };
  {
    instance.ctx = { _: instance };
  }
  instance.root = parent ? parent.root : instance;
  instance.emit = emit.bind(null, instance);
  if (vnode.ce) {
    vnode.ce(instance);
  }
  return instance;
}
let currentInstance = null;
const getCurrentInstance = () => currentInstance || currentRenderingInstance;
const setCurrentInstance = (instance) => {
  currentInstance = instance;
  instance.scope.on();
};
const unsetCurrentInstance = () => {
  currentInstance && currentInstance.scope.off();
  currentInstance = null;
};
function isStatefulComponent(instance) {
  return instance.vnode.shapeFlag & 4;
}
let isInSSRComponentSetup = false;
function setupComponent(instance, isSSR = false) {
  isInSSRComponentSetup = isSSR;
  const { props, children } = instance.vnode;
  const isStateful = isStatefulComponent(instance);
  initProps(instance, props, isStateful, isSSR);
  initSlots(instance, children);
  const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
  isInSSRComponentSetup = false;
  return setupResult;
}
function setupStatefulComponent(instance, isSSR) {
  const Component = instance.type;
  instance.accessCache = /* @__PURE__ */ Object.create(null);
  instance.proxy = markRaw(new Proxy(instance.ctx, PublicInstanceProxyHandlers));
  const { setup } = Component;
  if (setup) {
    const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
    setCurrentInstance(instance);
    pauseTracking();
    const setupResult = callWithErrorHandling(setup, instance, 0, [instance.props, setupContext]);
    resetTracking();
    unsetCurrentInstance();
    if (isPromise(setupResult)) {
      setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
      if (isSSR) {
        return setupResult.then((resolvedResult) => {
          handleSetupResult(instance, resolvedResult, isSSR);
        }).catch((e) => {
          handleError(
            e,
            instance,
            0
            /* ErrorCodes.SETUP_FUNCTION */
          );
        });
      } else {
        instance.asyncDep = setupResult;
      }
    } else {
      handleSetupResult(instance, setupResult, isSSR);
    }
  } else {
    finishComponentSetup(instance, isSSR);
  }
}
function handleSetupResult(instance, setupResult, isSSR) {
  if (isFunction(setupResult)) {
    if (instance.type.__ssrInlineRender) {
      instance.ssrRender = setupResult;
    } else {
      instance.render = setupResult;
    }
  } else if (isObject(setupResult)) {
    instance.setupState = proxyRefs(setupResult);
  } else
    ;
  finishComponentSetup(instance, isSSR);
}
let compile;
function finishComponentSetup(instance, isSSR, skipOptions) {
  const Component = instance.type;
  if (!instance.render) {
    if (!isSSR && compile && !Component.render) {
      const template = Component.template || resolveMergedOptions(instance).template;
      if (template) {
        const { isCustomElement, compilerOptions } = instance.appContext.config;
        const { delimiters, compilerOptions: componentCompilerOptions } = Component;
        const finalCompilerOptions = extend(extend({
          isCustomElement,
          delimiters
        }, compilerOptions), componentCompilerOptions);
        Component.render = compile(template, finalCompilerOptions);
      }
    }
    instance.render = Component.render || NOOP;
  }
  {
    setCurrentInstance(instance);
    pauseTracking();
    applyOptions(instance);
    resetTracking();
    unsetCurrentInstance();
  }
}
function createAttrsProxy(instance) {
  return new Proxy(instance.attrs, {
    get(target, key) {
      track(instance, "get", "$attrs");
      return target[key];
    }
  });
}
function createSetupContext(instance) {
  const expose = (exposed) => {
    instance.exposed = exposed || {};
  };
  let attrs;
  {
    return {
      get attrs() {
        return attrs || (attrs = createAttrsProxy(instance));
      },
      slots: instance.slots,
      emit: instance.emit,
      expose
    };
  }
}
function getExposeProxy(instance) {
  if (instance.exposed) {
    return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
      get(target, key) {
        if (key in target) {
          return target[key];
        } else if (key in publicPropertiesMap) {
          return publicPropertiesMap[key](instance);
        }
      },
      has(target, key) {
        return key in target || key in publicPropertiesMap;
      }
    }));
  }
}
function isClassComponent(value) {
  return isFunction(value) && "__vccOpts" in value;
}
const computed = (getterOrOptions, debugOptions) => {
  return computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
};
const ssrContextKey = Symbol(``);
const useSSRContext = () => {
  {
    const ctx = inject(ssrContextKey);
    return ctx;
  }
};
const version = "3.2.47";
const svgNS = "http://www.w3.org/2000/svg";
const doc = typeof document !== "undefined" ? document : null;
const templateContainer = doc && /* @__PURE__ */ doc.createElement("template");
const nodeOps = {
  insert: (child, parent, anchor) => {
    parent.insertBefore(child, anchor || null);
  },
  remove: (child) => {
    const parent = child.parentNode;
    if (parent) {
      parent.removeChild(child);
    }
  },
  createElement: (tag, isSVG, is, props) => {
    const el = isSVG ? doc.createElementNS(svgNS, tag) : doc.createElement(tag, is ? { is } : void 0);
    if (tag === "select" && props && props.multiple != null) {
      el.setAttribute("multiple", props.multiple);
    }
    return el;
  },
  createText: (text) => doc.createTextNode(text),
  createComment: (text) => doc.createComment(text),
  setText: (node, text) => {
    node.nodeValue = text;
  },
  setElementText: (el, text) => {
    el.textContent = text;
  },
  parentNode: (node) => node.parentNode,
  nextSibling: (node) => node.nextSibling,
  querySelector: (selector) => doc.querySelector(selector),
  setScopeId(el, id) {
    el.setAttribute(id, "");
  },
  // __UNSAFE__
  // Reason: innerHTML.
  // Static content here can only come from compiled templates.
  // As long as the user only uses trusted templates, this is safe.
  insertStaticContent(content, parent, anchor, isSVG, start, end) {
    const before = anchor ? anchor.previousSibling : parent.lastChild;
    if (start && (start === end || start.nextSibling)) {
      while (true) {
        parent.insertBefore(start.cloneNode(true), anchor);
        if (start === end || !(start = start.nextSibling))
          break;
      }
    } else {
      templateContainer.innerHTML = isSVG ? `<svg>${content}</svg>` : content;
      const template = templateContainer.content;
      if (isSVG) {
        const wrapper = template.firstChild;
        while (wrapper.firstChild) {
          template.appendChild(wrapper.firstChild);
        }
        template.removeChild(wrapper);
      }
      parent.insertBefore(template, anchor);
    }
    return [
      // first
      before ? before.nextSibling : parent.firstChild,
      // last
      anchor ? anchor.previousSibling : parent.lastChild
    ];
  }
};
function patchClass(el, value, isSVG) {
  const transitionClasses = el._vtc;
  if (transitionClasses) {
    value = (value ? [value, ...transitionClasses] : [...transitionClasses]).join(" ");
  }
  if (value == null) {
    el.removeAttribute("class");
  } else if (isSVG) {
    el.setAttribute("class", value);
  } else {
    el.className = value;
  }
}
function patchStyle(el, prev, next) {
  const style = el.style;
  const isCssString = isString(next);
  if (next && !isCssString) {
    if (prev && !isString(prev)) {
      for (const key in prev) {
        if (next[key] == null) {
          setStyle(style, key, "");
        }
      }
    }
    for (const key in next) {
      setStyle(style, key, next[key]);
    }
  } else {
    const currentDisplay = style.display;
    if (isCssString) {
      if (prev !== next) {
        style.cssText = next;
      }
    } else if (prev) {
      el.removeAttribute("style");
    }
    if ("_vod" in el) {
      style.display = currentDisplay;
    }
  }
}
const importantRE = /\s*!important$/;
function setStyle(style, name, val) {
  if (isArray(val)) {
    val.forEach((v) => setStyle(style, name, v));
  } else {
    if (val == null)
      val = "";
    if (name.startsWith("--")) {
      style.setProperty(name, val);
    } else {
      const prefixed = autoPrefix(style, name);
      if (importantRE.test(val)) {
        style.setProperty(hyphenate(prefixed), val.replace(importantRE, ""), "important");
      } else {
        style[prefixed] = val;
      }
    }
  }
}
const prefixes = ["Webkit", "Moz", "ms"];
const prefixCache = {};
function autoPrefix(style, rawName) {
  const cached = prefixCache[rawName];
  if (cached) {
    return cached;
  }
  let name = camelize(rawName);
  if (name !== "filter" && name in style) {
    return prefixCache[rawName] = name;
  }
  name = capitalize(name);
  for (let i = 0; i < prefixes.length; i++) {
    const prefixed = prefixes[i] + name;
    if (prefixed in style) {
      return prefixCache[rawName] = prefixed;
    }
  }
  return rawName;
}
const xlinkNS = "http://www.w3.org/1999/xlink";
function patchAttr(el, key, value, isSVG, instance) {
  if (isSVG && key.startsWith("xlink:")) {
    if (value == null) {
      el.removeAttributeNS(xlinkNS, key.slice(6, key.length));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    const isBoolean = isSpecialBooleanAttr(key);
    if (value == null || isBoolean && !includeBooleanAttr(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, isBoolean ? "" : value);
    }
  }
}
function patchDOMProp(el, key, value, prevChildren, parentComponent, parentSuspense, unmountChildren) {
  if (key === "innerHTML" || key === "textContent") {
    if (prevChildren) {
      unmountChildren(prevChildren, parentComponent, parentSuspense);
    }
    el[key] = value == null ? "" : value;
    return;
  }
  if (key === "value" && el.tagName !== "PROGRESS" && // custom elements may use _value internally
  !el.tagName.includes("-")) {
    el._value = value;
    const newValue = value == null ? "" : value;
    if (el.value !== newValue || // #4956: always set for OPTION elements because its value falls back to
    // textContent if no value attribute is present. And setting .value for
    // OPTION has no side effect
    el.tagName === "OPTION") {
      el.value = newValue;
    }
    if (value == null) {
      el.removeAttribute(key);
    }
    return;
  }
  let needRemove = false;
  if (value === "" || value == null) {
    const type = typeof el[key];
    if (type === "boolean") {
      value = includeBooleanAttr(value);
    } else if (value == null && type === "string") {
      value = "";
      needRemove = true;
    } else if (type === "number") {
      value = 0;
      needRemove = true;
    }
  }
  try {
    el[key] = value;
  } catch (e) {
  }
  needRemove && el.removeAttribute(key);
}
function addEventListener(el, event, handler, options) {
  el.addEventListener(event, handler, options);
}
function removeEventListener(el, event, handler, options) {
  el.removeEventListener(event, handler, options);
}
function patchEvent(el, rawName, prevValue, nextValue, instance = null) {
  const invokers = el._vei || (el._vei = {});
  const existingInvoker = invokers[rawName];
  if (nextValue && existingInvoker) {
    existingInvoker.value = nextValue;
  } else {
    const [name, options] = parseName(rawName);
    if (nextValue) {
      const invoker = invokers[rawName] = createInvoker(nextValue, instance);
      addEventListener(el, name, invoker, options);
    } else if (existingInvoker) {
      removeEventListener(el, name, existingInvoker, options);
      invokers[rawName] = void 0;
    }
  }
}
const optionsModifierRE = /(?:Once|Passive|Capture)$/;
function parseName(name) {
  let options;
  if (optionsModifierRE.test(name)) {
    options = {};
    let m;
    while (m = name.match(optionsModifierRE)) {
      name = name.slice(0, name.length - m[0].length);
      options[m[0].toLowerCase()] = true;
    }
  }
  const event = name[2] === ":" ? name.slice(3) : hyphenate(name.slice(2));
  return [event, options];
}
let cachedNow = 0;
const p = /* @__PURE__ */ Promise.resolve();
const getNow = () => cachedNow || (p.then(() => cachedNow = 0), cachedNow = Date.now());
function createInvoker(initialValue, instance) {
  const invoker = (e) => {
    if (!e._vts) {
      e._vts = Date.now();
    } else if (e._vts <= invoker.attached) {
      return;
    }
    callWithAsyncErrorHandling(patchStopImmediatePropagation(e, invoker.value), instance, 5, [e]);
  };
  invoker.value = initialValue;
  invoker.attached = getNow();
  return invoker;
}
function patchStopImmediatePropagation(e, value) {
  if (isArray(value)) {
    const originalStop = e.stopImmediatePropagation;
    e.stopImmediatePropagation = () => {
      originalStop.call(e);
      e._stopped = true;
    };
    return value.map((fn) => (e2) => !e2._stopped && fn && fn(e2));
  } else {
    return value;
  }
}
const nativeOnRE = /^on[a-z]/;
const patchProp = (el, key, prevValue, nextValue, isSVG = false, prevChildren, parentComponent, parentSuspense, unmountChildren) => {
  if (key === "class") {
    patchClass(el, nextValue, isSVG);
  } else if (key === "style") {
    patchStyle(el, prevValue, nextValue);
  } else if (isOn(key)) {
    if (!isModelListener(key)) {
      patchEvent(el, key, prevValue, nextValue, parentComponent);
    }
  } else if (key[0] === "." ? (key = key.slice(1), true) : key[0] === "^" ? (key = key.slice(1), false) : shouldSetAsProp(el, key, nextValue, isSVG)) {
    patchDOMProp(el, key, nextValue, prevChildren, parentComponent, parentSuspense, unmountChildren);
  } else {
    if (key === "true-value") {
      el._trueValue = nextValue;
    } else if (key === "false-value") {
      el._falseValue = nextValue;
    }
    patchAttr(el, key, nextValue, isSVG);
  }
};
function shouldSetAsProp(el, key, value, isSVG) {
  if (isSVG) {
    if (key === "innerHTML" || key === "textContent") {
      return true;
    }
    if (key in el && nativeOnRE.test(key) && isFunction(value)) {
      return true;
    }
    return false;
  }
  if (key === "spellcheck" || key === "draggable" || key === "translate") {
    return false;
  }
  if (key === "form") {
    return false;
  }
  if (key === "list" && el.tagName === "INPUT") {
    return false;
  }
  if (key === "type" && el.tagName === "TEXTAREA") {
    return false;
  }
  if (nativeOnRE.test(key) && isString(value)) {
    return false;
  }
  return key in el;
}
const DOMTransitionPropsValidators = {
  name: String,
  type: String,
  css: {
    type: Boolean,
    default: true
  },
  duration: [String, Number, Object],
  enterFromClass: String,
  enterActiveClass: String,
  enterToClass: String,
  appearFromClass: String,
  appearActiveClass: String,
  appearToClass: String,
  leaveFromClass: String,
  leaveActiveClass: String,
  leaveToClass: String
};
/* @__PURE__ */ extend({}, BaseTransition.props, DOMTransitionPropsValidators);
const getModelAssigner = (vnode) => {
  const fn = vnode.props["onUpdate:modelValue"] || false;
  return isArray(fn) ? (value) => invokeArrayFns(fn, value) : fn;
};
function onCompositionStart(e) {
  e.target.composing = true;
}
function onCompositionEnd(e) {
  const target = e.target;
  if (target.composing) {
    target.composing = false;
    target.dispatchEvent(new Event("input"));
  }
}
const vModelText = {
  created(el, { modifiers: { lazy, trim, number } }, vnode) {
    el._assign = getModelAssigner(vnode);
    const castToNumber = number || vnode.props && vnode.props.type === "number";
    addEventListener(el, lazy ? "change" : "input", (e) => {
      if (e.target.composing)
        return;
      let domValue = el.value;
      if (trim) {
        domValue = domValue.trim();
      }
      if (castToNumber) {
        domValue = looseToNumber(domValue);
      }
      el._assign(domValue);
    });
    if (trim) {
      addEventListener(el, "change", () => {
        el.value = el.value.trim();
      });
    }
    if (!lazy) {
      addEventListener(el, "compositionstart", onCompositionStart);
      addEventListener(el, "compositionend", onCompositionEnd);
      addEventListener(el, "change", onCompositionEnd);
    }
  },
  // set value on mounted so it's after min/max for type="range"
  mounted(el, { value }) {
    el.value = value == null ? "" : value;
  },
  beforeUpdate(el, { value, modifiers: { lazy, trim, number } }, vnode) {
    el._assign = getModelAssigner(vnode);
    if (el.composing)
      return;
    if (document.activeElement === el && el.type !== "range") {
      if (lazy) {
        return;
      }
      if (trim && el.value.trim() === value) {
        return;
      }
      if ((number || el.type === "number") && looseToNumber(el.value) === value) {
        return;
      }
    }
    const newValue = value == null ? "" : value;
    if (el.value !== newValue) {
      el.value = newValue;
    }
  }
};
const rendererOptions = /* @__PURE__ */ extend({ patchProp }, nodeOps);
let renderer;
function ensureRenderer() {
  return renderer || (renderer = createRenderer(rendererOptions));
}
const createApp = (...args) => {
  const app = ensureRenderer().createApp(...args);
  const { mount } = app;
  app.mount = (containerOrSelector) => {
    const container = normalizeContainer(containerOrSelector);
    if (!container)
      return;
    const component = app._component;
    if (!isFunction(component) && !component.render && !component.template) {
      component.template = container.innerHTML;
    }
    container.innerHTML = "";
    const proxy = mount(container, false, container instanceof SVGElement);
    if (container instanceof Element) {
      container.removeAttribute("v-cloak");
      container.setAttribute("data-v-app", "");
    }
    return proxy;
  };
  return app;
};
function normalizeContainer(container) {
  if (isString(container)) {
    const res = document.querySelector(container);
    return res;
  }
  return container;
}
const App_vue_vue_type_style_index_0_lang = "";
const _hoisted_1 = { id: "wholeBox" };
const _hoisted_2 = { id: "form" };
const _hoisted_3 = /* @__PURE__ */ createBaseVNode("div", { id: "OrderBox" }, [
  /* @__PURE__ */ createBaseVNode("h3", { class: "text" }, "Order Form"),
  /* @__PURE__ */ createBaseVNode("h5", {
    id: "textUpTop",
    class: "text"
  }, " Please fill in your information and we'll be sending your order in no time")
], -1);
const _hoisted_4 = { id: "nameField" };
const _hoisted_5 = /* @__PURE__ */ createBaseVNode("label", {
  for: "first",
  class: "form-label"
}, "Name ", -1);
const _hoisted_6 = /* @__PURE__ */ createBaseVNode("label", {
  for: "last",
  class: "form-label"
}, null, -1);
const _hoisted_7 = /* @__PURE__ */ createBaseVNode("br", null, null, -1);
const _hoisted_8 = { id: "emailBox" };
const _hoisted_9 = /* @__PURE__ */ createBaseVNode("label", {
  for: "email",
  class: "form-label"
}, "Email ", -1);
const _hoisted_10 = /* @__PURE__ */ createStaticVNode('<div><label for="shirt" class="form-label"> T-Shirt Model </label><table id="shirtBox"><tr><td><img class="images" src="data:image/png;base64,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"></td><td><img class="images" src="data:image/png;base64,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"></td><td><img class="images" src="data:image/png;base64,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"></td></tr><tr><td style="text-align:center;"><input type="radio" name="shirts" value="shirtOne"></td><td style="text-align:center;"><input type="radio" name="shirts" value="shirtTwo"></td><td style="text-align:center;"><input type="radio" name="shirts" value="shirtThree" default></td></tr></table><div id="sizeBox"><label for="size" class="form-label"> Size </label><select name="size" id="size"><option value="small">S</option><option value="medium">M</option><option value="large">L</option><option value="extraLarge">XL</option></select></div></div>', 1);
const _hoisted_11 = { id: "quantityBox" };
const _hoisted_12 = /* @__PURE__ */ createBaseVNode("label", {
  for: "quantity",
  class: "form-label"
}, "Quantity ", -1);
const _hoisted_13 = /* @__PURE__ */ createBaseVNode("div", { id: "deliveryDate" }, [
  /* @__PURE__ */ createBaseVNode("label", { for: "date" }, "Start date"),
  /* @__PURE__ */ createBaseVNode("input", {
    type: "date",
    id: "start",
    name: "trip-start",
    value: "2018-07-22",
    min: "2018-01-01",
    max: "2018-12-31",
    required: ""
  })
], -1);
const _hoisted_14 = { id: "address" };
const _hoisted_15 = /* @__PURE__ */ createBaseVNode("label", { for: "address" }, "Delivery Address ", -1);
const _hoisted_16 = /* @__PURE__ */ createBaseVNode("br", null, null, -1);
const _hoisted_17 = /* @__PURE__ */ createBaseVNode("br", null, null, -1);
const _hoisted_18 = /* @__PURE__ */ createBaseVNode("br", null, null, -1);
const _hoisted_19 = /* @__PURE__ */ createBaseVNode("br", null, null, -1);
const _hoisted_20 = /* @__PURE__ */ createBaseVNode("div", { class: "col-6" }, [
  /* @__PURE__ */ createBaseVNode("div", { id: "info" }, [
    /* @__PURE__ */ createBaseVNode("hr")
  ])
], -1);
const _sfc_main = {
  __name: "App",
  setup(__props) {
    const user = reactive({
      name: {
        first: "",
        last: ""
      },
      email: "",
      quantity: "",
      size: "",
      date: "",
      shirt: {},
      address: {
        staddress: "",
        staddress2: "",
        city: "",
        zipcode: ""
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        createBaseVNode("div", _hoisted_1, [
          createBaseVNode("form", _hoisted_2, [
            _hoisted_3,
            createBaseVNode("fieldset", null, [
              createBaseVNode("div", _hoisted_4, [
                _hoisted_5,
                withDirectives(createBaseVNode("input", {
                  id: "first",
                  type: "text",
                  class: "form-control",
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => user.name.first = $event),
                  required: ""
                }, null, 512), [
                  [vModelText, user.name.first]
                ]),
                _hoisted_6,
                withDirectives(createBaseVNode("input", {
                  id: "last",
                  type: "text",
                  class: "form-control",
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => user.name.last = $event),
                  required: ""
                }, null, 512), [
                  [vModelText, user.name.last]
                ])
              ]),
              _hoisted_7,
              createBaseVNode("div", _hoisted_8, [
                _hoisted_9,
                withDirectives(createBaseVNode("input", {
                  id: "email",
                  type: "text",
                  class: "form-control",
                  "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => user.email = $event),
                  required: ""
                }, null, 512), [
                  [vModelText, user.email]
                ])
              ]),
              _hoisted_10,
              createBaseVNode("div", _hoisted_11, [
                _hoisted_12,
                withDirectives(createBaseVNode("input", {
                  id: "quantity",
                  type: "text",
                  class: "form-control",
                  "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => user.quantity = $event),
                  required: ""
                }, null, 512), [
                  [vModelText, user.quantity]
                ])
              ]),
              _hoisted_13,
              createBaseVNode("div", _hoisted_14, [
                _hoisted_15,
                _hoisted_16,
                withDirectives(createBaseVNode("input", {
                  type: "text",
                  id: "addressFirstLine",
                  name: "address",
                  "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => user.address.staddress = $event),
                  required: ""
                }, null, 512), [
                  [vModelText, user.address.staddress]
                ]),
                _hoisted_17,
                withDirectives(createBaseVNode("input", {
                  type: "text",
                  id: "addressSecondLine",
                  name: "address",
                  "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => user.address.staddress = $event)
                }, null, 512), [
                  [vModelText, user.address.staddress]
                ]),
                _hoisted_18,
                withDirectives(createBaseVNode("input", {
                  type: "text",
                  id: "city",
                  name: "address",
                  "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => user.address.city = $event),
                  required: ""
                }, null, 512), [
                  [vModelText, user.address.city]
                ]),
                _hoisted_19,
                withDirectives(createBaseVNode("input", {
                  type: "text",
                  id: "zipCode",
                  name: "address",
                  "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => user.address.zipcode = $event),
                  required: ""
                }, null, 512), [
                  [vModelText, user.address.zipcode]
                ])
              ])
            ]),
            createBaseVNode("button", {
              id: "submitButton",
              class: "btn",
              role: "button",
              type: "button",
              onClick: _cache[8] || (_cache[8] = (...args) => _ctx.submit && _ctx.submit(...args))
            }, "Purchase")
          ])
        ]),
        _hoisted_20
      ], 64);
    };
  }
};
const main = "";
createApp(_sfc_main).mount("#app");
