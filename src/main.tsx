// import * as React from 'react';
// import * as ReactDOM from 'react-dom/client';
// import '@pigment-css/react/styles.css';
// import './globals.css';
// import App from './App';

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// );


import { Container, createRoot } from "react-dom/client";
import { App } from "./App";
import { StyledEngineProvider } from '@mui/material/styles';

import '@pigment-css/react/styles.css';

const domNode = document.getElementById("root");
const root = createRoot(domNode as Container);
root.render(
	<StyledEngineProvider injectFirst>
		<App />
	</StyledEngineProvider>
);
