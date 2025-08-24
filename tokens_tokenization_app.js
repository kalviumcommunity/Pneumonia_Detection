/**
 * Tokens and Tokenization System for Medical AI Applications
 * Comprehensive tokenization analysis, optimization, and educational tools
 */

class TokenizationSystem {
    constructor() {
        this.medicalAbbreviations = this.initializeMedicalAbbreviations();
        this.tokenPatterns = this.initializeTokenPatterns();
        this.costModels = this.initializeCostModels();
        this.optimizationStrategies = this.initializeOptimizationStrategies();
        
        this.initializeSystem();
    }

    /**
     * Initialize the tokenization system
     */
    initializeSystem() {
        this.config = {
            maxContextTokens: 4096,
            reservedOutputTokens: 1000,
            averageCharsPerToken: 4,
            medicalTermMultiplier: 1.5,
            optimizationTargets: {
                efficiency: 0.8,
                utilization: 0.9,
                costEffectiveness: 5.0
            }
        };

        this.statistics = {
            totalAnalyses: 0,
            totalTokensProcessed: 0,
            averageTokensPerAnalysis: 0,
            costSavings: 0,
            optimizationSuccess: 0
        };
    }

    /**
     * Initialize medical abbreviations dictionary
     */
    initializeMedicalAbbreviations() {
        return {
            "computed tomography": "CT",
            "magnetic resonance imaging": "MRI",
            "posteroanterior": "PA",
            "anteroposterior": "AP",
            "bilateral": "bilat",
            "pneumonia": "PNA",
            "consolidation": "consol",
            "infiltrate": "infiltr",
            "examination": "exam",
            "patient": "pt",
            "history": "hx",
            "diagnosis": "dx",
            "treatment": "tx",
            "radiograph": "XR",
            "chest X-ray": "CXR",
            "electrocardiogram": "ECG",
            "echocardiogram": "echo",
            "ultrasound": "US",
            "intensive care unit": "ICU",
            "emergency room": "ER",
            "emergency department": "ED",
            "blood pressure": "BP",
            "heart rate": "HR",
            "respiratory rate": "RR",
            "temperature": "temp",
            "oxygen saturation": "O2 sat",
            "white blood cell": "WBC",
            "red blood cell": "RBC",
            "hemoglobin": "Hgb",
            "hematocrit": "Hct"
        };
    }

