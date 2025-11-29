# Affynix Website

Local build of the Affynix website - a Vite+React application.

## Running the app

```bash
npm install
npm run dev
```

## Building the app

```bash
npm run build
```

## Docker

To build and run with Docker:

```bash
docker-compose up --build -d
```

The website will be available at `http://localhost:4173`

## Note

This is a local build with mock implementations for API calls. All base44 dependencies have been removed and replaced with local mock implementations that log to the console.
