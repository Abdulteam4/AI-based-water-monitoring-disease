from typing import Dict, List, Any

DISEASE_RISK_RULES = [
    {
        "id": "gastrointestinal",
        "name": "Gastrointestinal Illness Risk",
        "category": "Microbial / Pathogenic",
        "trigger": lambda p: (p.get("turbidity", 0) > 5.0 and p.get("chloramines", 0) < 0.5) or (p.get("organic_carbon", 0) > 8.0),
        "risk_level": "HIGH",
        "primary_drivers": ["Turbidity", "Chloramines", "Organic Carbon"],
        "description": "High turbidity combined with inadequate chlorination creates ideal conditions for microbial pathogens (E. coli, Giardia, Cryptosporidium) to survive and proliferate, leading to acute gastroenteritis, nausea, and stomach cramps.",
        "pathogens": ["Escherichia coli", "Giardia lamblia", "Cryptosporidium parvum"]
    },
    {
        "id": "cholera_typhoid",
        "name": "Bacterial Contamination Risk (Cholera & Typhoid Vector)",
        "category": "Waterborne Bacterial Pathogens",
        "trigger": lambda p: (p.get("turbidity", 0) > 8.0 and p.get("dissolved_oxygen", 10) < 4.0) or (p.get("organic_carbon", 0) > 10.0 and p.get("chloramines", 0) < 0.3),
        "risk_level": "CRITICAL",
        "primary_drivers": ["Turbidity", "Dissolved Oxygen", "Total Organic Carbon"],
        "description": "Severe organic pollution and low dissolved oxygen indicate stagnant, sewage-contaminated water. Elevated risk for Vibrio cholerae and Salmonella typhi transmission if consumed untreated.",
        "pathogens": ["Vibrio cholerae", "Salmonella typhi"]
    },
    {
        "id": "methemoglobinemia",
        "name": "Methemoglobinemia Risk ('Blue Baby Syndrome')",
        "category": "Chemical Toxicity",
        "trigger": lambda p: p.get("nitrate", 0) > 10.0,
        "risk_level": "CRITICAL",
        "primary_drivers": ["Nitrate"],
        "description": "Elevated nitrate levels (>10 mg/L) convert to nitrite in the infant digestive system, binding to hemoglobin and reducing oxygen distribution in the blood. Particularly dangerous for infants under 6 months and pregnant mothers.",
        "pathogens": ["Nitrate Chemical Contamination"]
    },
    {
        "id": "lead_poisoning",
        "name": "Heavy Metal Toxicity Risk (Lead)",
        "category": "Heavy Metal Contamination",
        "trigger": lambda p: p.get("lead", 0) > 0.015,
        "risk_level": "CRITICAL",
        "primary_drivers": ["Lead", "pH"],
        "description": "Lead levels exceed the EPA action threshold (0.015 mg/L). Acidic water (pH < 6.5) accelerates lead leaching from pipes. Chronic exposure causes irreversible neurological damage, cognitive impairment, and kidney damage.",
        "pathogens": ["Heavy Metal (Pb) Toxicity"]
    },
    {
        "id": "chemical_irritation",
        "name": "Digestive Distress & Laxative Effect",
        "category": "Inorganic Mineral Imbalance",
        "trigger": lambda p: p.get("sulfate", 0) > 250.0 or p.get("solids", 0) > 1000.0,
        "risk_level": "MODERATE",
        "primary_drivers": ["Sulfate", "Total Dissolved Solids"],
        "description": "High concentrations of dissolved sulfates (>250 mg/L) and mineral salts produce a bitter taste and induce a temporary laxative effect, dehydration, and mild gastrointestinal irritation.",
        "pathogens": ["Sulfate / Mineral Excess"]
    },
    {
        "id": "carcinogenic_byproducts",
        "name": "Disinfection Byproduct Toxicity Risk",
        "category": "Chemical Carcinogen Risk",
        "trigger": lambda p: p.get("trihalomethanes", 0) > 80.0,
        "risk_level": "HIGH",
        "primary_drivers": ["Trihalomethanes", "Chloramines"],
        "description": "Elevated Trihalomethanes (>80 µg/L) result from chlorine reacting with organic matter. Prolonged exposure increases liver, kidney, and central nervous system health risks, as well as bladder cancer risk.",
        "pathogens": ["Chemical Carcinogenic Byproducts"]
    },
    {
        "id": "acid_base_irritation",
        "name": "Mucous Membrane & Gastrointestinal Irritation",
        "category": "pH Imbalance",
        "trigger": lambda p: p.get("ph", 7.0) < 6.5 or p.get("ph", 7.0) > 8.5,
        "risk_level": "MODERATE",
        "primary_drivers": ["pH Level"],
        "description": "Extreme pH levels (<6.5 or >8.5) cause skin and eye irritation, corrode metal plumbing, and alter digestive stomach acid dynamics.",
        "pathogens": ["Extreme Acidity / Alkalinity"]
    }
]


def evaluate_disease_risks(parameters: Dict[str, float]) -> Dict[str, Any]:
    """
    Evaluates parameter combinations against biological and chemical disease risk rules.
    Returns categorized risks, primary drivers, and non-medical risk disclaimer.
    """
    detected_risks = []
    highest_severity = "LOW"
    severity_rank = {"LOW": 1, "MODERATE": 2, "HIGH": 3, "CRITICAL": 4}
    
    for rule in DISEASE_RISK_RULES:
        try:
            is_triggered = rule["trigger"](parameters)
        except Exception:
            is_triggered = False
            
        if is_triggered:
            # Determine actual risk level dynamically if needed
            r_level = rule["risk_level"]
            if callable(r_level):
                r_level = r_level(parameters)
                
            detected_risks.append({
                "id": rule["id"],
                "name": rule["name"],
                "category": rule["category"],
                "risk_level": r_level,
                "primary_drivers": rule["primary_drivers"],
                "description": rule["description"],
                "pathogens": rule["pathogens"]
            })
            
            if severity_rank.get(r_level, 1) > severity_rank.get(highest_severity, 1):
                highest_severity = r_level
                
    if not detected_risks:
        overall_assessment = "No elevated disease or pathogen transmission risks detected based on current parameters."
    else:
        overall_assessment = f"Detected {len(detected_risks)} potential health/contamination risk factor(s). Highest risk severity: {highest_severity}."
        
    return {
        "overall_disease_risk": highest_severity,
        "assessment_summary": overall_assessment,
        "risks_count": len(detected_risks),
        "detected_risks": detected_risks,
        "disclaimer": "This disease risk evaluation is an automated decision-support risk assessment based on chemical and physical water quality parameters. It is NOT a certified laboratory microbiological test or medical diagnosis."
    }