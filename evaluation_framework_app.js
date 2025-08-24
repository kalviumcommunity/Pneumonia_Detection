/**
 * Evaluation Dataset and Testing Framework for Pneumonia Detection
 * Comprehensive evaluation system for prompt engineering techniques
 */

class EvaluationFramework {
    constructor() {
        this.testCases = [];
        this.benchmarkResults = {};
        this.evaluationMetrics = {};
        this.expertValidation = {};
        
        this.initializeFramework();
    }

    /**
     * Initialize the evaluation framework with default configurations
     */
    initializeFramework() {
        this.config = {
            evaluation: {
                iterations: 5,              // Multiple runs for consistency
                timeout: 60000,             // 60 second timeout
                confidenceThreshold: 0.7,   // Minimum confidence for valid prediction
                qualityThreshold: 0.75      // Minimum reasoning quality score
            },
            metrics: {
                diagnostic: ['accuracy', 'precision', 'recall', 'f1_score', 'specificity', 'sensitivity'],
                reasoning: ['completeness', 'logical_flow', 'medical_accuracy', 'evidence_support'],
                educational: ['clarity', 'learning_value', 'engagement', 'comprehension'],
                efficiency: ['token_usage', 'response_time', 'consistency', 'cost_effectiveness']
            },
            benchmarks: {
                expert_radiologist: { accuracy: 0.94, reasoning_quality: 0.95 },
                senior_resident: { accuracy: 0.89, reasoning_quality: 0.82 },
                commercial_ai: { accuracy: 0.91, reasoning_quality: 0.78 },
                minimum_viable: { accuracy: 0.85, reasoning_quality: 0.75 }
            }
        };

        this.initializeTestDataset();
        this.setupEvaluationMetrics();
    }

    /**
     * Initialize comprehensive test dataset
     */
    initializeTestDataset() {
        this.testDataset = {
            training_cases: {
                normal: this.generateNormalCases(40),
                bacterial_pneumonia: this.generateBacterialCases(35),
                viral_pneumonia: this.generateViralCases(20),
                atypical_pneumonia: this.generateAtypicalCases(5)
            },
            validation_cases: {
                normal: this.generateNormalCases(20),
                bacterial_pneumonia: this.generateBacterialCases(18),
                viral_pneumonia: this.generateViralCases(10),
                challenging_cases: this.generateChallengingCases(2)
            },
            test_cases: {
                normal: this.generateNormalCases(12),
                pneumonia: this.generatePneumoniaCases(15),
                edge_cases: this.generateEdgeCases(3)
            }
        };

        this.expertConsensus = this.generateExpertConsensus();
        this.difficultyRatings = this.generateDifficultyRatings();
    }

    /**
     * Generate synthetic normal cases with metadata
     */
    generateNormalCases(count) {
        const cases = [];
        const presentations = [
            'clear_normal', 'minor_anatomical_variants', 'technical_challenges',
            'age_related_changes', 'post_inflammatory_changes'
        ];

        for (let i = 0; i < count; i++) {
            cases.push({
                case_id: `normal_${i + 1}`,
                diagnosis: 'normal',
                presentation_type: presentations[i % presentations.length],
                difficulty: this.assignDifficulty(i, count),
                clinical_context: this.generateClinicalContext('normal'),
                expected_findings: 'Clear lung fields, normal cardiac silhouette, no acute pathology',
                teaching_points: ['Normal chest anatomy', 'Systematic examination approach'],
                metadata: {
                    patient_age: 20 + Math.floor(Math.random() * 60),
                    image_quality: 'good',
                    positioning: 'adequate',
                    technical_factors: 'optimal'
                }
            });
        }
        return cases;
    }

    /**
     * Generate synthetic bacterial pneumonia cases
     */
    generateBacterialCases(count) {
        const cases = [];
        const patterns = [
            'lobar_consolidation', 'bronchopneumonia', 'round_pneumonia',
            'cavitary_pneumonia', 'multilobar_involvement'
        ];

        for (let i = 0; i < count; i++) {
            cases.push({
                case_id: `bacterial_${i + 1}`,
                diagnosis: 'bacterial_pneumonia',
                pattern_type: patterns[i % patterns.length],
                difficulty: this.assignDifficulty(i, count),
                clinical_context: this.generateClinicalContext('bacterial'),
                expected_findings: 'Consolidation with air bronchograms, increased opacity, possible pleural involvement',
                teaching_points: ['Bacterial pneumonia patterns', 'Consolidation recognition', 'Air bronchogram significance'],
                severity: ['mild', 'moderate', 'severe'][Math.floor(Math.random() * 3)],
                location: this.generateAnatomicalLocation(),
                metadata: {
                    patient_age: 30 + Math.floor(Math.random() * 50),
                    symptoms_duration: '3-7 days',
                    fever_present: true,
                    white_cell_count: 'elevated'
                }
            });
        }
        return cases;
    }

    /**
     * Generate synthetic viral pneumonia cases
     */
    generateViralCases(count) {
        const cases = [];
        const patterns = [
            'interstitial_pattern', 'bilateral_involvement', 'ground_glass',
            'reticulonodular_pattern', 'diffuse_involvement'
        ];

        for (let i = 0; i < count; i++) {
            cases.push({
                case_id: `viral_${i + 1}`,
                diagnosis: 'viral_pneumonia',
                pattern_type: patterns[i % patterns.length],
                difficulty: this.assignDifficulty(i, count),
                clinical_context: this.generateClinicalContext('viral'),
                expected_findings: 'Bilateral interstitial patterns, ground-glass opacities, preserved lung volumes',
                teaching_points: ['Viral pneumonia patterns', 'Interstitial vs alveolar disease', 'Bilateral involvement'],
                severity: ['mild', 'moderate'][Math.floor(Math.random() * 2)],
                distribution: 'bilateral',
                metadata: {
                    patient_age: 25 + Math.floor(Math.random() * 40),
                    symptoms_duration: '5-10 days',
                    gradual_onset: true,
                    systemic_symptoms: true
                }
            });
        }
        return cases;
    }

