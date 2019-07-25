defmodule PhoenixReactPlaygroundWeb.RoomChannel do
  use PhoenixReactPlaygroundWeb, :channel
  import Ecto.Query
  alias Todo.TodoContext
  alias Todo.TodoContext.Todo

  # def join("room:lobby", _message, socket) do
  #   {:ok, socket}
  # end
  # def join("room:" <> _private_room_id, _params, _socket) do
  #   {:error, %{reason: "unauthorized"}}
  # end

  def join("room:lobby", payload, socket) do
    if authorized?(payload) do
      # IO.puts "JOINED ROOM LOBBY SUCCESSFULLY"
      {:ok, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  def handle_in("ping", payload, socket) do
    {:reply, {:ok, payload}, socket}
  end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (room:lobby).

  def handle_in("new_msg", %{"body" => body}, socket) do
    # IO.puts "NEW MESSAGE IN HANDLE_IN"
    modeled_body = %{"name" => body, "message" => body}
    message_changeset = PhoenixReactPlayground.Message.changeset(%PhoenixReactPlayground.Message{}, modeled_body)
    db_res = PhoenixReactPlayground.Repo.insert(message_changeset)
    res_data = elem(db_res, 1)
    json_tuple = (Poison.encode(res_data))
    json_data = elem(json_tuple,1)
    broadcast!(socket, "new_msg", %{message: json_data})
    {:noreply, socket}
  end

  def handle_in("load", _payload, socket) do
    message_data = PhoenixReactPlayground.Repo.all(PhoenixReactPlayground.Message)
    json_data = Enum.map(message_data, fn message -> message |> Poison.encode end)
    json_data_scrubbed = Enum.map(json_data, fn message -> elem(message, 1) end)
    broadcast!(socket, "load", %{messages: json_data_scrubbed})
    {:noreply, socket}
  end

  def handle_in("update", %{"id" => id, "body" => body}, socket) do
    IO.puts "IN UPDATE"
    query = from message in PhoenixReactPlayground.Message,
      where: message.id == ^id,
      select: message
    target_message_struct = PhoenixReactPlayground.Repo.one!(query)
    name_data = Map.get(body, "name")
    message = Ecto.Changeset.change(target_message_struct, name: name_data, message: name_data)
    change_res = PhoenixReactPlayground.Repo.update(message)
    change_data = elem(change_res,1)
    json_tuple = Poison.encode(change_data)
    json_data = elem(json_tuple,1)
    broadcast!(socket, "update", %{updated_message: json_data})
    {:noreply, socket}
  end

  def handle_in("delete", %{"id" => id}, socket) do
    query = from message in PhoenixReactPlayground.Message,
      where: message.id == ^id,
      select: message
    target_message_struct = PhoenixReactPlayground.Repo.one!(query)
    deletion_res = PhoenixReactPlayground.Repo.delete(target_message_struct)
    deleted_data = elem(deletion_res,1)
    json_tuple = Poison.encode(deleted_data)
    json_data = elem(json_tuple,1)
    broadcast!(socket, "delete", %{deleted_message: json_data})
    {:noreply, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
