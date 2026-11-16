---
layout: page
title: Mixed Schur-Weyl duality in port-based teleportation
permalink: /mixed_sw/
date: 2026-11-06
description: Post describing the simple setting of mixed Schur-Weyl duality that is relevant in port-based teleportation and a recent paper on data hiding schemes.
tags: research
hidden: true
sitemap: false
toc:
  sidebar: left
---

**Table of contents**

* TOC
{:toc}

In this post I will give an introduction to $$(p,q)$$-mixed Schur-Weyl duality in the simple case of $$(p,q)=(n-1,1)$$, which is the relevant one for port-based teleportation (PBT) {% cite ishizaka2008asymptotic ishizaka2009quantum --file pbt --style ieee %}, and has also been used recently to discuss data hiding schemes {% cite akresh2026tight --file pbt --style ieee %}. 
The discussion is mainly based on the exposition in {% cite christandl2021asymptotic fei2023efficientquantumalgorithmportbased --file pbt --style ieee %}. 

## Identifying the symmetries of PBT

Our starting point is to consider a quantum state on $$n$$ quantum systems of local dimension $$d$$ of the form

<div markdown="0">
\begin{align}
\rho = \sum_{i=1}^{n-1} \Phi^+_{in} \otimes \mathbb{I}_{(in)^c},
\label{eq:pbt-operator}
\end{align}
</div>

