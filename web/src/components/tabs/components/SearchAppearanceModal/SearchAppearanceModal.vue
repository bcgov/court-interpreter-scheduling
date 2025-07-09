<template>
    <b-modal 
        class="custom-modal-height" 
        size="xl" 
        v-model="showModal" 
        id="search-appearance-modal" 
        header-class="bg-white text-primary" 
        centered
        @hidden="onModalHidden">
        
        <template v-slot:modal-title>
            <h2 class="my-2">Search Files and Appearances</h2>
        </template>

        <div class="modal-content-wrapper d-flex flex-column h-100">
            <!-- Filter Section - Only show for Step 1 -->
            <div v-if="!showAppearances" class="filter-section bg-light p-3 mb-3 border rounded flex-shrink-0">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="mb-0">Search Filters</h5>
                    <a href="#" @click.prevent="toggleFilters" class="text-primary">
                        ({{ showFilters ? 'Hide' : 'Show' }})
                    </a>
                </div>
                <div v-show="showFilters">
                    <b-form @submit.prevent="performSearch">
                        <b-row>
                            
                            <b-col cols="3">
                                <b-form-group
                                    label="Search Mode"
                                    class="labels">
                                    <b-form-radio-group
                                        v-model="filterSearchMode"
                                        :options="searchModeOptions"
                                        class="w-100">
                                    </b-form-radio-group>
                                </b-form-group>
                            </b-col>
                            <b-col cols="3">
                                <b-form-group v-if="filterSearchMode === 'FILENO'"
                                    :label="'Court File Number'"
                                    :label-for="'file-number'"
                                    class="labels">
                                    <b-form-input
                                        :id="'file-number'"
                                        v-model="filterFileNumber"
                                        :state="validationStates.fileNumber"
                                        :placeholder="'Enter file number'">
                                    </b-form-input>
                                    <b-form-invalid-feedback v-if="validationStates.fileNumber === false">
                                        File number is required
                                    </b-form-invalid-feedback>
                                </b-form-group>
                                <b-form-group v-if="filterSearchMode === 'PARTNAME'"
                                    :label="'Last Name'"
                                    :label-for="'Last Name'"
                                    class="labels">
                                    <b-form-input
                                        :id="'lastname'"
                                        v-model="filterSurname"
                                        :state="validationStates.surname"
                                        :placeholder="'Enter Last Name'">
                                    </b-form-input>
                                    <b-form-invalid-feedback v-if="filterSearchMode === 'PARTNAME'">
                                        Last Name is required
                                    </b-form-invalid-feedback>
                                </b-form-group>
                            </b-col>
                            <b-col cols="3">
                                <b-form-group 
                                    label="File Originating Location" 
                                    label-for="location"
                                    class="labels">
                                    <b-form-select 
                                        id="location"
                                        v-model="filterLocation"
                                        :state="validationStates.location"
                                        :options="[{text: 'Select Location', value: null}, ...sortedCourtLocations.map(loc => ({text: loc.name, value: loc}))]">
                                    </b-form-select>
                                    <b-form-invalid-feedback v-if="filterSearchMode === 'FILENO' && validationStates.location === false">
                                        File Originating Location is required
                                    </b-form-invalid-feedback>
                                </b-form-group>
                            </b-col>
                            <b-col cols="3">
                                <b-form-group
                                    label="Case Type"
                                    class="labels">
                                    <b-form-radio-group
                                        v-model="filterCaseType"
                                        :state="validationStates.caseType"
                                        :options="caseTypeOptions"
                                        class="w-100"
                                        @change="filterCourtClass = ''">
                                    </b-form-radio-group>
                                    <b-form-invalid-feedback v-if="validationStates.caseType === false">
                                        Case Type is required
                                    </b-form-invalid-feedback>
                                </b-form-group>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col cols="6">
                                <b-form-group
                                    label="Court Level (Optional)"
                                    label-for="court-level"
                                    class="labels">
                                    <b-form-select
                                        id="court-level"
                                        v-model="filterCourtLevel"
                                        :options="courtLevelOptions">
                                    </b-form-select>
                                </b-form-group>
                            </b-col>
                            <b-col cols="6">
                                <b-form-group
                                    label="Court Class (Optional)"
                                    label-for="court-class"
                                    class="labels">
                                    <b-form-select
                                        id="court-class"
                                        v-model="filterCourtClass"
                                        :options="currentCourtClassOptions">
                                    </b-form-select>
                                </b-form-group>
                            </b-col>
                        </b-row>
                        <b-row class="mt-3">
                            <b-col>
                                <b-button 
                                    type="submit"
                                    variant="primary"
                                    :disabled="isLoading"
                                    class="mr-2">
                                    <div class="d-flex align-items-center">
                                        <div class="loading-circle mr-2" v-if="isLoading"></div>
                                        <b-icon-search v-else class="mr-2" />
                                        <span>Search</span>
                                    </div>
                                </b-button>
                                <b-button 
                                    variant="secondary"
                                    @click="resetFilters">
                                    <b-icon-arrow-clockwise class="mr-2" />
                                    Reset Filters
                                </b-button>
                            </b-col>
                        </b-row>
                    </b-form>
                </div>
            </div>

            <!-- Error Alert -->
            <b-alert variant="danger" :show="errorMsg.length > 0" class="mb-3">
                <b class="mr-2">Error:</b> {{errorMsg}} <b-icon-exclamation-circle-fill/>
            </b-alert>

            <!-- Search Results Section -->
            <div v-if="hasSearched">
                <h4 v-if="!showAppearances">Search Results</h4>
                <h4 v-else>Appearances</h4>
                <p v-if="!showAppearances">Step 1: Select a file:</p>
                <p v-else>Step 2: Select an appearance:</p>

                <!-- Back Button for Appearances -->
                <b-button v-if="showAppearances" variant="outline-primary" class="mb-3" @click="goBackToFiles">
                    Back to Files
                </b-button>
            </div>

            <!-- Loading Indicator -->
            <div v-if="isLoading" class="text-center my-4">
                <div class="loading-circle mx-auto"></div>
                <p class="mt-2">Searching...</p>
            </div>

            <!-- Content -->
            <div class="scrollable-content" v-if="hasSearched && !isLoading">
                <!-- Empty Results Messages -->
                <div v-if="!showAppearances && searchResults.length === 0" class="text-center text-muted my-4">
                    <b-icon-search scale="2" class="mb-3"></b-icon-search>
                    <h5>No files found</h5>
                    <p>Try adjusting your search criteria and search again.</p>
                </div>

                <!-- Files Card -->
                <div v-if="!showAppearances && searchResults.length > 0">
                    <div v-for="file in searchResults" :key="file.physicalFileId" class="card mt-2 mx-4 p-3">
                        <label class="d-flex align-items-center" style="cursor: pointer;">
                            <b-form-radio 
                                v-model="selectedFile" 
                                :value="file" 
                                name="file-selection" 
                                @change="handleFileSelection(file)" 
                                class="mr-3">
                            </b-form-radio>
                            <b-col cols="5">
                                <div>
                                    <strong>Court File Number:</strong> {{ file.fileNumberTxt }}
                                </div>
                                <div>
                                    <strong>Court Level:</strong> {{ file.courtLevelCd }}
                                </div>
                                <div>
                                    <strong>Court Class:</strong> {{ file.courtClassCd }}
                                </div>
                                <div>
                                    <strong>File Originating Location:</strong> {{ HomeAgencyNameByCode(file.fileHomeAgencyId) }}
                                </div>
                                <div>
                                    <strong>Next Appearance Date:</strong> {{ formatDate(file.nextApprDt) }}
                                </div>
                            </b-col>
                            <b-col cols="6">
                                <div>
                                    <strong v-if="!isCriminal">Participant(s):</strong> 
                                    <strong v-if="isCriminal">Accused:</strong>
                                    <div v-for="participant in file.participant" :key="participant.fullNm" style="font-size: 0.83rem;">
                                        <div>- <strong>Full Name:</strong> {{ participant.fullNm }}</div>
                                        <div v-if="isCriminal">- <strong>Charge(s):</strong></div>
                                        <div v-if="isCriminal" v-for="charge in participant.charge" :key="charge.sectionTxt">
                                            <div>&nbsp;&nbsp;&nbsp;&nbsp;<strong>Section:</strong> {{ charge.sectionTxt }}</div>
                                            <div>&nbsp;&nbsp;&nbsp;&nbsp;<strong>Description:</strong> {{ charge.sectionDscTxt }}</div>
                                            <div v-if="participant.charge.length > 1 && participant.charge.indexOf(charge) !== participant.charge.length - 1">
                                                <hr style="border: none; border-top: 1px solid #ccc; margin: 0.5rem 0; margin-right: 15rem; margin-left: 1rem;" />
                                            </div>
                                        </div>
                                        <div v-if="file.participant.length > 1 && file.participant.indexOf(participant) !== file.participant.length - 1">
                                            <hr style="border: none; border-top: 1px solid #ccc; margin: 0.5rem 0;" />
                                        </div>
                                    </div>
                                </div>
                            </b-col>
                        </label>
                    </div>
                </div>

                <!-- Appearances Card -->
                <div v-if="showAppearances">
                    <div v-if="appearanceResults.length === 0" class="text-center text-muted my-4">
                        <b-icon-calendar-x scale="2" class="mb-3"></b-icon-calendar-x>
                        <h5>No appearances found</h5>
                        <p>No appearances found for the selected file.</p>
                    </div>
                    <div v-for="appearance in appearanceResults" :key="appearance.appearanceId" class="card mt-2 mx-4 p-3">
                        <label class="d-flex align-items-center" style="cursor: pointer;">
                            <b-form-radio 
                                v-model="selectedAppearance" 
                                :value="appearance" 
                                name="appearance-selection"
                                @change="handleAppearanceSelection(appearance)" 
                                class="mr-3">
                            </b-form-radio>
                            <b-col>
                                <div>
                                    <strong>Appearance Date:</strong> {{ formatDate(appearance.appearanceDt) }}
                                </div>
                                <div>
                                    <strong>Appearance Time:</strong> {{ formatTime(appearance.appearanceTm) }}
                                </div>
                                <div>
                                    <strong>Court Room:</strong> {{ appearance.courtRoomCd }}
                                </div>
                                <div>
                                    <strong>Appearance Location:</strong> {{ HomeAgencyNameByCode(appearance.courtAgencyId) }}
                                </div>
                            </b-col>
                            <b-col>
                                <div>
                                    <strong>Reason:</strong> {{ appearance.appearanceReasonCd }}
                                </div>
                                <div>
                                    <strong>Judge Full Name:</strong> {{ appearance.judgeFullNm }}
                                </div>
                            </b-col>
                        </label>
                    </div>
                </div>
            </div>

            <!-- No Search Performed Message -->
            <div v-if="!hasSearched && !isLoading" class="text-center text-muted my-5">
                <b-icon-search scale="3" class="mb-3"></b-icon-search>
                <h4>Search for Files and Appearances</h4>
                <p>Enter your search criteria above and click "Search" to find files and appearances.</p>
            </div>
        </div>

        <template v-slot:modal-header-close>                 
            <b-button variant="outline-white" style="padding-bottom:0;" class="text-primary close-button" @click="closeModal"
            >&times;</b-button>
        </template>

        <template v-slot:modal-footer>
            <b-button v-if="showAppearances" variant="success" :disabled="!selectedAppearance" @click="fillCaseData">
                <b-icon-pencil-fill class="mr-2" /> Fill
            </b-button>
            <b-button v-if="!showAppearances" variant="primary" :disabled="!selectedFile" @click="searchAppearances">
                <div class="d-flex align-items-center">
                    <div class="loading-circle mr-2" v-if="isSearching"></div>
                    <span>Next</span>
                </div>
            </b-button>
        </template>
    </b-modal>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import moment from 'moment-timezone';
