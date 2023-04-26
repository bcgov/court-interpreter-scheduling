<template>
	<header v-if="dataReady" name="menu-bar" class="app-header" :key="update">
		<b-navbar toggleable="lg" class="navbar navbar-expand-lg navbar-dark m-0 p-0" style="background-color: #38598a;">    
           
			<b-navbar-nav v-if="userRole.includes('super-admin')||userRole.includes('cis-admin')||userRole.includes('cis-user')" class="my-0 mx-5">
                <b-nav-item 
					v-for="item,inx in bothGroup" 
					:key="inx"
					@click="ChangeClass(item.name); adminTab = false;" 
					:to="'/'+item.name"
					:class="bgClass[item.name]" >
					<div class="booking-tab">{{item.label}}</div>
				</b-nav-item>
				<b-dropdown variant="primary" >
					<template #button-content >
						<div style="display:inline; font-size:14pt;"> <span class="mr-1"> Forms</span></div>
					</template>					
					<b-dropdown-item
						@click="DownloadADM322FillableFile()">
						Fillable ADM322
					</b-dropdown-item>
				</b-dropdown>
				<b-navbar-brand v-if="determineEnv()" style="font-weight: 700; font-size: 20pt; margin: -0.35rem 1rem;" ><b-badge class="ml-4 px-5" variant="danger">{{determineEnv()}}</b-badge></b-navbar-brand>
			</b-navbar-nav>
			
			<b-navbar-nav class="ml-auto mr-5">	
				<div v-if="userRole.includes('super-admin')||userRole.includes('cis-admin')">
					<b-dropdown right  :variant="adminTab?'cyan':'primary'">
						<template #button-content >
							<div style="display:inline; font-size:14pt;">
								<i class="fa fa-user-circle"></i> Admin
							</div>
						</template>
						<b-dropdown-item 
							v-for="item,inx in adminGroup" 
							:key="inx"
							:disabled="!userRole.includes('super-admin') && item.super_admin"
							@click="ChangeClass(item.name); adminTab = true;" 
							:to="'/'+item.name"
							:class="bgClass[item.name]" >
							<div class="booking-tab">{{item.label}}</div>
						</b-dropdown-item>
					</b-dropdown>

				</div>
			</b-navbar-nav>
		</b-navbar> 
	</header>
</template>

<script lang="ts">
	import { Component, Vue, Watch} from 'vue-property-decorator';	
	import { Route } from 'vue-router';
	
	import { namespace } from "vuex-class";   
	import "@/store/modules/common";
	const commonState = namespace("Common");

	@Component
	export default class MenuBar extends Vue {

		@commonState.State
    	public userRole!: string[];

        bgClass={}
		dataReady=false;
		adminTab = false;
		update=0;
		
		bothGroup=[
			{name:'bookings', label:'Manage Bookings', super_admin:false},
			{name:'create', label:'Add Bookings', super_admin:false},
		]
		adminGroup=[
			{name:'directory', label:'Interpreter Directory', super_admin:false},
			{name:'language', label:'Language Directory', super_admin:false},
			{name:'user-role', label:'Manage User', super_admin:false},
			{name:'rates', label:'Manage Rates', super_admin:false},
			{name:'update-geo', label:'Update Coordinates', super_admin:false}
		]

		@Watch('$route', { immediate: true, deep: true })
		onUrlChange(newVal: Route) {			
			this.ChangeClass(newVal.name)
			this.update++;			
		}

        mounted() {			
			this.dataReady=false;			
			this.ChangeClass('bookings')
			this.dataReady=true;
        }

		ChangeClass(type){
			const items = this.bothGroup.concat(this.adminGroup)
			for(const item of items)
        		this.bgClass[item.name]=""
			
			this.bgClass[type]="bg-cyan"
		}

		public DownloadADM322FillableFile() {

    		const url = '/adm/fillable-pdf'
			const options = {
				responseType: "blob",
				headers: {
					"Content-Type": "application/json",
				}
			}
    		this.$http.get(url, options)
			.then(res => {
				const blob = res.data;
				const link = document.createElement("a");
				link.href = URL.createObjectURL(blob);
				document.body.appendChild(link);
				link.download = "ADM322_fillable form.pdf";
				link.click();
				setTimeout(() => URL.revokeObjectURL(link.href), 1000);  
				return true;           

			},err => {
				console.error(err);
				return false;
			});
		}

		public determineEnv(){

			const host = window.location.host;
			const DEV = ['0.0.0.0', 'localhost', 'dev.'];
			const TEST = ['test.'];

			if (DEV.some(s=>host.indexOf(s) > -1)) {
				return 'DEV';
			} else if (TEST.some(s=>host.indexOf(s) > -1)) {
				return 'TEST';
			} else {
				return '';
			}

		}

	}
</script>

<style scoped>   

	.booking-tab{
		font-size:14pt; 
		display: inline-block; 
		white-space: nowrap;
		margin: 0 1rem;
	}

    ul >>> .dropdown-menu {
        width: 250px !important;
    }
</style>