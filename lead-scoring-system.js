// Configuration object for scoring criteria
const SCORING_CRITERIA = {
  companySize: {
    "1-50 employees": 10,
    "51-200 employees": 20,
    "201-1000 employees": 30,
    "1000+ employees": 40,
    default: 0
  },
  annualBudget: {
    "Less than $10,000": 5,
    "$10,000 - $50,000": 15,
    "$50,001 - $100,000": 25,
    "More than $100,000": 40,
    default: 0
  },
  industry: {
    "Technology": 30,
    "Finance": 20,
    "Healthcare": 15,
    "Retail": 10,
    default: 5
  },
  urgency: {
    "Immediate (within 1 month)": 40,
    "Short-term (1-3 months)": 30,
    "Medium-term (3-6 months)": 20,
    "Long-term (6+ months)": 10,
    default: 0
  }
};

class LeadScoringSystem {
  constructor(criteria = SCORING_CRITERIA) {
    this.criteria = criteria;
  }

  calculateScore(leadData) {
    try {
      const scores = Object.entries(leadData).map(([category, value]) => {
        if (!this.criteria[category]) {
          console.warn(`Unknown category: ${category}`);
          return 0;
        }
        
        return this.criteria[category][value] || this.criteria[category].default;
      });

      const totalScore = scores.reduce((sum, score) => sum + score, 0);
      
      return {
        lead_score: totalScore,
        breakdown: this.getScoreBreakdown(leadData),
        classification: this.classifyLead(totalScore)
      };
    } catch (error) {
      console.error('Error calculating lead score:', error);
      throw new Error('Failed to calculate lead score');
    }
  }

  getScoreBreakdown(leadData) {
    return Object.entries(leadData).reduce((breakdown, [category, value]) => {
      if (this.criteria[category]) {
        breakdown[category] = this.criteria[category][value] || this.criteria[category].default;
      }
      return breakdown;
    }, {});
  }

  classifyLead(totalScore) {
    if (totalScore >= 120) return 'Hot';
    if (totalScore >= 80) return 'Warm';
    if (totalScore >= 40) return 'Cool';
    return 'Cold';
  }

  updateCriteria(category, updates) {
    if (!this.criteria[category]) {
      throw new Error(`Invalid category: ${category}`);
    }
    this.criteria[category] = { ...this.criteria[category], ...updates };
  }
}

// Example usage in Zapier context
export function processZapierLead(inputData) {
  const scorer = new LeadScoringSystem();
  
  const leadData = {
    companySize: inputData.company_size,
    annualBudget: inputData.annual_budget,
    industry: inputData.industry,
    urgency: inputData.urgency
  };

  const result = scorer.calculateScore(leadData);
  
  return {
    lead_score: result.lead_score,
    score_breakdown: result.breakdown,
    classification: result.classification
  };
}
