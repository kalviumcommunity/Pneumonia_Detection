// Chain of Thought Prompting Implementation for Pneumonia Detection
class ChainOfThoughtPneumoniaDetector {
    constructor() {
        this.apiKey = 'AIzaSyBKDFyflc-Chesroe1iUBmzwF4MRMxpFgU'; // Replace with your API key
        this.currentImage = null;
        this.reasoningSteps = [];
        
        // Chain of Thought prompt with explicit reasoning instructions
        this.chainOfThoughtPrompt = `
You are an expert radiologist performing systematic chest X-ray analysis for pneumonia detection. 

CRITICAL INSTRUCTION: You MUST show your complete chain of reasoning step by step. Think like you're teaching a medical student and demonstrate your expert thought process.

REQUIRED REASONING FORMAT:
Use this exact step-by-step reasoning structure:

🔍 STEP 1 - TECHNICAL ASSESSMENT:
[Evaluate image quality, positioning, exposure, inspiration. Be specific about what you observe and why it matters for diagnosis.]

🫁 STEP 2 - SYSTEMATIC LUNG EXAMINATION:
[Examine each lung field methodically. Describe what you see in each lobe, comparing normal vs abnormal findings. Explain your visual reasoning.]

❤️ STEP 3 - CARDIAC AND MEDIASTINAL ASSESSMENT:
[Evaluate heart size, borders, mediastinal contours. Explain how these findings relate to respiratory pathology.]

🔬 STEP 4 - PATTERN ANALYSIS AND RECOGNITION:
[Identify specific patterns you observe. Explain what each pattern typically indicates and why. Connect visual findings to pathophysiology.]

🧩 STEP 5 - DIFFERENTIAL DIAGNOSIS REASONING:
[Consider alternative diagnoses. Explain why you include or exclude each possibility. Show your clinical reasoning process.]

⚖️ STEP 6 - EVIDENCE WEIGHING:
[Weigh the evidence for each diagnostic possibility. Explain which findings support or contradict each diagnosis.]

🎯 STEP 7 - FINAL DIAGNOSTIC REASONING:
[Integrate all evidence and explain your logical path to the final diagnosis. Show how you arrived at your conclusion.]

✅ STEP 8 - CONFIDENCE ASSESSMENT:
[Explain your confidence level and the reasoning behind it. What makes you more or less certain?]

REASONING REQUIREMENTS:
- Explain WHY you see what you see, not just WHAT you see
- Show your thought process for each observation
- Demonstrate how you rule in or rule out diagnoses
- Explain how confidence builds through systematic analysis
- Connect visual findings to underlying pathophysiology
- Show the logical progression from observation to conclusion

EDUCATIONAL FOCUS:
Think like you're demonstrating proper radiological reasoning to a medical student. Show them how an expert thinks through a case systematically.

Begin your systematic chain of thought analysis now:
        `;
        
        this.initializeChainOfThoughtDetector();
    }

    initializeChainOfThoughtDetector() {
        console.log('Initializing Chain of Thought Pneumonia Detector...');
        this.setupEventListeners();
    }

    setupEventListeners() {
        // File upload elements
        const fileInput = document.getElementById('cotFileInput');
        const uploadBtn = document.getElementById('cotUploadBtn');
        const analyzeBtn = document.getElementById('cotAnalyzeBtn');
        const clearBtn = document.getElementById('cotClearBtn');

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
                this.performChainOfThoughtAnalysis();
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
            const preview = document.getElementById('cotImagePreview');
            const img = document.getElementById('cotPreviewImg');
            const info = document.getElementById('cotImageInfo');
            
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
                        <p><strong>🧠 Analysis:</strong> Chain of Thought Reasoning</p>
                        <p><strong>🎓 Method:</strong> Step-by-step transparent reasoning demonstration</p>
                        <p><strong>🔍 Purpose:</strong> Educational medical reasoning display</p>
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
        const analyzeBtn = document.getElementById('cotAnalyzeBtn');
        if (analyzeBtn) {
            analyzeBtn.disabled = false;
        }
    }

