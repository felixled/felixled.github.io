---
layout: post
title: Mixed Schur-Weyl duality in port-based teleportation
permalink: /mixed_sw/
date: 2026-11-06
description: Post describing the simple setting of mixed Schur-Weyl duality that is relevant in port-based teleportation and a recent paper on data hiding schemes.
tags: research
---

In this post I will give an introduction to $$(p,q)$$-mixed Schur-Weyl duality in the simple case of $$(p,q)=(n-1,1)$$, which is the relevant one for port-based teleportation {% cite ishizaka2008asymptotic ishizaka2009quantum --file pbt --style ieee %}, and has also been used recently to discuss data hiding schemes {% cite akresh2026tight --file pbt --style ieee %}. 
The discussion is mainly based on the exposition in {% cite christandl2021asymptotic fei2023efficientquantumalgorithmportbased --file pbt --style ieee %}. 

Our starting point is to consider a quantum state on $n$ quantum systems of local dimension $d$ of the form

$$
\rho = \sum_{i=1}^{n-1} \Phi^+_{in} \otimes \mathbb{I}_{(in)^c},
$$

where $$|\Phi^+\rangle_{(ij)} = \sum_{\alpha=1}^d |\alpha\rangle_i \otimes |\alpha\rangle_j$$ denotes an unnormalized state on systems $$i$$ and $$j$$, and $$\mathbb{I}_{(in)^c}$$ denotes the identity on the $$n-2$$ systems $$1,\dots,n$$ excluding systems $$i,j$$.
Here we are using the common shorthand notation $$\psi\equiv |\psi\rangle\langle\psi|$$ for the rank-1 density matrix associated with a pure state.
I will be working with unnormalized states for cleaner exposition throughout, but of course all results hold by including normalization factors to obtain quantum states with unit trace.

The maximally entangled state $$|\Psi^+\rangle$$ has the unitary symmetry

$$
(U\otimes \overline{U})|\Psi^+\rangle = |\Psi^+\rangle \quad \text{for all unitaries $U$,}
$$

where the bar over an operator denotes entry-wise complex conjugation (defined with respect to the same basis used in the definition of $$|\Psi^+\rangle$$.

### References

<div class="publications">
{% bibliography --file pbt --style ieee --group_by none --cited_in_order --template bib_post %}
</div>