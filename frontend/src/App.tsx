import UserContextProvider from "./context/user/UserContextProvider";
import Router from "./Router";

function App() {
  return (
    <UserContextProvider>
      <div className="global-container">
        <Router />
      </div>
    </UserContextProvider>
  );
}

export default App;
