#!/bin/bash

KEY=$1

curl -u "$JIRA_USER:$JIRA_PASSWORD" -H "Content-Type: application/json" \
"https://$JIRA_HOST/rest/api/2/search?jql=key=$KEY"
