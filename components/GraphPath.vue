<script setup lang="ts">
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
import Katex from './Katex.vue'
import AcDisplacementGraph from './AcDisplacementGraph.vue'

const { $clicks } = useSlideContext()
const stage = computed(() => Math.min(Math.max(Number($clicks.value ?? 0), 0), 2))
const allocations = [
  { name: '配分 A：中央の辺が細い', weights: [0.45, 0.10, 0.45], formula: 'w_{12}=w_{34}=0.45,\\quad w_{23}=0.10', result: 'C_A=0.10' },
  { name: '配分 B：中央の辺が太い', weights: [0.05, 0.90, 0.05], formula: 'w_{12}=w_{34}=0.05,\\quad w_{23}=0.90', result: 'C_B=0.90' },
]
</script>

<template>
  <div class="gp">
    <figure v-for="allocation in allocations" :key="allocation.name" class="gp-comparison">
      <figcaption>{{ allocation.name }}</figcaption>
      <Katex class="gp-weights" :expr="allocation.formula" />
      <AcDisplacementGraph :stage="stage" :weights="allocation.weights" :show-weights="false" />
      <Katex class="gp-result" :class="{ revealed: stage >= 2 }" :expr="allocation.result" />
    </figure>
  </div>
</template>

<style scoped>
.gp { display: grid; grid-template-columns: 1fr 1fr; gap: 34px; width: 100%; position: relative; }
.gp::after { content: ''; position: absolute; left: 50%; top: 0; bottom: 0; width: 1px; background: #cfdbed; }
.gp-comparison { margin: 0; text-align: center; }
.gp-comparison figcaption { font-size: 20px; font-weight: 700; color: #1c3177; margin-bottom: 7px; }
.gp-weights { display: block; font-size: 16px; color: #444; margin-bottom: 4px; }
.gp-comparison :deep(.ac-graph) { max-width: 360px; margin: 0 auto; }
.gp-result { display: block; font-size: 23px; color: #b42318; opacity: 0; transition: opacity .35s ease; }
.gp-result.revealed { opacity: 1; }
@media (prefers-reduced-motion: reduce) { .gp-result { transition: none; } }
</style>
