#!/bin/bash
# Sabay Docker entrypoint.sh

check_env() {
  local var="$1"

  if [[ ! "${!var:-}" ]] ; then
    echo >&2 "ERROR: $var is not set"
    exit 1
  else
    if [[ ${NODE_ENV} != "production" ]]; then
      echo "INIT $var : ${!var}"
    fi
  fi
}

envs=(
NODE_ENV
APP_PORT

DB_CONNECTION_URI
DB_PASSWORD
DB_USERNAME

LOG_LEVEL
ENABLE_INTROSPECTION
)

case ${1} in
  app:start)
    source /bin/secrets2env.sh
    # check if all envs are set
    for e in "${envs[@]}"; do
      check_env "$e"
    done

    if [[ ${NODE_ENV} == "development" ]]; then
      # ready to start server with nodemon
      echo "INIT: starting web service for development(nodemon)"
      exec yarn dev
    else
      # ready to start server
      echo "INIT: starting web service production"
      exec node ./dist/app.js
    fi
  ;;

  worker:start)
    source /bin/secrets2env.sh
    if [[ ${NODE_ENV} == "development" ]]; then
      # ready to start server with nodemon
      echo "INIT: starting queue worker"
      exec npm run worker:dev
    else
      # ready to start server with pm2
      echo "INIT: starting queue worker"
      exec node ./dist/consumers/index.js
    fi
  ;;

  cron:start)
    source /bin/secrets2env.sh
    if [[ ${NODE_ENV} == "development" ]]; then
      # ready to start server with nodemon
      echo "INIT: starting queue cron"
      exec npm run cron:dev
    else
      # ready to start server with pm2
      echo "INIT: starting queue cron"
      exec node ./dist/cronjobs/index.js
    fi
  ;;

  seed:db)
    source /bin/secrets2env.sh
    if [[ ${NODE_ENV} == "development" ]]; then
      # ready to seed db with ts-node
      echo "SEED: seeding the db"
      exec npm run seed
    else
      # ready to seed db with node
      echo "SEED: seeding the db"
      exec node ./dist/script/seed/seed.js
    fi
  ;;

  app:help)
    echo "Available options:"
    echo " app:start  - Starts the server (default)"
    echo " [command]  - Execute the specified command, eg. bash."
  ;;

  *)
    exec "$@"
  ;;

esac
