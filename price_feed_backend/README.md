# AE Price Feed Backend

This project provides a simple **Phoenix** application to fetch and serve the price of **AE token** in USD. The backend interacts with an **Æternity blockchain node** to retrieve price data and exposes it via an API endpoint.

## Features

- Fetches the AE price in USD from a smart contract deployed on the Æternity blockchain.
- Exposes an API to retrieve the current price in JSON format.
- Written in **Elixir** using the **Phoenix Framework**.

## Prerequisites

Before getting started, ensure you have the following installed:

- **Elixir**: The programming language used to build the backend.
- **Phoenix Framework**: For building web applications.
- **Æternity Node**: For interacting with the Æternity blockchain.
- **Mix**: Elixir's build tool for dependencies and project compilation.

To install Elixir and Phoenix, follow these instructions:
- [Elixir Installation Guide](https://elixir-lang.org/install.html)
- [Phoenix Installation Guide](https://phoenixframework.org/install)

You will also need an **Æternity Node** to interact with the blockchain. Make sure you have access to a node or run one locally. You can follow the official Æternity setup guide [here](https://github.com/aeternity/aeternity/blob/master/docs/getting-started.rst).
