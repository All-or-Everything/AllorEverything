import { Plugin, ItemView, TFile, WorkspaceLeaf } from "obsidian";

const NOTE_PROXIMITY_VIEW = "note-proximity-view";

class TfIdf {
	corpus: Map<string, string[]>;

	constructor() {
		this.corpus = new Map();
	}

	getWordsFromText(document: string): string[] {
		return document.replace(/[\r\n]/g, " ").trim().split(/\W+/);
	}

	/**
	 * Adds a document to the corpus.
	 */
	addDocument(document: { text: string; path: string }): Map<string, string[]> {
		let strArray = this.getWordsFromText(document.text);
		this.corpus.set(document.path, strArray);
		return this.corpus;
	}

	/**
	 * Creates a corpus from an array of documents.
	 */
	createCorpusFromStringArray(documents: { text: string; path: string }[]): Map<string, string[]> {
		for (let i = 0; i < documents.length; i++) {
			let strArray = this.getWordsFromText(documents[i].text);
			this.corpus.set(documents[i].path, strArray);
		}
		return this.corpus;
	}

	/**
	 * Calculates the term frequency (tf) of a given term in a document.
	 */
	calculateTermFrequency(term: string, document: string[]): number {
		let numOccurences = 0;
		for (let i = 0; i < document.length; i++) {
			if (document[i].toLowerCase() === term.toLowerCase()) {
				numOccurences++;
			}
		}
		// Using (document.length + 1) to avoid division by zero.
		return numOccurences / (document.length + 1);
	}

	/**
	 * Calculates the inverse document frequency (idf) of a term in the corpus.
	 */
	calculateInverseDocumentFrequency(term: string): number {
		if (this.corpus == null) return -1;
		let numDocs = 0;
		for (const document of this.corpus.values()) {
			for (let j = 0; j < document.length; j++) {
				if (document[j].toLowerCase() === term.toLowerCase()) {
					numDocs++;
					break;
				}
			}
		}
		return Math.log(this.corpus.size / (numDocs + 1)) + 1;
	}

	/**
	 * Creates an idf model for the query terms.
	 */
	createIdfModel(query: string | string[]): number[] | null {
		const queryArray = Array.isArray(query) ? query : query.split(" ");
		if (this.corpus == null) return null;
		let model: number[] = [];
		for (let i = 0; i < queryArray.length; i++) {
			model.push(this.calculateInverseDocumentFrequency(queryArray[i]));
		}
		return model;
	}

	/**
	 * Creates a vector space model (tf-idf vector) for a given document based on the query.
	 */
	createVectorSpaceModel(query: string | string[], document: string[]): number[] | null {
		const queryArray = Array.isArray(query) ? query : query.split(" ");
		if (this.corpus == null) return null;
		let termFrequencyModel: number[] = [];
		let vectorSpaceModel: number[] = [];
		for (let i = 0; i < queryArray.length; i++) {
			termFrequencyModel.push(this.calculateTermFrequency(queryArray[i], document));
		}
		const idfModel = this.createIdfModel(queryArray);
		if (idfModel == null) return null;
		for (let j = 0; j < idfModel.length; j++) {
			vectorSpaceModel[j] = idfModel[j] * termFrequencyModel[j];
		}
		return vectorSpaceModel;
	}

	/**
	 * Calculates the cosine similarity between two vectors.
	 */
	calculateSimilarityIndex(query: string | string[], document: string[]): number {
		const queryArray = Array.isArray(query) ? query : query.split(" ");
		const queryVector = this.createVectorSpaceModel(queryArray, queryArray);
		const docVector = this.createVectorSpaceModel(queryArray, document);
		let similarityIndex = 0;
		for (let i = 0; i < queryArray.length; i++) {
			const product = queryVector![i] * docVector![i];
			similarityIndex += isNaN(product) ? 0 : product;
		}
		const queryMag = this.calculateMagnitude(queryVector!);
		const docMag = this.calculateMagnitude(docVector!);
		const similarity = similarityIndex / (queryMag * docMag);
		return isNaN(similarity) ? 0 : similarity;
	}

	/**
	 * Ranks the documents in the corpus based on their similarity to the query.
	 */
	rankDocumentsByQuery(query: string, limit = 10, excludePath?: string): { document: string[]; similarityIndex: number; path: string }[] {
		const queryParts = query.split(" ");
		let ranking: { document: string[]; similarityIndex: number; path: string }[] = [];
		for (const [path, document] of this.corpus.entries()) {
			ranking.push({
				document,
				similarityIndex: this.calculateSimilarityIndex(queryParts, document),
				path,
			});
		}
		ranking.sort((a, b) => b.similarityIndex - a.similarityIndex);
		return ranking.filter((doc) => (excludePath ? doc.path !== excludePath : true)).splice(0, limit);
	}

	/**
	 * Calculates the magnitude of a vector.
	 */
	calculateMagnitude(vector: number[]): number {
		let magnitude = 0;
		for (let i = 0; i < vector.length; i++) {
			magnitude += isNaN(vector[i]) ? 0 : vector[i] * vector[i];
		}
		return Math.sqrt(magnitude);
	}
}

class LookalikeView extends ItemView {
	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType(): string {
		return NOTE_PROXIMITY_VIEW;
	}

