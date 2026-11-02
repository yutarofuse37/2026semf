<script setup lang="ts">
import { computed, unref } from 'vue'
import { useSlideContext } from '@slidev/client'
import SlideLink from '@slidev/client/builtin/Link.vue'

const { $nav } = useSlideContext()
const sections = [
  { target: 'problem-setting', title: '問題設定と主結果' },
  { target: 'mwu', title: 'MWU と関連研究' },
  { target: 'anf', title: 'Average Network Flow 最大化' },
  { target: 'ac', title: 'Algebraic Connectivity 最大化' },
  { target: 'summary', title: 'まとめ' },
  { target: 'references', title: '参考文献' },
  { target: 'appendix', title: 'Appendix：ANF の厳密解法' },
]
const entries = computed(() => sections.map(section => ({
  ...section,
  page: unref($nav.value.slides).find(slide => slide.meta.slide?.frontmatter.routeAlias === section.target)?.no,
})))
</script>

<template>
  <nav class="deck-contents" aria-label="発表の目次">
    <ol>
      <li v-for="(entry, index) in entries" :key="entry.target">
        <SlideLink v-if="entry.page" :to="entry.page" class="contents-link">
          <span class="contents-number">{{ index + 1 }}</span>
          <span class="contents-title">{{ entry.title }}</span>
          <span class="contents-page">p. {{ entry.page }}</span>
        </SlideLink>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.deck-contents { margin-top:18px; }
.deck-contents ol { list-style:none; padding:0; margin:0; }
.deck-contents li { margin:0 !important; border-bottom:1px solid #dce4f0; }
.deck-contents li:last-child { border-bottom:0; }
.contents-link {
  display:grid;
  grid-template-columns:32px 1fr 60px;
  align-items:center;
  gap:12px;
  min-height:46px;
  color:#1c3177;
  border:0;
  text-decoration:none;
}
.contents-number { color:#7f96c2; font-size:17px; font-variant-numeric:tabular-nums; }
.contents-title { font-size:22px; font-weight:600; }
.contents-page { color:#52637d; text-align:right; font-size:15px; font-variant-numeric:tabular-nums; }
.contents-link:hover .contents-title,
.contents-link:focus-visible .contents-title { text-decoration:underline; text-underline-offset:5px; }
.contents-link:focus-visible { outline:2px solid #7f96c2; outline-offset:3px; }
</style>
