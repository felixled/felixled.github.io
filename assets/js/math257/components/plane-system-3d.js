import {
  EPS,
  add,
  classifySystem,
  cross,
  dot,
  mul,
  norm,
  pairIntersectionLine,
  pairRelation,
  sub,
  unit,
} from "../core/math3d.js";
import { sharedStyles } from "../core/theme.js";

const DEFAULT_PLANES = [
  { a: 1, b: 0, c: 0, d: 1 },
  { a: 0, b: 1, c: 0, d: 1 },
  { a: 0, b: 0, c: 1, d: 1 },
];

const PRESETS = {
  point: {
    planes: DEFAULT_PLANES,
    useThird: true,
  },
  line: {
    planes: [
      { a: 1, b: 0, c: 0, d: 0 },
      { a: 0, b: 1, c: 0, d: 0 },
      { a: 1, b: 1, c: 0, d: 0 },
    ],
    useThird: true,
  },
  pairwise: {
    planes: [
      { a: 1, b: 0, c: 0, d: 0 },
      { a: 0, b: 1, c: 0, d: 0 },
      { a: 1, b: 1, c: 0, d: 1 },
    ],
    useThird: true,
  },
  same: {
    planes: [
      { a: 1, b: 1, c: 1, d: 2 },
      { a: 2, b: 2, c: 2, d: 4 },
      { a: 0, b: 0, c: 1, d: 0 },
    ],
    useThird: false,
  },
  parallel: {
    planes: [
      { a: 1, b: 0, c: 0, d: 0 },
      { a: 1, b: 0, c: 0, d: 2 },
      { a: 0, b: 1, c: 0, d: 0 },
    ],
    useThird: false,
  },
};