    /**
     * Generate atypical pneumonia cases
     */
    generateAtypicalCases(count) {
        const cases = [];
        const patterns = ['mixed_pattern', 'unusual_distribution', 'minimal_symptoms', 'immunocompromised'];

        for (let i = 0; i < count; i++) {
            cases.push({
                case_id: `atypical_${i + 1}`,
                diagnosis: 'atypical_pneumonia',
                pattern_type: patterns[i % patterns.length],
                difficulty: 'challenging',
                clinical_context: this.generateClinicalContext('atypical'),
                expected_findings: 'Subtle infiltrates, mixed patterns, atypical distribution',
                teaching_points: ['Atypical presentations', 'Subtle finding recognition', 'Clinical correlation importance'],
                special_considerations: 'Requires careful clinical correlation',
                metadata: {
                    patient_age: 40 + Math.floor(Math.random() * 30),
                    immunocompromised: Math.random() > 0.5,
                    subtle_symptoms: true,
                    challenging_diagnosis: true
                }
            });
        }
        return cases;
    }

    /**
     * Generate challenging edge cases
     */
    generateChallengingCases(count) {
        return this.generateEdgeCases(count);
    }

    generateEdgeCases(count) {
        const cases = [];
        const edgeTypes = ['borderline_normal', 'technical_artifacts', 'mimicking_conditions'];

        for (let i = 0; i < count; i++) {
            cases.push({
                case_id: `edge_${i + 1}`,
                diagnosis: edgeTypes[i % edgeTypes.length],
                difficulty: 'very_challenging',
                clinical_context: this.generateClinicalContext('edge'),
                expected_findings: 'Subtle or ambiguous findings requiring expert interpretation',
                teaching_points: ['Diagnostic uncertainty', 'Clinical correlation', 'Expert consultation'],
                requires_expert_review: true,
                metadata: {
                    diagnostic_confidence: 'low',
                    expert_disagreement: true,
                    educational_value: 'high'
                }
            });
        }
        return cases;
    }

    generatePneumoniaCases(count) {
        // Mix of bacterial and viral cases for final testing
        const bacterial = this.generateBacterialCases(Math.floor(count * 0.6));
        const viral = this.generateViralCases(Math.floor(count * 0.4));
        return [...bacterial, ...viral];
    }

    /**
     * Helper methods for case generation
     */
    assignDifficulty(index, total) {
        const ratio = index / total;
        if (ratio < 0.4) return 'easy';
        if (ratio < 0.85) return 'moderate';
        return 'challenging';
    }

    generateClinicalContext(type) {
        const contexts = {
            normal: 'Routine screening examination, asymptomatic patient',
            bacterial: 'Acute onset fever, productive cough, chest pain',
            viral: 'Gradual onset symptoms, dry cough, systemic involvement',
            atypical: 'Subtle symptoms, immunocompromised host, atypical presentation',
            edge: 'Ambiguous clinical picture, diagnostic uncertainty'
        };
        return contexts[type] || 'Standard clinical presentation';
    }

    generateAnatomicalLocation() {
        const locations = ['RUL', 'RML', 'RLL', 'LUL', 'LLL', 'bilateral', 'multilobar'];
        return locations[Math.floor(Math.random() * locations.length)];
    }

    /**
     * Generate expert consensus data
     */
    generateExpertConsensus() {
        return {
            validation_method: 'Multi-expert panel review',
            expert_count: 3,
            consensus_threshold: 0.8,
            difficult_case_threshold: 0.6,
            inter_rater_reliability: 0.92,
            consensus_process: 'Blinded independent review followed by discussion'
        };
    }

    /**
     * Generate difficulty ratings
     */
    generateDifficultyRatings() {
        return {
            easy: { score_range: [0.9, 1.0], description: 'Clear, textbook cases' },
            moderate: { score_range: [0.7, 0.9], description: 'Typical clinical presentations' },
            challenging: { score_range: [0.5, 0.7], description: 'Subtle findings, complex cases' },
            very_challenging: { score_range: [0.3, 0.5], description: 'Expert-level diagnostic challenges' }
        };
    }

    /**
     * Setup evaluation metrics calculation methods
     */
    setupEvaluationMetrics() {
        this.metricCalculators = {
            diagnostic: this.calculateDiagnosticMetrics.bind(this),
            reasoning: this.calculateReasoningMetrics.bind(this),
            educational: this.calculateEducationalMetrics.bind(this),
            efficiency: this.calculateEfficiencyMetrics.bind(this)
        };
    }

    /**
     * Evaluate a specific prompting technique
     */
    async evaluateTechnique(technique, testCases = null) {
        console.log(`🔬 Starting evaluation of ${technique} technique...`);
        
        const casesToTest = testCases || this.getTestCases();
        const results = {
            technique: technique,
            test_cases_count: casesToTest.length,
            start_time: new Date().toISOString(),
            individual_results: [],
            aggregate_metrics: {},
            performance_summary: {}
        };

        // Run evaluation on each test case
        for (let i = 0; i < casesToTest.length; i++) {
            const testCase = casesToTest[i];
            console.log(`Testing case ${i + 1}/${casesToTest.length}: ${testCase.case_id}`);
            
            const caseResult = await this.evaluateIndividualCase(technique, testCase);
            results.individual_results.push(caseResult);
        }

        // Calculate aggregate metrics
        results.aggregate_metrics = this.calculateAggregateMetrics(results.individual_results);
        results.performance_summary = this.generatePerformanceSummary(results.aggregate_metrics);
        results.end_time = new Date().toISOString();
        results.total_duration = this.calculateDuration(results.start_time, results.end_time);

        console.log(`✅ Evaluation of ${technique} completed`);
        return results;
    }

    /**
     * Evaluate individual test case
     */
    async evaluateIndividualCase(technique, testCase) {
        const caseResult = {
            case_id: testCase.case_id,
            expected_diagnosis: testCase.diagnosis,
            difficulty: testCase.difficulty,
            iterations: []
        };

        // Run multiple iterations for consistency check
        for (let i = 0; i < this.config.evaluation.iterations; i++) {
            try {
                const iteration = await this.runSingleIteration(technique, testCase);
                caseResult.iterations.push(iteration);
            } catch (error) {
                console.error(`Error in iteration ${i + 1} for case ${testCase.case_id}:`, error);
                caseResult.iterations.push({
                    iteration: i + 1,
                    error: error.message,
                    success: false
                });
            }
        }

        // Calculate case-level metrics
        caseResult.case_metrics = this.calculateCaseMetrics(caseResult.iterations, testCase);
        caseResult.consistency_score = this.calculateConsistencyScore(caseResult.iterations);

        return caseResult;
    }