import { locationsInfoType } from '@/types/Common/json';
import { caseTypeOptions, courtLevelOptions, criminalCourtClassOptions, civilCourtClassOptions } from '../BookingEnums';

import { namespace } from "vuex-class";
import "@/store/modules/common";
const commonState = namespace("Common");

@Component
export default class SearchAppearanceModal extends Vue {
    
    @Prop({required: true})
    fileOriginatingLocation!: locationsInfoType;

    @Prop({required: true})
    caseType!: string;

    @Prop({required: true})
    fileNumber!: string;

    @Prop({default: ''})
    courtClass!: string;

    @Prop({default: ''})
    courtLevel!: string;

    @Prop({default: false})
    visible!: boolean;

    @commonState.State
    public courtLocations!: locationsInfoType[];    // Filter state
    filterLocation = null;
    filterCaseType = 'Criminal'; // Default to Criminal
    filterFileNumber = '';
    filterSurname = '';
    filterSearchMode = 'FILENO'; // Default to File Number search
    filterCourtLevel = '';
    filterCourtClass = '';
    
    showFilters = true;

    
    caseTypeOptions = caseTypeOptions;
    searchModeOptions = [
        { text: 'By File Number', value: 'FILENO' },
        { text: 'By Last Name', value: 'PARTNAME' }
    ];
    courtLevelOptions = [
        { text: 'All', value: '' },
        ...courtLevelOptions
    ];
    criminalCourtClassOptions = [
        { text: 'All', value: '' },
        ...criminalCourtClassOptions
    ];
    civilCourtClassOptions = [
        { text: 'All', value: '' },
        ...civilCourtClassOptions
    ];

