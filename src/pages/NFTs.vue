<template>
  <div>
    NFTs Count: {{ counter }} <br />
    {{ bar }}

    <button id="my-btn" @click="counter++">Click</button>
    <br /><br />

    <!-- <div ref="source">
      hello
      <TestComp ref="componentRef" :foo="counter" :bar="bar" @update:foo="counter = $event" />
    </div> -->
    <!-- 
   <input type="text" v-model="checkMe" /> -->
  </div>
</template>

<script setup>
import TestComp from "../components/TestComp.vue";
import { ref, nextTick, watch, onMounted, onBeforeMount, computed } from "vue";
import { watchAtMost } from "@vueuse/core";

const source = ref();
// const componentRef = ref();
const counter = ref("0");
const bar = ref("fff");

import { watchImmediate } from "@vueuse/core";

const obj = ref("vue-use");

// changing the value from some external store/composables
obj.value = "VueUse";

watchImmediate(obj, (updated) => {
  console.log("updated", updated); // Console.log will be logged twice
});

// watchAtMost(count, (value) => console.log("watch", value), { count: 3 });

// setInterval(() => {
//     console.log('memory', getCurrentScope())
// }, 3000)

onMounted(() => {
  //   console.log("source", source.value);
  //   console.log("refs", refs);
});

// // const state = ref({
// //   foo: 1,
// //   bar: "bar",
// // });

// setTimeout(() => {
//   //   console.log("pause", document.visibilityState);
// }, 2000);

// async function click() {
//   counter.value += 1;
// }

// // import { useEventListener } from '@vueuse/core'

// // const stop = useEventListener('mousemove', (e) => {
// //     console.log('move', e)
// // // })

// // import { useMouse } from '@vueuse/core'

// // // "x" and "y" are refs
// // const { x, y } = useMouse()

// // console.log('1',x.value)

// // const mouse = useMouse()

// // console.log('2',mouse.x.value)

// // const mouse1 = reactive(useMouse())

// // // "x" and "y" will be auto unwrapped, no `.value` needed
// // console.log(mouse1.x)

// // import { debounceFilter, throttleFilter, useLocalStorage, useMouse } from '@vueuse/core'

// // const myKey = ref('11')
// // const someEl = ref()

// // // changes will write to localStorage with a throttled 1s
// // const storage = useLocalStorage('my-key', { foo: myKey.value }, { eventFilter: throttleFilter(2000) })
</script>