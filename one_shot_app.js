// One-Shot Prompting Implementation for Pneumonia Detection
class OneShotPneumoniaDetector {
    constructor() {
        this.apiKey = 'AIzaSyBKDFyflc-Chesroe1iUBmzwF4MRMxpFgU'; // Replace with your API key
        this.currentImage = null;
        
        // One-Shot Prompt - Provides exactly ONE example to guide the AI
        this.oneShotPrompt = `
You are an expert radiologist specializing in chest X-ray interpretation and pneumonia detection.

TRAINING EXAMPLE - Study this comprehensive analysis approach:

=== EXAMPLE CASE ===
Patient: 52-year-old with cough, fever, and shortness of breath
X-ray Type: Posteroanterior chest radiograph

SYSTEMATIC RADIOLOGICAL ANALYSIS:

TECHNICAL ASSESSMENT:
- Image Quality: Good - adequate penetration and positioning
- Patient Position: Upright PA view, no rotation detected
- Inspiration: Adequate - ribs clearly visible

SYSTEMATIC EXAMINATION:

HEART & MEDIASTINUM:
- Heart size: Normal (cardiothoracic ratio <0.5)
- Heart borders: Clear and well-defined
- Mediastinal contours: Normal

BILATERAL LUNG FIELD ANALYSIS:
Right Lung:
- Upper lobe: Clear, normal vascular markings
- Middle lobe: No consolidation or infiltrates
- Lower lobe: Area of increased opacity in lateral segment with air bronchograms visible

Left Lung:
- Upper lobe: Clear lung fields, normal vascular pattern
- Lower lobe: Normal appearance, no abnormalities

PLEURAL SPACES:
- Right pleura: No effusion, sharp costophrenic angle
- Left pleura: No effusion, sharp costophrenic angle
- No pneumothorax detected

RADIOLOGICAL FINDINGS:
Primary Finding: Focal consolidation in right lower lobe lateral segment
Secondary Findings: Air bronchograms within the consolidation area
Additional Notes: No cavitation, no hilar lymphadenopathy

CLINICAL INTERPRETATION:
DIAGNOSIS: Pneumonia detected - Right lower lobe pneumonia
CONFIDENCE: 92%
SEVERITY: Moderate - localized to single lobe segment
PATTERN: Lobar pneumonia, consistent with bacterial etiology

CLINICAL REASONING:
The presence of focal consolidation with visible air bronchograms in the right lower lobe is characteristic of bacterial pneumonia. The sharp demarcation and lobar distribution pattern support this diagnosis. The consolidation shows homogeneous opacity typical of inflammatory exudate filling the alveolar spaces while maintaining patent bronchi (air bronchograms).

KEY SUPPORTING EVIDENCE:
- Well-defined consolidation boundaries
- Air bronchograms indicating patent airways
- Lobar distribution pattern
- No pleural effusion (uncomplicated pneumonia)

CLINICAL RECOMMENDATIONS:
- Correlate with clinical symptoms and laboratory findings (CBC, inflammatory markers)
- Consider sputum culture if clinically appropriate
- Initiate antibiotic therapy per clinical guidelines
- Follow-up chest X-ray in 4-6 weeks to ensure resolution
- Consider CT chest if symptoms persist or worsen

MEDICAL DISCLAIMER: Clinical correlation required. Consider patient history, physical examination, and laboratory findings for comprehensive diagnosis.

=== END OF EXAMPLE ===

Now analyze this new chest X-ray image using the EXACT SAME systematic approach, format, and level of professional detail demonstrated in the example above:
        `;
        
        this.initializeOneShotDetector();
    }

    initializeOneShotDetector() {
        console.log('Initializing One-Shot Pneumonia Detector...');
        this.setupEventListeners();
    }

