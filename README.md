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

* Build the scaffolding of the project

  ```bash
  mkdir gradle-multimodule
  cd gradle-mm
  gradle init
  mkdir node1 node2 node3
  cd node 1 && gradle init
  cd ..
  cd node 2 && gradle init
  cd ..
  cd node 3 && gradle init
  cd ..
  npx express-generator --no-view --force node1
  cd node1
  mkdir src ;  mv app.js src ; mv bin src ; mv public src ; mv routes src
  cd ..
  npx express-generator --no-view --force node2
  cd node2
  mkdir src ;  mv app.js src ; mv bin src ; mv public src ; mv routes src
  cd ..  
  npx express-generator --no-view --force node3
  cd node3
  mkdir src ;  mv app.js src ; mv bin src ; mv public src ; mv routes src
  cd ..  
  mkdir node1/src && 
  ```

* Add a PORT environment setting to each node express project's start configuration to that node1 runs on 4001, node 2 on 4002 and node 3 and 4003. For example...

  ```json
  {
    "name": "node1",
    "version": "0.0.0",
    "private": true,
    "scripts": {
      "start": "PORT=4001 node ./bin/www"
    },
    "dependencies": {
      "cookie-parser": "~1.4.4",
      "debug": "~2.6.9",
      "express": "~4.16.1",
      "morgan": "~1.9.1"
    }
  }
  ```

* Remove the ```.gitignore``` files from the node1, node2 and node3 folders. Git is handled at the root level.

* Remove the ```gradle.bat```, ```gradlew``` and the ```gradle``` folder from the node1, node2 and node 3 folders. Gradle runs from the root.

* Add the node modules to ```settings.gradle``` (IntelliJ should identify them as modules).
  ```gradle
  rootProject.name = 'gradle-multimodule'
  include 'node1'
  include 'node2'
  include 'node3'
  ```

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

  Add this to the subproject gradle.build files.
  
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
