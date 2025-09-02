# Virtual-Energy-Trading-App

This project is a full-stack simulation platform for a virtual energy trader. It enables users to practice trading strategies in historical energy markets, seeking to generate profit by buying low in the Day-Ahead market and selling high against the Real-Time market prices.

The application is built with a modern technology stack, featuring a React frontend with Chakra UI for a polished user experience, and a high-performance FastAPI backend powered by a MongoDB database.

_The main dashboard, showing market price visualizations, bidding forms, and simulation results._

## The Trader's Goal: A Virtual Trading Strategy

The objective of a trader on this platform is to act as a financial intermediary, helping to balance the energy grid while generating a profit. The core strategy is based on predicting the difference between two distinct market prices:

1.  **The Day-Ahead Price:** This is the price set in advance for a specific hour of the next day. As a trader, you analyze historical data and forecasts to predict if this price will be high or low. **This is the market you place bids in.**
    
2.  **The Real-Time Price:** This is the price set every 5 minutes on the actual day of delivery. It reflects the real-time supply and demand on the grid and is often more volatile. **This market determines your profit or loss.**
    

### The Two Core Trading Plays:

*   **Buying Low (Long Position):** If you believe the Day-Ahead price for a future hour will be _lower_ than what the Real-Time price will actually be, you place a **BUY** bid. If your bid clears and the Real-Time price is indeed higher, you profit from the difference.
    
*   **Selling High (Short Position):** If you believe the Day-Ahead price for a future hour will be _higher_ than the Real-Time price, you place a **SELL** bid. If your bid clears and the Real-Time price is lower, you profit from the difference (as you "sold" at a high price and financially "bought back" at a lower one).
    

This platform allows you to test these strategies using real historical data without any financial risk.

## Core Features

*   **Full-Stack Architecture:** A decoupled frontend and backend for a scalable and maintainable application.
    
*   **Secure User Authentication:** Complete user registration and login system using JWT (JSON Web Tokens) for session management.
    
*   **Dynamic Market Selection:** Users can select from multiple Independent System Operators (ISOs) like CAISO, MISO, and ERCOT, and choose any historical date to analyze and trade.
    
*   **Realistic P&L Simulation:** The core of the application. It fetches real historical market data to calculate which user bids would have cleared and what the final profit or loss (P&L) would have been.
    
*   **Interactive Data Visualizations:** Built with Recharts, the dashboard provides three key charts:
    
    1.  **Market Prices Chart:** Compares Day-Ahead vs. 5-Minute Real-Time prices.
        
    2.  **Submitted Bids Chart:** Visualizes the user's own bid prices for the selected day.
        
    3.  **P&L Results Chart:** Summarizes the profit or loss by hour after a simulation.
        
*   **Day-Ahead Bidding System:** Users can submit buy/sell bids with specific prices and quantities for any hour of the day. The backend enforces a rule of 10 bids per user, per hour.
    
*   **Asynchronous Backend:** The FastAPI backend is fully asynchronous, ensuring high performance even when fetching large datasets from external APIs.
    
*   **NoSQL Database:** Uses MongoDB with Beanie (an async ODM) to efficiently store user, bid, and position data.
    

## Technology Stack

### Backend

*   **Framework:** FastAPI
    
*   **Database:** MongoDB
    
*   **ODM (Object-Document Mapper):** Beanie
    
*   **Authentication:** JWT with Passlib for password hashing
    
*   **Data Sourcing:** `gridstatus` Python library
    
*   **Server:** Uvicorn
    

### Frontend

*   **Framework:** React
    
*   **UI Library:** Chakra UI
    
*   **Routing:** React Router
    
*   **State Management:** React Context API
    
*   **Data Visualization:** Recharts
    
*   **API Communication:** Fetch API
    

### Backend (`/backend`)
```
    /app
    |-- /api
    |   |-- /endpoints  (API routes for auth, bids, etc.)
    |-- /auth           (Security, JWT handling, dependencies)
    |-- /core           (Configuration settings)
    |-- /models         (Database models using Beanie)
    |-- /schemas        (Pydantic schemas for data validation)
    |-- /services       (Business logic for simulation and grid data)
    |-- database.py     (Database initialization)
    |-- main.py         (Main FastAPI app entrypoint)
    |-- .env            (Environment variables)
    |-- requirements.txt
``` 

