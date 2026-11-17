import {
  EPS,
  add,
  cross,
  dot,
  mul,
  norm,
  sub,
  unit,
} from "../core/math3d.js";

import { sharedStyles } from "../core/theme.js";


const STEPS = [
  {
    title: "Initial system",
    operation: null,
    changedRow: null,

    rows: [
      [1, 1, 0, 3],
      [1, 3, -2, 7],
      [2, -1, 3, 0],
    ],

    explanation:
      "Three different planes contain the same line. We begin row reduction by turning the first column into the first standard basis vector (1, 0, 0)ᵀ.",
  },

  {
    title: "Eliminate x from row 2",
    operation: "R₂ ← R₂ − R₁",
    changedRow: 1,

    rows: [
      [1, 1, 0, 3],
      [0, 2, -2, 4],
      [2, -1, 3, 0],
    ],

    explanation:
      "The second entry of the first column is now zero. Geometrically, plane P₂ rotates about the fixed solution line.",
  },

  {
    title: "Eliminate x from row 3",
    operation: "R₃ ← R₃ − 2R₁",
    changedRow: 2,

    rows: [
      [1, 1, 0, 3],
      [0, 2, -2, 4],
      [0, -3, 3, -6],
    ],

    explanation:
      "The first column is now (1, 0, 0)ᵀ. Plane P₃ changes, but the common solution line remains fixed.",
  },

  {
    title: "Normalize the second pivot",
    operation: "R₂ ← ½R₂",
    changedRow: 1,

    rows: [
      [1, 1, 0, 3],
      [0, 1, -1, 2],
      [0, -3, 3, -6],
    ],

    explanation:
      "The second pivot is scaled to 1. Multiplying an equation by a nonzero scalar does not change its geometric plane. At this stage P₃ is the same plane as P₂.",
  },

  {
    title: "Eliminate below the second pivot",
    operation: "R₃ ← R₃ + 3R₂",
    changedRow: 2,

    rows: [
      [1, 1, 0, 3],
      [0, 1, -1, 2],
      [0, 0, 0, 0],
    ],

    explanation:
      "The third row becomes 0 = 0, so it imposes no constraint. Geometrically, the third plane disappears. The remaining two planes still intersect in the same line.",
  },

  {
    title: "Eliminate above the second pivot",
    operation: "R₁ ← R₁ − R₂",
    changedRow: 0,

    rows: [
      [1, 0, 1, 1],
      [0, 1, -1, 2],
      [0, 0, 0, 0],
    ],

    explanation:
      "The matrix is now in reduced row echelon form. Plane P₁ rotates one final time, while the solution line remains unchanged.",
  },
];


const SOLUTION_LINE = {
  point: [1, 2, 0],
  direction: [-1, 1, 1],
};


const template =
  document.createElement(
    "template"
  );


