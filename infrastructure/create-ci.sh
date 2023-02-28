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

# todo: could be worth checking is user has ssh-added their identities

printf "${BLUE}Creating deployment pipeline with github actions... ${NC}\n" #---
{
    printf "${BLUE}Checking branch $RELEASE_BRANCH exists... ${NC}\n"
    # bash: check if cmd outputs string. this is not working...
    if [[ $(git ls-remote --heads git@github.com:skapoor8/ts.git $RELEASE_BRANCH) ]]; then
        printf "${GREEN}Branch exists${NC}\n"
    else
        printf "${Blue}Branch does not exist. Creating..."
        {
            git checkout -b $RELEASE_BRANCH &&
                git push origin $RELEASE_BRANCH &&
                git checkout main
        } || {
            git checkout main
            printf "${RED}Error creating branch${NC}\n"
            false
        }
    fi

    printf "${BLUE}Setting SCM_DO_BUILD_DURING_DEPLOYMENT=true in function app settings${NC}\n"
    # setting SCM_DO_BUILD_DURING_DEPLOYMENT to true, otherwise github action fails
    az functionapp config appsettings set --name $FUNC_NAME \
        --resource-group $RG_NAME --settings "SCM_DO_BUILD_DURING_DEPLOYMENT=true"

    printf "${BLUE}Creating github action. You will be prompted for your passphrase...${NC}\n"
    az functionapp deployment github-actions add --repo $REPO_URL \
        -g $RG_NAME -n $FUNC_NAME --login-with-github \
        --build-path $BUILD_PATH -b $RELEASE_BRANCH
    printf "${GREEN}Success. Edit your workflow file to give it a more readable name (recommended).${NC}\n\n"
} || {
    printf "${RED}Failed. Run infrastructure/destroy.sh to tear down existing resources.${NC}\n\n"
    exit 1
}
