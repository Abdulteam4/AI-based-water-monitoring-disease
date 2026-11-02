from typing import Dict, List, Any
from app.ml.dataset import PARAMETER_CONFIG


def generate_recommendations(parameters: Dict[str, float], status: str) -> List[Dict[str, str]]:
    """
    Generates targeted water purification, filtration, and safety advisories based on specific
    anomalous parameters detected.
    """
    recs = []
    
    turbidity = parameters.get("turbidity", 0.0)
    if turbidity > 5.0:
        recs.append({
            "category": "Filtration & Clarification",
            "priority": "HIGH",
            "action": "Multi-stage Filtration / Coagulation",
            "detail": f"Turbidity is high ({turbidity:.1f} NTU). Use a 5-micron sediment filter or alum coagulation prior to disinfection, as suspended solids impede UV/chlorine effectiveness."
        })
        
    ph = parameters.get("ph", 7.0)
    if ph < 6.5:
        recs.append({
            "category": "pH Neutralization",
            "priority": "HIGH",
            "action": "Alkaline Conditioning",
            "detail": f"Water is acidic (pH {ph:.1f}). Install a calcite neutralizing filter or soda ash feed to raise pH above 6.5 and prevent copper/lead pipe leaching."
        })
    elif ph > 8.5:
        recs.append({
            "category": "pH Adjustment",
            "priority": "MEDIUM",
            "action": "Acidic Treatment / Dilution",
            "detail": f"Water is alkaline (pH {ph:.1f}). Inspect for mineral scale buildup and consider pH lowering treatments."
        })
        
    lead = parameters.get("lead", 0.0)
    if lead > 0.015:
        recs.append({
            "category": "Heavy Metal Removal",
            "priority": "CRITICAL",
            "action": "Reverse Osmosis / Activated Alumina",
            "detail": f"Lead levels ({lead:.3f} mg/L) exceed safety limits. Use an NSF-certified Reverse Osmosis (RO) system or specialized lead-absorption carbon block filters immediately."
        })
        
    nitrate = parameters.get("nitrate", 0.0)
    if nitrate > 10.0:
        recs.append({
            "category": "Nitrate Treatment",
            "priority": "CRITICAL",
            "action": "Ion Exchange / Reverse Osmosis",
            "detail": f"Nitrate levels ({nitrate:.1f} mg/L) are dangerous. Note: Boiling water INCREASES nitrate concentration. Use anion-exchange resins or Reverse Osmosis."
        })
        
    chloramines = parameters.get("chloramines", 0.0)
    organic_carbon = parameters.get("organic_carbon", 0.0)
    if chloramines < 0.5 and organic_carbon > 4.0:
        recs.append({
            "category": "Disinfection",
            "priority": "HIGH",
            "action": "Boiling / UV Sterilization / Chlorination",
            "detail": "Low disinfectant residual combined with organic carbon indicates bacterial growth risk. Bring water to a rolling boil for 1 full minute or run through a UV sterilizer."
        })
        
    solids = parameters.get("solids", 0.0)
    if solids > 1000.0:
        recs.append({
            "category": "Desalination & TDS Reduction",
            "priority": "MEDIUM",
            "action": "Reverse Osmosis (RO) Filtration",
            "detail": f"Total Dissolved Solids ({solids:.0f} mg/L) exceed taste and mineral limits. Implement a high-rejection RO purification membrane."
        })
        
    trihalomethanes = parameters.get("trihalomethanes", 0.0)
    if trihalomethanes > 80.0:
        recs.append({
            "category": "Chemical Vapor Removal",
            "priority": "HIGH",
            "action": "Activated Carbon Filtration & Aeration",
            "detail": f"Elevated THMs ({trihalomethanes:.1f} µg/L). Utilize a granular activated carbon (GAC) post-filter and allow water to aerate before drinking."
        })
        
    # Standard general advisory if critical or unsafe
    if status in ["UNSAFE", "CRITICAL"] or len(recs) >= 2:
        recs.append({
            "category": "Laboratory Verification",
            "priority": "CRITICAL",
            "action": "Certified Lab Testing Advisory",
            "detail": "Do not rely on single predictions for drinking safety when multiple parameters are abnormal. Conduct certified laboratory testing before human consumption."
        })
    elif not recs:
        recs.append({
            "category": "Routine Maintenance",
            "priority": "LOW",
            "action": "Regular Monitoring & Clean Storage",
            "detail": "Water parameters comply with WHO safe drinking guidelines. Maintain clean storage tanks and inspect monthly."
        })
        
    return recs