	getDisplayText(): string {
		return "Note proximity";
	}

	async onOpen() {
		// Any initialization for your view can go here.
	}

	/**
	 * Updates the view with the TF-IDF rankings.
	 */
	async update(rankings: { path: string; similarityIndex: number }[]) {
		const container = this.containerEl.children[1];
		container.empty();

		// Create header.
		container.createEl("div", {
			cls: "tree-item",
		}).createEl("div", {
			cls: ["tree-item-inner", "backlink-pane"],
			text: "Similar notes:",
		}).setCssStyles({
			color: "var(--text-muted)",
			fontSize: "var(--font-adaptive-smallest)",
			fontWeight: "var(--nav-heading-weight)",
			letterSpacing: ".05em",
			textTransform: "uppercase",
		});

		// Create container for search results.
		const searchResultContainer = container.createEl("div", {
			cls: ["search-results-container"],
		});
		const searchResultsChildren = searchResultContainer.createEl("div", {
			cls: ["search-results-children"],
		});

		// Add each search result.
		for (const { path, similarityIndex } of rankings) {
			const searchResult = searchResultsChildren.createEl("div", {
				cls: ["tree-item", "search-result-file-title"],
			});
			searchResult.onclick = () => {
				this.app.workspace.openLinkText(path, "", false);
			};
			searchResult
				.createEl("div", {
					cls: ["tree-item-self", "is-clickable"],
				})
				.createEl("div", {
					text: `(${similarityIndex.toFixed(3)}) ${path}`,
					cls: ["tree-item-inner"],
				});
		}
	}

	async onClose() {
		// Cleanup, if needed.
	}
}

export default class LookalikePlugin extends Plugin {
	// Used to debounce file-change events.
	fileChangeTimeout: number;

	async onload() {
		this.registerView(NOTE_PROXIMITY_VIEW, (leaf) => new LookalikeView(leaf));

		// Listen for file creation and modification.
		this.registerEvent(
			this.app.vault.on("create", (file) => {
				if (file instanceof TFile) {
					this.onFileChange(file);
				}
			})
		);
		this.registerEvent(
			this.app.vault.on("modify", (file) => {
				if (file instanceof TFile) {
					this.onFileChange(file);
				}
			})
		);

		// Listen for active-leaf changes.
		this.registerEvent(
			this.app.workspace.on("active-leaf-change", (leaf) => {
				if (leaf?.view.file && leaf.view.file instanceof TFile) {
					this.onFileChange(leaf.view.file);
				}
			})
		);

		// Process the active file on startup.
		const activeFile = this.app.workspace.getActiveFile();
		if (activeFile && activeFile instanceof TFile) {
			this.onFileChange(activeFile);
		}

		// Register a command to open the sidebar.
		this.addCommand({
			id: "open-sidebar",
			name: "Open Lookalike sidebar",
			callback: () => {
				const previousLeaf = this.app.workspace.getMostRecentLeaf();
				this.activateView();
				if (previousLeaf && previousLeaf.view.file) {
					this.onFileChange(previousLeaf.view.file);
				}
			},
		});

		await this.activateView();
	}

	/**
	 * Debounced event handler for file changes.
	 */
	async onFileChange(file: TFile) {
		// Clear any pending file-change update.
		window.clearTimeout(this.fileChangeTimeout);
		this.fileChangeTimeout = window.setTimeout(async () => {
			const rankings = await this.calculateTfIdf(file);
			await this.updateView(rankings);
		}, 300);
	}

	onunload() {
		// Optionally clean up view registrations, etc.
	}

	/**
	 * Activates (or creates) the sidebar view.
	 */
	async activateView() {
		const { workspace } = this.app;
		let leaf: WorkspaceLeaf | null = null;
		const leaves = workspace.getLeavesOfType(NOTE_PROXIMITY_VIEW);
		if (leaves.length > 0) {
			leaf = leaves[0];
		} else {
			leaf = workspace.getRightLeaf(false);
			if (leaf) {
				await leaf.setViewState({
					type: NOTE_PROXIMITY_VIEW,
					active: true,
				});
			}
		}
		if (leaf) {
			workspace.revealLeaf(leaf);
		}
	}

	/**
	 * Updates the sidebar view with the latest TF-IDF rankings.
	 */
	async updateView(rankings: { path: string; similarityIndex: number }[]) {
		const { workspace } = this.app;
		const leaves = workspace.getLeavesOfType(NOTE_PROXIMITY_VIEW);
		if (leaves.length > 0) {
			// Type assertion to our custom view.
			(const leaves[0].view as LookalikeView).update(rankings);
		}
	}

	/**
	 * Calculates the TF-IDF rankings for the current file by building the corpus concurrently.
	 */
	async calculateTfIdf(currentFile: TFile) {
		const { vault } = this.app;
		const tfIdf = new TfIdf();
		const files = vault.getMarkdownFiles();

		// Read all Markdown files concurrently.
		await Promise.all(
			files.map(async (file) => {
				const text = await vault.cachedRead(file);
				tfIdf.addDocument({ text, path: file.path });
			})
		);

		// Read the current file and rank against the corpus.
		const currentText = await vault.cachedRead(currentFile);
		const rankings = tfIdf.rankDocumentsByQuery(currentText, 10, currentFile.path);
		return rankings;
	}
}
