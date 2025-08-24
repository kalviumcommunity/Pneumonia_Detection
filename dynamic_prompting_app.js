// Dynamic Prompting Implementation for Pneumonia Detection
class DynamicPneumoniaDetector {
    constructor() {
        this.apiKey = 'AIzaSyBKDFyflc-Chesroe1iUBmzwF4MRMxpFgU'; // Replace with your API key
        this.currentImage = null;
        this.patientContext = {};
        this.analysisHistory = [];
        this.currentAnalysisStep = 1;
        
        // Dynamic prompt templates for different scenarios
        this.promptTemplates = {
            initial: this.getInitialAssessmentPrompt(),
            normal: this.getNormalFollowUpPrompt(),
            pathology: this.getPathologyFollowUpPrompt(),
            ambiguous: this.getAmbiguousFollowUpPrompt(),
            pediatric: this.getPediatricPrompt(),
            elderly: this.getElderlyPrompt(),
            immunocompromised: this.getImmunocompromisedPrompt(),
            emergency: this.getEmergencyPrompt()
        };
        
        this.initializeDynamicDetector();
    }

    initializeDynamicDetector() {
        console.log('Initializing Dynamic Pneumonia Detector...');
        this.setupEventListeners();
        this.initializePatientForm();
    }

    setupEventListeners() {
        // File upload elements
        const fileInput = document.getElementById('dynamicFileInput');
        const uploadBtn = document.getElementById('dynamicUploadBtn');
        const analyzeBtn = document.getElementById('dynamicAnalyzeBtn');
        const clearBtn = document.getElementById('dynamicClearBtn');
        const contextForm = document.getElementById('patientContextForm');

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
                this.performDynamicAnalysis();
            });
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearResults();
            });
        }

        if (contextForm) {
            contextForm.addEventListener('change', () => {
                this.updatePatientContext();
            });
        }
    }

    initializePatientForm() {
        // Pre-fill some example data for demonstration
        const ageInput = document.getElementById('patientAge');
        const symptomsSelect = document.getElementById('symptoms');
        const historySelect = document.getElementById('medicalHistory');
        
        // Set up dynamic form interactions
        if (ageInput) {
            ageInput.addEventListener('input', () => {
                this.updateAgeGroup();
            });
        }
    }

    updateAgeGroup() {
        const age = parseInt(document.getElementById('patientAge')?.value || 0);
        const ageGroupDisplay = document.getElementById('ageGroupDisplay');
        
        let ageGroup = '';
        if (age < 18) ageGroup = 'Pediatric';
        else if (age >= 65) ageGroup = 'Elderly';
        else ageGroup = 'Adult';
        
        if (ageGroupDisplay) {
            ageGroupDisplay.textContent = `Age Group: ${ageGroup}`;
            ageGroupDisplay.className = `age-group ${ageGroup.toLowerCase()}`;
        }
    }

    updatePatientContext() {
        const form = document.getElementById('patientContextForm');
        if (!form) return;

        const formData = new FormData(form);
        this.patientContext = {
            age: parseInt(formData.get('age')) || null,
            symptoms: formData.get('symptoms') || '',
            onset: formData.get('onset') || '',
            severity: formData.get('severity') || '',
            medicalHistory: formData.get('medicalHistory') || '',
            urgency: formData.get('urgency') || '',
            fever: formData.get('fever') === 'yes',
            cough: formData.get('cough') === 'yes',
            dyspnea: formData.get('dyspnea') === 'yes'
        };

        console.log('Updated patient context:', this.patientContext);
        this.displayContextSummary();
    }

    displayContextSummary() {
        const summary = document.getElementById('contextSummary');
        if (!summary) return;

        const context = this.patientContext;
        const ageGroup = this.getAgeGroup(context.age);
        
        summary.innerHTML = `
            <div class="context-summary-content">
                <h4>Patient Context Summary</h4>
                <div class="context-grid">
                    <div class="context-item">
                        <strong>Age:</strong> ${context.age || 'Not specified'} (${ageGroup})
                    </div>
                    <div class="context-item">
                        <strong>Symptoms:</strong> ${context.symptoms || 'Not specified'}
                    </div>
                    <div class="context-item">
                        <strong>Onset:</strong> ${context.onset || 'Not specified'}
                    </div>
                    <div class="context-item">
                        <strong>Severity:</strong> ${context.severity || 'Not specified'}
                    </div>
                    <div class="context-item">
                        <strong>History:</strong> ${context.medicalHistory || 'Not specified'}
                    </div>
                    <div class="context-item">
                        <strong>Urgency:</strong> ${context.urgency || 'Not specified'}
                    </div>
                </div>
                <div class="dynamic-adaptation-info">
                    <p><strong>🔄 Dynamic Adaptation:</strong> The AI will adapt its analysis based on this context.</p>
                </div>
            </div>
        `;
        summary.classList.remove('hidden');
    }

    getAgeGroup(age) {
        if (!age) return 'Unspecified';
        if (age < 18) return 'Pediatric';
        if (age >= 65) return 'Elderly';
        return 'Adult';
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
            const preview = document.getElementById('dynamicImagePreview');
            const img = document.getElementById('dynamicPreviewImg');
            const info = document.getElementById('dynamicImageInfo');
            
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
                        <p><strong>🔄 Analysis:</strong> Dynamic Prompting (Adaptive)</p>
                        <p><strong>🎯 Method:</strong> Context-aware analysis with progressive investigation</p>
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
        const analyzeBtn = document.getElementById('dynamicAnalyzeBtn');
        if (analyzeBtn) {
            analyzeBtn.disabled = false;
        }
    }

    async performDynamicAnalysis() {
        if (!this.currentImage) {
            alert('Please select an image first');
            return;
        }

        try {
            this.showLoading();
            this.analysisHistory = [];
            this.currentAnalysisStep = 1;
            
            // Update patient context before analysis
            this.updatePatientContext();
            
            // Step 1: Initial Assessment
            await this.performInitialAssessment();
            
        } catch (error) {
            console.error('Dynamic analysis failed:', error);
            this.showError(error.message);
        }
    }

    async performInitialAssessment() {
        try {
            this.updateLoadingStatus('Performing initial assessment...');
            
            // Convert image to base64
            const base64Image = await this.fileToBase64(this.currentImage);
            
            // Get appropriate initial prompt based on context
            const initialPrompt = this.getAdaptivePrompt('initial');
            
            // Make initial API call
            const startTime = Date.now();
            const result = await this.callGeminiAPI(base64Image, initialPrompt);
            const endTime = Date.now();
            
            // Parse initial results
            const parsedResult = this.parseInitialResponse(result.text);
            parsedResult.processingTime = endTime - startTime;
            parsedResult.tokensUsed = result.tokensUsed;
            parsedResult.step = 'Initial Assessment';
            
            // Store in history
            this.analysisHistory.push(parsedResult);
            
            // Determine next step based on initial findings
            await this.determineNextStep(parsedResult);
            
        } catch (error) {
            throw new Error(`Initial assessment failed: ${error.message}`);
        }
    }

    async determineNextStep(initialResult) {
        try {
            this.updateLoadingStatus('Analyzing complexity and determining next steps...');
            
            const complexity = this.assessComplexity(initialResult);
            const nextStepType = this.getNextStepType(initialResult, complexity);
            
            this.currentAnalysisStep = 2;
            
            // Perform adaptive follow-up based on initial findings
            await this.performAdaptiveFollowUp(nextStepType, initialResult);
            
        } catch (error) {
            throw new Error(`Adaptive follow-up failed: ${error.message}`);
        }
    }

    async performAdaptiveFollowUp(stepType, previousResult) {
        try {
            this.updateLoadingStatus(`Performing ${stepType} follow-up analysis...`);
            
            // Convert image to base64 again for follow-up
            const base64Image = await this.fileToBase64(this.currentImage);
            
            // Get adaptive prompt for follow-up
            const followUpPrompt = this.getAdaptivePrompt(stepType, previousResult);
            
            // Make follow-up API call
            const startTime = Date.now();
            const result = await this.callGeminiAPI(base64Image, followUpPrompt);
            const endTime = Date.now();
            
            // Parse follow-up results
            const parsedResult = this.parseFollowUpResponse(result.text, stepType);
            parsedResult.processingTime = endTime - startTime;
            parsedResult.tokensUsed = result.tokensUsed;
            parsedResult.step = `Follow-up: ${stepType}`;
            parsedResult.previousStep = previousResult;
            
            // Store in history
            this.analysisHistory.push(parsedResult);
            
            // Complete analysis and display results
            this.completeAnalysis();
            
        } catch (error) {
            throw new Error(`Follow-up analysis failed: ${error.message}`);
        }
    }

    assessComplexity(result) {
        const complexityIndicators = {
            high: ['multiple', 'bilateral', 'complicated', 'extensive', 'severe', 'unclear'],
            medium: ['consolidation', 'infiltrate', 'opacity', 'asymmetric', 'moderate'],
            low: ['normal', 'clear', 'no', 'minimal', 'mild']
        };
        
        const text = result.fullResponse.toLowerCase();
        let highScore = 0, mediumScore = 0, lowScore = 0;
        
        complexityIndicators.high.forEach(indicator => {
            if (text.includes(indicator)) highScore++;
        });
        
        complexityIndicators.medium.forEach(indicator => {
            if (text.includes(indicator)) mediumScore++;
        });
        
        complexityIndicators.low.forEach(indicator => {
            if (text.includes(indicator)) lowScore++;
        });
        
        if (highScore >= 2) return 'high';
        if (mediumScore >= 2 || (highScore >= 1 && mediumScore >= 1)) return 'medium';
        return 'low';
    }

    getNextStepType(result, complexity) {
        const diagnosis = result.diagnosis.toLowerCase();
        const context = this.patientContext;
        
        // Determine follow-up type based on findings and context
        if (diagnosis.includes('normal') || diagnosis.includes('no pneumonia')) {
            return 'normal';
        } else if (diagnosis.includes('pneumonia detected') || diagnosis.includes('consolidation')) {
            return 'pathology';
        } else if (diagnosis.includes('questionable') || diagnosis.includes('subtle') || complexity === 'high') {
            return 'ambiguous';
        } else if (context.age && context.age < 18) {
            return 'pediatric';
        } else if (context.age && context.age >= 65) {
            return 'elderly';
        } else if (context.medicalHistory === 'immunocompromised') {
            return 'immunocompromised';
        } else if (context.urgency === 'emergency') {
            return 'emergency';
        }
        
        return 'pathology'; // Default to pathology follow-up
    }

    getAdaptivePrompt(type, previousResult = null) {
        const basePrompt = this.promptTemplates[type];
        const context = this.patientContext;
        
        // Inject patient context into prompt
        let adaptedPrompt = basePrompt.replace('{PATIENT_CONTEXT}', this.formatPatientContext());
        
        // Add previous findings if this is a follow-up
        if (previousResult) {
            adaptedPrompt = adaptedPrompt.replace('{PREVIOUS_FINDINGS}', this.formatPreviousFindings(previousResult));
        }
        
        return adaptedPrompt;
    }

    formatPatientContext() {
        const context = this.patientContext;
        const ageGroup = this.getAgeGroup(context.age);
        
        return `
PATIENT CONTEXT:
- Age: ${context.age || 'Not specified'} years (${ageGroup})
- Symptoms: ${context.symptoms || 'Not specified'}
- Onset: ${context.onset || 'Not specified'}
- Severity: ${context.severity || 'Not specified'}
- Medical History: ${context.medicalHistory || 'Not specified'}
- Clinical Urgency: ${context.urgency || 'Not specified'}
- Fever: ${context.fever ? 'Present' : 'Not reported'}
- Cough: ${context.cough ? 'Present' : 'Not reported'}
- Dyspnea: ${context.dyspnea ? 'Present' : 'Not reported'}
        `.trim();
    }

    formatPreviousFindings(previousResult) {
        return `
PREVIOUS ASSESSMENT FINDINGS:
- Initial Diagnosis: ${previousResult.diagnosis}
- Confidence: ${previousResult.confidence}%
- Pattern Type: ${previousResult.patternType || 'Not specified'}
- Key Findings: ${previousResult.keyFindings || 'See detailed analysis'}
- Complexity Assessment: ${previousResult.complexity || 'Standard'}
        `.trim();
    }

    // Dynamic Prompt Templates
    getInitialAssessmentPrompt() {
        return `
You are an expert radiologist performing the INITIAL ASSESSMENT of a chest X-ray for pneumonia detection.

{PATIENT_CONTEXT}

DYNAMIC ANALYSIS INSTRUCTIONS:
This is the first step of a dynamic analysis. Perform a systematic initial assessment and determine the complexity level for follow-up analysis.

SYSTEMATIC INITIAL ASSESSMENT:
1. Technical Quality Assessment
2. Overall Impression (Normal vs. Abnormal)
3. Bilateral Lung Field Survey
4. Cardiac and Mediastinal Assessment
5. Preliminary Diagnostic Impression

COMPLEXITY DETERMINATION:
- Simple: Clear normal or obvious pathology
- Moderate: Standard pneumonia patterns
- Complex: Multiple findings, bilateral involvement, complications, or subtle changes

ADAPTIVE RESPONSE FORMAT:
Primary Diagnosis: [Clear statement]
Confidence: [Percentage]
Complexity Level: [Simple/Moderate/Complex]
Key Findings: [Brief summary]
Recommended Follow-up: [Specify type of additional analysis needed]
Clinical Reasoning: [Initial thought process]

CONTEXT ADAPTATION:
Adjust your analysis approach based on the patient context provided. Consider age-appropriate normals, symptom correlation, and risk factors.
        `;
    }

    getNormalFollowUpPrompt() {
        return `
You are an expert radiologist performing DETAILED NORMAL VARIANT ANALYSIS following an initial assessment of "normal" findings.

{PATIENT_CONTEXT}

{PREVIOUS_FINDINGS}

DYNAMIC FOLLOW-UP FOCUS:
Since initial assessment suggested normal findings, perform enhanced scrutiny for:
1. Subtle early pneumonia changes
2. Age-appropriate normal variants
3. Technical factors that might obscure pathology
4. Clinical-radiological correlation

ENHANCED NORMAL ANALYSIS:
- Detailed assessment of lung bases and periphery
- Evaluation for minimal infiltrates or ground-glass opacities
- Assessment of vascular markings and bronchial walls
- Consideration of patient-specific factors

ADAPTIVE CONFIDENCE CALIBRATION:
Provide appropriate confidence levels for normal findings considering:
- Patient symptoms and clinical presentation
- Age and risk factors
- Technical quality of the study

Final Assessment: [Confirmed normal vs. recommend additional imaging]
Clinical Correlation: [How findings relate to patient presentation]
Recommendations: [Next steps if any]
        `;
    }

    getPathologyFollowUpPrompt() {
        return `
You are an expert radiologist performing COMPREHENSIVE PATHOLOGY ANALYSIS following detection of abnormal findings.

{PATIENT_CONTEXT}

{PREVIOUS_FINDINGS}

DYNAMIC PATHOLOGY ASSESSMENT:
Building on initial findings, provide detailed analysis of:

CONSOLIDATION CHARACTERISTICS:
- Distribution pattern (lobar, segmental, patchy)
- Density and homogeneity
- Air bronchogram presence and pattern
- Border definition and margins

PNEUMONIA CLASSIFICATION:
- Bacterial vs. Viral patterns
- Community-acquired vs. Hospital-acquired considerations
- Typical vs. Atypical presentations

COMPLICATIONS ASSESSMENT:
- Pleural involvement or effusion
- Cavitation or abscess formation
- Multi-lobar involvement
- Signs of respiratory failure

SEVERITY STRATIFICATION:
- Extent of lung involvement
- Impact on cardiac silhouette
- Assessment of oxygenation implications

TREATMENT IMPLICATIONS:
- Antibiotic considerations based on pattern
- Need for hospitalization
- Monitoring requirements

Detailed Diagnosis: [Comprehensive pathology description]
Severity Assessment: [Mild/Moderate/Severe with justification]
Complications: [Present/Absent with details]
Treatment Recommendations: [Evidence-based guidance]
        `;
    }

    getAmbiguousFollowUpPrompt() {
        return `
You are an expert radiologist performing AMBIGUOUS FINDING RESOLUTION following uncertain initial assessment.

{PATIENT_CONTEXT}

{PREVIOUS_FINDINGS}

DYNAMIC UNCERTAINTY MANAGEMENT:
Address ambiguous findings through:

SYSTEMATIC RE-EVALUATION:
- Alternative diagnostic considerations
- Technical factors contributing to uncertainty
- Clinical correlation requirements
- Additional imaging needs

DIFFERENTIAL DIAGNOSIS APPROACH:
- Pneumonia vs. Other pulmonary conditions
- Inflammatory vs. Non-inflammatory processes
- Acute vs. Chronic changes
- Primary vs. Secondary findings

CLINICAL INTEGRATION:
- Correlation with symptoms and signs
- Laboratory values interpretation
- Timeline and progression factors
- Risk factor assessment

RECOMMENDATION FRAMEWORK:
- Immediate management needs
- Additional diagnostic studies
- Follow-up imaging timeline
- Clinical monitoring requirements

Diagnostic Impression: [Most likely diagnosis with alternatives]
Uncertainty Factors: [What makes this case challenging]
Clinical Correlation Needs: [Specific information required]
Management Recommendations: [Immediate and follow-up actions]
        `;
    }

    getPediatricPrompt() {
        return `
You are a pediatric radiologist performing PEDIATRIC-SPECIFIC ANALYSIS.

{PATIENT_CONTEXT}

{PREVIOUS_FINDINGS}

PEDIATRIC DYNAMIC ADAPTATIONS:

AGE-APPROPRIATE NORMALS:
- Thymus gland considerations
- Heart size variations by age
- Normal bronchial wall thickness
- Expected vascular markings

PEDIATRIC PNEUMONIA PATTERNS:
- Viral pneumonia predominance
- Round pneumonia considerations
- Perihilar infiltrate patterns
- Rapid progression potential

SPECIAL CONSIDERATIONS:
- Aspiration risk assessment
- Congenital anomaly awareness
- Growth and development factors
- Family history relevance

PEDIATRIC TREATMENT FACTORS:
- Age-appropriate antibiotic choices
- Hospitalization criteria for children
- Respiratory support considerations
- Parent education needs

Pediatric Assessment: [Age-specific interpretation]
Development Considerations: [Normal variants for age]
Treatment Adaptations: [Pediatric-specific recommendations]
Family Guidance: [Parent education points]
        `;
    }

    getElderlyPrompt() {
        return `
You are a geriatric radiologist performing ELDERLY-SPECIFIC ANALYSIS.

{PATIENT_CONTEXT}

{PREVIOUS_FINDINGS}

GERIATRIC DYNAMIC ADAPTATIONS:

AGE-RELATED CHANGES:
- Chronic changes vs. Acute pathology
- Degenerative spine effects on positioning
- Cardiac enlargement considerations
- Pulmonary fibrosis background

ELDERLY PNEUMONIA CHARACTERISTICS:
- Atypical presentations
- Multi-lobar involvement tendency
- Aspiration pneumonia risk
- Delayed immune response patterns

COMORBIDITY CONSIDERATIONS:
- COPD background changes
- Heart failure overlap
- Medication effects
- Functional status impact

GERIATRIC CARE FACTORS:
- Hospitalization threshold adjustments
- Polypharmacy interactions
- Functional decline prevention
- Goals of care alignment

Geriatric Assessment: [Age-specific interpretation]
Comorbidity Impact: [How concurrent conditions affect findings]
Functional Considerations: [Impact on daily living]
Care Planning: [Elderly-specific recommendations]
        `;
    }

    getImmunocompromisedPrompt() {
        return `
You are a specialist radiologist performing IMMUNOCOMPROMISED PATIENT ANALYSIS.

{PATIENT_CONTEXT}

{PREVIOUS_FINDINGS}

IMMUNOCOMPROMISED DYNAMIC ADAPTATIONS:

ENHANCED SENSITIVITY REQUIREMENTS:
- Lower threshold for pathology detection
- Subtle finding significance
- Atypical organism considerations
- Rapid progression potential

OPPORTUNISTIC INFECTION PATTERNS:
- PCP pneumonia characteristics
- Fungal infection patterns
- Viral pneumonia presentations
- Bacterial infection variations

TREATMENT URGENCY FACTORS:
- Aggressive intervention thresholds
- Prophylaxis considerations
- Isolation requirements
- Multidisciplinary coordination needs

MONITORING INTENSIFICATION:
- Frequent follow-up scheduling
- Progression assessment protocols
- Treatment response evaluation
- Complication surveillance

Immunocompromised Assessment: [High-sensitivity interpretation]
Infection Risk Stratification: [Organism-specific considerations]
Treatment Urgency: [Intervention timeline recommendations]
Monitoring Protocol: [Enhanced surveillance plan]
        `;
    }

    getEmergencyPrompt() {
        return `
You are an emergency radiologist performing URGENT PNEUMONIA ASSESSMENT.

{PATIENT_CONTEXT}

{PREVIOUS_FINDINGS}

EMERGENCY DYNAMIC ADAPTATIONS:

RAPID ASSESSMENT PRIORITIES:
- Life-threatening condition identification
- Immediate intervention needs
- Severity and extent assessment
- Complication screening

EMERGENCY PNEUMONIA CONSIDERATIONS:
- Sepsis risk assessment
- Respiratory failure indicators
- Shock correlation factors
- Multi-organ involvement

URGENT INTERVENTION TRIGGERS:
- ICU admission criteria
- Immediate antibiotic needs
- Respiratory support requirements
- Hemodynamic support considerations

EMERGENCY COMMUNICATION:
- Critical finding notification
- Urgent consultation needs
- Immediate care coordination
- Family communication priorities

Emergency Assessment: [Urgent clinical interpretation]
Critical Findings: [Life-threatening features]
Immediate Actions: [Time-sensitive interventions]
Communication Plan: [Urgent notification requirements]
        `;
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

    async callGeminiAPI(base64Image, prompt) {
        console.log('Making Dynamic API call to Gemini...');
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        {
                            text: prompt
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
                    temperature: 0.4, // Slightly higher for adaptive responses
                    topK: 40,
                    topP: 0.9,
                    maxOutputTokens: 2000,
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

    parseInitialResponse(responseText) {
        return {
            method: 'Dynamic Prompting - Initial Assessment',
            diagnosis: this.extractField(responseText, 'Primary Diagnosis') || 'Unable to determine',
            confidence: this.parseConfidence(this.extractField(responseText, 'Confidence')),
            complexity: this.extractField(responseText, 'Complexity Level') || 'Standard',
            keyFindings: this.extractField(responseText, 'Key Findings') || 'See detailed analysis',
            recommendedFollowUp: this.extractField(responseText, 'Recommended Follow-up') || 'Standard analysis',
            clinicalReasoning: this.extractField(responseText, 'Clinical Reasoning') || 'No reasoning provided',
            fullResponse: responseText,
            timestamp: new Date().toISOString()
        };
    }

    parseFollowUpResponse(responseText, stepType) {
        // Parse based on step type
        const baseFields = {
            method: `Dynamic Prompting - ${stepType} Follow-up`,
            fullResponse: responseText,
            timestamp: new Date().toISOString()
        };

        switch (stepType) {
            case 'normal':
                return {
                    ...baseFields,
                    finalAssessment: this.extractField(responseText, 'Final Assessment') || 'Normal study confirmed',
                    clinicalCorrelation: this.extractField(responseText, 'Clinical Correlation') || 'No specific correlation',
                    recommendations: this.extractField(responseText, 'Recommendations') || 'Routine follow-up'
                };
            
            case 'pathology':
                return {
                    ...baseFields,
                    detailedDiagnosis: this.extractField(responseText, 'Detailed Diagnosis') || 'Pneumonia detected',
                    severityAssessment: this.extractField(responseText, 'Severity Assessment') || 'Moderate',
                    complications: this.extractField(responseText, 'Complications') || 'None detected',
                    treatmentRecommendations: this.extractField(responseText, 'Treatment Recommendations') || 'Standard treatment'
                };
            
            case 'ambiguous':
                return {
                    ...baseFields,
                    diagnosticImpression: this.extractField(responseText, 'Diagnostic Impression') || 'Uncertain findings',
                    uncertaintyFactors: this.extractField(responseText, 'Uncertainty Factors') || 'Multiple factors',
                    clinicalCorrelationNeeds: this.extractField(responseText, 'Clinical Correlation Needs') || 'Additional information needed',
                    managementRecommendations: this.extractField(responseText, 'Management Recommendations') || 'Clinical follow-up'
                };
            
            default:
                return {
                    ...baseFields,
                    analysis: this.extractField(responseText, 'Assessment') || responseText.substring(0, 200) + '...',
                    recommendations: this.extractField(responseText, 'Recommendations') || 'Follow clinical protocols'
                };
        }
    }

    extractField(text, fieldName) {
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

    completeAnalysis() {
        this.hideLoading();
        this.displayResults();
    }

    displayResults() {
        const resultsSection = document.getElementById('dynamicResults');
        const resultsContent = document.getElementById('dynamicResultsContent');
        
        if (!resultsSection || !resultsContent) return;
        
        const analysisSteps = this.analysisHistory;
        const totalTokens = analysisSteps.reduce((sum, step) => sum + (step.tokensUsed || 0), 0);
        const totalTime = analysisSteps.reduce((sum, step) => sum + (step.processingTime || 0), 0);
        
        resultsContent.innerHTML = `
            <div class="dynamic-analysis-result">
                <div class="result-header">
                    <h3>Dynamic Analysis Results</h3>
                    <span class="analysis-method">Dynamic Prompting (${analysisSteps.length} Steps)</span>
                </div>
                
                <div class="analysis-flow">
                    ${this.renderAnalysisFlow(analysisSteps)}
                </div>
                
                <div class="patient-context-display">
                    <h4>Patient Context Integration</h4>
                    ${this.renderPatientContextIntegration()}
                </div>
                
                <div class="adaptive-insights">
                    <h4>Dynamic Adaptation Insights</h4>
                    ${this.renderAdaptiveInsights(analysisSteps)}
                </div>
                
                <div class="technical-summary">
                    <h4>Technical Analysis Summary</h4>
                    <ul>
                        <li><strong>Analysis Steps:</strong> ${analysisSteps.length} (Initial + Adaptive Follow-up)</li>
                        <li><strong>Total Processing Time:</strong> ${totalTime}ms</li>
                        <li><strong>Total Tokens Used:</strong> ${totalTokens}</li>
                        <li><strong>Adaptive Method:</strong> Context-aware dynamic prompting</li>
                        <li><strong>Temperature:</strong> 0.4 (optimized for adaptive responses)</li>
                        <li><strong>Patient Context:</strong> ${Object.keys(this.patientContext).length} parameters integrated</li>
                    </ul>
                </div>
                
                <div class="medical-disclaimer">
                    <p><strong>⚠️ Dynamic Analysis Disclaimer:</strong> This AI system adapts its analysis based on patient context and initial findings. While this provides more personalized assessment, all dynamic recommendations require professional medical validation and clinical correlation.</p>
                </div>
            </div>
        `;
        
        resultsSection.classList.remove('hidden');
        
        console.log(`🔄 Dynamic Analysis Complete: ${analysisSteps.length} steps, ${totalTokens} tokens`);
    }

    renderAnalysisFlow(steps) {
        return steps.map((step, index) => `
            <div class="analysis-step">
                <div class="step-header">
                    <span class="step-number">${index + 1}</span>
                    <h5>${step.step}</h5>
                    <span class="step-time">${step.processingTime}ms</span>
                </div>
                <div class="step-content">
                    ${this.renderStepContent(step, index)}
                </div>
            </div>
        `).join('');
    }

    renderStepContent(step, index) {
        if (index === 0) {
            // Initial assessment
            return `
                <div class="initial-assessment">
                    <p><strong>Diagnosis:</strong> ${step.diagnosis}</p>
                    <p><strong>Confidence:</strong> ${step.confidence}%</p>
                    <p><strong>Complexity:</strong> ${step.complexity}</p>
                    <p><strong>Key Findings:</strong> ${step.keyFindings}</p>
                    <p><strong>Recommended Follow-up:</strong> ${step.recommendedFollowUp}</p>
                </div>
            `;
        } else {
            // Follow-up assessment
            return `
                <div class="followup-assessment">
                    ${Object.entries(step).filter(([key, value]) => 
                        !['method', 'fullResponse', 'timestamp', 'processingTime', 'tokensUsed', 'step', 'previousStep'].includes(key)
                    ).map(([key, value]) => `
                        <p><strong>${this.formatFieldName(key)}:</strong> ${value}</p>
                    `).join('')}
                </div>
            `;
        }
    }

    formatFieldName(fieldName) {
        return fieldName
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();
    }

    renderPatientContextIntegration() {
        const context = this.patientContext;
        const hasContext = Object.values(context).some(value => value && value !== '');
        
        if (!hasContext) {
            return '<p class="no-context">No patient context provided. Analysis used general protocols.</p>';
        }
        
        return `
            <div class="context-integration">
                <div class="context-impact">
                    <h5>Context-Based Adaptations Made:</h5>
                    <ul>
                        ${context.age ? `<li>Age-appropriate analysis for ${this.getAgeGroup(context.age)} patient</li>` : ''}
                        ${context.symptoms ? `<li>Symptom-focused assessment for ${context.symptoms}</li>` : ''}
                        ${context.onset ? `<li>Timeline consideration for ${context.onset} onset</li>` : ''}
                        ${context.medicalHistory && context.medicalHistory !== 'none' ? `<li>Risk stratification for ${context.medicalHistory} history</li>` : ''}
                        ${context.urgency && context.urgency !== 'routine' ? `<li>Priority adjustment for ${context.urgency} presentation</li>` : ''}
                    </ul>
                </div>
            </div>
        `;
    }

    renderAdaptiveInsights(steps) {
        const adaptations = [];
        
        if (steps.length > 1) {
            const followUpType = steps[1].step.split(': ')[1];
            adaptations.push(`Selected ${followUpType} follow-up protocol based on initial findings`);
        }
        
        const context = this.patientContext;
        if (context.age) {
            const ageGroup = this.getAgeGroup(context.age);
            if (ageGroup !== 'Adult') {
                adaptations.push(`Applied ${ageGroup}-specific diagnostic criteria`);
            }
        }
        
        if (context.urgency === 'emergency') {
            adaptations.push('Prioritized rapid assessment for emergency presentation');
        }
        
        if (adaptations.length === 0) {
            adaptations.push('Standard analysis protocol applied');
        }
        
        return `
            <div class="adaptive-insights-content">
                <ul>
                    ${adaptations.map(adaptation => `<li>${adaptation}</li>`).join('')}
                </ul>
                <p class="insight-summary">
                    <strong>Dynamic Benefit:</strong> The AI adapted its analysis approach ${steps.length} times based on initial findings and patient context, providing more personalized and clinically relevant assessment.
                </p>
            </div>
        `;
    }

    updateLoadingStatus(status) {
        const statusElement = document.getElementById('loadingStatus');
        if (statusElement) {
            statusElement.textContent = status;
        }
    }

    showLoading() {
        const loadingSection = document.getElementById('dynamicLoading');
        const resultsSection = document.getElementById('dynamicResults');
        
        if (loadingSection) loadingSection.classList.remove('hidden');
        if (resultsSection) resultsSection.classList.add('hidden');
    }

    hideLoading() {
        const loadingSection = document.getElementById('dynamicLoading');
        if (loadingSection) loadingSection.classList.add('hidden');
    }

    showError(message) {
        this.hideLoading();
        alert(`Dynamic Analysis Error: ${message}`);
    }

    clearResults() {
        this.currentImage = null;
        this.patientContext = {};
        this.analysisHistory = [];
        this.currentAnalysisStep = 1;
        
        // Clear file input
        const fileInput = document.getElementById('dynamicFileInput');
        if (fileInput) fileInput.value = '';
        
        // Clear form
        const form = document.getElementById('patientContextForm');
        if (form) form.reset();
        
        // Hide sections
        const sections = ['dynamicImagePreview', 'dynamicResults', 'dynamicLoading', 'contextSummary'];
        sections.forEach(id => {
            const element = document.getElementById(id);
            if (element) element.classList.add('hidden');
        });
        
        // Disable analyze button
        const analyzeBtn = document.getElementById('dynamicAnalyzeBtn');
        if (analyzeBtn) analyzeBtn.disabled = true;
    }
}

// Initialize the Dynamic Detector when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Dynamic Pneumonia Detection System...');
    new DynamicPneumoniaDetector();
});

// Also initialize if DOM is already loaded
if (document.readyState !== 'loading') {
    console.log('DOM already loaded, initializing Dynamic system...');
    new DynamicPneumoniaDetector();
}
