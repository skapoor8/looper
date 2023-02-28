#!/bin/bash

# resource names ---------------------------------------------------------------
RG_NAME='rg-cats'
COSMOS_NAME='cosmos-skapoor-cats'
STORAGE_NAME='stoskapoorcats'
FUNC_NAME='func-cats-api'
RESOURCE_LOCATION='eastus'
RELEASE_BRANCH='main-cats'
REPO_URL="https://github.com/skapoor8/ts"
BUILD_PATH="./nest-js/azure-function-api-cosmos"

# color codes ------------------------------------------------------------------
BLUE='\033[0;34m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

printf "${BLUE}Checking if user is logged in... ${NC}\n"
if [[ $(az account show) ]]; then
    printf "${GREEN}Success${NC}\n\n"
else
    printf "${RED}User is not logged in. Please log in with 'az login'. ${NC}\n\n"
    exit 1
fi

printf "${BLUE}Destroying deployment pipeline with github actions... ${NC}\n"
{
    az functionapp deployment github-actions remove --repo "https://github.com/skapoor8/ts" \
        -g $RG_NAME -n $FUNC_NAME --login-with-github \
        -b $RELEASE_BRANCH
} || {
    printf "${RED}Failed${NC}\n\n"
    exit 1
}

# printf "${BLUE}Destroying resource group rg-cats... ${NC}\n"
# {
#     az group delete --name rg-cats -y
#     printf "${GREEN}Success${NC}\n\n"
# } || {
#     printf "${RED}Failed${NC}\n\n"
# }

printf "${GREEN}Infrastructure teardown complete${NC}\n"
