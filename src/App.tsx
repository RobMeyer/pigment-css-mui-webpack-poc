import { lazy, Suspense, useRef, useState } from 'react';
import { css } from '@pigment-css/react';
// import { styled, css, keyframes } from '@pigment-css/react';

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import SquarePigmentCss from './SquarePigmentCss';
import SquarePigmentSx from './SquarePigmentSx';
import SquareMakeStylesWithProps from './SquareMakeStylesWithProps';
const LazySquare = lazy(() => delayForDemo(import('./SquarePigmentSx')));

const buttonClass = css({
  background: 'lightcyan',
  margin: '10px',
  "&:hover": {
    background: 'aquamarine',
  }
});

const divClass = css({
  background: 'rebeccapurple',
  borderRadius: '8px',
  width: 50,
  height: 50,
  margin: 10,
  "&:hover": {
    background: 'mediumpurple',
  }
})

export function App() {
  const [color, setColor] = useState('#0000ff');
  const [stressTestMode, setStressTestMode] = useState<'none' | 'makeStylesWithProp' | 'pigmentSx' | 'pigmentCss'>('none');
  const [squareCount, setSquareCount] = useState(2048);

  const stressTestColorChangeStartTimeRef = useRef<number | null>(null);
  const [stressTestColorChangeDuration, setStressTestColorChangeDuration] = useState<number | null>(null);

  const stressTestModeChangeStartTimeRef = useRef<number | null>(null);
  const [stressTestModeChangeDuration, setStressTestModeChangeDuration] = useState<number | null>(null);

  const changeColor = () => {
    const randomHexColor = `#${Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, "0")}`;


    performance.mark('color-change-start');
    stressTestColorChangeStartTimeRef.current = performance.now();

    setColor(randomHexColor);
    
    setTimeout(() => {
      const duration = performance.now() - (stressTestColorChangeStartTimeRef.current ?? 0);
      performance.mark('color-change-end');
      console.log(`Stress test color changed to ${randomHexColor} in ${duration}ms`);
      setStressTestColorChangeDuration(duration);
    }, 0);
  };

  const changeStressTestMode = (mode: typeof stressTestMode) => {
    performance.mark('mode-change-start')
    stressTestModeChangeStartTimeRef.current = performance.now();

    setStressTestMode(mode);
    setSquareCount(mode === 'none' ? 0 : 2048);

    setTimeout(() => {
      const duration = performance.now() - (stressTestModeChangeStartTimeRef.current ?? 0);
      performance.mark('mode-change-end');
      console.log(`Stress test mode changed to ${mode} in ${duration}ms`);
      setStressTestModeChangeDuration(duration);
    }, 0);
  };

  return (
    <Box>
      <Button variant="contained">Standard MUI contained button</Button>
      <Button sx={{ backgroundColor: 'rebeccapurple', color: 'white', margin: '10px', "&:hover": { background: 'forestgreen'} }}>sx-styled button</Button>
      <Button className={buttonClass}>css-styled button</Button>

      <h2>Box "inline"-styled with sx</h2>
      <Box sx={{ background: 'red', width: 50, height: 50, margin: 10, '&:hover': { background: 'green'} }}></Box>
      
      <h2>Div styled with `css` compile-time static CSS</h2>
      <div className={divClass}></div>

      <h1>Square component tests</h1>
      <Button variant='contained' onClick={changeColor}>Change color</Button>
      
      <h2>Lazy-loaded component with static css-variable-driven "dynamic" style</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <LazySquare background={color} />
      </Suspense>

      <h2>Stress test</h2>
      { stressTestColorChangeDuration !== null && <p>Stress test color changed to {color} in {stressTestColorChangeDuration}ms</p> }
      { stressTestModeChangeDuration !== null && <p>Stress test mode changed to {stressTestMode} in {stressTestModeChangeDuration}ms</p>}

      <select sx={{ marginBottom: 10}} value={stressTestMode} onChange={(e) => changeStressTestMode(e.target.value as typeof stressTestMode)}>
        <option value="none">None</option>
        <option value="pigmentCss">Pigment Css</option>
        <option value="pigmentSx">Pigment Sx</option>
        <option value="makeStylesWithProp">Make Styles With Props</option>
      </select>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
      {Array(squareCount).fill(0).map((_, index) => {
        return (
          <>
            {stressTestMode === 'pigmentSx' && (
              <SquarePigmentSx key={index} background={color} />
            )}
            {stressTestMode === 'pigmentCss' && (
              <SquarePigmentCss key={index} background={color} />
            )}
            {stressTestMode === 'makeStylesWithProp' && (
              <SquareMakeStylesWithProps key={index} background={color} />
            )}
          </>
        );
      })}
      </Box>
    </Box>
  );
}

// Add a fixed delay so you can see the loading state
function delayForDemo<T>(promise: Promise<T>) {
  return new Promise(resolve => {
    setTimeout(resolve, 1000);
  }).then(() => promise);
}

