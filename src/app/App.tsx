import { RouterProvider } from 'react-router';
import { router } from './routes';
import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    document.title = 'Forth Studios by Bo Moldenhauer';
  }, []);

  return <RouterProvider router={router} />;
}