    /**
     * Run single evaluation iteration
     */
    async runSingleIteration(technique, testCase) {
        const startTime = Date.now();
        
        // Simulate AI analysis (in real implementation, this would call the actual AI)
        const aiResponse = await this.simulateAIAnalysis(technique, testCase);
        
        const endTime = Date.now();
        const responseTime = endTime - startTime;

        // Evaluate the response
        const evaluation = {
            iteration: this.getCurrentIteration(),
            response_time: responseTime,
            ai_diagnosis: aiResponse.diagnosis,
            confidence_score: aiResponse.confidence,
            reasoning_text: aiResponse.reasoning,
            token_usage: aiResponse.tokenUsage,
            success: true
        };

        // Calculate metrics for this iteration
        evaluation.diagnostic_metrics = this.calculateIterationDiagnosticMetrics(aiResponse, testCase);
        evaluation.reasoning_metrics = this.calculateIterationReasoningMetrics(aiResponse, testCase);
        evaluation.educational_metrics = this.calculateIterationEducationalMetrics(aiResponse, testCase);

        return evaluation;
    }

    /**
     * Simulate AI analysis for demonstration
     */
    async simulateAIAnalysis(technique, testCase) {
        // Simulate different techniques with varying performance
        const techniquePerformance = {
            'zero-shot': { baseAccuracy: 0.82, reasoningQuality: 0.70 },
            'one-shot': { baseAccuracy: 0.86, reasoningQuality: 0.78 },
            'multi-shot': { baseAccuracy: 0.89, reasoningQuality: 0.82 },
            'dynamic': { baseAccuracy: 0.91, reasoningQuality: 0.85 },
            'chain-of-thought': { baseAccuracy: 0.93, reasoningQuality: 0.90 }
        };

        const performance = techniquePerformance[technique] || techniquePerformance['zero-shot'];
        
        // Simulate response based on case difficulty and technique performance
        const difficultyMultiplier = this.getDifficultyMultiplier(testCase.difficulty);
        const adjustedAccuracy = performance.baseAccuracy * difficultyMultiplier;
        
        // Generate simulated diagnosis
        const isCorrect = Math.random() < adjustedAccuracy;
        const diagnosis = isCorrect ? testCase.diagnosis : this.generateIncorrectDiagnosis(testCase.diagnosis);
        
        // Generate confidence score
        const baseConfidence = isCorrect ? 0.85 + Math.random() * 0.15 : 0.4 + Math.random() * 0.4;
        const confidence = Math.max(0.1, Math.min(0.99, baseConfidence * difficultyMultiplier));

        // Generate reasoning text based on technique
        const reasoning = this.generateSimulatedReasoning(technique, testCase, diagnosis);

        // Simulate token usage
        const tokenUsage = this.simulateTokenUsage(technique, reasoning);

        return {
            diagnosis,
            confidence,
            reasoning,
            tokenUsage,
            technique_used: technique,
            processing_time: 2000 + Math.random() * 3000 // 2-5 seconds
        };
    }

    /**
     * Helper methods for simulation
     */
    getDifficultyMultiplier(difficulty) {
        const multipliers = {
            'easy': 1.0,
            'moderate': 0.9,
            'challenging': 0.75,
            'very_challenging': 0.6
        };
        return multipliers[difficulty] || 0.8;
    }

    generateIncorrectDiagnosis(correctDiagnosis) {
        const alternatives = {
            'normal': 'bacterial_pneumonia',
            'bacterial_pneumonia': 'normal',
            'viral_pneumonia': 'bacterial_pneumonia',
            'atypical_pneumonia': 'viral_pneumonia'
        };
        return alternatives[correctDiagnosis] || 'normal';
    }

    generateSimulatedReasoning(technique, testCase, diagnosis) {
        const reasoningTemplates = {
            'zero-shot': `Based on the chest X-ray analysis, I observe ${this.generateObservations(testCase)}. This leads to a diagnosis of ${diagnosis}.`,
            'one-shot': `Comparing this case to the provided example, I note ${this.generateComparativeObservations(testCase)}. The diagnosis is ${diagnosis}.`,
            'multi-shot': `Drawing from multiple training examples, this case shows ${this.generatePatternBasedObservations(testCase)}. Diagnosis: ${diagnosis}.`,
            'dynamic': `Considering the clinical context: ${testCase.clinical_context}. The imaging findings suggest ${this.generateContextualObservations(testCase)}. Diagnosis: ${diagnosis}.`,
            'chain-of-thought': `Step 1: Technical assessment shows ${this.generateTechnicalAssessment(testCase)}. Step 2: Systematic examination reveals ${this.generateSystematicFindings(testCase)}. [Continue through 8 steps...] Final diagnosis: ${diagnosis}.`
        };

        return reasoningTemplates[technique] || reasoningTemplates['zero-shot'];
    }

    generateObservations(testCase) {
        return testCase.expected_findings || 'standard radiological findings';
    }

    generateComparativeObservations(testCase) {
        return `similar patterns to the example case with ${testCase.expected_findings}`;
    }

    generatePatternBasedObservations(testCase) {
        return `patterns consistent with ${testCase.pattern_type || 'typical findings'} as seen in training examples`;
    }

    generateContextualObservations(testCase) {
        return `findings consistent with the clinical presentation: ${testCase.expected_findings}`;
    }

    generateTechnicalAssessment(testCase) {
        return `good image quality with ${testCase.metadata?.positioning || 'adequate'} positioning`;
    }

    generateSystematicFindings(testCase) {
        return testCase.expected_findings || 'systematic examination findings';
    }

    simulateTokenUsage(technique, reasoning) {
        const baseTokens = {
            'zero-shot': 800,
            'one-shot': 1200,
            'multi-shot': 1800,
            'dynamic': 1500,
            'chain-of-thought': 2500
        };

        const base = baseTokens[technique] || 800;
        const variation = Math.floor(Math.random() * 400) - 200; // ±200 tokens
        return Math.max(200, base + variation);
    }