const template = document.createElement("template");
template.innerHTML = `
<style>
${sharedStyles}

.wrap {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(280px, 0.9fr);
  gap: 1rem;
  align-items: start;
}

.view { min-width: 0; }

svg {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 1 / 1;
  background: var(--m257-surface-muted);
  border: 1px solid var(--m257-border);
  border-radius: 0.75rem;
  touch-action: pan-y;
}

.panel {
  min-width: 0;
  padding: 0.9rem;
  background: var(--m257-surface);
  border: 1px solid var(--m257-border);
  border-radius: 0.8rem;
}

.help,
.caption,
.status p {
  color: var(--m257-muted);
}

.help {
  margin: 0.6rem 0;
  font-size: 0.85rem;
  line-height: 1.4;
}

.check {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.4rem;
  font-size: 0.9rem;
}

.equation-row {
  display: grid;
  grid-template-columns: 1.5rem 1fr;
  gap: 0.55rem;
  padding: 0.7rem 0;
  border-bottom: 1px solid var(--m257-border);
}

.equation-row:last-child { border-bottom: 0; }

.dot {
  width: 0.8rem;
  height: 0.8rem;
  margin-top: 0.28rem;
  border-radius: 999px;
}

.equation {
  margin-bottom: 0.45rem;
  font-size: 0.96rem;
  font-weight: 650;
}

.controls {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.28rem 0.7rem;
}

.control {
  display: grid;
  grid-template-columns: 1rem 1fr 2.7rem;
  gap: 0.3rem;
  align-items: center;
  min-width: 0;
  color: var(--m257-muted);
  font-size: 0.8rem;
}

input[type="range"] {
  width: 100%;
  min-width: 0;
  accent-color: var(--m257-accent);
}

output {
  color: var(--m257-text);
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.status,
.solver {
  margin-top: 0.8rem;
  padding: 0.8rem;
  background: var(--m257-surface-muted);
  border: 1px solid var(--m257-border);
  border-radius: 0.7rem;
}

.status strong,
.solver h3 {
  display: block;
  margin: 0;
  font-size: 1rem;
}

.status p {
  margin: 0.25rem 0 0;
  font-size: 0.86rem;
  line-height: 1.4;
}

.ranks {
  margin-top: 0.45rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.82rem;
}

.solver-body {
  margin-top: 0.55rem;
  font-size: 0.87rem;
  line-height: 1.5;
}

.solver-item {
  padding: 0.52rem 0;
  border-top: 1px solid var(--m257-border);
}

.solver-item:first-child {
  padding-top: 0;
  border-top: 0;
}

.solver-label {
  margin-bottom: 0.15rem;
  color: var(--m257-muted);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.035em;
  text-transform: uppercase;
}

.math {
  overflow-wrap: anywhere;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.87rem;
}

.actions,
.rotate {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.actions { margin-top: 0.7rem; }
.rotate { margin: 0.65rem 0; }

button {
  min-height: 2.6rem;
  padding: 0.48rem 0.68rem;
  color: var(--m257-text);
  background: var(--m257-surface-muted);
  border: 1px solid var(--m257-border);
  border-radius: 0.6rem;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
}

button:hover { border-color: var(--m257-accent); }

.rotate button { min-width: 2.6rem; }

.caption {
  display: flex;
  justify-content: space-between;
  gap: 0.6rem;
  flex-wrap: wrap;
  margin-top: 0.45rem;
  font-size: 0.8rem;
}

@media (max-width: 720px) {
  .wrap { grid-template-columns: 1fr; }
}

@media (max-width: 400px) {
  .controls { grid-template-columns: 1fr; }
}
</style>

<div class="wrap">
  <section class="view">
    <svg viewBox="0 0 640 640" role="img" aria-labelledby="title desc">
      <title id="title">Three-dimensional linear equations</title>
      <desc id="desc">A rotatable three-dimensional view of planes representing linear equations in x, y, and z.</desc>
      <g data-layer="cube"></g>
      <g data-layer="planes"></g>
      <g data-layer="intersections"></g>
      <g data-layer="axes"></g>
    </svg>
    <div class="caption">
      <span>Drag to rotate.</span>
      <span data-role="range-caption"></span>
    </div>
    <div class="rotate" aria-label="View controls">
      <button type="button" data-rotate="left" aria-label="Rotate left">←</button>
      <button type="button" data-rotate="right" aria-label="Rotate right">→</button>
      <button type="button" data-rotate="up" aria-label="Rotate up">↑</button>
      <button type="button" data-rotate="down" aria-label="Rotate down">↓</button>
      <button type="button" data-rotate="reset">Reset view</button>
    </div>
  </section>

  <section class="panel">
    <label class="check"><input data-role="third" type="checkbox" checked> Include a third plane</label>
    <label class="check"><input data-role="pair-lines" type="checkbox" checked> Show pairwise intersection lines</label>
    <p class="help">Each plane has equation <strong>ax + by + cz = d</strong>. The vector (a,b,c) is normal to the plane.</p>

    <div data-role="equations"></div>

    <div class="status" aria-live="polite">
      <strong data-role="status-title"></strong>
      <p data-role="status-text"></p>
      <div class="ranks" data-role="ranks"></div>
    </div>

    <div class="solver" aria-live="polite">
      <h3>Solution set</h3>
      <div class="solver-body" data-role="solver"></div>
    </div>

    <div class="actions">
      <button type="button" data-preset="point">Unique point</button>
      <button type="button" data-preset="line">Common line</button>
      <button type="button" data-preset="pairwise">Pairwise only</button>
      <button type="button" data-preset="same">Same plane</button>
      <button type="button" data-preset="parallel">Parallel</button>
    </div>
  </section>
</div>
`;

