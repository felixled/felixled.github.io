export const EPS = 1e-8;

export const dot = (u, v) =>
  u[0] * v[0] + u[1] * v[1] + u[2] * v[2];

export const add = (u, v) =>
  u.map((x, i) => x + v[i]);

export const sub = (u, v) =>
  u.map((x, i) => x - v[i]);

export const mul = (u, s) =>
  u.map((x) => x * s);

export const cross = (u, v) => [
  u[1] * v[2] - u[2] * v[1],
  u[2] * v[0] - u[0] * v[2],
  u[0] * v[1] - u[1] * v[0],
];

export const norm = (u) =>
  Math.hypot(...u);

export const unit = (u) => {
  const n = norm(u);

  return n < EPS
    ? [0, 0, 0]
    : mul(u, 1 / n);
};


export function matrixRank(
  matrix,
  tolerance = 1e-7
) {
  if (!matrix.length) {
    return 0;
  }

  const A =
    matrix.map(
      (row) =>
        row.slice()
    );

  let row = 0;

  for (
    let col = 0;
    col < A[0].length &&
    row < A.length;
    col += 1
  ) {
    let pivot = row;

    for (
      let r = row + 1;
      r < A.length;
      r += 1
    ) {
      if (
        Math.abs(
          A[r][col]
        ) >
        Math.abs(
          A[pivot][col]
        )
      ) {
        pivot = r;
      }
    }

    if (
      Math.abs(
        A[pivot][col]
      ) < tolerance
    ) {
      continue;
    }

    [
      A[row],
      A[pivot],
    ] = [
      A[pivot],
      A[row],
    ];

    const pivotValue =
      A[row][col];

    for (
      let j = col;
      j < A[row].length;
      j += 1
    ) {
      A[row][j] /=
        pivotValue;
    }

    for (
      let r = 0;
      r < A.length;
      r += 1
    ) {
      if (r === row) {
        continue;
      }

      const factor =
        A[r][col];

      for (
        let j = col;
        j < A[r].length;
        j += 1
      ) {
        A[r][j] -=
          factor *
          A[row][j];
      }
    }

    row += 1;
  }

  return row;
}


export function rrefSystem(
  planes,
  tolerance = 1e-7
) {
  const A =
    planes.map(
      ({
        a,
        b,
        c,
        d,
      }) => [
        a,
        b,
        c,
        d,
      ]
    );

  let row = 0;

  const pivots = [];

  for (
    let col = 0;
    col < 3 &&
    row < A.length;
    col += 1
  ) {
    let pivot = row;

    for (
      let r = row + 1;
      r < A.length;
      r += 1
    ) {
      if (
        Math.abs(
          A[r][col]
        ) >
        Math.abs(
          A[pivot][col]
        )
      ) {
        pivot = r;
      }
    }

    if (
      Math.abs(
        A[pivot][col]
      ) < tolerance
    ) {
      continue;
    }

    [
      A[row],
      A[pivot],
    ] = [
      A[pivot],
      A[row],
    ];

    const pivotValue =
      A[row][col];

    for (
      let j = col;
      j < 4;
      j += 1
    ) {
      A[row][j] /=
        pivotValue;
    }

    for (
      let r = 0;
      r < A.length;
      r += 1
    ) {
      if (r === row) {
        continue;
      }

      const factor =
        A[r][col];

      for (
        let j = col;
        j < 4;
        j += 1
      ) {
        A[r][j] -=
          factor *
          A[row][j];
      }
    }

    pivots.push(col);

    row += 1;
  }

  return {
    matrix: A,
    pivots,
  };
}


export function uniquePoint(
  planes
) {
  const {
    matrix,
  } =
    rrefSystem(
      planes
    );

  const point =
    [0, 0, 0];

  for (
    const row
    of matrix
  ) {
    const pivot =
      row.findIndex(
        (
          value,
          index
        ) =>
          index < 3 &&
          Math.abs(
            value
          ) > 1e-7
      );

    if (
      pivot >= 0
    ) {
      point[pivot] =
        row[3];
    }
  }

  return point;
}


function integerGcd(
  a,
  b
) {
  let x =
    Math.abs(a);

  let y =
    Math.abs(b);

  while (y) {
    [
      x,
      y,
    ] = [
      y,
      x % y,
    ];
  }

  return x;
}


export function tidyDirection(
  vector
) {
  /*
   * The sliders use quarter increments.
   * Multiplying by 16 generally converts
   * cross-product directions into integers,
   * which lets us display simple direction
   * vectors such as (0,0,1) rather than
   * normalized decimal vectors.
   */
  let integers =
    vector.map(
      (value) =>
        Math.round(
          value * 16
        )
    );

  const sufficientlyExact =
    integers.every(
      (
        value,
        index
      ) =>
        Math.abs(
          value -
          vector[index] *
            16
        ) < 1e-5
    );

  if (
    !sufficientlyExact
  ) {
    return unit(
      vector
    );
  }

  let divisor = 0;

  for (
    const value
    of integers
  ) {
    divisor =
      integerGcd(
        divisor,
        value
      );
  }

  if (divisor) {
    integers =
      integers.map(
        (value) =>
          value /
          divisor
      );
  }

  /*
   * Fix the arbitrary sign of a line direction
   * by making the first nonzero component
   * positive.
   */
  const firstNonzero =
    integers.find(
      (value) =>
        value !== 0
    );

  if (
    firstNonzero <
    0
  ) {
    integers =
      integers.map(
        (value) =>
          -value
      );
  }

  return integers;
}