    /**
     * Metric calculation methods
     */
    calculateDiagnosticMetrics(predictions, groundTruth) {
        const metrics = {};
        
        // Basic accuracy
        const correct = predictions.filter((pred, i) => pred === groundTruth[i]).length;
        metrics.accuracy = correct / predictions.length;

        // Calculate confusion matrix elements
        const confusionMatrix = this.calculateConfusionMatrix(predictions, groundTruth);
        
        // Calculate precision, recall, F1-score
        metrics.precision = this.calculatePrecision(confusionMatrix);
        metrics.recall = this.calculateRecall(confusionMatrix);
        metrics.f1_score = this.calculateF1Score(metrics.precision, metrics.recall);
        metrics.specificity = this.calculateSpecificity(confusionMatrix);
        metrics.sensitivity = metrics.recall; // Same as recall for binary classification

        return metrics;
    }

    calculateReasoningMetrics(reasoningTexts, expertStandards) {
        const metrics = {};
        
        metrics.completeness = this.assessCompleteness(reasoningTexts);
        metrics.logical_flow = this.assessLogicalFlow(reasoningTexts);
        metrics.medical_accuracy = this.assessMedicalAccuracy(reasoningTexts, expertStandards);
        metrics.evidence_support = this.assessEvidenceSupport(reasoningTexts);

        return metrics;
    }

    calculateEducationalMetrics(responses, learningObjectives) {
        const metrics = {};
        
        metrics.clarity = this.assessClarity(responses);
        metrics.learning_value = this.assessLearningValue(responses, learningObjectives);
        metrics.engagement = this.assessEngagement(responses);
        metrics.comprehension = this.assessComprehension(responses);

        return metrics;
    }

    calculateEfficiencyMetrics(responses) {
        const metrics = {};
        
        metrics.average_token_usage = this.calculateAverageTokens(responses);
        metrics.average_response_time = this.calculateAverageResponseTime(responses);
        metrics.consistency = this.calculateResponseConsistency(responses);
        metrics.cost_effectiveness = this.calculateCostEffectiveness(responses);

        return metrics;
    }

    /**
     * Helper methods for metric calculations
     */
    calculateConfusionMatrix(predictions, groundTruth) {
        const matrix = { tp: 0, tn: 0, fp: 0, fn: 0 };
        
        for (let i = 0; i < predictions.length; i++) {
            const pred = predictions[i] !== 'normal';
            const actual = groundTruth[i] !== 'normal';
            
            if (pred && actual) matrix.tp++;
            else if (!pred && !actual) matrix.tn++;
            else if (pred && !actual) matrix.fp++;
            else if (!pred && actual) matrix.fn++;
        }
        
        return matrix;
    }

    calculatePrecision(confusionMatrix) {
        const { tp, fp } = confusionMatrix;
        return tp + fp > 0 ? tp / (tp + fp) : 0;
    }

    calculateRecall(confusionMatrix) {
        const { tp, fn } = confusionMatrix;
        return tp + fn > 0 ? tp / (tp + fn) : 0;
    }

    calculateF1Score(precision, recall) {
        return precision + recall > 0 ? 2 * (precision * recall) / (precision + recall) : 0;
    }

    calculateSpecificity(confusionMatrix) {
        const { tn, fp } = confusionMatrix;
        return tn + fp > 0 ? tn / (tn + fp) : 0;
    }

    /**
     * Assessment methods for reasoning quality
     */
    assessCompleteness(reasoningTexts) {
        // Simulate completeness assessment
        return reasoningTexts.map(text => {
            const wordCount = text.split(' ').length;
            const hasSystematicApproach = text.includes('systematic') || text.includes('step');
            const hasFindings = text.includes('findings') || text.includes('observe');
            
            let score = 0.6; // Base score
            if (wordCount > 50) score += 0.2;
            if (hasSystematicApproach) score += 0.1;
            if (hasFindings) score += 0.1;
            
            return Math.min(1.0, score);
        }).reduce((sum, score) => sum + score, 0) / reasoningTexts.length;
    }

    assessLogicalFlow(reasoningTexts) {
        // Simulate logical flow assessment
        return reasoningTexts.map(text => {
            const hasLogicalSequence = text.includes('first') || text.includes('then') || text.includes('therefore');
            const hasConclusion = text.includes('diagnosis') || text.includes('conclude');
            
            let score = 0.7; // Base score
            if (hasLogicalSequence) score += 0.15;
            if (hasConclusion) score += 0.15;
            
            return Math.min(1.0, score);
        }).reduce((sum, score) => sum + score, 0) / reasoningTexts.length;
    }

    assessMedicalAccuracy(reasoningTexts, expertStandards) {
        // Simulate medical accuracy assessment
        return reasoningTexts.map((text, i) => {
            const expertStandard = expertStandards?.[i] || {};
            const hasCorrectTerminology = text.includes('pneumonia') || text.includes('consolidation');
            const hasAnatomicalReferences = text.includes('lung') || text.includes('lobe');
            
            let score = 0.75; // Base score
            if (hasCorrectTerminology) score += 0.125;
            if (hasAnatomicalReferences) score += 0.125;
            
            return Math.min(1.0, score);
        }).reduce((sum, score) => sum + score, 0) / reasoningTexts.length;
    }

    assessEvidenceSupport(reasoningTexts) {
        // Simulate evidence support assessment
        return reasoningTexts.map(text => {
            const hasObservations = text.includes('observe') || text.includes('shows') || text.includes('demonstrates');
            const hasReasoning = text.includes('because') || text.includes('suggests') || text.includes('indicates');
            
            let score = 0.6; // Base score
            if (hasObservations) score += 0.2;
            if (hasReasoning) score += 0.2;
            
            return Math.min(1.0, score);
        }).reduce((sum, score) => sum + score, 0) / reasoningTexts.length;
    }

    /**
     * Assessment methods for educational metrics
     */
    assessClarity(responses) {
        return responses.map(response => {
            const wordCount = response.reasoning?.split(' ').length || 0;
            const sentenceLength = wordCount / (response.reasoning?.split('.').length || 1);
            
            let score = 0.8;
            if (sentenceLength < 25) score += 0.1; // Shorter sentences are clearer
            if (wordCount > 100 && wordCount < 300) score += 0.1; // Optimal length
            
            return Math.min(1.0, score);
        }).reduce((sum, score) => sum + score, 0) / responses.length;
    }

