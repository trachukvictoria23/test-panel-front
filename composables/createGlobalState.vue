<script>
import { createGlobalState } from "@vueuse/core";
import { computed, ref } from "vue";

export const useGlobalState = createGlobalState(() => {
  // state
  const count = ref(0);

  // getters
  const doubleCount = computed(() => count.value * 2);

  // actions
  function increment() {
    count.value++;
  }

  return { count, doubleCount, increment };
});

// import { useGlobalState } from './Home.vue'
// const state = useGlobalState()
</script>