    created() {
        this.courtLevelOptions = [
            { text: 'All', value: '' },
            ...courtLevelOptions
        ];
        this.criminalCourtClassOptions = [
            { text: 'All', value: '' },
            ...criminalCourtClassOptions
        ];
        this.civilCourtClassOptions = [
            { text: 'All', value: '' },
            ...civilCourtClassOptions
        ];
    }

    // Validation states
    validationStates = {
        location: null,
        caseType: null,
        fileNumber: null,
        surname: null
    };

    // Modal state
    showModal = false;
    searchResults = [];
    appearanceResults = [];
    showAppearances = false;
    isSearching = false;
    isLoading = false;
    hasSearched = false;
    selectedFile = null;
    selectedAppearance = null;
    isCriminal = false;
    errorMsg = '';    @Watch('visible')
    onVisibleChanged(newVal: boolean) {
        if (newVal) {
            this.openModal();
        } else {
            this.showModal = false;
        }
    }

    get currentCourtClassOptions() {
        if (this.filterCaseType === 'Criminal') {
            return this.criminalCourtClassOptions;
        } else if (this.filterCaseType === 'Civil') {
            return this.civilCourtClassOptions;
        }
        return [{ text: 'All', value: '' }];
    }

    get sortedCourtLocations() {
        return this.courtLocations.slice().sort((a, b) => a.name.localeCompare(b.name));
    }  
    toggleFilters() {
        this.showFilters = !this.showFilters;
    }

