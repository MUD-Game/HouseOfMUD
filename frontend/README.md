# HouseOfMUD-Frontend

## Starten

Zuerst muss eine .env im frontend-root angelegt werden. Diese entählt alle key-value paare. bsp.:

```plain
REACT_HOM_ENVIROMENT=dev
REACT_HOM_SECRET=###
...
```

alle verwendeten ENVs werden oben aufgezählt.

### dev

`npm start`

### production-build

Dem Projekt liegt eine Dockerfile bei, diese führt im grundlegendem folgende Schritte aus:

```bash
npm run build
serve -s build
```
