---
theme: seriph
title: Multiplicative Weights Update for Maximizing Network Connectivity
info: |
  勾配降下法からmirror descent・MWUへ．
  有向ANF / global mincutと無向algebraic connectivityの最大化を共通の枠組みで整理する．
seminar: true
duration: 60min
colorSchema: light
routerMode: history
download: ./seminar.pdf
presenter: true
browserExporter: true
drawings:
  persist: false
fonts:
  sans: Noto Sans JP
  serif: Noto Sans JP
layout: cover
background: /bg_title.png
---

# Multiplicative Weights Update<br>for Maximizing Network Connectivity

<div class="mt-10 text-sm text-gray-600">

ゼミ資料

</div>

<!--
この資料は約60分を想定した発表資料．厳密な証明の一部は付録に回す．
第5章は添付20260727.pdfの全内容を中心に，既存slides.mdとACMWU.pdfを参照して構成．
第4章は添付されたANF／global mincut増加問題のノートに基づく．
既存容量0の容量配分モデル，確率的ANFオラクル，加法誤差の期待値保証を中心に再構成した．
追加参照資料：Drive「研究室」内のACMWU.pdf（12頁，2026-07-02更新）．
第3節のLemma 3.4とTheorem 3.5を照合し，定数の正規化・成功確率・停止条件を補足．
-->

---
class: roomy
---

# 今日の構成

**問題：限られた重みを辺に配分して，グラフの連結性を最大化する．**

1. **勾配法の基礎** — 勾配降下法と射影
2. **Mirror descentとMWU** — 距離の一般化，指数更新，リグレット保証
3. **ゲームとしての統一的解釈** — 弱点への攻撃，最適応答と優勾配
4. **有向グラフ** — ANF / global mincut の最大化
5. **無向グラフ** — algebraic connectivity の最大化



<!--
「精度」は最適値との差の理論保証を指す．実験による精度・実行時間の主張は含めない．
ANFが別の重み付きペア平均を指している場合も，同じ構造で係数を差し替えられる．
ただし離散的な辺追加や上限制約がある場合は，現在の単体上の更新をそのまま適用できない．
-->

---
class: roomy
---

# 共通の問題設定：辺の重み配分

$n=|V|\ge2$，$m=|E|\ge2$．配分変数の総和を $1$ に正規化する．

$$
\Delta_E=\left\{w\in\mathbb R_{\ge0}^{E}:\sum_{e\in E}w_e=1\right\},
\qquad \mathrm{OPT}=\max_{w\in\Delta_E}\mathrm{OBJ}(w).
$$

| 指標 $\mathrm{OBJ}(w)$ | グラフ | 指標の意味 |
| --- | --- | --- |
| global mincut | 有向 | 最も容量の小さい有向カット |
| ANF | 有向 | 全順序付き頂点対の最大流の平均 |
| $\lambda_2(L(w))$ | 無向 | グラフラプラシアンの第二固有値 |

<div class="callout">

いずれも $w$ に関する<strong>凹関数</strong>．

</div>

<!--
辺集合は固定し，非負の実数重みを連続的に配分する問題を扱う．全章で自己ループはないとする．
m=1なら単体は一点なので最適化は不要．m=0はこの正規化では定義しない．
「凹関数の最大化」は標準的な凸最適化の問題に含まれる．
第4章では配分変数をpとし，容量の総予算を1とする．第5章ではwを辺の重みとして使う．
-->

---
layout: section
---

# 1．勾配法の基礎

---
class: roomy
---

# 1-1．勾配降下法

微分可能な凸関数 $f:\mathbb R^d\to\mathbb R$ の最小化を考える．

$$
\nabla f(x)=\left(\frac{\partial f}{\partial x_1},\ldots,\frac{\partial f}{\partial x_d}\right)^\top,
\qquad \langle a,b\rangle=\sum_{i=1}^d a_i b_i.
$$

$\nabla f$ は各座標方向の偏微分を並べた **勾配**，$\langle a,b\rangle$ は **内積**．
点 $x_t$ における $f$ の一次近似は，以下のように書ける：

$$
f(x)\approx f(x_t)+\langle\nabla f(x_t),x-x_t\rangle.
$$

勾配と逆向きに進むと，一次近似の値が減少する．

$$
\boxed{x_{t+1}=x_t-\eta\nabla f(x_t)},\qquad \eta>0\text{：ステップ幅}.
$$

<div class="text-sm mt-3">

参照：伊藤 勝（2019）<a href="https://orsj.org/wp-content/corsj/or64-6/or64_6_326.pdf">「凸最適化問題に対する一次法とその理論」§2–3，pp.326–327</a>．

</div>

<!--
指定資料の順に，勾配を用いる無制約更新から射影付き更新へ進む．
d=x-x_tとすれば一次の変化は〈∇f,d〉．d=-η∇fなら-η||∇f||²≤0．
これは一次近似の減少であり，実際の目的値の減少にはステップ幅の調整が必要．
この章では最小化の一般関数をf，連結性最大化の目的関数をOBJと書き分ける．
-->

---
class: roomy
---

# 1-2．射影勾配法

凸制約 $x\in K$ があるとき，先の更新結果を制約条件内に射影する必要がある．

$$
y_{t+1}=x_t-\eta\nabla f(x_t),\qquad
x_{t+1}=\Pi_K(y_{t+1}).
$$

ここで $\Pi_K(y)=\arg\min_{x\in K}\|x-y\|_2^2$ は閉凸集合 $K$ への射影．
平方完成により，同じ更新を次の最小化として表せる：

$$
x_{t+1}=\arg\min_{x\in K}\left\{
 f(x_t)+\langle\nabla f(x_t),x-x_t\rangle
 +\frac{1}{2\eta}\|x-x_t\|_2^2\right\}.
$$


<div class="text-sm mt-3">

参照：<a href="https://orsj.org/wp-content/corsj/or64-6/or64_6_326.pdf#page=2">伊藤（2019），§3，式(3)</a>．

</div>

<!--
閉凸集合Kは空でないとする．二乗距離の微分は2(x-x_t)．
展開すればxに依存しない項を除いて||x-(x_t-η∇f)||²/(2η)となる．
指定文献では非滑らかな関数の劣勾配まで一般化されているが，ここではまず微分可能な場合を示す．
-->

---
layout: section
---

# 2．Mirror descentとMWU

---
class: roomy
---

# 2-1．最大化では「優勾配」を使う

**定義（優勾配）**．凹関数 $\mathrm{OBJ}$ に対し，$g_t$ が次を満たすとき優勾配といい，
$g_t\in\partial^+\mathrm{OBJ}(w_t)$ と書く：

$$
\mathrm{OBJ}(u)\le \mathrm{OBJ}(w_t)+\langle g_t,u-w_t\rangle
\qquad(\forall u\in\Delta_E).
$$

- 微分可能なら $g_t=\nabla \mathrm{OBJ}(w_t)$．
- 微分できなくても，関数を上から支える一次式を使える．
- $-g_t$ は凸関数 $-\mathrm{OBJ}$ の劣勾配である．


<!--
文献によっては凹関数のsupergradientも広くsubgradientと呼ぶが，ここでは不等号を明示し，
優勾配に統一する．タイトルの「勾配の計算方法」にはこの非滑らかな場合を含める．
優勾配方向への一回の更新が必ず目的値を改善するとは限らない．
-->

---
class: dense
---

# 2-1．Mirror descentとMWU

微分可能な凸関数 $\psi$ から **Bregman divergence $D_\psi$** を定める：

$$
D_\psi(x,y)=\psi(x)-\psi(y)-\langle\nabla\psi(y),x-y\rangle.
$$

優勾配 $g_t$，$R>0$ に対し，凹最大化のmirror descentは

$$
w_{t+1}=\arg\max_{w\in\Delta_E}
\left\{\frac\eta R\langle g_t,w\rangle-D_\psi(w,w_t)\right\}.
$$

単体上で負エントロピーを選ぶと

$$
\psi(w)=\sum_e w_e\log w_e,\qquad
D_\psi(w,w_t)=\sum_e w_e\log\frac{w_e}{w_{t,e}}.
$$

Lagrange乗数を $\nu$ とすると，最適性条件
$\eta g_{t,e}/R-\log(w_{t+1,e}/w_{t,e})-1-\nu=0$ より

$$
w_{t+1,e}=\frac{w_{t,e}\exp(\eta g_{t,e}/R)}
{\sum_f w_{t,f}\exp(\eta g_{t,f}/R)}
\qquad\text{（MWU）}.
$$

<div class="text-sm mt-3">

参照：<a href="https://www.tau.ac.il/~becka/3.pdf" target="_blank" rel="noopener">Beck–Teboulle 2003</a>

</div>

<!--
psiは微分を取る点yで微分可能とし，更新を定めるため適切な強凸性などを仮定する．
二乗ノルムpsi=||w||²/2ならDpsi=||w-w_t||²/2となり，射影勾配法に戻る．
負エントロピーは単体の内部で微分し，境界は0 log 0=0で連続拡張する．
w_tの全成分が正なら，エントロピーで正則化した更新も内部にある．
Dpsiは単体上でKLに一致し，一般に対称ではなく距離の公理は満たさない．
総和制約のLagrange乗数をnuとし，微分を0に置いて各w_{t+1,e}を解き，正規化して更新式を得る．
本資料のMWUは指数型（Hedge / exponentiated gradient）を指す．
この頁からg/Rに正規化し，後の保証とステップ幅の記号を揃えた．
-->

---
class: roomy
---

# 2-2．MWUの実行手順

優勾配の各成分が $0\le g_{t,e}\le R$ とする．

1. **初期化**：$w_{1,e}=1/m$．
2. **勾配の計算**：現在の $w_t$ に対する優勾配 $g_t$ を求める．
3. **乗法更新**：$w_{t+1,e}\propto w_{t,e}\exp(\eta g_{t,e}/R)$．
4. **平均を出力**：$\bar w_T=\frac1T\sum_{t=1}^T w_t$．

<div class="callout-bar">

大きな優勾配を持つ辺の<strong>相対的な重み</strong>が増える．<br>
保証するのは平均配分の目的値であり，毎回の単調増加ではない．

</div>

<!--
g_e>0でも他の辺のgがさらに大きければ，正規化後のw_eは減少することがある．
最初に重みを0にすると乗法更新だけでは復活しないので，全座標正で初期化する．
実装ではlog wを保持し，log-sum-expで正規化するとアンダーフローを避けやすい．
-->

---
class: roomy
---

# 2-2．二次元平面で見るMWUの動き

$\mathrm{OBJ}(w)=\min\{w_1,2w_2,3w_3\}$ を $w\in\Delta_3$ 上で最大化する．$R=3$．

<MwuTrajectory />

<!--
三つの非負重みの総和を1に固定し，独立な座標w1,w2を平面に描く．w3=1-w1-w2．
破線は目的値の等高線．初期表示では軌跡付近を拡大する．最適解は(6/11,3/11,2/11)，OPT=6/11．
一様初期化．最小の項の係数ベクトル(1,0,0)，(0,2,0)，(0,0,3)から優勾配を選ぶ．
同値の場合は先頭の項を選択する．更新はw_i exp(ηg_i/3)を総和で割る．
現在点は最適解の周辺で振れることがある．平均配分はw1から現在のw_tまでの算術平均．
大きいηでは振れが大きく，小さいηでは進み方が遅くなる．固定ηを続けるだけで
任意精度に収束すると主張しない．次の保証では目標反復数Tに合わせてηを設定する．
PDFではη=0.7，25反復までの軌跡を静止図として表示する．再生はSites上で操作する．
-->

---
class: roomy
---

# 2-3．リグレットの定義

**定義2.1**．各時刻 $t$ に配分 $w_t\in\Delta_E$ を選び，
その後に利得ベクトル $g_t\in[0,R]^E$ を受け取る．<br>
ある配分 $u\in\Delta_E$ に対し

$$
\operatorname{Reg}_T(u):=\sum_{t=1}^T\langle g_t,u\rangle
-\sum_{t=1}^T\langle g_t,w_t\rangle.
$$

最も良い配分との比較を

$$
\operatorname{Reg}_T:=\max_{u\in\Delta_E}\operatorname{Reg}_T(u)
=\max_{e\in E}\sum_{t=1}^Tg_{t,e}-\sum_{t=1}^T\langle g_t,w_t\rangle
$$

と定める．比較対象 $u$ は全時刻で同じ配分を使う．

<div class="callout">

$\operatorname{Reg}_T/T$ が小さければ，事後に選ぶ最良の固定配分に対して，1回あたりの利得の差が小さい．

</div>

