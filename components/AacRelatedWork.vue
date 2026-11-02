<script setup lang="ts">
import Katex from './Katex.vue'
</script>

<template>
  <div class="aac-literature">
    <p class="context">連結な無向グラフ．MWU の比較はともに <Katex expr="(1-\varepsilon)" /> 近似，成功確率 <Katex expr="\ge2/3" />．</p>
    <table>
      <colgroup><col class="study-col"><col class="findings-col"></colgroup>
      <thead><tr><th>研究・手法</th><th>本問題との関係・得られる保証</th></tr></thead>
      <tbody>
        <tr>
          <td><span class="cite-cf"><a href="https://stanford.edu/~boyd/papers/pdf/fmmp.pdf" target="_blank" rel="noopener">[Sun, Boyd, Xiao, Diaconis 2006]</a></span><br><span class="cite-cf"><a href="https://stanford.edu/~boyd/papers/pdf/cvx_opt_graph_lapl_eigs.pdf" target="_blank" rel="noopener">[Boyd 2006]</a></span><br><span class="cite-cf"><a href="https://doi.org/10.1145/3357713.3384284" target="_blank" rel="noopener">[Jiang, Lee, Song, Wong 2020]</a></span></td>
          <td><strong>同じ連続容量配分を SDP で定式化（Sun ほか，Boyd）．</strong><br>切断平面法（Jiang ほか）を適用：総時間 <Katex expr="\widetilde O(m^3+mn^\omega)" />．<br><span class="qualification"><Katex expr="\omega" />：行列積の指数．精度依存は <Katex expr="\operatorname{polylog}(1/\varepsilon)" />．</span></td>
        </tr>
        <tr class="matched-row">
          <td><span class="cite-cf"><a href="https://link.springer.com/chapter/10.1007/978-981-16-4095-7_4" target="_blank" rel="noopener">[Elbassioni, Makino 2022]</a></span><br><span class="cite-cf"><a href="https://doi.org/10.1137/20M137570X" target="_blank" rel="noopener">[Elbassioni, Makino, Najy 2022]</a></span></td>
          <td>
            <div class="method">
              <p><strong>MWU：</strong>近似 Fiedler <Katex expr="O(n\log(2m)/\varepsilon^2)" /> 回，総時間 <Katex expr="\widetilde O(mn/\varepsilon^3)" />．</p>
              <p class="qualification">Algorithm 2 に抵抗の評価と近似応答の解析を加えた，本問題での評価．</p>
            </div>
            <div class="method">
              <p><strong>対数ポテンシャル法：</strong>全辺評価・最大辺選択 <Katex expr="O(n\log(nm)+n/\varepsilon^2)" /> 回．</p>
              <p>各回は逆行列計算も伴う．</p>
            </div>
          </td>
        </tr>
        <tr>
          <td><span class="cite-cf"><a href="https://skoge.folk.ntnu.no/prost/proceedings/cdc-2008/data/papers/0353.pdf" target="_blank" rel="noopener">[Wan et al. 2008]</a></span><br><span class="cite-cf"><a href="https://doi.org/10.1016/j.dam.2015.08.009" target="_blank" rel="noopener">[Richter, Rocha 2016]</a></span></td>
          <td><strong>木に特化した厳密解法．</strong>最適な容量配分を <Katex expr="O(n^2)" /> 算術演算で計算（Wan ほか）．<br>double broom の明示式・木の組合せ算法（Richter–Rocha）．</td>
        </tr>
        <tr>
          <td><span class="cite-cf"><a href="https://arxiv.org/abs/2403.19879" target="_blank" rel="noopener">[Doherty et al. 2024]</a></span></td>
          <td><strong>辺数制約付きの辺選択．</strong>1 更新に Fiedler 計算 1 回．<br>Frank–Wolfe 型更新・丸め・事後ギャップ評価．</td>
        </tr>
        <tr class="our-row">
          <td><strong>本発表：MWU</strong></td>
          <td><strong>近似 Fiedler：<Katex expr="O(n\log(2m)/\varepsilon^2)" /> 回，総時間 <Katex expr="\widetilde O(mn/\varepsilon^3)" />．</strong><br>基準配分への切り詰めと，正規化した応答による指数更新．</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.aac-literature { color:#263551; font-size:14px; line-height:1.45; }
.aac-literature p { margin:0 !important; }
.aac-literature strong { color:#1c3177; font-weight:700; }
.context { font-size:13.5px; padding-bottom:7px; }
table { width:100%; border-collapse:collapse; table-layout:fixed; font-size:14px; }
.study-col { width:26%; }
.findings-col { width:74%; }
th { color:#1c3177; font-weight:700; font-size:14px; text-align:left; padding:4px 6px 6px 0; border-bottom:2px solid #9fb2d2; }
td { padding:5px 7px 5px 0; vertical-align:middle; border-bottom:1px solid #dce4f0; line-height:1.55; }
th + th, td + td { padding-left:10px; }
.qualification { color:#52637d; font-size:13px; }
.method + .method { margin-top:6px; }
.matched-row { background:#f3f6fa; }
.our-row { background:#edf6f6; }
.our-row td:first-child { border-left:3px solid #087f8c; padding-left:7px; }
</style>
