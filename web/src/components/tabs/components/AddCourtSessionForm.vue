<template>
    <div v-if="dataReady">
        <b-table-simple small borderless>
            <b-tbody >
                <b-tr>
                    <b-td>
                        <label class="h6 ml-2 m-0 p-0"> Language: </label>
                        <b-form-group style="margin: 0.05rem 0 0 0.5rem;width: 20rem;"> 
                            <b-form-select
                                tabindex="1"
                                size = "sm"
                                v-model="selectedLanguageName"
                                :state = "languageNameState?null:false">
                                    <b-form-select-option :value="{}">
                                        Select a Language *
                                    </b-form-select-option>
                                    <b-form-select-option
                                        v-for="language in languages" 
                                        :key="language.id"
                                        :value="language.name">
                                            {{language.name}}
                                    </b-form-select-option>     
                            </b-form-select>
                        </b-form-group>
                                               
                    </b-td>
                    <b-td>
                        <label class="h6 ml-2 m-0 p-0"> Level: </label>
                        <b-form-group style="margin: 0.05rem 0 0 0.5rem;width: 3rem;"> 
                            <b-form-select
                                tabindex="2"
                                size = "sm"
                                v-model="selectedLanguageLevel"
                                :state = "languageLevelState?null:false">
                                    <b-form-select-option :value="{}">
                                        Select a Level *
                                    </b-form-select-option>
                                    <b-form-select-option
                                        v-for="level in levels" 
                                        :key="level"
                                        :value="level">
                                            {{level}}
                                    </b-form-select-option>     
                            </b-form-select>
                        </b-form-group>
                                               
                    </b-td>
                    <b-td>
                        <label class="h6 m-0 p-0"> Comment: </label>
                        <b-input-group  style="padding 0; margin:0 ;width: 20rem">
                            <b-form-input
                                tabindex="3"
                                class="mb-1"
                                size="sm"
                                v-model="comment" 
                                >
                            </b-form-input>
                        </b-input-group>                                           
                    </b-td>                    
                    <b-td >
                        <div>
                            <b-button                                    
                                style="margin: 1.7rem 0 0 0; padding:0; font-size: 12px; width: 2.75rem;"
                                variant="secondary"
                                @click="closeForm()">
                                Cancel
                            </b-button>   
                            <b-button                                    
                                style="margin: 1.7rem 0 0 0.35rem; padding:0; font-size: 12px; width: 2.5rem;"
                                variant="court"                        
                                @click="saveForm()">
                                {{addButtonText}}
                            </b-button>  
                        </div>
                    </b-td>
                </b-tr>
                
            </b-tbody>
        </b-table-simple>  

        <b-modal v-model="showCancelWarning" id="bv-modal-language-cancel-warning" header-class="bg-warning text-light">            
            <template v-slot:modal-title>
                <h2 v-if="isCreateLanguage" class="mb-0 text-light"> Unsaved New Language </h2>                
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
    </div>
</template>

<script lang="ts">
    import { Component, Vue, Prop } from 'vue-property-decorator';
    import { namespace } from 'vuex-class';
    import "@/store/modules/common";
    const commonState = namespace("Common");
    import { languagesInfoType } from '@/types/Common/json';
    import { interpreterLanguageInfoType } from '@/types/Interpreters/json';
   

    @Component
    export default class AddCourtSessionForm extends Vue {        

        @commonState.State
        public languages!: languagesInfoType[];

        @Prop({required: true})
        formData!: interpreterLanguageInfoType;

        @Prop({required: true})
        index!: number;

        @Prop({required: true})
        isCreateLanguage!: boolean;             

        selectedLanguageName = ''
        languageNameState = true;     

        selectedLanguageLevel;
        languageLevelState = true;  
        
        comment = '';

        originalSelectedLanguageName = '';
        originalSelectedLanguageLevel;  
        originalComment = '';

        levels = [1, 2, 3, 4]
        
        showCancelWarning = false;

        addButtonText = 'Add';
        dataReady = false;
        
        mounted()
        { 
            this.dataReady = false;
            this.clearSelections();
            if(!this.isCreateLanguage) {
                this.extractFormInfo();
                this.addButtonText = 'Save';
            } else {
                this.addButtonText = 'Add';
            }
            this.dataReady = true;              
        }        

        public extractFormInfo(){            
            const index = this.languages.findIndex(language =>{if(language.name == this.formData.languageName)return true})
            this.originalSelectedLanguageName = this.selectedLanguageName = (index>=0)? this.languages[index].name: '';            
            this.originalSelectedLanguageLevel = this.selectedLanguageLevel = this.formData.level;
            this.originalComment = this.comment = this.formData.commentOnLevel;
        }

        public saveForm(){
               
            this.languageNameState = this.selectedLanguageName != "";
            this.languageLevelState = this.selectedLanguageLevel != ""; 
            
            if (this.languageNameState && this.languageLevelState){        
                const language = {} as interpreterLanguageInfoType;
                language.languageName = this.selectedLanguageName;
                language.level = this.selectedLanguageLevel;
                language.commentOnLevel = this.comment?this.comment:'';       
                this.$emit('submit', this.isCreateLanguage, language, this.index);
            }
                
        }

        public closeForm(){
            if(this.isChanged())
                this.showCancelWarning = true;
            else
                this.confirmedCloseForm();
        }

        public isChanged(){
            if(this.isCreateLanguage){
                if((this.selectedLanguageName.length && this.selectedLanguageLevel.length) ||
                    this.comment.length ) return true;
                return false;
            }else{
                if( (this.originalSelectedLanguageName != this.selectedLanguageName) ||
                    (this.originalSelectedLanguageLevel != this.selectedLanguageLevel) || 
                    (this.originalComment != this.comment)) return true;
                return false;
            }
        }

        public confirmedCloseForm(){           
            this.clearSelections();
            this.$emit('cancel');
        }

        public clearSelections(){
            this.selectedLanguageName = '';
            this.selectedLanguageLevel = ''; 
            this.comment = '';              
            this.languageNameState  = true;
            this.languageLevelState   = true;                     
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