#!/usr/bin/env bash
set -e

ROOT=..
WEBSITE_DIR=..

# Clean the data dir
echo ">"
echo "> Cleaning data dir"
echo ">"
rm -rf ${WEBSITE_DIR}/public/data/*
echo "Done"
echo

# Copy the synthetics data
echo ">"
echo "> Copying synthetics data"
echo ">"
mkdir ${WEBSITE_DIR}/public/data || true
cp -R ${ROOT}/library/* ${WEBSITE_DIR}/public/data
echo "Done"
echo

# Generate summary file
echo ">"
echo "> Generating data for use in website"
echo ">"
node generate.js "${ROOT}/library/"
echo "> Copying data file to website"
cp -v data.json ${WEBSITE_DIR}/public/data.json
