---
layout: math257
title: "Math 257 Week 1"
permalink: /math257/week1/
next_week: 2
---

<div class="math257-text" markdown="1">
## Linear systems

A **linear equation** has the form

$$
a_1 x_1 + a_2 x_2 + \dots + a_n x_n = b,
$$

where $$a_i,b\in\mathbb{R}$$ are the **coefficients** of the equation, and the $$x_1,\dots,x_n$$ are the **variables**.

Geometrically, a single equation in $$n$$ variables $$x_1,\dots,x_n$$ represents the set of points on an (affine) **$$n-1$$-dimensional hyperplane** in $$\mathbb{R}^n$$.
The solution set of a system of $$m$$ linear equations corresponds geometrically to the intersection of these $$m$$ hyperplanes.

Let's inspect systems of $$3$$ equations in $$3$$ variables $$x_1,x_2,x_3$$ (or $$x,y,z$$).
</div>

<math257-plane-system-3d></math257-plane-system-3d>

<div class="math257-text" markdown="1">
## Solving systems
</div>

<div class="iclicker-question" markdown="1">

Suppose we perform

$$
R_2 \leftarrow R_2 - 3R_1.
$$

What happens geometrically?

**A.** The solution set changes.

**B.** Plane 1 changes.

**C.** Plane 2 changes, but the solution set does not.

**D.** All three planes remain unchanged.

</div>

<div class="math257-text" markdown="1">
We will now solve the following system of linear equations:

<div markdown="0">
\begin{equation}
\begin{aligned}
\phantom{2}x \quad+\phantom{3}y \quad \phantom{ {} + 0z} \quad &= \quad3\\
\phantom{2}x \quad+ 3y \quad-2z \quad&= \quad7\\
2x\quad - \phantom{3}y \quad  +3z \quad &= \quad0.
\end{aligned}
\label{eq:system}
\end{equation}
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
\left( \begin{array}{ccc|c} 1 & 0 & \phantom{-}1 & 1\\0 & 1 & -1 & 2\\0 & 0 & \phantom{-}0 & 0 \end{array} \right),
$$

which translates back to the equations

<div markdown="0">
\begin{align*}
x_1 \phantom{ {} + x_2} \quad + x_3 \quad &= \quad 1\\
\phantom{x_1 + {} } x_2 \quad - x_3 \quad &= \quad 2.
\end{align*}
</div>

We declare $$x_3$$ to be a parameter $$t$$, and rewrite these equations in parametric form as

<div markdown="0">
\begin{align*}
x_1 &= 1 - t\\
x_2 &= 2 + t\\
x_3 &= 0 + t,
\end{align*}
</div>

which finally yields the solution space of \eqref{eq:system} as

<div markdown="0">
\begin{align*}
\left\lbrace \begin{pmatrix}1\\2\\0\end{pmatrix} + t \begin{pmatrix} -1\\ \phantom{-}1\\\phantom{-}1\end{pmatrix} \right\rbrace.
\end{align*}
</div>

This is a 1-dimensional solution space, that is, an _affine line_: starting from the point $$(1,2,0)^T$$, any other point on the line can be reached by adding a $$t$$-multiple of the direction vector $$(-1,1,1)^T$$.
</div>
<div class="iclicker-question" markdown="1">

Consider the following system of linear equations together with the RREF of its augmented coefficient matrix:

<div markdown="0">
\begin{align*}
\left(\begin{array}{c|c} A | \mathbf{b}\end{array}\right) = \left(\begin{array}{ccc|c}
2 & -2 & -3 & 9\\
-1 & 1 & 4 & -7\\
3 & -3 & 2 & 7
\end{array}\right)
\quad \sim\quad
\left(\begin{array}{ccc|c}
1 & -1 & 0 & 3\\
0 & 0 & 1 & -1\\
0 & 0& 0 & 0
\end{array}\right)
</div>

Which set describes the solutions of this system?
**A.** $$\varemtpy$$

**B.** $$\left\lbrace \begin{pmatrix} \phantom{-}3\\-1\\ \phantom{-}0\end{pmatrix}\right\rbrace$$

**C.** $$\left\lbrace \begin{pmatrix} \phantom{-}3\\-1\\ \phantom{-}0\end{pmatrix} + t \begin{pmatrix}1\\1\\0\end{pmatrix}\right\rbrace$$

**D.** $$\left\lbrace \begin{pmatrix} \phantom{-}3\\-1\\ \phantom{-}0\end{pmatrix} + t \begin{pmatrix}1\\0\\0\end{pmatrix} + s \begin{pmatrix}0\\1\\0\end{pmatrix} \right\rbrace$$
</div>
