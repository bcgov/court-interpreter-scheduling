import Axios, { AxiosInstance } from "axios";
import Vue from "vue";

export const SessionManager = {

    logout: function(store) {
        window.location.replace(store.state.Common.logoutUrl);
    },

    getUserInfo: async function(store) {
        try {
            var response = await Axios.get('/user-info/');
                        
            const userId = response.data.user_id;           
            const userLocation = response.data.location;

            if (userId) {
                const roles = response.data.role;
                
                if (!roles || roles?.length==0) {
                    return{userId:userId, requestAccess:true}
                }
                const userRole = roles.map(role => role.role_name)
                const userName = response.data.display_name || response.data.first_name + " " + response.data.last_name;
                store.commit("Common/setUserName", userName);
                store.commit("Common/setUserId", userId);
                store.commit("Common/setUserRole",userRole);
                store.commit("Common/setUserLocation",userLocation);             
            }
            return {userId:userId, requestAccess:false};
        }
        catch (error) {
            console.log(error);
            return {userId:null, requestAccess:false};
        }
    }
}
