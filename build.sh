#!/bin/bash

echo "Installing Node Packages"
npm install
echo "----------------------------------------------------------------"
echo "----------------Building for Cookie Syncup----------------------"
echo "----------------------------------------------------------------"
gulp build-cookie-sync