<!--
利得は大きいほどよいという符号規約．損失で定義する文献とは差の符号が逆になる．
g_tはw_tまでの履歴に依存してよい．maxが単体の頂点で達成されるので二つの表示式は一致する．
-->

---
class: roomy
---

# 2-3．MWUのリグレット保証

**補題2.2**．$m\ge2$，$R>0$，$T\ge1$ とする．
任意の利得列 $g_t\in[0,R]^E$ に対し，$w_{1,e}=1/m$ から

$$
w_{t+1,e}=\frac{w_{t,e}e^{\eta g_{t,e}/R}}{\sum_f w_{t,f}e^{\eta g_{t,f}/R}}
\qquad(\eta>0)
$$

で更新すると

$$
\operatorname{Reg}_T\le\frac{R\log m}{\eta}+\frac{\eta RT}{2}.
$$

特に $\eta=\sqrt{2\log m/T}$ とすれば

$$
\frac{\operatorname{Reg}_T}{T}\le R\sqrt{\frac{2\log m}{T}}.
$$

<!--
指数型MWUに対する標準的なHedgeの評価．次頁でKLを用いて証明する．
Hoeffdingの補題なら1/8の二次項が得られるが，本資料は元ノートに合わせて1/2に緩める．
全てのη>0で成立するので，Tが小さいときにも表示式は有効．logは自然対数．
出典：Arora–Hazan–Kale（2012），指数型更新の解析．
-->

---
class: dense
---

# 2-3．補題2.2の証明：KLの差

$\ell_t=g_t/R$，$Z_t=\sum_e w_{t,e}e^{\eta\ell_{t,e}}$ とおく．更新式は
$w_{t+1,e}=w_{t,e}e^{\eta\ell_{t,e}}/Z_t$ なので

$$
\log\frac{w_{t+1,e}}{w_{t,e}}=\eta\ell_{t,e}-\log Z_t.
$$

ある配分 $u\in\Delta_E$ に対し，$D_t:=D_{\mathrm{KL}}(u\Vert w_t)=\sum_eu_e\log(u_e/w_{t,e})$ とすると

$$
\begin{aligned}
D_t-D_{t+1}
&=\sum_eu_e\left(\log\frac{u_e}{w_{t,e}}-\log\frac{u_e}{w_{t+1,e}}\right)\\
&=\sum_eu_e\log\frac{w_{t+1,e}}{w_{t,e}}\\
&=\eta\sum_eu_e\ell_{t,e}-\log Z_t\sum_eu_e
=\eta\langle u,\ell_t\rangle-\log Z_t.
\end{aligned}
$$

$\sum_eu_e=1$ と $g_t=R\ell_t$ を用いて整理すると

$$
\langle g_t,u-w_t\rangle
=\frac R\eta\left[D_t-D_{t+1}+\log Z_t-\eta\langle w_t,\ell_t\rangle\right].
$$

<!--
u_e=0の項は0として扱う．w_tは全成分正なのでKLは有限．
次頁で，残ったlog Z_tと平均利得との差を評価する．
-->

---
class: roomy
---

# 2-3．Hoeffdingの補題

**補題**．$0\le X\le1$ を満たす確率変数と $s\ge0$ に対し

$$
\log\mathbb E[e^{sX}]\le s\mathbb E[X]+\frac{s^2}{8}.
$$

指数を取って平均した量を，元の平均と二次項で抑える不等式である．

**MWUへの適用**．$\Pr(I_t=e)=w_{t,e}$ として辺の添字 $I_t$ を選び，
$X_t=\ell_{t,I_t}\in[0,1]$ とおくと

$$
\mathbb E[X_t]=\sum_e w_{t,e}\ell_{t,e}=\langle w_t,\ell_t\rangle,
\qquad
\mathbb E[e^{\eta X_t}]=\sum_e w_{t,e}e^{\eta\ell_{t,e}}=Z_t.
$$

従って $s=\eta$ を代入すれば

$$
\log Z_t-\eta\langle w_t,\ell_t\rangle\le\frac{\eta^2}{8}\le\frac{\eta^2}{2}.
$$

<div class="text-sm mt-3">

参照：<a href="https://doi.org/10.1080/01621459.1963.10500830">W. Hoeffding, “Probability Inequalities for Sums of Bounded Random Variables,” JASA 58, 13–30 (1963)</a>．

</div>

<!--
このI_tは重み付き和を期待値として書くための補助変数であり，アルゴリズムに新たな乱数を追加するものではない．
各時刻のw_tとg_tを固定してこの不等式を使う．反復間の独立性は不要．
最後は補題2.2の定数と揃えるため，1/8を1/2へ緩めた．
-->

---
class: dense proof-steps
---

# 2-3．Hoeffdingの補題の証明

$H(s)=\log\mathbb E[e^{sX}]$ とおく．指数で重みを付け直した期待値を

$$
\mathbb E_s[\varphi(X)]:=\frac{\mathbb E[\varphi(X)e^{sX}]}{\mathbb E[e^{sX}]}
$$

と書けば，微分により

$$
\begin{aligned}
H'(s)&=\frac{\mathbb E[Xe^{sX}]}{\mathbb E[e^{sX}]}=\mathbb E_s[X],\\
H''(s)&=\frac{\mathbb E[X^2e^{sX}]}{\mathbb E[e^{sX}]}
-\left(\frac{\mathbb E[Xe^{sX}]}{\mathbb E[e^{sX}]}\right)^2
=\mathbb E_s[X^2]-(\mathbb E_s[X])^2.
\end{aligned}
$$

$0\le X\le1$ から $X^2\le X$．$\mu_s=\mathbb E_s[X]\in[0,1]$ とおくと

$$
H''(s)\le\mu_s-\mu_s^2
=\frac14-\left(\mu_s-\frac12\right)^2\le\frac14.
$$

$H(0)=0$，$H'(0)=\mathbb E[X]$ より，2回積分して

$$
H(s)-s\mathbb E[X]
=\int_0^s(s-r)H''(r)\,dr
\le\frac14\int_0^s(s-r)\,dr=\frac{s^2}{8}.
\quad\square
$$

<!--
Xが有界なので，期待値と微分の交換は正当化される．s≥0に限定した形を証明し，本資料のη>0へ適用する．
-->

---
class: dense proof-steps
---

# 2-3．補題2.2の証明：反復について和を取る

KLの差の式とHoeffdingの評価を合わせると

$$
\langle g_t,u-w_t\rangle
\le\frac R\eta(D_t-D_{t+1})+\frac{\eta R}{2}.
$$

$t=1,\ldots,T$ について足すと，中間のKLが打ち消し合う：

$$
\begin{aligned}
\operatorname{Reg}_T(u)
&=\sum_{t=1}^T\langle g_t,u-w_t\rangle\\
&\le\frac R\eta\bigl[(D_1-D_2)+(D_2-D_3)+\cdots+(D_T-D_{T+1})\bigr]+\frac{\eta RT}{2}\\
&=\frac R\eta(D_1-D_{T+1})+\frac{\eta RT}{2}.
\end{aligned}
$$

初期値 $w_{1,e}=1/m$ と $u_e\le1$ から

$$
D_1=\sum_eu_e\log(mu_e)
=\log m+\sum_eu_e\log u_e\le\log m.
$$

$D_{T+1}\ge0$ を用い，$u$ について最大化すれば

$$
\operatorname{Reg}_T=\max_{u\in\Delta_E}\operatorname{Reg}_T(u)
\le\frac{R\log m}{\eta}+\frac{\eta RT}{2}.
\quad\square
$$

<!--
KLの非負性はGibbsの不等式．具体的には，u_e>0の添字上でlogの凹性を使うと
Σu_e log(w_e/u_e)≤log(Σ_{u_e>0}w_e)≤0なのでD_KL≥0となる．
-->

---
class: roomy
---

# 2-3．補題2.2の証明：ステップ幅の選択

$T$ で割った上界を $B(\eta)$ とおく：

$$
\frac{\operatorname{Reg}_T}{T}\le B(\eta)
:=\frac{R\log m}{\eta T}+\frac{\eta R}{2}.
$$

第1項は $\eta$ が大きいほど小さく，第2項は大きくなる．微分して

$$
B'(\eta)=-\frac{R\log m}{\eta^2T}+\frac R2=0
\quad\Longrightarrow\quad \eta=\sqrt{\frac{2\log m}{T}}.
$$

この値では二つの項が等しくなり

$$
\frac{R\log m}{\eta T}=\frac R2\sqrt{\frac{2\log m}{T}},
\qquad \frac{\eta R}{2}=\frac R2\sqrt{\frac{2\log m}{T}}.
$$

従って $\operatorname{Reg}_T/T\le R\sqrt{2\log m/T}$ を得る．$\square$

<!--
m≥2なのでlog m>0であり，B''(η)=2R log m/(η³T)>0．表示した停留点は最小点．
-->

---
class: roomy
---

# 2-3．リグレットから最適化誤差へ

**定理2.3**．連続な凹関数 $\mathrm{OBJ}:\Delta_E\to\mathbb R$ に対し，
各 $w_t$ で優勾配 $g_t\in[0,R]^E$ が得られるとする．

補題2.2のMWUを $\eta=\sqrt{2\log m/T}$ で実行し，平均配分

$$
\bar w_T=\frac1T\sum_{t=1}^T w_t
$$

を出力すると

$$
\mathrm{OPT}-\mathrm{OBJ}(\bar w_T)
\le R\sqrt{\frac{2\log m}{T}}.
$$

**証明の流れ**：凹性で平均配分を評価し，優勾配不等式でリグレットに帰着する．
詳細は次頁．

<!--
連続性と単体のコンパクト性により最適配分が存在する．
確率的な優勾配の推定量を使う場合は，この証明に条件付き期待値を加える（定理4.4）．
-->

---
class: dense proof-steps
---

# 2-3．定理2.3の証明

最適配分を $w^\star$ とする．凹性（Jensenの不等式）より

$$
\mathrm{OBJ}\!\left(\frac1T\sum_t w_t\right)
\ge\frac1T\sum_t\mathrm{OBJ}(w_t).
$$

両辺を $\mathrm{OPT}=\mathrm{OBJ}(w^\star)$ から引くと

$$
\begin{aligned}
\mathrm{OPT}-\mathrm{OBJ}(\bar w_T)
&\le\mathrm{OPT}-\frac1T\sum_t\mathrm{OBJ}(w_t)\\
&=\frac1T\sum_t\bigl[\mathrm{OBJ}(w^\star)-\mathrm{OBJ}(w_t)\bigr].
\end{aligned}
$$

優勾配の定義に $u=w^\star$ を代入すれば

$$
\mathrm{OBJ}(w^\star)-\mathrm{OBJ}(w_t)
\le\langle g_t,w^\star-w_t\rangle.
$$

従って，リグレットの定義と補題2.2を使って

$$
\mathrm{OPT}-\mathrm{OBJ}(\bar w_T)
\le\frac{\operatorname{Reg}_T(w^\star)}T
\le\frac{\operatorname{Reg}_T}T
\le R\sqrt{\frac{2\log m}{T}}.
\quad\square
$$

---
layout: section
---

# 3．ネットワーク最適化のゲーム解釈

---
class: roomy
---

# 3-1．ネットワーク最適化をゲームとして見る

配分側は辺への重み配分 $p$ を選び，攻撃側はその配分に対する弱点 $a$ を選ぶ．

$$
\max_{p\in\Delta_E}\ \min_{a\in\mathcal A} h(p,a),\qquad
h(p,a)=\langle g(a),p\rangle.
$$

<div class="grid grid-cols-2 gap-6 mt-5">
<div class="callout">

**配分側（Max）**

限られた予算を辺に配る．<br>
最も弱い部分の評価を高めたい．

</div>
<div class="callout">

**攻撃側（Min）**

指標に応じた弱点を選ぶ．<br>
現在の配分の評価を低くしたい．

</div>
</div>

<div class="callout-bar">

指標値は，現在の配分に対する攻撃側の最適応答の値：<br>
$\mathrm{OBJ}(p)=\min_{a\in\mathcal A}h(p,a)$．

</div>

<!--
攻撃は数学的な選択を表す．実際に辺を削除する操作ではなく，容量の小さいカット等を指定して
現在のネットワークの弱さを評価する．Maxの利得hをMinが最小化するゼロ和ゲームである．
弱点の候補集合Aはpに依存せず，各候補を固定すると利得hはpの線形関数になる．
min hの凹性がここから直ちに分かる．ACもpをwに置き換えると同じ形式で書ける．
-->

---
class: roomy
---

# 3-2．配分側はMWUで攻撃に応答する

$0\le g_{t,e}\le R$ とし，現在の配分からの変化をKLで抑えながら利得を高める：

