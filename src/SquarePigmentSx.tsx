import Box from '@mui/material/Box';

export interface SquarePigmentSxProps {
    background: string;
}

export default function SquarePigmentSx(props: SquarePigmentSxProps) {
    return <Box sx={{ background: props.background, width: 50, height: 50, transition: 'background 0.3s ease' }} />;
}