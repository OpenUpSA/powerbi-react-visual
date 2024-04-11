# PowerBI With Custom React/JS Visual Starter

## Setup

1. Install `powerbi-visuals-tolls`

```
npm i -g powerbi-visuals-tools@latest
```

2. Enable Developer Mode in PowerBI
 
3. Add a Developer Visual from the PowerBI Visualizations

4. Start the development server

```
pbiviz start
```

## Package Final Viz

To package your final viz for use in production, use:

```
pbiviz package
```

The resulting files in the `dist` folder are importable in PBI.


## Read more

See https://learn.microsoft.com/en-us/power-bi/developer/visuals/create-react-visual and https://learn.microsoft.com/en-us/power-bi/developer/visuals/environment-setup