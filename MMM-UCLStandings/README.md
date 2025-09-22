# MMM-UCLStandings

A lightweight [MagicMirror²](https://magicmirror.builders/) module scaffold that demonstrates how to structure a front-end module and Node helper for displaying UEFA Champions League standings. The module ships with sample data so you can verify the end-to-end wiring before connecting it to a real data source.

## Installation

```bash
cd ~/MagicMirror/modules
git clone https://github.com/your-username/MMM-UCLStandings.git
cd MMM-UCLStandings
npm install
```

> The scaffold has no runtime dependencies, so `npm install` simply prepares the module folder structure.

## Configuration

Add the module to the `modules` array in your `config/config.js`:

```javascript
{
  module: "MMM-UCLStandings",
  position: "top_left",
  config: {
    updateInterval: 30 * 60 * 1000 // refresh every 30 minutes
  }
}
```

With the default configuration the module renders the bundled sample standings. Customize the configuration and module code as needed when you are ready to wire up a live API.

## How the scaffold works

- **Front-end (`MMM-UCLStandings.js`)** – Registers the module, schedules periodic updates, and renders a simple list of standings entries.
- **Node helper (`node_helper.js`)** – Mimics a data fetch by returning static sample data after a short delay. Replace `sendSampleData` with the logic required for your data provider.
- **Styling (`MMM-UCLStandings.css`)** – Applies minimal styling to the list output so you can focus on functionality first.

## Adapting the scaffold

1. Update the Node helper to fetch real data (for example, from an HTTP API or a local database) and emit `UCL_DATA` with the transformed standings.
2. Extend the client-side rendering logic to show additional statistics, groups, or localized headers.
3. Add translations by placing additional JSON files inside the `translations` directory.

## License

[MIT](LICENSE)
