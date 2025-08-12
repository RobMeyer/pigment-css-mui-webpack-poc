import Box from '@mui/material/Box';
import { makeStyles } from '@mui/styles';

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
      //transition: 'background 1s linear',
      background: function propsToBackground(props: StyleProps) {
        return props.background;
      },
    },
  };
});

export default function SquareMakeStylesWithProps(props: SquareMakeStylesWithPropsProps) {
    const classes = useStyles({ background: props.background });
    return <Box className={classes.root} />;
}