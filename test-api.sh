#!/bin/sh

#############################################
## Global variables
#############################################
if [ -x /usr/bin/tput ]; then
  red=`tput setaf 1` # error
  green=`tput setaf 2` # nice
  yellow=`tput setaf 3` # warning
  blue=`tput setaf 4` # info
  purple=`tput setaf 5` # command
  teal=`tput setaf 6` # detail
  white=`tput setaf 7` #
  reset=`tput sgr0`
fi

API_URL=http://localhost:3000
CLIENT_ID=local.frontend.https
USERNAME=newlight77+user1@gmail.com
PASSWORD=user
TOKEN_URL=http://localhost:1080/auth/realms/local.app/protocol/openid-connect/token
TOKEN=

#############################################
## Functions
#############################################
logInfo() {
  echo ${reset} $@ ${reset}  2>&1 | tee -a ${LOG_FILE}
}

logError() {
  echo ${red} $@ ${reset}  2>&1 | tee -a ${LOG_FILE}
}

logWarning() {
  echo ${yellow} $@ ${reset}  2>&1 | tee -a ${LOG_FILE}
}

logCmd() {
  echo ${green} $@ ${reset}  2>&1 | tee -a ${LOG_FILE}
}

usage() {
  echo "Usage: $0 [options]"
  echo ""
  echo "${blue}Options:    ${reset}"
  echo "${blue}          -c, --classpath =[classpath]                           classpath${reset}"
  echo "${blue}          -k, --keycloak-configFile =[keycloak.json file path]   keycloak.json file path${reset}"
  echo "${blue}          -c, --token-url =[keycloak-token-url]                  url${reset}"
  echo "${blue}          -h,  --help                                            help ${reset}"
  echo "${blue}                                                                 ${reset}"
  echo "${blue}By default, this will run with --spring.profiles.active=test ${reset}"
  exit 1
}

helloApi() {
  curl --location --request GET "${API_URL}/hello"
}

signup() {
  curl --insecure --location --request POST "${API_URL}/signup" \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "firstname": "kong", 
        "lastname": "to", 
        "username": "'${USERNAME}'",
        "password": "'${PASSWORD}'",
        "phoneNumber": "0659401130"
    }'
    echo ""
}

getToken() {
  curl --location --request POST "${TOKEN_URL}" \
    --header 'Content-Type: application/x-www-form-urlencoded' \
    --data-urlencode "client_id=${CLIENT_ID}" \
    --data-urlencode "username=${USERNAME}" \
    --data-urlencode "password=${PASSWORD}" \
    --data-urlencode "scope=openid" \
    --data-urlencode "grant_type=password" | jq -r .access_token
}

helloUser() {
  token=$1
  curl --location --request GET "${API_URL}/hello" \
    -H "Authorization: Bearer ${token}"
}

secureApi() {
  token=$1
  curl --location --request GET "${API_URL}/jobs" \
    -H "Authorization: Bearer ${token}"
}


#############################################
## Check arguments
#############################################
for i in "$@"
  do
    case $i in
      -a=*|--api-url=*)                API_URL="${i#*=}"   ;;
      -c=*|--client-id=*)              CLIENT_ID="${i#*=}"   ;;
      -u=*|--username=*)               USERNAME="${i#*=}"   ;;
      -p=*|--password=*)               PASSWORD="${i#*=}"   ;;
      -t=*|--token-url=*)              TOKEN_URL="${i#*=}"   ;;
      -h|--help)                       usage               ;;
      *)                               usage               ;;
    esac
done

#############################################
## Run
#############################################

echo "call helloApi..."
helloApi
echo ""

#echo "signing up"
#signup

echo "call getToken..."
TOKEN=$(getToken)
echo $TOKEN
echo ""
echo ""

echo "call helloUser..."
result=$(helloUser ${TOKEN})
echo $result
echo ""
echo ""

echo "call secure Api on jobs resource"
result=$(secureApi ${TOKEN})
echo $result

if [ "$result" != "" ]; then 
  echo $result
else
  echo "can't get the signup"
  echo "maybe the issue is not valid. "
  echo "notice : inside the container, the issuer is http://keycloak:8080/auth"
  echo "         and the is script is accessing from outside with issuer http://localhost:1080/auth"
fi
