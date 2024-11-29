defmodule PriceFetcher do
  require Logger

  @api_url "https://api.coingecko.com/api/v3/simple/price?ids=aeternity&vs_currencies=usd"

  def fetch_price do
    case HTTPoison.get(@api_url) do
      {:ok, response} ->
        case Jason.decode(response.body) do
          {:ok, %{"aeternity" => %{"usd" => price}}} ->
            IO.puts("Current AE price in USD: #{price}")
            price
          _ ->
            IO.puts("Failed to parse response")
            nil
        end

      {:error, _reason} ->
        IO.puts("Error fetching price")
        nil
    end
  end
end
