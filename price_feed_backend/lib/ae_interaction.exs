defmodule AEInteraction do
  require Logger

  @node_url "https://testnet.aeternity.io"  # Replace with your AE node URL (e.g., mainnet/testnet)

  def call_set_price(price) do
    timestamp = :os.system_time(:seconds)  # Current timestamp in seconds

    contract_address = "ct_2ZYGTsG4m9G5C2MXWJDUZHbGLoVDMQ4t1kTFF2mbycrxXn1w6b"  # Replace with your contract address

    params = %{
      "contract_id" => contract_address,
      "call_data" => "set_price",
      "params" => [price, timestamp],
      "method" => "contract_call"
    }

    send_to_ae_node(params)
  end

  defp send_to_ae_node(params) do
    headers = [{"Content-Type", "application/json"}]

    body = Jason.encode!(params)

    case HTTPoison.post(@node_url, body, headers) do
      {:ok, response} ->
        case Jason.decode(response.body) do
          {:ok, %{"result" => result}} ->
            IO.puts("Successfully submitted to the contract. Result: #{inspect(result)}")
          _ ->
            IO.puts("Error processing the response.")
        end

      {:error, reason} ->
        IO.puts("Failed to interact with node: #{inspect(reason)}")
    end
  end
end
