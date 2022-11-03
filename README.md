# Bixi-around

A simple api to know the closest [Bixi](https://bixi.com) bike stations from your location.
It allows you to choose the best station according to your needs (classic or electric bike, parking slot).

I only tested it for the city of Montreal 🇨🇦. But, the data streams are based on the [GBFS standard](https://github.com/MobilityData/gbfs), so it's theoretically possible that it also works in the following cities 👉 https://github.com/MobilityData/gbfs/blob/master/systems.csv

## Usage/Examples

_TODO link to the Apple Shortcuts to integrate it with Siri._

## Demo

Bikes around Montréal city hall 👉 https://bixi-around.fly.dev/api/bixi-around?city=montreal&lat=45.501690&lon=-73.567253&nbResult=5

## API Reference

#### Get all items

```http
  GET /api/bixi-around?city=montreal&lat=45.501690&lon=-73.567253&nbResult=5
```

| Query Parameter | Type     | Description                             |
| :-------------- | :------- | :-------------------------------------- |
| `city`          | `string` | **Required**. Default "montreal"        |
| `lat`           | `number` | **Required**. Longitude GPS coordinates |
| `long`          | `number` | **Required**. Latitude GPS coordinates  |
| `nbResult`      | `number` | **Required**. Number of result expected |

## Run Locally

Clone the project

```bash
  git clone https://github.com/corentinleberre/bixi-around
```

Go to the project directory

```bash
  cd bixi-around
```

Install dependencies

```bash
  npm install
```

Build the server

```bash
  npm run build
```

Start the server

```bash
  npm run start
```

## Contributing

Contributions are always welcome!

See `contributing.md` for ways to get started.

Please adhere to this project's `code of conduct`.
