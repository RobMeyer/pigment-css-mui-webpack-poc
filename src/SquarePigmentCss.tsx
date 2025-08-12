import Box from '@mui/material/Box';
import { css } from '@pigment-css/react';

export interface SquarePigmentCssProps {
    background: string;
}
const root = css({
    background: 'var(--bk)',
    width: 50,
    height: 50,
    transition: 'background 0.3s ease',
});

type CSSVars = React.CSSProperties & Record<`--${string}`, string | number>;

export default function SquarePigmentCss(props: SquarePigmentCssProps) {
  const style: CSSVars = { '--bk': props.background };
  return <Box className={root} style={style} />;
}