$$
p_{t+1}=\arg\max_{p\in\Delta_E}
\left\{\frac\eta R\langle g_t,p\rangle-\mathrm{KL}(p\Vert p_t)\right\}.
$$

$$
p_{t+1,e}=\frac{p_{t,e}\exp(\eta g_{t,e}/R)}
{\sum_f p_{t,f}\exp(\eta g_{t,f}/R)}.
$$

<div class="callout-bar">

**配分を提示 → 弱点への攻撃 → 勾配の計算 → 配分の更新** を繰り返す．

</div>

これまでの攻撃に対する後悔を小さくすることで，平均配分 $\bar p_T$ の値が
ゲームの最適値 $\max_p\min_a h(p,a)$ に近づく．

<!--
攻撃側は厳密な最適応答を返し，配分側はエントロピーで正則化された応答を返す．
一つの攻撃だけを固定した線形利得の厳密最大化なら，最大係数の辺に全予算を集中する．
MWUは現在の配分を残して段階的に応答するため，累積した攻撃に対するregret評価を使える．
一回ごとにネットワーク全体の最適配分が得られるという意味ではない．
抽出ANFでは最適応答の係数の一部を標本化し，不偏性を通じて期待値のregret保証を用いる．
-->

---
layout: section
---

# 4．ANF / global mincut 最大化

---
class: roomy cut-definition
---

# 4-1．有向 $s$–$t$ mincut の定義

有向グラフ $G=(V,E)$，辺の容量 $x_e\ge0$ を考える．$s\in S$，$t\notin S$ とする．

<div class="grid grid-cols-2 gap-6">
<div>

<DirectedCutDiagram />

<div class="diagram-caption">

$c_x(S)=2+3=5$．

</div>
</div>
<div>

$$
\delta^+(S)=\{(u,v)\in E:u\in S,\ v\notin S\},
$$

$$
c_x(S)=\sum_{e\in\delta^+(S)}x_e.
$$

- 数えるのは $S$ **から出る辺**．
- 図の $b\to a$ は逆向きなので数えない．
- $S$ の内部の辺も数えない．

</div>
</div>

$$
\kappa_{st}(x)=\min_{\substack{S\subseteq V\\s\in S,\ t\notin S}}c_x(S)
=\text{$s$から$t$への最大流量}.
$$

<!--
図ではs→b→tに2，s→a→tに3を流せるので最大流量も5．表示したSは最小カットである．
一般にκ_stとκ_tsは一致しない．到達不能ならκ_st=0．
添付ノートの最大流記号F_stをκ_stとし，xは容量，pは総予算1の配分を表す．
-->

---
class: roomy
---

# 4-1．Global mincut と ANF

**Global mincut**：$\emptyset\ne S\subsetneq V$ となるカットのうち，容量が最小のもの．<br>
$S$ と $V\setminus S$ の両方に頂点がある，という条件を課す．

$$
\kappa_{\mathrm{glob}}(x)=\min_{\emptyset\ne S\subsetneq V}c_x(S)
=\min_{s\ne t}\kappa_{st}(x).
$$

**ANF（Average Network Flow）**：全順序付き頂点対の最大流の平均

$$
\mathrm{ANF}(x)=\frac1{n(n-1)}\sum_{s\ne t}\kappa_{st}(x).
$$

<div class="callout">

各ペアを独立に評価する．ANFの平均は $(s,t)$ と $(t,s)$ を別々に数える．

</div>

<!--
全ペア同時に流す多品種流ではない．global mincutは最悪の方向，ANFは平均的な流しやすさ．
非強連結ならglobal mincutは全容量について0．ANFは非強連結でも正になり得る．
-->

---
class: roomy
---

# 4-1．予算を辺の容量に配分する

各辺の既存容量は $0$ とする．総予算 $1$ を配分し，$p_e$ を辺 $e$ の容量とする．

$$
x(p)=p,\qquad p\ge0,\quad \sum_e p_e\le1.
$$

$$
\mathrm{OBJ}(p)=\kappa_{\mathrm{glob}}(p)\quad\text{または}\quad
\mathrm{ANF}(p),\qquad
\mathrm{OPT}=\max_{p\in\Delta_E}\mathrm{OBJ}(p).
$$

- どちらの指標も，容量を増やして値が下がることはない．
- 残りの予算を任意の辺に配れるので，$\sum_e p_e=1$ としてよい．
- $\mathrm{OBJ}$ は $p$ に関する凹関数．MWUで配分を更新する．

<!--
添付ノートのモデルを既存容量0の場合に限定した．総容量は1に正規化する．
容量上限がないため予算を使い切る最適解が存在．離散的な辺追加問題ではない．
既存容量0なので，配分後の指標値がそのまま容量配分の目的値となる．
-->

---
class: roomy
---

# 4-2．Global mincut のゲーム

配分側は $p\in\Delta_E$，攻撃側は $\emptyset\ne S\subsetneq V$ を選ぶ．
カットを固定した利得は

$$
h_{\mathrm{cut}}(p,S)=\sum_{e\in\delta^+(S)}p_e.
$$

したがって，容量配分問題は

$$
\max_{p\in\Delta_E}\min_{\emptyset\ne S\subsetneq V}h_{\mathrm{cut}}(p,S).
$$

- **攻撃側の最適応答**：現在の容量 $p$ に対する最小カット．
- **配分側の応答**：そのカットに含まれる辺の重みを相対的に増やす．

<!--
S=空集合とS=Vではδ+(S)=空集合となるため，これらを除外する．
一般的な「非自明なカット」という語を使わず，許されるSの条件を表示する．
出典：添付ノート§4.1，§4.4．
-->

---
class: roomy
---

# 4-2．Global mincut の勾配の計算

**補題4.1**．$a_S\in\{0,1\}^{E}$ を，$\delta^+(S)$ の指示ベクトルとする．

$$
\mathrm{OBJ}(p)=\min_S\langle a_S,p\rangle.
$$

現在の容量 $p_t$ の最小カット $S_t$ を一つ選ぶと，$g_t=a_{S_t}$ は $p_t$ における優勾配である．

**証明**．任意の $u\in\Delta_E$ に対して

$$
\mathrm{OBJ}(u)\le\langle a_{S_t},u\rangle
=\mathrm{OBJ}(p_t)+\langle a_{S_t},u-p_t\rangle.
$$

<div class="callout-strong">

$$
g_{t,e}=\mathbf1\{e\in\delta^+(S_t)\}\quad\text{が優勾配．}
$$

</div>

<!--
最大化なので優勾配を正の符号で書く．ノートは-OBJの最小化として負の劣勾配を使う．
どちらも更新の指数の符号は同じ．複数の最小カットがあれば任意の一つを選べる．
-->

---
class: roomy
---

# 4-2．ANFのゲーム

$\mathcal S_{sr}=\{S\subseteq V:s\in S,\ r\notin S\}$ とする．
攻撃側は，各頂点対のカットをまとめた族 $\mathcal S=(S_{sr})_{s\ne r}$ を選ぶ．

$$
h_{\mathrm{ANF}}(p,\mathcal S)=\frac1{n(n-1)}\sum_{s\ne r}
\sum_{e\in\delta^+(S_{sr})}p_e.
$$

$$
\max_{p\in\Delta_E}\min_{\mathcal S\in\prod_{s\ne r}\mathcal S_{sr}}
 h_{\mathrm{ANF}}(p,\mathcal S).
$$

各ペアのカットは独立に選べるため，最小値は各ペアの最大流の平均と一致する．

<div class="callout">

頂点対は一様に平均する．攻撃側の最適応答は，各ペアについて最小カットを選ぶこと．

</div>

<!--
固定ペアの最小値を足したものと，カット族全体についての最小値は等しい．
攻撃側が頂点対の分布も最小化するゲームではない．出典：添付ノート§2.2，§4.1，§4.3．
-->

---
class: roomy
---

# 4-2．ANFの勾配の計算

**補題4.2**．各順序付きペア $(s,r)$ の，現在の最小カットを $S_{sr}^{(t)}$ とする．

$$
g_{t,e}=\frac{1}{n(n-1)}\sum_{s\ne r}
\mathbf1\{e\in\delta^+(S_{sr}^{(t)})\}.
$$

この $g_t$ は $\mathrm{OBJ}(p)=\mathrm{ANF}(p)$ の $p_t$ における優勾配である．

**証明**．各ペアについて，選んだ最小カットは $p_t$ で一致するアフィン上界を与える．
その不等式を全ペアで平均すると

$$
\mathrm{OBJ}(u)\le\mathrm{OBJ}(p_t)+\langle g_t,u-p_t\rangle
\qquad(u\in\Delta_E).
\quad\square
$$

$g_{t,e}$ は，選んだ最小カットに辺 $e$ が現れる割合．

<!--
s,rを頂点対，tを反復番号とする．本スライドは全ペアを使う厳密版．
次は同じ平均を不偏に推定することで1反復の計算量を減らす．
-->

---
class: roomy
---

# 4-2．ANFでは頂点対を一つ抽出できる

**補題4.3**．ANFの最適応答を構成するカット族から，一つのペア $(s,r)$ を一様に抽出する．

$$
\widehat g_{t,e}=\mathbf1\{e\in\delta^+(S_{sr}^{(t)})\},\qquad
\mathbb E[\widehat g_t\mid\mathcal H_t]=g_t.
$$

**証明**．各ペアの抽出確率は $1/[n(n-1)]$．条件付き期待値は補題4.2の平均に一致する．$\square$

$\mathcal H_t$ は抽出前までの履歴を表す．

$$
p_{t+1,e}=
\frac{p_{t,e}\exp(\eta\widehat g_{t,e})}
{\sum_f p_{t,f}\exp(\eta\widehat g_{t,f})}.
$$

<div class="callout-bar">

抽出したペアの最小カットを計算するので，最大流計算は <strong>1回</strong>．<br>
抽出した一つのカットは，ANF全体の優勾配とは限らない．期待値で一致する．

</div>

<!--
本章では利得の成分が0以上1以下なので，R=1で更新する．
各ペアで複数の最小カットがある場合も，履歴に応じた選択規則を固定すればよい．
ランダム性は頂点対の抽出に由来し，個々の最大流・最小カットは厳密に解く．
-->

---
class: dense
---

# 4-2．Global mincutを最大流計算で求める

**手順**．基準となる頂点 $r$ を一つ選ぶ．

1. 各 $v\ne r$ について，**$r$ から $v$** と **$v$ から $r$** の最大流を計算する．
2. 得られた $2(n-1)$ 個の値から最小値を選び，対応する最小カットを返す．

この手順が正しいのは，任意の基準頂点 $r$ に対して次が成り立つため：

$$
\kappa_{\mathrm{glob}}(x)=\min_{v\ne r}\min\{\kappa_{rv}(x),\kappa_{vr}(x)\}.
$$

**証明**．右辺のどの $s$–$t$ カットもglobal mincutの候補なので，右辺 $\ge\kappa_{\mathrm{glob}}(x)$．
逆向きには，global mincutを与える集合 $S^\star$ を考える．

- $r\in S^\star$ なら，$v\notin S^\star$ を選ぶ．$S^\star$ は $r$–$v$ カットだから
  $\kappa_{rv}(x)\le c_x(S^\star)=\kappa_{\mathrm{glob}}(x)$．
- $r\notin S^\star$ なら，$v\in S^\star$ を選ぶ．$S^\star$ は $v$–$r$ カットだから
  $\kappa_{vr}(x)\le c_x(S^\star)=\kappa_{\mathrm{glob}}(x)$．

どちらの場合も，計算した値の中に $\kappa_{\mathrm{glob}}(x)$ が現れる．$\square$

<!--
rとvを端点とする辺が存在する必要はない．最大流問題の始点・終点を指定している．
S*とその補集合はともに空でないため，それぞれの場合に必要なvを選べる．
非強連結の場合も，最大流量0のペアを含むのでこの等式は成り立つ．
-->

---
class: roomy
---

# 4-2．1反復の計算量を比較する

最大流・最小カット1回の時間を $T_{\mathrm{flow}}$ とする．

| 方法 | 最大流の回数 | 1反復の時間（単純実装） |
| --- | --- | --- |
| Global mincut | $2(n-1)$ | $O(n(T_{\mathrm{flow}}+m))$ |
| ANF：全ペア | $n(n-1)$ | $O(n^2(T_{\mathrm{flow}}+m))$ |
| ANF：1ペア抽出 | $1$ | $O(T_{\mathrm{flow}}+m)$ |


<!--
global cutの最適Sで，r∈Sならr→v(v∉S)，r∉Sならv→r(v∈S)がそのカットを許す．
各ペアカットはglobal cutでもあるので，最小値が一致する．これは基本的方法の説明であり，
有向global mincutの最良アルゴリズムの計算量を主張しない．カット集計もmの項に含める．
-->

