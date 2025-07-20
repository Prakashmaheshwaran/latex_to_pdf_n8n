# LaTeX to PDF Node - Troubleshooting Guide

## Common Error Messages and Solutions

### 1. "File 'xyz.cls' not found" or "File 'xyz.sty' not found"

**Problem**: Your LaTeX document requires custom class files (`.cls`) or style files (`.sty`) that aren't in the standard LaTeX installation.

**Solutions**:
- **Option A**: Use the **Inputs Directory** parameter to specify where your custom files are located
- **Option B**: Install the missing package using LaTeX package manager:
  ```bash
  sudo tlmgr install package-name
  ```
- **Option C**: Use a simpler document class like `article`, `book`, or `report`

**Example with Inputs Directory**:
If your document uses `\documentclass{curve}` and you have `curve.cls` in `/path/to/my/latex/files/`, set the **Inputs Directory** to `/path/to/my/latex/files/`.

### 2. "Undefined control sequence" errors

**Problem**: LaTeX commands that aren't available in your installation.

**Common causes**:
- Missing `\usepackage{}` declarations
- Typos in command names
- Commands from packages not installed

**Solutions**:
- Add the required `\usepackage{}` at the top of your document
- Check for typos in command names
- Install missing packages

**Example**:
```latex
% For bibliography commands like \DefineBibliographyStrings
\usepackage{biblatex}

% For advanced math
\usepackage{amsmath}

% For graphics
\usepackage{graphicx}
```

### 3. Bibliography Issues

**Problem**: Errors with `\DefineBibliographyStrings`, `\addbibresource`, etc.

**Solution**: Add proper bibliography setup:
```latex
\documentclass{article}
\usepackage[backend=biber,style=alphabetic]{biblatex}
\addbibresource{references.bib}  % Your .bib file

\begin{document}
% Your content
\printbibliography
\end{document}
```

### 4. Multiple Compilation Passes

**Problem**: References, citations, or table of contents not appearing correctly.

**Solution**: Set **Number of Passes** to 2 or 3 in the node configuration.

## Best Practices

### 1. Start Simple
Use this minimal template for testing:
```latex
\documentclass{article}
\usepackage[utf8]{inputenc}
\usepackage[T1]{fontenc}

\title{Test Document}
\author{Your Name}
\date{\today}

\begin{document}
\maketitle

\section{Introduction}
This is a test document.

\end{document}
```

### 2. Organize Your Files
```
my-latex-project/
├── main.tex           (your main document)
├── figures/           (images)
├── styles/            (custom .sty files)
├── classes/           (custom .cls files)
└── references.bib     (bibliography)
```
Then set **Inputs Directory** to `/path/to/my-latex-project/`

### 3. Check Package Availability
Before using custom packages, check if they're installed:
```bash
kpsewhich package-name.sty
```

### 4. Use Standard Packages
Prefer widely-available packages:
- `geometry` for page layout
- `graphicx` for images
- `amsmath` for mathematics
- `babel` for language support
- `hyperref` for links (add last)

## Node Configuration Tips

1. **Input Type**: 
   - Use "Text" for simple documents
   - Use "Binary Property" when working with complex documents from files

2. **LaTeX Command**:
   - `pdflatex`: Fast, good for most documents
   - `xelatex`: Better Unicode and font support
   - `lualatex`: Most modern, best for complex documents

3. **Additional Options**:
   - **Inputs Directory**: Essential for documents with custom files
   - **Fonts Directory**: Only needed for custom fonts with xelatex/lualatex

4. **Error Handling**:
   - Enable "Continue on Fail" to see detailed error messages
   - Check the JSON output for validation warnings

## Testing Your Setup

Use this workflow to test your LaTeX installation:

1. **Manual Trigger** → **LaTeX to PDF** → **Write Binary File**
2. Use the default LaTeX content first
3. Gradually add complexity to test your packages

## Getting Help

If you're still having issues:

1. Check the node's JSON output for detailed error messages and warnings
2. Test your LaTeX document locally first: `pdflatex your-document.tex`
3. Verify all required packages are installed
4. Check file paths and permissions for custom files 