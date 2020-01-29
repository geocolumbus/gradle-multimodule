#!/usr/bin/env bash

if [[ ! -d build/distribution/app ]]; then
  unzip -d build/distribution build/distribution/gradle-multimodule.zip
fi

cd build/distribution/app
npm start
