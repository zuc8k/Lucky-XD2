using UnityEngine;
using UnityEngine.Networking;
using System.Collections;
using Game.Core;
using Game.Config;

public class PaymentManager : MonoBehaviour
{
    public void CompletePurchase(
        string productId,
        string transactionId,
        string provider
    )
    {
        StartCoroutine(SendToServer(
          productId,
          transactionId,
          provider
        ));
    }

    IEnumerator SendToServer(
      string productId,
      string transactionId,
      string provider
    )
    {
        string json =
          "{ \"productId\":\"" + productId +
          "\", \"transactionId\":\"" + transactionId +
          "\", \"provider\":\"" + provider + "\" }";

        UnityWebRequest req =
          new UnityWebRequest(
            ApiConfig.BASE_URL + "/payment/verify",
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

        Debug.Log("💰 Payment Verified");
    }
}