---
class: roomy
---

# 4-3．加法誤差の収束保証

**定理4.4**．$\mathrm{OBJ}(p)=\mathrm{ANF}(p)$ または $\kappa_{\mathrm{glob}}(p)$ とする．
履歴 $\mathcal H_t$ に対して，更新に使う $\widehat g_t$ が

$$
0\le\widehat g_{t,e}\le1,\qquad
\mathbb E[\widehat g_t\mid\mathcal H_t]\in\partial^+\mathrm{OBJ}(p_t)
$$

を満たすと仮定する．$p_{1,e}=1/m$，$\eta=\sqrt{2\log m/T}$ とし，
$p_{t+1,e}\propto p_{t,e}\exp(\eta\widehat g_{t,e})$ で $T\ge1$ 回更新すると

$$
\boxed{\mathbb E[\mathrm{OBJ}(\bar p_T)]\ge
\mathrm{OPT}-\sqrt{\frac{2\log m}{T}}},\qquad
\bar p_T=\frac1T\sum_{t=1}^T p_t.
$$

加法精度 $\delta>0$ には $T\ge\lceil2\log m/\delta^2\rceil$ で十分．
期待値は，アルゴリズムの全反復の内部乱数について取る．

<!--
∂+は優微分集合，すなわち優勾配全体の集合を表す．
Global mincutは厳密な最小カットの指示ベクトルで仮定を満たす．ANFは全ペア平均または一様抽出で満たす．
ランダム性のない実装も一つの結果だけを取る確率変数と見なせるので，同じ期待値の定理に含まれる．
両指標に対する主張を期待値での近似に統一する．期待値保証を実行ごとの保証と読み替えない．
出典：添付ノートTheorem 4.1–4.2，§4.4．証明は次頁．
-->

---
class: dense
---

# 4-3．定理4.4の証明

最適配分 $p^\star$ を一つ固定する．不偏性と優勾配不等式により

$$
\mathrm{OPT}-\mathrm{OBJ}(p_t)
\le\left\langle\mathbb E[\widehat g_t\mid\mathcal H_t],p^\star-p_t\right\rangle
=\mathbb E[\langle\widehat g_t,p^\star-p_t\rangle\mid\mathcal H_t].
$$

期待値を取り，$t=1,\ldots,T$ について足す．補題2.2は各実現値に成り立つので

$$
T\mathrm{OPT}-\sum_t\mathbb E[\mathrm{OBJ}(p_t)]
\le\mathbb E[\operatorname{Reg}_T(p^\star)]
\le\frac{\log m}{\eta}+\frac{\eta T}{2}.
$$

凹性 $\mathrm{OBJ}(\bar p_T)\ge T^{-1}\sum_t\mathrm{OBJ}(p_t)$ を用いると

$$
\mathrm{OPT}-\mathbb E[\mathrm{OBJ}(\bar p_T)]
\le\frac{\log m}{\eta T}+\frac{\eta}{2}.
$$

$\eta=\sqrt{2\log m/T}$ を代入して結論を得る．$\square$

<!--
p_tは抽出前の履歴Htに関して可測なので内積の期待値を交換できる．
比較配分p*は乱数に依存させない．E maxとmax Eの交換は行っていない．
-->

---
class: roomy
---

# 4-3．目的値の尺度と加法精度

**補題4.5**．任意の非負容量 $x$ に対し

$$
\kappa_{\mathrm{glob}}(x)\le\frac1n\sum_e x_e,\qquad
\mathrm{ANF}(x)\le\frac1n\sum_e x_e.
$$

**証明**．$d_x^+(s)=\sum_{e\in\delta^+(\{s\})}x_e$ とすると
$\kappa_{sr}(x)\le d_x^+(s)$．ペアについて最小化・平均化して

$$
\kappa_{\mathrm{glob}}(x)\le\min_s d_x^+(s)\le\frac1n\sum_s d_x^+(s),\qquad
\mathrm{ANF}(x)\le\frac1n\sum_s d_x^+(s)=\frac1n\sum_e x_e.
$$

総容量が $1$ なので $\mathrm{OPT}\le1/n$．$k>0$，$\delta=k/n$ とすると，定理4.4から
$T=O(n^2\log m/k^2)$ で期待値の加法精度 $\delta$ を得る．$\square$


<!--
添付ノート§2.2.1のANF≤最小出次数という上界を補正した．
各有向辺はその始点の出次数和に一度だけ寄与する．
-->

---
class: roomy
---

# 4-3．期待値での相対近似

**系4.6**．定理4.4の設定で，global mincutの最小カット，ANFの全ペア平均，
またはANFの1ペア抽出を用いる．$p_{1,e}=1/m$，$0<\eta\le1/2$ とすると

$$
\mathbb E[\mathrm{OBJ}(\bar p_T)]
\ge(1-\eta)\mathrm{OPT}-\frac{\log m}{\eta T}.
$$

$0<\varepsilon<1$，既知の $0<\gamma\le\mathrm{OPT}$ について

$$
\eta=\varepsilon/2,\qquad
T\ge\left\lceil\frac{4\log m}{\varepsilon^2\gamma}\right\rceil
$$

と選べば

$$
\mathbb E[\mathrm{OBJ}(\bar p_T)]\ge(1-\varepsilon)\mathrm{OPT}.
$$

---
class: dense proof-steps
---

# 4-3．系4.6の証明（1）

まず，更新に使うカットの係数と現在の配分との内積を計算する．

**Global mincut**．$S_t$ が現在の最小カットなので

$$
\langle p_t,g_t\rangle
=\sum_{e\in\delta^+(S_t)}p_{t,e}
=\kappa_{\mathrm{glob}}(p_t)=\mathrm{OBJ}(p_t).
$$

**ANFの全ペア平均**．各 $S_{sr}^{(t)}$ が $(s,r)$ の最小カットなので

$$
\langle p_t,g_t\rangle
=\frac1{n(n-1)}\sum_{s\ne r}\sum_{e\in\delta^+(S_{sr}^{(t)})}p_{t,e}
=\frac1{n(n-1)}\sum_{s\ne r}\kappa_{sr}(p_t)
=\mathrm{OBJ}(p_t).
$$

**ANFの1ペア抽出**．$p_t$ は履歴 $\mathcal H_t$ から決まり，$\mathbb E[\widehat g_t\mid\mathcal H_t]=g_t$ より

$$
\mathbb E[\langle p_t,\widehat g_t\rangle\mid\mathcal H_t]
=\langle p_t,g_t\rangle=\mathrm{OBJ}(p_t).
$$

従って，どの方法でもこの条件付き期待値の等式が成り立つ．

---
class: dense proof-steps
---

# 4-3．系4.6の証明（2）

$D_t=D_{\mathrm{KL}}(u\Vert p_t)$，$Z_t=\sum_ep_{t,e}e^{\eta\widehat g_{t,e}}$ とおく．
$0\le\eta\widehat g_{t,e}\le1/2$ では $e^z\le1+z+z^2$ なので

$$
\begin{aligned}
\log Z_t
&\le\log\left(1+\eta\langle p_t,\widehat g_t\rangle
+\eta^2\langle p_t,\widehat g_t^{\,2}\rangle\right)\\
&\le\eta\langle p_t,\widehat g_t\rangle
+\eta^2\langle p_t,\widehat g_t^{\,2}\rangle
\le(\eta+\eta^2)\langle p_t,\widehat g_t\rangle.
\end{aligned}
$$

最後は $0\le\widehat g_{t,e}\le1$ から $\widehat g_{t,e}^2\le\widehat g_{t,e}$ を用いた．
KLの差 $D_t-D_{t+1}=\eta\langle u,\widehat g_t\rangle-\log Z_t$ に代入すると

$$
\langle u-p_t,\widehat g_t\rangle
\le\frac{D_t-D_{t+1}}\eta+\eta\langle p_t,\widehat g_t\rangle.
$$

$t$ について足し，$D_1\le\log m$，$D_{T+1}\ge0$ を使えば

$$
\operatorname{Reg}_T(u)
\le\frac{\log m}\eta+\eta\sum_t\langle p_t,\widehat g_t\rangle.
$$

<!--
べき級数から0≤z≤1/2ならe^z−1−z≤z²Σ_{k≥2}(1/2)^{k−2}/k!<z²．
ベクトルの二乗は成分ごとの二乗．指数型MWUの更新について実現値ごとに成り立つ．
-->

---
class: dense proof-steps
---

# 4-3．系4.6の証明（3）

$u=p^\star$ を最適配分とする．優勾配不等式に期待値を取り，前2枚の結果を使うと

$$
T\mathrm{OPT}-\sum_t\mathbb E[\mathrm{OBJ}(p_t)]
\le\mathbb E[\operatorname{Reg}_T(p^\star)]
\le\frac{\log m}\eta+\eta\sum_t\mathbb E[\mathrm{OBJ}(p_t)].
$$

移項して $T(1+\eta)$ で割り，凹性を用いる．$B=\log m/(\eta T)$ とおくと

$$
\mathbb E[\mathrm{OBJ}(\bar p_T)]
\ge\frac1T\sum_t\mathbb E[\mathrm{OBJ}(p_t)]
\ge\frac{\mathrm{OPT}-B}{1+\eta}
\ge(1-\eta)\mathrm{OPT}-B.
$$

最後の不等式は，両辺の差が $(\eta^2\mathrm{OPT}+\eta B)/(1+\eta)\ge0$ だから成り立つ．
$\eta=\varepsilon/2$，$T\ge4\log m/(\varepsilon^2\gamma)$ なら

$$
B\le\frac{\varepsilon\gamma}{2}\le\frac{\varepsilon\mathrm{OPT}}2.
$$

従って

$$
\mathbb E[\mathrm{OBJ}(\bar p_T)]
\ge(1-\varepsilon/2)\mathrm{OPT}-\varepsilon\mathrm{OPT}/2
=(1-\varepsilon)\mathrm{OPT}.\quad\square
$$

---
class: dense proof-steps
---

# 4-4．強連結グラフのOPTのオーダー

$\mathrm{OPT}_{\mathrm{cut}}=\max_p\kappa_{\mathrm{glob}}(p)$，$\mathrm{OPT}_{\mathrm{ANF}}=\max_p\mathrm{ANF}(p)$ とおく．

**命題4.7**．$n\ge2$ の強連結な有向グラフでは

$$
\frac1{2(n-1)}\le\mathrm{OPT}_{\mathrm{cut}}
\le\mathrm{OPT}_{\mathrm{ANF}}\le\frac1n.
$$

従って，辺数によらず，どちらの最適値も $\Theta(1/n)$ である．

**証明**．根 $r$ を固定し，$r$ から全頂点へ向かう有向全域木と，全頂点から $r$ へ向かう
有向全域木を取る．各木の辺数は $n-1$，和集合 $H$ の辺数は $k\le2(n-1)$．

$H$ では任意の $u,v$ について $u\to r\to v$ と進めるので，$H$ は強連結．
その各辺に容量 $1/k$ を配ると，全ての $\emptyset\ne S\subsetneq V$ について

$$
\delta_H^+(S)\ne\emptyset
\quad\Longrightarrow\quad c_p(S)\ge\frac1k\ge\frac1{2(n-1)}.
$$

これがglobal mincutの下界を与える．全ペアの最小値は平均以下なので
$\kappa_{\mathrm{glob}}(p)\le\mathrm{ANF}(p)$．最後の上界は補題4.5による．$\square$

---
class: dense proof-steps
---

# 4-4．強連結でない場合のOPT

**命題4.8**．自己ループのない有向グラフで $n\ge2$，$E\ne\emptyset$ とする．

$$
\frac1{n(n-1)}\le\mathrm{OPT}_{\mathrm{ANF}}\le\frac1n.
$$

また，グラフが強連結でなければ $\mathrm{OPT}_{\mathrm{cut}}=0$ である．

**証明**．1本の辺 $u\to v$ に全容量を配れば $\kappa_{uv}\ge1$ となるので，ANFの下界を得る．
上界は補題4.5．強連結でない場合，強連結成分を縮約したDAGの終点成分 $S$ は
$\emptyset\ne S\subsetneq V$，$\delta^+(S)=\emptyset$ を満たし，全配分で $c_p(S)=0$．$\square$

ANFの下界を達成する例は，中心 $r$ から各葉への辺だけを持つ**外向きスター**である．
到達可能な順序付き頂点対は $(r,v)$ だけなので，任意の配分について

$$
\mathrm{ANF}(p)=\frac1{n(n-1)}\sum_{v\ne r}p_{rv}
=\frac1{n(n-1)}=\Theta(n^{-2}).
$$

