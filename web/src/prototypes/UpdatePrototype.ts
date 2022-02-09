import Vue from 'vue'
import store from '@/store';

export default {
    install () {
        Vue.prototype.$UpdateJourney = UpdateJourney       
    }
}

function UpdateJourney(){
    // saveStepChanges();
}

// function saveStepChanges(){
    
//     const steps = store.state.Application.steps;
//     const version = store.state.Application.version;
    
//     const url = '/journey/';
//     const body = {
//         steps:steps,
//         version:version
//     }        

//     Vue.prototype.$http.put(url, body)
//     .then(res => {
            
//     },err => {
//         console.error(err);        
//     });   
// }