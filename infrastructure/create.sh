#!/bin/bash

# resource names ---------------------------------------------------------------

RG_NAME='rg-looper'
STORAGE_NAME='stoskapoorlooper'
FUNC_NAME='func-skapoor-looper-api'
SWA_NAME='swa-skapoor-looper-client'
MYSQL_NAME='mysql-skapoor-looper-db2'
RESOURCE_LOCATION='eastus'
GITREPO='https://github.com/skapoor8/ts'

# color codes ------------------------------------------------------------------
BLUE='\033[0;34m'
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# accept args ------------------------------------------------------------------
path=''
while getopts ':u:p:l' flag; do
    case "${flag}" in
    p) mysql_password="${OPTARG}" ;;
    u) mysql_username="${OPTARG}" ;;
    l) path="${OPTARG}" ;;
    esac
done

echo "username: $mysql_username password: $mysql_password"

printf "${BLUE}Checking if user is logged in... ${NC}\n" # ---------------------
if [[ $(az account show) ]]; then
    printf "${GREEN}Success${NC}\n\n"
else
    printf "${RED}User is not logged in. Please log in with 'az login'. ${NC}\n\n"
    exit 1
fi

# printf "${BLUE}Creating resource group... ${NC}\n"
# {
#     az group create --name $RG_NAME --location $RESOURCE_LOCATION
#     printf "${GREEN}Success${NC}\n\n"
# } || {
#     printf "${RED}Failed${NC}\n\n"
#     exit 1
# }

printf "${BLUE}Creating azure db for mysql instance...${NC}\n" # ---------------------------------
{
    printf "${BLUE}Checking if instance already exists...${NC}\n"
    MYSQL_ALREADY_MADE_QUERY=$(az mysql flexible-server list --query "[?name=='$MYSQL_NAME'].name")

    if [[ "$MYSQL_ALREADY_MADE_QUERY" == *"$MYSQL_NAME"* ]]; then
        printf "${YELLOW}%b${NC}" 'Azure for MySQL instance already exists. Ensure ' \
            'this is okay. The instance may have been created by a prior run of ' \
            'this script, or this may be a legitimate naming conflict.\n\n'
    fi

    printf "${GREEN}DB does not exist (in your resource group)${NC}\n"
    az mysql flexible-server create -g $RG_NAME -n $MYSQL_NAME \
        -l $RESOURCE_LOCATION --public-access 0.0.0.0 \
        -u $mysql_username -p $mysql_password

    printf "${GREEN}Success${NC}\n\n"
} || {
    printf "${RED}Failed. Run infrastructure/destroy.sh to tear down existing resources.${NC}\n\n"
    exit 1
}

# printf "${BLUE}Creating storage account for function app... ${NC}\n" # ---------
# {
#     printf "${BLUE}Checking name availability...${NC}\n"
#     AVAILABLE=$(az storage account check-name --name $STORAGE_NAME --query "nameAvailable")
#     AZ_STORAGE_QUERY=$(az storage account list --query "[?name=='$STORAGE_NAME'].name")

#     #check if name is available
#     if [[ $AVAILABLE =~ "true" ]]; then
#         printf "${GREEN}Name available"
#         az storage account create --name $STORAGE_NAME --location $RESOURCE_LOCATION \
#             --resource-group $RG_NAME --sku Standard_LRS
#         printf "${GREEN}Success${NC}\n\n"
#     # check if already exits
#     elif [[ "$AZ_STORAGE_QUERY" == *"$STORAGE_NAME"* ]]; then
#         printf "${YELLOW}%b${NC}" 'Storage account already exists. Ensure this is ' \
#             'okay. A storage account may exist since teardown scripts may not be ' \
#             'deleting storage account resources due to the global unique name ' \
#             "requirement. Or this may be a legitimate name conflict\n\n"
#     else
#         printf "${RED}Name not available${NC}\n"
#         false
#     fi
# } || {
#     printf "${RED}Failed. Run infrastructure/destroy.sh to tear down existing resources.${NC}\n\n"
#     exit 1
# }

# printf "${BLUE}Creating function app... ${NC}\n" #------------------------------
# {
#     result=$(
#         az functionapp create --resource-group $RG_NAME \
#             --consumption-plan-location $RESOURCE_LOCATION --runtime node --runtime-version 16 \
#             --functions-version 4 --name $FUNC_NAME \
#             --storage-account $STORAGE_NAME
#     )
#     if [[ "$result" == *"already exists"* ]]; then
#         printf "${RED}Name not available${NC}\n"
#         false
#     else
#         printf "${GREEN}Success${NC}\n\n"
#     fi
# } || {
#     printf "${RED}Failed. Run infrastructure/destroy.sh to tear down existing resources.${NC}\n\n"
#     exit 1
# }

printf "${BLUE}Adding environment variables to function app, and create env file... ${NC}\n" #-------
{
    DB_NAME="looper"
    MYSQL_ENDPOINT=$(az mysql flexible-server show --resource-group $RG_NAME --name $MYSQL_NAME --query "fullyQualifiedDomainName")
    echo "fully qualified domain name: $MYSQL_ENDPOINT"
    az functionapp config appsettings set --name $FUNC_NAME -g $RG_NAME \
        --settings "AZURE_MYSQL_DB_NAME=$DB_NAME" \
        "AZURE_MYSQL_DB_ENDPOINT=$MYSQL_ENDPOINT" \
        "AZURE_MYSQL_USERNAME=$mysql_username" \
        "AZURE_MYSQL_PASSWORD=$mysql_password"

} || {
    printf "${RED}Failed. Run infrastructure/destroy.sh to tear down existing resources.${NC}\n\n"
    exit 1
}

printf "${GREEN}Infrastructure creation complete. Push to git (branch main-azure-function-deployment) to deploy your project! ${NC}\n"
