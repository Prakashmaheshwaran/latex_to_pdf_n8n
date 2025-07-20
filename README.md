# LaTeX to PDF - n8n Community Node

A simple n8n community node that converts LaTeX documents to PDF files.

## Prerequisites

**LaTeX must be installed on your system.**

### Quick Installation

**macOS:**
```bash
brew install --cask mactex-no-gui
```

**Linux:**
```bash
sudo apt-get install texlive-full
```

**Windows:**
Download and install [MiKTeX](https://miktex.org/download)

## Installation

In your n8n instance:

1. Go to **Settings** → **Community Nodes**
2. Install: `n8n-nodes-pdf-latex`
3. Restart n8n

## Usage

1. Add **LaTeX to PDF** node to your workflow
2. Choose input type:
   - **Text**: Paste LaTeX content directly
   - **Binary**: Use LaTeX file from previous node
3. Configure output property name (default: "data")
4. Execute workflow

### Example LaTeX

```latex
\documentclass{article}
\usepackage[utf8]{inputenc}
\title{My Document}
\author{Your Name}
\date{\today}

\begin{document}
\maketitle

\section{Introduction}
Hello World! This is my LaTeX document.

\end{document}
```

## Configuration Options

- **LaTeX Engine**: pdflatex (default), xelatex, lualatex
- **Compilation Passes**: 1 (default), increase for bibliographies/cross-references
- **Inputs Directory**: Path to folder with images/includes (optional)

## Troubleshooting

**LaTeX not found error:**
- Make sure LaTeX is installed and in your system PATH

**Compilation errors:**
- Check LaTeX syntax
- Ensure all required packages are available
- Use Inputs Directory for external files

**Missing packages:**
- Install with: `tlmgr install package-name`

## License

MIT License

---

Made for the n8n community 