# MMM-ideas

A [MagicMirror²](https://magicmirror.builders/) module that surfaces short prompts and ideas to spark creativity, retrospectives, or planning discussions. Configure your own idea list and the module will rotate through them on your mirror.

## Installation

1. Navigate to the `modules` directory of your MagicMirror² installation:
   ```bash
   cd ~/MagicMirror/modules
   ```
2. Clone this repository:
   ```bash
   git clone https://github.com/your-username/MMM-ideas.git
   ```
3. Install dependencies (none required right now) and restart your MagicMirror² instance.

## Configuration

Add the module definition to the `modules` array in your `config/config.js`:

```javascript
{
  module: "MMM-ideas",
  position: "top_left",
  header: "Daily Idea",
  config: {
    updateInterval: 2 * 60 * 1000,
    randomize: true,
    showSource: true,
    ideas: [
      { text: "Call someone you have not spoken to in a while", source: "Connections" },
      { text: "Sketch an outline for the next team workshop", source: "Planning" },
      { text: "List three wins from this week", source: "Reflection" }
    ]
  }
}
```

### Options

| Option | Default | Description |
| --- | --- | --- |
| `updateInterval` | `5 * 60 * 1000` | Time (in milliseconds) between idea changes. Values below 10 seconds are ignored. |
| `animationSpeed` | `1000` | Duration of DOM update animations in milliseconds. |
| `randomize` | `false` | If `true`, the next idea is chosen at random instead of sequential order. |
| `showSource` | `true` | Display the optional `source` label when it is provided. |
| `ideas` | `[]` | Array of strings or `{ text, source }` objects to display. |

### Translations

Currently only English (`en`) is included. Contributions for additional translations are welcome.

## Development

This module does not yet require a `node_helper.js`. If you plan to fetch data from external APIs or perform server-side work, create a helper and update the workflow accordingly.

## License

Released under the MIT License. See `LICENSE` for more details.
