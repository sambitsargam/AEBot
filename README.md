# **ÆBot: Empowering the Æternity Blockchain Ecosystem**

ÆBot is a robust, multifunctional project designed to simplify and enhance interactions with the **Æternity blockchain**. With its innovative tools, it addresses key challenges in smart contract development, blockchain accessibility, and real-time data integration, making blockchain technology more user-friendly and powerful.


## **Features**

### **1. Smart Contract Conversion and Deployment**
ÆBot provides a user-friendly tool to convert source code from multiple programming languages into Sophia, Æternity’s smart contract language, and deploy the contracts directly onto the blockchain.

#### Key Features:
- **Multi-Language Support**: Converts source code written in **Erlang**, **Go**, and **Solidity** into Sophia.
- **Code Editor**:
  - Review converted Sophia code before deployment.
  - Make modifications directly in the editor.
- **One-Click Deployment**: Deploy contracts seamlessly to the Æternity blockchain.
- **Syntax Highlighting**: Powered by **Prism.js**, offering clean, color-coded views for readability.
- **Animations**: Enhanced user experience with **Framer Motion** for smooth animations.

#### Technical Details:
- **Frontend Framework**: React.js
- **Syntax Highlighting**: Prism.js
- **Animations**: Framer Motion
- **Blockchain SDK**: Æternity SDK to handle contract deployment.

### **2. Blockchain Chatbot Interface**
ÆBot introduces an intuitive chatbot interface, making blockchain interactions as simple as chatting.

#### Key Features:
- **Hero Wallet Integration**:
  - Securely connects user wallets.
  - Verifies user identity to ensure secure transactions.
- **Blockchain Operations**:
  - Check wallet balances in real time.
  - Execute AE token transfers through conversational commands.
- **Conversational AI**:
  - Offers a natural, easy-to-use chatbot interface for blockchain operations.

#### Technical Details:
- **Frontend Framework**: React.js
- **Blockchain SDK**: Æternity SDK for wallet operations, identity verification, and transactions.
- **Wallet Integration**: Hero Wallet for authentication and secure AE token transfers.


### **3. Real-Time AE Token Pricing Oracle**
ÆBot provides a reliable backend service to fetch and verify real-time AE token prices in USD using a secure oracle.

#### Key Features:
- **Real-Time Pricing**: Fetches accurate AE token prices from off-chain sources.
- **REST API Endpoint**: `/api/price` for easy integration with frontend applications.
- **Oracle Security**: Uses Æternity’s oracle system to ensure data integrity.

#### Technical Details:
- **Backend Framework**: Elixir and Phoenix Framework for robust and scalable services.
- **Æternity Oracle**: Securely bridges off-chain price data to the blockchain.
- **API**: Exposes a simple REST endpoint to integrate with other systems.


## **Technologies Used**

### **Frontend**
- **React.js**: Provides a responsive and dynamic user interface.
- **Prism.js**: Ensures syntax highlighting for clean, readable code displays.
- **Framer Motion**: Delivers smooth animations for an enhanced user experience.

### **Backend**
- **Elixir**: A functional programming language known for scalability and fault tolerance.
- **Phoenix Framework**: A robust framework for real-time web applications.

### **Blockchain**
- **Æternity SDK**: Handles blockchain interactions such as contract deployment and token transfers.
- **Æternity Oracle**: Facilitates secure off-chain data retrieval.
- **Hero Wallet**: Integrates with Æternity blockchain for user authentication and transactions.

## **Installation Guide**

### Prerequisites:
1. **Node.js** (>= 16.0)
2. **Elixir** (>= 1.12) and **Phoenix Framework**
3. **Æternity Node**: Required to interact with the blockchain.
4. **Hero Wallet**: For wallet operations.
5. **Docker** (optional, for running Æternity node locally).

### Steps:

#### **Frontend Setup**
1. Clone the repository:
   ```bash
   git clone https://github.com/sambitsargam/AEbot.git
   cd AEbot
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. Access the application at `http://localhost:3000`.

#### **Backend Elixir Setup**
1. Navigate to the backend folder:
   ```bash
   cd AEbot/price_feed_backend
   ```
2. Install Elixir dependencies:
   ```bash
   mix deps.get
   ```
3. Start the Phoenix server:
   ```bash
   mix phx.server
   ```
4. Access the API at `http://localhost:4000`.

## **How to Use ÆBot**

### **1. Smart Contract Tool**
- Open the application and navigate to the "Smart Contract" section.
- Input your source code in Erlang, Go, or Solidity.
- Convert the code to Sophia and review it in the editor.
- Deploy the converted contract to the Æternity blockchain.

### **2. Blockchain Chatbot**
- Connect your Hero Wallet.
- Verify your identity.
- Interact with the chatbot to check balances or transfer AE tokens.

### **3. AE Token Pricing API**
- Access the `/api/price` endpoint to fetch real-time AE token prices in USD.

## **Contributing**

We welcome contributions to improve ÆBot! Follow these steps to contribute:

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature description"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.


## **License**
This project is licensed under the MIT License. See the `LICENSE` file for details.


## **Support**

For questions or support, contact us at:
- **Email**: sambitsargam2003@gmail.com
- **LinkedIn**: [Sambit Sargam](https://www.linkedin.com/in/sambitsargam/)

ÆBot simplifies blockchain development and interaction, making the Æternity ecosystem accessible to all. Try it today and be part of the blockchain revolution!
