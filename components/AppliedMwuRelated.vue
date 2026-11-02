<script setup lang="ts">
import Katex from './Katex.vue'
</script>

<template>
  <div class="applied-mwu">
    <p class="context"><Katex expr="n" /> 頂点・<Katex expr="m" /> 辺の有向グラフ．すべて <strong><Katex expr="(1-\varepsilon)" /> 近似</strong>．1 回 ＝ 1 対の最大流（最小カット）．</p>

    <div class="main-point">
      <p><strong>全対を計算する MWU：</strong>1 更新に <Katex expr="n(n-1)" /> 回．</p>
      <p><strong>本発表：</strong>MWU <span class="cite-cf"><a href="https://doi.org/10.4086/toc.2012.v008a006" target="_blank" rel="noopener">[Arora, Hazan, Kale 2012]</a></span> ＋ 頂点対の一様抽出・確率解析．<strong>1 更新に 1 回</strong>．</p>
    </div>

    <p class="table-label">最大流の総呼出し回数</p>
    <table>
      <colgroup><col class="study-col"><col class="general-col"><col class="strong-col"><col class="guarantee-col"></colgroup>
      <thead><tr><th>手法・適用する一般結果</th><th>一般の有向グラフ</th><th>強連結グラフ</th><th>成功保証</th></tr></thead>
      <tbody>
        <tr>
          <td><strong>MWU：毎回，全対を計算</strong><br><span class="cite-cf"><a href="https://theoryofcomputing.org/articles/v008a006/v008a006.pdf" target="_blank" rel="noopener">[Arora, Hazan, Kale 2012, 系 2.6]</a></span> を適用</td>
          <td class="count"><Katex expr="\widetilde O(n^4/\varepsilon^2)" /></td>
          <td class="count"><Katex expr="\widetilde O(n^3/\varepsilon^2)" /></td>
          <td>決定的</td>
        </tr>
        <tr>
          <td><span class="cite-cf"><a href="https://www2.isye.gatech.edu/~nemirovs/SIOPT_RSA_2009.pdf" target="_blank" rel="noopener">[Nemirovski, Juditsky, Lan, Shapiro 2009]</a></span><br><span class="qualifier">確率的鏡像降下の加法評価から換算</span></td>
          <td class="count"><Katex expr="\widetilde O(n^4/\varepsilon^2)" /></td>
          <td class="count"><Katex expr="\widetilde O(n^2/\varepsilon^2)" /></td>
          <td><Katex expr="\ge2/3" /></td>
        </tr>
        <tr>
          <td><span class="cite-cf"><a href="https://doi.org/10.4230/LIPIcs.ESA.2022.20" target="_blank" rel="noopener">[Blankenburg 2022, 定理 3]</a></span> を適用<br><span class="qualifier">全対を巡回し，最小カットごとに容量更新．</span></td>
          <td class="count"><Katex expr="\widetilde O((n^2+m)/\varepsilon^2)" /></td>
          <td class="count"><Katex expr="\widetilde O((n^2+m)/\varepsilon^2)" /></td>
          <td>決定的</td>
        </tr>
        <tr class="our-row">
          <td><strong>本発表：1 対を抽出する MWU</strong></td>
          <td class="count"><Katex expr="\widetilde O(n^2/\varepsilon^2)" /></td>
          <td class="count"><Katex expr="\widetilde O(n/\varepsilon^2)" /></td>
          <td><Katex expr="\ge2/3" /></td>
        </tr>
      </tbody>
    </table>

    <div class="comparison-notes">
      <p>無向グラフなら，全対の最小カットは Gomory–Hu 木により <Katex expr="n-1" /> 回の最大流で求まる <span class="cite-cf"><a href="https://doi.org/10.1137/0219009" target="_blank" rel="noopener">[Gusfield 1990]</a></span>．</p>
    </div>
  </div>
</template>

<style scoped>
.applied-mwu { color:#263551; font-size:15px; line-height:1.5; }
.applied-mwu p { margin:0 !important; }
.applied-mwu strong { color:#1c3177; font-weight:700; }
.context { font-size:14px; }
.main-point { margin:14px 0 12px; border-left:3px solid #087f8c; padding-left:10px; }
.main-point p { font-size:17px; line-height:1.65; }
.applied-mwu .table-label { margin:8px 0 3px !important; color:#1c3177; font-size:15px; font-weight:700; }
table { width:100%; border-collapse:collapse; table-layout:fixed; font-size:14px; }
.study-col { width:35%; }
.general-col { width:25%; }
.strong-col { width:25%; }
.guarantee-col { width:15%; }
th { color:#1c3177; font-weight:700; font-size:13px; text-align:left; padding:5px 6px 6px 0; border-bottom:2px solid #9fb2d2; }
td { padding:8px 6px 8px 0; vertical-align:middle; border-bottom:1px solid #dce4f0; line-height:1.6; }
th + th, td + td { padding-left:10px; }
.count { color:#1c3177; font-size:15px; white-space:nowrap; }
.qualifier { color:#5c6c83; font-size:11.5px; }
.our-row { background:#edf6f6; }
.our-row td:first-child { border-left:3px solid #087f8c; padding-left:7px; }
.comparison-notes { padding-top:10px; color:#596b84; }
.comparison-notes p { font-size:12px; line-height:1.6; }
.comparison-notes p + p { margin-top:4px !important; }
</style>
