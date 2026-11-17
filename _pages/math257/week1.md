---
layout: math257
title: "Math 257 Week 1"
permalink: /math257/week1/
next_week: 2
---

<div class="math257-text" markdown="1">
## Linear systems

Some text with _markdown_. And math: $$ax+by+cz=0$$
</div>

<math257-plane-system-3d></math257-plane-system-3d>

<div class="math257-text" markdown="1">
## Solving systems

We will now solve the following system of linear equations:

<div markdown="0">
\begin{equation}
\begin{aligned}
\phantom{2}x \quad+\phantom{3}y \quad \phantom{ {} + 0z} \quad &= \quad3\\
\phantom{2}x \quad+ 3y \quad-2z \quad&= \quad7\\
2x\quad - \phantom{3}y \quad  +3z \quad &= \quad0.
\end{aligned}
\label{eq:system}
\begin{equation}
</div>

The augmented matrix of this system is

$$
\left(\begin{array}{c|c} A & \mathbf{b}\end{array}\right) = \left(\begin{array}{ccc|c} 1&\phantom{-}1&\phantom{-}0&3\\1&\phantom{-}3&-2&7\\2&-1&\phantom{-}3&0 \end{array}\right).
$$

</div>

<math257-row-reduction-3d></math257-row-reduction-3d>

<div class="math257-text" markdown="1">
The row-reduced echelon form of the system \eqref{eq:system} is

$$
\newcommand{\collabel}[2]{\smash{\begin{array}[b]{@{}c@{}}#1\\[0.6ex]#2\end{array}}}
\left( \begin{array}{ccc|c} \collabel{x_1} & \collabel{x_2} & \collabel{x_3}\\ 1 & 0 & \phantom{-}1 & 1\\0 & 1 & -1 & 2\\0 & 0 & \phantom{-}0 & 0 \end{array} \right)
$$
</div>