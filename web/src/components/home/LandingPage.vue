<template>
    <div v-if="pageReady" class="background fill-body" id="landing-page">
        <b-container class="container">

            <b-row class="info-section">
                <b-col class="col-md-5" style="margin:auto  0;padding: 0 2rem;">
                    <div class="row justify-content-left">
                        <a class="btn btn-primary btn-lg bg-warning login-button" @click="login()">
                            Log In                                                                               
                        </a>
                    </div>                              
                </b-col>
                
                <b-col class="col-md-7" style="padding: 3rem 1rem 3rem 2rem;">
                    <h1 style="font-size:36pt;">Need Help?</h1>
                    <div style="font-size:12pt;">
                        <p>Contact your security administrator or the 7-7000 Service Desk at:</p>
                        <p>Phone: 250-387-7000</p>
                        <p>Email: 77000@gov.bc.ca</p>                    
                    </div>
                </b-col>                            
            </b-row> 

            <!-- <div class="landing-credit-div mb-4">
                <a class="landing-credit-a" href="https://commons.wikimedia.org/wiki/File:Law_Courts_building_interior_2018.jpg" target="_blank">Background image created by Wpcpey</a>, <a class="landing-credit-a" href="https://creativecommons.org/licenses/by-sa/4.0" target="_blank">CC BY-SA 4.0</a>, via Wikimedia Commons
            </div> -->
            
        </b-container>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { SessionManager } from "@/components/utils/utils";

import { namespace } from "vuex-class";   
import "@/store/modules/common";
const commonState = namespace("Common");

@Component
export default class LandingPage extends Vue {
    
    @commonState.State
    public userId!: string;

    isLoggedIn = false;
    pageReady = false;

      
    async mounted() {
        this.pageReady = false;
        // console.log(process)
        console.log(process.env)
        if(this.$store.state.Common.token)            
            await SessionManager.getUserInfo(this.$store);
        
        if(this.userId){
            this.isLoggedIn = true
            this.$router.push({ name: "bookings" });
        }else{
            this.isLoggedIn = false;
            this.pageReady = true;
        } 
    }
  
    public login() {
        
        this.$router.push({ name: "bookings" });         
    }
  
}
</script>

<style scoped lang="scss">
@import "src/styles/common";

.background {
  background-image: url("../../images/other-bg-landing.jpg");
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}

.info-section {
  font-size: 24px;
  line-height: 1.6;
  width: 60rem;
  border: 2px solid rgba($gov-pale-grey, 0.3);
  border-radius: 18px;
  background-color: rgba(92, 61, 3, 0.5);
  margin: 25rem 0 0 0rem;
  color: $gov-white;
}

.login-button {
  //color: $gov-white !important;
  color: black;
  font-weight: 600;
  margin: 0 0 0 6rem;
  width: 10rem;
  border: 2px solid rgb(231, 231, 231);
  &:hover,
  &:focus {
    color: rgb(155, 48, 6);
    border-color: rgba(29, 17, 10, 0.904);

  }
  &:active {
    border: 2px solid rgba($gov-white, 0.8);
  }
}


.landing-credit-div {
    bottom: 50px;
    right: 20px;
    position: absolute;
    color: white;
    font-size: 9px;
}
.landing-credit-a {
    color: white;
    text-decoration: none;
    &:hover,
    &:focus {
        color:#38598A;
        text-decoration: underline;
    }    
}

</style>
