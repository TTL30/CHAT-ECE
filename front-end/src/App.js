import './App.css';
import Home from './Components/Home/home'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect} 
from "react-router-dom";
import Login from './Components/Auth/Login/login';
import Register from './Components/Auth/Register/register';
import RoomContextProvider from './Context/RoomContext';
import { Auth } from './utils/auth';


const AuthRoute = ({component: Component, ...rest}) => (
  <Route {...rest} render={(props) => {
      return (
          Auth.isAuthenticated() !== undefined
              ? <Component {...props} />
              : <Redirect to='/login'/>
      )
  }
  }/>
)


const App = () => {
  return (
    <Router>
      <Switch>
          <Route path="/login" exact component={Login} />
          <Route path="/register" exact component={Register} />
          <RoomContextProvider>
            <AuthRoute path="/" exact component={Home} />
          </RoomContextProvider>
      </Switch>
    </Router>
  );
}

export default App;
