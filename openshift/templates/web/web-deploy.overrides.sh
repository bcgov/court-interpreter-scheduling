#!/bin/bash
_includeFile=$(type -p overrides.inc)
# Import ocFunctions.inc for getSecret
_ocFunctions=$(type -p ocFunctions.inc)
if [ ! -z ${_includeFile} ]; then
  . ${_ocFunctions}
  . ${_includeFile}
else
  _red='\033[0;31m'; _yellow='\033[1;33m'; _nc='\033[0m'; echo -e \\n"${_red}overrides.inc could not be found on the path.${_nc}\n${_yellow}Please ensure the openshift-developer-tools are installed on and registered on your path.${_nc}\n${_yellow}https://github.com/BCDevOps/openshift-developer-tools${_nc}"; exit 1;
fi

# ========================================================================================
# Special Deployment Parameters needed for proxy deployment
# ----------------------------------------------------------------------------------------
# The results need to be encoded as OpenShift template parameters for use with oc process.
# ========================================================================================

if createOperation; then
  readParameter "REAL_IP_FROM - Please provide it" REAL_IP_FROM "" "false"
  readParameter "AdditionalRealIpFromRules - Please provide it" AdditionalRealIpFromRules "" "false"
else
  # Get ALLOW_LIST from secret
  printStatusMsg "Getting allow list from secret ...\n"
  writeParameter "REAL_IP_FROM" "prompt_skipped" "false"
  writeParameter "AdditionalRealIpFromRules" "prompt_skipped" "false"
fi

SPECIALDEPLOYPARMS="--param-file=${_overrideParamFile}"
echo ${SPECIALDEPLOYPARMS}