template.innerHTML = `
<style>
${sharedStyles}

:host {
  display: block;
}

.wrap {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(300px, 1fr);
  gap: 1rem;
  align-items: start;
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

  background:
    var(--m257-surface-muted);

  border:
    1px solid
    var(--m257-border);

  border-radius:
    0.75rem;

  touch-action: none;

  cursor: grab;
}

svg.dragging {
  cursor: grabbing;
}

.panel {
  min-width: 0;

  padding: 0.9rem;

  background:
    var(--m257-surface);

  border:
    1px solid
    var(--m257-border);

  border-radius:
    0.8rem;
}

.caption,
.small,
.explanation {
  color:
    var(--m257-muted);
}

.caption {
  display: flex;

  justify-content:
    space-between;

  gap: 0.6rem;

  flex-wrap: wrap;

  margin-top:
    0.45rem;

  font-size:
    0.8rem;
}

.rotate,
.zoom,
.step-controls {
  display: flex;

  flex-wrap: wrap;

  gap: 0.45rem;
}

.rotate {
  margin:
    0.65rem 0 0.35rem;
}

.zoom {
  margin-bottom:
    0.65rem;
}

button {
  min-height:
    2.6rem;

  padding:
    0.48rem 0.68rem;

  color:
    var(--m257-text);

  background:
    var(--m257-surface-muted);

  border:
    1px solid
    var(--m257-border);

  border-radius:
    0.6rem;

  font-size:
    0.82rem;

  font-weight:
    600;

  cursor:
    pointer;
}

button:hover:not(:disabled) {
  border-color:
    var(--m257-accent);
}

button:disabled {
  opacity:
    0.45;

  cursor:
    default;
}

.rotate button,
.zoom button {
  min-width:
    2.6rem;
}

.step-heading {
  margin-bottom:
    0.75rem;
}

.step-count {
  color:
    var(--m257-muted);

  font-size:
    0.78rem;

  font-weight:
    700;

  letter-spacing:
    0.04em;

  text-transform:
    uppercase;
}

.step-title {
  margin-top:
    0.18rem;

  font-size:
    1.08rem;

  font-weight:
    700;
}

.operation {
  margin:
    0.7rem 0;

  padding:
    0.65rem 0.75rem;

  background:
    var(--m257-surface-muted);

  border:
    1px solid
    var(--m257-border);

  border-radius:
    0.65rem;

  font-family:
    ui-monospace,
    SFMono-Regular,
    Menlo,
    Consolas,
    monospace;

  font-size:
    1rem;

  font-weight:
    700;
}

.operation.empty {
  color:
    var(--m257-muted);

  font-family:
    inherit;

  font-size:
    0.86rem;

  font-weight:
    500;
}

.matrix-wrap {
  overflow-x:
    auto;

  padding:
    0.15rem 0;
}

.matrix {
  display:
    inline-grid;

  gap:
    0.18rem;

  min-width:
    18rem;

  padding:
    0.45rem 0.55rem;

  border-left:
    2px solid
    var(--m257-text);

  border-right:
    2px solid
    var(--m257-text);
}

.matrix-row {
  display:
    grid;

  grid-template-columns:
    repeat(
      3,
      minmax(2rem, 1fr)
    )
    minmax(2.3rem, 1fr);

  align-items:
    center;

  border-radius:
    0.35rem;

  transition:
    background
    160ms
    ease;
}

.matrix-row.changed {
  background:
    color-mix(
      in srgb,
      var(--m257-accent) 14%,
      transparent
    );
}

.matrix-cell {
  padding:
    0.28rem 0.38rem;

  text-align:
    right;

  font-family:
    ui-monospace,
    SFMono-Regular,
    Menlo,
    Consolas,
    monospace;

  font-variant-numeric:
    tabular-nums;
}

.matrix-cell.aug {
  border-left:
    1px solid
    var(--m257-text);
}

.explanation {
  margin:
    0.8rem 0 0;

  font-size:
    0.88rem;

  line-height:
    1.45;
}

.invariant {
  margin-top:
    0.85rem;

  padding:
    0.75rem;

  background:
    var(--m257-surface-muted);

  border:
    1px solid
    var(--m257-border);

  border-radius:
    0.65rem;
}

.invariant strong {
  display:
    block;

  margin-bottom:
    0.25rem;
}

.invariant .math {
  font-family:
    ui-monospace,
    SFMono-Regular,
    Menlo,
    Consolas,
    monospace;

  font-size:
    0.88rem;
}

.step-controls {
  justify-content:
    space-between;

  align-items:
    center;

  margin-top:
    0.9rem;
}

.step-controls .middle {
  color:
    var(--m257-muted);

  font-size:
    0.82rem;

  font-weight:
    600;
}

.restart {
  margin-top:
    0.55rem;

  width:
    100%;
}

@media (max-width: 760px) {
  .wrap {
    grid-template-columns:
      1fr;
  }
}

@media (max-width: 420px) {
  .matrix {
    min-width:
      15.5rem;
  }
}
</style>


<div class="wrap">

  <section class="view">

    <svg
      viewBox="0 0 640 640"
      role="img"
      aria-labelledby="title desc"
    >

      <title id="title">
        Row reduction and three planes
      </title>

      <desc id="desc">
        Three planes change under elementary
        row operations while their common
        intersection line remains fixed.
      </desc>

      <g data-layer="cube"></g>

      <g data-layer="planes"></g>

      <g data-layer="solution"></g>

      <g data-layer="axes"></g>

    </svg>


    <div class="caption">

      <span>
        Drag to rotate. The thick line
        is the invariant solution set.
      </span>

      <span data-role="range-caption"></span>

    </div>


    <div
      class="rotate"
      aria-label="Rotation controls"
    >

      <button
        type="button"
        data-rotate="left"
        aria-label="Rotate left"
      >
        ←
      </button>

      <button
        type="button"
        data-rotate="right"
        aria-label="Rotate right"
      >
        →
      </button>

      <button
        type="button"
        data-rotate="up"
        aria-label="Rotate up"
      >
        ↑
      </button>

      <button
        type="button"
        data-rotate="down"
        aria-label="Rotate down"
      >
        ↓
      </button>

      <button
        type="button"
        data-rotate="reset"
      >
        Reset view
      </button>

    </div>


    <div
      class="zoom"
      aria-label="Zoom controls"
    >

      <button
        type="button"
        data-zoom="out"
        aria-label="Zoom out"
      >
        −
      </button>

      <button
        type="button"
        data-zoom="reset"
        aria-label="Reset zoom"
      >

        <span data-role="zoom-label">
          100%
        </span>

      </button>

      <button
        type="button"
        data-zoom="in"
        aria-label="Zoom in"
      >
        +
      </button>

    </div>

  </section>


  <section class="panel">

    <div class="step-heading">

      <div
        class="step-count"
        data-role="step-count"
      ></div>

      <div
        class="step-title"
        data-role="step-title"
      ></div>

    </div>


    <div
      class="operation"
      data-role="operation"
    ></div>


    <div class="matrix-wrap">

      <div
        class="matrix"
        data-role="matrix"
        aria-label="Augmented matrix"
      ></div>

    </div>


    <p
      class="explanation"
      data-role="explanation"
    ></p>


    <div class="invariant">

      <strong>
        Solution set stays fixed
      </strong>

      <div class="math">
        (x, y, z) = (1, 2, 0) + t(−1, 1, 1),
        &nbsp;t ∈ ℝ
      </div>

    </div>


    <div class="step-controls">

      <button
        type="button"
        data-step="prev"
      >
        ← Previous
      </button>

      <span
        class="middle"
        data-role="progress"
      ></span>

      <button
        type="button"
        data-step="next"
      >
        Next →
      </button>

    </div>


    <button
      type="button"
      class="restart"
      data-step="restart"
    >
      Restart
    </button>

  </section>

</div>
`;


