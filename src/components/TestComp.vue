<template>
  <footer class="app-footer">
    <p>Value: {{ foo }}</p>
    <input type="text" v-model="foo" />
    <!-- <button @click="myVal">Minus</button> -->
  </footer>
</template>

<script setup>
import { useVModels } from "@vueuse/core";
import { toRefs } from "vue";

const props = defineProps({
  foo: [String, Number],
  bar: [String, Number],
});

const emit = defineEmits(['update:foo'])

const { foo, bar } = useVModels(props, emit);
console.log(foo.value); // props.foo
setTimeout(() => {
    foo.value = 3; //
}, 2000)

</script>

<style lang="scss" scoped>
.app-footer {
  padding: 0px 40px;
  height: 64px;
  background: lavender;
  display: flex;
  align-items: center;
  // margin-top: 40px;
}
</style>