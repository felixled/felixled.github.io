---
layout: math257
title: "Math 257 Week 2"
permalink: /math257/week2/
previous_week: 1
next_week: 3
---

<div class="math257-text" markdown="1">

## Gaussian elimination and row-reduced echelon froms

A matrix is in **echelon form**, if:

1. Any non-zero rows of the matrix are above the all-zero rows.

2. The leading entry of a non-zero row is strictly to the right of the leading entry of the row above it.

A matrix is in **row-reduced echelon form (RREF)**, if it is in echelon form, and additionally

{: start="3"}
3. The leading entry in each non-zero row is equal to $$1$$.

4. Each leading entry is the only non-zero entry in its column.
</div>

<div class="demonstration" markdown="1">
##### Finding the echelon form and RREF of a matrix

$$
M = \begin{pmatrix} 
\phantom{-}1 & -2 & \phantom{-}3 &-4\\
\phantom{-}2 & \phantom{-}0 & \phantom{-}4 & -8\\
-1 & -2 & -1 & \phantom{-}4
\end{pmatrix}
$$

</div>

<div class="iclicker-question" markdown="1">

Consider the following three matrices:

<div markdown="0">
\begin{align*}
M_1 &= \begin{pmatrix}1&0&3\\0&2&4\\0&0&5\end{pmatrix} &
M_2 &= \begin{pmatrix}1&0&2\\1&0&0\\0&0&0\end{pmatrix} &
M_3 &= \begin{pmatrix}0&1&0\\0&0&1\\0&0&0\end{pmatrix}
\end{align*}
</div>

Select all true statements:

**A.** Both $$M_1$$ and $$M_3$$ are in echelon form.

**B.** $$M_2$$ is in echelon form.

**C.** $$M_1$$ is in row-reduced echelon form.

**D.** $$M_3$$ is in row-reduced echelon form.

</div>

<div class="groupwork-question" markdown="1">
Consider the matrix $$M=\begin{pmatrix} 1 & 1 & 0 & 2\\ 0 & 0 & 1 & -1\end{pmatrix}$$.

Find two **distinct** matrices $$A$$ and $$B$$ that both have $$M$$ as their RREF!
</div>

<div class="math257-text" markdown="1">
## Linear combinations
</div>

<math257-linear-combinations-3d></math257-linear-combinations-3d>