この例は，向きを無視すると連結であっても，ANFの最適値が $\Theta(1/n)$ とは限らないことを示す．

---
class: dense proof-steps opt-table
---

# 4-4．代表的なグラフと反復数

総容量は $1$，$n\ge3$ とする．双方向スターは，各葉と中心を両方向の辺で結ぶ．

| 有向グラフ | $\mathrm{OPT}_{\mathrm{cut}}$ | $\mathrm{OPT}_{\mathrm{ANF}}$ |
| --- | --- | --- |
| 有向サイクル | $1/n$ | $1/n$ |
| 双方向スター | $1/[2(n-1)]$ | $1/[2(n-1)]$ |
| 外向きスター | $0$ | $1/[n(n-1)]$ |
| 有向パス $1\to2\to\cdots\to n$ | $0$ | $1/[2(n-1)]$ |

サイクルは各辺への容量 $1/n$ で上界を達成する．残る2例の計算は次頁で示す．

系4.6に下界を代入すると，期待値での相対精度に十分な反復数は

$$
T=\begin{cases}
O(n\log m/\varepsilon^2),&\text{強連結：両指標},\\
O(n^2\log m/\varepsilon^2),&\text{一般の非空グラフ：ANF}.
\end{cases}
$$

---
class: dense proof-steps
---

# 4-4．代表例のOPTの証明

**双方向スター**．葉 $i$ から中心への容量を $a_i$，逆向きを $b_i$ とする．
$\sum_i(a_i+b_i)=1$ で，葉の単点カットとその補集合からglobal mincutは $\min_i\{a_i,b_i\}$ 以下．
ANFについては，中心と葉の間の流量の和が $1$ なので

$$
\sum_{s\ne t}\kappa_{st}
=1+\sum_{i\ne j}\min(a_i,b_j)
\le1+\frac12\sum_{i\ne j}(a_i+b_j)=\frac n2.
$$

両指標とも $1/[2(n-1)]$ 以下であり，全 $2(n-1)$ 辺への一様配分で等号を達成する．

**有向パス**．辺 $i\to i+1$ の容量を $p_i$ とすると，$i<j$ では
$\kappa_{ij}=\min_{i\le k<j}p_k\le(p_i+p_{j-1})/2$，逆方向の流量は $0$．従って

$$
\sum_{i<j}\kappa_{ij}
\le\frac12\sum_{k=1}^{n-1}\bigl((n-k)+k\bigr)p_k
=\frac n2,\qquad
\mathrm{ANF}(p)\le\frac1{2(n-1)}.
$$

全辺に $1/(n-1)$ を配ると，到達可能な $n(n-1)/2$ ペアの流量が全て $1/(n-1)$ となり，等号を達成する．$\square$

---
layout: section
---

# 5．Algebraic connectivity 最大化

---
class: roomy
---

# 5-1．ネットワーク設計と重み配分

通信網の耐障害性，交通・物流網の機能維持，分散システムの情報共有では，
ネットワークの連結性が重要になる．

与えられたグラフの各辺に総量 $1$ の重みを配分し，連結性を最大化したい．

<div class="diagram-wrap">

<GraphWeights />

</div>

同じ構造でも，辺への重み配分によって，弱い接続への抵抗は変わる．

<!--
20260727.pdfの2–3枚目を統合．図は弱い橋に対する直感であり，描いた配分の最適性を主張しない．
切断のアニメーションは比喩であり，以下で最大化する指標はラプラシアンの第二固有値．
-->

---
class: roomy
---

# 5-1．無向グラフのラプラシアン

辺 $e=\{u,v\}$ に対し $b_e=\chi_u-\chi_v$ とおく．

$$
L(w)=\sum_{e\in E}w_e b_eb_e^\top,\qquad
x^\top L(w)x=\sum_{\{u,v\}\in E}w_{uv}(x_u-x_v)^2.
$$

- $L(w)$ は対称・半正定値で，$L(w)\mathbf1=0$．
- 固有値を $0=\lambda_1\le\lambda_2\le\cdots\le\lambda_n$ と並べる．
- **Algebraic connectivity（AC）** は $\lambda_2(L(w))$．
- $\lambda_2>0$ と，正の重みを持つ辺からなるグラフの連結性は同値．

<div class="text-sm mt-3">

<a href="https://dml.cz/handle/10338.dmlcz/101168" target="_blank" rel="noopener">Fiedler 1973</a>．本資料は非正規化ラプラシアンを用いる．

</div>

<!--
向きはb_eの符号を決めるだけで，b_e b_e^Tは変わらない．
元グラフGが連結でも，重み0の辺を除いた支持グラフが非連結ならλ2=0．
正規化ラプラシアンでは次数行列も重みに依存し，以下の線形性と優勾配式はそのままでは使えない．
-->

---
class: roomy
---

# 5-1．Algebraic Connectivity

$$
X=\{x\in\mathbb R^n:x^\top\mathbf1=0,\ \|x\|_2=1\},\qquad
\lambda_2(L(w))=\min_{x\in X}\sum_{\{u,v\}}w_{uv}(x_u-x_v)^2.
$$

- 守備側は総量 $1$ のばね定数 $w_e$ を辺へ配分する．
- 攻撃側は頂点の**変位** $x_u$ を選ぶ．符号が向き，絶対値が大きさを表す．
- $x\perp\mathbf1$ で全体の平行移動を除き，$\|x\|_2=1$ で大きさを揃える．
- 攻撃側は最もエネルギーが小さい変形を選ぶ．その最適応答が **Fiedlerベクトル**．

<div class="callout-bar">

$C(x;w)=x^\top L(w)x$ を変形のコストと考える．ACはその最小値である．

</div>


$$
\max_{w\in\Delta_E}\min_{x\in X}\sum_{\{u,v\}}w_{uv}(x_u-x_v)^2.
$$

<!--
既存資料の「引っ張り」を，二次形式と整合する変位として説明し直した．
物理的な弾性エネルギーは通常この式の1/2だが，指標としては二次形式自体を用いる．
辺の離散的な切断数そのものではなく，全体的な変形しにくさを測る．
-->

---
class: roomy
---

# 5-1．例：中央の橋を強める効果

パス $1$–$2$–$3$–$4$ に $x=(-1/2,-1/2,1/2,1/2)$ を与える．

<div class="diagram-wrap mt-8">

<GraphPath />

</div>

$$
x^\top L(w)x=w_{23}.
$$

<div class="callout">

この変形への抵抗は中央の重みで増える．ACは<strong>全ての変形の最小値</strong>なので，別の弱点への移動も考慮する．

</div>

<!--
図は既存AC資料のGraphPathを再利用．このxが各wのFiedlerベクトルだとは主張しない．
右の配分は中央を強める代わりに端の辺を弱めるため，AC自体が右のほうで大きいとも主張しない．
任意の固定xから得られる値はλ2の上界であり，下界ではない．
-->

---
class: roomy
---

# 5-1．Absolute Algebraic Connectivity

**定義5.1**．連結な無向グラフ $G=(V,E)$ に対して

$$
\mathrm{OPT}:=\max_{w\in\Delta_E}\lambda_2(L(w)),\qquad
\Delta_E=\left\{w\in\mathbb R_{\ge0}^E:\sum_e w_e=1\right\}
$$

を **Absolute Algebraic Connectivity（AAC）** と呼ぶ．

守備側は，攻撃側が最も変形しやすい方向を選ぶことを見越して，重みを配分する：

$$
\max_{w\in\Delta_E}\min_{x\in X}x^\top L(w)x.
$$

$0<\varepsilon<1$ に対し，$\bar w\in\Delta_E$ が

$$
\lambda_2(L(\bar w))\ge(1-\varepsilon)\mathrm{OPT}
$$

を満たすとき，$\bar w$ を **$(1-\varepsilon)$-近似解** という．

<div class="text-sm mt-3">

<a href="https://doi.org/10.1080/03081089008817967">Fiedler (1990)</a>．

</div>

---
class: roomy
---

# 5-2．Fiedlerベクトルが優勾配を与える

**補題5.2**．$x_t\in X$ を現在の $L(w_t)$ のFiedlerベクトルとする．

$$
\boxed{g_{t,\{a,b\}}=(x_{t,a}-x_{t,b})^2}
$$

は $\mathrm{OBJ}(w)=\lambda_2(L(w))$ の $w_t$ における優勾配である．

**証明**．任意の $u\in\Delta_E$ に対し

$$
\mathrm{OBJ}(u)\le x_t^\top L(u)x_t=\langle g_t,u\rangle
=\mathrm{OBJ}(w_t)+\langle g_t,u-w_t\rangle.
\quad\square
$$

- $\lambda_2$ が単純なら，これが通常の勾配．
- 重複固有値でも，$X$ 内の対応固有ベクトルを一つ選べばよい．

<!--
線形関数〈w,g(x)〉の点ごとの最小値であることが凹性と優勾配の根拠．
単純固有値の微分公式でも同じ式を得るが，この導出は重複を含めて使える．
重複の場合は単一のxによるrank-oneな選択も有効であり，固有空間を全て混ぜる必要はない．
-->

---
class: roomy
---

# 5-2．勾配の範囲と更新式

**補題5.3**．$x_t\in X$ なら $0\le g_{t,e}\le2$．

**証明**．$\|x_t\|_2=1$ より，各辺で

$$
0\le(x_{t,a}-x_{t,b})^2
\le2(x_{t,a}^2+x_{t,b}^2)\le2.
$$

利得を $\ell_{t,e}=g_{t,e}/4$ とおくと $0\le\ell_{t,e}\le1$．更新式は

$$
w_{t+1,e}\propto w_{t,e}\exp\!\left(\frac\eta4(x_{t,a}-x_{t,b})^2\right).
$$

<div class="callout-bar">

最適な攻撃（変形）に対し，大きく伸びる辺へ相対的に重みを配る．

</div>


<!--
優勾配g自体と，MWUに入力する正規化利得ℓ=g/Rを区別する．
添付20260727.pdfのA₁と同じg/4による正規化．近似Fiedlerベクトルでも同じ成分上界が成り立つ．
数値計算では1方向を射影で除いた部分空間で固有ベクトルを求める．
-->

---
class: roomy
---

# 5-2．近似Fiedlerベクトルの定義

**定義5.4**．$\alpha\ge0$ とする．ラプラシアン $L(w)$ に対し

$$
x\in X=\{x\in\mathbb R^n:x^\top\mathbf1=0,\ \|x\|_2=1\},
\qquad x^\top L(w)x\le(1+\alpha)\lambda_2(L(w))
$$

を満たす $x$ を **$\alpha$-近似Fiedlerベクトル** と呼ぶ．

Rayleigh商の最小値が $\lambda_2$ なので，$q=x^\top L(w)x$ は

$$
\lambda_2(L(w))\le q\le(1+\alpha)\lambda_2(L(w))
$$

を満たす．ここで近似するのは **Rayleigh商の値** である．

<div class="text-sm mt-4">

出典：<a href="https://doi.org/10.1137/090771430">Spielman–Teng (2014), Definition 7.1・Theorem 7.2</a>．

</div>

<!--
原資料のDefinition 2.1と同じ定義．α=0なら正確なFiedlerベクトル．
ベクトル自体の距離や角度をα以内にする定義ではない．重複固有値でもこの定義を使える．
正規化条件と1への直交を必ず満たすものをオラクルの出力とする．
-->

---
class: roomy
---

# 5-2．近似Fiedlerベクトルの高速計算

**引用定理5.5**．Spielman–Teng (2014), Theorem 7.2より，
$0<\alpha<1$，$0<\rho<1$ に対し，重み付き連結グラフの
$\alpha$-近似Fiedlerベクトルを確率 $1-\rho$ 以上で出力する乱択アルゴリズムがある．

$$
O\!\left(m\log^c m\,\log(1/\rho)\,
\frac{\log(2/\alpha)}{\alpha}\right)
=\widetilde O\!\left(\frac m\alpha\log\frac1\rho\right).
$$

- ラプラシアンの線形方程式を高速に解き，逆べき乗法を実行する．
- 独立な試行から，Rayleigh商が最も小さい出力を選ぶ．
- $\rho=m^{-10}$ なら，1回の時間は $\widetilde O(m/\alpha)$．
- ACのアルゴリズムで用いる乱数は，このオラクルに由来する．

<div class="text-sm mt-3">

出典：<a href="https://doi.org/10.1137/090771430">Spielman–Teng (2014)</a>．$\widetilde O$ は対数因子を省略する．

</div>

<!--
引用する外部の定理であり，本資料内で線形方程式ソルバ自体の証明は行わない．
原定理のmは非零要素数であり，連結グラフの辺数とは定数倍の差しかない．
近似ベクトルは1への直交を保ち，最後に単位ノルムに正規化する．
-->

