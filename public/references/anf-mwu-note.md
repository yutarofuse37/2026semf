
---

### 1．Introduction

---

### 2．Preliminaries

#### 2.1 Graph notation and $s$-$t$ max flow

We consider a directed graph $G=(V,E)$ with $n$ vertices and $m$ edges. Each edge $e\in E$ is associated with a nonnegative weight. The weight vector is denoted by $\boldsymbol w\in\mathbb R_{\ge 0}^{E}$.

For any subset of vertices $S\subseteq V$, we define the outgoing cut set $\delta^{+}(S)\subseteq E$ by

$$
\delta^{+}(S)=\{(u,v)\in E\mid u\in S,\ v\notin S\}.
\tag{2.1}
$$

For each ordered pair of distinct vertices $(s,t)$, the max–flow min–cut theorem implies

$$
F_{st}(\boldsymbol x)
=\min_{\substack{S\subseteq V\\ s\in S,\ t\notin S}}\ \sum_{e\in\delta^{+}(S)} x_e
=\min_{\substack{S\subseteq V\\ s\in S,\ t\notin S}}\ \chi_{\delta^{+}(S)}^{\top}\boldsymbol x.
\tag{2.2}
$$

Here $\chi_{\delta^{+}(S)}\in\{0,1\}^{E}$ denotes the cut indicator vector of $\delta^{+}(S)$, i.e., $(\chi_{\delta^{+}(S)})_e=1$ iff $e\in\delta^{+}(S)$. For convenience, we define $F_{ss}(\boldsymbol x)=0$ for all $s\in V$.

#### 2.2 Average Network Flow (ANF)

Average Network Flow (ANF) \cite{SI2022} is a measure of network robustness defined as the average of the maximum flow values between all unordered pairs of vertices in an undirected graph. In this paper, we consider a directed version of ANF, where the average is taken over all ordered pairs of distinct vertices. In the directed case,

$$
\mathrm{ANF}(\boldsymbol x)=\frac{1}{n(n-1)}\sum_{s\ne t} F_{st}(\boldsymbol x).
\tag{2.3}
$$

#### 2.2.1 Simple upper bounds on $\mathrm{ANF}$ (directed case)

We record a simple upper bound that will be useful for interpreting additive-$\varepsilon$ guarantees.

Proposition 2.5 (out-degree upper bound for ANF). For any $\boldsymbol x\in\mathbb R_{\ge 0}^{E}$,

$$
\mathrm{ANF}(\boldsymbol x)\le \min_{s\in V}\ \sum_{e\in\delta^{+}(\{s\})} x_e\ \le\ \frac{1}{n}\sum_{e\in E} x_e.
$$

Proof. Fix $s\ne t$ and take the $s$--$t$ cut $S=\{s\}$ in (2.2). Then

$$
F_{st}(\boldsymbol x)\le \sum_{e\in\delta^{+}(\{s\})} x_e.
$$

Summing over all $t\ne s$ yields

$$
\sum_{t\ne s}F_{st}(\boldsymbol x)\le (n-1)\sum_{e\in\delta^{+}(\{s\})} x_e.
$$

Summing over all $s\in V$ and dividing by $n(n-1)$ gives

$$
\mathrm{ANF}(\boldsymbol x)=\frac{1}{n(n-1)}\sum_{s\ne t}F_{st}(\boldsymbol x)
\le \frac{1}{n}\sum_{s\in V}\sum_{e\in\delta^{+}(\{s\})} x_e
=\frac{1}{n}\sum_{e\in E} x_e,
$$

since each directed edge $e=(u,v)$ contributes exactly once, to the term $s=u$. The bound by $\min_s$ follows since the minimum is at most the average. □

Tightness. The upper bound is tight. Let $G=(V,E)$ be the complete directed graph on $n:=|V|$ vertices and set $x_e=C/|E|$ for all $e\in E$. Then $\sum_{e\in\delta^{+}(\{s\})}x_e=C/n$ for every $s$. Moreover, for any $s\ne t$, the cut $\{s\}$ attains the minimum $s$--$t$ cut, hence $F_{st}(\boldsymbol x)=C/n$ and therefore $\mathrm{ANF}(\boldsymbol x)=C/n$.

Corollary 2.6 (upper bound under $\ell_1$-budget). For $\boldsymbol x=\boldsymbol w+C\boldsymbol p$ with $\boldsymbol p\ge 0$ and $\|\boldsymbol p\|_1\le 1$,

