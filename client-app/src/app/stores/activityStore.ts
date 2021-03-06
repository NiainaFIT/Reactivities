import { makeAutoObservable, runInAction } from "mobx"
import agent from "../api/agent";
import { Activity, ActivityFormValues } from "../models/activity";
import {format} from 'date-fns';
import { store } from "./store";
import { Profile } from "../models/profile";

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
        const user = store.userStore.user;
        if(user){
            activity.isGoing = activity.attendees!.some(
                a => a.username === user.username
            )
            activity.isHost = activity.hostUsername === user.username;
            activity.host = activity.attendees?.find(x => x.username === activity.hostUsername);
        }
        activity.date = new Date(activity.date!);
        this.activityRegistry.set(activity.id, activity);
    }
    
    setLoadingInitial = ((state: boolean) => {
        this.loadingInitial = state;
    })

    createActivity = async (activity: ActivityFormValues) => {
        const user = store.userStore.user;
        const attendee = new Profile(user!);
        try {
            await agent.Activities.create(activity);
            const newActivity = new Activity(activity);
            newActivity.hostUsername = user!.username;
            newActivity.attendees = [attendee];
            this.setActivity(newActivity);
            runInAction(() => {
                this.selectedActivity = newActivity;
            })
        } catch (error) {
            console.log(error);
        }
    }

    updateActivity = async (activity: ActivityFormValues) => {
        try {
            await agent.Activities.update(activity);
            runInAction(() => {
                if(activity.id){
                   let updatedActivity = {...this.getActivity(activity.id), ...activity}
                   this.activityRegistry.set(activity.id, updatedActivity as Activity)
                   this.selectedActivity = updatedActivity as Activity;
                }
            })
        } catch (error) {
            console.log(error);
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

    updateAttendance = async () => {
        const user = store.userStore.user;
        this.loading = true;

        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(() => {
                if(this.selectedActivity?.isGoing){
                    //removing currently logged in user from attendees
                    this.selectedActivity.attendees = 
                    this.selectedActivity.attendees?.filter(a => a.username !== user?.username);
                    this.selectedActivity.isGoing = false;
                }else{
                    const attendee = new Profile(user!);
                    this.selectedActivity?.attendees?.push(attendee);
                    this.selectedActivity!.isGoing = true;
                }
                this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
            })
        } catch (error) {
            console.log(error)
        }
        finally{
            runInAction(() => this.loading = false);
        }
    }

    cancelActivityToggle =async () => {
        this.loading = true;
        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(() =>{
                this.selectedActivity!.isCancelled = !this.selectedActivity?.isCancelled;
                this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
            })
        } catch (error) {
            console.log(error);
        }finally{
            runInAction(() => this.loading = false);
        }
    }

    clearSelectedActivity = () => {
        this.selectedActivity = undefined;
    }
    /**binding title property with setTitle function to class ActivityStore */
    /**when function is bound to class i can use this keyword to access class property */
    /** () =>  arrow function so i don't have to explicitly bind function like setTitle:action.bound */
    /**setTitle = () => {
        this.title = this.title+'!';
    }*/
}