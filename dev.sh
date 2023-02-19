#!/bin/bash

set -e
set -a
source .env
set +a

RANDOMLY_GENERATED_ID=123451234512345
# BUCKET_NAME
# OBJECT_NAME
# METAGENERATION
# TIME_CREATED
# UPDATED
# GENERATION

curl "http://localhost:8080" \
  -X POST \
  -H "Content-Type: application/json" \
  -H "Ce-Type: 'google.cloud.storage.object.v1.finalized'" \
  -H "Ce-Source: //storage.googleapis.com/projects/_/buckets/$BUCKET_NAME" \
  -H "Ce-Id: $RANDOMLY_GENERATED_ID" \
  -d '{"bucket":"'$BUCKET_NAME'","name":"'$OBJECT_NAME'"}'


# -d '{"bucket":"'$BUCKET_NAME'","name":"[OBJECT_NAME]","metageneration":"[METAGENERATION]","timeCreated":"[TIME_CREATED]","updated":"[UPDATED]","generation":"[GENERATION]"}'
