import React from 'react';
import ReactDOM from 'react-dom/client';
import Busy from './components/Busy';
import App from "./routes/index"
import 'bootstrap/dist/css/bootstrap.min.css';
import { Alert } from 'react-bootstrap';
import './index.css'
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const LazyComponent = React.lazy(() => import('./routes/index'));

root.render(
  <React.Suspense fallback={<Busy />}>
    <LazyComponent />
  </React.Suspense>
);
