import numpy as np
import pandas as pd

# Parameter thresholds according to WHO & EPA water quality guidelines
PARAMETER_CONFIG = {
    "ph": {
        "name": "pH Level",
        "unit": "pH",
        "min_val": 0.0,
        "max_val": 14.0,
        "safe_min": 6.5,
        "safe_max": 8.5,
        "warn_min": 6.0,
        "warn_max": 9.0,
        "description": "Measures acidity/alkalinity. Ideal range for drinking water is 6.5 to 8.5."
    },
    "hardness": {
        "name": "Hardness",
        "unit": "mg/L",
        "min_val": 0.0,
        "max_val": 500.0,
        "safe_min": 60.0,
        "safe_max": 200.0,
        "warn_min": 30.0,
        "warn_max": 300.0,
        "description": "Capacity of water to precipitate soap; caused primarily by Calcium and Magnesium ions."
    },
    "solids": {
        "name": "Total Dissolved Solids (TDS)",
        "unit": "mg/L",
        "min_val": 0.0,
        "max_val": 3000.0,
        "safe_min": 100.0,
        "safe_max": 500.0,
        "warn_min": 50.0,
        "warn_max": 1000.0,
        "description": "Total concentration of dissolved inorganic salts and organic matter."
    },
    "chloramines": {
        "name": "Chloramines / Free Chlorine",
        "unit": "mg/L",
        "min_val": 0.0,
        "max_val": 10.0,
        "safe_min": 0.5,
        "safe_max": 4.0,
        "warn_min": 0.2,
        "warn_max": 5.0,
        "description": "Disinfectant added to public water systems to kill disease-causing microbes."
    },
    "sulfate": {
        "name": "Sulfate",
        "unit": "mg/L",
        "min_val": 0.0,
        "max_val": 1000.0,
        "safe_min": 10.0,
        "safe_max": 250.0,
        "warn_min": 5.0,
        "warn_max": 400.0,
        "description": "Naturally occurring substance in minerals, soil, and rocks. Excess causes laxative effects."
    },
    "conductivity": {
        "name": "Electrical Conductivity",
        "unit": "µS/cm",
        "min_val": 0.0,
        "max_val": 2000.0,
        "safe_min": 150.0,
        "safe_max": 800.0,
        "warn_min": 100.0,
        "warn_max": 1200.0,
        "description": "Measures ionic concentration and ability to conduct electricity."
    },
    "organic_carbon": {
        "name": "Total Organic Carbon (TOC)",
        "unit": "mg/L",
        "min_val": 0.0,
        "max_val": 30.0,
        "safe_min": 1.0,
        "safe_max": 5.0,
        "warn_min": 0.5,
        "warn_max": 10.0,
        "description": "Measure of organic matter in water. High levels foster harmful microbial growth."
    },
    "trihalomethanes": {
        "name": "Trihalomethanes (THMs)",
        "unit": "µg/L",
        "min_val": 0.0,
        "max_val": 200.0,
        "safe_min": 10.0,
        "safe_max": 80.0,
        "warn_min": 5.0,
        "warn_max": 100.0,
        "description": "Chemical compounds formed when chlorine reacts with organic matter; potential carcinogens."
    },
    "turbidity": {
        "name": "Turbidity",
        "unit": "NTU",
        "min_val": 0.0,
        "max_val": 50.0,
        "safe_min": 0.1,
        "safe_max": 5.0,
        "warn_min": 0.0,
        "warn_max": 8.0,
        "description": "Cloudiness or haziness caused by suspended particles; high turbidity shields pathogens."
    },
    "dissolved_oxygen": {
        "name": "Dissolved Oxygen (DO)",
        "unit": "mg/L",
        "min_val": 0.0,
        "max_val": 20.0,
        "safe_min": 6.0,
        "safe_max": 14.0,
        "warn_min": 4.0,
        "warn_max": 16.0,
        "description": "Amount of gaseous oxygen dissolved in water. Essential for water freshness and aquatic health."
    },
    "nitrate": {
        "name": "Nitrate",
        "unit": "mg/L",
        "min_val": 0.0,
        "max_val": 100.0,
        "safe_min": 0.0,
        "safe_max": 10.0,
        "warn_min": 0.0,
        "warn_max": 20.0,
        "description": "Inorganic compound from fertilizer runoff and sewage. Elevated levels cause Methemoglobinemia."
    },
    "lead": {
        "name": "Lead",
        "unit": "mg/L",
        "min_val": 0.0,
        "max_val": 1.0,
        "safe_min": 0.0,
        "safe_max": 0.015,
        "warn_min": 0.0,
        "warn_max": 0.030,
        "description": "Toxic heavy metal from corroding plumbing. Causes serious neurological and organ damage."
    }
}