$$
\mathrm{ANF}(\boldsymbol w+C\boldsymbol p)\le \frac{1}{n}\sum_{e\in E}(w_e+Cp_e)
\le \frac{1}{n}\left(\sum_{e\in E}w_e + C\right).
$$

#### 2.3 Global min-cut value

We define the global directed min-cut value

$$
\lambda(\boldsymbol x)=\min_{s\ne t}F_{st}(\boldsymbol x).
\tag{2.4}
$$

#### 2.3.1 Simple upper bounds on $\lambda$

We record a simple upper bound that will be useful for interpreting additive-$\varepsilon$ guarantees.

Proposition 2.7 (degree-based upper bound for global min-cut). For any $\boldsymbol x\in\mathbb R_{\ge 0}^{E}$,

$$
\lambda(\boldsymbol x)\le \min_{s\in V}\ \sum_{e\in\delta^{+}(\{s\})} x_e\ \le\ \frac{1}{n}\sum_{e\in E} x_e.
$$

Proof. Fix $s\ne t$ and take the $s$--$t$ cut $S=\{s\}$ in (2.2). Then

$$
F_{st}(\boldsymbol x)\le \sum_{e\in\delta^{+}(\{s\})} x_e.
$$

Taking the minimum over $t\ne s$ gives

$$
\min_{t\ne s}F_{st}(\boldsymbol x)\le \sum_{e\in\delta^{+}(\{s\})} x_e,
$$

and then taking the minimum over $s$ yields the first inequality. For the second inequality, note that

$$
\frac{1}{n}\sum_{s\in V}\sum_{e\in\delta^{+}(\{s\})} x_e
=\frac{1}{n}\sum_{e\in E} x_e,
$$

since each directed edge $e=(u,v)$ contributes exactly once, to the term $s=u$. Hence $\min_s\sum_{e\in\delta^{+}(\{s\})} x_e$ is at most the average, i.e., $\frac{1}{n}\sum_e x_e$. □

Corollary 2.8 (upper bound under $\ell_1$-budget). For $\boldsymbol x=\boldsymbol w+C\boldsymbol p$ with $\boldsymbol p\ge 0$ and $\|\boldsymbol p\|_1\le 1$,

$$
\lambda(\boldsymbol w+C\boldsymbol p)\le \frac{1}{n}\sum_{e\in E}(w_e+Cp_e)
\le \frac{1}{n}\left(\sum_{e\in E}w_e + C\right).
$$

#### 2.4 Problem definition

We address the problem of maximizing $\mathrm{ANF}$ and $\lambda$ by increasing some of the edge weights. The total amount by which the edge weights can be increased is limited by a budget $C>0$. For an augmentation vector $\boldsymbol p\in\mathbb R_{\ge 0}^{E}$, define

$$
\boldsymbol x=\boldsymbol w+C\boldsymbol p.
\tag{2.5}
$$

We study the following optimization problems:

1. ANF maximization:
    
    $$
    																																																																					\max\ \mathrm{ANF}(\boldsymbol w+C\boldsymbol p)
    \quad\text{s.t.}\quad \|\boldsymbol p\|_{1}\le 1,\ \boldsymbol p\ge \boldsymbol 0.
    \tag{2.6}
    $$
    
2. Global min-cut maximization:
    
    $$
    																																																																					\max\ \lambda(\boldsymbol w+C\boldsymbol p)
    \quad\text{s.t.}\quad \|\boldsymbol p\|_{1}\le 1,\ \boldsymbol p\ge \boldsymbol 0.
    \tag{2.7}
    $$
    

#### 2.5 Piecewise-linear concavity

For fixed $(s,t)$,

$$
F_{st}(\boldsymbol x)=\min_{\substack{S\subseteq V\\ s\in S,\ t\notin S}}\chi_{\delta^{+}(S)}^{\top}\boldsymbol x
$$

is the pointwise minimum of finitely many affine functions. Hence $F_{st}$ is concave and piecewise-linear. Therefore $\mathrm{ANF}$ (an average of concave functions) and $\lambda$ (a pointwise minimum of concave functions) are also concave.

#### 2.6 Subgradients

We record the standard subgradient characterization for pointwise minima of affine functions.

Lemma 2.1 (Subgradients of $F_{st}$). Fix $(s,t)$ and $\boldsymbol x\in\mathbb R_{\ge 0}^{E}$. Let

$$
\mathcal S^{\star}_{st}(\boldsymbol x):=\arg\min_{\substack{S\subseteq V\\ s\in S,\ t\notin S}}\chi_{\delta^{+}(S)}^{\top}\boldsymbol x.
\tag{2.8}
$$

