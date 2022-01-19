import { locationsInfoType } from '@/types/Common';
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';

@Module({
    namespaced: true
})
class Common extends VuexModule {

    public token = '';
    public tokenExpiry: Date = new Date();
	public logoutUrl = "";
    public userName = ""	
	public userId = ""
	public userRole: string[] = [];
    public userLocation: locationsInfoType|null = null;
    public courtLocations: locationsInfoType[] = [];

    // public accountInfo = {} as accountInfoType;

	@Mutation
	public setToken(token): void {   
	  this.token = token
	}
	@Action
	public UpdateToken(newToken): void {
	   this.context.commit('setToken', newToken)
	}
  
	@Mutation
	public setTokenExpiry(tokenExpiry): void {
	  this.tokenExpiry = tokenExpiry
	}

	@Mutation
	public setLogoutUrl(logoutUrl): void {   
	  this.logoutUrl = logoutUrl
	}

	@Mutation
	public setUserRole(userRole): void {   
	  this.userRole = userRole
	}
	


    @Mutation
    public  setUserName(userName: string): void {
        this.userName = userName;
    }
    @Action
    public UpdateUserName(newUserName: string) {
        this.context.commit("setUserName", newUserName);
    }
    
    @Mutation
    public setUserId(userId: string): void {   
        this.userId = userId
    }
    @Action
    public UpdateUserId(newUserId: string): void {
        this.context.commit('setUserId', newUserId)
    }

    @Mutation
    public setUserLocation(userLocation: locationsInfoType|null): void {   
        this.userLocation = userLocation
    }
    @Action
    public UpdateUserLocation(newUserLocation: locationsInfoType|null): void {
        this.context.commit('setUserLocation', newUserLocation)
    }


    @Mutation
    public setCourtLocations(courtLocations: locationsInfoType[]): void {   
        this.courtLocations = courtLocations
    }
    @Action
    public UpdateCourtLocations(newCourtLocations: locationsInfoType[]): void {
        this.context.commit('setCourtLocations', newCourtLocations)
    }


    // @Mutation
    // public setLocationsInfo(locationsInfo: locationsInfoType[]): void {   
    //     this.locationsInfo = locationsInfo
    // }
    // @Action
    // public UpdateLocationsInfo(newLocationsInfo: locationsInfoType[]): void {
    //     this.context.commit('setLocationsInfo', newLocationsInfo)
    // }


    // @Mutation
    // public setAccountInfo(accountInfo: accountInfoType): void {   
    //     this.accountInfo = accountInfo;
    // }
    // @Action
    // public UpdateAccountInfo(newAccountInfo: accountInfoType): void {
    //     this.context.commit('setAccountInfo', newAccountInfo);
    // }

}

export default Common