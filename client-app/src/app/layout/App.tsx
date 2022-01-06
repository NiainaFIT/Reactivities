import React from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import ActivityForm from '../../features/activities/form/ActivityForm';
import { observer } from 'mobx-react-lite';
import { Route, Switch, useLocation } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import TestError from '../../features/errors/TestError';
import { ToastContainer } from 'react-toastify';
import NotFound from '../../features/errors/NotFound';
import ServerError from '../../features/errors/ServerError';


function App() {

  const location = useLocation();
  return (
    <>
    <ToastContainer position='bottom-right' hideProgressBar/>
 <Route exact path='/' component={HomePage} />
    <Route
     path={'/(.+)'}/**any route that matches .plus something*/
      render={() => (
        <> 
      <NavBar/>
      <Container style = {{ marginTop:'7em' }}>
        <Switch>
          <Route exact path = '/' component = { HomePage }/>
          <Route exact path = '/activities' component = { ActivityDashboard }/>
          <Route path = '/activities/:id' component = { ActivityDetails }/>
          <Route key={ location.key } path = { ['/createActivity', '/manage/:id'] } component = { ActivityForm }/>
          <Route path = '/errors' component={ TestError }/>
          <Route path='/server-error' component = {ServerError}/>
          <Route component={NotFound}/>
        </Switch>
      </Container> 
        </>
      )}
    />
    </>
  );
}
/**passing App component to higher order function observer and observer returns App component with 
 * power to observe observables in store 
*/
export default observer(App);
