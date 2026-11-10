---
layout: post
title: "A PPT-entangled and 2-extendible 2-qutrit state"
permalink: /ppt_entangled_two_extendible/
date: 2026-11-10
description: "Post describing a PPT-entangled, 2-extendible 2-qutrit state, showing that the intersection of PPT and 2-extendible (or equivalently, antidegradable) states strictly contains the set of separable states."
tags: research
---

Let $$\lbrace \ket{0},\ket{1},\ket{2}\rbrace$$ be the computational basis of a qutrit system, and consider the following quantum state on two qutrits defined in {% cite horodecki1999bound --file ppt --style ieee %}:

<div markdown="0">
\begin{align*}
\rho &= \frac{2}{7} \ket{\psi}\bra{\psi} + \frac{1}{2} \sigma_+ + \frac{3}{14}\sigma_-,\\
\text{where}\quad \ket{\psi} &= \frac{1}{\sqrt{3}} (\ket{00}+\ket{11}+\ket{22})\\
\sigma_+ &= \frac{1}{3} (\ket{01}\bra{01}+\ket{12}\bra{12}+\ket{20}\bra{20})\\
\sigma_- &= \frac{1}{3} (\ket{10}\bra{10}+\ket{21}\bra{21}+\ket{02}\bra{02}),
\end{align*}
</div>

<details markdown="1">
<summary>(Click for a matrix form of ρ)</summary>

<div markdown="0">
\begin{align*}
\rho = \begin{pmatrix} 2/21 &   . &    . &    . & 2/21 &   . &   . &    . & 2/21\\ 
			  . & 1/6 &    . &    . &    . &   . &   . &    . & .   \\
			  . &   . & 1/14 &    . &    . &   . &   . &    . & .   \\
		  	  . &   . &    . & 1/14 &    . &   . &   . &    . & .   \\
		       2/21 &   . &    . &    . & 2/21 &   . &   . &    . & 2/21\\ 
		          . &   . &    . &    . &    . & 1/6 &   . &    . & .   \\
		          . &   . &    . &    . &    . &   . & 1/6 &    . & .   \\
		          . &   . &    . &    . &    . &   . &   . & 1/14 & .   \\
		       2/21 &   . &    . &    . & 2/21 &   . &   . &    . & 2/21
\end{pmatrix}. 
\end{align*}
</div>

</details>

The state $$\rho$$ is PPT and entangled by the results of {% cite horodecki1999bound --file ppt --style ieee %}.

To construct a (symmetric) 2-extension of $$\rho$$, consider the following vectors that are symmetric in the 2nd and 3rd system:

<div markdown="0">
\begin{align*}
\ket{\chi_0} &= \ket{0}\otimes\ket{00} + \ket{1}\otimes(\ket{01}+\ket{10})+\ket{2}\otimes(\ket{02}+\ket{20})\\
\ket{\chi_1} &= \ket{0}\otimes(\ket{01}+\ket{10}) + \ket{1}\otimes\ket{11} + \ket{2}\otimes(\ket{12}+\ket{21})\\
\ket{\chi_2} &= \ket{0}\otimes(\ket{02}+\ket{20})+\ket{1}\otimes(\ket{12}+\ket{21})+\ket{2}\otimes\ket{22}.
\end{align*}
</div>

The following state $$\Omega$$ is symmetric in the second and third system and satisfies $$\operatorname{tr}_2 \Omega = \operatorname{tr}_3 \Omega = \rho$$, thus giving a symmetric 2-extension of $$\rho$$:

<div markdown="0">
\begin{align*}
\Omega &= \frac{2}{63}(\ket{\chi_0}\bra{\chi_0} + \ket{\chi_1}\bra{\chi_1} + \ket{\chi_2}\bra{\chi_2})\\
& \quad {} + \frac{17}{126} (\ket{011}\bra{011} + \ket{122}\bra{122} + \ket{200}\bra{200})\\
& \quad {} + \frac{5}{126} (\ket{100}\bra{100} + \ket{211}\bra{211} + \ket{022}\bra{022}).
\end{align*}
</div>

The marginal of $$\rho$$ on the first system is maximally mixed, and thus $$\rho$$ is a bona fide Choi state.
Since a channel is antidegradable if and only if its Choi operator is 2-extendible {% cite myhr2010symmetric --file ppt --style ieee %}, the operator $$\rho$$ is in fact the Choi state of a channel that is PPT and antidegradable, but not entanglement-breaking. 

### References

<div class="publications">
{% bibliography --file ppt --style ieee --group_by none --cited_in_order --template bib_post %}
</div>