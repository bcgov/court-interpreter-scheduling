<template>
    <div>
        <b-table-simple small borderless>
            <b-tbody>
                <b-tr>
                    <b-td>
                        <b-form-group style="margin: 0.25rem 0 0 0.5rem;width: 18rem">
                            <label class="h6 ml-1 mb-0 pb-0" > Language Name: </label> 
                            <b-form-input
                                size = "sm"
                                v-model="selectedLanguage"
                                type="text"
                                :placeholder="'Enter a new language name'"
                                :state = "languageState?null:false">                                           
                            </b-form-input>
                        </b-form-group>           
                    </b-td>                    
                    <b-td >
                        <b-button                                    
                            style="margin: 1.5rem .5rem 0 0 ; padding:0 .5rem 0 .5rem; "
                            variant="secondary"
                            @click="closeForm()">
                            Cancel
                        </b-button>   
                        <b-button                                    
                            style="margin: 1.5rem 0 0 0; padding:0 0.7rem 0 0.7rem; "
                            variant="success"                        
                            @click="saveForm()">
                            Save
                        </b-button>  
                    </b-td>
                </b-tr>   
            </b-tbody>
        </b-table-simple>  

        <b-modal v-model="showCancelWarning" id="bv-modal-language-cancel-warning" header-class="bg-warning text-light">            
            <template v-slot:modal-title>
                <h2 v-if="isCreate" class="mb-0 text-light"> Unsaved New Language </h2>                
                <h2 v-else class="mb-0 text-light"> Unsaved Language Changes </h2>                                 
            </template>
            <p>Are you sure you want to cancel without saving your changes?</p>
            <template v-slot:modal-footer>
                <b-button variant="secondary" @click="$bvModal.hide('bv-modal-language-cancel-warning')"                   
                >No</b-button>
                <b-button variant="success" @click="confirmedCloseForm()"
                >Yes</b-button>
            </template>            
            <template v-slot:modal-header-close>                 
                 <b-button variant="outline-warning" class="text-light closeButton" @click="$bvModal.hide('bv-modal-language-cancel-warning')"
                 >&times;</b-button>
            </template>
        </b-modal> 

        <b-modal v-model="showSaveWarning" id="bv-modal-save-change-warning" header-class="bg-warning text-light m-0 pt-3 pb-0">            
            <template v-slot:modal-title>                                
                <h3 class="m-0 p-0 text-light"> <b-icon variant="danger" class="mr-2" icon="exclamation-triangle"/> Changes to Language </h3>                                 
            </template>
            <h3 class="text-justify"> Are you sure you want to make changes to this language? </h3>
            <template v-slot:modal-footer>
                <b-button variant="secondary" @click="$bvModal.hide('bv-modal-save-change-warning')"                   
                >Cancel</b-button>
                <b-button variant="success" @click="confirmedSaveForm()"
                >Confirm</b-button>
            </template>            
            <template v-slot:modal-header-close>                 
                 <b-button variant="outline-warning" class="text-light closeButton" @click="$bvModal.hide('bv-modal-save-change-warning')"
                 >&times;</b-button>
            </template>
        </b-modal>             
    </div>
</template>

<script lang="ts">
    import { Component, Vue, Prop } from 'vue-property-decorator';

    import { languagesInfoType } from '@/types/Common/json';


    @Component
    export default class AddNewLanguageForm extends Vue {  
       
        @Prop({required: true})
        formData!: languagesInfoType;

        @Prop({required: true})
        isCreate!: boolean;

        originalLanguage = '';
        selectedLanguage = '';
        languageState = true;

        formDataId = 0;
        showCancelWarning = false;

        showSaveWarning = false;
        
        mounted()
        { 
            this.clearSelections();
            if(this.formData.id) {
                this.extractFormInfo();
            }               
        }        

        public extractFormInfo(){
            this.formDataId = this.formData.id? this.formData.id:0;
            this.originalLanguage = this.selectedLanguage = this.formData.name            
            //console.log(this.formDataId)
            //console.log(this.originalLanguage)
            // console.log(this.originalLocationScope)
        }

        public saveForm(){
            if(!this.isCreate && this.isChanged())
                this.showSaveWarning = true;
            else 
                this.confirmedSaveForm();               
        }              

        public confirmedSaveForm(){                
            this.languageState   = true;

            if(!this.selectedLanguage ){
                this.languageState  = false;
            }else{
                this.languageState  = true;
                
                const body = {
                    name: this.selectedLanguage,                    
                    id: this.formDataId                    
                }
                this.$emit('submit', body, this.isCreate);                  
            }
        }

        public closeForm(){
            if(this.isChanged())
                this.showCancelWarning = true;
            else
                this.confirmedCloseForm();
        }

        public isChanged(){
            if(this.isCreate){
                if( this.selectedLanguage) return true;
                return false;
            }else{
                if(this.originalLanguage != this.selectedLanguage) return true;
                return false;
            }
        }

        public confirmedCloseForm(){           
            this.clearSelections();
            this.$emit('cancel');
        }

        public clearSelections(){
            this.selectedLanguage = '';
            this.languageState = true;            
        }

    }
</script>

<style scoped>
    td {
        margin: 0rem 0.5rem 0.1rem 0rem;
        padding: 0rem 0.5rem 0.1rem 0rem;
        
        background-color: white ;
    }
</style>