// const scale = keyframes({
//   to: { scale: 'var(--s2)' },
// });

// const Link = styled('a', { shouldForwardProp: (prop) => prop !== 'outlined' })<{
//   outlined?: boolean;
// }>(({ theme }) => ({
//   fontSize: '1rem',
//   background: 'rgba(0 0 0 / 0.04)',
//   padding: '0.8rem 1rem',
//   letterSpacing: '1px',
//   borderRadius: '8px',
//   textAlign: 'center',
//   ...theme.applyStyles('dark', {
//     background: 'rgba(255 255 255 / 0.1)',
//   }),
//   variants: [
//     {
//       props: { outlined: true },
//       style: {
//         background: 'transparent',
//         color: `hsl(${theme.vars.palette.primary})`,
//         border: `1px solid hsl(${theme.vars.palette.border})`,
//       },
//     },
//   ],
// }));

// const Bubble = styled('span')({
//   height: 'var(--size, 100%)',
//   aspectRatio: '1',
//   background: 'radial-gradient(hsl(var(--h) 100% 70%) 25%, transparent 50%)',
//   position: 'absolute',
//   display: 'inline-block',
//   left: 'var(--x, 0)',
//   top: 'var(--y, 0)',
//   scale: '0',
//   translate: '-50% -50%',
//   mixBlendMode: 'multiply',
//   filter: 'blur(2px)',
//   animation: `${scale} var(--s, 2s) var(--d, 0s) infinite alternate`,
// });

// function randomBetween(min: number, max: number) {
//   return Math.floor(Math.random() * (max - min + 1) + min);
// }

// function generateBubbleVars() {
//   return `
//     --x: ${randomBetween(10, 90)}%;
//     --y: ${randomBetween(15, 85)}%;
//     --h: ${randomBetween(0, 360)};
//     --s2: ${randomBetween(2, 6)};
//     --d: -${randomBetween(250, 400) / 1000}s;
//     --s: ${randomBetween(3, 6)}s;
//   `;
// }

// export function App() {
//   return (
//     <main
//       className={css({
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         height: '100lvh',
//         padding: '20px',
//         color: 'hsl(var(--palette-foreground))',
//         backgroundColor: 'hsl(var(--palette-background))',
//         fontFamily:
//           "system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
//       })}
//     >
//       <h1
//         className={`my-custom-class ${css(({ theme }) => ({
//           fontFamily: 'system-ui, sans-serif',
//           fontSize: '4rem',
//           fontWeight: 500,
//           textAlign: 'center',
//           position: 'relative',
//           display: 'flex',
//           alignItems: 'center',
//           color: '#888',
//           marginBottom: '1rem',
//           ...theme.applyStyles('dark', { color: '#fff' }),
//         }))}`}
//       >
//         Pigment&nbsp;CSS
//         <span
//           className={css(({ theme }) => ({
//             position: 'absolute',
//             inset: '0',
//             background: 'white',
//             mixBlendMode: 'color-burn',
//             overflow: 'hidden',
//             pointerEvents: 'none',
//             ...theme.applyStyles('dark', {
//               mixBlendMode: 'darken',
//               filter: 'brightness(2)',
//             }),
//           }))}
//         >
//           <Bubble
//             className={css`
//               ${generateBubbleVars()}
//             `}
//           />
//           <Bubble
//             className={css`
//               ${generateBubbleVars()}
//             `}
//           />
//           <Bubble
//             className={css`
//               ${generateBubbleVars()}
//             `}
//           />
//           <Bubble
//             className={css`
//               ${generateBubbleVars()}
//             `}
//           />
//           <Bubble
//             className={css`
//               ${generateBubbleVars()}
//             `}
//           />
//           <Bubble
//             className={css`
//               ${generateBubbleVars()}
//             `}
//           />
//           <Bubble
//             className={css`
//               ${generateBubbleVars()}
//             `}
//           />
//           <Bubble
//             className={css`
//               ${generateBubbleVars()}
//             `}
//           />
//           <Bubble
//             className={css`
//               ${generateBubbleVars()}
//             `}
//           />
//           <Bubble
//             className={css`
//               ${generateBubbleVars()}
//             `}
//           />
//         </span>
//       </h1>
//       <div
//         className={css({
//           fontFamily: 'system-ui, sans-serif',
//           letterSpacing: '2px',
//           opacity: 0.6,
//           lineHeight: 2,
//           textAlign: 'center',
//           textWrap: 'balance',
//         })}
//       >
//         CSS-in-JS library with static extraction
//       </div>
//       <div
//         className={css({
//           display: 'flex',
//           flexWrap: 'wrap',
//           gap: '1rem',
//           marginTop: '2rem',
//         })}
//       >
//         <Link
//           href="https://github.com/mui/pigment-css/blob/master/README.md"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Documentation
//         </Link>
//         <Link
//           outlined
//           href="https://github.com/orgs/mui/projects/27/views/3"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Roadmap
//         </Link>
//       </div>
//     </main>
//   );
// }
