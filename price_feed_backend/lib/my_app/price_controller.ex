defmodule MyAppWeb.PriceController do
  use MyAppWeb, :controller

  def show(conn, _params) do
    price = PriceFetcher.fetch_price()

    if price != nil do
      json(conn, %{price: price})
    else
      conn
      |> put_status(:internal_server_error)
      |> json(%{error: "Failed to fetch price"})
    end
  end
end
