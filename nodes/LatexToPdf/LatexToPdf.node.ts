import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	NodeConnectionType,
} from 'n8n-workflow';

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
const latex = require('node-latex');

interface LatexOptions {
	cmd: string;
	passes: number;
	args: string[];
	inputs?: string;
	fonts?: string;
}

function validateLatexContent(content: string): { isValid: boolean; warnings: string[] } {
	const warnings: string[] = [];
	
	// Check for basic document structure
	if (!content.includes('\\documentclass')) {
		warnings.push('Missing \\documentclass command');
	}
	
	if (!content.includes('\\begin{document}')) {
		warnings.push('Missing \\begin{document}');
	}
	
	if (!content.includes('\\end{document}')) {
		warnings.push('Missing \\end{document}');
	}
	
	// Check for potentially problematic custom classes/packages
	const customClasses = content.match(/\\documentclass\{([^}]+)\}/g);
	if (customClasses) {
		customClasses.forEach(cls => {
			const className = cls.match(/\{([^}]+)\}/)?.[1];
			if (className && !['article', 'book', 'report', 'letter', 'beamer'].includes(className)) {
				warnings.push(`Custom document class detected: ${className}. Make sure it's available in your LaTeX installation or inputs directory.`);
			}
		});
	}
	
	// Check for custom packages that might not be available
	const bibCommands = content.match(/\\DefineBibliographyStrings|\\addbibresource|\\printbibliography/);
	if (bibCommands) {
		warnings.push('Bibliography commands detected. Make sure biblatex package is installed and properly configured.');
	}
	
	return {
		isValid: warnings.length === 0 || warnings.every(w => w.includes('Custom document class') || w.includes('Bibliography')),
		warnings
	};
}

async function convertLatexToPdf(latexContent: string, options: LatexOptions): Promise<Buffer> {
	return new Promise((resolve, reject) => {
		const chunks: Buffer[] = [];
		let errorOutput = '';

		const pdfStream = latex(latexContent, options);

		pdfStream.on('data', (chunk: Buffer) => {
			chunks.push(chunk);
		});

		pdfStream.on('end', () => {
			const pdfBuffer = Buffer.concat(chunks);
			if (pdfBuffer.length === 0) {
				reject(new Error('LaTeX compilation produced no output. Check your LaTeX syntax and required packages.'));
			} else {
				resolve(pdfBuffer);
			}
		});

		pdfStream.on('error', (error: Error) => {
			let errorMessage = `LaTeX compilation failed: ${error.message}`;
			
			// Provide specific help for common errors
			if (error.message.includes('not found') || error.message.includes('.cls') || error.message.includes('.sty')) {
				errorMessage += '\n\n💡 Common solutions:\n';
				errorMessage += '• Check if you have all required LaTeX packages installed\n';
				errorMessage += '• Use the "Inputs Directory" option to specify where your custom .cls/.sty files are located\n';
				errorMessage += '• Try using a simpler LaTeX document with standard packages only\n';
				errorMessage += '• Install missing packages: sudo tlmgr install <package-name>';
			}
			
			if (error.message.includes('Undefined control sequence')) {
				errorMessage += '\n\n💡 This usually means:\n';
				errorMessage += '• A LaTeX command/package is not available in your LaTeX installation\n';
				errorMessage += '• Missing \\usepackage{} declarations in your document\n';
				errorMessage += '• Typo in command name';
			}

			reject(new Error(errorMessage));
		});
	});
}

