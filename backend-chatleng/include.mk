######################################
#### - do not edit this section - ####

# save system vars
VARS_OLD := $(.VARIABLES)

# gitlab CI vars
CI_REGISTRY          ?= docker-registry
CI_PROJECT_NAMESPACE ?= chat-leng/app
CI_PROJECT_NAME      ?= app.chat-leng
CI_COMMIT_REF_NAME   ?= master
CI_ENVIRONMENT_NAME  ?= master

# image and tag
TAG=$(CI_COMMIT_REF_NAME)
IMG=$(CI_REGISTRY)/$(CI_PROJECT_NAMESPACE)/$(CI_PROJECT_NAME)

COMPOSE_PROJECT_NAME ?=$(CI_PROJECT_NAME)

NODE_ENV=
APP_PORT=

DB_CONNECTION_URI=
DB_PASSWORD=
DB_USERNAME=


LOG_LEVEL=
ENABLE_INTROSPECTION=