import { u as useuserInfoStore, o as openBlock, c as createElementBlock, a as createVNode, b as createBaseVNode, w as withDirectives, v as vModelText, d as unref, F as Fragment, _ as _sfc_main$1 } from "./index-2f32246d.js";
const _hoisted_1 = { id: "edit" };
const _hoisted_2 = /* @__PURE__ */ createBaseVNode("label", { for: "fname" }, "First name:", -1);
const _hoisted_3 = /* @__PURE__ */ createBaseVNode("br", null, null, -1);
const _hoisted_4 = /* @__PURE__ */ createBaseVNode("br", null, null, -1);
const _hoisted_5 = /* @__PURE__ */ createBaseVNode("label", { for: "lname" }, "Last name:", -1);
const _hoisted_6 = /* @__PURE__ */ createBaseVNode("br", null, null, -1);
const _hoisted_7 = /* @__PURE__ */ createBaseVNode("br", null, null, -1);
const _hoisted_8 = /* @__PURE__ */ createBaseVNode("br", null, null, -1);
const _hoisted_9 = /* @__PURE__ */ createBaseVNode("label", { for: "fname" }, "Street Address:", -1);
const _hoisted_10 = /* @__PURE__ */ createBaseVNode("br", null, null, -1);
const _hoisted_11 = /* @__PURE__ */ createBaseVNode("br", null, null, -1);
const _hoisted_12 = /* @__PURE__ */ createBaseVNode("label", { for: "fname" }, "City:", -1);
const _hoisted_13 = /* @__PURE__ */ createBaseVNode("br", null, null, -1);
const _hoisted_14 = /* @__PURE__ */ createBaseVNode("br", null, null, -1);
const _hoisted_15 = /* @__PURE__ */ createBaseVNode("label", { for: "fname" }, "State:", -1);
const _hoisted_16 = /* @__PURE__ */ createBaseVNode("br", null, null, -1);
const _hoisted_17 = /* @__PURE__ */ createBaseVNode("br", null, null, -1);
const _hoisted_18 = /* @__PURE__ */ createBaseVNode("label", { for: "fname" }, "Zipcode:", -1);
const _hoisted_19 = /* @__PURE__ */ createBaseVNode("br", null, null, -1);
const _hoisted_20 = /* @__PURE__ */ createBaseVNode("br", null, null, -1);
const _sfc_main = {
  __name: "Edit",
  setup(__props) {
    const store = useuserInfoStore();
    function submit() {
      console.log(store);
      let fname = store.fname;
      let lname = store.lname;
      let stAddr = store.stAddr;
      let city = store.city;
      let state = store.state;
      let zipCode = store.zipCode;
      console.log(fname, lname, stAddr, city, state, zipCode);
      return { fname, lname, stAddr, city, state, zipCode };
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        createVNode(_sfc_main$1),
        createBaseVNode("form", _hoisted_1, [
          _hoisted_2,
          _hoisted_3,
          withDirectives(createBaseVNode("input", {
            type: "text",
            id: "fname",
            placeholder: "First Name",
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => unref(store).fname = $event)
          }, null, 512), [
            [vModelText, unref(store).fname]
          ]),
          _hoisted_4,
          _hoisted_5,
          _hoisted_6,
          withDirectives(createBaseVNode("input", {
            type: "text",
            id: "lname",
            placeholder: "Last Name",
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => unref(store).lname = $event)
          }, null, 512), [
            [vModelText, unref(store).lname]
          ]),
          _hoisted_7,
          _hoisted_8,
          _hoisted_9,
          _hoisted_10,
          withDirectives(createBaseVNode("input", {
            type: "text",
            id: "stAddr",
            placeholder: "Street",
            "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => unref(store).stAddr = $event)
          }, null, 512), [
            [vModelText, unref(store).stAddr]
          ]),
          _hoisted_11,
          _hoisted_12,
          _hoisted_13,
          withDirectives(createBaseVNode("input", {
            type: "text",
            id: "city",
            placeholder: "City",
            "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => unref(store).city = $event)
          }, null, 512), [
            [vModelText, unref(store).city]
          ]),
          _hoisted_14,
          _hoisted_15,
          _hoisted_16,
          withDirectives(createBaseVNode("input", {
            type: "text",
            id: "state",
            placeholder: "State",
            "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => unref(store).state = $event)
          }, null, 512), [
            [vModelText, unref(store).state]
          ]),
          _hoisted_17,
          _hoisted_18,
          _hoisted_19,
          withDirectives(createBaseVNode("input", {
            type: "text",
            id: "zipCode",
            placeholder: "ZipCode",
            "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => unref(store).zipCode = $event)
          }, null, 512), [
            [vModelText, unref(store).zipCode]
          ]),
          _hoisted_20,
          createBaseVNode("input", {
            type: "submit",
            value: "Submit",
            onClick: submit
          })
        ])
      ], 64);
    };
  }
};
export {
  _sfc_main as default
};
