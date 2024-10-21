<template>
  <div>
   {{ new Date(lastChanged) }}
  </div>
</template>

<script setup>
import { useLastChanged } from "@vueuse/core";
import { ref, nextTick } from "vue";

const state = ref({
  foo: 1,
  bar: "bar",
});

const lastChanged = useLastChanged(state, {deep: true})

</script>