    initializeFilters() {
        // Initialize filters from props or defaults
        this.filterLocation = null;
        this.filterCaseType = this.caseType || 'Criminal'; 
        this.filterFileNumber = this.fileNumber;
        this.filterCourtLevel = this.courtLevel;
        this.filterCourtClass = this.courtClass;
        
        this.validationStates = {
            location: null,
            caseType: null,
            fileNumber: null,
            surname: null
        };
    }

    validateFilters() {
        let isValid = true;
        this.validationStates = {
            location: null,
            caseType: null,
            fileNumber: null,
            surname: null
        };

        if (this.filterSearchMode === 'FILENO') {
            if (!this.filterLocation) {
                this.validationStates.location = false;
                isValid = false;
            }
            if (!this.filterFileNumber || this.filterFileNumber.trim() === '') {
                this.validationStates.fileNumber = false;
                isValid = false;
            }
        }
        if (this.filterSearchMode === 'PARTNAME') {
            if (!this.filterSurname || this.filterSurname.trim() === '') {
            this.validationStates.surname = false;
            isValid = false;
            }
        }
        if (!this.filterCaseType) {
            this.validationStates.caseType = false;
            isValid = false;
        }

        return isValid;
    }

    performSearch(event) {
        if (event) {
            event.preventDefault();
        }

        this.errorMsg = '';
        
        if (!this.validateFilters()) {
            this.errorMsg = 'Please fill in all required fields before searching.';
            return;
        }

        this.hasSearched = true;
        this.searchFiles();
    }    
    
