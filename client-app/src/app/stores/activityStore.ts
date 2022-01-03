import { makeAutoObservable, runInAction } from "mobx"
import agent from "../api/agent";
import { Activity } from "../models/activity";
import {v4 as uuid} from "uuid"

export default class ActivityStore{
    /**activities: Activity[] = [];initialize into empty array */
    activityRegistry = new Map<string | undefined, Activity>();
    selectedActivity: Activity | undefined = undefined;/** | is union type that says property can be of type Activity or null */
    editMode = false;
    loading = false;
    loadingInitial = true;

    constructor(){
        makeAutoObservable(this)/**same functionality like makeObservable but less code */
    }

    get activitiesByDate(){
        return Array.from(this.activityRegistry.values()).sort((a,b) => 
            Date.parse(a.date) - Date.parse(b.date));
    }

    loadActivities = async () => {
        /**async code goes into try catch block */
        try{
            const activities = await agent.Activities.list();/**getting activities from api */

            activities.forEach(activity => {
                    activity.date = activity.date.split('T')[0];
                    this.activityRegistry.set(activity.id, activity);
                  })
                this.setLoadingInitial(false);
        }catch(error){

            console.log(error);
            this.setLoadingInitial(false);
        }
    }

    setLoadingInitial = ((state: boolean) => {
        this.loadingInitial = state;
    })

    selectAtivity = (id: string) =>{
        this.selectedActivity = this.activityRegistry.get(id);
    }

    cancelSelectedActivity = () => {
        this.selectedActivity = undefined;
    }

    openForm = (id?: string) =>{
        id ? this.selectAtivity(id) : this.cancelSelectedActivity();
        this.editMode = true;
    }

    closeForm = () => {
        this.editMode = false;
    }

    createActivity = async (activity: Activity) => {
        this.loading = true;

        activity.id = uuid();

        try {
            await agent.Activities.create(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    updateActivity = async (activity: Activity) => {
        this.loading = true;
        try {
            await agent.Activities.update(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity)
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    deleteActivity =async (id: string) => {
        this.loading = true;
        try {
            await agent.Activities.delete(id);
            runInAction(() => {
                this.activityRegistry.delete(id);
                if(this.selectedActivity?.id === id) this.cancelSelectedActivity();
                this.loading = false;
            })
           
        } catch (error) {
            console.log(error)
            runInAction(() => {
                this.loading = false;
            })
        }  
    }
    /**binding title property with setTitle function to class ActivityStore */
    /**when function is bound to class i can use this keyword to access class property */
    /** () =>  arrow function so i don't have to explicitly bind function like setTitle:action.bound */
    /**setTitle = () => {
        this.title = this.title+'!';
    }*/
}