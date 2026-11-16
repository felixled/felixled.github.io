export const EPS = 1e-8;

export const dot = (u, v) => u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
export const add = (u, v) => u.map((x, i) => x + v[i]);
export const sub = (u, v) => u.map((x, i) => x - v[i]);
export const mul = (u, s) => u.map((x) => x * s);
export const cross = (u, v) => [
  u[1] * v[2] - u[2] * v[1],
  u[2] * v[0] - u[0] * v[2],
  u[0] * v[1] - u[1] * v[0],
];
export const norm = (u) => Math.hypot(...u);
export const unit = (u) => {
  const n = norm(u);
  return n < EPS ? [0, 0, 0] : mul(u, 1 / n);
};

export function matrixRank(matrix, tolerance = 1e-7) {
  if (!matrix.length) return 0;
  const A = matrix.map((row) => row.slice());
  let row = 0;

  for (let col = 0; col < A[0].length && row < A.length; col += 1) {
    let pivot = row;
    for (let r = row + 1; r < A.length; r += 1) {
      if (Math.abs(A[r][col]) > Math.abs(A[pivot][col])) pivot = r;
    }
    if (Math.abs(A[pivot][col]) < tolerance) continue;

    [A[row], A[pivot]] = [A[pivot], A[row]];
    const pivotValue = A[row][col];
    for (let j = col; j < A[row].length; j += 1) A[row][j] /= pivotValue;

    for (let r = 0; r < A.length; r += 1) {
      if (r === row) continue;
      const factor = A[r][col];
      for (let j = col; j < A[r].length; j += 1) A[r][j] -= factor * A[row][j];
    }
    row += 1;
  }

  return row;
}

export function rrefSystem(planes, tolerance = 1e-7) {
  const A = planes.map(({ a, b, c, d }) => [a, b, c, d]);
  let row = 0;
  const pivots = [];

  for (let col = 0; col < 3 && row < A.length; col += 1) {
    let pivot = row;
    for (let r = row + 1; r < A.length; r += 1) {
      if (Math.abs(A[r][col]) > Math.abs(A[pivot][col])) pivot = r;
    }
    if (Math.abs(A[pivot][col]) < tolerance) continue;

    [A[row], A[pivot]] = [A[pivot], A[row]];
    const pivotValue = A[row][col];
    for (let j = col; j < 4; j += 1) A[row][j] /= pivotValue;

    for (let r = 0; r < A.length; r += 1) {
      if (r === row) continue;
      const factor = A[r][col];
      for (let j = col; j < 4; j += 1) A[r][j] -= factor * A[row][j];
    }

    pivots.push(col);
    row += 1;
  }

  return { matrix: A, pivots };
}

export function uniquePoint(planes) {
  const { matrix } = rrefSystem(planes);
  const point = [0, 0, 0];

  for (const row of matrix) {
    const pivot = row.findIndex((value, index) => index < 3 && Math.abs(value) > 1e-7);
    if (pivot >= 0) point[pivot] = row[3];
  }

  return point;
}

function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) [x, y] = [y, x % y];
  return x;
}

export function tidyDirection(v) {
  const scaled = v.map((x) => Math.round(x * 16));
  const closeToQuarterGrid = scaled.every((x, i) => Math.abs(x - v[i] * 16) < 1e-5);
  if (!closeToQuarterGrid) return unit(v);

  let divisor = 0;
  for (const x of scaled) divisor = gcd(divisor, x);
  let result = divisor ? scaled.map((x) => x / divisor) : scaled;
  const firstNonzero = result.find((x) => x !== 0);
  if (firstNonzero < 0) result = result.map((x) => -x);
  return result;
}

export function pairIntersectionLine(p1, p2) {
  const n1 = [p1.a, p1.b, p1.c];
  const n2 = [p2.a, p2.b, p2.c];
  const direction = cross(n1, n2);
  const denominator = dot(direction, direction);
  if (denominator < EPS) return null;

  const point = mul(
    add(mul(cross(n2, direction), p1.d), mul(cross(direction, n1), p2.d)),
    1 / denominator,
  );

  return { point, direction: tidyDirection(direction) };
}

export function pairRelation(p1, p2) {
  const n1 = [p1.a, p1.b, p1.c];
  const n2 = [p2.a, p2.b, p2.c];
  const trivial1 = norm(n1) < EPS;
  const trivial2 = norm(n2) < EPS;

  if (trivial1 && Math.abs(p1.d) >= EPS) return { type: "empty" };
  if (trivial2 && Math.abs(p2.d) >= EPS) return { type: "empty" };
  if (trivial1 && trivial2) return { type: "space" };
  if (trivial1) return { type: "plane", plane: p2 };
  if (trivial2) return { type: "plane", plane: p1 };

  const line = pairIntersectionLine(p1, p2);
  if (line) return { type: "line", line };

  const same =
    Math.abs(p1.a * p2.d - p2.a * p1.d) < 1e-7 &&
    Math.abs(p1.b * p2.d - p2.b * p1.d) < 1e-7 &&
    Math.abs(p1.c * p2.d - p2.c * p1.d) < 1e-7;

  return same ? { type: "plane", plane: p1 } : { type: "empty" };
}

export function classifySystem(planes) {
  const coefficientMatrix = planes.map(({ a, b, c }) => [a, b, c]);
  const augmentedMatrix = planes.map(({ a, b, c, d }) => [a, b, c, d]);
  const rankA = matrixRank(coefficientMatrix);
  const rankAugmented = matrixRank(augmentedMatrix);

  if (rankA < rankAugmented) {
    return { type: "none", rankA, rankAugmented };
  }

  const dimension = 3 - rankA;
  if (dimension === 0) {
    return {
      type: "point",
      point: uniquePoint(planes),
      rankA,
      rankAugmented,
      dimension,
    };
  }

  if (dimension === 1) {
    let line = null;
    for (let i = 0; i < planes.length && !line; i += 1) {
      for (let j = i + 1; j < planes.length && !line; j += 1) {
        line = pairIntersectionLine(planes[i], planes[j]);
      }
    }
    return { type: "line", line, rankA, rankAugmented, dimension };
  }

  if (dimension === 2) {
    const plane = planes.find(({ a, b, c }) => norm([a, b, c]) >= EPS) ?? null;
    return { type: "plane", plane, rankA, rankAugmented, dimension };
  }

  return { type: "space", rankA, rankAugmented, dimension };
}