    resetFilters() {
        // Clear all filters
        this.filterLocation = null;
        this.filterCaseType = 'Criminal';
        this.filterCourtLevel = '';
        this.filterCourtClass = '';
        this.filterFileNumber = '';
        this.filterSurname = '';
        
        // Reset validation states
        this.validationStates = {
            location: null,
            caseType: null,
            fileNumber: null,
            surname: null
        };
        
        this.errorMsg = '';
        this.hasSearched = false;
        this.searchResults = [];
        this.appearanceResults = [];
        this.showAppearances = false;
        this.selectedFile = null;
        this.selectedAppearance = null;
        this.showFilters = true; // Show filters when reset
    }    
    
    openModal() {
        this.initializeFilters();
        this.resetModalState();
        this.showFilters = true; // Always show filters when modal opens
        this.showModal = true;
    }

    resetModalState() {
        this.searchResults = [];
        this.appearanceResults = [];
        this.showAppearances = false;
        this.isSearching = false;
        this.isLoading = false;
        this.hasSearched = false;
        this.selectedFile = null;
        this.selectedAppearance = null;
        this.errorMsg = '';
    }    
    
    searchFiles() {
        this.isLoading = true;
        this.isSearching = true;
        this.errorMsg = '';
        this.isCriminal = this.filterCaseType === 'Criminal';
        
        // const sanitizedFileNumber = this.filterFileNumber.replace(/\D/g, '');
        const queryParams: any = {
            courtClassCd: this.filterCourtClass,
            courtLevelCd: this.filterCourtLevel,
            searchMode: this.filterSearchMode
        };
        if (this.filterLocation && this.filterLocation.locationCode) {
            queryParams.fileHomeAgencyId = this.filterLocation.locationCode;
        }
        if (this.filterSearchMode === 'PARTNAME') {
            queryParams.lastNm = this.filterSurname;
        }
        if (this.filterSearchMode === 'FILENO') {
            queryParams.fileNumberTxt = this.filterFileNumber;
        }
        this.$http.post(`/files/search`, { 
            is_criminal: this.isCriminal,
            query: queryParams,
        })        .then((response) => {
            this.isLoading = false;
            this.isSearching = false;
            if (response.data.fileDetail && response.data.fileDetail.length > 0) {
                this.searchResults = response.data.fileDetail;
                // Hide filters if we have results
                if (this.searchResults.length > 0) {
                    this.showFilters = false;
                }
            } else {
                this.searchResults = [];
            }
        }, (err) => {
            this.isLoading = false;
            this.isSearching = false;
            this.searchResults = [];
            this.errorMsg = 'Error searching files. Please try again.';
            console.error('Error searching files:', err);
        });
    }    
    