Then

$$
\partial F_{st}(\boldsymbol x)=\operatorname{conv}\{\chi_{\delta^{+}(S)}:\ S\in\mathcal S^{\star}_{st}(\boldsymbol x)\}.
\tag{2.9}
$$

Proof. Since $F_{st}$ is the pointwise minimum of finitely many affine functions, its subdifferential is the convex hull of the gradients of the active affine pieces at $\boldsymbol x$. Here the gradients are exactly the indicator vectors $\chi_{\delta^{+}(S)}$ of minimizers. □

Corollary 2.2 (Subgradients of ANF). For any $\boldsymbol x$,

$$
\partial\mathrm{ANF}(\boldsymbol x)=\operatorname{conv}\left\{\frac{1}{n(n-1)}\sum_{s\ne t}\chi_{\delta^{+}(S_{st})}:
\ S_{st}\in\mathcal S^{\star}_{st}(\boldsymbol x)\ (\forall s\ne t)\right\}.
\tag{2.10}
$$

Corollary 2.3 (Subgradients of $\lambda$). For any $\boldsymbol x$, let $M(\boldsymbol x):=\operatorname{argmin}_{s\ne t}F_{st}(\boldsymbol x)$. Then

$$
\partial\lambda(\boldsymbol x)=\operatorname{conv}\left(\bigcup_{(\hat s,\hat t)\in M(\boldsymbol x)}\partial F_{\hat s\hat t}(\boldsymbol x)\right).
\tag{2.11}
$$

#### 2.7 Lipschitzness

Lemma 2.4 (Lipschitzness under $\ell_1$). For any $s\ne t$ and any $\boldsymbol x,\boldsymbol y\in\mathbb R_{\ge 0}^{E}$,

$$
\bigl|F_{st}(\boldsymbol x)-F_{st}(\boldsymbol y)\bigr|\le \|\boldsymbol x-\boldsymbol y\|_{1}.
\tag{2.12}
$$

In particular, both $\mathrm{ANF}$ and $\lambda$ are $1$-Lipschitz under $\ell_{1}$.

Proof. Fix any feasible cut $S$. Then

$$
\bigl|\chi_{\delta^{+}(S)}^{\top}(\boldsymbol x-\boldsymbol y)\bigr|\le \|\chi_{\delta^{+}(S)}\|_{\infty}\,\|\boldsymbol x-\boldsymbol y\|_{1}=\|\boldsymbol x-\boldsymbol y\|_{1}.
$$

Taking the minimum over feasible cuts (for both $\boldsymbol x$ and $\boldsymbol y$) preserves the bound and yields (2.12). The claims for $\mathrm{ANF}$ and $\lambda$ follow by averaging and taking the minimum, respectively. □

---

### 3．Exact polynomial-time algorithms via separation and ellipsoid

We give  epigraph formulations and exact polynomial-time algorithm in the Turing model using separation and the ellipsoid method.

#### 3.1 Epigraph LP (global min-cut)

Introduce a scalar variable $t$ to represent a lower bound on $\lambda(\boldsymbol x)$. The condition $\lambda(\boldsymbol x)\ge t$ is equivalent to requiring $F_{st}(\boldsymbol x)\ge t$ for every ordered pair $(s,t)$ with $s\ne t$. By (2.2), this holds if and only if, for every $s$--$t$ cut $S$, we have $\sum_{e\in\delta^{+}(S)} x_e\ge t$.

Theorem 3.1 (Epigraph LP for global min-cut maximization). The global min-cut maximization problem (2.7) is equivalent to the LP

$$
\begin{aligned}
\max\quad & t\\
\text{s.t.}\quad& t \le \sum_{e\in\delta^{+}(S)} x_e\qquad (\forall (s,t)\in V\times V,\ s\ne t,\ \forall S\subseteq V:\ s\in S,\ t\notin S),\\
& \boldsymbol x=\boldsymbol w + C\boldsymbol p,\\
& \sum_{e\in E} p_e \le 1,\quad p_e\ge 0\ (\forall e\in E).
\end{aligned}
\tag{3.1}
$$

Proof. From the equivalences above: $\lambda(\boldsymbol x)\ge t$ iff $F_{st}(\boldsymbol x)\ge t$ for all ordered pairs $(s,t)$, and $F_{st}(\boldsymbol x)\ge t$ iff all cut inequalities hold. □

#### 3.2 Epigraph LP (ANF)

