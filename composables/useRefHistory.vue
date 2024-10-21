<template>
  <div>
    NFTs
    <span id="history">
      {{ history }}
    </span>

    <button @click="click">Click</button>
    <button @click="redo">Redo</button>
    <button @click="undo">Undo</button>
    <button @click="pause">Clear</button>
  </div>
</template>

<script setup>
import { useRefHistory } from "@vueuse/core";
import { ref, nextTick } from "vue";

const counter = ref(0);
const state = ref({
  foo: 1,
  bar: "bar",
});

const {
  history: history1,
  undo: undo1,
  redo: redo1,
} = useRefHistory(state, { deep: true });

// clone
const history11 = useRefHistory(target, { clone: structuredClone });
console.log("history11", history11);
// options: clone , dump, parse, capacity(15), flush(pre/post/sync)

const { history, undo, redo, clear, pause } = useRefHistory(counter);

async function click1() {
  state.value.foo += 1;
}

async function click() {
  counter.value += 1;
  //   console.log(document.getElementById('history').textContent)

  //   await nextTick();
  //   console.log(history.value);
}
</script>