<template>
	<div>
		<b-card border-variant="white">
			
			<div style="margin:2rem 0 0 0; font-size:20pt; font-weight:600; text-align:center;">	
				Please request access from an administrator.
			</div>

			<b-card border-variant="white" class="w-50 mx-auto">
				<b-form-textarea
					rows="8"
      				v-model="textMessage"
					placeholder="Please explain the reason that you need access to this portal." 
					:state="(textMessage.length <= textMaximumSize)?null:false"
				>
				</b-form-textarea>
			</b-card>

			<h5 v-if="textMessage.length>textMaximumSize" class="text-danger text-center">Maximum {{textMaximumSize}} characters.</h5>
			
			<b-card v-if="requestSent==true" border-variant="white" style="border-radius:20px; width:40rem;" class="mx-auto  bg-success">
				<h2 class="text-white text-center my-2">Your request has been sent successfully!</h2>
			</b-card>
			<b-card v-else-if="requestSent==false" border-variant="white" style="border-radius:20px; width:40rem;" class="mx-auto  bg-danger">
				<h2 class="text-white text-center my-2">Something went wrong. Please try again later!</h2>
			</b-card>
			
			<b-card border-variant="white" class="w-50 mx-auto">
				<div style="float:left; display:inline; margin:0rem auto;">
					<b-button :disabled="(textMessage.length>textMaximumSize)||requestSent==true" style="width:15rem;" variant="primary" @click="requestAccess()"> 
						<b> Send Your Request </b>
					</b-button>
				</div>
				<div style="float:right; display:inline; margin:0rem auto;">	
					<b-button style="width:15rem;" variant="danger"  @click="signout()">
							<b-icon-box-arrow-left class="mr-2"/><b> Logout </b>
					</b-button>
				</div>
			</b-card>
		
		</b-card>
	</div>
</template>

<script lang="ts">
	import { Component, Vue} from 'vue-property-decorator';	
	import { SessionManager } from "@/components/utils/utils";

	@Component
	export default class RequestAccessPage extends Vue {
		
		textMessage=""
		textMaximumSize=250
		requestSent=null

		mounted(){
			this.requestSent=null
		}

		public signout(){          
            SessionManager.logout(this.$store);        	
		}

		public requestAccess(){
			this.requestSent=null

			const data = {
                "message": this.textMessage 
            }

            this.$http.post('/role/request-access', data).then(res=>{
                if(res?.status==200){
					this.requestSent=true
					window.setTimeout(()=>this.signout(),1000)
                }
               
            },error => {
               this.requestSent=false
            })
		}
	}
</script>