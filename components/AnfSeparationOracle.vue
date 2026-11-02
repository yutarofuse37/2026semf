<script setup lang="ts">
import Katex from './Katex.vue'
</script>

<template>
  <div class="anf-separation">
    <p class="oracle-context"><Katex expr="P" />：前頁の LP の実行可能領域．入力は候補点 <Katex expr="\hat u=(\hat w,\hat z)" />．</p>
    <div class="oracle-columns">
      <div>
        <p class="oracle-label">分離オラクルの出力</p>
        <p><Katex expr="\hat u\in P" /> なら，「実行可能」と答える．</p>
        <p><Katex expr="\hat u\notin P" /> なら，LP の制約から<br><strong>候補点が違反した線形不等式</strong>を1本返す．</p>
        <div class="oracle-math"><Katex display expr="a^\top u\le b" /></div>
        <div class="oracle-math conditions"><Katex display expr="\begin{aligned}&a^\top u\le b&&\quad(\forall u\in P),\\&a^\top\hat u>b.\end{aligned}" /></div>
        <p>実行可能な全点では成立し，<br>候補点では成立しない．</p>
        <p class="oracle-detail">出力は，この不等式の係数 <Katex expr="(a,b)" />．</p>
      </div>
      <div>
        <p class="oracle-label">ANF の LP では，最小カットで見つける</p>
        <p>非負性・総容量・<Katex expr="z" /> の上下限を先に検査．<br>これらを満たせば，各対の最小カットを求める：</p>
        <div class="oracle-math cut-choice"><Katex display expr="S^\star\in\operatorname*{argmin}_{S:\,s\in S,\ t\notin S}\textstyle\sum_{e\in\delta^+(S)}\hat w_e." /></div>
        <div class="oracle-math candidate"><Katex display expr="\hat z_{st}>\textstyle\sum_{e\in\delta^+(S^\star)}\hat w_e" /></div>
        <p>なら，<strong>候補点が違反した線形不等式</strong></p>
        <div class="oracle-math returned"><Katex display expr="\boxed{z_{st}-\sum_{e\in\delta^+(S^\star)}w_e\le0}" /></div>
        <p>を返す．<Katex expr="S^\star" /> を固定した <Katex expr="(w,z)" /> の線形不等式．</p>
      </div>
    </div>
    <div class="oracle-conclusion">
      <p>全対で違反がなければ実行可能．<strong>分離1回：高々 <Katex expr="N=n(n-1)" /> 回の最大流．</strong></p>
    </div>
  </div>
</template>

<style scoped>
.anf-separation { color:#263551; font-size:16px; line-height:1.5; }
.anf-separation p { margin:0 0 10px !important; font-size:15.5px; line-height:1.5; }
.anf-separation .oracle-context { color:#596b84; font-size:15px; margin-bottom:17px !important; }
.oracle-columns { display:grid; grid-template-columns:1fr 1.14fr; gap:25px; }
.oracle-columns > div + div { border-left:1px solid #cfdbed; padding-left:23px; }
.anf-separation .oracle-label { color:#1c3177; font-size:17px; font-weight:700; margin-bottom:13px !important; }
.oracle-math { margin:12px 0; color:#1c3177; font-size:21px; }
.oracle-math.conditions { font-size:18px; margin:14px 0; }
.oracle-math.cut-choice { font-size:17px; }
.oracle-math.candidate { font-size:19px; margin:13px 0; }
.oracle-math.returned { font-size:21px; margin:12px 0; }
.anf-separation :deep(.katex-display) { margin:4px 0 !important; }
.anf-separation .oracle-detail { color:#64748b; font-size:14px; }
.oracle-conclusion { border-top:1px solid #cfdbed; margin-top:16px; padding-top:10px; }
.oracle-conclusion p { margin:0 !important; }
.anf-separation strong { color:#1c3177; }
</style>
