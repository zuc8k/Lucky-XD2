using UnityEngine;
using WebSocketSharp;
using System;

public class SocketClient : MonoBehaviour
{
    WebSocket ws;
    public static SocketClient Instance;
    public string roomId;

    void Awake()
    {
        Instance = this;
        ws = new WebSocket("ws://localhost:3000/socket.io/?EIO=4&transport=websocket");

        ws.OnMessage += (sender, e) =>
        {
            Debug.Log("📩 " + e.Data);
        };

        ws.Connect();
    }

    public void CreateRoom()
    {
        Send("create_room");
    }

    public void JoinRoom(string id)
    {
        roomId = id;
        Send("join_room", id);
    }

    public void RollDice()
    {
        Send("roll_dice", roomId);
    }

    void Send(string evt, string data = "")
    {
        ws.Send($"42[\"{evt}\",\"{data}\"]");
    }
}