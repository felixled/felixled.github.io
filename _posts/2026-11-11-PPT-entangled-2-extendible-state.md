---
layout: post
title: A PPT-entangled and 2-extendible 2-qutrit state
permalink: /ppt_entangled_two_extendible/
date: 2026-11-11
description: "Post describing a PPT-entangled, 2-extendible 2-qutrit state, showing that the intersection of PPT and 2-extendible (or equivalently, antidegradable) states strictly contains the set of separable states.
tags: research
---

Let $$\lbrace \ket{0},\ket{1},\ket{2}\rbrace$$ be the computational basis of a qutrit system, and consider the following quantum state on two qutrits defined in {% cite horodecki1999bound --file ppt --style ieee %}:

<div markdown="0">
\begin{align}
\rho &= \frac{2}{7} \ket{\psi}bra{\psi} + \frac{1}{2} \sigma_+ + \frac{3}{14}\sigma_-\\
\text{where}\quad \ket{\psi} &= \frac{1}{\sqrt{3}} (\ket{00}+\ket{11}+\ket{22})\\
\sigma_+ &= \frac{1}{3} (\ket{01}\bra{01}+\ket{12}\bra{12}_\ket{20}\bra{20})\\
\sigma_- &= \frac{1}{3} (\ket{10}\bra{10}+\ket{21}\bra{21}+\ket{02}\bra{02}).
\label{eq:state}
\end{align}
</div>

This state is PPT and entangled by the results of {% cite horodecki1999bound --file ppt --style ieee %}.

To construct a (symmetric) 2-extension of $$\rho$$, we first consider the following vectors that are symmetric in the 2nd and 3rd system:

<div markdown="0">
\begin{align}
\ket{\chi_0} &= \ket{0}\otimes\ket{00} + \ket{1}\otimes(\ket{01}+\ket{10})+\ket{2}\otimes(\ket{02}+
ket{20})\\
\ket{\chi_1} &= \ket{0}\otimes(\ket{01}+\ket{10}) + \ket{1}\otimes\ket{1} + \ket{2}\otimes(\ket{12}+
ket{21})\\
\ket{chi_2} &= \ket{0}\otimes(\ket{02}+\ket{20})+\ket{1}\otimes(\ket{12}+\ket{21})+\ket{2}\otimes\ket{22}.
\end{align}
</div>

### References

<div class="publications">
{% bibliography --file ppt --style ieee --group_by none --cited_in_order --template bib_post %}
</div>