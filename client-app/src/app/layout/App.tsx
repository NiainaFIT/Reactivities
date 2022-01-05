import React from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import ActivityForm from '../../features/activities/form/ActivityForm';
import { observer } from 'mobx-react-lite';
import { Route, useLocation } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import ActivityDetails from '../../features/activities/details/ActivityDetails';



function App() {

  const location = useLocation();
  return (
    <>

 <Route exact path='/' component={HomePage} />
    <Route
     path={'/(.+)'}/**any route that matches .plus something*/
      render={() => (
        <> 
      <NavBar/>
      <Container style = {{ marginTop:'7em' }}>
        <Route exact path = '/' component = { HomePage }/>
        <Route exact path = '/activities' component = { ActivityDashboard }/>
        <Route path = '/activities/:id' component = { ActivityDetails }/>
        <Route key={ location.key } path = { ['/createActivity', '/manage/:id'] } component = { ActivityForm }/>
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
