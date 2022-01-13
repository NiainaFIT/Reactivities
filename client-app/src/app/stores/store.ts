import { createContext, useContext } from "react";
import ActivityStore from "./activityStore";
import CommonStore from "./commonStore";
import ModalStore from "./modalStore";
import ProfileStore from "./profileStore";
import UserStore from "./userStore";

interface Store{
    activityStore: ActivityStore; /**classes can be used as types*/
    commonStore: CommonStore;
    userStore: UserStore;
    modalStore: ModalStore;
    profileStore: ProfileStore;
}

export const store: Store = {/**object store of type Store*/

    activityStore: new ActivityStore(), /**property activityStore instantiated as ActivityStore*/
    commonStore: new CommonStore(),
    userStore: new UserStore(),
    modalStore: new ModalStore(),
    profileStore: new ProfileStore()
}

/**so store would be available in react context*/
export const StoreContext = createContext(store);/**context must be from react*/

/**react hook so i could use stores inside components*/
export function useStore(){
    return useContext(StoreContext);
}