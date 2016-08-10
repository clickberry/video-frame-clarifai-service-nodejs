#!/bin/bash
set -e

if [ -z "$NSQLOOKUPD_ADDRESSES" ]; then
    echo "NSQLOOKUPD_ADDRESSES environment variable required"
    exit 1
fi

if [ -z "$MONGODB_CONNECTION" ]; then
    echo "MONGODB_CONNECTION environment variable required"
    exit 1
fi

if [ -z "$CLARIFAI_CLIENT_ID" ]; then
    echo "CLARIFAI_CLIENT_ID environment variable required"
    exit 1
fi

if [ -z "$CLARIFAI_CLIENT_SECRET" ]; then
    echo "CLARIFAI_CLIENT_SECRET environment variable required"
    exit 1
fi

echo "NSQLOOKUPD: ${NSQLOOKUPD_ADDRESSES}"
echo "MONGODB: ${MONGODB_CONNECTION}"


# execute nodejs application
exec npm start