    assessLearningValue(responses, learningObjectives) {
        return responses.map(response => {
            const hasTeachingPoints = response.reasoning?.includes('systematic') || response.reasoning?.includes('pattern');
            const hasExplanation = response.reasoning?.includes('because') || response.reasoning?.includes('due to');
            
            let score = 0.7;
            if (hasTeachingPoints) score += 0.15;
            if (hasExplanation) score += 0.15;
            
            return Math.min(1.0, score);
        }).reduce((sum, score) => sum + score, 0) / responses.length;
    }

    assessEngagement(responses) {
        // Simulate engagement assessment based on response characteristics
        return 0.82 + Math.random() * 0.15; // Simulated score between 0.82-0.97
    }

    assessComprehension(responses) {
        // Simulate comprehension assessment
        return 0.78 + Math.random() * 0.18; // Simulated score between 0.78-0.96
    }

    /**
     * Efficiency metric calculations
     */
    calculateAverageTokens(responses) {
        const totalTokens = responses.reduce((sum, response) => sum + (response.tokenUsage || 0), 0);
        return totalTokens / responses.length;
    }

    calculateAverageResponseTime(responses) {
        const totalTime = responses.reduce((sum, response) => sum + (response.response_time || 0), 0);
        return totalTime / responses.length;
    }

    calculateResponseConsistency(responses) {
        // Calculate consistency based on variance in responses
        if (responses.length < 2) return 1.0;
        
        const confidenceScores = responses.map(r => r.confidence_score || 0.5);
        const mean = confidenceScores.reduce((sum, score) => sum + score, 0) / confidenceScores.length;
        const variance = confidenceScores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / confidenceScores.length;
        
        return Math.max(0, 1 - variance * 2); // Lower variance = higher consistency
    }

    calculateCostEffectiveness(responses) {
        const avgTokens = this.calculateAverageTokens(responses);
        const avgAccuracy = responses.reduce((sum, r) => sum + (r.diagnostic_metrics?.accuracy || 0), 0) / responses.length;
        
        // Cost effectiveness = accuracy per token (normalized)
        return (avgAccuracy / (avgTokens / 1000)) * 10; // Normalized to reasonable scale
    }

    /**
     * Aggregate and summary calculations
     */
    calculateAggregateMetrics(individualResults) {
        const aggregateMetrics = {
            diagnostic: {},
            reasoning: {},
            educational: {},
            efficiency: {},
            overall_performance: {}
        };

        // Extract all predictions and ground truth
        const allPredictions = [];
        const allGroundTruth = [];
        const allReasoningTexts = [];
        const allResponses = [];

        individualResults.forEach(result => {
            result.iterations.forEach(iteration => {
                if (iteration.success) {
                    allPredictions.push(iteration.ai_diagnosis);
                    allGroundTruth.push(result.expected_diagnosis);
                    allReasoningTexts.push(iteration.reasoning_text);
                    allResponses.push(iteration);
                }
            });
        });

        // Calculate aggregate metrics
        aggregateMetrics.diagnostic = this.calculateDiagnosticMetrics(allPredictions, allGroundTruth);
        aggregateMetrics.reasoning = this.calculateReasoningMetrics(allReasoningTexts, []);
        aggregateMetrics.educational = this.calculateEducationalMetrics(allResponses, []);
        aggregateMetrics.efficiency = this.calculateEfficiencyMetrics(allResponses);

        // Calculate overall performance score
        aggregateMetrics.overall_performance = this.calculateOverallPerformance(aggregateMetrics);

        return aggregateMetrics;
    }

    calculateOverallPerformance(aggregateMetrics) {
        const weights = {
            diagnostic: 0.4,
            reasoning: 0.3,
            educational: 0.2,
            efficiency: 0.1
        };

        const scores = {
            diagnostic: aggregateMetrics.diagnostic.f1_score || 0,
            reasoning: (aggregateMetrics.reasoning.completeness + aggregateMetrics.reasoning.logical_flow + 
                       aggregateMetrics.reasoning.medical_accuracy + aggregateMetrics.reasoning.evidence_support) / 4,
            educational: (aggregateMetrics.educational.clarity + aggregateMetrics.educational.learning_value + 
                         aggregateMetrics.educational.engagement + aggregateMetrics.educational.comprehension) / 4,
            efficiency: Math.min(1.0, aggregateMetrics.efficiency.consistency || 0)
        };

        const overallScore = Object.keys(weights).reduce((sum, key) => {
            return sum + (scores[key] * weights[key]);
        }, 0);

        return {
            overall_score: overallScore,
            component_scores: scores,
            weights_used: weights,
            performance_grade: this.getPerformanceGrade(overallScore)
        };
    }

    getPerformanceGrade(score) {
        if (score >= 0.95) return 'A+';
        if (score >= 0.90) return 'A';
        if (score >= 0.85) return 'B+';
        if (score >= 0.80) return 'B';
        if (score >= 0.75) return 'C+';
        if (score >= 0.70) return 'C';
        return 'D';
    }

    generatePerformanceSummary(aggregateMetrics) {
        const diagnostic = aggregateMetrics.diagnostic;
        const overall = aggregateMetrics.overall_performance;

        return {
            executive_summary: {
                overall_grade: overall.performance_grade,
                overall_score: Math.round(overall.overall_score * 100) / 100,
                diagnostic_accuracy: Math.round(diagnostic.accuracy * 100) / 100,
                key_strengths: this.identifyStrengths(aggregateMetrics),
                improvement_areas: this.identifyImprovementAreas(aggregateMetrics)
            },
            benchmark_comparison: this.compareToBenchmarks(aggregateMetrics),
            recommendations: this.generateRecommendations(aggregateMetrics)
        };
    }

    identifyStrengths(metrics) {
        const strengths = [];
        
        if (metrics.diagnostic.accuracy > 0.90) strengths.push('High diagnostic accuracy');
        if (metrics.reasoning.medical_accuracy > 0.85) strengths.push('Strong medical reasoning');
        if (metrics.educational.clarity > 0.85) strengths.push('Clear explanations');
        if (metrics.efficiency.consistency > 0.80) strengths.push('Consistent performance');

        return strengths.length > 0 ? strengths : ['Meets basic performance requirements'];
    }

