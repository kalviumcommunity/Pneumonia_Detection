// Zero-Shot Prompting Implementation for Pneumonia Detection
class ZeroShotPneumoniaDetector {
    constructor() {
        this.apiKey = 'AIzaSyBKDFyflc-Chesroe1iUBmzwF4MRMxpFgU'; // Replace with your API key
        this.currentImage = null;
        
        // Zero-Shot Prompt - No examples provided, clear task description
        this.zeroShotPrompt = `
Analyze this chest X-ray image for signs of pneumonia.

TASK: You are a radiologist examining a chest X-ray. Determine if pneumonia is present based on your medical knowledge and training.

ANALYSIS REQUIREMENTS:
1. Systematically examine both lung fields
2. Look for abnormal opacity, consolidation, or infiltrates  
3. Assess for signs of inflammation or infection
4. Consider image quality and positioning
5. Evaluate pleural spaces and heart borders

RESPONSE FORMAT - Provide exactly this structure:
DIAGNOSIS: [Either "Pneumonia detected" or "No pneumonia detected"]
CONFIDENCE: [Number from 0-100]%
REASONING: [Detailed explanation of your findings and decision-making process]
KEY_FINDINGS: [List specific radiological observations that led to your diagnosis]
RECOMMENDATIONS: [Next steps or additional considerations]

MEDICAL DISCLAIMER: This analysis is for educational purposes only. Always consult qualified medical professionals for official diagnosis and treatment decisions.
        `;
        
        this.initializeZeroShotDetector();
    }

    initializeZeroShotDetector() {
        console.log('Initializing Zero-Shot Pneumonia Detector...');
        this.setupEventListeners();
    }