Theorem 3.2 (Epigraph LP for ANF maximization). The ANF maximization problem (2.6) is equivalent to the LP

$$
\begin{aligned}
\max\quad & \frac{1}{n(n-1)}\sum_{s\ne t} y_{st}\\
\text{s.t.}\quad& y_{st}\le \sum_{e\in\delta^{+}(S)} x_e\qquad (\forall (s,t)\in V\times V,\ s\ne t,\ \forall S\subseteq V:\ s\in S,\ t\notin S),\\
& \boldsymbol x=\boldsymbol w + C\boldsymbol p,\\
& \sum_{e\in E} p_e \le 1,\quad p_e\ge 0\ (\forall e\in E).
\end{aligned}
\tag{3.2}
$$

Proof. Introduce epigraph variables $y_{st}\le F_{st}(\boldsymbol x)$ and use (2.2) to replace each such constraint by the family of linear inequalities $y_{st}\le\sum_{e\in\delta^{+}(S)}x_e$ for all $s$-$t$ cuts $S$. □

#### 3.3 Separation oracle

Lemma 3.3 (Separation oracle). There exists a polynomial-time separation oracle for the cut constraints in (3.1) and (3.2). In particular, given $(\boldsymbol x,t)$ and a fixed ordered pair $(s,t)$, one max-flow/min-cut computation either certifies that all $s$--$t$ cut constraints are satisfied or returns a violated cut constraint.

Proof. Compute $F_{st}(\boldsymbol x)$ by max-flow/min-cut. If $F_{st}(\boldsymbol x)\ge t$, then by definition of $F_{st}$, all $s$--$t$ cuts have capacity at least $t$, hence all constraints hold. If $F_{st}(\boldsymbol x)<t$, let $S^{\star}\in\operatorname{argmin}_{S}\sum_{e\in\delta^{+}(S)}x_e$. Then the inequality $t\le\sum_{e\in\delta^{+}(S^{\star})}x_e$ is violated. □

#### 3.4 Exact polynomial-time solvability (Turing model)

Theorem 3.4 (Exact polynomial-time solvability; standard). Assume all input data are rational. Then the LPs (3.1) and (3.2) can be solved exactly in time polynomial in $(n,m)$ and the bit-length of the input.

Proof sketch. Combine: (i) polynomial-time separation (Lemma 3.3), (ii) boundedness of the feasible region (immediate from $\boldsymbol p\ge 0$ and $\|\boldsymbol p\|_1\le 1$), and (iii) a standard polynomial bound on the encoding length of an optimal basic solution for rational LPs. Then apply the Grötschel–Lovász–Schrijver equivalence between separation and optimization for bounded rational polytopes (implemented via the ellipsoid method). □

---

### 4．A unified game view and fast algorithms

This section reorganizes the MWU-based approximation algorithms around a meta viewpoint: our objectives admit a natural zero-sum game formulation, and MWU arises as a no-regret dynamic for the Max player. The algorithm is then obtained by instantiating a single oracle interface with min-cut / max-flow primitives.

#### 4.1 Meta formulation: a zero-sum game with oracle-defined payoff

We parameterize the augmentation by a distribution $\boldsymbol p\in\Delta^{E}$ and define capacities $\boldsymbol x(\boldsymbol p):=\boldsymbol w+C\boldsymbol p$.

We consider a Min player whose pure actions encode cut certificates. Let

$$
\mathcal A:=\{(s,t,S): s\ne t,\ S\subseteq V,\ s\in S,\ t\notin S\},
\qquad c_{(s,t,S)}:=\chi_{\delta^{+}(S)}\in\{0,1\}^{E}.
\tag{4.1}
$$

Define the payoff (Min minimizes, Max maximizes)

$$
\nu(\boldsymbol p; a):=\langle c_a,\boldsymbol x(\boldsymbol p)\rangle
=\langle c_a,\boldsymbol w\rangle + C\langle c_a,\boldsymbol p\rangle.
\tag{4.2}
$$

Then the global min-cut objective can be written as a game value:

$$
\max_{\boldsymbol p\in\Delta^{E}}\ \min_{a\in\mathcal A}\ \nu(\boldsymbol p;a)
\;=\;\max_{\boldsymbol p\in\Delta^{E}}\ \lambda\bigl(\boldsymbol w+C\boldsymbol p\bigr).
\tag{4.3}
$$

Allowing Min to use a mixed strategy $q\in\Delta(\mathcal A)$ gives the equivalent saddle-point form