export class Math257PlaneSystem3D extends HTMLElement {
  static get observedAttributes() {
    return ["preset", "range", "equations", "two-planes", "hide-pairwise"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.planes = DEFAULT_PLANES.map((plane) => ({ ...plane }));
    this.useThird = true;
    this.showPairwise = true;
    this.range = 4;
    this.yaw = -0.65;
    this.pitch = 0.48;
    this.dragging = false;
    this.lastX = 0;
    this.lastY = 0;
    this._connected = false;

    this.svg = this.shadowRoot.querySelector("svg");
    this.cubeLayer = this.shadowRoot.querySelector('[data-layer="cube"]');
    this.planeLayer = this.shadowRoot.querySelector('[data-layer="planes"]');
    this.intersectionLayer = this.shadowRoot.querySelector('[data-layer="intersections"]');
    this.axisLayer = this.shadowRoot.querySelector('[data-layer="axes"]');
    this.equationsElement = this.shadowRoot.querySelector('[data-role="equations"]');
    this.thirdCheckbox = this.shadowRoot.querySelector('[data-role="third"]');
    this.pairwiseCheckbox = this.shadowRoot.querySelector('[data-role="pair-lines"]');
    this.statusTitle = this.shadowRoot.querySelector('[data-role="status-title"]');
    this.statusText = this.shadowRoot.querySelector('[data-role="status-text"]');
    this.ranksElement = this.shadowRoot.querySelector('[data-role="ranks"]');
    this.solverElement = this.shadowRoot.querySelector('[data-role="solver"]');
    this.rangeCaption = this.shadowRoot.querySelector('[data-role="range-caption"]');
  }

  connectedCallback() {
    if (this._connected) return;
    this._connected = true;
    this.readAttributes();
    this.buildControls();
    this.bindEvents();
    this.update();
  }

  attributeChangedCallback() {
    if (!this._connected) return;
    this.readAttributes();
    this.buildControls();
    this.update();
  }

  get activePlanes() {
    return this.useThird ? this.planes : this.planes.slice(0, 2);
  }

  readAttributes() {
    const presetName = this.getAttribute("preset");
    if (presetName && PRESETS[presetName]) this.applyPreset(presetName, false);

    const range = Number(this.getAttribute("range"));
    if (Number.isFinite(range) && range > 0) this.range = Math.max(1, Math.min(20, range));

    const equations = this.getAttribute("equations");
    if (equations) {
      const parsed = this.parseEquations(equations);
      if (parsed.length >= 2) {
        this.planes = [
          parsed[0],
          parsed[1],
          parsed[2] ?? { ...DEFAULT_PLANES[2] },
        ];
        this.useThird = parsed.length >= 3;
      }
    }

    if (this.hasAttribute("two-planes")) this.useThird = false;
    this.showPairwise = !this.hasAttribute("hide-pairwise");
  }

  parseEquations(value) {
    return value
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => part.split(/[\s,]+/).map(Number))
      .filter((values) => values.length === 4 && values.every(Number.isFinite))
      .map(([a, b, c, d]) => ({ a, b, c, d }));
  }

  setPlanes(planes) {
    if (!Array.isArray(planes) || planes.length < 2) return;
    const normalized = planes.slice(0, 3).map((plane) => {
      if (Array.isArray(plane)) {
        const [a, b, c, d] = plane.map(Number);
        return { a, b, c, d };
      }
      return {
        a: Number(plane.a),
        b: Number(plane.b),
        c: Number(plane.c),
        d: Number(plane.d),
      };
    });
    if (normalized.some((plane) => Object.values(plane).some((value) => !Number.isFinite(value)))) return;

    this.planes = [
      normalized[0],
      normalized[1],
      normalized[2] ?? { ...DEFAULT_PLANES[2] },
    ];
    this.useThird = normalized.length >= 3;
    this.buildControls();
    this.update();
  }

  resetView() {
    this.yaw = -0.65;
    this.pitch = 0.48;
    this.update();
  }

  applyPreset(name, rerender = true) {
    const preset = PRESETS[name];
    if (!preset) return;
    this.planes = preset.planes.map((plane) => ({ ...plane }));
    this.useThird = preset.useThird;
    if (rerender) {
      this.buildControls();
      this.update();
    }
  }

