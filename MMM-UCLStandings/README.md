# MMM-UCLStandings

A [MagicMirror²](https://magicmirror.builders/) module that fetches and displays the latest UEFA Champions League league standings. The module uses the open football dataset maintained on GitHub and derives the table from recorded match results.

> ⚠️ The GitHub dataset is updated shortly after matches are completed. Standings may lag behind live results by a few hours.

## Installation

```bash
cd ~/MagicMirror/modules
git clone https://github.com/your-username/MMM-UCLStandings.git
cd MMM-UCLStandings
npm install
```

## Configuration

Add the module to the `modules` array in your `config/config.js`:

```javascript
{
  module: "MMM-UCLStandings",
  position: "top_left",
  config: {
    maxTeams: 12,
    updateInterval: 3 * 60 * 60 * 1000 // every 3 hours
  }
}
```

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `updateInterval` | `number` | `21600000` (6 hours) | How often the standings should be refreshed. |
| `animationSpeed` | `number` | `1000` | Animation speed (ms) used when updating the DOM. |
| `maxTeams` | `number` | `12` | Limit the number of teams displayed. Set to `0` or omit to show all 36 teams. |
| `showCountry` | `boolean` | `false` | Keep the country abbreviation in team names (e.g. `FC Barcelona (ESP)`). |
| `dataUrl` | `string` | Dataset URL | Override the data source. Useful if you maintain your own mirror of the dataset. |
| `fetchTimeout` | `number` | `10` | Timeout (in seconds) for the HTTP request. |
| `proxy` | `string` | `process.env.HTTPS_PROXY` | Optional proxy URL. Defaults to the `HTTP(S)_PROXY` environment variables when not provided. |

## Development

- `npm install` – Install dependencies.
- The module is written in CommonJS to match the MagicMirror² runtime.
- Data is sourced from [openfootball/football.json](https://github.com/openfootball/football.json).

## License

[MIT](LICENSE)
