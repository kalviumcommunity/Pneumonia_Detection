# One-Shot Prompting Implementation for Pneumonia Detection

## Overview
This implementation demonstrates one-shot prompting in the context of AI-powered pneumonia detection from chest X-ray images. One-shot prompting provides the AI model with exactly one example before asking it to perform the same task on new data.

## What is One-Shot Prompting?

One-shot prompting is a technique where we provide the AI model with a single example of the desired task before asking it to perform the same task on new input. This approach bridges the gap between zero-shot (no examples) and few-shot (multiple examples) prompting.

### Key Characteristics:
- **Single Example**: Exactly one demonstration of the task
- **Pattern Learning**: AI learns from the example structure and approach
- **Guidance**: Provides a template for the desired response format
- **Efficiency**: More guidance than zero-shot, more efficient than few-shot

## One-Shot Learning in Medical Context

### Why One-Shot Works for Medical AI:
1. **Clinical Expertise**: Demonstrates professional medical reasoning
2. **Format Consistency**: Shows exact output structure expected
3. **Medical Terminology**: Provides proper medical language usage
4. **Confidence Modeling**: Shows how to express diagnostic uncertainty

## Implementation Design

### One-Shot Example Selection
For pneumonia detection, we provide one comprehensive example showing:

```javascript
const oneShotExample = `
EXAMPLE ANALYSIS:

X-ray Image: [Normal Chest X-ray]

DIAGNOSIS: No pneumonia detected
CONFIDENCE: 85%
REASONING: The chest X-ray shows clear bilateral lung fields with no evidence of consolidation, infiltrates, or abnormal opacity. The heart size appears normal, and there are no signs of pleural effusion. The lung markings are symmetric and within normal limits. The costophrenic angles are sharp bilaterally, indicating no fluid accumulation.
KEY_FINDINGS: 
- Clear bilateral lung fields
- Normal heart size and position
- Sharp costophrenic angles
- Symmetric lung markings
- No consolidation or infiltrates
- No pleural effusion
RECOMMENDATIONS: Routine follow-up as clinically indicated. No immediate intervention required.

---

Now analyze this new chest X-ray image following the same format and approach:
`;
```

### Advanced One-Shot Implementation

```javascript
const advancedOneShotPrompt = `
You are an expert radiologist analyzing chest X-rays for pneumonia detection.

TRAINING EXAMPLE:
Patient Case: 45-year-old with respiratory symptoms
X-ray Analysis:
{
  "technical_assessment": {
    "image_quality": "Good - adequate penetration and positioning",
    "positioning": "PA view, patient upright, no rotation"
  },
  "systematic_review": {
    "upper_zones": "Clear bilaterally, no focal consolidation",
    "middle_zones": "Normal vascular markings, no infiltrates", 
    "lower_zones": "Clear lung fields, sharp costophrenic angles"
  },
  "pathology_assessment": {
    "consolidation": false,
    "air_bronchograms": false,
    "pleural_effusion": false,
    "pneumothorax": false
  },
  "primary_diagnosis": "No pneumonia detected",
  "confidence_score": 88,
  "clinical_correlation": "Normal chest X-ray. Consider alternative diagnoses for respiratory symptoms.",
  "follow_up": "Clinical correlation recommended"
}

Now analyze this new chest X-ray using the same systematic approach and JSON format:
`;
```

## One-Shot vs Other Approaches

### Advantages of One-Shot:

1. **Guided Learning**: Provides clear template without overwhelming with multiple examples
2. **Format Consistency**: Ensures output follows medical documentation standards
3. **Professional Modeling**: Demonstrates expert-level medical reasoning
4. **Efficient**: Requires fewer tokens than few-shot approaches
5. **Quality Control**: Shows expected level of detail and professionalism

### When to Use One-Shot:

- **New Medical Tasks**: When introducing AI to specific diagnostic procedures
- **Format Standardization**: When specific output format is critical
- **Quality Demonstration**: When showing expected level of clinical detail
- **Training Efficiency**: When token usage needs to be optimized

## Implementation Code

