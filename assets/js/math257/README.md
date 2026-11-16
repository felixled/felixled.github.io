# Math 257 interactive components

Dependency-free Web Components for Math 257: Linear Algebra with Computational Applications.

## Install in an al-folio/Jekyll site

Copy this folder to:

```text
assets/js/math257/
```

Then load the component library once. For example, in a page or layout:

```html
<script type="module" src="{{ '/assets/js/math257/math257.js' | relative_url }}"></script>
```

After that, use the 3D plane-system applet anywhere in Markdown/HTML:

```html
<math257-plane-system-3d></math257-plane-system-3d>
```

## Useful attributes

### Start from a preset

```html
<math257-plane-system-3d preset="pairwise"></math257-plane-system-3d>
```

Available presets:

- `point`
- `line`
- `pairwise`
- `same`
- `parallel`

### Supply your own equations

Each equation is `a,b,c,d`, meaning

`a x + b y + c z = d`.

Separate planes with semicolons:

```html
<math257-plane-system-3d
  equations="1,0,0,1; 0,1,0,2; 1,1,1,3">
</math257-plane-system-3d>
```

Two equations are also allowed:

```html
<math257-plane-system-3d
  equations="1,1,0,2; 0,1,1,1">
</math257-plane-system-3d>
```

### Other attributes

```html
<math257-plane-system-3d
  range="6"
  two-planes
  hide-pairwise>
</math257-plane-system-3d>
```

- `range`: half-width of the displayed cube, default `4`.
- `two-planes`: start with the third plane disabled.
- `hide-pairwise`: start with pairwise intersection lines hidden.

## JavaScript API

```js
const applet = document.querySelector("math257-plane-system-3d");

applet.setPlanes([
  [1, 0, 0, 1],
  [0, 1, 0, 2],
  [1, 1, 1, 3],
]);

applet.resetView();
```

The component emits `math257-change` whenever the coefficients or active equations change:

```js
applet.addEventListener("math257-change", (event) => {
  console.log(event.detail.planes);
  console.log(event.detail.result);
});
```

## Theme integration

The component inherits al-folio's usual CSS variables when they are present:

- `--global-text-color`
- `--global-text-color-light`
- `--global-bg-color`
- `--global-card-bg-color`
- `--global-divider-color`
- `--global-theme-color`

You can override Math 257-specific tokens on an individual applet or globally:

```css
math257-plane-system-3d {
  --m257-series-1: #3b82f6;
  --m257-series-2: #f97316;
  --m257-series-3: #10b981;
}
```

This lets future Math 257 components share the same visual language without depending on the rest of the site's CSS structure.
