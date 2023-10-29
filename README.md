# Custom UI5 Control using d3

End-to-end sample for a custom UI5 control based on d3-cloud from development to deployment on SAP BTP.

It contains these folders and files:

File or Folder | Purpose
---------|----------
`app/` | content for UI frontend
`db/` | domain models and data
`srv/` | service model
`package.json` | project metadata and configuration
`README.md` | this getting started guide

## How to use
Frist install the dependencies:
```bash
npm i && npm i --prefix app/aibuzzwords
```

### Run locally
```bash
cds watch
```

### Deploy
Make sure you are logged in to you desired BTP Subaccount using `cf login`. Then run
```bash
npm run build && npm run deploy
```
