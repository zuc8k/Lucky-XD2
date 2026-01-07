using UnityEngine;
using UnityEngine.Networking;
using System.Collections;
using Game.Core;
using Game.Config;

public class ShopManager : MonoBehaviour
{
    public void LoadGifts()
    {
        StartCoroutine(GetGifts());
    }

    IEnumerator GetGifts()
    {
        UnityWebRequest req =
          UnityWebRequest.Get(ApiConfig.BASE_URL + "/shop/gifts");

        req.SetRequestHeader(
          "Authorization",
          "Bearer " + AuthToken.Get()
        );

        yield return req.SendWebRequest();

        Debug.Log(req.downloadHandler.text);
        // اعرض الهدايا في UI
    }

    public void SendGift(string giftId, string targetUserId)
    {
        StartCoroutine(SendGiftRequest(giftId, targetUserId));
    }

    IEnumerator SendGiftRequest(string giftId, string targetUserId)
    {
        string json =
          "{\"giftId\":\"" + giftId +
          "\",\"targetUserId\":\"" + targetUserId + "\"}";

        UnityWebRequest req =
          new UnityWebRequest(
            ApiConfig.BASE_URL + "/shop/send-gift",
            "POST"
          );

        req.uploadHandler =
          new UploadHandlerRaw(
            System.Text.Encoding.UTF8.GetBytes(json)
          );
        req.downloadHandler = new DownloadHandlerBuffer();

        req.SetRequestHeader("Content-Type", "application/json");
        req.SetRequestHeader(
          "Authorization",
          "Bearer " + AuthToken.Get()
        );

        yield return req.SendWebRequest();

        Debug.Log("🎁 Gift Sent");
    }
}