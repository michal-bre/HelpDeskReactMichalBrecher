import './App.css'
import { UserProvider } from './Context/UserContext';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router } from './Route/Route';
import { RouterProvider } from 'react-router-dom';
const queryClient = new QueryClient();
function App() {

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <RouterProvider router={router} />
        </UserProvider>
      </QueryClientProvider >

    </>
  )
}

export default App
