// Multi-Shot (Few-Shot) Prompting Implementation for Pneumonia Detection
class MultiShotPneumoniaDetector {
    constructor() {
        this.apiKey = 'AIzaSyBKDFyflc-Chesroe1iUBmzwF4MRMxpFgU'; // Replace with your API key
        this.currentImage = null;
        
        // Multi-Shot Prompt - Provides MULTIPLE diverse examples to guide the AI
        this.multiShotPrompt = `
You are an expert radiologist specializing in chest X-ray interpretation and pneumonia detection.

Study these FOUR diverse training examples to understand the full spectrum of pneumonia presentation and develop comprehensive pattern recognition:

=== TRAINING EXAMPLE 1: NORMAL CASE ===
Patient: 28-year-old healthy adult, routine health screening
Clinical History: Asymptomatic, no respiratory complaints, annual check-up

SYSTEMATIC RADIOLOGICAL ANALYSIS:
Technical Assessment: Good quality PA chest X-ray, adequate inspiration (10 ribs visible)
Patient Positioning: Upright, no rotation, symmetric clavicles

BILATERAL LUNG FIELD EXAMINATION:
Right Lung:
- Upper lobe: Clear, normal bronchovascular markings
- Middle lobe: Normal appearance, no infiltrates
- Lower lobe: Clear lung fields, sharp costophrenic angle

Left Lung:
- Upper lobe: Clear with normal vascular pattern
- Lower lobe: Normal appearance, no abnormalities

CARDIAC & MEDIASTINAL ASSESSMENT:
- Heart size: Normal (cardiothoracic ratio <0.5)
- Heart borders: Clear and well-defined
- Mediastinal contours: Normal, no widening

PLEURAL EXAMINATION:
- Bilateral pleural spaces clear
- Sharp costophrenic angles bilaterally
- No pneumothorax or effusion

FINAL INTERPRETATION:
Primary Diagnosis: No pneumonia detected
Confidence: 95%
Pattern Type: Normal chest radiograph
Clinical Reasoning: Completely normal chest X-ray with clear bilateral lung fields, normal cardiac silhouette, and no evidence of acute or chronic pathology.
Recommendations: Routine follow-up as clinically indicated

=== TRAINING EXAMPLE 2: BACTERIAL PNEUMONIA ===
Patient: 65-year-old with acute onset high fever (102.5°F), productive cough with yellow sputum
Clinical History: 3-day rapid onset, rigors, pleuritic chest pain, elevated WBC count

SYSTEMATIC RADIOLOGICAL ANALYSIS:
Technical Assessment: Adequate PA view, slight under-inspiration
Patient Positioning: Upright, minimal rotation

BILATERAL LUNG FIELD EXAMINATION:
Right Lung:
- Upper lobe: Dense homogeneous consolidation involving entire lobe
- Middle lobe: Consolidation with clearly visible air bronchograms
- Lower lobe: Normal appearance

Left Lung:
- Upper lobe: Clear with normal vascular markings
- Lower lobe: Normal appearance, no infiltrates

CARDIAC & MEDIASTINAL ASSESSMENT:
- Heart size: Normal size and contours
- Borders: Partially obscured by right-sided consolidation

PLEURAL EXAMINATION:
- No pleural effusion detected
- Sharp left costophrenic angle
- Right costophrenic angle visible

ADDITIONAL FINDINGS:
- Well-defined consolidation boundaries (lobar pattern)
- Multiple air bronchograms throughout consolidation
- No cavitation or abscess formation

FINAL INTERPRETATION:
Primary Diagnosis: Pneumonia detected - Bacterial pneumonia, right upper and middle lobes
Confidence: 93%
Pattern Type: Lobar consolidation with air bronchograms (classic bacterial)
Clinical Reasoning: Dense homogeneous consolidation with air bronchograms in a lobar distribution is characteristic of bacterial pneumonia. The acute presentation and dense opacity strongly suggest bacterial etiology.
Recommendations: Blood cultures, sputum culture, immediate antibiotic therapy, follow-up X-ray in 48-72 hours

=== TRAINING EXAMPLE 3: VIRAL PNEUMONIA ===
Patient: 42-year-old with gradual onset dry cough, low-grade fever (100.2°F)
Clinical History: 7-day progressive symptoms, fatigue, minimal clear sputum, normal WBC

SYSTEMATIC RADIOLOGICAL ANALYSIS:
Technical Assessment: Good quality study, proper positioning
Patient Positioning: Upright PA view, no rotation

BILATERAL LUNG FIELD EXAMINATION:
Right Lung:
- Upper lobe: Patchy infiltrates in peripheral distribution
- Middle lobe: Minimal involvement
- Lower lobe: Prominent interstitial markings, patchy opacities

Left Lung:
- Upper lobe: Subtle perihilar infiltrates
- Lower lobe: Bilateral patchy infiltrates, reticular pattern

CARDIAC & MEDIASTINAL ASSESSMENT:
- Heart size: Normal size and position
- Borders: Clear, no obscuration

PLEURAL EXAMINATION:
- No pleural effusion
- Clear costophrenic angles bilaterally

ADDITIONAL FINDINGS:
- Bilateral symmetric involvement
- Interstitial pattern with reticular opacities
- Perihilar distribution of infiltrates
- No air bronchograms visible

FINAL INTERPRETATION:
Primary Diagnosis: Pneumonia detected - Viral pneumonia, bilateral lower lobes
Confidence: 87%
Pattern Type: Bilateral interstitial infiltrates (typical viral pattern)
Clinical Reasoning: Bilateral patchy infiltrates with interstitial pattern and perihilar distribution, combined with gradual onset and normal WBC, are consistent with viral pneumonia.
Recommendations: Supportive care, viral PCR testing if available, follow-up in 5-7 days

=== TRAINING EXAMPLE 4: SUBTLE/EARLY PNEUMONIA ===
Patient: 55-year-old immunocompromised (diabetes mellitus), mild productive cough
Clinical History: Recent onset subtle symptoms, afebrile initially, on metformin

SYSTEMATIC RADIOLOGICAL ANALYSIS:
Technical Assessment: Good quality study, adequate inspiration
Patient Positioning: Upright PA view, proper alignment

BILATERAL LUNG FIELD EXAMINATION:
Right Lung:
- Upper lobe: Clear, normal markings
- Middle lobe: Normal appearance
- Lower lobe: Normal lung fields

Left Lung:
- Upper lobe: Normal vascular pattern
- Lower lobe: Subtle increased opacity in posterior segment, ill-defined borders

CARDIAC & MEDIASTINAL ASSESSMENT:
- Heart size: Mildly enlarged (stable from prior studies)
- Borders: Clear definition maintained

PLEURAL EXAMINATION:
- No pleural effusion detected
- Costophrenic angles sharp bilaterally

ADDITIONAL FINDINGS:
- Very subtle left lower lobe opacity
- No definite air bronchograms
- Questionable increased density compared to right side
- Requires careful clinical correlation

FINAL INTERPRETATION:
Primary Diagnosis: Pneumonia detected - Early/subtle pneumonia, left lower lobe
Confidence: 78%
Pattern Type: Subtle opacity in immunocompromised patient
Clinical Reasoning: Subtle increased opacity in left lower lobe in an immunocompromised patient warrants concern for early pneumonia. The ill-defined borders and clinical context support this diagnosis despite minimal radiographic changes.
Recommendations: Clinical correlation essential, consider CT chest, close follow-up, low threshold for antibiotic therapy in immunocompromised patient

=== END OF TRAINING EXAMPLES ===

Now analyze this new chest X-ray using the comprehensive pattern recognition and systematic diagnostic approach demonstrated in these four diverse examples. Consider which patterns most closely match your findings and provide appropriate confidence based on the complexity of the case:
        `;
        
        // Training examples for pattern matching analysis
        this.trainingExamples = [
            {
                id: 1,
                type: 'normal',
                patient: '28-year-old healthy adult',
                diagnosis: 'No pneumonia detected',
                confidence: 95,
                keyPatterns: ['clear', 'normal', 'no consolidation', 'no pneumonia', 'bilateral clear'],
                clinicalContext: 'routine screening'
            },
            {
                id: 2,
                type: 'bacterial',
                patient: '65-year-old with acute symptoms',
                diagnosis: 'Bacterial pneumonia, right upper/middle lobes',
                confidence: 93,
                keyPatterns: ['consolidation', 'air bronchograms', 'lobar', 'dense', 'homogeneous'],
                clinicalContext: 'acute onset, high fever'
            },
            {
                id: 3,
                type: 'viral',
                patient: '42-year-old with gradual onset',
                diagnosis: 'Viral pneumonia, bilateral lower lobes',
                confidence: 87,
                keyPatterns: ['bilateral', 'interstitial', 'patchy', 'infiltrates', 'perihilar'],
                clinicalContext: 'gradual onset, low-grade fever'
            },
            {
                id: 4,
                type: 'subtle',
                patient: '55-year-old immunocompromised',
                diagnosis: 'Early pneumonia, left lower lobe',
                confidence: 78,
                keyPatterns: ['subtle', 'mild', 'early', 'immunocompromised', 'ill-defined'],
                clinicalContext: 'immunocompromised, minimal symptoms'
            }
        ];
        
        this.initializeMultiShotDetector();
    }