export class LatexToPdf implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'LaTeX to PDF',
		name: 'latexToPdf',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Convert LaTeX documents to PDF using node-latex. Supports standard LaTeX packages and custom document classes.',
		defaults: {
			name: 'LaTeX to PDF',
		},
		// eslint-disable-next-line n8n-nodes-base/node-class-description-inputs-wrong-regular-node
		inputs: [NodeConnectionType.Main],
		// eslint-disable-next-line n8n-nodes-base/node-class-description-outputs-wrong
		outputs: [NodeConnectionType.Main],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Document',
						value: 'document',
					},
				],
				default: 'document',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['document'],
					},
				},
				options: [
					{
						name: 'Convert to PDF',
						value: 'convert',
						description: 'Convert LaTeX content to PDF',
						action: 'Convert la te x to pdf',
					},
				],
				default: 'convert',
			},
			{
				displayName: 'Input Type',
				name: 'inputType',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['convert'],
					},
				},
				options: [
					{
						name: 'Text',
						value: 'text',
						description: 'LaTeX content as text',
					},
					{
						name: 'Binary Property',
						value: 'binary',
						description: 'LaTeX file from binary property',
					},
				],
				default: 'text',
				description: 'The type of LaTeX input',
			},
			{
				displayName: 'LaTeX Content',
				name: 'latexContent',
				type: 'string',
				typeOptions: {
					rows: 10,
				},
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['convert'],
						inputType: ['text'],
					},
				},
				default: '\\documentclass{article}\n\\usepackage[utf8]{inputenc}\n\\usepackage[T1]{fontenc}\n\\usepackage{geometry}\n\\geometry{a4paper, margin=1in}\n\n\\title{LaTeX to PDF Test Document}\n\\author{n8n LaTeX Node}\n\\date{\\today}\n\n\\begin{document}\n\n\\maketitle\n\n\\section{Introduction}\nThis is a test document generated by the n8n LaTeX to PDF node.\n\n\\section{Features}\n\\begin{itemize}\n    \\item Convert LaTeX to PDF\n    \\item Support for text and file inputs\n    \\item Multiple LaTeX engines\n    \\item Custom directories for assets\n\\end{itemize}\n\n\\section{Mathematics}\nHere is a simple equation:\n\\begin{equation}\n    E = mc^2\n\\end{equation}\n\n\\section{Conclusion}\nThis document demonstrates basic LaTeX functionality that works with standard packages.\n\n\\end{document}',
				description: 'The LaTeX content to convert to PDF',
			},
			{
				displayName: 'Input Binary Property',
				name: 'binaryPropertyName',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['convert'],
						inputType: ['binary'],
					},
				},
				default: 'data',
				required: true,
				description: 'Name of the binary property containing the LaTeX file',
			},
			{
				displayName: 'Output Binary Property Name',
				name: 'outputBinaryPropertyName',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['convert'],
					},
				},
				default: 'data',
				required: true,
				description: 'Name of the binary property to store the generated PDF',
			},
			{
				displayName: 'LaTeX Command',
				name: 'latexCmd',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['convert'],
					},
				},
				options: [
					{
						name: 'Pdflatex',
						value: 'pdflatex',
					},
					{
						name: 'Xelatex',
						value: 'xelatex',
					},
					{
						name: 'Lualatex',
						value: 'lualatex',
					},
				],
				default: 'pdflatex',
				description: 'The LaTeX command to use for compilation',
			},
			{
				displayName: 'Number of Passes',
				name: 'passes',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['convert'],
					},
				},
				default: 1,
				description: 'Number of compilation passes (some documents require multiple passes)',
			},
			{
				displayName: 'Additional Options',
				name: 'additionalOptions',
				placeholder: 'Add Option',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['convert'],
					},
				},
				default: {},
				options: [
					{
						name: 'option',
						displayName: 'Option',
						values: [
							{
								displayName: 'Inputs Directory',
								name: 'inputs',
								type: 'string',
								default: '',
								description: 'Path to directory containing assets (images, .cls files, .sty files, .bib files) needed by your LaTeX document',
								placeholder: '/path/to/your/latex/files',
							},
							{
								displayName: 'Fonts Directory',
								name: 'fonts',
								type: 'string',
								default: '',
								description: 'Path to directory containing fonts (for fontspec)',
							},
						],
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;

				if (resource === 'document' && operation === 'convert') {
					const inputType = this.getNodeParameter('inputType', i) as string;
					const outputBinaryPropertyName = this.getNodeParameter(
						'outputBinaryPropertyName',
						i,
					) as string;
					const latexCmd = this.getNodeParameter('latexCmd', i) as string;
					const passes = this.getNodeParameter('passes', i) as number;
					const additionalOptions = this.getNodeParameter('additionalOptions', i) as {
						option?: Array<{ inputs?: string; fonts?: string }>;
					};

					let latexContent: string;

					// Get LaTeX content based on input type
					if (inputType === 'text') {
						latexContent = this.getNodeParameter('latexContent', i) as string;
					} else {
						// Binary input
						const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
						const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
						latexContent = Buffer.from(binaryData.data, 'base64').toString('utf8');
					}

					// Prepare latex options
					const options: LatexOptions = {
						cmd: latexCmd,
						passes: passes,
						args: ['-halt-on-error'],
					};

					// Add additional options
					if (additionalOptions.option) {
						for (const option of additionalOptions.option) {
							if (option.inputs) {
								options.inputs = option.inputs;
							}
							if (option.fonts) {
								options.fonts = option.fonts;
							}
						}
					}

					// Validate LaTeX content before processing
					const validation = validateLatexContent(latexContent);
					if (!validation.isValid) {
						throw new Error(`LaTeX validation failed:\n${validation.warnings.join('\n')}`);
					}

					// Create temporary directory for processing
					const tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'n8n-latex-'));

					try {
						// Convert LaTeX to PDF
						const pdfBuffer = await convertLatexToPdf(latexContent, options);

						// Store the PDF as binary data
						const binaryData = await this.helpers.prepareBinaryData(
							pdfBuffer,
							`output-${Date.now()}.pdf`,
							'application/pdf',
						);

						returnData.push({
							json: {
								success: true,
								filename: binaryData.fileName,
								mimeType: binaryData.mimeType,
								fileSize: pdfBuffer.length,
								warnings: validation.warnings.length > 0 ? validation.warnings : undefined,
							},
							binary: {
								[outputBinaryPropertyName]: binaryData,
							},
						});
					} finally {
						// Clean up temporary directory
						try {
							await fs.promises.rmdir(tempDir, { recursive: true });
						} catch (error) {
							// Ignore cleanup errors
						}
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error instanceof Error ? error.message : String(error),
							success: false,
						},
					});
					continue;
				}
				throw new NodeOperationError(this.getNode(), error as Error, {
					itemIndex: i,
				});
			}
		}

		return [returnData];
	}
}
