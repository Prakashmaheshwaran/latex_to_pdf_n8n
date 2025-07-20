# LaTeX to PDF - n8n Community Node

![npm version](https://img.shields.io/npm/v/n8n-nodes-pdf-latex)
![License](https://img.shields.io/npm/l/n8n-nodes-pdf-latex)

A powerful n8n community node that converts LaTeX documents to PDF files with support for multiple engines, custom packages, and advanced features.

## Features

- ✅ Convert LaTeX text to PDF
- ✅ Convert LaTeX files to PDF  
- ✅ Multiple LaTeX engines (pdflatex, xelatex, lualatex)
- ✅ Multiple compilation passes for complex documents
- ✅ Custom fonts and input directories support
- ✅ Comprehensive error handling with helpful suggestions
- ✅ Support for bibliographies, cross-references, and complex formatting
- ✅ Binary data handling for inputs and outputs

## Prerequisites

**⚠️ LaTeX must be installed on your system before using this node.**

### Installation by Platform

**macOS:**
```bash
# Option 1: MacTeX (recommended - full installation)
brew install --cask mactex-no-gui

# Option 2: BasicTeX (minimal installation)
brew install --cask basictex
sudo tlmgr update --self
sudo tlmgr install collection-fontsrecommended
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install texlive-full
```

**Linux (CentOS/RHEL):**
```bash
sudo yum install texlive-scheme-full
```

**Windows:**
- Download and install [MiKTeX](https://miktex.org/download) (recommended)
- Or download [TeX Live](https://www.tug.org/texlive/)

### Verify Installation
```bash
pdflatex --version
tlmgr --version  # Package manager
```

## Installation

### Option 1: Community Nodes (Recommended)

1. Open your n8n instance
2. Go to **Settings** → **Community Nodes**
3. Install package: `n8n-nodes-pdf-latex`
4. Restart n8n

### Option 2: Manual Installation
```bash
cd ~/.n8n/nodes
npm install n8n-nodes-pdf-latex
```

## Usage

### Basic Usage

1. Add **LaTeX to PDF** node to your workflow
2. Configure input:
   - **Input Type**: "Text" for direct LaTeX or "Binary Property" for files
   - **LaTeX Content**: Your LaTeX document content
   - **Output Property Name**: Name for generated PDF (default: "data")
3. Execute workflow

### Input Types

#### Text Input (Direct LaTeX)
Paste your LaTeX content directly into the node:

```latex
\documentclass{article}
\usepackage[utf8]{inputenc}
\usepackage{geometry}
\usepackage{graphicx}

\title{My Document}
\author{Your Name}
\date{\today}

\begin{document}
\maketitle

\section{Introduction}
Hello World! This is my LaTeX document with \textbf{bold text} and \textit{italic text}.

\subsection{Features}
\begin{itemize}
    \item Easy LaTeX to PDF conversion
    \item Multiple engine support
    \item Custom fonts and directories
\end{itemize}

\end{document}
```

#### Binary Input (LaTeX Files)
Use LaTeX files from previous nodes (File Trigger, HTTP Request, etc.)

### Advanced Examples

#### Document with Images
```latex
\documentclass{article}
\usepackage{graphicx}

\begin{document}
\title{Document with Images}
\maketitle

\section{Logo}
\includegraphics[width=5cm]{logo.png}

\section{Chart}
\includegraphics[width=\textwidth]{chart.pdf}

\end{document}
```
*Note: Set "Inputs Directory" to folder containing images*

#### Bibliography Example
```latex
\documentclass{article}
\usepackage[backend=biber]{biblatex}
\addbibresource{references.bib}

\begin{document}
\title{Research Paper}
\maketitle

\section{Introduction}
According to recent studies \cite{smith2023}.

\printbibliography
\end{document}
```
*Note: Set "Number of Passes" to 2 or 3 for bibliographies*

## Configuration Options

### LaTeX Engines

| Engine | Best For | Features |
|--------|----------|----------|
| **pdflatex** | Standard documents | Fast, reliable, good package support |
| **xelatex** | Unicode, custom fonts | Modern fonts, Unicode support |
| **lualatex** | Advanced typography | Lua scripting, advanced features |

### Compilation Passes

- **1 Pass**: Simple documents without cross-references
- **2 Passes**: Documents with table of contents, cross-references
- **3 Passes**: Documents with bibliographies, complex references

### Directory Options

- **Inputs Directory**: Path to folder containing:
  - Images (PNG, JPG, PDF)
  - Include files (.tex)
  - Custom class files (.cls)
  - Style files (.sty)
- **Fonts Directory**: Path to custom font files (TTF, OTF)

### Output

The node provides:
- **JSON Data**: Success status, filename, file size, MIME type
- **Binary Data**: Generated PDF file ready for download or further processing

Example output:
```json
{
  "success": true,
  "filename": "document-20240120-143022.pdf",
  "mimeType": "application/pdf",
  "fileSize": 156789
}
```

## Common Use Cases

### 1. Report Generation
Generate PDF reports from data:
```javascript
// Previous node processes data
const data = $input.all();
const latexContent = `
\\documentclass{article}
\\begin{document}
\\title{Sales Report}
\\maketitle
\\section{Summary}
Total Sales: $${data.totalSales}
\\end{document}
`;
```

### 2. Invoice Generation
Create professional invoices:
```latex
\documentclass[11pt]{article}
\usepackage{geometry}
\geometry{margin=1in}

\begin{document}
\begin{center}
{\LARGE Invoice \#12345}
\end{center}

\section*{Bill To:}
Customer Name\\
Address

\section*{Items:}
\begin{tabular}{|l|r|r|}
\hline
Description & Quantity & Price \\
\hline
Service A & 2 & \$50.00 \\
Service B & 1 & \$75.00 \\
\hline
\textbf{Total} & & \textbf{\$175.00} \\
\hline
\end{tabular}
\end{document}
```

### 3. Academic Papers
Research documents with citations:
```latex
\documentclass{article}
\usepackage[backend=biber,style=apa]{biblatex}
\addbibresource{references.bib}

\begin{document}
\title{Research Title}
\author{Author Name}
\maketitle

\section{Literature Review}
Previous work by \textcite{author2023} shows...

\printbibliography
\end{document}
```

## Troubleshooting

### LaTeX Installation Issues

**Error: spawn pdflatex ENOENT**
- Install LaTeX on your system
- Ensure LaTeX is in your system PATH
- Restart n8n after installing LaTeX

**Package not found errors:**
```bash
# Install missing packages
sudo tlmgr install package-name

# Update package database
sudo tlmgr update --self --all
```

### Compilation Errors

**Undefined control sequence:**
- Check LaTeX syntax
- Ensure required packages are loaded with `\usepackage{}`
- Verify command spelling

**File not found:**
- Use "Inputs Directory" parameter
- Ensure file paths are relative to inputs directory
- Check file permissions

**TeX capacity exceeded:**
- Usually indicates infinite loops in LaTeX code
- Check `\newcommand` definitions
- Simplify complex nested structures

### Common Package Issues

**Missing adjustwidth:**
Use `\usepackage{changepage}` instead of `\usepackage{adjustwidth}`

**Font issues with xelatex/lualatex:**
- Specify fonts directory
- Use system fonts: `\setmainfont{Arial}`
- Install additional font packages

**Bibliography not showing:**
- Set "Number of Passes" to 2-3
- Ensure .bib file is in inputs directory
- Use correct citation commands

## Performance Tips

- Use pdflatex for fastest compilation
- Minimize the number of passes when possible
- Keep images optimized (reasonable file sizes)
- Use relative paths in LaTeX documents
- Cache compiled documents when possible

## Examples Repository

Find more examples and templates at: [GitHub Examples](https://github.com/your-repo/examples)

## License

MIT License

## Support

- 📖 [Documentation](https://github.com/your-repo/docs)
- 🐛 [Report Issues](https://github.com/your-repo/issues)
- 💬 [Community Discussion](https://community.n8n.io)

---

Made with ❤️ for the n8n community 