export function pairIntersectionLine(
  plane1,
  plane2
) {
  const n1 = [
    plane1.a,
    plane1.b,
    plane1.c,
  ];

  const n2 = [
    plane2.a,
    plane2.b,
    plane2.c,
  ];

  /*
   * The direction of the intersection line
   * is perpendicular to both plane normals.
   */
  const rawDirection =
    cross(
      n1,
      n2
    );

  const denominator =
    dot(
      rawDirection,
      rawDirection
    );

  /*
   * Parallel normals mean that the planes
   * are parallel or coincident, so there is
   * no unique pairwise intersection line.
   */
  if (
    denominator < EPS
  ) {
    return null;
  }

  /*
   * One point on
   *
   * n1 · x = d1
   * n2 · x = d2
   *
   * can be written as
   *
   * [d1 (n2 × v) + d2 (v × n1)] / ||v||²
   *
   * where v = n1 × n2.
   */
  const point =
    mul(
      add(
        mul(
          cross(
            n2,
            rawDirection
          ),
          plane1.d
        ),

        mul(
          cross(
            rawDirection,
            n1
          ),
          plane2.d
        )
      ),

      1 /
      denominator
    );

  return {
    point,

    direction:
      tidyDirection(
        rawDirection
      ),
  };
}


export function pairRelation(
  plane1,
  plane2
) {
  const n1 = [
    plane1.a,
    plane1.b,
    plane1.c,
  ];

  const n2 = [
    plane2.a,
    plane2.b,
    plane2.c,
  ];

  const trivial1 =
    norm(n1) < EPS;

  const trivial2 =
    norm(n2) < EPS;


  /*
   * 0 = nonzero is inconsistent.
   */
  if (
    trivial1 &&
    Math.abs(
      plane1.d
    ) >= EPS
  ) {
    return {
      type: "empty",
    };
  }

  if (
    trivial2 &&
    Math.abs(
      plane2.d
    ) >= EPS
  ) {
    return {
      type: "empty",
    };
  }


  /*
   * 0 = 0 paired with 0 = 0
   * imposes no restriction at all.
   */
  if (
    trivial1 &&
    trivial2
  ) {
    return {
      type: "space",
    };
  }


  /*
   * One identity equation and one genuine
   * plane equation leaves that plane.
   */
  if (trivial1) {
    return {
      type: "plane",
      plane: plane2,
    };
  }

  if (trivial2) {
    return {
      type: "plane",
      plane: plane1,
    };
  }


  const line =
    pairIntersectionLine(
      plane1,
      plane2
    );

  if (line) {
    return {
      type: "line",
      line,
    };
  }


  /*
   * At this point the plane normals are
   * parallel. Determine whether the affine
   * equations represent the same plane.
   *
   * The augmented coefficient vectors
   * (a,b,c,d) must be proportional.
   */
  const samePlane =
    Math.abs(
      plane1.a *
      plane2.d -
      plane2.a *
      plane1.d
    ) < 1e-7

    &&

    Math.abs(
      plane1.b *
      plane2.d -
      plane2.b *
      plane1.d
    ) < 1e-7

    &&

    Math.abs(
      plane1.c *
      plane2.d -
      plane2.c *
      plane1.d
    ) < 1e-7;


  if (samePlane) {
    return {
      type: "plane",
      plane: plane1,
    };
  }

  return {
    type: "empty",
  };
}


export function classifySystem(
  planes
) {
  const coefficientMatrix =
    planes.map(
      ({
        a,
        b,
        c,
      }) => [
        a,
        b,
        c,
      ]
    );

  const augmentedMatrix =
    planes.map(
      ({
        a,
        b,
        c,
        d,
      }) => [
        a,
        b,
        c,
        d,
      ]
    );


  const rankA =
    matrixRank(
      coefficientMatrix
    );

  const rankAugmented =
    matrixRank(
      augmentedMatrix
    );


  /*
   * Rouché-Capelli:
   *
   * rank(A) != rank([A|b])
   *
   * means the system is inconsistent.
   */
  if (
    rankA <
    rankAugmented
  ) {
    return {
      type: "none",

      rankA,

      rankAugmented,
    };
  }


  /*
   * For a consistent system in R^3,
   *
   * dimension(solution set)
   *   = 3 - rank(A).
   */
  const dimension =
    3 -
    rankA;


  if (
    dimension === 0
  ) {
    return {
      type: "point",

      point:
        uniquePoint(
          planes
        ),

      rankA,

      rankAugmented,

      dimension,
    };
  }


  if (
    dimension === 1
  ) {
    /*
     * Find any independent pair of planes.
     * Their intersection line must equal
     * the common one-dimensional solution
     * set because the full system is known
     * to be consistent.
     */
    let line = null;

    for (
      let i = 0;
      i < planes.length &&
      !line;
      i += 1
    ) {
      for (
        let j = i + 1;
        j < planes.length &&
        !line;
        j += 1
      ) {
        line =
          pairIntersectionLine(
            planes[i],
            planes[j]
          );
      }
    }

    return {
      type: "line",

      line,

      rankA,

      rankAugmented,

      dimension,
    };
  }


  if (
    dimension === 2
  ) {
    /*
     * Rank one means all genuine equations
     * represent the same affine plane.
     */
    const plane =
      planes.find(
        ({
          a,
          b,
          c,
        }) =>
          norm(
            [a, b, c]
          ) >= EPS
      ) ?? null;

    return {
      type: "plane",

      plane,

      rankA,

      rankAugmented,

      dimension,
    };
  }


  /*
   * Rank zero and consistency means every
   * equation is 0 = 0.
   */
  return {
    type: "space",

    rankA,

    rankAugmented,

    dimension,
  };
}