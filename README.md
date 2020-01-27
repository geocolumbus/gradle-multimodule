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