    setupEventListeners() {
        // File upload
        const fileInput = document.getElementById('zeroShotFileInput');
        const uploadBtn = document.getElementById('zeroShotUploadBtn');
        const analyzeBtn = document.getElementById('zeroShotAnalyzeBtn');
        const clearBtn = document.getElementById('zeroShotClearBtn');

        if (uploadBtn) {
            uploadBtn.addEventListener('click', () => {
                fileInput?.click();
            });
        }

        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                this.handleFileSelect(e);
            });
        }

        if (analyzeBtn) {
            analyzeBtn.addEventListener('click', () => {
                this.performZeroShotAnalysis();
            });
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearResults();
            });
        }
    }

    handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            alert('Please select a valid image file (JPEG, PNG, or WebP)');
            return;
        }

        // Validate file size (10MB limit)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            alert('File size must be less than 10MB');
            return;
        }

        this.currentImage = file;
        this.showImagePreview(file);
        this.enableAnalysis();
    }

    showImagePreview(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.getElementById('zeroShotImagePreview');
            const img = document.getElementById('zeroShotPreviewImg');
            const info = document.getElementById('zeroShotImageInfo');
            
            if (img) {
                img.src = e.target.result;
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
            }
            
            if (info) {
                info.innerHTML = `
                    <p><strong>File:</strong> ${file.name}</p>
                    <p><strong>Size:</strong> ${(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    <p><strong>Type:</strong> ${file.type}</p>
                `;
            }
            
            if (preview) {
                preview.classList.remove('hidden');
            }
        };
        reader.readAsDataURL(file);
    }

    enableAnalysis() {
        const analyzeBtn = document.getElementById('zeroShotAnalyzeBtn');
        if (analyzeBtn) {
            analyzeBtn.disabled = false;
        }
    }

    async performZeroShotAnalysis() {
        if (!this.currentImage) {
            alert('Please select an image first');
            return;
        }

        try {
            this.showLoading();
            
            // Convert image to base64
            const base64Image = await this.fileToBase64(this.currentImage);
            
            // Make API call with zero-shot prompt
            const startTime = Date.now();
            const result = await this.callGeminiAPI(base64Image);
            const endTime = Date.now();
            
            // Parse and display results
            const parsedResult = this.parseZeroShotResponse(result.text);
            parsedResult.processingTime = endTime - startTime;
            parsedResult.tokensUsed = result.tokensUsed;
            
            this.displayResults(parsedResult);
            
            console.log('Zero-Shot Analysis Complete:', parsedResult);
            
        } catch (error) {
            console.error('Zero-shot analysis failed:', error);
            this.showError(error.message);
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

    async callGeminiAPI(base64Image) {
        console.log('Making Zero-Shot API call to Gemini...');
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        {
                            text: this.zeroShotPrompt
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
                    temperature: 0.3, // Low temperature for medical consistency
                    topK: 40,
                    topP: 0.9,
                    maxOutputTokens: 1200,
                }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API call failed: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            throw new Error('Invalid response from API');
        }

        return {
            text: data.candidates[0].content.parts[0].text,
            tokensUsed: data.usageMetadata?.totalTokenCount || 0
        };
    }

    parseZeroShotResponse(responseText) {
        // Extract structured information from the zero-shot response
        const diagnosis = this.extractField(responseText, 'DIAGNOSIS');
        const confidence = this.extractField(responseText, 'CONFIDENCE');
        const reasoning = this.extractField(responseText, 'REASONING');
        const keyFindings = this.extractField(responseText, 'KEY_FINDINGS');
        const recommendations = this.extractField(responseText, 'RECOMMENDATIONS');
        
        return {
            method: 'Zero-Shot Prompting',
            diagnosis: diagnosis || 'Unable to determine',
            confidence: this.parseConfidence(confidence),
            reasoning: reasoning || 'No reasoning provided',
            keyFindings: keyFindings || 'No specific findings extracted',
            recommendations: recommendations || 'Consult healthcare professional',
            fullResponse: responseText,
            timestamp: new Date().toISOString()
        };
    }

    extractField(text, fieldName) {
        const regex = new RegExp(`${fieldName}:\\s*(.*?)(?=\\n[A-Z_]+:|$)`, 'is');
        const match = text.match(regex);
        return match ? match[1].trim() : null;
    }

    parseConfidence(confidenceText) {
        if (!confidenceText) return 0;
        const match = confidenceText.match(/(\d+)/);
        return match ? parseInt(match[1]) : 0;
    }

    displayResults(result) {
        this.hideLoading();
        
        const resultsSection = document.getElementById('zeroShotResults');
        const resultsContent = document.getElementById('zeroShotResultsContent');
        
        if (!resultsSection || !resultsContent) return;
        
        // Determine diagnosis status for styling
        const hasPneumonia = result.diagnosis.toLowerCase().includes('pneumonia detected');
        const statusClass = hasPneumonia ? 'pneumonia-detected' : 'normal';
        
        resultsContent.innerHTML = `
            <div class="zero-shot-result ${statusClass}">
                <div class="result-header">
                    <h3>Zero-Shot Analysis Results</h3>
                    <span class="analysis-method">${result.method}</span>
                </div>
                
                <div class="diagnosis-section">
                    <h4>Primary Diagnosis</h4>
                    <div class="diagnosis-result">
                        <span class="diagnosis-text">${result.diagnosis}</span>
                        <span class="confidence-score">${result.confidence}% confidence</span>
                    </div>
                </div>
                
                <div class="findings-section">
                    <h4>Clinical Reasoning</h4>
                    <p class="reasoning-text">${result.reasoning}</p>
                </div>
                
                <div class="key-findings-section">
                    <h4>Key Radiological Findings</h4>
                    <p class="findings-text">${result.keyFindings}</p>
                </div>
                
                <div class="recommendations-section">
                    <h4>Recommendations</h4>
                    <p class="recommendations-text">${result.recommendations}</p>
                </div>
                
                <div class="technical-details">
                    <h4>Technical Details</h4>
                    <ul>
                        <li><strong>Analysis Method:</strong> Zero-Shot Prompting</li>
                        <li><strong>Processing Time:</strong> ${result.processingTime}ms</li>
                        <li><strong>Tokens Used:</strong> ${result.tokensUsed}</li>
                        <li><strong>Timestamp:</strong> ${new Date(result.timestamp).toLocaleString()}</li>
                    </ul>
                </div>
                
                <div class="medical-disclaimer">
                    <p><strong>⚠️ Medical Disclaimer:</strong> This zero-shot AI analysis is for educational purposes only. The model generates responses based on its training data without specific examples. Always consult qualified healthcare professionals for medical diagnosis and treatment decisions.</p>
                </div>
            </div>
        `;
        
        resultsSection.classList.remove('hidden');
        
        // Log token usage to console as requested
        console.log(`🔢 Tokens Used in Zero-Shot Analysis: ${result.tokensUsed}`);
    }

    showLoading() {
        const loadingSection = document.getElementById('zeroShotLoading');
        const resultsSection = document.getElementById('zeroShotResults');
        
        if (loadingSection) loadingSection.classList.remove('hidden');
        if (resultsSection) resultsSection.classList.add('hidden');
    }

    hideLoading() {
        const loadingSection = document.getElementById('zeroShotLoading');
        if (loadingSection) loadingSection.classList.add('hidden');
    }

    showError(message) {
        this.hideLoading();
        alert(`Zero-Shot Analysis Error: ${message}`);
    }

    clearResults() {
        this.currentImage = null;
        
        // Clear file input
        const fileInput = document.getElementById('zeroShotFileInput');
        if (fileInput) fileInput.value = '';
        
        // Hide preview and results
        const preview = document.getElementById('zeroShotImagePreview');
        const results = document.getElementById('zeroShotResults');
        const loading = document.getElementById('zeroShotLoading');
        
        if (preview) preview.classList.add('hidden');
        if (results) results.classList.add('hidden');
        if (loading) loading.classList.add('hidden');
        
        // Disable analyze button
        const analyzeBtn = document.getElementById('zeroShotAnalyzeBtn');
        if (analyzeBtn) analyzeBtn.disabled = true;
    }
}

// Initialize the Zero-Shot Detector when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Zero-Shot Pneumonia Detection System...');
    new ZeroShotPneumoniaDetector();
});

// Also initialize if DOM is already loaded
if (document.readyState !== 'loading') {
    console.log('DOM already loaded, initializing Zero-Shot system...');
    new ZeroShotPneumoniaDetector();
}
