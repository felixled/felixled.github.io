import { add, mul, norm, cross, unit } from "../core/math3d.js";
import { sharedStyles } from "../core/theme.js";

const LIMIT = 2;
const STEP = 0.25;
const EPSILON = 1e-9;
const ORIGIN = [0, 0, 0];
const INITIAL_VIEW = { yaw: -2.45, pitch: 0.48, zoom: 1 };

const COLORS = {
  first: "var(--m257-series-1)",
  second: "var(--m257-series-2)",
  result: "var(--m257-text)",
  span: "var(--m257-accent)",
};

const PRESETS = {
  independent: {
    v1: [1, 0, 1],
    v2: [0, 1, 1],
    description:
      "Two nonparallel vectors. Adjust a and b to explore their linear combinations.",
    span:
      "The span is the entire plane z = x + y. The pale disk shows only a finite portion. The dashed parallelogram is the region reachable with these sliders, not the whole span.",
  },

  dependent: {
    v1: [1, 0, 1],
    v2: [2, 0, 2],
    description:
      "Here v₂ = 2v₁, so w = (a + 2b)v₁. Collinear arrows can overlap. Try (a, b) = (1, 0) and (−1, 1): they give the same w.",
    span:
      "The span is the entire line (t, 0, t), t ∈ ℝ. The thick segment is the part reachable with these sliders (−6 ≤ t ≤ 6). The line continues beyond the displayed segment.",
  },
};

function formatNumber(value) {
  const clean = Math.abs(value) < EPSILON ? 0 : value;
  return String(Number(clean.toFixed(3))).replace("-", "−");
}

function vectorText(vector) {
  return `(${vector.map(formatNumber).join(", ")})`;
}

function scalarText(value) {
  return value < 0 ? `(${formatNumber(value)})` : formatNumber(value);
}

// Only numbers from our fixed presets and validated coefficients enter this HTML.
function matrixHTML(rows, columnColors = []) {
  const cells = rows.map((row) => row.map((value, column) => {
    const color = columnColors[column] || "inherit";
    return `<span style="color: ${color}">${formatNumber(value)}</span>`;
  }).join("")).join("");

  return `<span class="matrix" style="grid-template-columns: repeat(${rows[0].length}, minmax(1.45em, auto))">${cells}</span>`;
}

function columnHTML(vector, color) {
  return matrixHTML(vector.map((value) => [value]), [color]);
}

const template = document.createElement("template");

