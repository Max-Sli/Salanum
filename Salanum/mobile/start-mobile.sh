#!/bin/bash

echo "Starting Solana Messenger Mobile Development..."
echo

echo "Installing dependencies..."
npm install

echo
echo "Installing iOS dependencies..."
cd ios
pod install
cd ..

echo
echo "Starting Metro bundler..."
echo "Android will run on emulator/device"
echo "iOS will run on simulator/device"
echo

npm start
