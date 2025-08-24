# Video Script: One-Shot Prompting for Medical AI

## Title: "One-Shot Prompting: Learning Medical Diagnosis from a Single Example"
### Duration: 4-5 minutes

---

## Introduction (30 seconds)

**[Screen: One-shot demo page with title and concept explanation]**

"Hello! Today I'm demonstrating one-shot prompting in medical AI - a powerful technique that teaches AI systems to perform complex medical analysis by learning from just a single, comprehensive example."

**[Screen: Comparison graphic showing 0-shot vs 1-shot vs few-shot]**

"One-shot prompting bridges the gap between zero-shot prompting, which provides no examples, and few-shot prompting, which uses multiple examples. With one-shot, we provide exactly one high-quality medical example to guide the AI's analysis."

---

## What is One-Shot Prompting? (60 seconds)

**[Screen: Medical example display with structured format]**

"Let me show you how one-shot prompting works. Instead of just giving the AI a task description, we provide a complete medical example that demonstrates:

1. **Professional Medical Reasoning**: How an expert radiologist approaches X-ray analysis
2. **Systematic Structure**: The exact format and sections we want in the response  
3. **Clinical Terminology**: Proper medical language and diagnostic criteria
4. **Confidence Expression**: How to appropriately express diagnostic uncertainty"

**[Screen: Code showing the example structure]**

"Here's our training example - a comprehensive analysis of a 52-year-old patient with respiratory symptoms. Notice the systematic approach:

- Technical Assessment
- Heart and Mediastinum evaluation  
- Bilateral lung field analysis
- Pleural space examination
- Radiological findings summary
- Clinical interpretation with confidence scoring
- Evidence-based reasoning
- Professional recommendations

This single example teaches the AI not just what to look for, but how to think like a radiologist."

---

## Implementation Demonstration (90 seconds)

**[Screen: Live demo of uploading an X-ray image]**

"Now let's see one-shot learning in action. I'll upload a new chest X-ray that the AI has never seen before."

**[Screen: File upload and image preview showing analysis details]**

"You can see that our interface shows this is a one-shot analysis - the AI has access to our single training example. When I click analyze, the AI will study that example and apply the same systematic approach to this new image."

**[Screen: Loading screen with explanation]**

"During processing, the AI:
1. Reviews the training example's structure and approach
2. Applies the same systematic methodology to the new image
3. Follows the example's format while adapting to new findings
4. Uses the same level of medical detail and professionalism"

**[Screen: Results display with detailed analysis]**

"Look at these results! The AI has successfully applied the example's systematic approach:

- It used the same section headings and structure
- Applied professional medical terminology
- Provided detailed bilateral lung analysis
- Included appropriate confidence scoring
- Followed the same clinical reasoning format"

**[Screen: Example adherence metrics]**

"Our system even analyzes how well the AI followed the example. You can see it achieved 85% structure adherence and 90% medical terminology usage - demonstrating effective learning from the single example."

---

## Token Usage and Efficiency (45 seconds)

**[Screen: Console showing token usage and comparison]**

"One important aspect of one-shot prompting is token efficiency. You can see in the console that this analysis used X tokens. This is significantly more than zero-shot prompting due to the included example, but much less than few-shot approaches that include multiple examples."

**[Screen: Efficiency comparison chart]**

"The token breakdown:
- Training example: ~800 tokens
- User prompt: ~200 tokens  
- Response: ~600 tokens
- Total: ~1600 tokens

This gives us the guidance benefits of example-based learning while maintaining reasonable API costs."

**[Screen: Quality vs cost visualization]**

"One-shot prompting hits the sweet spot - providing substantial improvement in consistency and medical quality compared to zero-shot, while using far fewer tokens than few-shot approaches."

---

## Key Benefits in Medical Applications (45 seconds)

**[Screen: Benefits visualization with medical context]**

"One-shot prompting is particularly valuable in medical AI for several reasons:

**Clinical Standardization**: The example ensures all analyses follow the same professional medical format, critical for healthcare documentation.

**Educational Value**: Medical students can see how expert radiologists approach systematic diagnosis, making this a powerful teaching tool.

**Quality Assurance**: The single example acts as a quality template, ensuring consistent professional standards across all analyses.

**Rapid Deployment**: Unlike few-shot approaches that require curating multiple examples, one-shot needs only one high-quality medical case."

**[Screen: Example showing medical terminology consistency]**

"Notice how the AI learned to use proper radiological terms like 'consolidation,' 'air bronchograms,' and 'costophrenic angles' - language it picked up from our single training example."

---

## Code Implementation Highlights (30 seconds)

**[Screen: Code editor showing key implementation]**

"From a technical perspective, our one-shot implementation includes several key features:

```javascript
// Lower temperature for consistency with example
temperature: 0.2,

// Increased token limit for detailed responses  
maxOutputTokens: 2000,

// Example adherence analysis
analyzeExampleInfluence(responseText)
```

We use a lower temperature to ensure the AI stays close to the example's approach, and we've built in analysis to measure how well the AI learned from the training case."

---

## Results Analysis and Learning Metrics (30 seconds)

**[Screen: Detailed results showing learning analysis]**

"What makes our implementation unique is the example learning analysis. We measure:

- Structure adherence percentage
- Medical terminology usage
- Professional format compliance  
- Systematic approach adoption

This helps us understand how effectively the AI learned from our single medical example and ensures quality control in medical applications."

---

## Conclusion (20 seconds)

**[Screen: Summary and comparison with other approaches]**

"One-shot prompting demonstrates that a single, well-crafted medical example can dramatically improve AI performance. It provides the structure and professionalism of few-shot learning with the efficiency closer to zero-shot approaches.

This makes it ideal for medical AI applications where consistency, professional standards, and cost-effectiveness are all critical. The complete implementation is available in our GitHub repository."

---

## Technical Notes for Video Recording

### Key Code Segments to Show:
1. One-shot prompt with medical example (one_shot_app.js lines 10-50)
2. Example adherence analysis (one_shot_app.js lines 200-250)
3. Token usage logging (console output)
4. Results parsing and medical terminology detection

### Visual Elements:
- Live demo with real medical image analysis
- Split-screen showing example and AI response
- Token usage comparison charts
- Example adherence metrics visualization
- Professional medical interface demonstration

### Screen Recording Checklist:
- ✅ Clear display of training example structure
- ✅ Live upload and analysis workflow
- ✅ Token usage logging in console
- ✅ Example adherence metrics explanation
- ✅ Medical terminology consistency demonstration
- ✅ Professional quality analysis results

### Demo Flow:
1. Explain one-shot concept with visual aids
2. Show comprehensive training example
3. Upload and analyze new X-ray image
4. Highlight example adherence in results
5. Display token usage and efficiency metrics
6. Compare with zero-shot and few-shot approaches
7. Emphasize medical quality and consistency benefits

### Key Learning Points to Emphasize:
- **Single Example Power**: How one good example can dramatically improve results
- **Medical Standardization**: Ensuring consistent professional documentation
- **Token Efficiency**: Better than few-shot, more guidance than zero-shot
- **Quality Metrics**: Measuring how well AI learns from examples
- **Educational Value**: Teaching systematic medical reasoning

---

*This video demonstrates the practical application and benefits of one-shot prompting in medical AI, showing how a single well-crafted example can provide substantial improvements in consistency, medical quality, and professional standards.*
