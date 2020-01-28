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
npx express-generator --no-view --force node2
npx express-generator --no-view --force node3
```

I then added a PORT environment setting to each node express project's start configuration to that node1 ran on 4001, node 2 on 4002 and node 3 and 4003. For example...

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

I removed the ```.gitignore``` files from the node1, node2 and node3 folders. Git is handled at the root level.

I removed the ```gradle.bat```, ```gradlew``` and the ```gradle``` folder from the node1, node2 and node 3 folders. We will run gradle from the root.

I added the modules to ```settings.gradle``` and IntelliJ picked them up.
```gradle
rootProject.name = 'gradle-multimodule'
include 'node1'
include 'node2'
include 'node3'
```

I then added and configured the gradle-node-plugin to the ```settings.gradle``` file of each node project.

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
```

## Reference

* [Creating New Gradle Builds](https://guides.gradle.org/creating-new-gradle-builds/)
* [Authoring Multi-Project Builds](https://docs.gradle.org/5.6.2/userguide/multi_project_builds.html#header)
* [Gradle for NPM Users](https://seesparkbox.com/foundry/gradle_for_npm_users)
* [Integrating a Node build into a Java Project](https://dzone.com/articles/integrating-java-and-npm-builds-using-gradle)
* [Express Application Generator](https://expressjs.com/en/starter/generator.html)
