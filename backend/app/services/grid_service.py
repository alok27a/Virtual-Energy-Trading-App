import pandas as pd
from datetime import date, timedelta
from gridstatus import CAISO, MISO, PJM, Ercot, SPP, ISONE, NYISO

# --- ARCHITECTURAL FIX: LAZY INITIALIZATION ---
# This dictionary now holds the CLASS for each ISO, not an INSTANCE.
# This prevents the application from crashing on startup if an API key (like PJM's) 
# is missing, because the object is only created when a user requests its data.
ISO_MAPPING = {
    "CAISO": CAISO, "MISO": MISO, "PJM": PJM, "ERCOT": Ercot,
    "SPP": SPP, "ISONE": ISONE, "NYISO": NYISO,
}

class GridService:
    """Service layer for fetching and processing data from gridstatus.io."""
    async def get_market_prices(self, iso_name: str, target_date: date) -> tuple[pd.DataFrame, pd.DataFrame]:
        # Step 1: Look up the correct class from the mapping.
        iso_class = ISO_MAPPING.get(iso_name)
        if not iso_class:
            raise ValueError(f"Invalid ISO: {iso_name}. Supported ISOs are {list(ISO_MAPPING.keys())}")

        # Step 2: Instantiate the class only when it's needed.
        # If the user requested PJM and the key is missing, the error will happen here,
        # but it will not crash the entire application on startup.
        iso_instance = iso_class()

        # Step 3: Fetch data using the created instance.
        da_lmp = iso_instance.get_lmp(date=target_date, market="DAY_AHEAD_HOURLY")
        rt_lmp = iso_instance.get_lmp(start=target_date, end=target_date + timedelta(days=1), market="REAL_TIME_5_MIN")

        da_df = self._format_dataframe(da_lmp, 'LMP')
        rt_df = self._format_dataframe(rt_lmp, 'LMP')

        return da_df, rt_df

    def _format_dataframe(self, df: pd.DataFrame, value_column: str) -> pd.DataFrame:
        """Helper function to format DataFrame for the frontend chart."""
        if df is None or df.empty or value_column not in df.columns or 'Time' not in df.columns:
            return pd.DataFrame(columns=['x', 'y'])

        df_filtered = df.copy()
        if 'Location' in df_filtered.columns and df_filtered['Location'].nunique() > 1:
            representative_location = df_filtered['Location'].unique()[0]
            df_filtered = df_filtered[df_filtered['Location'] == representative_location]

        df_formatted = df_filtered[['Time', value_column]].copy()
        df_formatted['x'] = pd.to_datetime(df_formatted['Time']).astype('int64') // 10**6
        df_formatted['y'] = df_formatted[value_column]

        return df_formatted[['x', 'y']].dropna().sort_values('x').reset_index(drop=True)
    
    