    /**
     * Initialize token pattern recognition
     */
    initializeTokenPatterns() {
        return {
            medical: {
                medications: /\b\d+\s?(mg|ml|g|l|mcg|units?)\b/gi,
                measurements: /\b\d+\.?\d*\s?(cm|mm|inch|inches|feet|ft)\b/gi,
                temperature: /\b\d+\.?\d*\s?[°]?[CF]\b/gi,
                bloodPressure: /\b\d{2,3}\/\d{2,3}\s?(mmHg)?\b/gi,
                icdCodes: /\b[A-Z]\d{2}\.\d+\b/gi,
                cptCodes: /\b\d{5}\b/gi,
                time: /\b\d{1,2}:\d{2}\s?(AM|PM|am|pm)?\b/gi
            },
            punctuation: /[.,;:!?'"()\[\]{}\-]/g,
            numbers: /\b\d+\.?\d*\b/g,
            whitespace: /\s+/g,
            specialChars: /[^a-zA-Z0-9\s]/g
        };
    }

    /**
     * Initialize cost models for different AI services
     */
    initializeCostModels() {
        return {
            "gpt-3.5-turbo": {
                input: 0.0015,  // per 1K tokens
                output: 0.002,  // per 1K tokens
                contextLimit: 4096
            },
            "gpt-4": {
                input: 0.03,
                output: 0.06,
                contextLimit: 8192
            },
            "gpt-4-32k": {
                input: 0.06,
                output: 0.12,
                contextLimit: 32768
            },
            "gemini-pro": {
                input: 0.001,
                output: 0.002,
                contextLimit: 32768
            },
            "claude-3-sonnet": {
                input: 0.003,
                output: 0.015,
                contextLimit: 200000
            }
        };
    }

    /**
     * Initialize optimization strategies
     */
    initializeOptimizationStrategies() {
        return {
            abbreviation: {
                name: "Medical Abbreviation",
                description: "Replace common medical terms with standard abbreviations",
                savings: 0.3,
                risk: "low"
            },
            compression: {
                name: "Prompt Compression",
                description: "Remove redundant words while preserving meaning",
                savings: 0.25,
                risk: "medium"
            },
            templating: {
                name: "Structured Templates",
                description: "Use consistent, efficient prompt templates",
                savings: 0.4,
                risk: "low"
            },
            batching: {
                name: "Batch Processing",
                description: "Process multiple cases in single API call",
                savings: 0.5,
                risk: "low"
            }
        };
    }

    /**
     * Estimate token count for given text
     */
    estimateTokenCount(text) {
        if (!text || typeof text !== 'string') return 0;

        // Basic estimation algorithm
        let tokenCount = 0;
        
        // Split by whitespace to get word-like units
        const words = text.trim().split(/\s+/);
        
        words.forEach(word => {
            // Remove punctuation for length calculation
            const cleanWord = word.replace(/[^\w]/g, '');
            
            if (cleanWord.length === 0) {
                tokenCount += 1; // Punctuation token
            } else if (cleanWord.length <= 3) {
                tokenCount += 1; // Short word = 1 token
            } else if (cleanWord.length <= 6) {
                tokenCount += 1; // Medium word = 1 token usually
            } else if (cleanWord.length <= 10) {
                tokenCount += 2; // Long word = 2 tokens usually
            } else {
                // Very long word (likely medical term)
                tokenCount += Math.ceil(cleanWord.length / 4);
            }
            
            // Add punctuation tokens
            const punctuationCount = (word.match(/[^\w\s]/g) || []).length;
            tokenCount += punctuationCount;
        });

        // Medical term adjustment
        const medicalTerms = this.detectMedicalTerms(text);
        const medicalAdjustment = medicalTerms.length * 0.5; // Medical terms tend to use more tokens
        
        return Math.round(tokenCount + medicalAdjustment);
    }

    /**
     * Accurate tokenization simulation (more sophisticated)
     */
    simulateTokenization(text) {
        const tokens = [];
        let position = 0;
        
        // Handle special medical patterns first
        const medicalBoundaries = this.detectMedicalTokenBoundaries(text);
        
        // Simple tokenization simulation
        const words = text.split(/(\s+|[^\w\s])/);
        
        words.forEach(word => {
            if (word.trim() === '') {
                return; // Skip empty strings
            }
            
            if (/^\s+$/.test(word)) {
                // Whitespace - attach to next token
                return;
            }
            
            if (/^[^\w\s]$/.test(word)) {
                // Single punctuation
                tokens.push({
                    token: word,
                    type: 'punctuation',
                    position: position++,
                    length: word.length
                });
            } else {
                // Word or word-like token
                const subTokens = this.subwordTokenize(word);
                subTokens.forEach(subToken => {
                    tokens.push({
                        token: subToken,
                        type: this.classifyToken(subToken),
                        position: position++,
                        length: subToken.length
                    });
                });
            }
        });

        return tokens;
    }

    /**
     * Simulate subword tokenization
     */
    subwordTokenize(word) {
        // Simplified BPE-like tokenization
        if (word.length <= 4) {
            return [word];
        }
        
        // Check if it's a known medical term
        const lowerWord = word.toLowerCase();
        if (this.medicalAbbreviations[lowerWord]) {
            return [word]; // Keep medical terms intact when possible
        }
        
        // Simple splitting for demonstration
        const tokens = [];
        let remaining = word;
        
        while (remaining.length > 0) {
            if (remaining.length <= 4) {
                tokens.push(remaining);
                break;
            }
            
            // Try to find meaningful prefixes/suffixes
            const prefix = this.findMedicalPrefix(remaining);
            if (prefix) {
                tokens.push(prefix);
                remaining = remaining.substring(prefix.length);
            } else {
                // Split at reasonable boundary
                const splitPoint = Math.min(4, remaining.length);
                tokens.push(remaining.substring(0, splitPoint));
                remaining = remaining.substring(splitPoint);
            }
        }
        
        return tokens;
    }

    /**
     * Find medical prefixes/suffixes
     */
    findMedicalPrefix(word) {
        const medicalPrefixes = [
            'pneum', 'cardio', 'hepat', 'nephr', 'gastr', 'derm', 'neur',
            'osteo', 'arthr', 'bronch', 'pulmon', 'radi', 'angi'
        ];
        
        const lowerWord = word.toLowerCase();
        return medicalPrefixes.find(prefix => lowerWord.startsWith(prefix));
    }

    /**
     * Classify token type
     */
    classifyToken(token) {
        if (/^[A-Z]+$/.test(token)) return 'abbreviation';
        if (/^\d+$/.test(token)) return 'number';
        if (/^[^\w\s]$/.test(token)) return 'punctuation';
        if (token.includes('##')) return 'subword_continuation';
        if (token.startsWith(' ')) return 'word_with_space';
        if (this.isMedicalTerm(token)) return 'medical_term';
        return 'word';
    }

    /**
     * Detect medical terms in text
     */
    detectMedicalTerms(text) {
        const medicalTerms = [];
        const medicalPatterns = [
            /\b(pneumonia|bronchitis|tuberculosis|asthma)\b/gi,
            /\b(radiograph|radiography|imaging|scan)\b/gi,
            /\b(diagnosis|prognosis|treatment|therapy)\b/gi,
            /\b(patient|doctor|physician|radiologist)\b/gi,
            /\b(chest|lung|heart|cardiac|pulmonary)\b/gi
        ];
        
        medicalPatterns.forEach(pattern => {
            const matches = text.match(pattern) || [];
            medicalTerms.push(...matches);
        });
        
        return medicalTerms;
    }

    /**
     * Check if token is a medical term
     */
    isMedicalTerm(token) {
        const lowerToken = token.toLowerCase();
        return Object.keys(this.medicalAbbreviations).some(term => 
            term.includes(lowerToken) || lowerToken.includes(term)
        );
    }

    /**
     * Detect medical token boundaries
     */
    detectMedicalTokenBoundaries(text) {
        const boundaries = [];
        
        Object.entries(this.tokenPatterns.medical).forEach(([type, pattern]) => {
            let match;
            while ((match = pattern.exec(text)) !== null) {
                boundaries.push({
                    type: `medical_${type}`,
                    text: match[0],
                    start: match.index,
                    end: match.index + match[0].length,
                    preserveIntact: true
                });
            }
        });
        
        return boundaries;
    }

    /**
     * Optimize text for token efficiency
     */
    optimizeForTokens(text, strategy = 'balanced') {
        let optimized = text;
        const originalTokens = this.estimateTokenCount(text);
        
        const optimizations = [];
        
        // Apply medical abbreviations
        if (strategy === 'aggressive' || strategy === 'balanced') {
            const abbreviated = this.applyMedicalAbbreviations(optimized);
            if (abbreviated !== optimized) {
                optimizations.push({
                    type: 'abbreviation',
                    original: optimized,
                    optimized: abbreviated,
                    tokenSavings: originalTokens - this.estimateTokenCount(abbreviated)
                });
                optimized = abbreviated;
            }
        }
        
        // Remove redundant words
        if (strategy === 'aggressive') {
            const compressed = this.removeRedundancy(optimized);
            if (compressed !== optimized) {
                optimizations.push({
                    type: 'compression',
                    original: optimized,
                    optimized: compressed,
                    tokenSavings: this.estimateTokenCount(optimized) - this.estimateTokenCount(compressed)
                });
                optimized = compressed;
            }
        }
        
        // Apply structured formatting
        if (strategy === 'balanced' || strategy === 'conservative') {
            const structured = this.applyStructuredFormat(optimized);
            if (structured !== optimized) {
                optimizations.push({
                    type: 'structuring',
                    original: optimized,
                    optimized: structured,
                    tokenSavings: this.estimateTokenCount(optimized) - this.estimateTokenCount(structured)
                });
                optimized = structured;
            }
        }
        
        const finalTokens = this.estimateTokenCount(optimized);
        const totalSavings = originalTokens - finalTokens;
        const savingsPercentage = ((totalSavings / originalTokens) * 100).toFixed(1);
        
        return {
            original: text,
            optimized: optimized,
            originalTokens: originalTokens,
            optimizedTokens: finalTokens,
            tokenSavings: totalSavings,
            savingsPercentage: savingsPercentage,
            optimizations: optimizations,
            strategy: strategy
        };
    }

    /**
     * Apply medical abbreviations
     */
    applyMedicalAbbreviations(text) {
        let abbreviated = text;
        
        Object.entries(this.medicalAbbreviations).forEach(([full, abbrev]) => {
            const regex = new RegExp(`\\b${full}\\b`, 'gi');
            abbreviated = abbreviated.replace(regex, abbrev);
        });
        
        return abbreviated;
    }

    /**
     * Remove redundant words
     */
    removeRedundancy(text) {
        // Remove redundant adjectives and filler words
        const redundantPatterns = [
            /\bvery\s+/gi,
            /\bquite\s+/gi,
            /\bextremely\s+/gi,
            /\bcompletely\s+/gi,
            /\bthoroughly\s+/gi,
            /\bcarefully\s+/gi,
            /\bplease\s+/gi,
            /\bkindly\s+/gi
        ];
        
        let compressed = text;
        redundantPatterns.forEach(pattern => {
            compressed = compressed.replace(pattern, '');
        });
        
        // Remove double spaces
        compressed = compressed.replace(/\s+/g, ' ').trim();
        
        return compressed;
    }

    /**
     * Apply structured formatting
     */
    applyStructuredFormat(text) {
        // Convert to structured format if it's a medical analysis request
        if (text.toLowerCase().includes('analyze') && text.toLowerCase().includes('chest')) {
            return `Analyze chest image:
1. Lung fields
2. Heart size
3. Pleural spaces
4. Pathology
Format: Diagnosis | Confidence | Evidence`;
        }
        
        return text;
    }

    /**
     * Calculate cost for given token usage
     */
    calculateCost(inputTokens, outputTokens, model = 'gpt-3.5-turbo') {
        const costModel = this.costModels[model];
        if (!costModel) {
            throw new Error(`Unknown model: ${model}`);
        }
        
        const inputCost = (inputTokens / 1000) * costModel.input;
        const outputCost = (outputTokens / 1000) * costModel.output;
        const totalCost = inputCost + outputCost;
        
        return {
            inputCost: inputCost,
            outputCost: outputCost,
            totalCost: totalCost,
            model: model,
            inputTokens: inputTokens,
            outputTokens: outputTokens
        };
    }

    /**
     * Analyze cost savings from optimization
     */
    analyzeCostSavings(original, optimized, outputTokens = 800, model = 'gpt-3.5-turbo') {
        const originalCost = this.calculateCost(original.tokens, outputTokens, model);
        const optimizedCost = this.calculateCost(optimized.tokens, outputTokens, model);
        
        const savings = originalCost.totalCost - optimizedCost.totalCost;
        const savingsPercentage = ((savings / originalCost.totalCost) * 100).toFixed(1);
        
        return {
            original: originalCost,
            optimized: optimizedCost,
            savings: savings,
            savingsPercentage: savingsPercentage,
            annualSavings: this.projectAnnualSavings(savings)
        };
    }

    /**
     * Project annual savings based on usage patterns
     */
    projectAnnualSavings(savingsPerRequest, requestsPerDay = 100, workingDaysPerYear = 250) {
        const dailySavings = savingsPerRequest * requestsPerDay;
        const annualSavings = dailySavings * workingDaysPerYear;
        
        return {
            perRequest: savingsPerRequest,
            perDay: dailySavings,
            perMonth: dailySavings * 30,
            perYear: annualSavings
        };
    }

    /**
     * Create batch processing strategy
     */
    createBatchStrategy(cases, maxTokensPerBatch = 3000) {
        const batches = [];
        let currentBatch = [];
        let currentTokens = 0;
        
        const batchHeader = "Analyze these chest X-rays for pneumonia:\n\n";
        const headerTokens = this.estimateTokenCount(batchHeader);
        
        cases.forEach((case_, index) => {
            const caseText = `Case ${index + 1}: ${case_.description}\n`;
            const caseTokens = this.estimateTokenCount(caseText);
            
            if (currentTokens + caseTokens + headerTokens > maxTokensPerBatch) {
                if (currentBatch.length > 0) {
                    batches.push({
                        cases: [...currentBatch],
                        tokenCount: currentTokens + headerTokens,
                        prompt: batchHeader + currentBatch.map((c, i) => `Case ${i + 1}: ${c.description}`).join('\n')
                    });
                    currentBatch = [];
                    currentTokens = 0;
                }
            }
            
            currentBatch.push(case_);
            currentTokens += caseTokens;
        });
        
        if (currentBatch.length > 0) {
            batches.push({
                cases: [...currentBatch],
                tokenCount: currentTokens + headerTokens,
                prompt: batchHeader + currentBatch.map((c, i) => `Case ${i + 1}: ${c.description}`).join('\n')
            });
        }
        
        return {
            batches: batches,
            totalBatches: batches.length,
            averageCasesPerBatch: currentBatch.length > 0 ? Math.round(cases.length / batches.length) : 0,
            tokenSavings: this.calculateBatchSavings(cases.length, batches.length)
        };
    }

    /**
     * Calculate token savings from batch processing
     */
    calculateBatchSavings(totalCases, batchCount) {
        const individualProcessingTokens = totalCases * 200; // Estimated base prompt per case
        const batchProcessingTokens = batchCount * 100; // Estimated batch header overhead
        const savings = individualProcessingTokens - batchProcessingTokens;
        
        return {
            individual: individualProcessingTokens,
            batch: batchProcessingTokens,
            savings: savings,
            efficiency: ((savings / individualProcessingTokens) * 100).toFixed(1)
        };
    }

    /**
     * Generate comprehensive token analysis report
     */
    generateTokenAnalysis(text, includeOptimization = true) {
        const analysis = {
            input: {
                text: text,
                length: text.length,
                wordCount: text.split(/\s+/).length
            },
            tokenization: {
                estimatedTokens: this.estimateTokenCount(text),
                detailedTokens: this.simulateTokenization(text),
                medicalTerms: this.detectMedicalTerms(text),
                specialPatterns: this.detectMedicalTokenBoundaries(text)
            },
            metrics: {},
            optimization: null,
            recommendations: []
        };

        // Calculate metrics
        analysis.metrics = {
            charsPerToken: (text.length / analysis.tokenization.estimatedTokens).toFixed(2),
            wordsPerToken: (analysis.input.wordCount / analysis.tokenization.estimatedTokens).toFixed(2),
            medicalTermDensity: ((analysis.tokenization.medicalTerms.length / analysis.input.wordCount) * 100).toFixed(1),
            efficiency: this.calculateTextEfficiency(text)
        };

        // Include optimization if requested
        if (includeOptimization) {
            analysis.optimization = this.optimizeForTokens(text, 'balanced');
            analysis.recommendations = this.generateOptimizationRecommendations(analysis);
        }

        // Add cost analysis
        analysis.costAnalysis = this.calculateCost(analysis.tokenization.estimatedTokens, 800);

        return analysis;
    }

    /**
     * Calculate text efficiency
     */
    calculateTextEfficiency(text) {
        const tokens = this.estimateTokenCount(text);
        const uniqueWords = new Set(text.toLowerCase().split(/\s+/)).size;
        const repetition = 1 - (uniqueWords / text.split(/\s+/).length);
        
        return {
            tokenDensity: (text.length / tokens).toFixed(2),
            uniqueWordRatio: (uniqueWords / text.split(/\s+/).length).toFixed(2),
            repetitionScore: repetition.toFixed(2),
            overallEfficiency: ((1 - repetition) * 0.7 + (uniqueWords / text.split(/\s+/).length) * 0.3).toFixed(2)
        };
    }

    /**
     * Generate optimization recommendations
     */
    generateOptimizationRecommendations(analysis) {
        const recommendations = [];
        
        if (analysis.tokenization.medicalTerms.length > 5) {
            recommendations.push({
                type: 'abbreviation',
                priority: 'high',
                description: 'Consider using medical abbreviations to reduce token count',
                potentialSavings: '20-30%'
            });
        }
        
        if (analysis.metrics.efficiency.repetitionScore > 0.2) {
            recommendations.push({
                type: 'redundancy',
                priority: 'medium',
                description: 'Remove redundant words and phrases',
                potentialSavings: '15-25%'
            });
        }
        
        if (analysis.tokenization.estimatedTokens > 1000) {
            recommendations.push({
                type: 'restructuring',
                priority: 'high',
                description: 'Consider breaking into smaller, focused prompts',
                potentialSavings: '30-40%'
            });
        }
        
        if (analysis.tokenization.estimatedTokens < 50) {
            recommendations.push({
                type: 'batching',
                priority: 'low',
                description: 'Consider batching multiple requests together',
                potentialSavings: '40-60%'
            });
        }
        
        return recommendations;
    }

    /**
     * Educational token visualization
     */
    createTokenVisualization(text) {
        const tokens = this.simulateTokenization(text);
        
        return {
            tokens: tokens,
            summary: {
                totalTokens: tokens.length,
                tokenTypes: this.summarizeTokenTypes(tokens),
                longestToken: tokens.reduce((longest, token) => 
                    token.token.length > longest.length ? token.token : longest, ''),
                averageTokenLength: (tokens.reduce((sum, token) => 
                    sum + token.token.length, 0) / tokens.length).toFixed(2)
            },
            visualization: this.createVisualTokenMap(tokens),
            educational: this.generateEducationalInsights(tokens)
        };
    }

    /**
     * Summarize token types
     */
    summarizeTokenTypes(tokens) {
        const types = {};
        tokens.forEach(token => {
            types[token.type] = (types[token.type] || 0) + 1;
        });
        return types;
    }

    /**
     * Create visual token map
     */
    createVisualTokenMap(tokens) {
        return tokens.map(token => ({
            ...token,
            visualClass: this.getTokenVisualClass(token.type),
            explanation: this.getTokenExplanation(token.type)
        }));
    }

    /**
     * Get visual class for token type
     */
    getTokenVisualClass(type) {
        const classMap = {
            'word': 'token-word',
            'medical_term': 'token-medical',
            'abbreviation': 'token-abbreviation',
            'number': 'token-number',
            'punctuation': 'token-punctuation',
            'subword_continuation': 'token-subword'
        };
        return classMap[type] || 'token-default';
    }

    /**
     * Get explanation for token type
     */
    getTokenExplanation(type) {
        const explanations = {
            'word': 'Regular word token',
            'medical_term': 'Medical terminology',
            'abbreviation': 'Medical abbreviation',
            'number': 'Numerical value',
            'punctuation': 'Punctuation mark',
            'subword_continuation': 'Part of a longer word'
        };
        return explanations[type] || 'Unknown token type';
    }

    /**
     * Generate educational insights
     */
    generateEducationalInsights(tokens) {
        const insights = [];
        
        const medicalTokens = tokens.filter(t => t.type === 'medical_term');
        if (medicalTokens.length > 0) {
            insights.push({
                type: 'medical_terminology',
                message: `Found ${medicalTokens.length} medical terms that may use multiple tokens`,
                examples: medicalTokens.slice(0, 3).map(t => t.token)
            });
        }
        
        const longTokens = tokens.filter(t => t.token.length > 10);
        if (longTokens.length > 0) {
            insights.push({
                type: 'long_tokens',
                message: `${longTokens.length} long words detected - these often split into multiple tokens`,
                examples: longTokens.slice(0, 3).map(t => t.token)
            });
        }
        
        const abbreviations = tokens.filter(t => t.type === 'abbreviation');
        if (abbreviations.length > 0) {
            insights.push({
                type: 'abbreviations',
                message: `${abbreviations.length} abbreviations found - these are token-efficient`,
                examples: abbreviations.slice(0, 3).map(t => t.token)
            });
        }
        
        return insights;
    }

    /**
     * Context window management
     */
    manageContextWindow(systemPrompt, userPrompt, examples = [], model = 'gpt-3.5-turbo') {
        const modelConfig = this.costModels[model];
        const maxTokens = modelConfig.contextLimit;
        const reservedForOutput = this.config.reservedOutputTokens;
        const availableForInput = maxTokens - reservedForOutput;
        
        let systemTokens = this.estimateTokenCount(systemPrompt);
        let userTokens = this.estimateTokenCount(userPrompt);
        let exampleTokens = 0;
        
        const selectedExamples = [];
        
        for (const example of examples) {
            const exampleTokenCount = this.estimateTokenCount(example);
            if (systemTokens + userTokens + exampleTokens + exampleTokenCount < availableForInput) {
                selectedExamples.push(example);
                exampleTokens += exampleTokenCount;
            } else {
                break;
            }
        }
        
        const totalTokens = systemTokens + userTokens + exampleTokens;
        
        return {
            systemPrompt: systemPrompt,
            userPrompt: userPrompt,
            examples: selectedExamples,
            tokenUsage: {
                system: systemTokens,
                user: userTokens,
                examples: exampleTokens,
                total: totalTokens,
                available: availableForInput,
                remaining: availableForInput - totalTokens,
                utilizationPercent: ((totalTokens / availableForInput) * 100).toFixed(1)
            },
            recommendations: this.generateContextRecommendations(totalTokens, availableForInput)
        };
    }

    /**
     * Generate context window recommendations
     */
    generateContextRecommendations(usedTokens, availableTokens) {
        const utilization = usedTokens / availableTokens;
        const recommendations = [];
        
        if (utilization > 0.9) {
            recommendations.push({
                type: 'warning',
                message: 'Context window is nearly full. Consider prompt optimization.',
                priority: 'high'
            });
        } else if (utilization > 0.8) {
            recommendations.push({
                type: 'caution',
                message: 'High context utilization. Monitor for truncation.',
                priority: 'medium'
            });
        } else if (utilization < 0.3) {
            recommendations.push({
                type: 'optimization',
                message: 'Low context utilization. Consider adding more examples.',
                priority: 'low'
            });
        }
        
        return recommendations;
    }

    /**
     * Update statistics
     */
    updateStatistics(tokensUsed, costSaved = 0) {
        this.statistics.totalAnalyses++;
        this.statistics.totalTokensProcessed += tokensUsed;
        this.statistics.averageTokensPerAnalysis = 
            this.statistics.totalTokensProcessed / this.statistics.totalAnalyses;
        this.statistics.costSavings += costSaved;
        
        if (costSaved > 0) {
            this.statistics.optimizationSuccess++;
        }
    }

    /**
     * Get system statistics
     */
    getStatistics() {
        return {
            ...this.statistics,
            optimizationSuccessRate: this.statistics.totalAnalyses > 0 ? 
                ((this.statistics.optimizationSuccess / this.statistics.totalAnalyses) * 100).toFixed(1) : 0
        };
    }
}

// Token Visualization UI Helper
class TokenVisualizationUI {
    static createTokenDisplay(tokenVisualization) {
        const container = document.createElement('div');
        container.className = 'token-visualization';
        
        // Create token display
        const tokenDisplay = document.createElement('div');
        tokenDisplay.className = 'token-display';
        
        tokenVisualization.visualization.forEach(tokenInfo => {
            const tokenElement = document.createElement('span');
            tokenElement.className = `token ${tokenInfo.visualClass}`;
            tokenElement.textContent = tokenInfo.token;
            tokenElement.title = tokenInfo.explanation;
            tokenElement.setAttribute('data-type', tokenInfo.type);
            tokenElement.setAttribute('data-position', tokenInfo.position);
            
            tokenDisplay.appendChild(tokenElement);
        });
        
        container.appendChild(tokenDisplay);
        
        // Create summary
        const summary = document.createElement('div');
        summary.className = 'token-summary';
        summary.innerHTML = `
            <h4>Token Analysis Summary</h4>
            <p><strong>Total Tokens:</strong> ${tokenVisualization.summary.totalTokens}</p>
            <p><strong>Average Token Length:</strong> ${tokenVisualization.summary.averageTokenLength} characters</p>
            <p><strong>Longest Token:</strong> "${tokenVisualization.summary.longestToken}"</p>
        `;
        
        container.appendChild(summary);
        
        return container;
    }
}

// Initialize the tokenization system
const tokenizationSystem = new TokenizationSystem();

// Export for use in HTML interface
if (typeof window !== 'undefined') {
    window.TokenizationSystem = TokenizationSystem;
    window.tokenizationSystem = tokenizationSystem;
    window.TokenVisualizationUI = TokenVisualizationUI;
}