export class Math257RowReduction3D
  extends HTMLElement {

  constructor() {
    super();

    this.attachShadow({
      mode: "open",
    });

    this.shadowRoot.appendChild(
      template.content.cloneNode(true)
    );


    this.stepIndex =
      0;

    this.displayRows =
      this.cloneRows(
        STEPS[0].rows
      );

    this.animating =
      false;

    this.animationToken =
      0;


    this.range =
      4;

    this.zoom =
      1;

    this.yaw =
      -0.65;

    this.pitch =
      0.48;


    this.dragging =
      false;

    this.lastX =
      0;

    this.lastY =
      0;


    this.svg =
      this.shadowRoot.querySelector(
        "svg"
      );

    this.cubeLayer =
      this.shadowRoot.querySelector(
        '[data-layer="cube"]'
      );

    this.planeLayer =
      this.shadowRoot.querySelector(
        '[data-layer="planes"]'
      );

    this.solutionLayer =
      this.shadowRoot.querySelector(
        '[data-layer="solution"]'
      );

    this.axisLayer =
      this.shadowRoot.querySelector(
        '[data-layer="axes"]'
      );


    this.stepCount =
      this.shadowRoot.querySelector(
        '[data-role="step-count"]'
      );

    this.stepTitle =
      this.shadowRoot.querySelector(
        '[data-role="step-title"]'
      );

    this.operation =
      this.shadowRoot.querySelector(
        '[data-role="operation"]'
      );

    this.matrix =
      this.shadowRoot.querySelector(
        '[data-role="matrix"]'
      );

    this.explanation =
      this.shadowRoot.querySelector(
        '[data-role="explanation"]'
      );

    this.progress =
      this.shadowRoot.querySelector(
        '[data-role="progress"]'
      );

    this.rangeCaption =
      this.shadowRoot.querySelector(
        '[data-role="range-caption"]'
      );

    this.zoomLabel =
      this.shadowRoot.querySelector(
        '[data-role="zoom-label"]'
      );


    this.prevButton =
      this.shadowRoot.querySelector(
        '[data-step="prev"]'
      );

    this.nextButton =
      this.shadowRoot.querySelector(
        '[data-step="next"]'
      );

    this.restartButton =
      this.shadowRoot.querySelector(
        '[data-step="restart"]'
      );
  }


  connectedCallback() {
    this.bindEvents();

    this.render();
  }


  cloneRows(rows) {
    return rows.map(
      (row) =>
        row.slice()
    );
  }


  rowToPlane(row) {
    return {
      a:
        row[0],

      b:
        row[1],

      c:
        row[2],

      d:
        row[3],
    };
  }


  interpolateRows(
    fromRows,
    toRows,
    t
  ) {
    return fromRows.map(
      (
        row,
        i
      ) =>
        row.map(
          (
            value,
            j
          ) =>
            value +
            t *
            (
              toRows[i][j] -
              value
            )
        )
    );
  }


  ease(t) {
    return (
      t < 0.5
    )

      ? 4 *
        t *
        t *
        t

      : 1 -
        Math.pow(
          -2 * t + 2,
          3
        ) /
        2;
  }


  animateTo(
    targetIndex
  ) {
    if (
      this.animating ||

      targetIndex < 0 ||

      targetIndex >=
        STEPS.length ||

      targetIndex ===
        this.stepIndex
    ) {
      return;
    }


    const fromIndex =
      this.stepIndex;


    const fromRows =
      this.cloneRows(
        STEPS[fromIndex].rows
      );


    const toRows =
      this.cloneRows(
        STEPS[targetIndex].rows
      );


    const forward =
      targetIndex >
      fromIndex;


    const transitionStep =
      forward
        ? targetIndex
        : fromIndex;


    const changedRow =
      STEPS[
        transitionStep
      ].changedRow;


    const duration =
      850;


    const token =
      ++this.animationToken;


    this.animating =
      true;


    this.updateButtons();


    let start =
      null;


    const frame =
      (timestamp) => {

        if (
          token !==
          this.animationToken
        ) {
          return;
        }


        if (
          start === null
        ) {
          start =
            timestamp;
        }


        const raw =
          Math.min(
            1,

            (
              timestamp -
              start
            ) /
            duration
          );


        const eased =
          this.ease(
            raw
          );


        this.displayRows =
          this.interpolateRows(
            fromRows,
            toRows,
            eased
          );


        this.renderScene({
          changedRow,

          progress:
            forward
              ? eased
              : 1 - eased,

          transitionStep,
        });


        this.renderPanel(
          targetIndex,
          changedRow,
          true
        );


        if (
          raw < 1
        ) {
          requestAnimationFrame(
            frame
          );

          return;
        }


        this.stepIndex =
          targetIndex;


        this.displayRows =
          this.cloneRows(
            STEPS[
              this.stepIndex
            ].rows
          );


        this.animating =
          false;


        this.render();
      };


    requestAnimationFrame(
      frame
    );
  }


  jumpToStart() {
    if (
      this.animating
    ) {
      this.animationToken +=
        1;

      this.animating =
        false;
    }


    this.stepIndex =
      0;


    this.displayRows =
      this.cloneRows(
        STEPS[0].rows
      );


    this.render();
  }


  bindEvents() {

    this.prevButton
      .addEventListener(
        "click",
        () => {

          this.animateTo(
            this.stepIndex -
            1
          );
        }
      );


    this.nextButton
      .addEventListener(
        "click",
        () => {

          this.animateTo(
            this.stepIndex +
            1
          );
        }
      );


    this.restartButton
      .addEventListener(
        "click",
        () => {

          this.jumpToStart();
        }
      );


    this.shadowRoot
      .querySelectorAll(
        "[data-rotate]"
      )
      .forEach(
        (button) => {

          button.addEventListener(
            "click",
            () => {

              const step =
                0.18;


              switch (
                button.dataset.rotate
              ) {

                case "left":

                  this.yaw -=
                    step;

                  break;


                case "right":

                  this.yaw +=
                    step;

                  break;


                case "up":

                  this.pitch =
                    Math.min(
                      1.35,
                      this.pitch +
                      step
                    );

                  break;


                case "down":

                  this.pitch =
                    Math.max(
                      -1.35,
                      this.pitch -
                      step
                    );

                  break;


                case "reset":

                  this.yaw =
                    -0.65;

                  this.pitch =
                    0.48;

                  this.zoom =
                    1;

                  break;


                default:

                  return;
              }


              this.renderScene();

              this.updateViewLabels();
            }
          );
        }
      );


    this.shadowRoot
      .querySelectorAll(
        "[data-zoom]"
      )
      .forEach(
        (button) => {

          button.addEventListener(
            "click",
            () => {

              switch (
                button.dataset.zoom
              ) {

                case "in":

                  this.zoom =
                    Math.min(
                      2.5,
                      this.zoom *
                      1.2
                    );

                  break;


                case "out":

                  this.zoom =
                    Math.max(
                      0.55,
                      this.zoom /
                      1.2
                    );

                  break;


                case "reset":

                  this.zoom =
                    1;

                  break;


                default:

                  return;
              }


              this.renderScene();

              this.updateViewLabels();
            }
          );
        }
      );


    this.svg.addEventListener(
      "wheel",

      (event) => {

        event.preventDefault();


        this.zoom =
          Math.max(
            0.55,

            Math.min(
              2.5,

              this.zoom *
              Math.exp(
                -event.deltaY *
                0.001
              )
            )
          );


        this.renderScene();

        this.updateViewLabels();
      },

      {
        passive:
          false,
      }
    );


    this.svg.addEventListener(
      "pointerdown",

      (event) => {

        this.dragging =
          true;


        this.lastX =
          event.clientX;

        this.lastY =
          event.clientY;


        this.svg
          .classList
          .add(
            "dragging"
          );


        this.svg
          .setPointerCapture(
            event.pointerId
          );
      }
    );


    this.svg.addEventListener(
      "pointermove",

      (event) => {

        if (
          !this.dragging
        ) {
          return;
        }


        const dx =
          event.clientX -
          this.lastX;


        const dy =
          event.clientY -
          this.lastY;


        this.lastX =
          event.clientX;

        this.lastY =
          event.clientY;


        this.yaw +=
          dx *
          0.008;


        this.pitch =
          Math.max(
            -1.35,

            Math.min(
              1.35,

              this.pitch +
              dy *
              0.008
            )
          );


        this.renderScene();
      }
    );


    const stopDragging =
      (event) => {

        this.dragging =
          false;


        this.svg
          .classList
          .remove(
            "dragging"
          );


        if (
          this.svg
            .hasPointerCapture?.(
              event.pointerId
            )
        ) {

          this.svg
            .releasePointerCapture(
              event.pointerId
            );
        }
      };


    this.svg.addEventListener(
      "pointerup",
      stopDragging
    );


    this.svg.addEventListener(
      "pointercancel",
      stopDragging
    );
  }


  render() {

    this.renderScene();


    this.renderPanel(
      this.stepIndex,
      STEPS[
        this.stepIndex
      ].changedRow,
      false
    );


    this.updateViewLabels();

    this.updateButtons();
  }


  renderPanel(
    stepIndex,
    changedRow,
    duringTransition
  ) {

    const step =
      STEPS[
        stepIndex
      ];


    this.stepCount.textContent =
      (
        stepIndex === 0
      )

        ? "Starting system"

        : `Row operation ${stepIndex} of ${STEPS.length - 1}`;


    this.stepTitle.textContent =
      step.title;


    if (
      step.operation
    ) {

      this.operation.textContent =
        step.operation;


      this.operation
        .classList
        .remove(
          "empty"
        );

    } else {

      this.operation.textContent =
        "No row operation yet";


      this.operation
        .classList
        .add(
          "empty"
        );
    }


    this.explanation.textContent =
      step.explanation;


    this.progress.textContent =
      `Step ${stepIndex} / ${STEPS.length - 1}`;


    this.renderMatrix(
      this.displayRows,
      changedRow,
      duringTransition
    );
  }


  renderMatrix(
    rows,
    changedRow,
    duringTransition
  ) {

    this.matrix
      .replaceChildren();


    rows.forEach(
      (
        row,
        rowIndex
      ) => {

        const rowElement =
          document.createElement(
            "div"
          );


        rowElement.className =
          "matrix-row";


        if (
          rowIndex ===
            changedRow &&

          (
            duringTransition ||
            this.stepIndex > 0
          )
        ) {

          rowElement
            .classList
            .add(
              "changed"
            );
        }


        row.forEach(
          (
            value,
            columnIndex
          ) => {

            const cell =
              document.createElement(
                "span"
              );


            cell.className =
              "matrix-cell";


            if (
              columnIndex === 3
            ) {

              cell
                .classList
                .add(
                  "aug"
                );
            }


            cell.textContent =
              this.formatNumber(
                value
              );


            rowElement
              .appendChild(
                cell
              );
          }
        );


        this.matrix
          .appendChild(
            rowElement
          );
      }
    );
  }


  updateButtons() {

    this.prevButton.disabled =
      this.animating ||
      this.stepIndex === 0;


    this.nextButton.disabled =
      this.animating ||
      this.stepIndex ===
        STEPS.length - 1;


    this.restartButton.disabled =
      this.animating ||
      this.stepIndex === 0;
  }


  updateViewLabels() {

    this.rangeCaption.textContent =
      `Cube: −${this.range} ≤ x,y,z ≤ ${this.range}`;


    this.zoomLabel.textContent =
      `${Math.round(
        this.zoom *
        100
      )}%`;
  }


  renderScene(
    transition = null
  ) {

    this.drawCube();


    this.drawPlanes(
      this.displayRows,
      transition
    );


    this.drawSolutionLine();

    this.drawAxes();
  }


  formatNumber(
    value
  ) {

    const x =
      Math.abs(
        value
      ) <
      1e-8

        ? 0
        : value;


    if (
      Math.abs(
        x -
        Math.round(x)
      ) <
      1e-8
    ) {

      return String(
        Math.round(x)
      );
    }


    const twice =
      x * 2;


    if (
      Math.abs(
        twice -
        Math.round(twice)
      ) <
      1e-8
    ) {

      const numerator =
        Math.round(
          twice
        );


      return `${numerator}/2`;
    }


    return x
      .toFixed(2)
      .replace(
        /0+$/,
        ""
      )
      .replace(
        /\.$/,
        ""
      );
  }


  svgElement(
    name,
    attributes = {}
  ) {

    const element =
      document.createElementNS(
        "http://www.w3.org/2000/svg",
        name
      );


    for (
      const [
        key,
        value,
      ]
      of Object.entries(
        attributes
      )
    ) {

      element.setAttribute(
        key,
        String(value)
      );
    }


    return element;
  }


  rotatePoint(
    point
  ) {

    const cy =
      Math.cos(
        this.yaw
      );


    const sy =
      Math.sin(
        this.yaw
      );


    const cp =
      Math.cos(
        this.pitch
      );


    const sp =
      Math.sin(
        this.pitch
      );


    const x1 =
      cy *
      point[0] +
      sy *
      point[2];


    const z1 =
      -sy *
      point[0] +
      cy *
      point[2];


    const y2 =
      cp *
      point[1] -
      sp *
      z1;


    const z2 =
      sp *
      point[1] +
      cp *
      z1;


    return [
      x1,
      y2,
      z2,
    ];
  }


  project(
    point
  ) {

    const rotated =
      this.rotatePoint(
        point
      );


    const perspective =
      15 /
      (
        15 -
        rotated[2]
      );


    const scale =
      (
        232 /
        this.range
      ) *
      perspective *
      this.zoom;


    return {
      x:
        320 +
        rotated[0] *
        scale,

      y:
        320 -
        rotated[1] *
        scale,

      z:
        rotated[2],
    };
  }


  get cubeVertices() {

    const values = [
      -this.range,
      this.range,
    ];


    const vertices =
      [];


    for (
      const x
      of values
    ) {

      for (
        const y
        of values
      ) {

        for (
          const z
          of values
        ) {

          vertices.push(
            [
              x,
              y,
              z,
            ]
          );
        }
      }
    }


    return vertices;
  }


  get cubeEdges() {

    const vertices =
      this.cubeVertices;


    const edges =
      [];


    for (
      let i = 0;
      i <
      vertices.length;
      i += 1
    ) {

      for (
        let j = i + 1;
        j <
        vertices.length;
        j += 1
      ) {

        let differences =
          0;


        for (
          let k = 0;
          k < 3;
          k += 1
        ) {

          if (
            vertices[i][k] !==
            vertices[j][k]
          ) {

            differences +=
              1;
          }
        }


        if (
          differences === 1
        ) {

          edges.push(
            [
              vertices[i],
              vertices[j],
            ]
          );
        }
      }
    }


    return edges;
  }


  planePolygon(
    plane
  ) {

    const normal = [
      plane.a,
      plane.b,
      plane.c,
    ];


    if (
      norm(
        normal
      ) <
      EPS
    ) {

      return [];
    }


    const points =
      [];


    for (
      const [
        p0,
        p1,
      ]
      of this.cubeEdges
    ) {

      const f0 =
        dot(
          normal,
          p0
        ) -
        plane.d;


      const f1 =
        dot(
          normal,
          p1
        ) -
        plane.d;


      if (
        Math.abs(f0) <
        EPS
      ) {

        points.push(
          p0.slice()
        );
      }


      if (
        Math.abs(f1) <
        EPS
      ) {

        points.push(
          p1.slice()
        );
      }


      if (
        f0 *
        f1 <
        0
      ) {

        const t =
          f0 /
          (
            f0 -
            f1
          );


        points.push(
          add(
            p0,

            mul(
              sub(
                p1,
                p0
              ),

              t
            )
          )
        );
      }
    }


    const unique =
      [];


    for (
      const point
      of points
    ) {

      if (
        !unique.some(
          (candidate) =>
            norm(
              sub(
                candidate,
                point
              )
            ) <
            1e-6
        )
      ) {

        unique.push(
          point
        );
      }
    }


    if (
      unique.length <
      3
    ) {

      return [];
    }


    const center =
      mul(
        unique.reduce(
          (
            sum,
            point
          ) =>
            add(
              sum,
              point
            ),

          [
            0,
            0,
            0,
          ]
        ),

        1 /
        unique.length
      );


    const n =
      unit(
        normal
      );


    const reference =
      Math.abs(
        n[2]
      ) <
      0.8

        ? [
            0,
            0,
            1,
          ]

        : [
            0,
            1,
            0,
          ];


    const u =
      unit(
        cross(
          n,
          reference
        )
      );


    const v =
      cross(
        n,
        u
      );


    unique.sort(
      (
        a,
        b
      ) => {

        const angleA =
          Math.atan2(
            dot(
              sub(
                a,
                center
              ),
              v
            ),

            dot(
              sub(
                a,
                center
              ),
              u
            )
          );


        const angleB =
          Math.atan2(
            dot(
              sub(
                b,
                center
              ),
              v
            ),

            dot(
              sub(
                b,
                center
              ),
              u
            )
          );


        return (
          angleA -
          angleB
        );
      }
    );


    return unique;
  }


  clipLine(
    line
  ) {

    let low =
      -Infinity;


    let high =
      Infinity;


    for (
      let k = 0;
      k < 3;
      k += 1
    ) {

      const p =
        line.point[k];


      const v =
        line.direction[k];


      if (
        Math.abs(v) <
        EPS
      ) {

        if (
          p <
            -this.range -
            EPS

          ||

          p >
            this.range +
            EPS
        ) {

          return null;
        }


        continue;
      }


      let t1 =
        (
          -this.range -
          p
        ) /
        v;


      let t2 =
        (
          this.range -
          p
        ) /
        v;


      if (
        t1 >
        t2
      ) {

        [
          t1,
          t2,
        ] =
          [
            t2,
            t1,
          ];
      }


      low =
        Math.max(
          low,
          t1
        );


      high =
        Math.min(
          high,
          t2
        );
    }


    if (
      low >
      high
    ) {

      return null;
    }


    return [
      add(
        line.point,

        mul(
          line.direction,
          low
        )
      ),

      add(
        line.point,

        mul(
          line.direction,
          high
        )
      ),
    ];
  }


  drawCube() {

    this.cubeLayer
      .replaceChildren();


    for (
      const [
        a,
        b,
      ]
      of this.cubeEdges
    ) {

      const p =
        this.project(
          a
        );


      const q =
        this.project(
          b
        );


      this.cubeLayer
        .appendChild(
          this.svgElement(
            "line",
            {
              x1:
                p.x,

              y1:
                p.y,

              x2:
                q.x,

              y2:
                q.y,

              stroke:
                "var(--m257-border)",

              "stroke-width":
                1.25,
            }
          )
        );
    }
  }


  drawAxes() {

    this.axisLayer
      .replaceChildren();


    const origin =
      this.project(
        [
          0,
          0,
          0,
        ]
      );


    const extension =
      this.range +
      0.55;


    const axes = [
      [
        [
          extension,
          0,
          0,
        ],
        "x",
      ],

      [
        [
          0,
          extension,
          0,
        ],
        "y",
      ],

      [
        [
          0,
          0,
          extension,
        ],
        "z",
      ],
    ];


    for (
      const [
        end,
        label,
      ]
      of axes
    ) {

      const point =
        this.project(
          end
        );


      this.axisLayer
        .appendChild(
          this.svgElement(
            "line",
            {
              x1:
                origin.x,

              y1:
                origin.y,

              x2:
                point.x,

              y2:
                point.y,

              stroke:
                "var(--m257-text)",

              "stroke-width":
                2,
            }
          )
        );


      const text =
        this.svgElement(
          "text",
          {
            x:
              point.x +
              5,

            y:
              point.y -
              5,

            fill:
              "var(--m257-text)",

            "font-size":
              16,

            "font-weight":
              700,
          }
        );


      text.textContent =
        label;


      this.axisLayer
        .appendChild(
          text
        );
    }
  }


  drawPlanes(
    rows,
    transition = null
  ) {

    this.planeLayer
      .replaceChildren();


    const items =
      [];


    rows.forEach(
      (
        row,
        index
      ) => {

        const plane =
          this.rowToPlane(
            row
          );


        const polygon =
          this.planePolygon(
            plane
          );


        if (
          polygon.length <
          3
        ) {

          return;
        }


        const projected =
          polygon.map(
            (point) =>
              this.project(
                point
              )
          );


        const depth =
          projected.reduce(
            (
              sum,
              point
            ) =>
              sum +
              point.z,

            0
          ) /
          projected.length;


        items.push({
          index,
          projected,
          depth,
        });
      }
    );


    items.sort(
      (
        a,
        b
      ) =>
        a.depth -
        b.depth
    );


    for (
      const item
      of items
    ) {

      const color =
        `var(--m257-series-${item.index + 1})`;


      let fillOpacity =
        0.25;


      let strokeOpacity =
        0.9;


      let dash =
        null;


      if (
        transition &&

        transition.transitionStep ===
          5 &&

        item.index ===
          2
      ) {

        fillOpacity *=
          1 -
          transition.progress;


        strokeOpacity *=
          1 -
          transition.progress;
      }


      const currentStep =
        transition?.transitionStep ??
        this.stepIndex;


      if (
        currentStep === 4 &&
        item.index === 2
      ) {

        fillOpacity =
          0.08;


        dash =
          "8 5";
      }


      const attributes = {
        points:
          item.projected
            .map(
              (point) =>
                `${point.x},${point.y}`
            )
            .join(" "),

        fill:
          color,

        stroke:
          color,

        "fill-opacity":
          fillOpacity,

        "stroke-opacity":
          strokeOpacity,

        "stroke-width":
          2.5,

        "stroke-linejoin":
          "round",
      };


      if (
        dash
      ) {

        attributes[
          "stroke-dasharray"
        ] =
          dash;
      }


      this.planeLayer
        .appendChild(
          this.svgElement(
            "polygon",
            attributes
          )
        );


      if (
        strokeOpacity <
        0.08
      ) {

        continue;
      }


      const x =
        item.projected.reduce(
          (
            sum,
            point
          ) =>
            sum +
            point.x,

          0
        ) /
        item.projected.length;


      const y =
        item.projected.reduce(
          (
            sum,
            point
          ) =>
            sum +
            point.y,

          0
        ) /
        item.projected.length;


      const label =
        this.svgElement(
          "text",
          {
            x,

            y:
              y +
              (
                item.index === 2 &&
                currentStep === 4

                  ? 18

                  : 0
              ),

            fill:
              "var(--m257-text)",

            "font-size":
              15,

            "font-weight":
              700,

            "text-anchor":
              "middle",

            "paint-order":
              "stroke",

            stroke:
              "var(--m257-surface-muted)",

            "stroke-width":
              4,

            "stroke-opacity":
              strokeOpacity,

            "fill-opacity":
              strokeOpacity,
          }
        );


      label.textContent =
        (
          item.index === 2 &&
          currentStep === 4
        )

          ? "P₃ = P₂"

          : `P${item.index + 1}`;


      this.planeLayer
        .appendChild(
          label
        );
    }
  }


  drawSolutionLine() {

    this.solutionLayer
      .replaceChildren();


    const segment =
      this.clipLine(
        SOLUTION_LINE
      );


    if (
      !segment
    ) {

      return;
    }


    const p =
      this.project(
        segment[0]
      );


    const q =
      this.project(
        segment[1]
      );


    this.solutionLayer
      .appendChild(
        this.svgElement(
          "line",
          {
            x1:
              p.x,

            y1:
              p.y,

            x2:
              q.x,

            y2:
              q.y,

            stroke:
              "var(--m257-accent)",

            "stroke-width":
              7,

            "stroke-linecap":
              "round",

            "stroke-opacity":
              0.95,
          }
        )
      );


    const labelPoint =
      this.project(
        add(
          SOLUTION_LINE.point,

          mul(
            SOLUTION_LINE.direction,
            1.2
          )
        )
      );


    const label =
      this.svgElement(
        "text",
        {
          x:
            labelPoint.x +
            8,

          y:
            labelPoint.y -
            8,

          fill:
            "var(--m257-accent)",

          "font-size":
            17,

          "font-weight":
            800,

          "paint-order":
            "stroke",

          stroke:
            "var(--m257-surface-muted)",

          "stroke-width":
            4,
        }
      );


    label.textContent =
      "L";


    this.solutionLayer
      .appendChild(
        label
      );
  }
}


if (
  !customElements.get(
    "math257-row-reduction-3d"
  )
) {

  customElements.define(
    "math257-row-reduction-3d",
    Math257RowReduction3D
  );
}
