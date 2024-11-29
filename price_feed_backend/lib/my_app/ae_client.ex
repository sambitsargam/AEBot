defmodule AeClient do
  use HTTPoison.Base

  @node_url "https://testnet.aeternity.io" # Replace with your node URL
  @contract_address "ct_2ZYGTsG4m9G5C2MXWJDUZHbGLoVDMQ4t1kTFF2mbycrxXn1w6b"  # Your contract address

  # Function to make JSON-RPC requests
  def request(method, params \\ []) do
    body = %{
      jsonrpc: "2.0",
      method: method,
      params: params,
      id: 1
    }
    |> Jason.encode!()

    headers = [{"Content-Type", "application/json"}]

    case HTTPoison.post("#{@node_url}/v2", body, headers) do
      {:ok, %HTTPoison.Response{status_code: 200, body: body}} ->
        {:ok, Jason.decode!(body)}

      {:ok, %HTTPoison.Response{status_code: status_code, body: body}} ->
        {:error, "HTTP request failed with status #{status_code}: #{body}"}

      {:error, %HTTPoison.Error{reason: reason}} ->
        {:error, reason}
    end
  end

  # Call a contract method (example: get price)
  def get_price() do
    params = [
      @contract_address,
      "get_price",
      []
    ]

    case request("contract_call", params) do
      {:ok, result} -> IO.inspect(result)
      {:error, reason} -> IO.puts("Error: #{reason}")
    end
  end

  # Set the price on the contract (admin only)
  def set_price(price) do
    params = [
      @contract_address,
      "set_price",
      [price]
    ]

    case request("contract_call", params) do
      {:ok, result} -> IO.inspect(result)
      {:error, reason} -> IO.puts("Error: #{reason}")
    end
  end

  # Add an oracle to the contract
  def add_oracle(oracle_address) do
    params = [
      @contract_address,
      "add_oracle",
      [oracle_address]
    ]

    case request("contract_call", params) do
      {:ok, result} -> IO.inspect(result)
      {:error, reason} -> IO.puts("Error: #{reason}")
    end
  end

  # Remove an oracle from the contract
  def remove_oracle(oracle_address) do
    params = [
      @contract_address,
      "remove_oracle",
      [oracle_address]
    ]

    case request("contract_call", params) do
      {:ok, result} -> IO.inspect(result)
      {:error, reason} -> IO.puts("Error: #{reason}")
    end
  end
end
