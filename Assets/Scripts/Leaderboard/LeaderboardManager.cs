using UnityEngine;
using UnityEngine.Networking;
using System.Collections;
using Game.Config;

public class LeaderboardManager : MonoBehaviour
{
    public void LoadGlobal()
    {
        StartCoroutine(GetGlobal());
    }

    IEnumerator GetGlobal()
    {
        UnityWebRequest req =
          UnityWebRequest.Get(
            ApiConfig.BASE_URL + "/leaderboard/global"
          );

        yield return req.SendWebRequest();

        Debug.Log(req.downloadHandler.text);
        // اعرض Top Players في UI
    }
}