where $$\ket{\Phi^+}_{(in)} = \sum_{\alpha=1}^d \ket{\alpha}_i \otimes \ket{\alpha}_n$$ denotes an unnormalized state on systems $$i$$ and $$n$$, and $$\mathbb{I}_{(in)^c}$$ denotes the identity on the $$n-2$$ systems $$1,\dots,n$$ excluding systems $$i,n$$ 
<a href="javascript:void(0)" onclick="var e=document.getElementById('step0'); e.hidden=!e.hidden;">(a note on notation)</a><span id="step0" style="font-style: italic;" hidden> [Here we are using the common shorthand notation $$\psi\equiv \ket{\psi}\bra{\psi}$$ for the rank-1 density matrix associated with a pure state $$\ket{\psi}$$. We will be working with unnormalized states for cleaner exposition throughout, but of course all results hold by including normalization factors to obtain quantum states with unit trace.]</span>.
The quantum state in \eqref{eq:pbt-operator} is actually proportional to the average state in the state discrimination problem at the heart of port-based teleportation {% cite ishizaka2008asymptotic ishizaka2009quantum --file pbt --style ieee %}, in the sense that teleporting a state using a PBT protocol is mathematically equivalent to distinguishing the $$n-1$$ states appearing in the linear combination in \eqref{eq:pbt-operator} and visualized in [Figure 1](#fig:pbt).
This is an instance of a more general correspondence between teleportation protocols and quantum state discrimination discussed in {% cite chitambar2024teleportation --file pbt --style ieee %}.

<div id="fig:pbt" class="post-figure" markdown="0">
{% include figure.liquid path="assets/img/posts/pbt_state.png" class="img-fluid rounded z-depth-1" caption="Figure 1: Graphical representation of the states appearing in the superposition making up the state $\rho$ in \eqref{eq:pbt-operator}." zoomable=true %}
</div>

The maximally entangled state $$\ket{\Phi^+}$$ has the unitary symmetry

<div markdown="0">
\begin{align}
(U\otimes \overline{U})\ket{\Phi^+} = \ket{\Phi^+} \quad \text{for all unitaries $U$,}
\label{eq:Phi-U-invariance}
\end{align}
</div>

where the bar over an operator denotes entry-wise complex conjugation (defined with respect to the same basis used in the definition of $$\ket{\Phi^+}$$) 
<a href="javascript:void(0)" onclick="var e=document.getElementById('step1'); e.hidden=!e.hidden;">(proof of \eqref{eq:Phi-U-invariance})</a><span id="step1" style="font-style: italic;" hidden> [The maximally entangled state satisfies the *transpose trick identity* $$(X\otimes \mathbb{I})\ket{\Phi^+} = (\mathbb{I}\otimes X^T)\ket{\Phi^+}$$, valid for all operators $$X$$. This identity can be easily checked by expanding $$X$$ in terms of the basis $$\lbrace\ket{\alpha}\rbrace$$. Applying this to the action of $$U\otimes \overline{U}$$ on the maximally entangled state, we get $$(U\otimes \overline{U})\ket{\Phi^+} = (U \overline{U}^T\otimes \mathbb{I})\ket{\Phi^+} = (U U^\dagger\otimes \mathbb{I})\ket{\Phi^+} = \ket{\Phi^+},$$ which proves the claim.]</span>.
The operator $$\rho$$ in \eqref{eq:pbt-operator} is a linear combination of states that each maximally entangle one of the first $$n-1$$ systems with the last $$n$$-th one, as depicted in [Figure 1](#fig:pbt). 
Thus, the relation \eqref{eq:Phi-U-invariance} equips $$\rho$$ with a $$(U^{\otimes n-1}\otimes\overline{U})$$-symmetry.
Furthermore, $$\rho$$ is invariant under permuting the first $$n-1$$ systems, since it is a _uniform_ superposition over all maximally entangled states between one of those systems and the marked $$n$$-th one.
To summarize, $$\rho$$ has the symmetries

<div markdown="0">
\begin{equation}
\begin{aligned}
{}[\rho,U^{\otimes n-1}\otimes\overline{U}] &= 0 \quad\forall U\in\mathcal{U}_d,\\
{}[\rho,P_d(\pi)] &= 0 \quad \forall \pi\in\mathcal{S}_{n-1},
\end{aligned}
\label{eq:pbt-symmetries}
\end{equation}
</div>

where the symmetric group $$\mathcal{S}_{n-1}$$ acts by permuting the first $$n-1$$ systems of $$(\mathbb{C}^d)^{\otimes n}$$, which we denote by $$\pi\mapsto P_d(\pi)$$. <a href="javascript:void(0)" onclick="var e=document.getElementById('step2'); e.hidden=!e.hidden;">(Note on $$P_d(\pi)$$.)</a><span id="step2" style="font-style: italic;" hidden>  [$$P_d(\pi)$$ is defined as the permutation operator mapping $$\ket{v_1}\otimes \dots\otimes \ket{v_n}$$ to $$\ket{v_{\pi^{-1}(1)}}\otimes\dots\otimes \ket{v_{\pi^{-1}(n)}}$$, acting on the full space $$(\mathbb{C}^d)^{\otimes n}$$. Since $$\pi$$ is in the symmetric group $$\mathcal{S}_{n-1}$$, it fixes $$n$$ and hence $$P_d(\pi)$$ acts trivially on the last factor in $$(\mathbb{C}^d)^{\otimes n}$$. One can write $$P_d(\pi) = P_d(\pi)'\otimes\mathbb{I}$$, with $$P_d(\pi)'$$ only acting on the first $$n-1$$ systems, to make this explicit, which for example is used in {% cite akresh2026tight --file pbt --style ieee %}.]</span>

The goal of this post is to derive an efficient representation-theoretic description of all operators $$\rho$$ satisfying the two symmetries in \eqref{eq:pbt-symmetries}.
We will first focus on the special case of qubits ($$d=2$$) in which we can make things explicit in a fairly straightforward way.
We will then describe the general case for arbitrary $$d$$.

## Qubits

### Warm-up: A single Bell pair ($$n=2$$)

In this simple case, we consider a single maximally entangled state, or Bell pair, on two qubits: $$\ket{\Phi^+} = \ket{00}+\ket{11}$$.
Our goal is to decompose the state space $$\mathbb{C}^2\otimes \mathbb{C}^2$$ into subspaces adapted to the representation $$U\mapsto U\otimes \overline{U}$$ of the qubit unitary group.
In representation-theoretic terms, the invariance property \eqref{eq:Phi-U-invariance} means that $$\ket{Phi^+}$$ spans a 1-dimensional _trivial_ representation of the unitary group.
There is actually a whole orthonormal basis for $$\mathbb{C}^2\otimes \mathbb{C}^2$$ consisting of $$\Phi^+$$ and three other maximally entangled vectors:
<div markdown="0">
\begin{equation}
\begin{aligned}
{}\ket{\Phi^+} &= \ket{00}+\ket{11}\\
\ket{\Phi^-} &= \ket{00}-\ket{11}\\
\ket{\Psi^+} &= \ket{01}+\ket{10}\\
\ket{\Psi^-} &= \ket{01}-\ket{10}.
\end{aligned}
\end{equation}
</div>
We can work out what the action of $$U\otimes \overline{U}$$ looks like on the remaining three basis vectors.
Letting $$U=\begin{pmatrix}a&b\\c&d\end{pmatrix}$$, we have the following action $$U\mapsto \phi_{(1,-1)}(U)$$ on the $$3$$-dimensional space $$V_{(1,-1)}^2$$ spanned by $$\ket{\Phi^-},\ket{\Psi^+},\ket{\Psi^-}$$:
<div markdown="0">
\begin{align}
\phi_{(1,-1)}(U) = \begin{pmatrix} |a|^2-|b|^2 & 2 \operatorname{Re}(a\overline{b}) & 2i\operatorname{Im}(a\overline{b})\\
2\operatorname{Re}(a\overline{c}) & \operatorname{Re}(a\overline{d}+b\overline{c}) & i\operatorname{Im}(a\overline{d}-b\overline{c})\\
2i \operatorname{Im}(a\overline{c}) & i\operatorname{Im}(a\overline{d}+b\overline{c}) & \operatorname{Re}(a\overline{d}-b\overline{c}).
\end{pmatrix}
\end{align}
</div>
It is not too hard to check that this is an _irreducible_ action of the unitary group on the subspace $$\operatorname{span}(\ket{\Phi^-},\ket{\Psi^+},\ket{\Psi^-})$$, since there are no non-trivial invariant subspaces. <a href="javascript:void(0)" onclick="var e=document.getElementById('step3'); e.hidden=!e.hidden;">(Exercise.)</a><span id="step3" style="font-style: italic;" hidden> [Take an arbitrary vector in the span of $$\ket{\Phi^-},\ket{\Psi^+},\ket{\Psi^-}$$ and show that you can generate a basis for the whole space $$V_{(1,-1)}^2$$ by applying suitable unitaries $$U$$ via $$\phi_{(1,-1)}$$.]</span>
Setting $$V_{(0,0)}^2 = \operatorname{span}(\ket{\Phi^+})$$, we thus have the following decomposition of the two-qubit space:
<div markdown="0">
\begin{equation}
\begin{aligned}
\mathbb{C}^2\otimes \mathbb{C}^2 &\cong V_{(0,0)}^2 \oplus V_{(1,-1)}^2\\
U\otimes \overline{U} &\cong \phi_{(0,0)}(U) \oplus \phi_{(1,-1)}(U),
\end{aligned}
\label{eq:two-qubits-decomposition}
\end{equation}
</div>
where $$\phi_{(0,0)}(U)$$ is the trivial representation.
The choice of notation using $$(0,0)$$ and $$(1,-1)$$ as subscripts will become clear in the following section.

### General case of $$n$$ qubits

We now generalize the decomposition in \eqref{eq:two-qubits-decomposition} from $$2$$ to $$n$$ qubits, using the state space $$(\mathbb{C}^2)^{\otimes n-1}\otimes \mathbb{C}^2$$ and the representation $$U\mapsto U^{\otimes n-1}\otimes \overline{U}$$.
For qubits there is a simple trick that lets us understand this representation fairly explicitly in terms of the much more common representation $$U\mapsto U^{\otimes n}$$.
To this end, we define the invertible matrix $$J=\left(\begin{smallmatrix}\phantom{-}0&1\\-1&0\end{smallmatrix}\right)$$.
An explicit calculation shows that

<div markdown="0">
\begin{align}
\overline{U} = \det(U)^{-1} J U J^{-1}.
\end{align}
</div>

## References

<div class="publications">
{% bibliography --file pbt --style ieee --group_by none --cited_in_order --template bib_post %}
</div>