    searchAppearances() {
        if (!this.selectedFile) return;
        
        this.isLoading = true;
        this.isSearching = true;
        this.errorMsg = '';
        this.selectedAppearance = null;
        
        const queryParams = {
            futureYN: 'Y'
        };
        
        this.$http.post(`/files/appearance`, { 
            is_criminal: this.isCriminal,
            file_id: this.isCriminal ? this.selectedFile.mdocJustinNo : this.selectedFile.physicalFileId,
            query: queryParams,
        })
        .then((response) => {
            this.isLoading = false;
            this.isSearching = false;
            this.appearanceResults = response.data.apprDetail || [];
            this.showAppearances = true;
        }, (err) => {
            this.isLoading = false;
            this.isSearching = false;
            this.appearanceResults = [];
            this.showAppearances = true;
            this.errorMsg = 'Error searching appearances. Please try again.';
            console.error('Error searching appearances:', err);
        });
    }

    handleFileSelection(file) {
        this.selectedFile = file;
    }

    handleAppearanceSelection(appearance) {
        this.selectedAppearance = appearance;
    }    
    
    goBackToFiles() {
        this.showAppearances = false;
        this.selectedAppearance = null;
        this.errorMsg = '';
        this.showFilters = true; // Show filters when going back to files
    }    
    
    fillCaseData() {
        if (!this.selectedFile) return;

        const caseData = {
            file: this.selectedFile.fileNumberTxt,
            courtClass: this.selectedFile.courtClassCd,
            courtLevel: this.selectedFile.courtLevelCd,
            caseName: this.selectedFile.participant.length > 0 
                ? this.selectedFile.participant.map(p => p.fullNm).join('; ') 
                : '',
            room: this.selectedAppearance?.courtRoomCd || '',
            reason: this.selectedAppearance?.appearanceReasonCd || '',
            caseType: this.filterCaseType // Include the case type from filter
        };

        this.$emit('case-filled', caseData);
        this.closeModal();
    }

    closeModal() {
        this.showModal = false;
        this.$emit('close');
    }

    onModalHidden() {
        this.$emit('close');
    }

    HomeAgencyNameByCode(code) {
        const location = this.courtLocations.find(loc => loc.locationCode === code);
        return location ? location.name : '';
    }

    formatDate(dateString) {
        if (!dateString) return '';
        return moment(dateString).format('YYYY-MM-DD');
    }

    formatTime(dateString) {
        if (!dateString) return '';
        return moment(dateString).format('HH:mm');
    }
}
</script>

<style lang="scss" scoped>
::v-deep .labels{
    font-weight: 600;
    color: rgb(63, 98, 133);
}

.custom-modal-height {
    .modal-dialog {
        height: 90vh;
        max-height: 90vh;
        margin: 5vh auto;
    }
    
    .modal-content {
        height: 100%;
        max-height: 100%;
        display: flex;
        flex-direction: column;
    }
    
    .modal-body {
        flex: 1;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }
    
    .modal-footer {
        flex-shrink: 0;
        display: flex !important;
        justify-content: flex-end;
        padding: 1rem;
        border-top: 1px solid #dee2e6;
        background-color: #fff;
    }
}

.loading-circle {
    border: 2px solid #f3f3f3; 
    border-top: 2px solid #007bff;
    border-radius: 50%; 
    width: 1.2rem;
    height: 1.2rem; 
    animation: spin 1s linear infinite; 
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

.scrollable-content {
    flex: 1;
    overflow-y: auto; 
    overflow-x: hidden;
    max-height: 41rem;
    min-height: 0; /* Important for flexbox scrolling */
    border: 1px solid #e0e0e0; /* Add subtle border */
    border-radius: 0.375rem; /* Rounded corners */
    background-color: #fafafa; /* Light background */
    padding: 0.5rem; /* Add some padding */
}

.filter-section a {
    text-decoration: none;
    font-weight: 500;
}

.filter-section a:hover {
    text-decoration: underline;
}

.modal-content-wrapper {
    min-height: 0; /* Important for flexbox */
    flex: 1;
    min-height: 50rem;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    height: 100%;
}

.flex-shrink-0 {
    flex-shrink: 0;
}
</style>
