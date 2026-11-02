<script setup lang="ts">
import Katex from './Katex.vue'
</script>

<template>
  <div class="exact-proof">
    <p class="proof-context">LP の実行可能領域を <Katex expr="P" /> とする．<Katex expr="N=n(n-1),\quad d=m+N" />．<Katex expr="\operatorname{den}(r)" /> は有理数 <Katex expr="r" /> の既約分母．</p>

    <div class="proof-columns">
      <div>
        <p class="proof-label">① 厳密値の特定に必要な精度を決める</p>
        <p class="derivation-label">最適頂点 <Katex expr="u^\star=(w^\star,z^\star)" /> を，等号になる独立な <Katex expr="d" /> 本の制約で表す．</p>
        <div class="proof-math"><Katex display expr="\begin{gathered}\varnothing\ne P\subseteq[0,1]^d,\qquad Au^\star=b,\\ A\in\{0,\pm1\}^{d\times d},\quad b\in\{0,1\}^d,\quad\det A\ne0.\end{gathered}" /></div>
        <p class="derivation-label">Cramer・Hadamard により，共通分母 <Katex expr="D" /> の大きさを抑える．</p>
        <div class="proof-math"><Katex display expr="\begin{gathered}u^\star=\frac{\operatorname{adj}(A)b}{\det A}\in D^{-1}\mathbb Z^d,\\ D:=|\det A|\le\textstyle\prod_{i=1}^d\|A_{i,:}\|_2\le d^{d/2}.\end{gathered}" /></div>
        <div class="proof-math"><Katex display expr="\begin{gathered}q^\star:=\tfrac1N\textstyle\sum_{s\ne t}z_{st}^\star\in(ND)^{-1}\mathbb Z,\\ \operatorname{den}(q^\star)\le ND\le Q:=\left\lceil Nd^{d/2}\right\rceil.\end{gathered}" /></div>
        <div class="proof-math emphasis"><Katex display expr="\log Q=O(d\log d+\log N)." /></div>
      </div>

      <div>
        <p class="proof-label">② 二分探索（外側）の終了と厳密化</p>
        <p class="derivation-label">初期区間は <Katex expr="[0,1]" />．中点 <Katex expr="\tau" /> が達成可能なら下端，不可能なら上端を <Katex expr="\tau" /> にする．</p>
        <div class="proof-math threshold"><Katex display expr="K_\tau\ne\varnothing\iff\tau\le q^\star\qquad\text{（前頁の判定）}." /></div>
        <div class="bisection-stop">
          <p><strong>二分探索の終了条件</strong>（<Katex expr="k" /> 回判定後）</p>
          <div class="proof-math"><Katex display expr="\begin{gathered}q^\star\in[\ell_k,h_k],\qquad h_k-\ell_k=2^{-k}<(2Q^2)^{-1},\\ k=\lceil\log_2(2Q^2)\rceil+1=O(\log Q).\end{gathered}" /></div>
        </div>
        <p class="derivation-label">分母が <Katex expr="Q" /> 以下の有理数の間隔から，区間内の最適値を特定する．</p>
        <div class="proof-math rational-gap"><Katex display expr="\substack{r\ne r',\\ \operatorname{den}(r),\operatorname{den}(r')\le Q}\ \Longrightarrow\ |r-r'|\ge Q^{-2}." /></div>
        <div class="proof-math"><Katex display expr="[\ell_k,h_k]\xrightarrow[\text{区間内で一意}]{\text{連分数}}q^\star." /></div>
        <p class="derivation-label"><strong>全体の終了：</strong><Katex expr="q^\star" /> を復元し，<Katex expr="u=(w,z)\in K_{q^\star}" /> を得たら <Katex expr="w" /> を返す．</p>
        <div class="proof-math optimality"><Katex display expr="q^\star\le\tfrac1N\textstyle\sum_{s\ne t}z_{st}\le\mathrm{ANF}(w)\le q^\star." /></div>
      </div>
    </div>

    <div class="runtime-block">
      <p class="runtime-label">③ 判定1回（内側）は，多項式回の分離で前頁のいずれかの結果を返す</p>
      <p><Katex expr="B=\operatorname{poly}(d,\log Q)" />：計算中の有理数のビット数．<Katex expr="R(d,B)=\operatorname{poly}(d,B)" />：判定1回の分離回数の上限．</p>
      <p><Katex expr="T_{\mathrm{MF}}(n,m,B)=\operatorname{poly}(n,m,B)" />：最大流1回のビット計算時間．分離1回の最大流呼出しは高々 <Katex expr="N" /> 回．</p>
      <div class="runtime-math"><Katex display expr="T_{\mathrm{total}}\le O(\log Q)\,R(d,B)\left[N T_{\mathrm{MF}}(n,m,B)+\operatorname{poly}(d,B)\right]=\operatorname{poly}(n,m)." /></div>
      <p class="proof-source">出典：<a href="https://doi.org/10.1007/978-3-642-78240-4" target="_blank" rel="noopener">Grötschel–Lovász–Schrijver（1993, §6.4–6.5）</a>．最後の点の取得1回・有理数復元も上界に含む．</p>
    </div>
  </div>
</template>

<style scoped>
.exact-proof { color:#263551; font-size:15px; line-height:1.35; }
.exact-proof p { margin:0 0 5px !important; font-size:15px; line-height:1.35; }
.exact-proof .proof-context { color:#596b84; font-size:13px !important; margin-bottom:6px !important; }
.proof-columns { display:grid; grid-template-columns:1fr 1.08fr; gap:20px; }
.proof-columns > div + div { border-left:1px solid #cfdbed; padding-left:19px; }
.exact-proof .proof-label { color:#1c3177; font-weight:700; font-size:17px; margin-bottom:5px !important; }
.exact-proof .derivation-label { color:#52637d; font-size:13px; margin-bottom:3px !important; }
.proof-math { margin:4px 0; color:#1c3177; font-size:16px; }
.proof-math.threshold { margin-top:3px; }
.bisection-stop { border-left:3px solid #087f8c; background:#edf6f6; padding:3px 6px 1px; margin:4px 0; }
.bisection-stop > p { color:#087f8c; font-size:12px; margin-bottom:2px !important; }
.bisection-stop .proof-math { font-size:15px; margin:2px 0; }
.proof-math.rational-gap { font-size:15px; }
.proof-math.optimality { font-size:15px; }
.exact-proof :deep(.katex-display) { margin:3px 0 !important; }
.proof-math.emphasis { margin-top:6px; }
.exact-proof strong { color:#1c3177; }
.runtime-block { border-top:1px solid #cfdbed; margin-top:4px; padding-top:4px; }
.runtime-block > p { font-size:12.5px; margin-bottom:3px !important; }
.runtime-block .runtime-label { font-size:14px; font-weight:700; color:#1c3177; }
.runtime-math { font-size:15px; color:#1c3177; }
.runtime-block .proof-source { color:#677890; font-size:11.5px; margin-top:3px !important; }
.proof-source a { color:#526aa0; }
</style>
