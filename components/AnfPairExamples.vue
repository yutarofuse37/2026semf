<script setup lang="ts">
import { useId } from 'vue'
import Katex from './Katex.vue'

const uid = `anf-ex-${useId().replace(/:/g, '')}`
</script>

<template>
  <div class="anf-examples">
    <figure>
      <figcaption>一方向の経路</figcaption>
      <svg viewBox="0 0 420 168" role="img" aria-label="頂点sからa、aからtへ容量2分の1の有向辺がある。tからsへは経路がなく、流量は0。">
        <defs>
          <marker :id="`${uid}-on`" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 Z" fill="#1c3177" />
          </marker>
          <marker :id="`${uid}-off`" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 Z" fill="#b42318" />
          </marker>
        </defs>
        <path d="M 78 72 H 186" stroke="#1c3177" stroke-width="3.2" :marker-end="`url(#${uid}-on)`" />
        <path d="M 234 72 H 342" stroke="#1c3177" stroke-width="3.2" :marker-end="`url(#${uid}-on)`" />
        <path d="M 365 108 C 300 158 120 158 55 108" fill="none" stroke="#b42318" stroke-width="2.2" stroke-dasharray="6 5" :marker-end="`url(#${uid}-off)`" />
        <g fill="white" stroke="#1c3177" stroke-width="2">
          <circle cx="55" cy="72" r="22" />
          <circle cx="210" cy="72" r="22" />
          <circle cx="365" cy="72" r="22" />
        </g>
        <g text-anchor="middle" dominant-baseline="central" class="node">
          <text x="55" y="72">s</text>
          <text x="210" y="72">a</text>
          <text x="365" y="72">t</text>
        </g>
        <g text-anchor="middle" class="weight">
          <text x="132" y="58">1/2</text>
          <text x="288" y="58">1/2</text>
          <text x="210" y="148" fill="#b42318">0</text>
        </g>
      </svg>
      <p class="cap">
        <Katex expr="\kappa_{st}=\dfrac{1}{2},\ \kappa_{ts}=0,\ \mathrm{ANF}=\dfrac{1}{4}" />
      </p>
    </figure>

    <figure>
      <figcaption>有向サイクル</figcaption>
      <svg viewBox="0 0 420 168" role="img" aria-label="頂点1、2、3の有向サイクル。各辺の容量は3分の1で、すべての順序対の最小カットは3分の1。">
        <defs>
          <marker :id="`${uid}-cyc`" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 Z" fill="#1c3177" />
          </marker>
        </defs>
        <path d="M 188 49 L 96 118" stroke="#1c3177" stroke-width="3.2" :marker-end="`url(#${uid}-cyc)`" />
        <path d="M 100 138 H 318" stroke="#1c3177" stroke-width="3.2" :marker-end="`url(#${uid}-cyc)`" />
        <path d="M 324 118 L 232 49" stroke="#1c3177" stroke-width="3.2" :marker-end="`url(#${uid}-cyc)`" />
        <g fill="white" stroke="#1c3177" stroke-width="2">
          <circle cx="210" cy="32" r="22" />
          <circle cx="72" cy="138" r="22" />
          <circle cx="348" cy="138" r="22" />
        </g>
        <g text-anchor="middle" dominant-baseline="central" class="node">
          <text x="210" y="32">1</text>
          <text x="72" y="138">2</text>
          <text x="348" y="138">3</text>
        </g>
        <g text-anchor="middle" class="weight">
          <text x="128" y="74">1/3</text>
          <text x="210" y="126">1/3</text>
          <text x="292" y="74">1/3</text>
        </g>
      </svg>
      <p class="cap">
        <Katex expr="\kappa_{ij}(w)=\dfrac{1}{3},\ \mathrm{ANF}(w)=\dfrac{1}{3}" />
      </p>
    </figure>
  </div>
</template>

<style scoped>
.anf-examples {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.85rem;
  margin: 0.15rem 0 0;
}
figure {
  margin: 0;
  border: 1px solid #d5deee;
  border-radius: 12px;
  background: #f7f9fd;
  padding: 0.28rem 0.45rem 0.35rem;
}
figcaption {
  margin: 0;
  text-align: center;
  color: #1c3177;
  font-weight: 650;
  font-size: 0.98rem;
  line-height: 1.3;
}
svg {
  width: 100%;
  height: 128px;
  display: block;
}
.node text {
  fill: #1c3177;
  font-size: 18px !important;
  font-weight: 650;
}
.weight text {
  fill: #1c3177;
  font-size: 15px !important;
  font-weight: 650;
  paint-order: stroke;
  stroke: #f7f9fd;
  stroke-width: 4px;
}
.cap {
  margin: 0;
  text-align: center;
  line-height: 1.25;
  color: #3d4d6b;
}
</style>
