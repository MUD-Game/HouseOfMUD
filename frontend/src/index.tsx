import React from 'react';
import ReactDOM from 'react-dom/client';
import Busy from './components/Busy';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import './i18n/i18n';
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);


const LazyComponent = React.lazy(() => import('./routes/index'));

root.render(
  <React.Suspense fallback={<Busy />}>
    <LazyComponent />
  </React.Suspense>
);
