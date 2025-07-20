# n8n-nodes-pdf-latex

![npm version](https://img.shields.io/npm/v/n8n-nodes-pdf-latex)
![License](https://img.shields.io/npm/l/n8n-nodes-pdf-latex)

A community node for [n8n](https://n8n.io/) that converts LaTeX documents to PDF format using the powerful [node-latex](https://www.npmjs.com/package/node-latex) library.

## Features

- ✅ Convert LaTeX text to PDF
- ✅ Convert LaTeX files to PDF  
- ✅ Support for multiple LaTeX engines (pdflatex, xelatex, lualatex)
- ✅ Multiple compilation passes support
- ✅ Custom fonts and input directories
- ✅ Comprehensive error handling
- ✅ Binary data handling for inputs and outputs

## Prerequisites

**⚠️ Important: LaTeX must be installed on your system before using this node.**

### LaTeX Installation

#### macOS
```bash
# Download MacTeX from: https://www.tug.org/mactex/
# Or install via Homebrew:
brew install --cask mactex-no-gui
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt-get update
sudo apt-get install texlive-full
```

#### Linux (CentOS/RHEL)
```bash
sudo yum install texlive-scheme-full
```

#### Windows
- Download MiKTeX from: https://miktex.org/download
- Or download TeX Live from: https://www.tug.org/texlive/

## Installation

### Option 1: Install via n8n Community Nodes (Recommended)

1. Open your n8n instance
2. Go to **Settings** → **Community Nodes**
3. Install the package: `n8n-nodes-pdf-latex`

### Option 2: Manual Installation

```bash
# In your n8n installation directory
npm install n8n-nodes-pdf-latex
```

### Option 3: Development Installation

```bash
# Clone the repository
git clone https://github.com/kash/n8n-nodes-pdf-latex.git
cd n8n-nodes-pdf-latex

# Install dependencies
npm install

# Build the project
npm run build

# Link for local development
npm link
```

## Usage

### Basic LaTeX to PDF Conversion

1. Add the **LaTeX to PDF** node to your workflow
2. Configure the input:
   - **Input Type**: Choose "Text" for direct LaTeX input or "Binary Property" for LaTeX files
   - **LaTeX Content**: Enter your LaTeX document (if using text input)
   - **Output Binary Property Name**: Name for the generated PDF (default: "data")

### Example LaTeX Content

```latex
\documentclass{article}
\usepackage[utf8]{inputenc}
\title{My Document}
\author{Your Name}
\date{\today}

\begin{document}
\maketitle

\section{Introduction}
Hello World! This is my first LaTeX document converted to PDF using n8n.

\section{Features}
\begin{itemize}
    \item Easy LaTeX to PDF conversion
    \item Multiple engine support
    \item Custom fonts and directories
\end{itemize}

\end{document}
```

### Advanced Configuration

#### LaTeX Engine Selection
- **pdflatex** (default): Standard LaTeX engine
- **xelatex**: Modern engine with Unicode and font support  
- **lualatex**: LuaTeX-based engine with advanced features

#### Multiple Passes
Some documents (with cross-references, bibliographies, etc.) require multiple compilation passes:
```
Number of Passes: 2
```

#### Custom Directories
For documents with external assets:
- **Inputs Directory**: Path to directory containing images, includes, etc.
- **Fonts Directory**: Path to custom fonts (useful with xelatex/lualatex)

## Workflow Examples

### Example 1: Simple Text to PDF
```
Manual Trigger → LaTeX to PDF → Save Binary Data
```

### Example 2: Process LaTeX Files
```
Watch Folder → LaTeX to PDF → Email PDF
```

### Example 3: Dynamic LaTeX Generation
```
HTTP Request → Set LaTeX Content → LaTeX to PDF → Return PDF
```

## Node Configuration

### Input Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| Input Type | Options | text | Source of LaTeX content |
| LaTeX Content | String | Sample doc | LaTeX document content |
| Input Binary Property | String | data | Binary property containing LaTeX file |
| Output Binary Property Name | String | data | Name for generated PDF binary |
| LaTeX Command | Options | pdflatex | LaTeX engine to use |
| Number of Passes | Number | 1 | Compilation passes |
| Inputs Directory | String | - | Path to additional assets |
| Fonts Directory | String | - | Path to custom fonts |

### Output Data

The node outputs:
- **JSON Data**: Success status, filename, file size, MIME type
- **Binary Data**: Generated PDF file

```json
{
  "success": true,
  "filename": "output-1642534567890.pdf",
  "mimeType": "application/pdf",
  "fileSize": 85432
}
```

## Error Handling

Common issues and solutions:

### LaTeX Not Found
```
Error: LaTeX compilation failed: spawn pdflatex ENOENT
```
**Solution**: Install LaTeX on your system (see Prerequisites section)

### Compilation Errors
```
Error: LaTeX compilation failed: ! Undefined control sequence.
```
**Solution**: Check your LaTeX syntax and ensure all packages are available

### Missing Files
```
Error: LaTeX compilation failed: ! LaTeX Error: File `image.png' not found.
```
**Solution**: Use the "Inputs Directory" option to specify the path to your assets

## Development

### Building from Source

```bash
# Clone and install
git clone https://github.com/kash/n8n-nodes-pdf-latex.git
cd n8n-nodes-pdf-latex
npm install

# Development build (watch mode)
npm run dev

# Production build
npm run build

# Linting
npm run lint
npm run lintfix

# Format code
npm run format
```

### Project Structure

```
n8n-nodes-pdf-latex/
├── nodes/
│   └── LatexToPdf/
│       ├── LatexToPdf.node.ts    # Main node implementation
│       └── latexToPdf.svg        # Node icon
├── scripts/
│   └── check-latex.js            # LaTeX installation checker
├── dist/                         # Compiled output
├── package.json                  # Package configuration
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # This file
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SKIP_LATEX_CHECK` | Skip LaTeX installation check during npm install | `false` |

Example for Docker builds:
```dockerfile
ENV SKIP_LATEX_CHECK=true
RUN npm install n8n-nodes-pdf-latex
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b my-new-feature`
3. Make your changes and add tests
4. Run linting: `npm run lint`
5. Commit your changes: `git commit -am 'Add some feature'`
6. Push to the branch: `git push origin my-new-feature`
7. Submit a pull request

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 🐛 **Issues**: [GitHub Issues](https://github.com/kash/n8n-nodes-pdf-latex/issues)
- 📖 **Documentation**: [n8n Community Nodes](https://docs.n8n.io/integrations/community-nodes/)
- 💬 **Community**: [n8n Community Forum](https://community.n8n.io/)

## Changelog

### v1.0.0
- Initial release
- Basic LaTeX to PDF conversion
- Support for text and binary inputs
- Multiple LaTeX engines support
- Custom directories for fonts and inputs
- Comprehensive error handling

---

Made with ❤️ for the n8n community 