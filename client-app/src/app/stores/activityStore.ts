import { makeAutoObservable, runInAction } from "mobx"
import agent from "../api/agent";
import { Activity } from "../models/activity";
import {format} from 'date-fns';

export default class ActivityStore{
    /**activities: Activity[] = [];initialize into empty array */
    activityRegistry = new Map<string | undefined, Activity>();
    selectedActivity: Activity | undefined = undefined;/** | is union type that says property can be of type Activity or null */
    editMode = false;
    loading = false;
    loadingInitial = false;

    constructor(){
        makeAutoObservable(this)/**same functionality like makeObservable but less code */
    }

    get activitiesByDate(){
        return Array.from(this.activityRegistry.values()).sort((a,b) => 
            a.date!.getTime() - b.date!.getTime());
    }

    get groupedActivities(){
        return Object.entries(
            this.activitiesByDate.reduce((activities, activity)=>{
                const date = format(activity.date!, 'dd MMM yyyy');/**key for each of objects */
                activities[date] = activities[date] ? [...activities[date], activity] : [activity];/**property object accessor activities[date] so i wiil get property inside activitie that matches date*/
                    /**if activity with that date exists then add ectivity else create new array with that activity that we execute callback function on*/
                    return activities;
            }, {} as {[key: string]: Activity[]})
        )
    }

    loadActivities = async () => {
        /**async code goes into try catch block */
        this.loadingInitial = true;
        try{
            const activities = await agent.Activities.list();/**getting activities from api */

            activities.forEach(activity => {
                   this.setActivity(activity);
                  })
                this.setLoadingInitial(false);
        }catch(error){

            console.log(error);
            this.setLoadingInitial(false);
        }
    }

    loadActivity = async (id: string) => {
        /**Check if there is activity within memory */
        let activity = this.getActivity(id);

        if(activity){
            this.selectedActivity = activity;
            return activity;
        }
        else{
            this.loadingInitial = true;

            try {
                activity = await agent.Activities.details(id);
                this.setActivity(activity);
                runInAction(() => {
                    this.selectedActivity = activity;
                })
                this.setLoadingInitial(false);
                return activity;
            } catch (error) {
                console.log(error)
                this.setLoadingInitial(false);
            }
        }
    }
/**private helper methodes */
    private getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    }

    private setActivity = (activity: Activity) => {
        activity.date = new Date(activity.date!);
        this.activityRegistry.set(activity.id, activity);
    }
    
    setLoadingInitial = ((state: boolean) => {
        this.loadingInitial = state;
    })

    createActivity = async (activity: Activity) => {
        this.loading = true;

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