---
class: dense
---

# 5-2．アルゴリズムA₁

**入力**：連結な無向グラフ，$\alpha>0$，$0<\eta\le1/2$，反復数 $T$．
**出力**：辺重み $\bar w_T\in\Delta_E$．

1. 各辺で $w_{1,e}=1/m$ とする．
2. $t=1,\ldots,T$ に対して次を繰り返す．

<div class="ml-8">

$L(w_t)$ の $\alpha$-近似Fiedlerベクトル $x_t\in X$ を求める．
各辺 $e=\{u,v\}$ の利得を

$$
\ell_{t,e}=\frac{(x_{t,u}-x_{t,v})^2}{4}
$$

とし，指数更新する：

$$
w_{t+1,e}=\frac{w_{t,e}\exp(\eta\ell_{t,e})}
{\sum_f w_{t,f}\exp(\eta\ell_{t,f})}.
$$

</div>

3. $\displaystyle\bar w_T=\frac1T\sum_{t=1}^T w_t$ を返す．

各回で現在の弱い変形を求め，その変形に対する係数が大きい辺へ重みを配る．

<!--
20260727.pdfの12–13枚目に対応．添付のt=0,…,T−1を本資料のt=1,…,Tへ統一．
平均するのは更新前の配分w_1,…,w_Tである．一様からの指数更新なので，全ての辺の重みは正のまま．
-->

---
class: roomy
---

# 5-3．Local norm technique

通常の加法リグレット評価から相対精度を得るには，
誤差を $\varepsilon\mathrm{OPT}$ 以下にする必要がある．

$$
T=O\!\left(\frac{\log m}{\varepsilon^2\mathrm{OPT}^2}\right).
$$

解析の二次項を，重み付きの量

$$
\|\ell_t\|_{w_t}^2:=\sum_e w_{t,e}\ell_{t,e}^2
\le\sum_e w_{t,e}\ell_{t,e}=\langle w_t,\ell_t\rangle
$$

で評価すると，反復数を

$$
T=O\!\left(\frac{\log m}{\varepsilon^2\mathrm{OPT}}\right)
$$

に改善できる．

<div class="text-sm mt-3">

<a href="https://doi.org/10.1561/2200000018">Shalev-Shwartz (2012), “Online Learning and Online Convex Optimization”</a>．

</div>

---
class: dense proof-steps
---

# 5-3．Local normによる利得の評価

**補題5.6**．$\ell_t\in[0,1]^E$，$w_{1,e}=1/m$，$0<\eta\le1/2$ とする．
指数更新 $w_{t+1,e}\propto w_{t,e}e^{\eta\ell_{t,e}}$ に対し，任意の $u\in\Delta_E$ について

$$
\sum_t\langle w_t,\ell_t\rangle
\ge(1-\eta)\sum_t\langle u,\ell_t\rangle-\frac{\log m}{\eta}.
$$

**証明**．$D_t=D_{\mathrm{KL}}(u\Vert w_t)$ とする．系4.6の証明（2）と同じ指数の評価より

$$
\langle u-w_t,\ell_t\rangle
\le\frac{D_t-D_{t+1}}\eta+\eta\langle w_t,\ell_t\rangle.
$$

$A=\sum_t\langle w_t,\ell_t\rangle$，$B=\sum_t\langle u,\ell_t\rangle$，$b=\log m/\eta$ とおく．
足し合わせ，$D_1\le\log m$，$D_{T+1}\ge0$ を使うと $B-A\le b+\eta A$．従って

$$
A\ge\frac{B-b}{1+\eta}\ge(1-\eta)B-b.
$$

最後の両辺の差は $(\eta^2B+\eta b)/(1+\eta)\ge0$ である．$\square$

---
class: roomy
---

# 5-3．近似Fiedlerベクトルによる保証

**定理5.7**．アルゴリズムA₁で $\alpha>0$，$0<\eta\le1/2$，$T\ge1$ とする．
全 $T$ 回で $\alpha$-近似Fiedlerベクトルが得られれば，出力は

$$
\mathrm{OBJ}(\bar w_T)=\lambda_2(L(\bar w_T))
\ge\frac{(1-\eta)\mathrm{OPT}-4\log m/(\eta T)}{1+\alpha}
$$

を満たす．

各回の条件付き失敗確率が $\rho$ 以下なら，この保証の成功確率は $1-T\rho$ 以上．
特に $\rho=m^{-10}$ なら

$$
\Pr\!\left[
\mathrm{OBJ}(\bar w_T)\ge
\frac{(1-\eta)\mathrm{OPT}-4\log m/(\eta T)}{1+\alpha}
\right]\ge1-\frac{T}{m^{10}}.
$$

$0<\alpha<1$ のとき，1反復の時間は $\widetilde O(m/\alpha)$．

<!--
20260727.pdfの補題8と同じ正規化・定数．1−T/m^10が負になる場合は有効な成功確率を与えないので，
主定理では後述のρ_jを用いて，全体の失敗確率を定数以下に制御する．
-->

---
class: dense
---

# 5-3．定理5.7の証明（1）

全ての近似オラクルが成功したとする．
$q_t=x_t^\top L(w_t)x_t=4\langle w_t,\ell_t\rangle$ とおく．

最適配分 $w^\star$ に対し，$x_t\in X$ より

$$
\mathrm{OPT}=\min_{x\in X}x^\top L(w^\star)x
\le x_t^\top L(w^\star)x_t
=4\langle w^\star,\ell_t\rangle.
$$

補題5.6に $u=w^\star$ を代入すれば

$$
\begin{aligned}
\sum_tq_t
&=4\sum_t\langle w_t,\ell_t\rangle\\
&\ge4(1-\eta)\sum_t\langle w^\star,\ell_t\rangle
-\frac{4\log m}{\eta}\\
&\ge(1-\eta)T\mathrm{OPT}-\frac{4\log m}{\eta}.
\end{aligned}
$$

従って，平均Rayleigh商は

$$
\frac1T\sum_tq_t\ge(1-\eta)\mathrm{OPT}-\frac{4\log m}{\eta T}.
$$

---
class: dense
---

# 5-3．定理5.7の証明（2）

近似Fiedlerベクトルの定義より $q_t\le(1+\alpha)\mathrm{OBJ}(w_t)$．従って

$$
\frac1T\sum_t\mathrm{OBJ}(w_t)
\ge\frac1{1+\alpha}\frac1T\sum_tq_t
\ge\frac{(1-\eta)\mathrm{OPT}-4\log m/(\eta T)}{1+\alpha}.
$$

$\mathrm{OBJ}$ は線形関数 $w\mapsto x^\top L(w)x$ の最小値なので凹関数．Jensenの不等式から

$$
\mathrm{OBJ}(\bar w_T)
=\mathrm{OBJ}\!\left(\frac1T\sum_tw_t\right)
\ge\frac1T\sum_t\mathrm{OBJ}(w_t)
$$

となり，目的値の保証を得る．
各時刻の失敗事象を $F_t$ とすると，条件付き保証とunion boundにより

$$
\Pr\!\left[\bigcup_{t=1}^T F_t\right]
\le\sum_{t=1}^T\mathbb E[\Pr(F_t\mid\mathcal H_t)]\le T\rho.
$$

引用定理5.5と $O(m)$ 時間の更新から，1反復の計算量も得る．$\square$

---
class: roomy
---

# 5-3．相対精度と成功確率

**系5.8**．$0<\varepsilon,\beta<1$，既知の $0<\gamma\le\mathrm{OPT}$ に対し

$$
\alpha=\eta=\varepsilon/4,\qquad
T=\left\lceil\frac{64\log m}{\varepsilon^2\gamma}\right\rceil
$$

と選ぶ．各回の条件付き失敗確率を $\rho\le\beta/T$ とすれば

$$
\Pr[\mathrm{OBJ}(\bar w_T)\ge(1-\varepsilon)\mathrm{OPT}]\ge1-\beta.
$$

**証明**．全回成功する確率は $1-T\rho\ge1-\beta$．この事象上で

$$
\frac{4\log m}{\eta T}\le\frac{\varepsilon\gamma}{4}
\le\frac{\varepsilon\mathrm{OPT}}4,
\qquad
\frac{1-\varepsilon/2}{1+\varepsilon/4}\ge1-\varepsilon.
$$

定理5.7に代入すればよい．$\square$

$\gamma=\Theta(\mathrm{OPT})$ なら，総時間は $\widetilde O(m/(\varepsilon^3\mathrm{OPT}))$．

---
class: roomy
---

# 5-3．最適値の範囲

**補題5.9**．連結な無向グラフのAACは

$$
\frac1{n^3}\le\mathrm{OPT}\le\frac2{n-1}
$$

を満たす．

**上界の証明**．$\sum_e w_e=1$，$\mathrm{Tr}(b_eb_e^\top)=2$ なので

$$
\sum_{i=2}^n\lambda_i(L(w))=\mathrm{Tr}(L(w))=2.
$$

最小の非自明な固有値は，これら $n-1$ 個の平均以下だから

$$
\lambda_2(L(w))\le\frac1{n-1}\sum_{i=2}^n\lambda_i(L(w))
=\frac2{n-1}.
$$

どの配分でも成立するため，最大化した $\mathrm{OPT}$ にも同じ上界が成り立つ．

---
class: dense proof-steps
---

# 5-3．補題5.9の証明

全域木 $H$ の各辺に $1/(n-1)$ を配る．$x\in X$，$M=\max_i x_i$，$m_x=\min_i x_i$ とする．
$(M-x_i)(x_i-m_x)\ge0$ を平均し，$\sum_ix_i=0$，$\sum_ix_i^2=1$ を使うと

$$
\frac1n\le-Mm_x\le\frac{(M-m_x)^2}{4}.
$$

最大・最小の頂点を結ぶ木の道を $P$ とすると，$|P|\le n-1$．Cauchy–Schwarzより

$$
\begin{aligned}
x^\top L(w)x
&\ge\frac1{n-1}\sum_{\{u,v\}\in P}(x_u-x_v)^2\\
&\ge\frac{(M-m_x)^2}{(n-1)|P|}
\ge\frac4{n(n-1)^2}\ge\frac1{n^3}.
\end{aligned}
$$

全ての $x\in X$ について最小化すれば，この配分のACが $1/n^3$ 以上．
従って，その最大値である $\mathrm{OPT}$ も $1/n^3$ 以上である．$\square$

---
class: dense proof-steps
---

# 5-3．直径によるOPTの下界

連結な無向グラフの直径を $D$ とすると，補題5.9の下界を

$$
\mathrm{OPT}\ge\frac2{n(n-1)D}
$$

と評価できる．特に，$D=O(1)$ なら $\mathrm{OPT}=\Omega(n^{-2})$ である．

**証明**．任意の頂点を根とする幅優先探索木 $H$ を取り，各木辺に $1/(n-1)$ を配る．
根からの深さは $D$ 以下なので，木上の任意の2頂点間の距離は $2D$ 以下．

$x\in X$ の最大値・最小値を $M,m_x$ とする．前頁と同様に $(M-m_x)^2\ge4/n$．
この2頂点を結ぶ木の道 $P$ に沿って

$$
x^\top L(w)x
\ge\frac{(M-m_x)^2}{(n-1)|P|}
\ge\frac{4/n}{2D(n-1)}
=\frac2{n(n-1)D}.
$$

$x\in X$ について最小化してもこの下界が残る．$\square$

$D\le n-1$ より常に $\Omega(n^{-3})$．次の例では，このオーダーから $\Theta(n^{-1})$ まで変化する．

---
class: dense proof-steps opt-table
---

# 5-3．代表的なグラフのOPTのオーダー

総重みは $1$，$n\ge3$ とする．A₁の総時間は $\widetilde O(m/(\varepsilon^3\mathrm{OPT}))$．

| 無向グラフ | 辺数 $m$ | $\mathrm{OPT}$ | A₁の総時間 |
| --- | --- | --- | --- |
| パス $P_n$ | $n-1$ | $\Theta(n^{-3})$ | $\widetilde O(n^4/\varepsilon^3)$ |
| サイクル $C_n$ | $n$ | $\dfrac{2-2\cos(2\pi/n)}{n}=\Theta(n^{-3})$ | $\widetilde O(n^4/\varepsilon^3)$ |
| スター $K_{1,n-1}$ | $n-1$ | $\dfrac1{n-1}=\Theta(n^{-1})$ | $\widetilde O(n^2/\varepsilon^3)$ |
| 完全グラフ $K_n$ | $n(n-1)/2$ | $\dfrac2{n-1}=\Theta(n^{-1})$ | $\widetilde O(n^3/\varepsilon^3)$ |