### Frontend (`/frontend`)
```
    /src
    |-- /components     (Reusable React components: charts, forms, tables)
    |-- /context        (Global state management, e.g., AuthContext)
    |-- /pages          (Top-level page components: Login, Signup, Dashboard)
    |-- /services       (API communication layer)
    |-- App.js          (Main application router)
    |-- index.js        (Application entrypoint)
    |-- theme.js        (Chakra UI custom theme)
    |-- package.json
```

## Setup and Installation
To run this project, you will need **Node.js** and **npm** installed.

### Clone the Repository

```bash
git clone [your-repo-link]
cd [your-repo-name]
```

### Backend Setup

Details in /frontend

### Frontend Setup

Details in /backend 
    

## How to Use: A Sample Trading Scenario

This example demonstrates how to test the full workflow of the application.

### 1\. Register and Log In

First, create an account via the **Sign Up** page and then **Log In**. You will be directed to the main dashboard.

### 2\. Select Your Market

For this example, we will trade in the **CAISO** market on a past date with interesting price volatility.

*   **ISO:** Select `CAISO` from the dropdown.
    
*   **Date:** Choose `2024-05-15`.
    

### 3\. Analyze the Market

Observe the **Market Prices Chart**. You'll notice that the Day-Ahead price (purple line) is relatively low in the afternoon (around hour 14) and higher in the evening (around hour 19). This is our trading opportunity.

### 4\. Place Strategic Bids

Our strategy is to "buy low" and "sell high". To ensure our bids clear for this test, we will place them aggressively.

*   **Place a BUY Bid (Buy Low):**
    
    *   Hour: `14` (where prices look low)
        
    *   Type: `Buy`
        
    *   Quantity: `10`
        
    *   Price: `200` (We bid very high to guarantee it clears)
        
    *   Click **Submit Bid**.
        
*   **Place a SELL Bid (Sell High):**
    
    *   Hour: `19` (where prices look high)
        
    *   Type: `Sell`
        
    *   Quantity: `10`
        
    *   Price: `5` (We bid very low to guarantee it clears)
        
    *   Click **Submit Bid**.
        

You will see both bids appear in the **Submitted Bids** table and chart.

### 5\. Run the Simulation

Click the blue **"Run P&L Simulation"** button. The application will fetch the historical market data for `2024-05-15` and process your bids.

### 6\. Analyze Your Results

The **Simulation Results** section will appear at the bottom of the page. You will see:

*   A summary of your **Total Realized P&L**.
    
*   The results table, showing the official `clearing_price` for each hour and the `realized_pnl` for each trade.
    
*   The **P&L by Hour** chart, visualizing your profit/loss for each successful trade.
    

This completes a full simulation cycle, demonstrating the platform's core functionality.

## Core Concepts & Project Assumptions

This platform operates on several key principles and assumptions outlined in the project specification.

*   **Financial-Only Trading:** The trader is purely a financial entity. You do not own any power generators or have any customers demanding electricity. Your trades are financial contracts that are settled against market prices.
    
*   **Small Player Assumption:** The simulation assumes you are a small trader. Your bids are never large enough to influence the market's final `clearing_price`. The platform uses the actual historical prices, regardless of your actions.
    
*   **Day-Ahead vs. Real-Time Market:** As a trader on this platform, you **only** place bids in the Day-Ahead market. The Real-Time market data is used automatically by the simulation to calculate your financial settlement (your profit or loss). You do not interact with the Real-Time market directly.
    
*   **The 11 AM Bidding Deadline:** The official specification requires an 11 AM deadline. This rule is implemented in the backend, but with a crucial modification for a simulation tool:
    
    > **The 11 AM UTC deadline is enforced ONLY for bids placed for the** _**current day**_**.** This is a deliberate design choice to allow users the flexibility to run simulations on **any historical data**. Without this exception, it would be impossible to test past market scenarios.

## Future Roadmap

This platform provides a strong foundation for a more advanced energy trading simulation. Potential future enhancements include:

*   **Advanced Charting:** Integrate more sophisticated charting libraries to include technical indicators like moving averages, volume profiles, or candlestick charts for price data.
    
*   **Portfolio Management Page:** A dedicated dashboard page to view all-time P&L, trade history across all dates, and overall performance metrics.
    
*   **More Complex Bid Types:** Introduce other common bid types found in energy markets, such as block bids (linking bids across multiple hours) or virtual bids.
    
*   **Risk Management Features:** Allow users to set daily loss limits or position size limits to practice disciplined trading.
    
*   **User Leaderboard:** Implement a competitive leaderboard to rank traders by their weekly or monthly P&L, fostering engagement.
    
*   **Machine Learning Integration:** Develop a feature that uses historical data to suggest potentially profitable trading hours or price points based on machine learning models.