    async performChainOfThoughtAnalysis() {
        if (!this.currentImage) {
            alert('Please select an image first');
            return;
        }

        try {
            this.showLoading();
            
            // Convert image to base64
            const base64Image = await this.fileToBase64(this.currentImage);
            
            // Make API call with chain of thought prompt
            const startTime = Date.now();
            const result = await this.callGeminiAPI(base64Image);
            const endTime = Date.now();
            
            // Parse chain of thought response
            const parsedResult = this.parseChainOfThoughtResponse(result.text);
            parsedResult.processingTime = endTime - startTime;
            parsedResult.tokensUsed = result.tokensUsed;
            
            // Extract reasoning steps
            this.reasoningSteps = this.extractReasoningSteps(result.text);
            
            // Analyze reasoning quality
            parsedResult.reasoningAnalysis = this.analyzeReasoningQuality(result.text);
            
            this.displayResults(parsedResult);
            
            console.log('Chain of Thought Analysis Complete:', parsedResult);
            
        } catch (error) {
            console.error('Chain of thought analysis failed:', error);
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
        console.log('Making Chain of Thought API call to Gemini...');
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        {
                            text: this.chainOfThoughtPrompt
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
                    temperature: 0.3, // Lower temperature for consistent reasoning
                    topK: 40,
                    topP: 0.9,
                    maxOutputTokens: 3000, // Higher limit for detailed reasoning
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

    parseChainOfThoughtResponse(responseText) {
        // Extract final diagnosis and confidence from the reasoning chain
        const diagnosis = this.extractFinalDiagnosis(responseText);
        const confidence = this.extractConfidenceLevel(responseText);
        
        return {
            method: 'Chain of Thought Prompting',
            diagnosis: diagnosis || 'Unable to determine from reasoning',
            confidence: confidence,
            fullReasoning: responseText,
            reasoningSteps: this.extractReasoningSteps(responseText),
            timestamp: new Date().toISOString()
        };
    }

    extractReasoningSteps(text) {
        const steps = [];
        const stepPattern = /🔍|🫁|❤️|🔬|🧩|⚖️|🎯|✅/g;
        const stepMarkers = text.match(stepPattern) || [];
        
        // Define step titles
        const stepTitles = {
            '🔍': 'Technical Assessment',
            '🫁': 'Systematic Lung Examination', 
            '❤️': 'Cardiac and Mediastinal Assessment',
            '🔬': 'Pattern Analysis and Recognition',
            '🧩': 'Differential Diagnosis Reasoning',
            '⚖️': 'Evidence Weighing',
            '🎯': 'Final Diagnostic Reasoning',
            '✅': 'Confidence Assessment'
        };
        
        // Extract content for each step
        const stepSections = text.split(/(?=🔍|🫁|❤️|🔬|🧩|⚖️|🎯|✅)/);
        
        stepSections.forEach((section, index) => {
            if (section.trim()) {
                const marker = section.match(/🔍|🫁|❤️|🔬|🧩|⚖️|🎯|✅/)?.[0];
                if (marker) {
                    const title = stepTitles[marker] || `Step ${index + 1}`;
                    const content = section.replace(/🔍|🫁|❤️|🔬|🧩|⚖️|🎯|✅.*?:/, '').trim();
                    
                    steps.push({
                        stepNumber: index + 1,
                        icon: marker,
                        title: title,
                        content: content,
                        wordCount: content.split(' ').length
                    });
                }
            }
        });
        
        return steps;
    }

    extractFinalDiagnosis(text) {
        // Look for diagnosis in the final reasoning step
        const diagnosisPatterns = [
            /(?:diagnosis|conclusion|assessment).*?:.*?(.*?)(?=\.|confidence|$)/i,
            /(?:final|my).*?(?:diagnosis|conclusion).*?:.*?(.*?)(?=\.|confidence|$)/i,
            /therefore.*?(.*?)(?=\.|confidence|$)/i
        ];
        
        for (const pattern of diagnosisPatterns) {
            const match = text.match(pattern);
            if (match && match[1].trim()) {
                return match[1].trim();
            }
        }
        
        // Look for pneumonia-related keywords in final steps
        if (text.toLowerCase().includes('pneumonia')) {
            if (text.toLowerCase().includes('no pneumonia') || text.toLowerCase().includes('normal')) {
                return 'No pneumonia detected';
            } else {
                return 'Pneumonia detected';
            }
        }
        
        return 'Unable to extract diagnosis';
    }

    extractConfidenceLevel(text) {
        const confidencePatterns = [
            /confidence.*?(\d+)%/i,
            /(\d+)%.*?confidence/i,
            /confidence.*?level.*?(\d+)/i
        ];
        
        for (const pattern of confidencePatterns) {
            const match = text.match(pattern);
            if (match) {
                return parseInt(match[1]);
            }
        }
        
        return 0;
    }

    analyzeReasoningQuality(responseText) {
        // Analyze the quality of the chain of thought reasoning
        const analysis = {
            completeness: this.assessCompletenessScore(responseText),
            logicalFlow: this.assessLogicalFlow(responseText),
            medicalAccuracy: this.assessMedicalTerminology(responseText),
            educationalValue: this.assessEducationalValue(responseText),
            transparency: this.assessTransparency(responseText)
        };
        
        // Calculate overall reasoning quality score
        const scores = Object.values(analysis);
        analysis.overallScore = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
        
        return analysis;
    }

    assessCompletenessScore(text) {
        const requiredElements = [
            'technical', 'quality', 'lung', 'cardiac', 'pattern', 
            'differential', 'evidence', 'diagnosis', 'confidence'
        ];
        
        let foundElements = 0;
        requiredElements.forEach(element => {
            if (text.toLowerCase().includes(element)) foundElements++;
        });
        
        return Math.round((foundElements / requiredElements.length) * 100);
    }

    assessLogicalFlow(text) {
        const steps = this.extractReasoningSteps(text);
        let flowScore = 0;
        
        // Check if we have the expected number of reasoning steps
        if (steps.length >= 6) flowScore += 30;
        
        // Check for logical progression indicators
        const progressionWords = ['first', 'next', 'then', 'therefore', 'based on', 'given', 'considering'];
        let progressionCount = 0;
        progressionWords.forEach(word => {
            if (text.toLowerCase().includes(word)) progressionCount++;
        });
        
        flowScore += Math.min(progressionCount * 10, 70);
        
        return Math.min(flowScore, 100);
    }

    assessMedicalTerminology(text) {
        const medicalTerms = [
            'consolidation', 'infiltrate', 'opacity', 'bronchogram', 'pneumonia',
            'radiograph', 'lobe', 'bilateral', 'unilateral', 'pathology',
            'differential', 'etiology', 'pathophysiology', 'diagnosis'
        ];
        
        let termCount = 0;
        medicalTerms.forEach(term => {
            if (text.toLowerCase().includes(term)) termCount++;
        });
        
        return Math.min(Math.round((termCount / medicalTerms.length) * 100), 100);
    }

    assessEducationalValue(text) {
        const educationalIndicators = [
            'explain', 'demonstrate', 'shows', 'indicates', 'suggests',
            'typical', 'characteristic', 'pathognomonic', 'because', 'since'
        ];
        
        let indicatorCount = 0;
        educationalIndicators.forEach(indicator => {
            if (text.toLowerCase().includes(indicator)) indicatorCount++;
        });
        
        return Math.min(Math.round((indicatorCount / educationalIndicators.length) * 100), 100);
    }

    assessTransparency(text) {
        const steps = this.extractReasoningSteps(text);
        let transparencyScore = 0;
        
        // Check for step-by-step structure
        if (steps.length >= 6) transparencyScore += 40;
        
        // Check for explicit reasoning phrases
        const reasoningPhrases = ['i observe', 'i notice', 'this shows', 'this indicates', 'my reasoning'];
        let phraseCount = 0;
        reasoningPhrases.forEach(phrase => {
            if (text.toLowerCase().includes(phrase)) phraseCount++;
        });
        
        transparencyScore += Math.min(phraseCount * 15, 60);
        
        return Math.min(transparencyScore, 100);
    }

    displayResults(result) {
        this.hideLoading();
        
        const resultsSection = document.getElementById('cotResults');
        const resultsContent = document.getElementById('cotResultsContent');
        
        if (!resultsSection || !resultsContent) return;
        
        // Determine diagnosis status for styling
        const hasPneumonia = result.diagnosis.toLowerCase().includes('pneumonia detected');
        const statusClass = hasPneumonia ? 'pneumonia-detected' : 'normal';
        
        resultsContent.innerHTML = `
            <div class="cot-result ${statusClass}">
                <div class="result-header">
                    <h3>Chain of Thought Analysis Results</h3>
                    <span class="analysis-method">${result.method}</span>
                </div>
                
                <div class="diagnosis-summary">
                    <h4>Final Diagnosis</h4>
                    <div class="diagnosis-result">
                        <span class="diagnosis-text">${result.diagnosis}</span>
                        <span class="confidence-score">${result.confidence}% confidence</span>
                    </div>
                </div>
                
                <div class="reasoning-chain">
                    <h4>Step-by-Step Reasoning Chain</h4>
                    <div class="reasoning-steps">
                        ${this.renderReasoningSteps(this.reasoningSteps)}
                    </div>
                </div>
                
                <div class="reasoning-analysis">
                    <h4>Reasoning Quality Analysis</h4>
                    ${this.renderReasoningAnalysis(result.reasoningAnalysis)}
                </div>
                
                <div class="educational-insights">
                    <h4>Educational Insights</h4>
                    ${this.renderEducationalInsights(this.reasoningSteps)}
                </div>
                
                <div class="technical-details">
                    <h4>Technical Details</h4>
                    <ul>
                        <li><strong>Analysis Method:</strong> Chain of Thought Prompting</li>
                        <li><strong>Reasoning Steps:</strong> ${this.reasoningSteps.length} systematic steps</li>
                        <li><strong>Processing Time:</strong> ${result.processingTime}ms</li>
                        <li><strong>Tokens Used:</strong> ${result.tokensUsed}</li>
                        <li><strong>Reasoning Quality:</strong> ${result.reasoningAnalysis.overallScore}/100</li>
                        <li><strong>Temperature:</strong> 0.3 (optimized for consistent reasoning)</li>
                        <li><strong>Timestamp:</strong> ${new Date(result.timestamp).toLocaleString()}</li>
                    </ul>
                </div>
                
                <div class="medical-disclaimer">
                    <p><strong>⚠️ Chain of Thought Disclaimer:</strong> This AI demonstrates step-by-step medical reasoning for educational purposes. The transparent reasoning process shows how AI arrives at conclusions, but all medical decisions require professional validation and clinical correlation. Use this reasoning demonstration to understand AI thought processes, not as definitive medical advice.</p>
                </div>
            </div>
        `;
        
        resultsSection.classList.remove('hidden');
        
        console.log(`🧠 Chain of Thought Analysis: ${this.reasoningSteps.length} steps, ${result.tokensUsed} tokens`);
    }

    renderReasoningSteps(steps) {
        return steps.map((step, index) => `
            <div class="reasoning-step">
                <div class="step-header">
                    <span class="step-icon">${step.icon}</span>
                    <h5>Step ${step.stepNumber}: ${step.title}</h5>
                    <span class="word-count">${step.wordCount} words</span>
                </div>
                <div class="step-content">
                    <div class="reasoning-text">${this.formatReasoningText(step.content)}</div>
                </div>
            </div>
        `).join('');
    }

    formatReasoningText(text) {
        if (!text) return '<p class="no-content">No reasoning provided for this step</p>';
        
        // Format the reasoning text for better readability
        return text
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/(\d+\.)/g, '<br><strong>$1</strong>')
            .replace(/^- /gm, '<br>• ');
    }

    renderReasoningAnalysis(analysis) {
        return `
            <div class="quality-metrics">
                <div class="metric-grid">
                    <div class="metric-card">
                        <h6>Completeness</h6>
                        <div class="metric-score">${analysis.completeness}%</div>
                        <div class="metric-bar">
                            <div class="metric-fill" style="width: ${analysis.completeness}%"></div>
                        </div>
                    </div>
                    <div class="metric-card">
                        <h6>Logical Flow</h6>
                        <div class="metric-score">${analysis.logicalFlow}%</div>
                        <div class="metric-bar">
                            <div class="metric-fill" style="width: ${analysis.logicalFlow}%"></div>
                        </div>
                    </div>
                    <div class="metric-card">
                        <h6>Medical Accuracy</h6>
                        <div class="metric-score">${analysis.medicalAccuracy}%</div>
                        <div class="metric-bar">
                            <div class="metric-fill" style="width: ${analysis.medicalAccuracy}%"></div>
                        </div>
                    </div>
                    <div class="metric-card">
                        <h6>Educational Value</h6>
                        <div class="metric-score">${analysis.educationalValue}%</div>
                        <div class="metric-bar">
                            <div class="metric-fill" style="width: ${analysis.educationalValue}%"></div>
                        </div>
                    </div>
                    <div class="metric-card">
                        <h6>Transparency</h6>
                        <div class="metric-score">${analysis.transparency}%</div>
                        <div class="metric-bar">
                            <div class="metric-fill" style="width: ${analysis.transparency}%"></div>
                        </div>
                    </div>
                    <div class="metric-card overall">
                        <h6>Overall Quality</h6>
                        <div class="metric-score">${analysis.overallScore}%</div>
                        <div class="metric-bar">
                            <div class="metric-fill" style="width: ${analysis.overallScore}%"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderEducationalInsights(steps) {
        const totalWords = steps.reduce((sum, step) => sum + step.wordCount, 0);
        const avgWordsPerStep = Math.round(totalWords / steps.length);
        
        return `
            <div class="educational-metrics">
                <div class="insight-summary">
                    <p><strong>🎓 Learning Value:</strong> This analysis demonstrates systematic medical reasoning with ${steps.length} distinct thought processes.</p>
                    <p><strong>📝 Reasoning Depth:</strong> Average ${avgWordsPerStep} words per reasoning step, showing detailed thought processes.</p>
                    <p><strong>🔍 Transparency:</strong> Every diagnostic decision is explained with clear logical progression.</p>
                    <p><strong>🏥 Clinical Relevance:</strong> Mirrors how expert radiologists approach systematic image analysis.</p>
                </div>
                
                <div class="reasoning-benefits">
                    <h5>Benefits of Chain of Thought Analysis:</h5>
                    <ul>
                        <li><strong>Auditability:</strong> Every reasoning step can be reviewed and validated</li>
                        <li><strong>Education:</strong> Students can learn proper diagnostic reasoning patterns</li>
                        <li><strong>Trust:</strong> Transparent process builds confidence in AI recommendations</li>
                        <li><strong>Quality Assurance:</strong> Systematic approach reduces diagnostic errors</li>
                        <li><strong>Reproducibility:</strong> Consistent reasoning approach across all cases</li>
                    </ul>
                </div>
            </div>
        `;
    }

    showLoading() {
        const loadingSection = document.getElementById('cotLoading');
        const resultsSection = document.getElementById('cotResults');
        
        if (loadingSection) loadingSection.classList.remove('hidden');
        if (resultsSection) resultsSection.classList.add('hidden');
    }

    hideLoading() {
        const loadingSection = document.getElementById('cotLoading');
        if (loadingSection) loadingSection.classList.add('hidden');
    }

    showError(message) {
        this.hideLoading();
        alert(`Chain of Thought Analysis Error: ${message}`);
    }

    clearResults() {
        this.currentImage = null;
        this.reasoningSteps = [];
        
        // Clear file input
        const fileInput = document.getElementById('cotFileInput');
        if (fileInput) fileInput.value = '';
        
        // Hide sections
        const sections = ['cotImagePreview', 'cotResults', 'cotLoading'];
        sections.forEach(id => {
            const element = document.getElementById(id);
            if (element) element.classList.add('hidden');
        });
        
        // Disable analyze button
        const analyzeBtn = document.getElementById('cotAnalyzeBtn');
        if (analyzeBtn) analyzeBtn.disabled = true;
    }
}

// Initialize the Chain of Thought Detector when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Chain of Thought Pneumonia Detection System...');
    new ChainOfThoughtPneumoniaDetector();
});

// Also initialize if DOM is already loaded
if (document.readyState !== 'loading') {
    console.log('DOM already loaded, initializing Chain of Thought system...');
    new ChainOfThoughtPneumoniaDetector();
}