  bindEvents() {
    this.thirdCheckbox.addEventListener("change", () => {
      this.useThird = this.thirdCheckbox.checked;
      this.update();
    });

    this.pairwiseCheckbox.addEventListener("change", () => {
      this.showPairwise = this.pairwiseCheckbox.checked;
      this.update();
    });

    this.shadowRoot.querySelectorAll("[data-preset]").forEach((button) => {
      button.addEventListener("click", () => this.applyPreset(button.dataset.preset));
    });

    this.shadowRoot.querySelectorAll("[data-rotate]").forEach((button) => {
      button.addEventListener("click", () => {
        const step = 0.18;
        switch (button.dataset.rotate) {
          case "left": this.yaw -= step; break;
          case "right": this.yaw += step; break;
          case "up": this.pitch = Math.min(1.35, this.pitch + step); break;
          case "down": this.pitch = Math.max(-1.35, this.pitch - step); break;
          case "reset": this.resetView(); return;
          default: return;
        }
        this.update();
      });
    });

    this.svg.addEventListener("pointerdown", (event) => {
      this.dragging = true;
      this.lastX = event.clientX;
      this.lastY = event.clientY;
      this.svg.setPointerCapture(event.pointerId);
    });

    this.svg.addEventListener("pointermove", (event) => {
      if (!this.dragging) return;
      const dx = event.clientX - this.lastX;
      const dy = event.clientY - this.lastY;
      this.lastX = event.clientX;
      this.lastY = event.clientY;
      this.yaw += dx * 0.008;
      this.pitch = Math.max(-1.35, Math.min(1.35, this.pitch + dy * 0.008));
      this.update();
    });

    const endDrag = (event) => {
      this.dragging = false;
      if (this.svg.hasPointerCapture?.(event.pointerId)) this.svg.releasePointerCapture(event.pointerId);
    };
    this.svg.addEventListener("pointerup", endDrag);
    this.svg.addEventListener("pointercancel", endDrag);
  }

  buildControls() {
    this.equationsElement.replaceChildren();

    this.planes.forEach((plane, index) => {
      const row = document.createElement("div");
      row.className = "equation-row";
      row.dataset.row = index;

      const marker = document.createElement("span");
      marker.className = "dot";
      marker.style.background = `var(--m257-series-${index + 1})`;

      const body = document.createElement("div");
      const equation = document.createElement("div");
      equation.className = "equation";
      equation.dataset.equation = index;
      body.appendChild(equation);

      const controls = document.createElement("div");
      controls.className = "controls";

      for (const key of ["a", "b", "c", "d"]) {
        const label = document.createElement("label");
        label.className = "control";

        const name = document.createElement("span");
        name.textContent = key;

        const input = document.createElement("input");
        input.type = "range";
        input.min = key === "d" ? "-6" : "-4";
        input.max = key === "d" ? "6" : "4";
        input.step = "0.25";
        input.value = String(plane[key]);
        input.setAttribute("aria-label", `Plane ${index + 1}, coefficient ${key}`);

        const output = document.createElement("output");
        output.textContent = this.formatNumber(plane[key]);

        input.addEventListener("input", () => {
          plane[key] = Number(input.value);
          output.textContent = this.formatNumber(plane[key]);
          this.update();
        });

        label.append(name, input, output);
        controls.appendChild(label);
      }

      body.appendChild(controls);
      row.append(marker, body);
      this.equationsElement.appendChild(row);
    });
  }

  update() {
    this.thirdCheckbox.checked = this.useThird;
    this.pairwiseCheckbox.checked = this.showPairwise;

    const thirdRow = this.equationsElement.querySelector('[data-row="2"]');
    if (thirdRow) thirdRow.hidden = !this.useThird;

    this.planes.forEach((plane, index) => {
      const equation = this.equationsElement.querySelector(`[data-equation="${index}"]`);
      if (equation) equation.textContent = this.formatEquation(plane);
    });

    const result = classifySystem(this.activePlanes);
    this.updateClassification(result);
    this.solverElement.replaceChildren(...this.buildSolverNodes(result));
    this.rangeCaption.textContent = `Cube: −${this.range} ≤ x,y,z ≤ ${this.range}`;

    this.drawCube();
    this.drawPlanes();
    this.drawIntersections(result);
    this.drawAxes();

    this.dispatchEvent(new CustomEvent("math257-change", {
      bubbles: true,
      detail: {
        planes: this.activePlanes.map((plane) => ({ ...plane })),
        result: structuredClone(result),
      },
    }));
  }