```javascript
class OneShotPneumoniaDetector {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.oneShotPrompt = this.createOneShotPrompt();
    }

    createOneShotPrompt() {
        return `
        You are an expert radiologist specializing in chest X-ray interpretation.
        
        TRAINING EXAMPLE - Study this analysis approach:
        
        Case: 52-year-old patient with cough and fever
        X-ray Description: Posteroanterior chest radiograph
        
        SYSTEMATIC ANALYSIS:
        TECHNICAL: Good image quality, adequate inspiration, no rotation
        HEART: Normal size and contour, clear cardiac borders
        LUNGS: 
        - Right upper lobe: Clear, normal vascular markings
        - Right middle lobe: No consolidation or infiltrates
        - Right lower lobe: Area of increased opacity in lateral segment
        - Left upper lobe: Clear lung fields
        - Left lower lobe: Normal appearance
        PLEURA: No effusion, sharp costophrenic angles bilaterally
        
        FINDINGS: Focal consolidation in right lower lobe lateral segment with air bronchograms visible. No pleural effusion or pneumothorax.
        
        DIAGNOSIS: Pneumonia detected - Right lower lobe pneumonia
        CONFIDENCE: 92%
        SEVERITY: Moderate - localized to single lobe segment
        REASONING: The presence of focal consolidation with air bronchograms in the right lower lobe is characteristic of bacterial pneumonia. The sharp demarcation and lobar distribution support this diagnosis.
        RECOMMENDATIONS: 
        - Clinical correlation with symptoms and laboratory findings
        - Consider antibiotic therapy if clinically indicated
        - Follow-up chest X-ray in 4-6 weeks to ensure resolution
        
        ---
        
        Now analyze this new chest X-ray image using the exact same systematic approach, format, and level of detail:
        `;
    }

    async analyzeWithOneShot(imageData) {
        try {
            const response = await this.callGeminiAPI(imageData);
            return this.parseOneShotResponse(response);
        } catch (error) {
            console.error('One-shot analysis failed:', error);
            throw error;
        }
    }

    async callGeminiAPI(imageData) {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: this.oneShotPrompt },
                        {
                            inline_data: {
                                mime_type: imageData.type,
                                data: imageData.base64
                            }
                        }
                    ]
                }],
                generationConfig: {
                    temperature: 0.2, // Lower temperature for consistency with example
                    maxOutputTokens: 1500,
                    topP: 0.8,
                    topK: 40
                }
            })
        });

        if (!response.ok) {
            throw new Error(`API call failed: ${response.status}`);
        }

        return await response.json();
    }

    parseOneShotResponse(apiResponse) {
        const text = apiResponse.candidates[0].content.parts[0].text;
        
        return {
            method: 'one-shot',
            response: text,
            structured_data: this.extractStructuredData(text),
            tokens_used: apiResponse.usageMetadata?.totalTokenCount || 0,
            example_influence: this.analyzeExampleInfluence(text),
            timestamp: new Date().toISOString()
        };
    }

    extractStructuredData(text) {
        // Extract key medical information following the example format
        return {
            diagnosis: this.extractDiagnosis(text),
            confidence: this.extractConfidence(text),
            severity: this.extractSeverity(text),
            findings: this.extractFindings(text),
            recommendations: this.extractRecommendations(text)
        };
    }

    analyzeExampleInfluence(response) {
        // Analyze how closely the response follows the provided example
        const exampleStructure = [
            'TECHNICAL', 'HEART', 'LUNGS', 'PLEURA', 
            'FINDINGS', 'DIAGNOSIS', 'CONFIDENCE', 'SEVERITY'
        ];
        
        let structureMatch = 0;
        exampleStructure.forEach(section => {
            if (response.includes(section)) structureMatch++;
        });
        
        return {
            structure_adherence: (structureMatch / exampleStructure.length) * 100,
            format_consistency: response.includes('DIAGNOSIS:') && response.includes('CONFIDENCE:'),
            professional_language: this.assessProfessionalLanguage(response)
        };
    }

    assessProfessionalLanguage(text) {
        const medicalTerms = [
            'consolidation', 'infiltrates', 'opacity', 'air bronchograms',
            'pleural effusion', 'costophrenic', 'bilateral', 'lobar'
        ];
        
        let termCount = 0;
        medicalTerms.forEach(term => {
            if (text.toLowerCase().includes(term)) termCount++;
        });
        
        return (termCount / medicalTerms.length) * 100;
    }
}
```

## Benefits of One-Shot in Medical AI

### 1. **Clinical Standardization**
- Ensures medical terminology consistency
- Demonstrates professional documentation standards
- Shows appropriate confidence expression

### 2. **Educational Value**
- Provides learning template for medical students
- Demonstrates systematic diagnostic approach
- Shows expert-level reasoning process

### 3. **Quality Assurance**
- Reduces variability in AI responses
- Ensures comprehensive analysis coverage
- Maintains professional medical standards

### 4. **Efficiency Optimization**
- Better results than zero-shot with minimal token increase
- More cost-effective than few-shot approaches
- Faster implementation than extensive few-shot examples

## Testing One-Shot Performance

### Evaluation Metrics:

1. **Format Adherence**: How closely does output follow the example?
2. **Medical Accuracy**: Correctness of diagnostic assessment
3. **Consistency**: Reliability across different images
4. **Professional Quality**: Use of appropriate medical language

### Test Cases:

```javascript
// Test 1: Normal X-ray
const normalTest = await detector.analyzeWithOneShot(normalXrayImage);
// Expected: Follow example format, identify normal findings

// Test 2: Clear pneumonia case  
const pneumoniaTest = await detector.analyzeWithOneShot(pneumoniaXrayImage);
// Expected: Systematic analysis, appropriate confidence

// Test 3: Subtle findings
const subtleTest = await detector.analyzeWithOneShot(subtleXrayImage);
// Expected: Careful reasoning, appropriate uncertainty expression
```

## Comparison with Other Approaches

| Aspect | Zero-Shot | One-Shot | Few-Shot |
|--------|-----------|----------|----------|
| **Examples** | 0 | 1 | 3-5 |
| **Token Usage** | Low | Medium | High |
| **Consistency** | Variable | Good | Excellent |
| **Learning Curve** | None | Moderate | Steep |
| **Medical Quality** | Basic | Professional | Expert |

## Video Script Outline

### Introduction (30 seconds)
"Today I'm demonstrating one-shot prompting - providing exactly one example to guide AI medical analysis."

### Concept Explanation (60 seconds)
"One-shot prompting bridges zero-shot and few-shot approaches by providing a single, high-quality example that demonstrates the desired analysis format and medical reasoning approach."

### Implementation Demo (90 seconds)
"Here's our one-shot prompt with a comprehensive medical example, and how it guides new X-ray analysis..."

### Results Analysis (60 seconds)
"Notice how the AI follows the example's structure while adapting to the new image's specific findings..."

### Comparison and Benefits (30 seconds)
"One-shot prompting provides excellent guidance with minimal token usage, making it ideal for medical AI applications."

## Future Enhancements

1. **Dynamic Example Selection**: Choose examples based on image characteristics
2. **Multi-Modal Examples**: Include example images alongside text
3. **Confidence Calibration**: Use example confidence as calibration reference
4. **Quality Metrics**: Automated assessment of response quality vs example

---

*This implementation demonstrates how a single, well-crafted example can significantly improve AI performance in medical diagnostic tasks while maintaining efficiency and professional standards.*
