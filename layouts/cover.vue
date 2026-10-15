<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  background: {
    default: '',
  },
})

const style = computed(() => {
  const background = props.background
  if (!background)
    return { color: '#000000' }

  const isColor = ['#', 'rgb', 'hsl'].some(v => background.indexOf(v) === 0)
  if (isColor)
    return { background, color: '#000000' }

  const url = background.startsWith('/')
    ? import.meta.env.BASE_URL + background.slice(1)
    : background

  return {
    backgroundImage: `url("${url}")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    color: '#000000',
  }
})
</script>

<template>
  <div class="slidev-layout cover text-left" :style="style">
    <div class="my-auto w-full">
      <slot />
    </div>
  </div>
</template>