    initializeMultiShotDetector() {
        console.log('Initializing Multi-Shot Pneumonia Detector...');
        this.setupEventListeners();
    }

    setupEventListeners() {
        // File upload elements
        const fileInput = document.getElementById('multiShotFileInput');
        const uploadBtn = document.getElementById('multiShotUploadBtn');
        const analyzeBtn = document.getElementById('multiShotAnalyzeBtn');
        const clearBtn = document.getElementById('multiShotClearBtn');

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
                this.performMultiShotAnalysis();
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
            const preview = document.getElementById('multiShotImagePreview');
            const img = document.getElementById('multiShotPreviewImg');
            const info = document.getElementById('multiShotImageInfo');
            
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
                        <p><strong>🎯 Analysis:</strong> Multi-Shot Learning (4 Examples Provided)</p>
                        <p><strong>📚 Training Cases:</strong> Normal, Bacterial, Viral, Subtle Pneumonia</p>
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
        const analyzeBtn = document.getElementById('multiShotAnalyzeBtn');
        if (analyzeBtn) {
            analyzeBtn.disabled = false;
        }
    }

    async performMultiShotAnalysis() {
        if (!this.currentImage) {
            alert('Please select an image first');
            return;
        }

        try {
            this.showLoading();
            
            // Convert image to base64
            const base64Image = await this.fileToBase64(this.currentImage);
            
            // Make API call with multi-shot prompt
            const startTime = Date.now();
            const result = await this.callGeminiAPI(base64Image);
            const endTime = Date.now();
            
            // Parse and display results
            const parsedResult = this.parseMultiShotResponse(result.text);
            parsedResult.processingTime = endTime - startTime;
            parsedResult.tokensUsed = result.tokensUsed;
            
            // Analyze pattern matching with training examples
            parsedResult.patternAnalysis = this.analyzePatternInfluence(result.text);
            
            this.displayResults(parsedResult);
            
            console.log('Multi-Shot Analysis Complete:', parsedResult);
            
        } catch (error) {
            console.error('Multi-shot analysis failed:', error);
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
        console.log('Making Multi-Shot API call to Gemini...');
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        {
                            text: this.multiShotPrompt
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
                    temperature: 0.3, // Balanced for nuanced multi-pattern responses
                    topK: 40,
                    topP: 0.9,
                    maxOutputTokens: 2500, // Increased for comprehensive multi-shot responses
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

    parseMultiShotResponse(responseText) {
        // Extract structured information from the multi-shot response
        const diagnosis = this.extractField(responseText, 'Primary Diagnosis') || this.extractField(responseText, 'DIAGNOSIS');
        const confidence = this.extractField(responseText, 'Confidence') || this.extractField(responseText, 'CONFIDENCE');
        const patternType = this.extractField(responseText, 'Pattern Type') || this.extractField(responseText, 'PATTERN');
        const reasoning = this.extractField(responseText, 'Clinical Reasoning') || this.extractField(responseText, 'REASONING');
        const recommendations = this.extractField(responseText, 'Recommendations') || this.extractField(responseText, 'RECOMMENDATIONS');
        
        return {
            method: 'Multi-Shot Prompting',
            diagnosis: diagnosis || 'Unable to determine',
            confidence: this.parseConfidence(confidence),
            patternType: patternType || 'Not specified',
            clinicalReasoning: reasoning || 'No reasoning provided',
            recommendations: recommendations || 'Consult healthcare professional',
            fullResponse: responseText,
            timestamp: new Date().toISOString()
        };
    }

    extractField(text, fieldName) {
        // Enhanced extraction for medical fields with multiple possible formats
        const patterns = [
            new RegExp(`${fieldName}:\\s*(.*?)(?=\\n[A-Z][A-Z\\s]*:|\\n\\n|$)`, 'is'),
            new RegExp(`${fieldName}\\s*-\\s*(.*?)(?=\\n[A-Z][A-Z\\s]*:|\\n\\n|$)`, 'is'),
            new RegExp(`${fieldName}\\s*(.*?)(?=\\n\\n|$)`, 'is')
        ];
        
        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match && match[1].trim()) {
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

    analyzePatternInfluence(responseText) {
        // Analyze which training patterns influenced the diagnosis
        const patternScores = {};
        let totalMatches = 0;
        
        this.trainingExamples.forEach(example => {
            let score = 0;
            example.keyPatterns.forEach(pattern => {
                if (responseText.toLowerCase().includes(pattern)) {
                    score++;
                    totalMatches++;
                }
            });
            patternScores[example.type] = {
                rawScore: score,
                percentage: Math.round((score / example.keyPatterns.length) * 100),
                example: example
            };
        });
        
        // Determine most influential pattern
        const mostInfluential = Object.keys(patternScores).reduce((a, b) => 
            patternScores[a].rawScore > patternScores[b].rawScore ? a : b
        );
        
        // Assess confidence appropriateness
        const confidence = this.parseConfidence(responseText);
        const confidenceAlignment = this.assessConfidenceAlignment(mostInfluential, confidence, responseText);
        
        return {
            patternScores: patternScores,
            mostInfluentialPattern: mostInfluential,
            totalPatternMatches: totalMatches,
            confidenceAlignment: confidenceAlignment,
            diversityIndex: this.calculateDiversityIndex(patternScores),
            synthesisQuality: this.assessSynthesisQuality(responseText)
        };
    }

    assessConfidenceAlignment(pattern, confidence, responseText) {
        // Expected confidence ranges based on pattern type
        const expectedRanges = {
            normal: [90, 98],
            bacterial: [85, 95],
            viral: [75, 90],
            subtle: [65, 80]
        };
        
        const expectedRange = expectedRanges[pattern] || [70, 90];
        const isAppropriate = confidence >= expectedRange[0] && confidence <= expectedRange[1];
        
        return {
            pattern: pattern,
            confidence: confidence,
            expectedRange: expectedRange,
            isAppropriate: isAppropriate,
            reasoning: this.getConfidenceReasoningAssessment(pattern, confidence, isAppropriate)
        };
    }

    getConfidenceReasoningAssessment(pattern, confidence, isAppropriate) {
        if (isAppropriate) {
            return `Confidence appropriately calibrated for ${pattern} pattern presentation`;
        } else {
            return `Confidence may be ${confidence > 85 ? 'too high' : 'too low'} for ${pattern} pattern`;
        }
    }

    calculateDiversityIndex(patternScores) {
        // Measure how many different patterns contributed to the analysis
        const contributingPatterns = Object.values(patternScores).filter(score => score.rawScore > 0).length;
        return (contributingPatterns / this.trainingExamples.length) * 100;
    }

    assessSynthesisQuality(responseText) {
        // Assess how well the AI synthesized multiple training examples
        const qualityIndicators = [
            'systematic', 'bilateral', 'clinical correlation', 'differential',
            'compared to', 'similar to', 'consistent with', 'pattern'
        ];
        
        let synthesisScore = 0;
        qualityIndicators.forEach(indicator => {
            if (responseText.toLowerCase().includes(indicator)) synthesisScore++;
        });
        
        return {
            score: Math.round((synthesisScore / qualityIndicators.length) * 100),
            indicators: synthesisScore,
            quality: synthesisScore >= 6 ? 'Excellent' : synthesisScore >= 4 ? 'Good' : synthesisScore >= 2 ? 'Fair' : 'Poor'
        };
    }

    displayResults(result) {
        this.hideLoading();
        
        const resultsSection = document.getElementById('multiShotResults');
        const resultsContent = document.getElementById('multiShotResultsContent');
        
        if (!resultsSection || !resultsContent) return;
        
        // Determine diagnosis status for styling
        const hasPneumonia = result.diagnosis.toLowerCase().includes('pneumonia detected');
        const statusClass = hasPneumonia ? 'pneumonia-detected' : 'normal';
        
        resultsContent.innerHTML = `
            <div class="multi-shot-result ${statusClass}">
                <div class="result-header">
                    <h3>Multi-Shot Analysis Results</h3>
                    <span class="analysis-method">${result.method}</span>
                </div>
                
                <div class="diagnosis-section">
                    <h4>Primary Diagnosis</h4>
                    <div class="diagnosis-result">
                        <span class="diagnosis-text">${result.diagnosis}</span>
                        <span class="confidence-score">${result.confidence}% confidence</span>
                    </div>
                    ${result.patternType !== 'Not specified' ? `<p class="pattern-type"><strong>Pattern Type:</strong> ${result.patternType}</p>` : ''}
                </div>
                
                <div class="pattern-analysis-section">
                    <h4>Training Pattern Analysis</h4>
                    <div class="pattern-grid">
                        ${this.renderPatternGrid(result.patternAnalysis.patternScores)}
                    </div>
                    <div class="pattern-summary">
                        <p><strong>Most Influential Pattern:</strong> <span class="influential-pattern">${result.patternAnalysis.mostInfluentialPattern.toUpperCase()}</span></p>
                        <p><strong>Pattern Diversity:</strong> ${result.patternAnalysis.diversityIndex.toFixed(1)}% (${result.patternAnalysis.totalPatternMatches} total matches)</p>
                        <p><strong>Synthesis Quality:</strong> ${result.patternAnalysis.synthesisQuality.quality} (${result.patternAnalysis.synthesisQuality.score}%)</p>
                    </div>
                </div>
                
                <div class="confidence-analysis-section">
                    <h4>Confidence Calibration Analysis</h4>
                    <div class="confidence-metrics">
                        <div class="confidence-details">
                            <p><strong>Confidence Level:</strong> ${result.patternAnalysis.confidenceAlignment.confidence}%</p>
                            <p><strong>Expected Range:</strong> ${result.patternAnalysis.confidenceAlignment.expectedRange[0]}-${result.patternAnalysis.confidenceAlignment.expectedRange[1]}%</p>
                            <p><strong>Appropriateness:</strong> <span class="${result.patternAnalysis.confidenceAlignment.isAppropriate ? 'appropriate' : 'needs-review'}">${result.patternAnalysis.confidenceAlignment.isAppropriate ? '✅ Appropriate' : '⚠️ Needs Review'}</span></p>
                            <p><strong>Assessment:</strong> ${result.patternAnalysis.confidenceAlignment.reasoning}</p>
                        </div>
                    </div>
                </div>
                
                <div class="reasoning-section">
                    <h4>Clinical Reasoning</h4>
                    <div class="reasoning-text">${this.formatText(result.clinicalReasoning)}</div>
                </div>
                
                <div class="recommendations-section">
                    <h4>Clinical Recommendations</h4>
                    <div class="recommendations-text">${this.formatText(result.recommendations)}</div>
                </div>
                
                <div class="technical-details">
                    <h4>Technical Details</h4>
                    <ul>
                        <li><strong>Analysis Method:</strong> Multi-Shot Prompting (4 diverse examples)</li>
                        <li><strong>Processing Time:</strong> ${result.processingTime}ms</li>
                        <li><strong>Tokens Used:</strong> ${result.tokensUsed}</li>
                        <li><strong>Training Examples:</strong> Normal, Bacterial, Viral, Subtle cases</li>
                        <li><strong>Pattern Matches:</strong> ${result.patternAnalysis.totalPatternMatches} across all examples</li>
                        <li><strong>Temperature:</strong> 0.3 (balanced for multi-pattern synthesis)</li>
                        <li><strong>Timestamp:</strong> ${new Date(result.timestamp).toLocaleString()}</li>
                    </ul>
                </div>
                
                <div class="medical-disclaimer">
                    <p><strong>⚠️ Medical Disclaimer:</strong> This multi-shot AI analysis learns from four diverse medical examples to provide comprehensive pattern recognition. The AI synthesizes knowledge from normal, bacterial, viral, and subtle pneumonia cases. Clinical correlation and professional medical consultation remain essential for all diagnostic decisions.</p>
                </div>
            </div>
        `;
        
        resultsSection.classList.remove('hidden');
        
        // Log detailed token usage and pattern analysis to console
        console.log(`🔢 Multi-Shot Analysis Tokens: ${result.tokensUsed}`);
        console.log(`📊 Pattern Analysis:`, result.patternAnalysis);
        console.log(`🎯 Most Influential Pattern: ${result.patternAnalysis.mostInfluentialPattern}`);
    }

    renderPatternGrid(patternScores) {
        return Object.entries(patternScores).map(([type, score]) => `
            <div class="pattern-card ${type}">
                <div class="pattern-header">
                    <h5>${type.charAt(0).toUpperCase() + type.slice(1)} Pattern</h5>
                    <span class="pattern-score">${score.percentage}%</span>
                </div>
                <div class="pattern-details">
                    <p><strong>Example:</strong> ${score.example.patient}</p>
                    <p><strong>Matches:</strong> ${score.rawScore}/${score.example.keyPatterns.length}</p>
                    <p><strong>Context:</strong> ${score.example.clinicalContext}</p>
                </div>
            </div>
        `).join('');
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
        const loadingSection = document.getElementById('multiShotLoading');
        const resultsSection = document.getElementById('multiShotResults');
        
        if (loadingSection) loadingSection.classList.remove('hidden');
        if (resultsSection) resultsSection.classList.add('hidden');
    }

    hideLoading() {
        const loadingSection = document.getElementById('multiShotLoading');
        if (loadingSection) loadingSection.classList.add('hidden');
    }

    showError(message) {
        this.hideLoading();
        alert(`Multi-Shot Analysis Error: ${message}`);
    }

    clearResults() {
        this.currentImage = null;
        
        // Clear file input
        const fileInput = document.getElementById('multiShotFileInput');
        if (fileInput) fileInput.value = '';
        
        // Hide preview and results
        const preview = document.getElementById('multiShotImagePreview');
        const results = document.getElementById('multiShotResults');
        const loading = document.getElementById('multiShotLoading');
        
        if (preview) preview.classList.add('hidden');
        if (results) results.classList.add('hidden');
        if (loading) loading.classList.add('hidden');
        
        // Disable analyze button
        const analyzeBtn = document.getElementById('multiShotAnalyzeBtn');
        if (analyzeBtn) analyzeBtn.disabled = true;
    }
}

// Initialize the Multi-Shot Detector when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Multi-Shot Pneumonia Detection System...');
    new MultiShotPneumoniaDetector();
});

// Also initialize if DOM is already loaded
if (document.readyState !== 'loading') {
    console.log('DOM already loaded, initializing Multi-Shot system...');
    new MultiShotPneumoniaDetector();
}
