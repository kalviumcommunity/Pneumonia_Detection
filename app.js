// Pneumonia Detection App JavaScript
class PneumoniaDetectionApp {
    constructor() {
        this.apiKey = 'AIzaSyBKDFyflc-Chesroe1iUBmzwF4MRMxpFgU';
        this.currentImage = null;
        this.analysisHistory = [];
        
        // RTFC Framework Prompting System
        this.systemPrompt = `# ROLE (R)
You are an expert AI radiologist assistant specializing in chest X-ray analysis and pneumonia detection. You have been trained on thousands of medical images and possess deep knowledge of pulmonary anatomy, pathology, and radiological patterns.

# CONTEXT (C)
You are operating within a medical AI diagnostic support system for educational purposes and preliminary screening. IMPORTANT: This system is for educational purposes only - always recommend professional medical consultation.

# TASK FRAMEWORK (T)
Analyze chest X-ray images for pneumonia signs, provide confidence-scored assessments, and explain reasoning with educational insights.

# FORMAT REQUIREMENTS (F)
Respond in JSON format with: primary_assessment (diagnosis, confidence_score, severity), detailed_findings (lung_fields, specific_indicators), educational_insights, recommendations, and disclaimer.`;

        // Enhanced RTFC-based prompting templates
        this.prompts = {
            zero_shot: `# TASK (T): Analyze this chest X-ray image to determine if pneumonia is present following medical imaging standards.

# ROLE (R): Act as an expert radiologist providing comprehensive diagnostic assessment.

# FORMAT (F): Provide structured analysis with confidence scores, detailed findings, and educational explanations.

# CONTEXT (C): Educational medical AI system for preliminary screening - recommend professional consultation for all findings.

Analyze the uploaded chest X-ray image and provide your assessment with confidence level, explaining key radiological findings and their clinical significance.`,
            
            one_shot: `# ROLE (R): Expert radiologist with teaching focus

# CONTEXT (C): Educational analysis with clinical guidance example

# TASK (T): Here's how to analyze chest X-rays for pneumonia: Look for areas of consolidation (dense white areas), opacity (cloudiness), air bronchograms (air-filled tubes visible through consolidation), and fluid accumulation in lung fields. Cloudy, white, or opaque areas often indicate inflammation or infection.

Now apply this methodology to analyze this chest X-ray image and determine if pneumonia is present.

# FORMAT (F): Provide your assessment with confidence level, detailed findings explanation, and educational insights comparing to the analysis framework provided.`,
            
            few_shot: `# ROLE (R): Teaching radiologist with pattern recognition expertise

# CONTEXT (C): Pattern-based learning using clinical reference examples

# TASK (T): Using these pneumonia detection patterns, analyze the provided image:

**Reference Pattern 1 - Normal lungs:** Clear, dark lung fields with visible bronchial markings, no consolidation, normal cardiac silhouette
**Reference Pattern 2 - Bacterial pneumonia:** Dense consolidation in one or more lobes, air bronchograms visible, well-defined borders, often unilateral
**Reference Pattern 3 - Viral pneumonia:** Bilateral patchy infiltrates, diffuse pattern across multiple lobes, less dense than bacterial, interstitial involvement
**Reference Pattern 4 - Severe pneumonia:** Extensive bilateral consolidation, possible pleural effusion, multiple lobe involvement

Now analyze this chest X-ray image using these reference patterns and determine if pneumonia is present.

# FORMAT (F): Provide assessment with confidence level, pattern comparison, and educational correlation to reference examples.`,

            chain_of_thought: `# ROLE (R): Mentor radiologist demonstrating systematic diagnostic reasoning

# CONTEXT (C): Step-by-step educational methodology for comprehensive analysis

# TASK (T): Perform systematic analysis following this diagnostic reasoning chain:

**Step 1:** Technical Assessment - Evaluate image quality, positioning, artifacts
**Step 2:** Systematic Review - Examine lung fields (upper→middle→lower zones), cardiac silhouette, mediastinal structures
**Step 3:** Pattern Recognition - Identify opacity, consolidation, abnormal shadowing, assess air bronchograms
**Step 4:** Clinical Correlation - Consider pneumonia-specific indicators, distribution patterns (lobar/bronchial/interstitial)
**Step 5:** Differential Diagnosis - Rule out other pathologies, assess confidence level
**Step 6:** Final Assessment - Synthesize findings, assign confidence score, recommend follow-up

# FORMAT (F): Document each step clearly with detailed explanations showing your complete reasoning process and educational insights.

Please analyze this chest X-ray following these systematic steps.`,

            dynamic: `# ROLE (R): Adaptive AI radiologist with flexible methodology

# CONTEXT (C): Intelligent approach selection based on image characteristics and case complexity

# TASK (T): 
1. Assess the image to determine optimal analysis approach
2. Choose between focused evaluation (obvious findings) or comprehensive screening (subtle findings)
3. Adapt confidence thresholds based on image quality
4. Provide reasoning for chosen analytical approach

# FORMAT (F): Include analysis approach selection, adaptation reasoning, and standard diagnostic findings with educational value.

I'll analyze this chest X-ray image using the most appropriate diagnostic methodology based on the specific image characteristics, ensuring optimal analysis tailored to this unique case.`
        };
        
        this.initializeApp();
    }

