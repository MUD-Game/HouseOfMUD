import React from 'react';
import ReactDOM from 'react-dom/client';
import Busy from './components/Busy';
import App from "./routes/index"

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const LazyComponent = React.lazy(() => import('./routes/index'));

root.render(
  <React.StrictMode>
    <React.Suspense fallback={<Busy/>}>
      <LazyComponent /> 
    </React.Suspense>
  </React.StrictMode>
);
