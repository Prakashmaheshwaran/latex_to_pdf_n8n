#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Checking LaTeX installation...');

function checkCommand(command, description) {
  try {
    execSync(`which ${command}`, { stdio: 'ignore' });
    console.log(`✅ ${description} found`);
    return true;
  } catch (error) {
    console.log(`❌ ${description} not found`);
    return false;
  }
}

function checkLatexInstallation() {
  let hasLatex = false;
  
  // Check for common LaTeX distributions
  const latexCommands = [
    { cmd: 'pdflatex', desc: 'pdflatex' },
    { cmd: 'xelatex', desc: 'xelatex' },
    { cmd: 'lualatex', desc: 'lualatex' },
    { cmd: 'latex', desc: 'latex' }
  ];
  
  console.log('\nChecking for LaTeX engines:');
  
  for (const { cmd, desc } of latexCommands) {
    if (checkCommand(cmd, desc)) {
      hasLatex = true;
    }
  }
  
  return hasLatex;
}

function displayInstallationInstructions() {
  console.log('\n📋 LaTeX Installation Instructions:');
  console.log('');
  console.log('To use this n8n node, you need to install LaTeX on your system:');
  console.log('');
  
  const platform = process.platform;
  
  switch (platform) {
    case 'darwin': // macOS
      console.log('🍎 macOS:');
      console.log('  • Download MacTeX from: https://www.tug.org/mactex/');
      console.log('  • Or install via Homebrew: brew install --cask mactex-no-gui');
      break;
      
    case 'linux':
      console.log('🐧 Linux:');
      console.log('  • Ubuntu/Debian: sudo apt-get install texlive-full');
      console.log('  • CentOS/RHEL: sudo yum install texlive-scheme-full');
      console.log('  • Arch Linux: sudo pacman -S texlive-most');
      break;
      
    case 'win32':
      console.log('🪟 Windows:');
      console.log('  • Download MiKTeX from: https://miktex.org/download');
      console.log('  • Or download TeX Live from: https://www.tug.org/texlive/');
      break;
      
    default:
      console.log('  • Visit https://www.latex-project.org/get/ for installation instructions');
  }
  
  console.log('');
  console.log('After installation, restart your terminal and try installing this package again.');
  console.log('');
}

// Main check
const hasLatex = checkLatexInstallation();

if (!hasLatex) {
  console.log('\n⚠️  WARNING: LaTeX is not installed or not found in PATH');
  displayInstallationInstructions();
  
  // Check if we should allow installation anyway (useful for Docker builds, etc.)
  if (process.env.SKIP_LATEX_CHECK === 'true') {
    console.log('🚀 Skipping LaTeX check due to SKIP_LATEX_CHECK environment variable');
    console.log('   Make sure LaTeX is available at runtime!');
    process.exit(0);
  }
  
  console.log('💡 To skip this check, set environment variable: SKIP_LATEX_CHECK=true');
  console.log('');
  process.exit(1);
} else {
  console.log('\n✅ LaTeX installation verified! Proceeding with package installation...');
  process.exit(0);
} 