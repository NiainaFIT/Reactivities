import React, { useEffect } from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import LoadingComponent from './LoadingComponent';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';




function App() {
  const {activityStore} = useStore();/**destructuring object store to use just activityStore */

  useEffect(() => {
      activityStore.loadActivities();
  }, [activityStore])/**passing activityStore as a dependency to useEfect */

  if(activityStore.loadingInitial) return <LoadingComponent content='Loading App...'/>

  return (
    <>
      <NavBar/>
      <Container style = {{marginTop:'7em'}}>
        <ActivityDashboard/>
      </Container> 
    </>
  );
}
/**passing App component to higher order function observer and observer returns App component with 
 * power to observe observables in store 
*/
export default observer(App);
