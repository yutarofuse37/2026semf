<script setup lang="ts">
import { useId } from 'vue'
import Katex from './Katex.vue'
const id = `directed-cut-${useId().replace(/:/g, '')}`
</script>

<template>
  <svg viewBox="0 0 460 300" class="directed-cut" role="img" aria-label="有向カットの例。Sはsとa。Sから外へ出る赤い辺はsからbの容量2とaからtの容量3で、カット容量は5。bからaの容量7は逆向きなので数えない。">
    <defs>
      <marker :id="`${id}-red`" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 Z" fill="#b42318" /></marker>
      <marker :id="`${id}-gray`" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 Z" fill="#7b879c" /></marker>
    </defs>
    <rect x="20" y="30" width="160" height="250" rx="16" fill="#edf2fb" stroke="#bdcce3" />
    <rect x="280" y="30" width="160" height="250" rx="16" fill="#f6f7fa" stroke="#d9dee8" />
    <foreignObject x="20" y="37" width="160" height="30">
      <div xmlns="http://www.w3.org/1999/xhtml" class="set-label"><Katex expr="S=\{s,a\}" /></div>
    </foreignObject>
    <foreignObject x="280" y="37" width="160" height="30">
      <div xmlns="http://www.w3.org/1999/xhtml" class="set-label complement"><Katex expr="V\setminus S=\{b,t\}" /></div>
    </foreignObject>
    <path d="M 230 28 V 280" stroke="#a7b5cd" stroke-dasharray="6 6" />
    <path d="M 100 118 V 207" stroke="#7b879c" stroke-width="2.5" :marker-end="`url(#${id}-gray)`" />
    <path d="M 360 118 V 207" stroke="#7b879c" stroke-width="2.5" :marker-end="`url(#${id}-gray)`" />
    <path d="M 341 109 L 120 217" stroke="#7b879c" stroke-width="2.5" stroke-dasharray="6 4" :marker-end="`url(#${id}-gray)`" />
    <path d="M 121 97 H 338" stroke="#b42318" stroke-width="3.5" :marker-end="`url(#${id}-red)`" />
    <path d="M 121 229 H 338" stroke="#b42318" stroke-width="3.5" :marker-end="`url(#${id}-red)`" />
    <g fill="#b42318" class="capacity"><text x="230" y="87" text-anchor="middle">2</text><text x="230" y="254" text-anchor="middle">3</text></g>
    <g fill="#66748b" class="capacity"><text x="80" y="167" text-anchor="middle">4</text><text x="380" y="167" text-anchor="middle">4</text><text x="239" y="150">7</text></g>
    <g fill="white" stroke="#1c3177" stroke-width="2"><circle cx="100" cy="97" r="20" /><circle cx="100" cy="229" r="20" /><circle cx="360" cy="97" r="20" /><circle cx="360" cy="229" r="20" /></g>
    <g text-anchor="middle" dominant-baseline="central" fill="#1c3177" class="node"><text x="100" y="97">s</text><text x="100" y="229">a</text><text x="360" y="97">b</text><text x="360" y="229">t</text></g>
  </svg>
</template>

<style scoped>
.directed-cut { width:100%; height:auto; display:block; }
.set-label { display:flex; justify-content:center; align-items:center; height:100%; font-size:16px; color:#1c3177; }
.set-label.complement { color:#526079; }
.directed-cut text { font-size:16px !important; }
.directed-cut .capacity text { font-size:19px !important; paint-order:stroke; stroke:white; stroke-width:4px; }
.directed-cut .node text { font-size:21px !important; font-weight:600; }
</style>
