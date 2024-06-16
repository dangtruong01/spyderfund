import { RouterProvider } from "react-router-dom";
import { RecoilRoot } from 'recoil';

import AppRoutes from "./routes";

function App() {
  return (
    <div className="App">
      <RecoilRoot>
        <RouterProvider router={AppRoutes} />
      </RecoilRoot>
    </div>
  );
}

export default App;
