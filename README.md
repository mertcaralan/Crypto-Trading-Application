# Crypto Trading Application

## 💡 Project Overview

**Crypto Trading Application** is an interactive, web-based platform that simulates cryptocurrency trading. Users can explore real-world trading scenarios, manage their virtual portfolios, and visualize market trends using dynamic charts. It provides a hands-on approach to learning how cryptocurrency markets work, all while using virtual funds to avoid financial risk.

### Key Features:

- **User Profile Management**: Easily create, manage, and track multiple user profiles for personalized trading experiences.
- **Crypto Trading Simulation**: Perform buy and sell transactions using historical cryptocurrency data and explore market trends.
- **Wallet Management**: Track virtual cash and cryptocurrency holdings, with real-time updates after every trade.
- **Interactive User Interface**: Engage with smooth animations, transitions, and an intuitive design that adapts to both desktop and mobile devices.

---

## 🌍 Live Preview

> **Check out the project:** Host it locally or deploy it online to experience the full functionality. Use the links provided in the deployment section to access the live version.

---

## 👤 Features

### 🏠 **Homepage**

The homepage introduces the platform and gives a brief overview of its features. It contains links to the following sections:

- **Team Members**: View the developers and contributors behind the project:
  - **Mert Çaralan**
  - **Zeynep Günal**
- **About**: Learn more about the project and how it simulates cryptocurrency trading.

### 🔍 **User Profiles**

The **User Profile Management** feature allows users to create and manage multiple profiles for a personalized trading experience. Here’s how it works:

- **Create, view, and delete profiles**: Users can easily create new profiles, each with their own trading history and portfolio. Profiles can also be deleted if no longer needed.
- **Switch between profiles**: When logged in, users can select a profile to track their personal trading history and performance.
- **Trading history per profile**: Each profile has its unique trading records, showing past buy/sell transactions, wallet balance, and portfolio value. This ensures that users can simulate multiple trading strategies across different profiles.
- **Local storage**: Profiles are stored locally on the browser using `localStorage`, allowing users to persist data across sessions.

### ⚖️ **Trading Simulation**

The **Crypto Trading Simulation** feature mimics real cryptocurrency trading based on historical market data, allowing users to perform simulated trades without financial risk. Key aspects of this feature include:

- **Buy and Sell Trades**: Users can execute buy and sell transactions for different cryptocurrencies using virtual funds. The trade is executed using historical data from the `db.js` file, which contains a set of simulated market prices.
- **Cryptocurrencies Available**: The application supports multiple popular cryptocurrencies, such as:
  - **Bitcoin (BTC)**
  - **Ethereum (ETH)**
  - **Cardano (ADA)**
  - Other cryptocurrencies can be added in the future to expand the platform.
- **Realistic Trading Experience**: The simulated trades are based on past market data, which gives users an opportunity to explore how the market reacts to different conditions without any real financial risk.
- 
### 💳 **Wallet Management**

The **Wallet Management** feature allows users to manage their virtual cash and cryptocurrency holdings. After each trade, the wallet updates in real-time to reflect the new balance. Key aspects include:

- **Virtual Wallet**: Users receive a starting balance of virtual cash (USD or other fiat currencies) and can buy and sell cryptocurrency assets within the platform.
- **Real-Time Balance Updates**: The wallet automatically updates after every transaction, showing the latest balance of cash and crypto holdings. Users can check how their portfolio is performing.
- **Detailed Transaction Breakdown**: Each trade performed is recorded with details such as the cryptocurrency traded, the amount bought or sold, the price at the time of trade, and the resulting wallet balance. A summary of all transactions is displayed for users to keep track of their trading activity.
- **Transaction History**: Users can view their transaction history in the wallet, which includes previous buys, sells, and current holdings.

### 🎨 **Interactive User Interface**

The **User Interface (UI)** is designed to be visually appealing, engaging, and user-friendly. Here are the features:

- **Smooth Transitions and Animations**: All actions, including profile switching, trading actions, and page loads, feature smooth animations to enhance the user experience. This ensures that users have an enjoyable and intuitive interface.
- **Responsive Design**: The UI adapts seamlessly to different screen sizes, from desktop computers to mobile devices. This ensures the platform is usable and attractive on all devices.
- **Customizable Settings**: Users can personalize their experience, such as adjusting the theme, setting default cryptocurrency, or choosing a preferred currency for the wallet.

---

## 🛠️ Technologies Used

| Technology       | Purpose                                                                                                               |
| ---------------- | --------------------------------------------------------------------------------------------------------------------- |
| **HTML5**        | Used for structuring the web pages, creating the layout, and embedding multimedia content.                            |
| **CSS3**         | Styling the web pages, adding animations, transitions, and ensuring responsive design.                                |
| **JavaScript**   | Handling all dynamic content, interactivity, and DOM manipulation, including trade functionality and chart rendering. |
| **jQuery**       | Used for simplifying DOM manipulation, making event handling and AJAX requests easier.                                |

---

## 📸 File Structure

```
.
├── index.html        # Main HTML file for the app interface
├── style.css         # Custom styles for layout and visual design
├── script.js         # JavaScript for handling dynamic interactions and logic
├── db.js             # Historical market data for the cryptocurrency trades
├── icons/            # Folder containing all the icons used in the app
├── images/           # Folder containing images for documentation and user interface elements
└── README.md         # Detailed project documentation
```

---

## 📸 Screenshots

### Team Members Page



### Profiles Page



### Trading Page



---

## 🌐 Deployment

To deploy the Crypto Trading Application online, you can use hosting platforms like:

- **GitHub Pages**: Host your site directly from your GitHub repository with minimal setup.
- **Netlify**: An easy-to-use platform for deploying static sites.
- **Vercel**: Ideal for deploying web applications quickly.

---

## 💪 Contributing

Contributions are encouraged! If you'd like to enhance or improve the project, please follow these steps:

1. **Fork** the repository to your own account.
2. **Create a new branch** for your feature (`git checkout -b feature-name`).
3. **Commit your changes** (`git commit -m 'Add feature-name'`).
4. **Push to your branch** (`git push origin feature-name`).
5. **Open a pull request** to contribute your changes back to the main project.

---

## 📄 License

This project is licensed under the MIT License.

