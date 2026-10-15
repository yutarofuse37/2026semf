<script setup lang="ts">
import katex from 'katex'
import { computed } from 'vue'
import 'katex/dist/katex.min.css'

const props = defineProps<{
  expr: string
  display?: boolean
}>()

const html = computed(() =>
  katex.renderToString(props.expr, {
    throwOnError: false,
    displayMode: !!props.display,
    strict: 'ignore',
  }),
)
</script>

<template>
  <span class="kx" v-html="html" />
</template>

<style scoped>
.kx :deep(.katex) {
  font-size: 1em;
}
</style>