    setupEventListeners() {
        // File upload elements
        const fileInput = document.getElementById('oneShotFileInput');
        const uploadBtn = document.getElementById('oneShotUploadBtn');
        const analyzeBtn = document.getElementById('oneShotAnalyzeBtn');
        const clearBtn = document.getElementById('oneShotClearBtn');

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
                this.performOneShotAnalysis();
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
            const preview = document.getElementById('oneShotImagePreview');
            const img = document.getElementById('oneShotPreviewImg');
            const info = document.getElementById('oneShotImageInfo');
            
            if (img) {
                img.src = e.target.result;
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
            }
            
            if (info) {
                info.innerHTML = `
                    <div class="image-details">
                        <p><strong>📁 File:</strong> ${file.name}</p>
                        <p><strong>📊 Size:</strong> ${(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        <p><strong>🖼️ Type:</strong> ${file.type}</p>
                        <p><strong>🎯 Analysis:</strong> One-Shot Learning (1 Example Provided)</p>
                    </div>
                `;
            }
            
            if (preview) {
                preview.classList.remove('hidden');
            }
        };
        reader.readAsDataURL(file);
    }

    enableAnalysis() {
        const analyzeBtn = document.getElementById('oneShotAnalyzeBtn');
        if (analyzeBtn) {
            analyzeBtn.disabled = false;
        }
    }

    async performOneShotAnalysis() {
        if (!this.currentImage) {
            alert('Please select an image first');
            return;
        }

        try {
            this.showLoading();
            
            // Convert image to base64
            const base64Image = await this.fileToBase64(this.currentImage);
            
            // Make API call with one-shot prompt
            const startTime = Date.now();
            const result = await this.callGeminiAPI(base64Image);
            const endTime = Date.now();
            
            // Parse and display results
            const parsedResult = this.parseOneShotResponse(result.text);
            parsedResult.processingTime = endTime - startTime;
            parsedResult.tokensUsed = result.tokensUsed;
            
            // Analyze how well the response follows the example
            parsedResult.exampleAdherence = this.analyzeExampleInfluence(result.text);
            
            this.displayResults(parsedResult);
            
            console.log('One-Shot Analysis Complete:', parsedResult);
            
        } catch (error) {
            console.error('One-shot analysis failed:', error);
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
        console.log('Making One-Shot API call to Gemini...');
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        {
                            text: this.oneShotPrompt
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
                    temperature: 0.2, // Lower temperature for consistency with example
                    topK: 40,
                    topP: 0.8,
                    maxOutputTokens: 2000, // Increased for detailed one-shot responses
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

    parseOneShotResponse(responseText) {
        // Extract structured information from the one-shot response
        const diagnosis = this.extractField(responseText, 'DIAGNOSIS');
        const confidence = this.extractField(responseText, 'CONFIDENCE');
        const severity = this.extractField(responseText, 'SEVERITY');
        const reasoning = this.extractField(responseText, 'CLINICAL REASONING');
        const findings = this.extractField(responseText, 'RADIOLOGICAL FINDINGS');
        const recommendations = this.extractField(responseText, 'CLINICAL RECOMMENDATIONS');
        
        return {
            method: 'One-Shot Prompting',
            diagnosis: diagnosis || 'Unable to determine',
            confidence: this.parseConfidence(confidence),
            severity: severity || 'Not specified',
            clinicalReasoning: reasoning || 'No reasoning provided',
            radiologicalFindings: findings || 'No specific findings extracted',
            recommendations: recommendations || 'Consult healthcare professional',
            fullResponse: responseText,
            timestamp: new Date().toISOString()
        };
    }

    extractField(text, fieldName) {
        // More sophisticated extraction for medical fields
        const patterns = [
            new RegExp(`${fieldName}:\\s*(.*?)(?=\\n[A-Z][A-Z\\s]+:|$)`, 'is'),
            new RegExp(`${fieldName}\\s*-\\s*(.*?)(?=\\n[A-Z][A-Z\\s]+:|$)`, 'is'),
            new RegExp(`${fieldName}\\s*(.*?)(?=\\n\\n|$)`, 'is')
        ];
        
        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match) {
                return match[1].trim();
            }
        }
        return null;
    }

    parseConfidence(confidenceText) {
        if (!confidenceText) return 0;
        const match = confidenceText.match(/(\d+)/);
        return match ? parseInt(match[1]) : 0;
    }

    analyzeExampleInfluence(responseText) {
        // Analyze how closely the response follows the provided example
        const exampleStructure = [
            'TECHNICAL ASSESSMENT', 'SYSTEMATIC EXAMINATION', 
            'HEART', 'BILATERAL LUNG', 'PLEURAL SPACES', 
            'RADIOLOGICAL FINDINGS', 'CLINICAL INTERPRETATION',
            'CLINICAL REASONING', 'KEY SUPPORTING EVIDENCE',
            'CLINICAL RECOMMENDATIONS'
        ];
        
        let structureMatches = 0;
        const foundStructures = [];
        
        exampleStructure.forEach(section => {
            if (responseText.includes(section)) {
                structureMatches++;
                foundStructures.push(section);
            }
        });
        
        // Check for medical terminology usage
        const medicalTerms = [
            'consolidation', 'air bronchograms', 'opacity', 'infiltrates',
            'pleural effusion', 'costophrenic', 'bilateral', 'lobar',
            'vascular markings', 'mediastinal', 'cardiothoracic ratio'
        ];
        
        let termCount = 0;
        medicalTerms.forEach(term => {
            if (responseText.toLowerCase().includes(term)) termCount++;
        });
        
        return {
            structureAdherence: Math.round((structureMatches / exampleStructure.length) * 100),
            foundStructures: foundStructures,
            medicalTerminologyUsage: Math.round((termCount / medicalTerms.length) * 100),
            professionalFormat: responseText.includes('DIAGNOSIS:') && responseText.includes('CONFIDENCE:'),
            systematicApproach: responseText.includes('SYSTEMATIC') || responseText.includes('BILATERAL'),
            comprehensiveAnalysis: responseText.length > 500 // Indicates detailed analysis
        };
    }

    displayResults(result) {
        this.hideLoading();
        
        const resultsSection = document.getElementById('oneShotResults');
        const resultsContent = document.getElementById('oneShotResultsContent');
        
        if (!resultsSection || !resultsContent) return;
        
        // Determine diagnosis status for styling
        const hasPneumonia = result.diagnosis.toLowerCase().includes('pneumonia detected');
        const statusClass = hasPneumonia ? 'pneumonia-detected' : 'normal';
        
        resultsContent.innerHTML = `
            <div class="one-shot-result ${statusClass}">
                <div class="result-header">
                    <h3>One-Shot Analysis Results</h3>
                    <span class="analysis-method">${result.method}</span>
                </div>
                
                <div class="diagnosis-section">
                    <h4>Primary Diagnosis</h4>
                    <div class="diagnosis-result">
                        <span class="diagnosis-text">${result.diagnosis}</span>
                        <span class="confidence-score">${result.confidence}% confidence</span>
                    </div>
                    ${result.severity !== 'Not specified' ? `<p class="severity"><strong>Severity:</strong> ${result.severity}</p>` : ''}
                </div>
                
                <div class="findings-section">
                    <h4>Radiological Findings</h4>
                    <div class="findings-text">${this.formatText(result.radiologicalFindings)}</div>
                </div>
                
                <div class="reasoning-section">
                    <h4>Clinical Reasoning</h4>
                    <div class="reasoning-text">${this.formatText(result.clinicalReasoning)}</div>
                </div>
                
                <div class="recommendations-section">
                    <h4>Clinical Recommendations</h4>
                    <div class="recommendations-text">${this.formatText(result.recommendations)}</div>
                </div>
                
                <div class="example-adherence-section">
                    <h4>Example Learning Analysis</h4>
                    <div class="adherence-metrics">
                        <div class="metric">
                            <span class="metric-label">Structure Adherence:</span>
                            <span class="metric-value">${result.exampleAdherence.structureAdherence}%</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">Medical Terminology:</span>
                            <span class="metric-value">${result.exampleAdherence.medicalTerminologyUsage}%</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">Professional Format:</span>
                            <span class="metric-value">${result.exampleAdherence.professionalFormat ? '✅ Yes' : '❌ No'}</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">Systematic Approach:</span>
                            <span class="metric-value">${result.exampleAdherence.systematicApproach ? '✅ Yes' : '❌ No'}</span>
                        </div>
                    </div>
                    <p class="adherence-explanation">
                        The AI followed ${result.exampleAdherence.structureAdherence}% of the example's structure, 
                        demonstrating how one-shot learning guides response format and medical reasoning.
                    </p>
                </div>
                
                <div class="technical-details">
                    <h4>Technical Details</h4>
                    <ul>
                        <li><strong>Analysis Method:</strong> One-Shot Prompting (1 example provided)</li>
                        <li><strong>Processing Time:</strong> ${result.processingTime}ms</li>
                        <li><strong>Tokens Used:</strong> ${result.tokensUsed}</li>
                        <li><strong>Example Structures Found:</strong> ${result.exampleAdherence.foundStructures.length}/10</li>
                        <li><strong>Temperature:</strong> 0.2 (low for consistency)</li>
                        <li><strong>Timestamp:</strong> ${new Date(result.timestamp).toLocaleString()}</li>
                    </ul>
                </div>
                
                <div class="medical-disclaimer">
                    <p><strong>⚠️ Medical Disclaimer:</strong> This one-shot AI analysis demonstrates learning from a single medical example. The AI adapts the example's approach to new cases but requires clinical correlation. Always consult qualified healthcare professionals for medical diagnosis and treatment decisions.</p>
                </div>
            </div>
        `;
        
        resultsSection.classList.remove('hidden');
        
        // Log detailed token usage to console
        console.log(`🔢 One-Shot Analysis Tokens: ${result.tokensUsed}`);
        console.log(`📊 Example Learning Metrics:`, result.exampleAdherence);
    }

    formatText(text) {
        if (!text || text === 'No reasoning provided' || text === 'No specific findings extracted') {
            return `<p class="no-content">${text}</p>`;
        }
        
        // Format the text for better readability
        return text
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/(\d+\.)/g, '<br><strong>$1</strong>')
            .replace(/^- /gm, '<br>• ');
    }

    showLoading() {
        const loadingSection = document.getElementById('oneShotLoading');
        const resultsSection = document.getElementById('oneShotResults');
        
        if (loadingSection) loadingSection.classList.remove('hidden');
        if (resultsSection) resultsSection.classList.add('hidden');
    }

    hideLoading() {
        const loadingSection = document.getElementById('oneShotLoading');
        if (loadingSection) loadingSection.classList.add('hidden');
    }

    showError(message) {
        this.hideLoading();
        alert(`One-Shot Analysis Error: ${message}`);
    }

    clearResults() {
        this.currentImage = null;
        
        // Clear file input
        const fileInput = document.getElementById('oneShotFileInput');
        if (fileInput) fileInput.value = '';
        
        // Hide preview and results
        const preview = document.getElementById('oneShotImagePreview');
        const results = document.getElementById('oneShotResults');
        const loading = document.getElementById('oneShotLoading');
        
        if (preview) preview.classList.add('hidden');
        if (results) results.classList.add('hidden');
        if (loading) loading.classList.add('hidden');
        
        // Disable analyze button
        const analyzeBtn = document.getElementById('oneShotAnalyzeBtn');
        if (analyzeBtn) analyzeBtn.disabled = true;
    }
}

// Initialize the One-Shot Detector when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing One-Shot Pneumonia Detection System...');
    new OneShotPneumoniaDetector();
});

// Also initialize if DOM is already loaded
if (document.readyState !== 'loading') {
    console.log('DOM already loaded, initializing One-Shot system...');
    new OneShotPneumoniaDetector();
}
