<template>
    <b-modal class="custom-modal-height" size="xl" v-model="showModal" id="search-appearance-modal"
        header-class="bg-white text-primary" centered @hidden="onModalHidden">

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
                                <b-form-group label="Search Mode" class="labels">
                                    <b-form-radio-group v-model="filterSearchMode" :options="searchModeOptions"
                                        class="w-100">
                                    </b-form-radio-group>
                                </b-form-group>
                            </b-col>
                            <b-col cols="3">
                                <b-form-group v-if="filterSearchMode === 'FILENO'" :label="'Court File Number'"
                                    :label-for="'file-number'" class="labels">
                                    <b-form-input :id="'file-number'" v-model="filterFileNumber"
                                        :state="validationStates.fileNumber" :placeholder="'Enter file number'">
                                    </b-form-input>
                                    <b-form-invalid-feedback v-if="validationStates.fileNumber === false">
                                        File number is required
                                    </b-form-invalid-feedback>
                                </b-form-group>

                                <div v-if="filterSearchMode === 'PARTNAME'">
                                    <b-form-group :label="'Last Name'" :label-for="'lastname'" class="labels">
                                        <b-form-input :id="'lastname'" v-model="filterSurname"
                                            :state="validationStates.surname" :placeholder="'Enter Last Name'">
                                        </b-form-input>
                                        <b-form-invalid-feedback v-if="validationStates.surname === false">
                                            Last Name is required
                                        </b-form-invalid-feedback>
                                    </b-form-group>
                                    <b-form-group :label="'First Name'" :label-for="'firstname'" class="labels mt-2">
                                        <b-form-input :id="'firstname'" v-model="filterGivenName"
                                            :state="validationStates.givenName" :placeholder="'Enter First Name'">
                                        </b-form-input>
                                        <b-form-invalid-feedback v-if="validationStates.givenName === false">
                                            First Name is required
                                        </b-form-invalid-feedback>
                                    </b-form-group>
                                </div>

                                <b-form-group v-if="filterSearchMode === 'ORGNAME'" :label="'Organization Name'"
                                    :label-for="'orgname'" class="labels">
                                    <b-form-input :id="'orgname'" v-model="filterOrgName"
                                        :state="validationStates.orgName" :placeholder="'Enter Organization Name'">
                                    </b-form-input>
                                    <b-form-invalid-feedback v-if="validationStates.orgName === false">
                                        Organization Name is required
                                    </b-form-invalid-feedback>
                                </b-form-group>
                            </b-col>
                            <b-col cols="3">
                                <b-form-group label="Court File Location" label-for="location" class="labels">
                                    <b-form-select id="location" v-model="filterLocation"
                                        :state="validationStates.location"
                                        :options="[{ text: 'Select Location', value: null }, ...sortedCourtLocations.map(loc => ({ text: loc.name, value: loc }))]">
                                    </b-form-select>
                                    <b-form-invalid-feedback
                                        v-if="filterSearchMode === 'FILENO' && validationStates.location === false">
                                        Court File Location is required
                                    </b-form-invalid-feedback>
                                </b-form-group>
                            </b-col>
                            <b-col cols="3">
                                <b-form-group label="Case Type" class="labels">
                                    <b-form-radio-group v-model="filterCaseType" :state="validationStates.caseType"
                                        :options="caseTypeOptions" class="w-100" @change="filterCourtClass = ''">
                                    </b-form-radio-group>
                                    <b-form-invalid-feedback v-if="validationStates.caseType === false">
                                        Case Type is required
                                    </b-form-invalid-feedback>
                                </b-form-group>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col cols="6">
                                <b-form-group label="Court Level (Optional)" label-for="court-level" class="labels">
                                    <b-form-select id="court-level" v-model="filterCourtLevel"
                                        :options="courtLevelOptions">
                                    </b-form-select>
                                </b-form-group>
                            </b-col>
                            <b-col cols="6">
                                <b-form-group label="Court Class (Optional)" label-for="court-class" class="labels">
                                    <b-form-select id="court-class" v-model="filterCourtClass"
                                        :options="currentCourtClassOptions">
                                    </b-form-select>
                                </b-form-group>
                            </b-col>
                        </b-row>
                        <b-row class="mt-3">
                            <b-col>
                                <b-button type="submit" variant="primary" :disabled="isLoading" class="mr-2">
                                    <div class="d-flex align-items-center">
                                        <div class="loading-circle mr-2" v-if="isLoading"></div>
                                        <b-icon-search v-else class="mr-2" />
                                        <span>Search</span>
                                    </div>
                                </b-button>
                                <b-button variant="secondary" @click="resetFilters">
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
                <b class="mr-2">Error:</b> {{ errorMsg }} <b-icon-exclamation-circle-fill />
            </b-alert>

            <!-- Search Results Section -->
            <div v-if="hasSearched">
                <h4 v-if="!showAppearances">Search Results <span v-if="allSearchResults.length > 0"
                        class="text-secondary font-weight-normal">({{ allSearchResults.length }} files found)</span>
                </h4>
                <h4 v-else>Appearances <span v-if="allAppearanceResults.length > 0"
                        class="text-secondary font-weight-normal">({{ allAppearanceResults.length }} appearances
                        found)</span>
                </h4>
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
                    <div v-for="file in searchResults" :key="file.physicalFileId" :data-file-id="file.physicalFileId"
                        class="card mt-2 mx-4 mb-4" :class="{ 'bg-light': !isDateFuture(file.nextApprDt) }">
                        <div class="p-3 d-flex flex-row">
                            <div class="color-bar mr-2"
                                :class="{ 'future': isDateFuture(file.nextApprDt), 'past': !isDateFuture(file.nextApprDt) }">
                            </div>
                            <div class="flex-grow-1">
                                <div class="d-flex">
                                    <div class="col-6">
                                        <div>
                                            <strong>Court File Number:</strong> {{ file.fileNumberTxt }}
                                        </div>
                                        <div>
                                            <strong>Court Level:</strong> {{ file.courtLevelCd }}
                                        </div>
                                        <div>
                                            <strong>Court Class:</strong> {{ file.courtClassCd }}
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div>
                                            <strong>File Originating Location:</strong> {{
                                                HomeAgencyNameByCode(file.fileHomeAgencyId) }}
                                        </div>
                                        <div>
                                            <strong>Next Appearance Date:</strong> {{ formatDate(file.nextApprDt) }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="px-3 pb-3">
                            <strong class="mb-2 d-block">Participant:</strong>
                            <div v-for="(participant, participantIndex) in file.participant" :key="participantIndex">
                                <div class="card p-2 mb-2" :class="{ 'bg-light': !isDateFuture(file.nextApprDt) }"
                                    :data-participant-id="participantIndex" :data-file-id="file.physicalFileId">
                                    <label class="d-flex align-items-start mb-0" style="cursor: pointer;">
                                        <div style="padding-top: 3px;">
                                            <b-form-radio v-model="selectedParticipant"
                                                :value="{ file: file, participant: participant }"
                                                name="participant-selection"
                                                @change="handleParticipantSelection(file, participant)" class="mr-3">
                                            </b-form-radio>
                                        </div>
                                        <div class="flex-grow-1">
                                            <div class="d-flex">
                                                <div class="col-6">
                                                    <div>
                                                        <strong>Full Name:</strong> {{ participant.fullNm }}
                                                    </div>
                                                </div>
                                                <div class="col-6">
                                                    <div v-if="isCriminal">
                                                        <strong>Charge(s):</strong>
                                                        <div v-for="(charge, chargeIndex) in participant.charge"
                                                            :key="chargeIndex">
                                                            <div>
                                                                <strong>Section:</strong> {{ charge.sectionTxt }}
                                                            </div>
                                                            <div>
                                                                <strong>Description:</strong> {{ charge.sectionDscTxt }}
                                                            </div>
                                                            <div
                                                                v-if="participant.charge.length > 1 && chargeIndex !== participant.charge.length - 1">
                                                                <hr
                                                                    style="border: none; border-top: 1px solid #ccc; margin: 0.5rem 0;" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="text-center mt-3 mb-2" v-if="allSearchResults.length > visibleSearchResults">
                        <b-button variant="outline-primary" @click="loadMoreFiles">
                            Load More ({{ visibleSearchResults }} of {{ allSearchResults.length }})
                        </b-button>
                    </div>
                </div>

                <!-- Appearances Card -->
                <div v-if="showAppearances">
                    <div v-if="appearanceResults.length === 0" class="text-center text-muted my-4">
                        <b-icon-calendar-x scale="2" class="mb-3"></b-icon-calendar-x>
                        <h5>No appearances found</h5>
                        <p>No appearances found for the selected file.</p>
                    </div>
                    <div v-for="appearance in appearanceResults" :key="appearance.appearanceId"
                        class="card mt-2 mx-4 p-3 d-flex flex-row"
                        :class="{ 'bg-light': !isDateFuture(appearance.appearanceDt) }">
                        <div class="color-bar mr-2"
                            :class="{ 'future': isDateFuture(appearance.appearanceDt), 'past': !isDateFuture(appearance.appearanceDt) }">
                        </div>
                        <label class="d-flex align-items-center flex-grow-1" style="cursor: pointer;">
                            <b-form-radio v-model="selectedAppearance" :value="appearance" name="appearance-selection"
                                @change="handleAppearanceSelection(appearance)" class="mr-3">
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
                                    <strong>Appearance Location:</strong> {{
                                        HomeAgencyNameByCode(appearance.courtAgencyId) }}
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
                    <div class="text-center mt-3 mb-2" v-if="allAppearanceResults.length > visibleAppearanceResults">
                        <b-button variant="outline-primary" @click="loadMoreAppearances">
                            Load More ({{ visibleAppearanceResults }} of {{ allAppearanceResults.length }})
                        </b-button>
                    </div>
                </div>
            </div>

            <div v-if="!hasSearched && !isLoading" class="text-center text-muted my-5">
                <b-icon-search scale="3" class="mb-3"></b-icon-search>
                <h4>Search for Files and Appearances</h4>
                <p>Enter your search criteria above and click "Search" to find files and appearances.</p>
            </div>
        </div>

        <template v-slot:modal-header-close>
            <b-button variant="outline-white" style="padding-bottom:0;" class="text-primary close-button"
                @click="closeModal">&times;</b-button>
        </template>

        <template v-slot:modal-footer>
            <b-button v-if="showAppearances" variant="success" :disabled="!selectedAppearance" @click="fillCaseData">
                <b-icon-pencil-fill class="mr-2" /> Fill
            </b-button>
            <b-button v-if="!showAppearances" variant="primary" :disabled="!selectedParticipant"
                @click="searchAppearances">
                <div class="d-flex align-items-center">
                    <div class="loading-circle mr-2" v-if="isSearching"></div>
                    <span>Next</span>
                </div>
            </b-button>
        </template>
    </b-modal>
</template>

<script lang="ts">
import { locationsInfoType } from '@/types/Common/json';
import moment from 'moment-timezone';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { caseTypeOptions, civilCourtClassOptions, courtLevelOptions, criminalCourtClassOptions } from '../BookingEnums';

import "@/store/modules/common";
import { namespace } from "vuex-class";
const commonState = namespace("Common");

@Component
export default class SearchAppearanceModal extends Vue {

    @Prop({ required: true })
    fileOriginatingLocation!: locationsInfoType;

    @Prop({ required: true })
    caseType!: string;

    @Prop({ required: true })
    fileNumber!: string;

    @Prop({ default: '' })
    courtClass!: string;

    @Prop({ default: '' })
    courtLevel!: string;

    @Prop({ default: false })
    visible!: boolean;

    @commonState.State
    public courtLocations!: locationsInfoType[];    
    filterLocation = null;
    filterCaseType = 'Criminal'; 
    filterFileNumber = '';
    filterSurname = '';
    filterGivenName = ''; 
    filterOrgName = ''; 
    filterSearchMode = 'FILENO'; 
    filterPartNameMode = 'PERSON'; 
    filterCourtLevel = '';
    filterCourtClass = '';

    showFilters = true;


    caseTypeOptions = caseTypeOptions;
    searchModeOptions = [
        { text: 'By File Number', value: 'FILENO' },
        { text: 'By Name', value: 'PARTNAME' },
        { text: 'By Organization', value: 'ORGNAME' }
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
        surname: null,
        givenName: null,
        orgName: null
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
    selectedParticipant = null; 
    selectedAppearance = null;
    isCriminal = false;
    errorMsg = '';

    // Pagination state
    visibleSearchResults = 5; 
    visibleAppearanceResults = 5; 
    allSearchResults = []; 
    allAppearanceResults = [];

    @Watch('visible')
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
        this.filterLocation = this.fileOriginatingLocation || null;
        this.filterCaseType = this.caseType || 'Criminal';
        this.filterFileNumber = this.fileNumber;
        this.filterCourtLevel = this.courtLevel;
        this.filterCourtClass = this.courtClass;
        this.filterGivenName = '';
        this.filterOrgName = '';

        this.validationStates = {
            location: null,
            caseType: null,
            fileNumber: null,
            surname: null,
            givenName: null,
            orgName: null
        };
    }

    validateFilters() {
        let isValid = true;
        this.validationStates = {
            location: null,
            caseType: null,
            fileNumber: null,
            surname: null,
            givenName: null,
            orgName: null
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
        else if (this.filterSearchMode === 'PARTNAME') {
            if (!this.filterSurname || this.filterSurname.trim() === '') {
                this.validationStates.surname = false;
                isValid = false;
            }
            if (!this.filterGivenName || this.filterGivenName.trim() === '') {
                this.validationStates.givenName = false;
                isValid = false;
            }
        }
        else if (this.filterSearchMode === 'ORGNAME') {
            if (!this.filterOrgName || this.filterOrgName.trim() === '') {
                this.validationStates.orgName = false;
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
        this.filterGivenName = '';
        this.filterOrgName = '';
        this.filterSearchMode = 'FILENO';

        // Reset validation states
        this.validationStates = {
            location: null,
            caseType: null,
            fileNumber: null,
            surname: null,
            givenName: null,
            orgName: null
        };

        this.errorMsg = '';
        this.hasSearched = false;
        this.searchResults = [];
        this.appearanceResults = [];
        this.allSearchResults = [];
        this.allAppearanceResults = [];
        this.showAppearances = false;
        this.selectedFile = null;
        this.selectedParticipant = null;
        this.selectedAppearance = null;
        this.showFilters = true; 
        this.visibleSearchResults = 5;
        this.visibleAppearanceResults = 5;
    } openModal() {
        this.initializeFilters();
        this.resetModalState();
        this.showFilters = true; 
        this.showModal = true;
    }

    resetModalState() {
        this.searchResults = [];
        this.appearanceResults = [];
        this.allSearchResults = [];
        this.allAppearanceResults = [];
        this.showAppearances = false;
        this.isSearching = false;
        this.isLoading = false;
        this.hasSearched = false;
        this.selectedFile = null;
        this.selectedParticipant = null;
        this.selectedAppearance = null;
        this.errorMsg = '';
        this.visibleSearchResults = 5;
        this.visibleAppearanceResults = 5;
    }

    loadMoreFiles() {
        this.visibleSearchResults += 5;
        this.searchResults = this.allSearchResults.slice(0, this.visibleSearchResults);
    }

    loadMoreAppearances() {
        this.visibleAppearanceResults += 5;
        this.appearanceResults = this.allAppearanceResults.slice(0, this.visibleAppearanceResults);
    }

    searchFiles() {
        this.isLoading = true;
        this.isSearching = true;
        this.errorMsg = '';
        this.isCriminal = this.filterCaseType === 'Criminal';

        this.visibleSearchResults = 5;

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
            queryParams.givenNm = this.filterGivenName; // Now required
        }
        else if (this.filterSearchMode === 'ORGNAME') {
            queryParams.searchMode = 'PARTNAME'; // We still use PARTNAME search mode for backend
            queryParams.orgNm = this.filterOrgName;
        }
        else if (this.filterSearchMode === 'FILENO') {
            queryParams.fileNumberTxt = this.filterFileNumber;
        }
        this.$http.post(`/files/search`, {
            is_criminal: this.isCriminal,
            query: queryParams,
        }).then((response) => {
            this.isLoading = false;
            this.isSearching = false;
            if (response.data.fileDetail && response.data.fileDetail.length > 0) {

                this.allSearchResults = response.data.fileDetail;
                this.searchResults = this.allSearchResults.slice(0, this.visibleSearchResults);

                // Hide filters if we have results
                if (this.searchResults.length > 0) {
                    this.showFilters = false;
                }
            } else {
                this.allSearchResults = [];
                this.searchResults = [];
            }
        }, (err) => {
            this.isLoading = false;
            this.isSearching = false;
            this.allSearchResults = [];
            this.searchResults = [];
            this.errorMsg = 'Error searching files. Please try again.';
            console.error('Error searching files:', err);
        });
    }

    searchAppearances() {
        if (!this.selectedParticipant) {
            this.errorMsg = 'Please select a participant before continuing.';
            return;
        }

        const selectedFile = this.selectedParticipant.file;

        this.isLoading = true;
        this.isSearching = true;
        this.errorMsg = '';
        this.selectedAppearance = null;

        // Reset pagination
        this.visibleAppearanceResults = 5;

        const queryParams = {
            futureYN: 'Y'
        };

        this.$http.post(`/files/appearance`, {
            is_criminal: this.isCriminal,
            file_id: this.isCriminal ? selectedFile.mdocJustinNo : selectedFile.physicalFileId,
            query: queryParams,
        })
            .then((response) => {
                this.isLoading = false;
                this.isSearching = false;
                this.allAppearanceResults = response.data.apprDetail || [];
                this.appearanceResults = this.allAppearanceResults.slice(0, this.visibleAppearanceResults);
                this.showAppearances = true;
            }, (err) => {
                this.isLoading = false;
                this.isSearching = false;
                this.allAppearanceResults = [];
                this.appearanceResults = [];
                this.showAppearances = true;
                this.errorMsg = 'Error searching appearances. Please try again.';
                console.error('Error searching appearances:', err);
            });
    }

    handleFileSelection(file) {
        this.selectedFile = file;
    }

    handleParticipantSelection(file, participant) {
        this.selectedFile = file;
        this.selectedParticipant = { file, participant };
    }

    handleAppearanceSelection(appearance) {
        this.selectedAppearance = appearance;
    }

    goBackToFiles() {
        this.showAppearances = false;
        this.selectedAppearance = null;
        this.errorMsg = '';

        if (this.selectedParticipant && this.selectedParticipant.file) {
            const selectedIndex = this.allSearchResults.findIndex(file =>
                file.physicalFileId === this.selectedParticipant.file.physicalFileId);

            if (selectedIndex >= 0) {
                this.visibleSearchResults = Math.max(5, Math.ceil((selectedIndex + 1) / 5) * 5);
            }
        }

        this.searchResults = this.allSearchResults.slice(0, this.visibleSearchResults); // Refresh the view
        this.showFilters = false;

        this.$nextTick(() => {
            this.scrollToSelectedParticipant();
        });
    }

    private scrollToSelectedParticipant() {
       /*
        * scroll to the selected participant in the file list
        * This method finds the DOM element corresponding to the selected participant
        * and scrolls it into view within the scrollable container, then adds a highlight class
        */
        setTimeout(() => {
            if (this.selectedParticipant && this.selectedParticipant.file) {
                const fileId = this.selectedParticipant.file.physicalFileId;
                const participantIndex = this.selectedParticipant.file.participant.findIndex(
                    p => p === this.selectedParticipant.participant
                );

                if (participantIndex !== -1) {
                    const participantElement = document.querySelector(
                        `[data-file-id="${fileId}"][data-participant-id="${participantIndex}"]`
                    );

                    if (participantElement) {
                        const scrollContainer = document.querySelector('.scrollable-content');

                        if (scrollContainer) {
                            const scrollContainerTop = scrollContainer.getBoundingClientRect().top;
                            const participantTop = participantElement.getBoundingClientRect().top;

                            const currentScrollTop = scrollContainer.scrollTop;
                            const relativeOffset = participantTop - scrollContainerTop;

                            const containerHeight = scrollContainer.clientHeight;
                            const elementHeight = participantElement.clientHeight;
                            const centerOffset = (containerHeight - elementHeight) / 2;

                            const scrollTop = currentScrollTop + relativeOffset - centerOffset;

                            // Smooth scroll to the element
                            scrollContainer.scrollTo({
                                top: scrollTop,
                                behavior: 'smooth'
                            });

                            // Add highlight class to the element and remove it after animation
                            participantElement.classList.add('highlighted-file');
                            setTimeout(() => {
                                participantElement.classList.remove('highlighted-file');
                            }, 2000);
                        }
                    }
                }
            }
        }, 200);
    }

    fillCaseData() {
        if (!this.selectedParticipant) return;

        const selectedFile = this.selectedParticipant.file;
        const selectedParticipantData = this.selectedParticipant.participant;

        const caseData = {
            file: selectedFile.fileNumberTxt,
            courtClass: selectedFile.courtClassCd,
            courtLevel: selectedFile.courtLevelCd,
            caseName: selectedParticipantData.fullNm || '',
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

    isDateFuture(dateString) {
        if (!dateString) return false;
        try {
            const date = moment(dateString).startOf('day');
            const today = moment().startOf('day');
            return date.isSameOrAfter(today);
        } catch (error) {
            return false;
        }
    }
}
</script>

<style lang="scss" scoped>
::v-deep .labels {
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
    min-height: 0;
    border: 1px solid #e0e0e0;
    border-radius: 0.375rem;
    background-color: #fafafa;
    padding: 0.5rem;
}

.filter-section a {
    text-decoration: none;
    font-weight: 500;
}

.filter-section a:hover {
    text-decoration: underline;
}

.modal-content-wrapper {
    min-height: 0;
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

.color-bar {
    width: 8px;
    align-self: stretch;
    border-radius: 4px;
}

.color-bar.future {
    background-color: #28a745;
}

.color-bar.past {
    background-color: #adb5bd;
}

@keyframes highlight-pulse {
    0% {
        background-color: rgba(0, 123, 255, 0.1);
    }

    50% {
        background-color: rgba(0, 123, 255, 0.3);
    }

    100% {
        background-color: rgba(0, 123, 255, 0.1);
    }
}

.highlighted-file {
    animation: highlight-pulse 1s ease-in-out 2;
    box-shadow: 0 0 8px rgba(0, 123, 255, 0.5);
    transition: box-shadow 0.3s ease-in-out;
}
</style>
