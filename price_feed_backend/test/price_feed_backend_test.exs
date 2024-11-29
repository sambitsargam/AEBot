defmodule PriceFeedBackendTest do
  use ExUnit.Case
  doctest PriceFeedBackend

  test "greets the world" do
    assert PriceFeedBackend.hello() == :world
  end
end