  updateClassification(result) {
    const labels = {
      point: ["Unique solution", `The common intersection is ${this.formatVector(result.point)}.`],
      line: ["Infinitely many solutions: a line", "The common solution set is one-dimensional."],
      plane: ["Infinitely many solutions: a plane", "The active equations impose only one independent constraint."],
      space: ["Every point is a solution", "All active equations reduce to 0 = 0."],
      none: ["No common solution", "The system is inconsistent because rank(A) ≠ rank([A | b])."],
    };

    const [title, text] = labels[result.type];
    this.statusTitle.textContent = title;
    this.statusText.textContent = text;
    this.ranksElement.textContent = `rank(A) = ${result.rankA} · rank([A | b]) = ${result.rankAugmented}${
      result.dimension !== undefined ? ` · solution dimension = ${result.dimension}` : ""
    }`;
  }

  buildSolverNodes(result) {
    if (result.type === "point") {
      return [this.solverItem("Solution", `(x, y, z) = ${this.formatVector(result.point)}`)];
    }

    if (result.type === "line" && result.line) {
      return [this.solverItem(
        "Common intersection line",
        `(x, y, z) = ${this.formatVector(result.line.point)} + t ${this.formatVector(result.line.direction)},  t ∈ ℝ`,
      )];
    }

    if (result.type === "plane" && result.plane) {
      return [this.solverItem("Solution plane", this.formatEquation(result.plane))];
    }

    if (result.type === "space") {
      return [this.solverItem("Solution", "ℝ³")];
    }

    const nodes = [this.solverItem("System", "No common solution. Pairwise intersections:")];
    for (let i = 0; i < this.activePlanes.length; i += 1) {
      for (let j = i + 1; j < this.activePlanes.length; j += 1) {
        const relation = pairRelation(this.activePlanes[i], this.activePlanes[j]);
        const label = `P${i + 1} ∩ P${j + 1}`;

        if (relation.type === "line") {
          nodes.push(this.solverItem(
            label,
            `(x, y, z) = ${this.formatVector(relation.line.point)} + t ${this.formatVector(relation.line.direction)},  t ∈ ℝ`,
          ));
        } else if (relation.type === "plane") {
          nodes.push(this.solverItem(label, this.formatEquation(relation.plane)));
        } else if (relation.type === "space") {
          nodes.push(this.solverItem(label, "ℝ³"));
        } else {
          nodes.push(this.solverItem(label, "∅"));
        }
      }
    }
    return nodes;
  }

  solverItem(label, body) {
    const item = document.createElement("div");
    item.className = "solver-item";
    const heading = document.createElement("div");
    heading.className = "solver-label";
    heading.textContent = label;
    const math = document.createElement("div");
    math.className = "math";
    math.textContent = body;
    item.append(heading, math);
    return item;
  }

  formatNumber(value) {
    const normalized = Math.abs(value) < 1e-9 ? 0 : value;
    if (Number.isInteger(normalized)) return String(normalized);
    return normalized.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
  }

  formatVector(vector) {
    return `(${vector.map((value) => this.formatNumber(value)).join(", ")})`;
  }

  formatEquation(plane) {
    const terms = [
      [plane.a, "x"],
      [plane.b, "y"],
      [plane.c, "z"],
    ].filter(([value]) => Math.abs(value) > EPS);

    if (!terms.length) return `0 = ${this.formatNumber(plane.d)}`;

    return `${terms.map(([value, symbol], index) => {
      const magnitude = Math.abs(value);
      const coefficient = Math.abs(magnitude - 1) < EPS ? "" : this.formatNumber(magnitude);
      if (index === 0) return `${value < 0 ? "−" : ""}${coefficient}${symbol}`;
      return `${value < 0 ? " − " : " + "}${coefficient}${symbol}`;
    }).join("")} = ${this.formatNumber(plane.d)}`;
  }

