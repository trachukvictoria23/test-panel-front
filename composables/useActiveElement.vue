

<template>
  <div>
    <button id="my-btn" @click="counter += 1">Click</button>

    <div data-id="my-span" id="span" @click="counter += 1">hello</div>
    <input type="text" />

    <UseActiveElement v-slot="{ element }">
      Active element is {{ element.id }}
    </UseActiveElement>
  </div>
</template>

<script setup>
import { useActiveElement } from '@vueuse/core'
import { UseActiveElement } from "@vueuse/components";
import { ref, nextTick } from "vue";

const activeElement = useActiveElement()

watch(activeElement, (el) => {
  console.log('focus changed to', el)
})
</script>