# Gradle Simple Multimodule Project

A simple gradle based node multimodule project

## Usage

### Requirements
* Node 12 with npx 10
* Gradle 5.6.4 (as of 1/2020, don't use 6+ because of AWS Lambda issues)

### Install

```bash
git clone https://github.com/geocolumbus/gradle-multimodule.git
cd gradle-multimodule
```

#### Build

```bash
./gradlew build
```

#### Run

```bash
./gradlew run
```

## How This Was Constructed

### Lay out the project

* Build the scaffolding of the project

  ```bash
  mkdir gradle-multimodule
  cd gradle-mm
  gradle init
  mkdir app weather-service
  cd app ; gradle init
  cd ..
  cd weather-service ; gradle init
  # Choose basic, groovy and default name
  cd ..
  npx express-generator --view=pug --force app
  cd app
  mkdir src ;  mv app.js src ; mv bin src ; mv public src ; mv routes src
  cd ..
  cd weather-service
  npm init --force
  mkdir src ; touch src/index.js
  cd ..
  ```

* Remove unneeded files/folders from the app and weather-service folders. Gradle runs from the root.

  ```cd app ; rm -rf .gitignore gradlew.bat gradlew gradle ; cd ..```
  
  ```cd weather-service ; rm -rf .gitignore gradlew.bat gradlew gradle ; cd ..```
  
* Add dummy package-lock.json files to each node project. This is due to a bug
  in gradle-node-plugin that prevents local dependencies being added.
  
  ```touch app/package-lock.json ; touch weather-service/package-lock.json```

* Add the node modules to ```settings.gradle``` (IntelliJ should identify them as modules).
  ```gradle
  rootProject.name = 'gradle-multimodule'
  include 'app'
  include 'weather-service'
  ```

### Set up the app

* Add a PORT environment setting to the main app project's start configuration so it runs on :4001.

  Edit ```app/package.json``` so it looks like this.

  ```json
  {
    "name": "app",
    "version": "0.0.1",
    "private": true,
    "scripts": {
      "start": "PORT=4001 node ./src/bin/www"
    },
    "dependencies": {
      "cookie-parser": "~1.4.4",
      "debug": "~2.6.9",
      "express": "~4.16.1",
      "http-errors": "~1.6.3",
      "morgan": "~1.9.1",
      "pug": "2.0.0-beta11"
    }
  }
  ```

### Set up the weather-service

* Add this to the ```weather-service/src/index.js```

  ```javascript
  const axios = require("axios")
  
  const _getWeather = async function (weatherStation) {
      weatherStation = weatherStation ? weatherStation : "KOSU"
      let result = ""
      const weatherResponse = await axios.get(`https://w1.weather.gov/xml/current_obs/${weatherStation}.xml`)
      try {
          let location = (weatherResponse.data.match(/\<location\>(.*)\<\/location\>/))[1]
          let temperature = (weatherResponse.data.match(/\<temperature_string\>(.*)\<\/temperature_string\>/))[1]
          result += weatherStation + " - " + location + " - " + temperature
      } catch (e) {
          result += e
      }
      return result
  }

  exports.getWeather = _getWeather
  ```

### Configure the gradle build

* Add the gradle-node-plugin to the ```settings.gradle``` file of each node project.

  See: https://github.com/srs/gradle-node-plugin/blob/master/docs/installing.md

  ```gradle
  plugins {
      id "com.moowork.node" version "1.3.1"
  }

  node {
      version = '12.14.1'
      npmVersion = '6.13.6'
      distBaseUrl = 'https://nodejs.org/dist'
      download = true
      workDir = file("${project.buildDir}/nodejs")
      npmWorkDir = file("${project.buildDir}/npm")
      nodeModulesDir = file("${project.projectDir}")
  }

  // A bug with the package lock system causes npm not to download
  // local dependencies.
  npmInstall.args = ['--no-package-lock']

  build.dependsOn npmInstall
  ```
  
* Install the unit of deployment

  Add this to the main project gradle.build file.
  
  ```gradle
  task buildUOD(type: Zip, dependsOn: subprojects.build) {
      println "UOD: \"${rootProject.name}.zip\" contains project(s): " + subprojects.name
      subprojects {
          from("${it.buildDir}/distribution/") {
              include '**/**'
          }
      }
      archiveFileName = "${rootProject.name}.zip"
      destinationDirectory = file('./build/distribution')
  }

  build.dependsOn('buildUOD')
  ```

  Add this to the subproject gradle.build files so that a subproject distribution is built.
  
  ```gradle
  task buildDistribution(type: Copy) {
      from(project.projectDir) {
          exclude "build", "build.gradle", ".gradle", "settings.gradle"
      }
      into "${project.buildDir}/distribution/${project.name}"
  }
  
  build.dependsOn(buildDistribution)
  ```

## Reference

* [Creating New Gradle Builds](https://guides.gradle.org/creating-new-gradle-builds/)
* [Authoring Multi-Project Builds](https://docs.gradle.org/5.6.2/userguide/multi_project_builds.html#header)
* [Gradle for NPM Users](https://seesparkbox.com/foundry/gradle_for_npm_users)
* [Integrating a Node build into a Java Project](https://dzone.com/articles/integrating-java-and-npm-builds-using-gradle)
* [Express Application Generator](https://expressjs.com/en/starter/generator.html)