    identifyImprovementAreas(metrics) {
        const areas = [];
        
        if (metrics.diagnostic.accuracy < 0.85) areas.push('Diagnostic accuracy needs improvement');
        if (metrics.reasoning.completeness < 0.75) areas.push('More comprehensive reasoning needed');
        if (metrics.educational.learning_value < 0.80) areas.push('Educational value could be enhanced');
        if (metrics.efficiency.cost_effectiveness < 5) areas.push('Token efficiency could be optimized');

        return areas.length > 0 ? areas : ['Continue current performance level'];
    }

    compareToBenchmarks(metrics) {
        const benchmarks = this.config.benchmarks;
        const comparison = {};

        Object.keys(benchmarks).forEach(benchmark => {
            comparison[benchmark] = {
                accuracy_vs_benchmark: metrics.diagnostic.accuracy - benchmarks[benchmark].accuracy,
                reasoning_vs_benchmark: (metrics.reasoning.medical_accuracy || 0) - benchmarks[benchmark].reasoning_quality,
                meets_standard: metrics.diagnostic.accuracy >= benchmarks[benchmark].accuracy
            };
        });

        return comparison;
    }

    generateRecommendations(metrics) {
        const recommendations = [];

        if (metrics.diagnostic.accuracy < 0.90) {
            recommendations.push('Consider additional training examples or prompt refinement');
        }

        if (metrics.reasoning.completeness < 0.80) {
            recommendations.push('Enhance systematic examination prompts');
        }

        if (metrics.educational.learning_value < 0.80) {
            recommendations.push('Add more teaching points and explanations');
        }

        if (metrics.efficiency.cost_effectiveness < 5) {
            recommendations.push('Optimize prompt length and token usage');
        }

        return recommendations.length > 0 ? recommendations : ['Maintain current approach'];
    }

    /**
     * Comparative analysis between techniques
     */
    async compareMultipleTechniques(techniques) {
        console.log('🔬 Starting comparative analysis of multiple techniques...');
        
        const comparison = {
            techniques_evaluated: techniques,
            individual_results: {},
            comparative_analysis: {},
            statistical_significance: {},
            recommendations: {}
        };

        // Evaluate each technique
        for (const technique of techniques) {
            comparison.individual_results[technique] = await this.evaluateTechnique(technique);
        }

        // Perform comparative analysis
        comparison.comparative_analysis = this.performComparativeAnalysis(comparison.individual_results);
        comparison.statistical_significance = this.calculateStatisticalSignificance(comparison.individual_results);
        comparison.recommendations = this.generateComparisonRecommendations(comparison.comparative_analysis);

        console.log('✅ Comparative analysis completed');
        return comparison;
    }

    performComparativeAnalysis(individualResults) {
        const techniques = Object.keys(individualResults);
        const analysis = {
            performance_ranking: {},
            metric_comparison: {},
            trade_off_analysis: {}
        };

        // Create performance ranking
        analysis.performance_ranking = this.rankTechniques(individualResults);
        
        // Compare specific metrics
        analysis.metric_comparison = this.compareMetricsAcrossTechniques(individualResults);
        
        // Analyze trade-offs
        analysis.trade_off_analysis = this.analyzeTradeOffs(individualResults);

        return analysis;
    }

    rankTechniques(individualResults) {
        const techniques = Object.keys(individualResults);
        const rankings = {};

        // Rank by overall performance
        const overallScores = techniques.map(technique => ({
            technique,
            score: individualResults[technique].aggregate_metrics.overall_performance.overall_score
        })).sort((a, b) => b.score - a.score);

        rankings.overall_performance = overallScores;

        // Rank by specific metrics
        rankings.diagnostic_accuracy = techniques.map(technique => ({
            technique,
            score: individualResults[technique].aggregate_metrics.diagnostic.accuracy
        })).sort((a, b) => b.score - a.score);

        rankings.reasoning_quality = techniques.map(technique => ({
            technique,
            score: individualResults[technique].aggregate_metrics.reasoning.medical_accuracy
        })).sort((a, b) => b.score - a.score);

        return rankings;
    }

    compareMetricsAcrossTechniques(individualResults) {
        const techniques = Object.keys(individualResults);
        const comparison = {};

        // Compare diagnostic metrics
        comparison.diagnostic = {};
        ['accuracy', 'precision', 'recall', 'f1_score'].forEach(metric => {
            comparison.diagnostic[metric] = techniques.reduce((obj, technique) => {
                obj[technique] = individualResults[technique].aggregate_metrics.diagnostic[metric];
                return obj;
            }, {});
        });

        // Compare reasoning metrics
        comparison.reasoning = {};
        ['completeness', 'logical_flow', 'medical_accuracy', 'evidence_support'].forEach(metric => {
            comparison.reasoning[metric] = techniques.reduce((obj, technique) => {
                obj[technique] = individualResults[technique].aggregate_metrics.reasoning[metric];
                return obj;
            }, {});
        });

        // Compare efficiency metrics
        comparison.efficiency = {};
        ['average_token_usage', 'average_response_time', 'consistency'].forEach(metric => {
            comparison.efficiency[metric] = techniques.reduce((obj, technique) => {
                obj[technique] = individualResults[technique].aggregate_metrics.efficiency[metric];
                return obj;
            }, {});
        });

        return comparison;
    }

    analyzeTradeOffs(individualResults) {
        const techniques = Object.keys(individualResults);
        const tradeOffs = {};

        techniques.forEach(technique => {
            const metrics = individualResults[technique].aggregate_metrics;
            
            tradeOffs[technique] = {
                accuracy_vs_efficiency: {
                    accuracy: metrics.diagnostic.accuracy,
                    token_usage: metrics.efficiency.average_token_usage,
                    efficiency_ratio: metrics.diagnostic.accuracy / (metrics.efficiency.average_token_usage / 1000)
                },
                quality_vs_speed: {
                    reasoning_quality: metrics.reasoning.medical_accuracy,
                    response_time: metrics.efficiency.average_response_time,
                    speed_quality_ratio: metrics.reasoning.medical_accuracy / (metrics.efficiency.average_response_time / 1000)
                }
            };
        });

        return tradeOffs;
    }