FEATURE_COLUMNS = list(PARAMETER_CONFIG.keys())

def generate_water_dataset(n_samples: int = 3500, random_state: int = 42) -> pd.DataFrame:
    """
    Generates a realistic synthetic dataset based on WHO/EPA standard distributions
    with correlated contamination physics.
    """
    np.random.seed(random_state)
    
    # Generate balanced sample counts (50% safe, 50% contaminated)
    n_safe = n_samples // 2
    n_unsafe = n_samples - n_safe
    
    # 1. Safe samples (values mostly drawn within safe WHO ranges)
    safe_data = {
        "ph": np.random.normal(7.2, 0.4, n_safe),
        "hardness": np.random.normal(130, 25, n_safe),
        "solids": np.random.normal(280, 60, n_safe),
        "chloramines": np.random.normal(2.2, 0.6, n_safe),
        "sulfate": np.random.normal(140, 35, n_safe),
        "conductivity": np.random.normal(420, 80, n_safe),
        "organic_carbon": np.random.normal(2.8, 0.7, n_safe),
        "trihalomethanes": np.random.normal(42, 12, n_safe),
        "turbidity": np.random.normal(1.8, 0.8, n_safe),
        "dissolved_oxygen": np.random.normal(8.5, 1.2, n_safe),
        "nitrate": np.random.normal(3.5, 1.8, n_safe),
        "lead": np.random.exponential(0.003, n_safe)
    }
    
    # 2. Unsafe samples (values driven into warning or dangerous zones)
    unsafe_data = {
        "ph": np.random.choice(np.concatenate([
            np.random.normal(4.8, 0.8, n_unsafe // 2),  # acidic contamination
            np.random.normal(10.2, 0.8, n_unsafe - (n_unsafe // 2))  # alkaline contamination
        ]), size=n_unsafe),
        "hardness": np.random.normal(280, 80, n_unsafe),
        "solids": np.random.exponential(900, n_unsafe) + 300,
        "chloramines": np.random.choice(np.concatenate([
            np.random.normal(0.1, 0.08, n_unsafe // 2),  # unchlorinated / high risk
            np.random.normal(7.5, 1.2, n_unsafe - (n_unsafe // 2))  # over-chlorinated
        ]), size=n_unsafe),
        "sulfate": np.random.normal(450, 120, n_unsafe),
        "conductivity": np.random.normal(1100, 300, n_unsafe),
        "organic_carbon": np.random.normal(12.5, 3.5, n_unsafe),
        "trihalomethanes": np.random.normal(115, 25, n_unsafe),
        "turbidity": np.random.exponential(9.0, n_unsafe) + 3.0,
        "dissolved_oxygen": np.random.normal(3.2, 1.1, n_unsafe),
        "nitrate": np.random.exponential(25.0, n_unsafe) + 8.0,
        "lead": np.random.exponential(0.045, n_unsafe) + 0.012
    }
    
    df_safe = pd.DataFrame(safe_data)
    df_safe["is_potable"] = 1
    
    df_unsafe = pd.DataFrame(unsafe_data)
    df_unsafe["is_potable"] = 0
    
    df = pd.concat([df_safe, df_unsafe], ignore_index=True).sample(frac=1, random_state=random_state).reset_index(drop=True)
    
    # Clip values to physically realistic boundaries
    for param, config in PARAMETER_CONFIG.items():
        df[param] = np.clip(df[param], config["min_val"], config["max_val"])
        
    return df
