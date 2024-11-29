defmodule MyAppWeb.Router do
  use MyAppWeb, :router

  scope "/api", MyAppWeb do
    pipe_through :api
    get "/price", PriceController, :show
  end
end