template.innerHTML = `
<style>
${sharedStyles}

:host {
  display: block;
  min-width: 0;
}

[hidden] {
  display: none !important;
}

.wrap {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(300px, 1fr);
  gap: 1rem;
  align-items: start;
}

.wrap.stacked {
  grid-template-columns: minmax(0, 1fr);
}

.view,
.panel {
  min-width: 0;
}

svg {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 1 / 1;
  background: var(--m257-surface-muted);
  border: 1px solid var(--m257-border);
  border-radius: 0.75rem;
  touch-action: none;
  cursor: grab;
}

svg.dragging {
  cursor: grabbing;
}

.panel {
  padding: 0.9rem;
  background: var(--m257-surface);
  border: 1px solid var(--m257-border);
  border-radius: 0.8rem;
}

h3 {
  margin: 0 0 0.5rem;
  font-size: 1.05rem;
  font-weight: 700;
}

.description,
.note,
.caption {
  color: var(--m257-muted);
  font-size: 0.83rem;
  line-height: 1.45;
}

.description {
  margin: 0.5rem 0 0.8rem;
}

.caption {
  margin: 0.5rem 0;
}

.note {
  margin: 0.6rem 0 0;
}

.legend,
.toolbar,
.presets {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.45rem;
}

.legend {
  margin-top: 0.65rem;
  gap: 1rem;
  font-size: 0.85rem;
  font-weight: 650;
}

.first {
  color: var(--m257-series-1);
}

.second {
  color: var(--m257-series-2);
}

.result {
  color: var(--m257-text);
}

.toolbar {
  margin-top: 0.5rem;
}

.toolbar .note {
  margin: 0;
}

button {
  min-height: 2.6rem;
  padding: 0.45rem 0.65rem;
  color: var(--m257-text);
  background: var(--m257-surface-muted);
  border: 1px solid var(--m257-border);
  border-radius: 0.6rem;
  font: inherit;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
}

button:hover,
button[aria-pressed="true"] {
  border-color: var(--m257-accent);
}

button[aria-pressed="true"] {
  box-shadow: inset 0 0 0 1px var(--m257-accent);
}

button:disabled {
  opacity: 0.45;
  cursor: default;
}

.coefficient {
  display: grid;
  grid-template-columns: 1.2rem minmax(0, 1fr) 4.2rem;
  align-items: center;
  gap: 0.5rem;
  margin: 0.7rem 0;
}

.coefficient label {
  margin: 0;
  font-weight: 700;
}

input[type="range"] {
  width: 100%;
  min-width: 0;
  margin: 0;
}

input[data-coefficient="a"] {
  accent-color: var(--m257-series-1);
}

input[data-coefficient="b"] {
  accent-color: var(--m257-series-2);
}

input[type="number"] {
  width: 100%;
  min-width: 0;
  padding: 0.35rem;
  color: var(--m257-text);
  background: var(--m257-surface);
  border: 1px solid var(--m257-border);
  border-radius: 0.35rem;
  font: inherit;
  font-size: 0.88rem;
  font-variant-numeric: tabular-nums;
}

.check {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.55rem 0;
  font-size: 0.88rem;
  cursor: pointer;
}

.check input {
  accent-color: var(--m257-accent);
}

.calculation,
.matrix-box,
.span-box {
  margin: 0.85rem 0;
  padding: 0.75rem;
  background: var(--m257-surface-muted);
  border: 1px solid var(--m257-border);
  border-radius: 0.65rem;
}

.formula {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.55rem;
  font-size: 0.93rem;
}

.term {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  white-space: nowrap;
}

.matrix {
  position: relative;
  display: inline-grid;
  row-gap: 0.15rem;
  padding: 0.25rem 0.4rem;
  text-align: center;
  font-variant-numeric: tabular-nums;
}

.matrix::before,
.matrix::after {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  width: 0.3rem;
  border: 1px solid currentColor;
}

.matrix::before {
  left: 0;
  border-right: 0;
}

.matrix::after {
  right: 0;
  border-left: 0;
}

.output {
  margin: 0.6rem 0 0;
  font-size: 0.9rem;
  font-weight: 600;
}

.span-box .note {
  margin: 0;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

@media (max-width: 760px) {
  .wrap {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>

<div class="wrap">
  <section class="view" aria-label="Linear combination visualization">
    <svg viewBox="0 0 640 640" role="img" aria-labelledby="plot-title plot-description">
      <title id="plot-title">Linear combinations in three dimensions</title>
      <desc id="plot-description"></desc>
      <g data-layer="grid"></g>
      <g data-layer="span"></g>
      <g data-layer="construction"></g>
      <g data-layer="axes"></g>
      <g data-layer="vectors"></g>
      <g data-layer="labels"></g>
    </svg>

    <div class="legend">
      <span class="first">a v₁</span>
      <span class="second">b v₂</span>
      <span class="result">w = a v₁ + b v₂</span>
    </div>

    <p class="caption">
      Drag to rotate. Dashed colored arrows are translated copies;
      thin arrows are the original vectors. Faint grid: z = 0.
    </p>

    <div class="toolbar" aria-label="Rotation controls">
      <button type="button" data-view="left" aria-label="Rotate left">←</button>
      <button type="button" data-view="right" aria-label="Rotate right">→</button>
      <button type="button" data-view="up" aria-label="Rotate up">↑</button>
      <button type="button" data-view="down" aria-label="Rotate down">↓</button>
      <button type="button" data-view="reset">Reset view</button>
    </div>

    <div class="toolbar" aria-label="Zoom controls">
      <button type="button" data-zoom="out" aria-label="Zoom out">−</button>
      <button type="button" data-zoom="reset" aria-label="Reset zoom to 100%">
        <span data-role="zoom">100%</span>
      </button>
      <button type="button" data-zoom="in" aria-label="Zoom in">+</button>
      <span class="note">Mouse wheel also zooms.</span>
    </div>
  </section>

  <section class="panel" aria-label="Coefficients and calculation">
    <h3>Linear combinations</h3>

    <div class="presets" aria-label="Vector presets">
      <button type="button" data-preset="independent">Independent vectors</button>
      <button type="button" data-preset="dependent">Dependent vectors</button>
      <button type="button" data-action="reset">Reset applet</button>
    </div>

    <p class="description" data-role="description"></p>

    <div class="coefficient">
      <label class="first" for="coefficient-a">a</label>
      <input id="coefficient-a" data-coefficient="a" type="range" min="-2" max="2" step="0.25" value="1">
      <input data-number="a" type="number" min="-2" max="2" step="0.25" value="1" aria-label="Enter coefficient a">
    </div>

    <div class="coefficient">
      <label class="second" for="coefficient-b">b</label>
      <input id="coefficient-b" data-coefficient="b" type="range" min="-2" max="2" step="0.25" value="1">
      <input data-number="b" type="number" min="-2" max="2" step="0.25" value="1" aria-label="Enter coefficient b">
    </div>

    <p class="note">
      −2 ≤ a, b ≤ 2; increments of 0.25.
      Type a number and press Enter to apply it.
    </p>

    <div class="calculation">
      <strong>w = a v₁ + b v₂</strong>
      <div class="formula" data-role="calculation" aria-hidden="true"></div>
      <p class="output" data-role="output" aria-live="polite" aria-atomic="true"></p>
      <p class="sr-only" data-role="calculation-description"></p>
    </div>

    <label class="check">
      <input type="checkbox" data-option="originals" checked>
      Show original vectors
    </label>

    <label class="check">
      <input type="checkbox" data-option="parallelogram">
      Show parallelogram
    </label>

    <label class="check">
      <input type="checkbox" data-option="span">
      Show span and reachable region
    </label>

    <label class="check">
      <input type="checkbox" data-option="matrix">
      Show matrix form
    </label>

    <div class="span-box" data-role="span-box" hidden>
      <p class="note" data-role="span-description"></p>
    </div>

    <div class="matrix-box" data-role="matrix-box" hidden>
      <strong>Same calculation: A(a, b)ᵀ = w</strong>
      <div class="formula" data-role="matrix-form" aria-hidden="true"></div>
      <p class="note">
        The columns of A are v₁ and v₂.
        Matrix–vector multiplication forms a linear combination of those columns.
      </p>
      <p class="sr-only" data-role="matrix-description"></p>
    </div>
  </section>
</div>
`;