パスとスターは同じ辺数だが，OPTのオーダーは $n^2$ 倍異なる．

一般の連結グラフでは $1/n^3\le\mathrm{OPT}\le2/(n-1)$．相対精度に十分な反復数
$T=O(\log m/(\varepsilon^2\mathrm{OPT}))$ は，最悪の場合 $O(n^3\log m/\varepsilon^2)$ となる．

---
class: dense proof-steps
---

# 5-3．パスのOPTの証明

頂点を $1,\ldots,n$ と並べ，どの配分 $w$ にも同じ変位ベクトルを使う：

$$
a_i=i-\frac{n+1}{2},\qquad
S=\sum_{i=1}^n a_i^2=\frac{n(n^2-1)}{12},\qquad
x_i=\frac{a_i}{\sqrt S}.
$$

$\sum_i x_i=0$，$\|x\|_2=1$ より $x\in X$．隣接頂点の差は全て $1/\sqrt S$ なので

$$
\lambda_2(L(w))\le x^\top L(w)x
=\sum_{i=1}^{n-1}w_{i,i+1}\frac1S
=\frac{12}{n(n^2-1)}.
$$

全ての $w\in\Delta_E$ に対する上界なので，最大化しても同じ上界が残る．
一方，補題5.9の証明による下界を合わせると

$$
\frac4{n(n-1)^2}\le\mathrm{OPT}(P_n)
\le\frac{12}{n(n^2-1)}.
$$

両端とも $\Theta(n^{-3})$ であり，$\mathrm{OPT}(P_n)=\Theta(n^{-3})$ を得る．$\square$

---
class: dense proof-steps opt-table
---

# 5-3．対称なグラフのOPTの証明

サイクル・スター・完全グラフでは，任意の2辺を移し合うグラフの自己同型が存在する．
自己同型の集合を $\Gamma$，$\sigma$ で並べ替えた配分を $w^\sigma$ とすると，その平均は一様配分：

$$
\bar w=\frac1{|\Gamma|}\sum_{\sigma\in\Gamma}w^\sigma
=\left(\frac1m,\ldots,\frac1m\right).
$$

$F(w)=\lambda_2(L(w))$ は凹関数で，頂点の並べ替えによって変わらない．従って

$$
F(\bar w)\ge\frac1{|\Gamma|}\sum_{\sigma\in\Gamma}F(w^\sigma)=F(w).
$$

よって一様配分が最適．各辺の重みが $1$ のラプラシアンを $L_G$ とすると，$\mathrm{OPT}=\lambda_2(L_G)/m$．

| グラフ | $L_G$ の固有値から求める $\lambda_2(L_G)$ |
| --- | --- |
| サイクル | Fourierモードの固有値 $2-2\cos(2\pi k/n)$ より $2-2\cos(2\pi/n)$ |
| スター | 固有値は $0,1$（$n-2$ 個），$n$．従って $\lambda_2=1$ |
| 完全グラフ | $L_G=nI-\mathbf1\mathbf1^\top$ より $\lambda_2=n$ |

それぞれ辺数で割れば表の値を得る．$1-\cos z=\Theta(z^2)$ より，サイクルは $\Theta(n^{-3})$．$\square$

---
class: roomy
---

# 5-3．未知のOPT：Doubling Trick

**定理5.10**．$0<\varepsilon<1$，$\eta=\alpha=\varepsilon/8$ とする．
A₁の反復を続け，$T=1,2,4,8,\ldots$ の時点で

$$
U_T=\max_e\frac1T\sum_tg_{t,e},\qquad
L_T=\frac{q(\bar w_T)}{1+\alpha},\qquad g_t=4\ell_t
$$

を計算する．$q(\bar w_T)$ も $\alpha$-近似Fiedlerベクトルで評価する．

$$
L_T\ge(1-\varepsilon)U_T
$$

を初めて満たした時点で停止する．全オラクルが成功する事象上で

$$
\mathrm{OBJ}(\bar w_T)\ge(1-\varepsilon)\mathrm{OPT},\qquad
T=O\!\left(\frac{\log m}{\varepsilon^2\mathrm{OPT}}\right).
$$

反復数を2倍ずつ増やすことで，未知の $\mathrm{OPT}$ に応じた計算時間で停止できる．

<!--
20260727.pdfの16枚目の未知OPTへの対応を，停止条件まで証明できる形で実装する．
原資料のγ←γ/(1+ε/2)という全再実行は，総和の評価で追加の1/εを生む．また，
単にλ2≥(1−ε)γを確認するだけでは，γがOPT未満の場合に目的の相対保証が直ちには出ない．
本編ではTを2倍にし，同じ更新列を継続する．OPTの上界Uと出力値の下界Lで停止を判定する．
-->

---
class: dense proof-steps
---

# 5-3．定理5.10の証明（1）

近似条件より，出力のRayleigh商は

$$
\mathrm{OBJ}(\bar w_T)\le q(\bar w_T)\le(1+\alpha)\mathrm{OBJ}(\bar w_T).
$$

従って $L_T\le\mathrm{OBJ}(\bar w_T)\le\mathrm{OPT}$．一方，全ての $u\in\Delta_E$ に対し

$$
\mathrm{OBJ}(u)\le\langle g_t,u\rangle
\quad\Longrightarrow\quad
\mathrm{OBJ}(u)\le\left\langle\frac1T\sum_tg_t,u\right\rangle\le U_T.
$$

最大化すると $\mathrm{OPT}\le U_T$．よって，停止したときは

$$
\mathrm{OBJ}(\bar w_T)\ge L_T\ge(1-\varepsilon)U_T
\ge(1-\varepsilon)\mathrm{OPT}.
$$

次に停止までの反復数を評価する．補題5.6の証明中の $B-A\le b+\eta A$ を各単体の頂点に使うと

$$
U_T\le(1+\eta)\frac1T\sum_tq_t+B_T,
\qquad B_T=\frac{4\log m}{\eta T}.
$$

---
class: dense proof-steps
---

# 5-3．定理5.10の証明（2）

近似条件，凹性，$\mathrm{OBJ}(\bar w_T)\le(1+\alpha)L_T$ から

$$
\begin{aligned}
\mathrm{OPT}\le U_T
&\le(1+\eta)\frac1T\sum_tq_t+B_T\\
&\le(1+\eta)(1+\alpha)\mathrm{OBJ}(\bar w_T)+B_T
\le A L_T+B_T,
\end{aligned}
$$

ただし $A=(1+\eta)(1+\alpha)^2=(1+\varepsilon/8)^3\le1+\varepsilon/2$．

$$
T\ge\frac{256\log m}{\varepsilon^2\mathrm{OPT}}
\quad\Longrightarrow\quad B_T\le\frac{\varepsilon\mathrm{OPT}}8,
\qquad L_T\ge\frac{\mathrm{OPT}-B_T}{A}\ge\frac7{12}\mathrm{OPT}.
$$

従って $B_T/L_T\le3\varepsilon/14$ であり

$$
U_T\le(1+5\varepsilon/7)L_T
\quad\Longrightarrow\quad(1-\varepsilon)U_T\le L_T.
$$

この閾値を超えた最初の2倍刻みの判定で停止する．反復数は閾値の高々2倍である．$\square$

<!--
Aの展開ではε²,ε³≤εを使うと，1次係数の合計217/512<1/2．
出力評価はO(log T)回．正確なOPTもλ2の厳密計算も停止条件には用いない．
-->

---
class: roomy
---

# 5-3．主結果

**定理5.11**．連結な無向グラフ $G=(V,E)$ と $0<\varepsilon<1$ に対し，
確率少なくとも $2/3$ で，時間

$$
\widetilde O\!\left(\frac{m}{\varepsilon^3\mathrm{OPT}}\right)
$$

以内に $(1-\varepsilon)$-近似解 $\bar w\in\Delta_E$ を出力するアルゴリズムが存在する．

$$
\lambda_2(L(\bar w))\ge(1-\varepsilon)\mathrm{OPT}.
$$

- **MWU**：辺重みを指数更新する．
- **近似Fiedlerオラクル**：現在の弱い変形を高速に求める．
- **Local norm technique**：反復数の $\mathrm{OPT}$ への依存を2乗から1乗に改善する．
- **Doubling Trick**：$\mathrm{OPT}$ を知らずに停止する．

<!--
20260727.pdfの主定理とまとめに対応．同じ成功事象上で精度と時間の両方を保証する形で記述する．
m=1のグラフは配分が一意なので別途直接返せる．m≥2で以下の対数を用いる．
-->

---
class: dense proof-steps
---

# 5-3．定理5.11の証明

更新用と出力評価用の全呼び出しに通し番号 $j=1,2,\ldots$ を付け，
条件付き失敗確率を $\rho_j=1/[3j(j+1)]$ とする．

$$
\Pr[\text{いずれかが失敗}]
\le\sum_{j\ge1}\rho_j
=\frac13\sum_{j\ge1}\left(\frac1j-\frac1{j+1}\right)=\frac13.
$$

全呼び出しが成功すれば，定理5.10により

$$
T=O\!\left(\frac{\log m}{\varepsilon^2\mathrm{OPT}}\right)
$$

で所望の近似解を得る．$\alpha=\varepsilon/8$ なので，1回のオラクル時間は $\widetilde O(m/\varepsilon)$．
$O(m)$ の更新と $O(\log T)$ 回の出力評価を加えても

$$
\widetilde O(Tm/\varepsilon)
=\widetilde O\!\left(\frac{m}{\varepsilon^3\mathrm{OPT}}\right).
\quad\square
$$

成功確率を $1-\delta$ にするには $\rho_j=\delta/[j(j+1)]$ とし，時間の増加は $\log(1/\delta)$ の因子に収まる．

<!--
独立実行の単純な繰り返しでは良い出力の選択も必要なため，ここではオラクルの失敗確率を直接下げる．
OPT≥1/n³より，成功時のTはnと1/εの多項式なのでlog jは隠した対数因子に含まれる．
失敗時にも無限に継続しないよう，256n³log m/ε²以上となる最初の2冪を上限としてよい．
この上限に達しても証明書が得られなければ失敗を返す．全成功事象ではそれ以前に停止する．
-->

---
class: dense
---

# 5-3．計算量の比較

<div class="grid grid-cols-[1.5fr_1fr] gap-6">
<div>

| 方法 | 計算量 |
| --- | --- |
| A₁：MWU | $\widetilde O(m/(\varepsilon^3\mathrm{OPT}))$ |
| A₂：切除平面法 | $\widetilde O(m^3\operatorname{polylog}(1/\varepsilon))$ |

$\varepsilon$ を定数とし，対数因子を省くと，境界は

$$
\frac m{\mathrm{OPT}}=m^3
\quad\Longleftrightarrow\quad\mathrm{OPT}=m^{-2}.
$$

- **パス $P_n$**：$m=\Theta(n)$，$\mathrm{OPT}=\Theta(n^{-3})$．A₂が有利．
- **直径 $O(1)$ の密グラフ**：$m=\Theta(n^2)$，$\mathrm{OPT}=\Omega(n^{-2})$．A₁が有利．
- 完全グラフや密な完全二部グラフは後者の例．

</div>
<div>

<ComplexityRegions :step="1" />

</div>
</div>

<div class="text-sm mt-3">

切除平面法：<a href="https://arxiv.org/abs/2004.04250">Jiang–Lee–Song–Wong (2020)</a>．

</div>

<!--
20260727.pdfの11枚目に対応．図はx=log_n m，y=log_n OPT，境界y=−2x．
境界付近は定数と対数因子に依存する．εを固定しない場合，A₁のε^−3も比較に含める．
A₂のm³は添付資料の比較対象であり，引用論文自体の一般切除平面定理はO(m·SO+m³)を与える．
パスの上界はx_i∝i−(n+1)/2をRayleigh商に代入して12/[n(n²−1)]，下界は補題5.9．
直径DのBFS木の直径は2D以下．補題5.9の道の議論でOPT≥2/[n(n−1)D]を得る．
-->

---
class: roomy
---

# 5-3．まとめ

連結な無向グラフの辺へ総量 $1$ の重みを配分し，

$$
\mathrm{OPT}=\max_{w\in\Delta_E}\lambda_2(L(w))
$$

を近似する問題を考えた．

近似Fiedlerベクトルを応答に用いるMWUにより，確率 $2/3$ 以上で

$$
\lambda_2(L(\bar w))\ge(1-\varepsilon)\mathrm{OPT},\qquad
\text{時間 }\widetilde O\!\left(\frac m{\varepsilon^3\mathrm{OPT}}\right)
$$

を達成する．

精度の解析はlocal normによる利得評価，未知の最適値への対応はDoubling Trickによる．
計算量の優劣は，辺数 $m$ と最適値 $\mathrm{OPT}$ の大きさに依存する．

