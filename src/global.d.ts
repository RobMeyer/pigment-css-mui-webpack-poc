import type { CSSProperties } from 'react';
import type { Theme } from '@mui/material/styles';

// Augment React's HTMLAttributes so intrinsic elements (e.g., <div />, <select />)
// accept an `sx` prop in this project.
declare module 'react' {
  interface HTMLAttributes<T> {
    sx?:
      | CSSProperties
      | ((theme: Theme) => CSSProperties)
      | ReadonlyArray<CSSProperties | ((theme: Theme) => CSSProperties)>;
  }
}
