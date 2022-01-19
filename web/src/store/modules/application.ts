import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';

@Module({
  namespaced: true
})
class Application extends VuexModule {

    public id = ""
    public version = "1.0"

    @Mutation
    public init(): void {
        //console.log(this.steps)        
    }
    @Action
    public UpdateInit(newVersion: string) {
        this.context.commit("init");
        // this.context.commit("setVersion", newVersion)
        // this.context.dispatch("UpdateStPgNo");
    }

    // @Mutation
    // public setVersion(version: string): void {
    //     this.version = version;
    // }
    // @Action
    // public UpdateVersion(newVersion: string) {
    //     this.context.commit("setVersion", newVersion);
    // }    
    

    // @Mutation
    // public setCurrentSteps({steps:steps, version:version}): void {        
    //     this.steps = steps;        
    //     this.version = version;
    // }
    // @Action
    // public UpdateCurrentSteps(steps, version) {
    //     this.context.commit("setCurrentApplication", {steps:steps, version:version});
    // }

}

export default Application