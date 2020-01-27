# Gradle Simple Multimodule Project

A simple gradle based node multimodule project

## Usage

To stay compatible with AWS Lamda, use Gradle 5.6.4 (not 6 or greater).

```bash
git clone
./gradlew build
```

Run it

TODO

## How This Was Constructed

```bash
mkdir gradle-mml
cd gradle-mml
gradle init
cd ..
npx express-generator --no-view --force node1
cd ..
npx express-generator --no-view --force node2
cd ..

npx express-generator --no-view --force node1
npx express-generator --no-view --force node2
npx express-generator --no-view --force node3
```

## Reference

* [Creating New Gradle Builds](https://guides.gradle.org/creating-new-gradle-builds/)
* [Authoring Multi-Project Builds](https://docs.gradle.org/5.6.2/userguide/multi_project_builds.html#header)
* [Gradle for NPM Users](https://seesparkbox.com/foundry/gradle_for_npm_users)
* [Integrating a Node build into a Java Project](https://dzone.com/articles/integrating-java-and-npm-builds-using-gradle)
* [Express Application Generator](https://expressjs.com/en/starter/generator.html)