  svgElement(name, attributes = {}) {
    const element = document.createElementNS("http://www.w3.org/2000/svg", name);
    for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value);
    return element;
  }

  rotatePoint(point) {
    const cy = Math.cos(this.yaw);
    const sy = Math.sin(this.yaw);
    const cp = Math.cos(this.pitch);
    const sp = Math.sin(this.pitch);
    const x1 = cy * point[0] + sy * point[2];
    const z1 = -sy * point[0] + cy * point[2];
    const y2 = cp * point[1] - sp * z1;
    const z2 = sp * point[1] + cp * z1;
    return [x1, y2, z2];
  }

  project(point) {
    const rotated = this.rotatePoint(point);
    const scale = 15 / (15 - rotated[2]);
    return {
      x: 320 + rotated[0] * (232 / this.range) * scale,
      y: 320 - rotated[1] * (232 / this.range) * scale,
      z: rotated[2],
    };
  }

  get cubeVertices() {
    const values = [-this.range, this.range];
    const vertices = [];
    for (const x of values) for (const y of values) for (const z of values) vertices.push([x, y, z]);
    return vertices;
  }

  get cubeEdges() {
    const vertices = this.cubeVertices;
    const edges = [];
    for (let i = 0; i < vertices.length; i += 1) {
      for (let j = i + 1; j < vertices.length; j += 1) {
        let differences = 0;
        for (let k = 0; k < 3; k += 1) if (vertices[i][k] !== vertices[j][k]) differences += 1;
        if (differences === 1) edges.push([vertices[i], vertices[j]]);
      }
    }
    return edges;
  }

  planePolygon(plane) {
    const normal = [plane.a, plane.b, plane.c];
    if (norm(normal) < EPS) return [];

    const points = [];
    for (const [p0, p1] of this.cubeEdges) {
      const f0 = dot(normal, p0) - plane.d;
      const f1 = dot(normal, p1) - plane.d;
      if (Math.abs(f0) < EPS) points.push(p0);
      if (Math.abs(f1) < EPS) points.push(p1);
      if (f0 * f1 < 0) {
        const t = f0 / (f0 - f1);
        points.push(add(p0, mul(sub(p1, p0), t)));
      }
    }

    const unique = [];
    for (const point of points) {
      if (!unique.some((candidate) => norm(sub(candidate, point)) < 1e-6)) unique.push(point);
    }
    if (unique.length < 3) return [];

    const center = mul(unique.reduce((sum, point) => add(sum, point), [0, 0, 0]), 1 / unique.length);
    const n = unit(normal);
    const reference = Math.abs(n[2]) < 0.8 ? [0, 0, 1] : [0, 1, 0];
    const u = unit(cross(n, reference));
    const v = cross(n, u);

    unique.sort((a, b) =>
      Math.atan2(dot(sub(a, center), v), dot(sub(a, center), u)) -
      Math.atan2(dot(sub(b, center), v), dot(sub(b, center), u))
    );
    return unique;
  }

  clipLine(line) {
    if (!line) return null;
    let low = -1e9;
    let high = 1e9;

    for (let k = 0; k < 3; k += 1) {
      const p = line.point[k];
      const v = line.direction[k];
      if (Math.abs(v) < EPS) {
        if (p < -this.range - EPS || p > this.range + EPS) return null;
        continue;
      }

      let t1 = (-this.range - p) / v;
      let t2 = (this.range - p) / v;
      if (t1 > t2) [t1, t2] = [t2, t1];
      low = Math.max(low, t1);
      high = Math.min(high, t2);
    }

    return low <= high
      ? [add(line.point, mul(line.direction, low)), add(line.point, mul(line.direction, high))]
      : null;
  }

  drawCube() {
    this.cubeLayer.replaceChildren();
    for (const [a, b] of this.cubeEdges) {
      const p = this.project(a);
      const q = this.project(b);
      this.cubeLayer.appendChild(this.svgElement("line", {
        x1: p.x, y1: p.y, x2: q.x, y2: q.y,
        stroke: "var(--m257-border)",
        "stroke-width": 1.25,
      }));
    }
  }

  drawAxes() {
    this.axisLayer.replaceChildren();
    const origin = this.project([0, 0, 0]);
    const extension = this.range + 0.55;
    const axes = [
      [[extension, 0, 0], "x"],
      [[0, extension, 0], "y"],
      [[0, 0, extension], "z"],
    ];

    for (const [end, label] of axes) {
      const point = this.project(end);
      this.axisLayer.appendChild(this.svgElement("line", {
        x1: origin.x, y1: origin.y, x2: point.x, y2: point.y,
        stroke: "var(--m257-text)",
        "stroke-width": 2,
      }));
      const text = this.svgElement("text", {
        x: point.x + 5,
        y: point.y - 5,
        fill: "var(--m257-text)",
        "font-size": 16,
        "font-weight": 700,
      });
      text.textContent = label;
      this.axisLayer.appendChild(text);
    }
  }

  drawPlanes() {
    this.planeLayer.replaceChildren();
    const items = [];

    this.activePlanes.forEach((plane, index) => {
      const polygon = this.planePolygon(plane);
      if (polygon.length < 3) return;
      const projected = polygon.map((point) => this.project(point));
      items.push({
        index,
        projected,
        depth: projected.reduce((sum, point) => sum + point.z, 0) / projected.length,
      });
    });

    items.sort((a, b) => a.depth - b.depth);
    for (const item of items) {
      const color = `var(--m257-series-${item.index + 1})`;
      this.planeLayer.appendChild(this.svgElement("polygon", {
        points: item.projected.map((point) => `${point.x},${point.y}`).join(" "),
        fill: color,
        stroke: color,
        "fill-opacity": 0.27,
        "stroke-opacity": 0.9,
        "stroke-width": 2.3,
        "stroke-linejoin": "round",
      }));

      const x = item.projected.reduce((sum, point) => sum + point.x, 0) / item.projected.length;
      const y = item.projected.reduce((sum, point) => sum + point.y, 0) / item.projected.length;
      const label = this.svgElement("text", {
        x,
        y,
        fill: "var(--m257-text)",
        "font-size": 15,
        "font-weight": 700,
        "text-anchor": "middle",
        "paint-order": "stroke",
        stroke: "var(--m257-surface-muted)",
        "stroke-width": 4,
      });
      label.textContent = `P${item.index + 1}`;
      this.planeLayer.appendChild(label);
    }
  }

  drawIntersections(result) {
    this.intersectionLayer.replaceChildren();

    if (this.showPairwise) {
      for (let i = 0; i < this.activePlanes.length; i += 1) {
        for (let j = i + 1; j < this.activePlanes.length; j += 1) {
          const line = pairIntersectionLine(this.activePlanes[i], this.activePlanes[j]);
          const segment = this.clipLine(line);
          if (!segment) continue;
          const p = this.project(segment[0]);
          const q = this.project(segment[1]);
          this.intersectionLayer.appendChild(this.svgElement("line", {
            x1: p.x, y1: p.y, x2: q.x, y2: q.y,
            stroke: "var(--m257-text)",
            "stroke-width": 3.2,
            "stroke-linecap": "round",
            "stroke-opacity": 0.82,
          }));
        }
      }
    }

    if (result.type === "point" && result.point.every((value) => Math.abs(value) <= this.range + EPS)) {
      const point = this.project(result.point);
      this.intersectionLayer.appendChild(this.svgElement("circle", {
        cx: point.x,
        cy: point.y,
        r: 7,
        fill: "var(--m257-text)",
        stroke: "var(--m257-surface-muted)",
        "stroke-width": 3,
      }));
    }
  }
}

if (!customElements.get("math257-plane-system-3d")) {
  customElements.define("math257-plane-system-3d", Math257PlaneSystem3D);
}
