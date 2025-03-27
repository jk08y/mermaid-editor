# Mermaid Editor Pro 

A modern, browser-based editor for creating and managing Mermaid diagrams. Create, edit, and export diagrams using Mermaid's intuitive text-based syntax. 

## Features

- **Live Preview**: See your diagrams update in real-time as you type
- **Multiple Diagram Types**: Support for flowcharts, sequence diagrams, class diagrams, ER diagrams, Gantt charts, and more
- **Auto-Save**: Never lose your work with automatic saving
- **Templates**: Jump-start your diagrams with pre-designed templates
- **Dark & Light Theme**: Switch between themes for comfortable editing in any environment
- **Export Options**: Export diagrams as SVG or PNG images
- **Local Storage**: Diagrams are saved in your browser's local storage
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- React.js for UI components
- TypeScript for type safety
- Monaco Editor for code editing
- Mermaid.js for diagram rendering
- TailwindCSS for styling
- Vite for build tooling

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/jk08y/mermaid-editor.git
cd mermaid-editor

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage 

1. Navigate to the editor page
2. Write your Mermaid syntax in the left panel
3. See the live preview on the right
4. Save your diagram by clicking the save button
5. Export your diagram as SVG or PNG

## Mermaid Syntax

This editor supports all standard Mermaid syntax. For a complete guide, visit the [Mermaid documentation](https://mermaid.js.org/intro/getting-started.html).

## License

MIT

## Acknowledgements

- [Mermaid.js](https://mermaid.js.org/)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [React.js](https://reactjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
