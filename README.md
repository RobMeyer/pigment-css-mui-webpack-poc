# How to use

- install dependencies: `yarn install` (or use npm/pnpm)
- locally run dev mode: `yarn dev`
- build production build: `yarn build` (outputs to dist/)

# Methods and resulting production code

## Pigment CSS (sx)

```tsx
import Box from "@mui/material/Box";

export interface SquarePigmentSxProps {
  background: string;
}

export default function SquarePigmentSx(props: SquarePigmentSxProps) {
  return (
    <Box
      sx={{
        background: props.background,
        width: 50,
        height: 50,
        transition: "background 0.3s ease",
      }}
    />
  );
}
```

Generates the following style rule in main.css

```css
.s14ouwfs {
  background: var(--s14ouwfs-0);
  width: 50px;
  height: 50px;
  transition: background 0.3s ease;
}
```

React produces the following DOM at runtime:

```html
<div class="s14ouwfs MuiBox-root css-0" style="--s14ouwfs-0: #7f8b7e;"></div>
```

## Pigment CSS (css class)

```tsx
import Box from "@mui/material/Box";
import { css } from "@pigment-css/react";

export interface SquarePigmentCssProps {
  background: string;
}
const root = css({
  background: "var(--bk)",
  width: 50,
  height: 50,
  transition: "background 0.3s ease",
});

type CSSVars = React.CSSProperties & Record<`--${string}`, string | number>;

export default function SquarePigmentCss(props: SquarePigmentCssProps) {
  const style: CSSVars = { "--bk": props.background };
  return <Box className={root} style={style} />;
}
```

```css
.r1dzemar {
  background: var(--bk);
  width: 50px;
  height: 50px;
  transition: background 0.3s ease;
}
```

```html
<div class="r1dzemar MuiBox-root css-0" style="--bk: #7f8b7e;"></div>
```

## MUI makeStyles (with props)

```jsx
import Box from "@mui/material/Box";
import { makeStyles } from "@mui/styles";

export interface SquareMakeStylesWithPropsProps {
  background: string;
}

interface StyleProps {
  background: string;
}
const useStyles = makeStyles(function styleMaker() {
  return {
    root: {
      width: "50px",
      height: "50px",
      transition: "background 0.3s ease",
      background: function propsToBackground(props: StyleProps) {
        return props.background;
      },
    },
  };
});

export default function SquareMakeStylesWithProps(
  props: SquareMakeStylesWithPropsProps
) {
  const classes = useStyles({ background: props.background });
  return <Box className={classes.root} />;
}
```

Run-time generated css-in-js (inserted as style node in head)

```css
.jss1 {
  width: 50px;
  height: 50px;
  transition: background 0.3s ease;
}

.jss2 {
  background: rgb(0, 0, 255);
}

/* etc. (same rule repeated as .jss3 through .jss2048) */

.jss2049 {
  background: rgb(0, 0, 255);
}
```

```html
<div class="jss1 jss2 MuiBox-root css-0"></div>
<div class="jss1 jss3 MuiBox-root css-0"></div>
<!-- etc. same div pattern repeats...-->
<div class="jss1 jss2049 MuiBox-root css-0"></div>
```

# Benchmark results

Benchmarks collected on a MacBook Pro - M2 Pro 32 GB, MacOS Sequioa 15.5, Chrome 139.0.7258.67
@mui/material 5.18.0, @mui/styles 5.18.0, @pigment-css/react 0.0.30

All times are in milliseconds (ms).

## DevTools closed, no CPU throttle

### 1) Render 2048 components

| Method                      | Run 1 | Run 2 | Run 3 |
| --------------------------- | ----: | ----: | ----: |
| Pigment CSS (sx)            |  48.9 |  45.9 |  45.5 |
| Pigment CSS (css class)     |  46.1 |  39.4 |  33.8 |
| MUI makeStyles (with props) | 129.0 | 148.5 | 148.0 |

### 2) Prop change → style update

| Method                      | Run 1 | Run 2 | Run 3 |
| --------------------------- | ----: | ----: | ----: |
| Pigment CSS (sx)            |  43.7 |  45.4 |  45.8 |
| Pigment CSS (css class)     |  42.7 |  51.3 |  57.3 |
| MUI makeStyles (with props) | 102.6 | 103.7 |  93.5 |

### 3) Unmount 2048 components

| Method                      | Run 1 | Run 2 | Run 3 |
| --------------------------- | ----: | ----: | ----: |
| Pigment CSS (sx)            |   8.8 |   9.0 |   8.7 |
| Pigment CSS (css class)     |   9.1 |   8.5 |   9.3 |
| MUI makeStyles (with props) |  19.3 |  21.5 |  19.4 |

### 4) Styles present in the DOM

| Method                      | `<style>` tags in document | Style rules in main.css |
| --------------------------- | -------------------------: | ----------------------: |
| Pigment CSS (sx)            |                          0 |                       1 |
| Pigment CSS (css class)     |                          0 |                       1 |
| MUI makeStyles (with props) |                       2048 |                       — |

## DevTools open with 11.8x CPU slowdown (Chrome-calibrated "low-tier mobile")

### 1) Render 2048 components

| Method                      |  Run 1 |  Run 2 |  Run 3 |
| --------------------------- | -----: | -----: | -----: |
| Pigment CSS (sx)            |  413.9 |  379.6 |  387.5 |
| Pigment CSS (css class)     |  309.2 |  310.4 |  320.0 |
| MUI makeStyles (with props) | 1800.5 | 2090.0 | 1968.8 |

### 2) Prop change → style update

| Method                      | Run 1 |  Run 2 |  Run 3 |
| --------------------------- | ----: | -----: | -----: |
| Pigment CSS (sx)            | 572.3 |  640.3 |  652.2 |
| Pigment CSS (css class)     | 528.3 |  481.2 |  514.9 |
| MUI makeStyles (with props) | 989.2 | 1255.9 | 1292.6 |

### 3) Unmount 2048 components

| Method                      | Run 1 | Run 2 | Run 3 |
| --------------------------- | ----: | ----: | ----: |
| Pigment CSS (sx)            | 102.8 |  96.3 | 102.8 |
| Pigment CSS (css class)     |  94.4 | 100.9 | 102.9 |
| MUI makeStyles (with props) | 113.8 | 273.2 | 292.1 |