    /**
     * Generate comprehensive evaluation report
     */
    generateEvaluationReport(evaluationResults) {
        const timestamp = new Date().toISOString();
        
        const report = {
            metadata: {
                report_generated: timestamp,
                evaluation_framework_version: '1.0.0',
                total_test_cases: evaluationResults.test_cases_count,
                evaluation_duration: evaluationResults.total_duration
            },
            executive_summary: evaluationResults.performance_summary.executive_summary,
            detailed_metrics: evaluationResults.aggregate_metrics,
            benchmark_comparison: evaluationResults.performance_summary.benchmark_comparison,
            recommendations: evaluationResults.performance_summary.recommendations,
            technical_details: {
                configuration: this.config,
                test_dataset_composition: this.getDatasetComposition(),
                evaluation_methodology: this.getEvaluationMethodology()
            }
        };

        return report;
    }

    /**
     * Utility methods
     */
    getTestCases() {
        // Combine all test cases for evaluation
        return [
            ...this.testDataset.test_cases.normal,
            ...this.testDataset.test_cases.pneumonia,
            ...this.testDataset.test_cases.edge_cases
        ];
    }

    getDatasetComposition() {
        return {
            total_cases: this.getTotalCaseCount(),
            by_diagnosis: this.getCaseCountByDiagnosis(),
            by_difficulty: this.getCaseCountByDifficulty(),
            expert_validation: this.expertConsensus
        };
    }

    getTotalCaseCount() {
        let total = 0;
        Object.values(this.testDataset).forEach(category => {
            Object.values(category).forEach(cases => {
                total += cases.length;
            });
        });
        return total;
    }

    getCaseCountByDiagnosis() {
        const counts = {};
        Object.values(this.testDataset).forEach(category => {
            Object.entries(category).forEach(([diagnosis, cases]) => {
                counts[diagnosis] = (counts[diagnosis] || 0) + cases.length;
            });
        });
        return counts;
    }

    getCaseCountByDifficulty() {
        const counts = { easy: 0, moderate: 0, challenging: 0, very_challenging: 0 };
        Object.values(this.testDataset).forEach(category => {
            Object.values(category).forEach(cases => {
                cases.forEach(case_ => {
                    counts[case_.difficulty] = (counts[case_.difficulty] || 0) + 1;
                });
            });
        });
        return counts;
    }

    getEvaluationMethodology() {
        return {
            iterations_per_case: this.config.evaluation.iterations,
            timeout_settings: this.config.evaluation.timeout,
            quality_thresholds: this.config.evaluation.qualityThreshold,
            metric_categories: this.config.metrics,
            benchmarking_standards: this.config.benchmarks
        };
    }

    getCurrentIteration() {
        return this._currentIteration || 1;
    }

    calculateDuration(startTime, endTime) {
        const start = new Date(startTime);
        const end = new Date(endTime);
        return Math.round((end - start) / 1000); // Duration in seconds
    }

    calculateCaseMetrics(iterations, testCase) {
        const successfulIterations = iterations.filter(iter => iter.success);
        
        if (successfulIterations.length === 0) {
            return { error: 'No successful iterations' };
        }

        return {
            diagnostic_consistency: this.calculateDiagnosticConsistency(successfulIterations),
            average_confidence: this.calculateAverageConfidence(successfulIterations),
            reasoning_quality: this.calculateAverageReasoningQuality(successfulIterations),
            performance_stability: this.calculatePerformanceStability(successfulIterations)
        };
    }

    calculateConsistencyScore(iterations) {
        const successfulIterations = iterations.filter(iter => iter.success);
        
        if (successfulIterations.length < 2) return 1.0;

        const diagnoses = successfulIterations.map(iter => iter.ai_diagnosis);
        const uniqueDiagnoses = [...new Set(diagnoses)];
        
        return 1.0 - (uniqueDiagnoses.length - 1) / successfulIterations.length;
    }

    calculateDiagnosticConsistency(iterations) {
        const diagnoses = iterations.map(iter => iter.ai_diagnosis);
        const mode = this.getMode(diagnoses);
        const consistency = diagnoses.filter(d => d === mode).length / diagnoses.length;
        return consistency;
    }

    calculateAverageConfidence(iterations) {
        const confidences = iterations.map(iter => iter.confidence_score);
        return confidences.reduce((sum, conf) => sum + conf, 0) / confidences.length;
    }

    calculateAverageReasoningQuality(iterations) {
        const qualities = iterations.map(iter => {
            const metrics = iter.reasoning_metrics || {};
            return (metrics.completeness + metrics.logical_flow + 
                   metrics.medical_accuracy + metrics.evidence_support) / 4;
        });
        return qualities.reduce((sum, qual) => sum + qual, 0) / qualities.length;
    }

    calculatePerformanceStability(iterations) {
        const responseTimes = iterations.map(iter => iter.response_time);
        const mean = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
        const variance = responseTimes.reduce((sum, time) => sum + Math.pow(time - mean, 2), 0) / responseTimes.length;
        const stdDev = Math.sqrt(variance);
        
        return Math.max(0, 1 - (stdDev / mean)); // Lower relative std dev = higher stability
    }

    getMode(array) {
        const frequency = {};
        let maxFreq = 0;
        let mode = array[0];

        array.forEach(item => {
            frequency[item] = (frequency[item] || 0) + 1;
            if (frequency[item] > maxFreq) {
                maxFreq = frequency[item];
                mode = item;
            }
        });

        return mode;
    }

    calculateIterationDiagnosticMetrics(aiResponse, testCase) {
        const isCorrect = aiResponse.diagnosis === testCase.diagnosis;
        return {
            accuracy: isCorrect ? 1.0 : 0.0,
            confidence_appropriate: this.assessConfidenceAppropriateness(aiResponse.confidence, isCorrect),
            diagnosis_match: isCorrect
        };
    }

    calculateIterationReasoningMetrics(aiResponse, testCase) {
        return {
            completeness: this.assessSingleReasoningCompleteness(aiResponse.reasoning),
            logical_flow: this.assessSingleReasoningLogic(aiResponse.reasoning),
            medical_accuracy: this.assessSingleMedicalAccuracy(aiResponse.reasoning, testCase),
            evidence_support: this.assessSingleEvidenceSupport(aiResponse.reasoning)
        };
    }

