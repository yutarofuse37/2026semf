<script setup lang="ts">
const logoUrl = `${import.meta.env.BASE_URL}logo.png`
</script>

<template>
  <footer
    v-if="!['cover', 'section', 'intro', 'end'].includes($nav.currentLayout)"
    class="st-footer"
  >
    <div class="st-footer__left">
      <img
        :src="logoUrl"
        alt="Science Tokyo"
        class="st-footer__logo"
      >
    </div>
    <div class="st-footer__center">
      {{ $slidev.configs.seminar ? 'Multiplicative Weights Update for Maximizing Network Connectivity' : 'MWU for Absolute Algebraic Connectivity' }}
    </div>
    <div class="st-footer__right">
      <span class="st-footer__authors">{{ $slidev.configs.seminar ? 'ゼミ資料' : '布施・清水' }}</span>
      <span class="st-footer__page">{{ $nav.currentPage }} / {{ $nav.total }}</span>
    </div>
  </footer>
</template>

<style scoped>
.st-footer {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 20;
  display: grid;
  grid-template-columns: 1fr 1.4fr 1fr;
  align-items: center;
  gap: 0.5rem;
  height: 2.1rem;
  padding: 0 0.85rem;
  border-top: 1px solid #cfdbed;
  background: color-mix(in srgb, #f9fbff 92%, white);
  color: #1c3177;
  font-size: 0.68rem;
  line-height: 1;
  pointer-events: none;
}

.st-footer__left {
  display: flex;
  align-items: center;
}

.st-footer__logo {
  height: 1.05rem;
  width: auto;
  object-fit: contain;
}

.st-footer__center {
  text-align: center;
  opacity: 1;
  color: #1c3177;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.st-footer__right {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.75rem;
}

.st-footer__authors {
  opacity: 1;
  color: #1c3177;
}

.st-footer__page {
  font-variant-numeric: tabular-nums;
  font-weight: 600;
}
</style>