export class Math257LinearCombinations3D extends HTMLElement {
  static get observedAttributes() {
    return ["preset"];
  }

  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.presetName = "independent";
    this.a = 1;
    this.b = 1;

    this.options = {
      originals: true,
      parallelogram: false,
      span: false,
      matrix: false,
    };

    Object.assign(this, INITIAL_VIEW);

    this.pointerId = null;
    this.initialized = false;

    this.svg = this.shadowRoot.querySelector("svg");
    this.elements = {};
    this.layers = {};

    this.shadowRoot.querySelectorAll("[data-role]").forEach((element) => {
      this.elements[element.dataset.role] = element;
    });

    this.shadowRoot.querySelectorAll("[data-layer]").forEach((element) => {
      this.layers[element.dataset.layer] = element;
    });
  }

  connectedCallback() {
    if (!this.initialized) {
      this.initialized = true;

      const name = this.getAttribute("preset");
      if (Object.hasOwn(PRESETS, name)) this.presetName = name;

      this.bindEvents();
    }

    this.resizeObserver = new ResizeObserver(([entry]) => {
      this.shadowRoot.querySelector(".wrap").classList.toggle(
        "stacked",
        entry.contentRect.width < 760
      );
    });

    this.resizeObserver.observe(this);
    this.render();
  }

  disconnectedCallback() {
    this.resizeObserver?.disconnect();
    this.pointerId = null;
    this.svg.classList.remove("dragging");
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this.initialized && oldValue !== newValue) {
      this.applyPreset(newValue || "independent");
    }
  }

  get vectors() {
    return PRESETS[this.presetName];
  }

  get result() {
    return add(
      mul(this.vectors.v1, this.a),
      mul(this.vectors.v2, this.b)
    );
  }

  reachableCorners() {
    const { v1, v2 } = this.vectors;

    return [
      [-LIMIT, -LIMIT],
      [LIMIT, -LIMIT],
      [LIMIT, LIMIT],
      [-LIMIT, LIMIT],
    ].map(([a, b]) => add(mul(v1, a), mul(v2, b)));
  }

  setCoefficients(a, b) {
    if (!Number.isFinite(a) || !Number.isFinite(b)) return false;

    const snap = (value) =>
      Math.round(Math.max(-LIMIT, Math.min(LIMIT, value)) / STEP) * STEP;

    this.a = snap(a);
    this.b = snap(b);

    this.render();
    this.emitChange();

    return true;
  }

  applyPreset(name) {
    if (!Object.hasOwn(PRESETS, name)) return false;

    this.presetName = name;
    this.a = 1;
    this.b = 1;
    this.zoom = 1;

    this.render();
    this.emitChange();

    return true;
  }

  reset() {
    this.options = {
      originals: true,
      parallelogram: false,
      span: false,
      matrix: false,
    };

    Object.assign(this, INITIAL_VIEW);

    const initial = this.getAttribute("preset");

    this.applyPreset(
      Object.hasOwn(PRESETS, initial) ? initial : "independent"
    );
  }

  setZoom(value) {
    if (!Number.isFinite(value)) return;

    this.zoom = Math.max(0.55, Math.min(2.5, value));
    this.drawScene();
  }

  emitChange() {
    this.dispatchEvent(new CustomEvent("math257-change", {
      bubbles: true,
      composed: true,
      detail: {
        component: "linear-combinations-3d",
        preset: this.presetName,
        coefficients: [this.a, this.b],
        vectors: [
          this.vectors.v1.slice(),
          this.vectors.v2.slice(),
        ],
        result: this.result,
      },
    }));
  }

  bindEvents() {
    this.shadowRoot.querySelectorAll("[data-coefficient]").forEach((input) => {
      input.addEventListener("input", () => {
        this.setCoefficients(
          input.dataset.coefficient === "a" ? input.valueAsNumber : this.a,
          input.dataset.coefficient === "b" ? input.valueAsNumber : this.b
        );
      });
    });

    this.shadowRoot.querySelectorAll("[data-number]").forEach((input) => {
      input.addEventListener("change", () => {
        if (!Number.isFinite(input.valueAsNumber)) {
          this.render();
          return;
        }

        this.setCoefficients(
          input.dataset.number === "a" ? input.valueAsNumber : this.a,
          input.dataset.number === "b" ? input.valueAsNumber : this.b
        );
      });
    });

    this.shadowRoot.querySelectorAll("[data-option]").forEach((input) => {
      input.addEventListener("change", () => {
        this.options[input.dataset.option] = input.checked;
        this.render();
      });
    });

    this.shadowRoot.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => {
        if (button.dataset.preset) {
          return this.applyPreset(button.dataset.preset);
        }

        if (button.dataset.action === "reset") {
          return this.reset();
        }

        if (button.dataset.zoom) {
          const mode = button.dataset.zoom;

          return this.setZoom(
            mode === "reset"
              ? 1
              : this.zoom * (mode === "in" ? 1.2 : 1 / 1.2)
          );
        }

        switch (button.dataset.view) {
          case "left":
            this.yaw -= 0.18;
            break;

          case "right":
            this.yaw += 0.18;
            break;

          case "up":
            this.pitch = Math.min(1.35, this.pitch + 0.18);
            break;

          case "down":
            this.pitch = Math.max(-1.35, this.pitch - 0.18);
            break;

          case "reset":
            Object.assign(this, INITIAL_VIEW);
            break;

          default:
            return;
        }

        this.drawScene();
      });
    });

    this.svg.addEventListener("wheel", (event) => {
      event.preventDefault();

      const pixels = event.deltaY * (
        event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? 640 : 1
      );

      this.setZoom(
        this.zoom * Math.exp(
          -Math.max(-200, Math.min(200, pixels)) * 0.001
        )
      );
    }, { passive: false });

    this.svg.addEventListener("pointerdown", (event) => {
      if (event.button !== 0 || this.pointerId !== null) return;

      this.pointerId = event.pointerId;
      this.lastX = event.clientX;
      this.lastY = event.clientY;

      this.svg.setPointerCapture(event.pointerId);
      this.svg.classList.add("dragging");
    });

    this.svg.addEventListener("pointermove", (event) => {
      if (event.pointerId !== this.pointerId) return;

      this.yaw += (event.clientX - this.lastX) * 0.008;

      this.pitch = Math.max(
        -1.35,
        Math.min(1.35, this.pitch + (event.clientY - this.lastY) * 0.008)
      );

      this.lastX = event.clientX;
      this.lastY = event.clientY;

      this.drawScene();
    });

    const stop = (event) => {
      if (event.pointerId !== this.pointerId) return;

      this.pointerId = null;
      this.svg.classList.remove("dragging");

      if (this.svg.hasPointerCapture(event.pointerId)) {
        this.svg.releasePointerCapture(event.pointerId);
      }
    };

    this.svg.addEventListener("pointerup", stop);
    this.svg.addEventListener("pointercancel", stop);
    this.svg.addEventListener("lostpointercapture", stop);
  }

  render() {
    const { v1, v2, description, span } = this.vectors;
    const w = this.result;

    this.shadowRoot.querySelectorAll("[data-coefficient], [data-number]").forEach((input) => {
      input.value = String(
        this[input.dataset.coefficient || input.dataset.number]
      );
    });

    this.shadowRoot.querySelectorAll("[data-option]").forEach((input) => {
      input.checked = this.options[input.dataset.option];
    });

    this.shadowRoot.querySelectorAll("[data-preset]").forEach((button) => {
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.preset === this.presetName)
      );
    });

    this.elements.description.textContent = description;

    this.elements.calculation.innerHTML = `
      <span class="term first">
        ${scalarText(this.a)} ${columnHTML(v1, COLORS.first)}
      </span>
      <span>+</span>
      <span class="term second">
        ${scalarText(this.b)} ${columnHTML(v2, COLORS.second)}
      </span>
      <span class="term result">
        = ${columnHTML(w, COLORS.result)}
      </span>
    `;

    this.elements.output.textContent =
      `w = ${vectorText(w)}${norm(w) < EPSILON ? " (zero vector)" : ""}`;

    this.elements["calculation-description"].textContent =
      `${this.a} times ${vectorText(v1)} plus ${this.b} times ${vectorText(v2)} equals ${vectorText(w)}.`;

    this.elements["span-box"].hidden = !this.options.span;
    this.elements["span-description"].textContent = span;
    this.elements["matrix-box"].hidden = !this.options.matrix;

    this.elements["matrix-form"].innerHTML = `
      <span class="term">
        ${matrixHTML(
          v1.map((value, i) => [value, v2[i]]),
          [COLORS.first, COLORS.second]
        )}
        ${columnHTML([this.a, this.b])}
      </span>
      <span class="term">
        = ${columnHTML(w, COLORS.result)}
      </span>
    `;

    this.elements["matrix-description"].textContent =
      `A has columns ${vectorText(v1)} and ${vectorText(v2)}; A times (${this.a}, ${this.b}) equals ${vectorText(w)}.`;

    this.shadowRoot.querySelector("#plot-description").textContent =
      `Original vectors: ${vectorText(v1)} and ${vectorText(v2)}. Coefficients: a = ${this.a}, b = ${this.b}. Sum: ${vectorText(w)}. Use the buttons to rotate and zoom.`;

    this.drawScene();
  }

  svgElement(name, attributes = {}) {
    const element = document.createElementNS(
      "http://www.w3.org/2000/svg",
      name
    );

    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, String(value));
    });

    return element;
  }

  // Orthographic projection: z is vertical.
  // Scaling stays fixed while sliders move.
  project(point) {
    const c = Math.cos(this.yaw);
    const s = Math.sin(this.yaw);
    const cp = Math.cos(this.pitch);
    const sp = Math.sin(this.pitch);

    const horizontal = c * point[0] - s * point[1];
    const depth = s * point[0] + c * point[1];
    const vertical = cp * point[2] - sp * depth;
    const scale = 265 * this.zoom / this.sceneRadius;

    return {
      x: 320 + scale * horizontal,
      y: 320 - scale * vertical,
    };
  }

  line(layer, start, end, attributes = {}) {
    const p = this.project(start);
    const q = this.project(end);

    layer.appendChild(this.svgElement("line", {
      x1: p.x,
      y1: p.y,
      x2: q.x,
      y2: q.y,
      ...attributes,
    }));
  }

  polygon(layer, points, attributes = {}) {
    layer.appendChild(this.svgElement("polygon", {
      points: points.map((point) => {
        const p = this.project(point);
        return `${p.x},${p.y}`;
      }).join(" "),
      ...attributes,
    }));
  }

  label(point, text, color = COLORS.result) {
    const p = this.project(point);
    this.pendingLabels.push({ ...p, text, color });
  }

  arrow(start, end, color, label = "", options = {}) {
    const layer = this.layers.vectors;
    const p = this.project(start);
    const q = this.project(end);

    const dx = q.x - p.x;
    const dy = q.y - p.y;
    const length = Math.hypot(dx, dy);
    const width = options.width || 4;
    const opacity = options.opacity ?? 1;

    if (length < 1) {
      layer.appendChild(this.svgElement("circle", {
        cx: q.x,
        cy: q.y,
        r: 3,
        fill: color,
        opacity,
      }));
    } else {
      const head = Math.min(options.head || 10, length * 0.45);
      const ux = dx / length;
      const uy = dy / length;
      const bx = q.x - ux * head;
      const by = q.y - uy * head;

      const attributes = {
        x1: p.x,
        y1: p.y,
        x2: bx,
        y2: by,
        stroke: color,
        "stroke-width": width,
        "stroke-linecap": "round",
        opacity,
      };

      if (options.dashed) {
        attributes["stroke-dasharray"] = "7 5";
      }

      layer.appendChild(this.svgElement("line", attributes));

      layer.appendChild(this.svgElement("polygon", {
        points:
          `${q.x},${q.y} ` +
          `${bx - uy * head * 0.45},${by + ux * head * 0.45} ` +
          `${bx + uy * head * 0.45},${by - ux * head * 0.45}`,
        fill: color,
        opacity,
      }));
    }

    if (label) this.label(end, label, color);
  }

  drawScene() {
    this.sceneRadius = Math.max(
      3,
      ...this.reachableCorners().map(norm)
    );

    Object.values(this.layers).forEach((layer) => {
      layer.replaceChildren();
    });

    this.pendingLabels = [];

    const { v1, v2 } = this.vectors;
    const u = mul(v1, this.a);
    const v = mul(v2, this.b);
    const w = add(u, v);

    const dependent = this.presetName === "dependent";
    const extent = dependent ? 6 : 4;

    // Coordinate grid and axes are context, not restrictions on the vectors.
    for (let i = -extent; i <= extent; i += 1) {
      this.line(
        this.layers.grid,
        [i, -extent, 0],
        [i, extent, 0],
        {
          stroke: "var(--m257-border)",
          "stroke-width": 1,
          opacity: 0.45,
        }
      );

      this.line(
        this.layers.grid,
        [-extent, i, 0],
        [extent, i, 0],
        {
          stroke: "var(--m257-border)",
          "stroke-width": 1,
          opacity: 0.45,
        }
      );
    }

    if (this.options.span) {
      this.drawSpan();
    }

    if (this.options.parallelogram && !dependent) {
      this.polygon(
        this.layers.construction,
        [ORIGIN, u, w, v],
        {
          fill: COLORS.span,
          "fill-opacity": 0.1,
          stroke: "none",
        }
      );
    }

    ["x", "y", "z"].forEach((name, index) => {
      const end = [0, 0, 0];
      end[index] = extent + 0.35;

      this.line(this.layers.axes, mul(end, -1), end, {
        stroke: "var(--m257-muted)",
        "stroke-width": 1.4,
        opacity: 0.7,
      });

      this.label(end, name, "var(--m257-muted)");
    });

    if (this.options.originals) {
      // At coefficient 1, the scaled arrow already displays the original vector.
      if (this.a !== 1) {
        this.arrow(ORIGIN, v1, COLORS.first, "v₁", {
          width: 1.6,
          opacity: 0.65,
          head: 7,
        });
      }

      if (this.b !== 1) {
        this.arrow(ORIGIN, v2, COLORS.second, "v₂", {
          width: 1.6,
          opacity: 0.65,
          head: 7,
        });
      }
    }

    // A broad neutral resultant behind collinear components keeps their colors visible.
    if (dependent && norm(w) > EPSILON) {
      this.arrow(ORIGIN, w, COLORS.result, "", {
        width: 8,
        opacity: 0.4,
        head: 14,
      });
    }

    this.arrow(
      ORIGIN,
      u,
      COLORS.first,
      norm(u) > EPSILON ? "a v₁" : ""
    );

    this.arrow(
      ORIGIN,
      v,
      COLORS.second,
      norm(v) > EPSILON ? "b v₂" : ""
    );

    if (norm(v) > EPSILON && norm(u) > EPSILON) {
      this.arrow(u, w, COLORS.second, "", {
        width: 3,
        dashed: true,
      });
    }

    if (
      this.options.parallelogram &&
      norm(u) > EPSILON &&
      norm(v) > EPSILON
    ) {
      this.arrow(v, w, COLORS.first, "", {
        width: 3,
        dashed: true,
      });
    }

    if (norm(w) < EPSILON) {
      const p = this.project(ORIGIN);

      this.layers.vectors.appendChild(this.svgElement("circle", {
        cx: p.x,
        cy: p.y,
        r: 7,
        fill: "var(--m257-surface-muted)",
        stroke: COLORS.result,
        "stroke-width": 2.5,
      }));

      this.label(ORIGIN, "w = 0");
    } else if (dependent) {
      this.label(w, "w");
    } else {
      this.arrow(ORIGIN, w, COLORS.result, "w", {
        width: 4.5,
        head: 12,
      });
    }

    this.drawLabels();

    this.elements.zoom.textContent =
      `${Math.round(this.zoom * 100)}%`;

    this.shadowRoot.querySelector('[data-zoom="in"]').disabled =
      this.zoom >= 2.5;

    this.shadowRoot.querySelector('[data-zoom="out"]').disabled =
      this.zoom <= 0.55;
  }

  drawSpan() {
    const layer = this.layers.span;
    const { v1, v2 } = this.vectors;
    const u = unit(v1);

    if (this.presetName === "dependent") {
      this.line(
        layer,
        mul(u, -this.sceneRadius * 1.1),
        mul(u, this.sceneRadius * 1.1),
        {
          stroke: COLORS.span,
          "stroke-width": 2,
          "stroke-dasharray": "8 6",
          opacity: 0.65,
        }
      );

      this.line(layer, mul(v1, -6), mul(v1, 6), {
        stroke: COLORS.span,
        "stroke-width": 10,
        opacity: 0.18,
      });

      return;
    }

    const normal = unit(cross(v1, v2));
    const v = cross(normal, u);

    const disk = Array.from({ length: 64 }, (_, i) => {
      const angle = i * 2 * Math.PI / 64;

      return add(
        mul(u, Math.cos(angle) * this.sceneRadius * 1.1),
        mul(v, Math.sin(angle) * this.sceneRadius * 1.1)
      );
    });

    this.polygon(layer, disk, {
      fill: COLORS.span,
      "fill-opacity": 0.07,
      stroke: "none",
    });

    this.polygon(layer, this.reachableCorners(), {
      fill: COLORS.span,
      "fill-opacity": 0.09,
      stroke: COLORS.span,
      "stroke-opacity": 0.65,
      "stroke-width": 1.8,
      "stroke-dasharray": "8 6",
    });
  }

  // Keep short SVG labels apart, including when several vectors coincide.
  drawLabels() {
    const occupied = [];

    for (const label of this.pendingLabels) {
      if (
        label.x < 0 ||
        label.x > 640 ||
        label.y < 0 ||
        label.y > 640
      ) {
        continue;
      }

      const width = label.text.length * 8 + 8;
      let box;

      const positions = [
        [10, -22],
        [10, 8],
        [-width - 10, -22],
        [-width - 10, 8],
        [10, 32],
        [-width - 10, -46],
      ];

      for (const [dx, dy] of positions) {
        box = {
          x: Math.max(8, Math.min(632 - width, label.x + dx)),
          y: Math.max(8, Math.min(610, label.y + dy)),
          width,
          height: 20,
        };

        const overlaps = occupied.some((other) =>
          box.x < other.x + other.width &&
          box.x + width > other.x &&
          box.y < other.y + other.height &&
          box.y + box.height > other.y
        );

        if (!overlaps) break;
      }

      occupied.push(box);

      const text = this.svgElement("text", {
        x: box.x + 4,
        y: box.y + 15,
        fill: label.color,
        "font-size": 15,
        "font-weight": 650,
        "paint-order": "stroke",
        stroke: "var(--m257-surface-muted)",
        "stroke-width": 4,
        "stroke-linejoin": "round",
      });

      text.textContent = label.text;
      this.layers.labels.appendChild(text);
    }
  }
}

if (!customElements.get("math257-linear-combinations-3d")) {
  customElements.define(
    "math257-linear-combinations-3d",
    Math257LinearCombinations3D
  );
}