    calculateIterationEducationalMetrics(aiResponse, testCase) {
        return {
            clarity: this.assessSingleClarity(aiResponse.reasoning),
            learning_value: this.assessSingleLearningValue(aiResponse.reasoning, testCase),
            engagement: this.assessSingleEngagement(aiResponse.reasoning),
            comprehension: this.assessSingleComprehension(aiResponse.reasoning)
        };
    }

    assessConfidenceAppropriateness(confidence, isCorrect) {
        if (isCorrect) {
            return confidence >= 0.7 ? 1.0 : confidence / 0.7;
        } else {
            return confidence <= 0.6 ? 1.0 : (1.0 - confidence) / 0.4;
        }
    }

    assessSingleReasoningCompleteness(reasoning) {
        const indicators = ['systematic', 'examination', 'findings', 'assessment', 'conclusion'];
        const present = indicators.filter(indicator => reasoning.toLowerCase().includes(indicator)).length;
        return present / indicators.length;
    }

    assessSingleReasoningLogic(reasoning) {
        const logicIndicators = ['because', 'therefore', 'due to', 'suggests', 'indicates', 'shows'];
        const present = logicIndicators.filter(indicator => reasoning.toLowerCase().includes(indicator)).length;
        return Math.min(1.0, present / 3); // At least 3 for good logic flow
    }

    assessSingleMedicalAccuracy(reasoning, testCase) {
        const medicalTerms = ['pneumonia', 'consolidation', 'infiltrate', 'opacity', 'lung', 'chest'];
        const present = medicalTerms.filter(term => reasoning.toLowerCase().includes(term)).length;
        return Math.min(1.0, present / 4); // At least 4 medical terms for good accuracy
    }

    assessSingleEvidenceSupport(reasoning) {
        const evidenceIndicators = ['observe', 'note', 'shows', 'demonstrates', 'reveals', 'exhibits'];
        const present = evidenceIndicators.filter(indicator => reasoning.toLowerCase().includes(indicator)).length;
        return Math.min(1.0, present / 2); // At least 2 evidence indicators
    }

    assessSingleClarity(reasoning) {
        const wordCount = reasoning.split(' ').length;
        const sentenceCount = reasoning.split('.').length;
        const avgSentenceLength = wordCount / sentenceCount;
        
        // Optimal sentence length for clarity is 15-25 words
        if (avgSentenceLength >= 15 && avgSentenceLength <= 25) return 1.0;
        if (avgSentenceLength < 15) return 0.8 + (avgSentenceLength / 15) * 0.2;
        return Math.max(0.6, 1.0 - (avgSentenceLength - 25) / 50);
    }

    assessSingleLearningValue(reasoning, testCase) {
        const teachingIndicators = ['pattern', 'systematic', 'approach', 'method', 'technique'];
        const present = teachingIndicators.filter(indicator => reasoning.toLowerCase().includes(indicator)).length;
        return Math.min(1.0, present / 3 + 0.4); // Base score + bonus for teaching elements
    }

    assessSingleEngagement(reasoning) {
        // Simulate engagement based on text characteristics
        const hasQuestions = reasoning.includes('?');
        const hasPersonalPronouns = /\b(I|we|you)\b/i.test(reasoning);
        const isActive = !reasoning.toLowerCase().includes('passive voice indicators');
        
        let score = 0.7;
        if (hasQuestions) score += 0.1;
        if (hasPersonalPronouns) score += 0.1;
        if (isActive) score += 0.1;
        
        return Math.min(1.0, score);
    }

    assessSingleComprehension(reasoning) {
        // Simulate comprehension assessment
        const complexity = this.assessTextComplexity(reasoning);
        const structure = this.assessTextStructure(reasoning);
        
        return (complexity + structure) / 2;
    }

    assessTextComplexity(text) {
        const words = text.split(' ');
        const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
        
        // Optimal average word length for comprehension is 4-6 characters
        if (avgWordLength >= 4 && avgWordLength <= 6) return 1.0;
        if (avgWordLength < 4) return 0.8;
        return Math.max(0.6, 1.0 - (avgWordLength - 6) / 10);
    }

    assessTextStructure(text) {
        const hasIntroduction = text.toLowerCase().includes('first') || text.toLowerCase().includes('begin');
        const hasConclusion = text.toLowerCase().includes('conclusion') || text.toLowerCase().includes('therefore');
        const hasLogicalFlow = text.includes(',') && text.includes('.');
        
        let score = 0.6;
        if (hasIntroduction) score += 0.15;
        if (hasConclusion) score += 0.15;
        if (hasLogicalFlow) score += 0.1;
        
        return Math.min(1.0, score);
    }

    calculateStatisticalSignificance(individualResults) {
        // Placeholder for statistical significance testing
        // In a real implementation, this would perform t-tests, chi-square tests, etc.
        return {
            methodology: 'Paired t-tests for metric differences',
            significance_level: 0.05,
            results: 'Statistical analysis would be performed on real data',
            note: 'This is a demonstration framework - actual statistical tests would be implemented'
        };
    }

    generateComparisonRecommendations(comparativeAnalysis) {
        const recommendations = [];
        
        const topPerformer = comparativeAnalysis.performance_ranking.overall_performance[0];
        recommendations.push(`Best overall performance: ${topPerformer.technique} (score: ${topPerformer.score.toFixed(3)})`);
        
        const topAccuracy = comparativeAnalysis.performance_ranking.diagnostic_accuracy[0];
        if (topAccuracy.technique !== topPerformer.technique) {
            recommendations.push(`Highest diagnostic accuracy: ${topAccuracy.technique} (accuracy: ${topAccuracy.score.toFixed(3)})`);
        }
        
        recommendations.push('Consider technique selection based on specific use case requirements');
        recommendations.push('Monitor performance trade-offs between accuracy and efficiency');
        
        return recommendations;
    }
}

// Initialize the evaluation framework
const evaluationFramework = new EvaluationFramework();

// Export for use in HTML interface
if (typeof window !== 'undefined') {
    window.EvaluationFramework = EvaluationFramework;
    window.evaluationFramework = evaluationFramework;
}