    initializeApp() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupEventListeners();
                this.setupAPIKey();
                this.setupDragAndDrop();
            });
        } else {
            this.setupEventListeners();
            this.setupAPIKey();
            this.setupDragAndDrop();
        }
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // File upload elements
        const fileInput = document.getElementById('fileInput');
        const uploadBtn = document.getElementById('uploadBtn');
        const uploadArea = document.getElementById('uploadArea');
        
        if (!fileInput || !uploadBtn || !uploadArea) {
            console.error('Upload elements not found');
            return;
        }
        
        // File upload events
        uploadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Upload button clicked');
            fileInput.click();
        });
        
        uploadArea.addEventListener('click', (e) => {
            // Only trigger if clicking the upload area itself, not child elements
            if (e.target === uploadArea || e.target.closest('.upload-content')) {
                e.preventDefault();
                console.log('Upload area clicked');
                fileInput.click();
            }
        });
        
        fileInput.addEventListener('change', (e) => {
            console.log('File input changed');
            this.handleFileSelect(e);
        });
        
        // Image controls
        const clearImageBtn = document.getElementById('clearImageBtn');
        if (clearImageBtn) {
            clearImageBtn.addEventListener('click', () => this.clearImage());
        }
        
        // Analysis
        const analyzeBtn = document.getElementById('analyzeBtn');
        if (analyzeBtn) {
            analyzeBtn.addEventListener('click', () => this.analyzeImage());
        }
        
        // Settings
        const temperatureSlider = document.getElementById('temperature');
        const temperatureValue = document.getElementById('temperatureValue');
        
        if (temperatureSlider && temperatureValue) {
            temperatureSlider.addEventListener('input', (e) => {
                temperatureValue.textContent = e.target.value;
            });
        }
        
        // Results actions
        const analyzeAnotherBtn = document.getElementById('analyzeAnotherBtn');
        const downloadResultsBtn = document.getElementById('downloadResultsBtn');
        const retryBtn = document.getElementById('retryBtn');
        
        if (analyzeAnotherBtn) {
            analyzeAnotherBtn.addEventListener('click', () => this.resetForNewAnalysis());
        }
        
        if (downloadResultsBtn) {
            downloadResultsBtn.addEventListener('click', () => this.downloadResults());
        }
        
        if (retryBtn) {
            retryBtn.addEventListener('click', () => this.analyzeImage());
        }
        
        console.log('Event listeners setup complete');
    }

    setupAPIKey() {
        const apiKeyInput = document.getElementById('apiKey');
        
        if (apiKeyInput) {
            // Pre-fill the API key for demo purposes
            apiKeyInput.value = this.apiKey;
            
            apiKeyInput.addEventListener('change', (e) => {
                this.apiKey = e.target.value || this.apiKey;
            });
        }
    }

    setupDragAndDrop() {
        const uploadArea = document.getElementById('uploadArea');
        
        if (!uploadArea) {
            console.error('Upload area not found for drag and drop');
            return;
        }
        
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, this.preventDefaults, false);
            document.body.addEventListener(eventName, this.preventDefaults, false);
        });
        
        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => {
                uploadArea.classList.add('dragover');
            }, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => {
                uploadArea.classList.remove('dragover');
            }, false);
        });
        
        uploadArea.addEventListener('drop', (e) => this.handleDrop(e), false);
    }

    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    handleDrop(e) {
        const files = e.dataTransfer.files;
        console.log('Files dropped:', files.length);
        if (files.length > 0) {
            this.handleFile(files[0]);
        }
    }

    handleFileSelect(e) {
        const file = e.target.files[0];
        console.log('File selected:', file);
        if (file) {
            this.handleFile(file);
        }
    }

    handleFile(file) {
        console.log('Handling file:', file.name, file.type, file.size);
        
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            this.showError('Please select a valid image file (JPEG, PNG, or WebP).');
            return;
        }
        
        // Validate file size (10MB)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            this.showError('File size must be less than 10MB.');
            return;
        }
        
        this.currentImage = file;
        this.showImagePreview(file);
    }

    showImagePreview(file) {
        console.log('Showing image preview for:', file.name);
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const previewImage = document.getElementById('previewImage');
            const imageInfo = document.getElementById('imageInfo');
            const imagePreview = document.getElementById('imagePreview');
            const analysisControls = document.getElementById('analysisControls');
            
            if (!previewImage || !imageInfo || !imagePreview || !analysisControls) {
                console.error('Preview elements not found');
                return;
            }
            
            previewImage.src = e.target.result;
            
            // Show image info
            const sizeKB = Math.round(file.size / 1024);
            const sizeDisplay = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)}MB` : `${sizeKB}KB`;
            imageInfo.innerHTML = `
                <strong>File:</strong> ${file.name}<br>
                <strong>Size:</strong> ${sizeDisplay}<br>
                <strong>Type:</strong> ${file.type}<br>
                <strong>Status:</strong> <span class="status status--success">Ready for analysis</span>
            `;
            
            // Show preview and controls
            imagePreview.classList.remove('hidden');
            analysisControls.classList.remove('hidden');
            
            console.log('Image preview displayed successfully');
        };
        
        reader.onerror = (error) => {
            console.error('Error reading file:', error);
            this.showError('Error reading the selected file.');
        };
        
        reader.readAsDataURL(file);
    }

    clearImage() {
        console.log('Clearing image');
        this.currentImage = null;
        
        const imagePreview = document.getElementById('imagePreview');
        const analysisControls = document.getElementById('analysisControls');
        const fileInput = document.getElementById('fileInput');
        
        if (imagePreview) imagePreview.classList.add('hidden');
        if (analysisControls) analysisControls.classList.add('hidden');
        if (fileInput) fileInput.value = '';
        
        this.hideResults();
    }

    async analyzeImage() {
        console.log('Starting image analysis');
        
        if (!this.currentImage) {
            this.showError('Please upload an image first.');
            return;
        }

        if (!this.apiKey) {
            this.showError('Please enter your Gemini API key.');
            return;
        }

        this.showLoading();
        
        try {
            const base64Image = await this.fileToBase64(this.currentImage);
            const promptType = document.getElementById('promptType')?.value || 'zero_shot';
            const temperature = parseFloat(document.getElementById('temperature')?.value || '0.3');
            
            console.log('Calling Gemini API with prompt type:', promptType);
            
            const result = await this.callGeminiAPI(base64Image, promptType, temperature);
            
            this.showResults(result, promptType);
            this.saveAnalysisToHistory(result, promptType);
            
        } catch (error) {
            console.error('Analysis error:', error);
            this.showError(`Failed to analyze the image: ${error.message}. Please check your API key and try again.`);
        }
    }

    async fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    async callGeminiAPI(base64Image, promptType, temperature) {
        const userPrompt = this.prompts[promptType];
        
        console.log('Making API request to Gemini with RTFC framework...');
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        {
                            text: this.systemPrompt + "\n\n" + userPrompt
                        },
                        {
                            inline_data: {
                                mime_type: this.currentImage.type,
                                data: base64Image
                            }
                        }
                    ]
                }],
                generationConfig: {
                    temperature: temperature,
                    topK: 40,
                    topP: 0.9,
                    maxOutputTokens: 2000, // Increased for detailed RTFC responses
                }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error:', response.status, errorText);
            throw new Error(`API request failed with status ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log('API Response received:', data);
        
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            throw new Error('Invalid response format from API');
        }

        return {
            text: data.candidates[0].content.parts[0].text,
            promptType: promptType,
            temperature: temperature,
            tokensUsed: data.usageMetadata?.totalTokenCount || 0,
            timestamp: new Date().toISOString(),
            rtfcFramework: "RTFC Framework Applied: Role (Expert Radiologist) + Task (Medical Analysis) + Format (Structured Output) + Context (Educational/Preliminary)"
        };
    }

    showLoading() {
        console.log('Showing loading state');
        
        const loadingCard = document.getElementById('loadingCard');
        const resultsCard = document.getElementById('resultsCard');
        const errorCard = document.getElementById('errorCard');
        
        if (loadingCard) loadingCard.classList.remove('hidden');
        if (resultsCard) resultsCard.classList.add('hidden');
        if (errorCard) errorCard.classList.add('hidden');
        
        // Animate progress bar
        const progressFill = document.getElementById('progressFill');
        if (progressFill) {
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 15;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                }
                progressFill.style.width = `${progress}%`;
            }, 200);
            
            // Store interval to clear it later
            this.progressInterval = interval;
        }
    }

    showResults(result, promptType) {
        console.log('Showing results:', result);
        
        // Clear loading state
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
        }
        
        const loadingCard = document.getElementById('loadingCard');
        const resultsCard = document.getElementById('resultsCard');
        const resultSummary = document.getElementById('resultSummary');
        const resultDetails = document.getElementById('resultDetails');
        const resultTimestamp = document.getElementById('resultTimestamp');
        
        if (loadingCard) loadingCard.classList.add('hidden');
        if (resultsCard) resultsCard.classList.remove('hidden');
        
        // Parse the AI response to extract key information
        const analysis = this.parseAIResponse(result.text);
        
        // Set timestamp
        if (resultTimestamp) {
            resultTimestamp.textContent = `Analysis completed on ${new Date(result.timestamp).toLocaleString()}`;
        }
        
        // Create result summary
        if (resultSummary) {
            resultSummary.innerHTML = `
                <div class="diagnosis-result ${analysis.hasPneumonia ? 'pneumonia' : 'normal'}">
                    <div class="result-icon">
                        ${analysis.hasPneumonia ? 
                            '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>' :
                            '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>'
                        }
                    </div>
                    <div class="result-text">
                        <h3>${analysis.hasPneumonia ? 'Pneumonia Detected' : 'Normal Chest X-ray'}</h3>
                        <p class="confidence">Confidence: ${analysis.confidence}%</p>
                    </div>
                </div>
            `;
        }
        
        // Create detailed results
        if (resultDetails) {
            resultDetails.innerHTML = `
                <h4>Detailed Analysis</h4>
                <div class="analysis-details">
                    <p><strong>Analysis Type:</strong> ${this.getPromptTypeLabel(promptType)}</p>
                    <p><strong>AI Temperature:</strong> ${result.temperature}</p>
                    <p><strong>Tokens Used:</strong> ${result.tokensUsed}</p>
                </div>
                <h4>AI Assessment</h4>
                <div class="ai-response">
                    ${this.formatAIResponse(result.text)}
                </div>
            `;
        }
        
        // Store current result for download
        this.currentResult = {
            ...result,
            analysis: analysis,
            imageName: this.currentImage.name,
            imageSize: this.currentImage.size
        };
    }

    parseAIResponse(text) {
        // Simple parsing logic to extract key information
        const lowerText = text.toLowerCase();
        
        // Look for confidence indicators
        const confidenceMatch = text.match(/(\d{1,3})%|confidence[:\s]*(\d{1,3})|(\d{1,3})\s*percent/i);
        let confidence = 75; // Default confidence
        
        if (confidenceMatch) {
            confidence = parseInt(confidenceMatch[1] || confidenceMatch[2] || confidenceMatch[3]);
        }
        
        // Determine if pneumonia is detected
        const pneumoniaIndicators = [
            'pneumonia', 'infection', 'consolidation', 'opacity', 'infiltrate',
            'abnormal', 'pathology', 'disease', 'positive'
        ];
        
        const normalIndicators = [
            'normal', 'clear', 'negative', 'no pneumonia', 'healthy',
            'no signs', 'no evidence', 'unremarkable'
        ];
        
        let pneumoniaScore = 0;
        let normalScore = 0;
        
        pneumoniaIndicators.forEach(indicator => {
            const regex = new RegExp(indicator, 'gi');
            const matches = (lowerText.match(regex) || []).length;
            pneumoniaScore += matches;
        });
        
        normalIndicators.forEach(indicator => {
            const regex = new RegExp(indicator, 'gi');
            const matches = (lowerText.match(regex) || []).length;
            normalScore += matches;
        });
        
        const hasPneumonia = pneumoniaScore > normalScore;
        
        return {
            hasPneumonia: hasPneumonia,
            confidence: confidence,
            pneumoniaScore: pneumoniaScore,
            normalScore: normalScore
        };
    }

    getPromptTypeLabel(type) {
        const labels = {
            zero_shot: 'Standard Analysis',
            one_shot: 'Enhanced Detection',
            few_shot: 'Comprehensive Scan',
            chain_of_thought: 'Step-by-step Analysis',
            dynamic: 'Adaptive Analysis'
        };
        return labels[type] || type;
    }

    formatAIResponse(text) {
        // Format the AI response for better readability
        return text
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');
    }

    showError(message) {
        console.log('Showing error:', message);
        
        const loadingCard = document.getElementById('loadingCard');
        const resultsCard = document.getElementById('resultsCard');
        const errorCard = document.getElementById('errorCard');
        const errorMessage = document.getElementById('errorMessage');
        
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
        }
        
        if (loadingCard) loadingCard.classList.add('hidden');
        if (resultsCard) resultsCard.classList.add('hidden');
        if (errorCard) errorCard.classList.remove('hidden');
        
        if (errorMessage) {
            errorMessage.textContent = message;
        }
    }

    hideResults() {
        const loadingCard = document.getElementById('loadingCard');
        const resultsCard = document.getElementById('resultsCard');
        const errorCard = document.getElementById('errorCard');
        
        if (loadingCard) loadingCard.classList.add('hidden');
        if (resultsCard) resultsCard.classList.add('hidden');
        if (errorCard) errorCard.classList.add('hidden');
    }

    resetForNewAnalysis() {
        this.clearImage();
        this.hideResults();
        
        // Scroll to top of upload section
        const uploadSection = document.querySelector('.upload-section');
        if (uploadSection) {
            uploadSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    saveAnalysisToHistory(result, promptType) {
        const historyItem = {
            id: Date.now(),
            timestamp: result.timestamp,
            imageName: this.currentImage.name,
            imageSize: this.currentImage.size,
            promptType: promptType,
            result: result,
            analysis: this.parseAIResponse(result.text)
        };
        
        this.analysisHistory.unshift(historyItem);
        
        // Keep only last 10 analyses
        if (this.analysisHistory.length > 10) {
            this.analysisHistory = this.analysisHistory.slice(0, 10);
        }
    }

    downloadResults() {
        if (!this.currentResult) {
            this.showError('No results to download.');
            return;
        }
        
        const result = this.currentResult;
        const analysis = result.analysis;
        
        // Create downloadable content
        const content = `
AI PNEUMONIA DETECTION REPORT
============================

Analysis Date: ${new Date(result.timestamp).toLocaleString()}
Image File: ${result.imageName}
Image Size: ${(result.imageSize / 1024).toFixed(1)} KB

DIAGNOSIS
---------
Result: ${analysis.hasPneumonia ? 'PNEUMONIA DETECTED' : 'NORMAL CHEST X-RAY'}
Confidence Level: ${analysis.confidence}%
Analysis Type: ${this.getPromptTypeLabel(result.promptType)}

AI ASSESSMENT
-------------
${result.text}

TECHNICAL DETAILS
-----------------
AI Model Temperature: ${result.temperature}
Tokens Used: ${result.tokensUsed}
Prompt Type: ${result.promptType}

DISCLAIMER
----------
This AI analysis is for educational purposes only and should not replace 
professional medical diagnosis. Always consult qualified healthcare 
professionals for medical decisions.

Generated by AI Pneumonia Detection System
`;
        
        // Create and download file
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pneumonia-analysis-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing app...');
    new PneumoniaDetectionApp();
});

// Also initialize if DOM is already loaded
if (document.readyState !== 'loading') {
    console.log('DOM already loaded, initializing app...');
    new PneumoniaDetectionApp();
}