---
class: roomy
---

# 3つの指標を同じ枠組みで見る

| | Global mincut | ANF | AC |
| --- | --- | --- | --- |
| グラフ | 有向 | 有向 | 無向 |
| 勾配の計算 | 全体の最小カット | 各ペアの最小カット | Fiedlerベクトル |
| $g_e$ | 指示関数 | 指示関数の平均 | $(x_u-x_v)^2$ |
| 更新に用いる正規化 $R$ | $1$ | $1$ | $4$ |
| 近似精度 | 期待値で加法保証 | 期待値で加法保証 | 近似固有ベクトルでも相対保証 |

<div class="callout-bar">

いずれも，凹な目的関数に対して単体上で指数更新する．<br>
ANFの抽出誤差と，ACの固有ベクトルの近似誤差を区別して扱う．

</div>

<!--
ANFの正確な優勾配は全ペア平均．抽出版ではその不偏推定量を用いる．
ACは総重み1に正規化している．有向2指標では既存容量0とし，総容量1を配分する．
-->

---
layout: section
---

# 補足：証明と参考文献

必要に応じて参照

---
class: dense
---

# 補足A．MWUの二次項評価

**補題A.1**．補題2.2の設定で $0<\eta\le1/2$ とする．全ての $u\in\Delta_E$ に対し

$$
\boxed{\operatorname{Reg}_T(u)\le\frac{R\log m}{\eta}
+\eta\sum_t\langle w_t,g_t\rangle}.
$$

**証明**．$\ell_t=g_t/R$ とおく．$0\le\eta\ell_{t,e}\le1/2$ なので
$e^z\le1+z+z^2$，$\log(1+a)\le a$ を使うと

$$
\log\sum_e w_{t,e}e^{\eta\ell_{t,e}}
\le\eta\langle w_t,\ell_t\rangle+\eta^2\langle w_t,\ell_t^2\rangle.
$$

補題2.2の証明と同じKLの差に代入し，$\ell_{t,e}^2\le\ell_{t,e}$ より

$$
\langle u-w_t,g_t\rangle\le\frac R\eta
\left[D_{\mathrm{KL}}(u\Vert w_t)-D_{\mathrm{KL}}(u\Vert w_{t+1})\right]
+\eta\langle w_t,g_t\rangle.
$$

足し合わせ，一様初期化のKL上界を用いればよい．$\square$

<!--
Arora–Hazan–Kaleの二次項評価に対応．各実現値で成り立つ不等式なので確率的な利得にも適用できる．
-->

---
class: dense
---

# 補足B．期待値での相対保証

**定理B.1**．$\mathrm{OBJ}\ge0$ は単体上の連続な凹関数とする．一様初期化のMWUで，
$0<\eta\le1/2$，$0\le\widehat g_{t,e}\le R$，
$\mathbb E[\widehat g_t\mid\mathcal H_t]\in\partial^+\mathrm{OBJ}(w_t)$ および
$\mathbb E[\langle w_t,\widehat g_t\rangle\mid\mathcal H_t]\le\mathrm{OBJ}(w_t)$ を仮定する．このとき

$$
\mathbb E[\mathrm{OBJ}(\bar w_T)]\ge(1-\eta)\mathrm{OPT}-\frac{R\log m}{\eta T}.
$$

**証明**．$w^\star$ を最適配分とする．定理4.4と同様に期待値を取り，補題A.1より

$$
T\mathrm{OPT}-\sum_t\mathbb E[\mathrm{OBJ}(w_t)]
\le\mathbb E[\operatorname{Reg}_T(w^\star)]
\le\frac{R\log m}{\eta}+\eta\sum_t\mathbb E[\mathrm{OBJ}(w_t)].
$$

移項し，凹性と $1/(1+\eta)\ge1-\eta$，$\mathrm{OPT}\ge0$ を使うと

$$
\mathbb E[\mathrm{OBJ}(\bar w_T)]\ge
\frac{\mathrm{OPT}-R\log m/(\eta T)}{1+\eta}
\ge(1-\eta)\mathrm{OPT}-\frac{R\log m}{\eta T}.
\quad\square
$$

<!--
決定論的な厳密AC更新は期待値が一点に集中する特殊ケース．
元ノートの主定理と区別した，本資料での非負性を用いる補足導出．
-->

---
class: roomy
---

# 補足C．内側を加法誤差で近似する場合

**命題C.1（加法誤差を持つオラクル）**．$\mathrm{OBJ}$ は単体上の連続な凹関数とする．補題2.2の初期化と更新を使い，$\eta=\sqrt{2\log m/T}$ とする．アフィン上界 $h_t(u)=b_t+\langle g_t,u\rangle$ が次を満たすとする：

$$
\mathrm{OBJ}(u)\le h_t(u)\quad(\forall u),\qquad
h_t(w_t)\le \mathrm{OBJ}(w_t)+\xi_t.
$$

$g_t\in[0,R]^E$，$\xi_t\ge0$ を仮定する．このとき $g_t$ は $\xi_t$-近似優勾配となり

$$
\mathrm{OPT}-\mathrm{OBJ}(\bar w_T)
\le R\sqrt{\frac{2\log m}{T}}+\frac1T\sum_t\xi_t.
$$

<div class="callout">

反復を増やしても，内側の平均誤差は残る．高い精度にはオラクル精度の調整が必要．

</div>

**証明**．定理2.3の優勾配不等式に $\xi_t$ を加え，足し合わせる．$\square$

<!--
近似最小カットの容量誤差や近似固有ベクトルのRayleigh商の加法誤差に適用できる．
単なる最大流量の近似だけではカットの係数ベクトルが得られない場合があるので，
実際に実行可能なカットまたはベクトルと，上界の誤差保証を返すオラクルが必要．
-->

---
class: roomy
---

# 補足D．添付ノートから補正した点

**ANFの上界**：正しくは $\mathrm{ANF}(x)\le\frac1n\sum_e x_e$．
一般に $\mathrm{ANF}(x)\le\min_s d_x^+(s)$ ではない．

- 容量 $(0.2,0.3,0.5)$ の有向3-cycleでは $\mathrm{ANF}=1.7/6>0.2=\min_s d_x^+(s)$．
- Global mincutには $\kappa_{\mathrm{glob}}(x)\le\min_s d_x^+(s)$ が成り立つ．

**ANFのゲーム解釈**：頂点対は一様分布で固定する．

- 敵が頂点対の分布も自由に選ぶと，平均ではなく global mincut になる．
- ANFでは，各ペアについて最小カットを選び，その値を平均する．

**精度の尺度**：総容量 $1$ に対する上界は $1/n$．
この上界だけから，誤差 $\delta=\Theta(1/n)$ の定数比近似は導けない．

<!--
添付ノートProposition 2.5の最小出次数によるANF上界と，その証明末尾の推論は成立しない．
平均出次数による上界の証明は正しい．元ノートの一般予算の上界を，本編では総容量1の場合に限定した．
§4.1式(4.4)の任意分布qによるゲームはglobal mincutを表し，そのままANFにはならない．
凹関数についてのsubgradientという表記は，本資料では上支え不等式を満たす優勾配に統一した．
§3のt≤凹関数のLPは厳密にはhypograph（下側集合）の表現．本編ではLPを扱わない．
-->

---
class: roomy
---

# 補足E．カット応答を使った事後の精度確認

**命題E.1（上下界による証明）**．全ての $p\in\Delta_E$ に対して
$\mathrm{OBJ}(p)\le\langle g_t,p\rangle$ が成り立つ応答を使うとする．

$$
U_T=\max_e\frac1T\sum_tg_{t,e},\qquad
L_T=\mathrm{OBJ}(\bar p_T)
$$

と定めると $L_T\le\mathrm{OPT}\le U_T$．従って $0<\varepsilon<1$ に対し

$$
L_T\ge(1-\varepsilon)U_T\ \Longrightarrow\
\mathrm{OBJ}(\bar p_T)\ge(1-\varepsilon)\mathrm{OPT}.
$$

**証明**．線形上界を平均して単体上で最大化すると $U_T$ となる．$\square$

<div class="callout">

この確認には，global mincutのカット，またはANFの全ペア平均を使う．
ANFの1ペア抽出の期待値保証とは別の事後確認である．

</div>

<!--
ANFの一つのペアのカットは，ANF全体の上界にはならない．L_Tも厳密に評価する．
期待値の収束定理を実現値ごとの証明に読み替えないため，この実行ごとの確認は補足に分離．
-->

---
class: dense
---

# 参考文献：MWUとmirror descent

1. A. S. Nemirovski and D. B. Yudin. [*Problem Complexity and Method Efficiency in Optimization*](https://www2.isye.gatech.edu/~nemirovs/Nemirovskii_Yudin_1983.pdf). Wiley, 1983. （mirror descentの原型）
2. N. Littlestone and M. K. Warmuth. [The Weighted Majority Algorithm](https://doi.org/10.1006/inco.1994.1009). *Information and Computation*, 108(2), 212–261, 1994.
3. Y. Freund and R. E. Schapire. [A Decision-Theoretic Generalization of On-Line Learning and an Application to Boosting](https://doi.org/10.1006/jcss.1997.1504). *JCSS*, 55(1), 119–139, 1997.
4. A. Beck and M. Teboulle. [Mirror Descent and Nonlinear Projected Subgradient Methods for Convex Optimization](https://www.tau.ac.il/~becka/3.pdf). *Operations Research Letters*, 31, 167–175, 2003.
5. S. Arora, E. Hazan, and S. Kale. [The Multiplicative Weights Update Method: a Meta-Algorithm and Applications](https://theoryofcomputing.org/articles/v008a006/). *Theory of Computing*, 8, 121–164, 2012. （特に指数型更新と二次項評価）

<!--
関連研究の説明は代表的な系譜として位置づける．本資料のグラフ問題への当てはめや定数の整理は
上記の一般不等式からここで導出したもので，これらの文献に同一のグラフ定理が記載されている
と主張するものではない．
-->

---
class: dense
---

# 参考文献：グラフと一次法

6. M. Fiedler. [Algebraic Connectivity of Graphs](https://dml.cz/handle/10338.dmlcz/101168). *Czechoslovak Mathematical Journal*, 23(2), 298–305, 1973.
7. M. Fiedler. [Absolute Algebraic Connectivity of Trees](https://doi.org/10.1080/03081089008817967). *Linear and Multilinear Algebra*, 26, 85–106, 1990.
8. D. A. Spielman and S.-H. Teng. [Nearly Linear Time Algorithms for Preconditioning and Solving Symmetric, Diagonally Dominant Linear Systems](https://doi.org/10.1137/090771430). *SIAM Journal on Matrix Analysis and Applications*, 35(3), 835–885, 2014.
9. 伊藤 勝．[凸最適化問題に対する一次法とその理論―加速勾配法とその周辺―](https://orsj.org/wp-content/corsj/or64-6/or64_6_326.pdf)．*オペレーションズ・リサーチ*，64(6)，326–334，2019．

---
class: dense
---

# 参考文献：第5章の関連研究

- S. Boyd, P. Diaconis, and L. Xiao. [Fastest Mixing Markov Chain on a Graph](https://web.stanford.edu/~boyd/papers/fastest_mixing_markov_chain.html). *SIAM Review*, 46(4), 667–689, 2004.
- S. Richter and I. Rocha. *Absolute Algebraic Connectivity of Double Brooms and Trees*. *Discrete Applied Mathematics*, 201, 213–221, 2016.
- Y. Wan et al. *On the Structure of Graph Edge Designs that Optimize the Algebraic Connectivity*. *IEEE Conference on Decision and Control*, 805–810, 2008.
- N. M. M. de Abreu. *Old and New Results on Algebraic Connectivity of Graphs*. *Linear Algebra and Its Applications*, 423(1), 53–73, 2007.

---
class: roomy
---

# 参考文献：第5章のアルゴリズムと解析

- H. Jiang, Y. T. Lee, Z. Song, and S. C.-W. Wong. [An Improved Cutting Plane Method for Convex Optimization, Convex-Concave Games and its Applications](https://arxiv.org/abs/2004.04250). *STOC*, 944–953, 2020.
- S. Shalev-Shwartz. [Online Learning and Online Convex Optimization](https://doi.org/10.1561/2200000018). *Foundations and Trends in Machine Learning*, 4(2), 107–194, 2012.

<!--
第5章に添付の動機，図の直感，AACと近似解の定義，ラプラシアン，近似Fiedler，
高速オラクル，A₁，local norm，近似保証，主結果，計算量比較，未知OPT，まとめを全て組み込んだ．
第5章の正規化をg/4に統一し，成功確率と未知OPTの停止証明を補った．
-->
