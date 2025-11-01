import pandas as pd

def process_csv(file):
    df = pd.read_csv(file)
    # example processing
    filtered_df = df[df["value"] > 10] if "value" in df.columns else df
    return filtered_df.to_dict(orient="records")