$$
\max_{\boldsymbol p\in\Delta^{E}}\ \min_{q\in\Delta(\mathcal A)}\ \mathbb E_{a\sim q}\bigl[\nu(\boldsymbol p;a)\bigr].
\tag{4.4}
$$

This mixed-strategy view is also the cleanest way to explain why expectations naturally appear in some guarantees.

Game interpretation (objectives as game values). Equation (4.3) shows that the global min-cut augmentation problem is exactly the value of a zero-sum game: Max chooses $\boldsymbol p$ (how to allocate the budget across edges), while Min responds with a certificate $a=(s,t,S)$ (a worst pair and a minimum cut). For ANF, the objective is an average of the same per-pair min-cut values, so it is natural to allow Min to randomize over certificates, which yields the expectation form (4.4).

Remark (relative strength for global min-cut). For the global min-cut objective, this MWU/game formulation should be viewed mainly as a unifying viewpoint with the ANF case. In particular, one can also obtain strong (often faster, relative-error type) guarantees for positive LPs via mixed packing/covering algorithms (e.g. Quanrud's framework), so the main added value here is the common oracle-based game perspective.

#### 4.2 From the game to an algorithm

We now turn this game view into an MWU-based approximation algorithm.

- Max maintains $\boldsymbol p_t\in\Delta^{E}$.
- Min returns a certificate $a_t=(s_t,t_t,S_t)\in\mathcal A$ and hence a loss / subgradient vector. In the ANF instantiation, $(s_t,t_t)$ is sampled uniformly and then $S_t$ is computed as an exact $s_t$--$t_t$ minimum cut for the current capacities.
    
    $$
    																																																											\boldsymbol g_t:=-C\,c_{a_t}=-C\,\chi_{\delta^{+}(S_t)}.
    \tag{4.5}
    $$
    
- Max updates $\boldsymbol p_{t+1}$ by MWU (mirror descent with negative entropy):
    
    $$
    																																																											p_{t+1}(e)=\frac{p_t(e)\exp(-\eta g_t(e))}{\sum_{e'\in E} p_t(e')\exp(-\eta g_t(e'))}.
    \tag{4.6}
    $$
    
- Output the average $\bar{\boldsymbol p}:=\frac1T\sum_{t=1}^{T}\boldsymbol p_t$.

We will use the following MWU guarantee as a black box.

Theorem 4.1 (MWU / entropic mirror descent with stochastic subgradients). Let $f:\Delta^{E}\to\mathbb R$ be convex. Consider the MWU update

$$
p_{t+1}(e)=\frac{p_t(e)\exp(-\eta g_t(e))}{\sum_{e'\in E} p_t(e')\exp(-\eta g_t(e'))}
\qquad (t=1,\dots,T),
$$

with some initialization $p_1\in\Delta^{E}$ (e.g. uniform), and define the average iterate $\bar{\boldsymbol p}:=\frac1T\sum_{t=1}^{T}\boldsymbol p_t$.

Assume the (possibly random) vectors $\boldsymbol g_t\in\mathbb R^{E}$ satisfy:

1. (Unbiased subgradient) $\mathbb E[\boldsymbol g_t\mid \boldsymbol p_t]\in\partial f(\boldsymbol p_t)$ for each $t$.
2. (Boundedness) $\|\boldsymbol g_t\|_{\infty}\le G$ almost surely for each $t$.
3. (Step size) $\eta G\le 1$.

Then for any comparator $\boldsymbol p^{\star}\in\Delta^{E}$,

$$
\mathbb E\bigl[f(\bar{\boldsymbol p})-f(\boldsymbol p^{\star})\bigr]
\le \frac{D_{\mathrm{KL}}(\boldsymbol p^{\star}\Vert \boldsymbol p_1)}{\eta T}+\frac{\eta G^{2}}{2}.
\tag{4.7}
$$

In particular, if $p_1$ is uniform then $D_{\mathrm{KL}}(p^{\star}\Vert p_1)\le \log m$, hence

$$
\mathbb E\bigl[f(\bar{\boldsymbol p})-f(\boldsymbol p^{\star})\bigr]
\le \frac{\log m}{\eta T}+\frac{\eta G^{2}}{2}
\le G\sqrt{\frac{2\log m}{T}}.
\tag{4.8}
$$

Proof. Define the KL divergence

$$
D_{\mathrm{KL}}(u\Vert v)=\sum_{e\in E} u(e)\log\frac{u(e)}{v(e)}.
$$

The MWU update is entropic mirror descent, i.e.,

$$
\boldsymbol p_{t+1}=\arg\min_{p\in\Delta^{E}}\ \Bigl\{\eta\langle \boldsymbol g_t,p\rangle + D_{\mathrm{KL}}(p\Vert \boldsymbol p_t)\Bigr\}.
$$

The standard mirror descent one-step inequality implies that for every $p^{\star}\in\Delta^{E}$,

$$
\langle \boldsymbol g_t,\boldsymbol p_t-\boldsymbol p^{\star}\rangle
\le \frac{D_{\mathrm{KL}}(\boldsymbol p^{\star}\Vert \boldsymbol p_t)-D_{\mathrm{KL}}(\boldsymbol p^{\star}\Vert \boldsymbol p_{t+1})}{\eta}
\;+\;\frac{\eta}{2}\|\boldsymbol g_t\|_{\infty}^{2}.
$$

Summing over $t=1,\dots,T$ and telescoping yields

$$
\sum_{t=1}^{T}\langle \boldsymbol g_t,\boldsymbol p_t-\boldsymbol p^{\star}\rangle
\le \frac{D_{\mathrm{KL}}(\boldsymbol p^{\star}\Vert \boldsymbol p_1)}{\eta}+\frac{\eta T G^{2}}{2}.
$$

Now use convexity of $f$ and the unbiased-subgradient assumption: since $\mathbb E[\boldsymbol g_t\mid \boldsymbol p_t]\in\partial f(\boldsymbol p_t)$,

$$
f(\boldsymbol p_t)-f(\boldsymbol p^{\star})
\le \bigl\langle \mathbb E[\boldsymbol g_t\mid \boldsymbol p_t],\boldsymbol p_t-\boldsymbol p^{\star}\bigr\rangle
= \mathbb E\bigl[\langle \boldsymbol g_t,\boldsymbol p_t-\boldsymbol p^{\star}\rangle\mid \boldsymbol p_t\bigr].
$$

Taking expectations and summing gives

$$
\mathbb E\Bigl[\sum_{t=1}^{T}\bigl(f(\boldsymbol p_t)-f(\boldsymbol p^{\star})\bigr)\Bigr]
\le \frac{D_{\mathrm{KL}}(\boldsymbol p^{\star}\Vert \boldsymbol p_1)}{\eta}+\frac{\eta T G^{2}}{2}.
$$

Finally, by Jensen's inequality and convexity of $f$,

$$
f(\bar{\boldsymbol p})\le \frac1T\sum_{t=1}^{T} f(\boldsymbol p_t),
$$

so dividing by $T$ yields (4.7). □

#### 4.3 Oracle interface and stochasticity (why expectations appear)

ANF is deterministic,

$$
\mathrm{ANF}(\boldsymbol x)=\frac{1}{n(n-1)}\sum_{s\ne t}F_{st}(\boldsymbol x),
$$

but computing a full subgradient by averaging over all pairs is expensive. Instead, we sample one ordered pair $(s,t)$ uniformly at each iteration and compute an exact $s$--$t$ minimum cut for the current capacities. The only randomness is in the choice of the pair $(s,t)$; conditional on $(s,t)$ and $\boldsymbol p_t$, the returned cut is a (deterministically computed) minimum cut for that pair. Below we make the “subgradient in expectation” condition explicit.

#### 4.3.1 Unbiased subgradient estimator for ANF

Let $f_{\mathrm{ANF}}(\boldsymbol p):=-\mathrm{ANF}(\boldsymbol w+C\boldsymbol p)$. For a fixed ordered pair $(s,t)$, choose any minimum cut $S^{\star}\in\mathcal S^{\star}_{st}(\boldsymbol x)$ for $\boldsymbol x=\boldsymbol w+C\boldsymbol p$. By Lemma 2.1 and the chain rule,

$$
\hat{\boldsymbol g}(\boldsymbol p;s,t):=-C\,\chi_{\delta^{+}(S^{\star}_{st}(\boldsymbol x(\boldsymbol p)))}\in\partial\bigl(-F_{st}(\boldsymbol w+C\boldsymbol p)\bigr).
$$

Now sample $(s_t,t_t)$ uniformly and set $\hat{\boldsymbol g}_t:=\hat{\boldsymbol g}(\boldsymbol p_t;s_t,t_t)$. Then Corollary 2.2 implies

$$
\mathbb E\bigl[\hat{\boldsymbol g}_t\mid \boldsymbol p_t\bigr]\in \partial f_{\mathrm{ANF}}(\boldsymbol p_t),
\qquad
\|\hat{\boldsymbol g}_t\|_{\infty}\le C.
$$

Equivalently, with respect to the filtration $\mathcal F_t$ generated by the past randomness and iterates,

$$
\mathbb E\bigl[\hat{\boldsymbol g}_t\mid \mathcal F_t\bigr]\in \partial f_{\mathrm{ANF}}(\boldsymbol p_t),
$$

which is the hypothesis needed to invoke Theorem 4.1.

#### 4.3.2 Convergence guarantee for ANF (MWU with unbiased subgradients)

We now state and prove the standard convergence guarantee for the stochastic ANF oracle in this setup.

Theorem 4.2 (ANF MWU convergence; additive error, in expectation). Let

$$
f_{\mathrm{ANF}}(\boldsymbol p):=-\mathrm{ANF}\bigl(\boldsymbol w+C\boldsymbol p\bigr)
\qquad (\boldsymbol p\in\Delta^{E}).
$$

Run MWU as in (4.6) for $T$ rounds, and in each round return the stochastic oracle vector $\hat{\boldsymbol g}_t$ from Section 4.3.1. Then

$$
\mathbb E\bigl[\mathrm{ANF}(\boldsymbol w+C\bar{\boldsymbol p})\bigr]
\ge
\max_{\boldsymbol p\in\Delta^{E}}\mathrm{ANF}(\boldsymbol w+C\boldsymbol p)
\;-\; C\sqrt{\frac{2\log m}{T}}.
\tag{4.9}
$$

In particular, to obtain $\varepsilon$-additive accuracy in expectation, it suffices to take

$$
T=\Theta\!\left(\frac{C^{2}\log m}{\varepsilon^{2}}\right).
$$

Proof. Since $\mathrm{ANF}$ is concave in $\boldsymbol x$ and $\boldsymbol x(\boldsymbol p)=\boldsymbol w+C\boldsymbol p$ is affine in $\boldsymbol p$, the function $f_{\mathrm{ANF}}(\boldsymbol p)=-\mathrm{ANF}(\boldsymbol w+C\boldsymbol p)$ is convex over $\Delta^{E}$. By Section 4.3.1 we have the unbiased subgradient condition

$$
\mathbb E[\hat{\boldsymbol g}_t\mid \boldsymbol p_t]\in \partial f_{\mathrm{ANF}}(\boldsymbol p_t),
$$

and the uniform bound $\|\hat{\boldsymbol g}_t\|_{\infty}\le C$.

Therefore we can apply Theorem 4.1 with $f=f_{\mathrm{ANF}}$ and $G=C$, which gives for every comparator $\boldsymbol p^{\star}\in\Delta^{E}$,

$$
\mathbb E\bigl[f_{\mathrm{ANF}}(\bar{\boldsymbol p})-f_{\mathrm{ANF}}(\boldsymbol p^{\star})\bigr]
\le
C\sqrt{\frac{2\log m}{T}}.
$$

Choosing $\boldsymbol p^{\star}$ as an optimizer of $\mathrm{ANF}(\boldsymbol w+C\boldsymbol p)$ (equivalently, a minimizer of $f_{\mathrm{ANF}}$) and substituting the definition of $f_{\mathrm{ANF}}$ yields (4.9). □

#### 4.4 Instantiation I: global min-cut oracle (deterministic best response)

Define

$$
\phi(\boldsymbol p):=-\lambda\bigl(\boldsymbol w+C\boldsymbol p\bigr).
\tag{4.10}
$$

Given $\boldsymbol p$, compute a worst pair

$$
(\hat s,\hat t)\in\arg\min_{s\ne t}F_{st}\bigl(\boldsymbol w+C\boldsymbol p\bigr),
\tag{4.11}
$$

and an associated minimum cut $S^{\star}\in\mathcal S^{\star}_{\hat s\hat t}(\boldsymbol w+C\boldsymbol p)$. Return

$$
\boldsymbol g:=-C\,\chi_{\delta^{+}(S^{\star})}.
\tag{4.12}
$$

By Corollary 2.3 and the chain rule, $\boldsymbol g\in\partial\phi(\boldsymbol p)$ and $|\boldsymbol g|_{\infty}\le C$.

Applying Theorem 4.1 with $f=\phi$ and $G=C$ yields an $\varepsilon$-additive approximation in expectation (the expectation is redundant here since the oracle is deterministic).

#### 4.5 Instantiation II: ANF oracle (stochastic sampling)

Define the convex objective

$$
f_{\mathrm{ANF}}(\boldsymbol p):=-\mathrm{ANF}\bigl(\boldsymbol w+C\boldsymbol p\bigr).
\tag{4.13}
$$

Given $\boldsymbol p$, sample an ordered pair $(s,t)$ uniformly from $\{(s,t): s\ne t\}$, compute an $s$--$t$ minimum cut $S^{\star}\in\mathcal S^{\star}_{st}(\boldsymbol w+C\boldsymbol p)$, and return

$$
\boldsymbol g:=-C\,\chi_{\delta^{+}(S^{\star})}.
\tag{4.14}
$$

By Corollary 2.2, this procedure produces an unbiased estimator of a subgradient of $f_{\mathrm{ANF}}$, i.e., $\mathbb E[\boldsymbol g\mid \boldsymbol p]\in\partial f_{\mathrm{ANF}}(\boldsymbol p)$, and $\|\boldsymbol g\|_{\infty}\le C$*. Applying Theorem 4.1 with* $f=f_{\mathrm{ANF}}$ and $G=C$ yields the stated additive approximation guarantee in expectation.

#### 4.6 Time complexity summary

Let $T$ be the number of MWU iterations. The generic bound in Theorem 4.1 implies

$$
T=\Theta\left(\frac{C^{2}\log m}{\varepsilon^{2}}\right)
$$

for $\varepsilon$-additive accuracy.

- ANF. Each iteration makes one $s$--$t$ min-cut computation. If $T_{\mathrm{maxflow}}$ denotes the time of one max-flow/min-cut, then total time is
    
    $$
    																												O\bigl(T\cdot T_{\mathrm{maxflow}}\bigr)
    =O\left(\frac{C^{2}\log m}{\varepsilon^{2}}\cdot T_{\mathrm{maxflow}}\right).
    	\tag{4.15}
    $$
    
- Global min-cut. Each iteration computes a worst pair and an associated min-cut (cf. (4.11) and (4.12)). Let $T_{\mathrm{gmin}}$ denote the time of this combined oracle. Then total time is
    
    $$
    																												O\bigl(T\cdot T_{\mathrm{gmin}}\bigr)
    =O\left(\frac{C^{2}\log m}{\varepsilon^{2}}\cdot T_{\mathrm{gmin}}\right).
    	\tag{4.16}
    $$
    

We keep $T_{\mathrm{maxflow}}$ and $T_{\mathrm{gmin}}$ symbolic to isolate graph-structure dependence; they can be expanded by plugging in a concrete max-flow algorithm.

#### 4.7 Remark: choosing $\varepsilon$ and the induced iteration complexity

Observation from Proposition 2.5. There exist instances where the objective value scale is at most $\Theta(C/n)$. For example, when $w=0$, Corollary 2.6 implies

$$
\max_{\|p\|_1\le 1}\ \mathrm{ANF}(Cp)\le \frac{2C}{n}.
$$

Thus, if one aims for a nontrivial additive guarantee (e.g., a constant-factor accuracy relative to the optimum scale in such instances), it is natural to set

$$
\varepsilon = \Theta(C/n),\qquad \text{e.g., }\varepsilon = kC/n\ \ (0<k<1).
$$

Substituting $\varepsilon = kC/n$ into the generic MWU iteration bound $T=\Theta(C^2\log m/\varepsilon^2)$ yields

$$
T
=\Theta\!\left(\frac{C^2\log m}{(k^2C^2/n^2)}\right)
=\Theta\!\left(\frac{n^2\log m}{k^2}\right)
=\Theta(n^2\log m).
$$

Therefore, targeting an additive accuracy that scales as $\Theta(C/n)$ can force the number of MWU iterations to scale as $\Theta(n^2\log m)$ in the worst case.

Global min-cut. A similar scaling can occur for the global min-cut objective. By Proposition 2.7, for any $\boldsymbol x$,

$$
\lambda(\boldsymbol x)\le \frac{1}{n}\sum_{e\in E} x_e.
$$

In particular, when $w=0$ and $\boldsymbol x=C\boldsymbol p$ with $\|p\|_1\le 1$, we have

$$
\max_{\|p\|_1\le 1}\ \lambda(C\boldsymbol p)
\le \frac{1}{n}\sum_{e\in E} Cp_e
\le \frac{C}{n}.
$$

Thus, for instances where the optimum global min-cut value is $\Theta(C/n)$, a nontrivial additive accuracy again suggests setting $\varepsilon=\Theta(C/n)$, which leads to the same iteration scaling $T=\Theta(n^2\log m)$.
