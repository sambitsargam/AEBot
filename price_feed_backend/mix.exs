defmodule PriceFeedBackend.MixProject do
  use Mix.Project

  def project do
    [
      app: :price_feed_backend,
      version: "0.1.0",
      elixir: "~> 1.17",
      start_permanent: Mix.env() == :prod,
      deps: deps()
    ]
  end

  # Run "mix help compile.app" to learn about applications.
  def application do
    [
      extra_applications: [:logger]
    ]
  end

  # Run "mix help deps" to learn about dependencies.
 defp deps do
  [
    {:httpoison, "~> 1.8"},
    {:jason, "~> 1.2"},
    {:phoenix, "~> 1.6"},
    {:phoenix_ecto, "~> 4.1"},
    {:ecto_sql, "~> 3.7"},
    {:plug_cowboy, "~> 2.5"}
  ]
end

end
