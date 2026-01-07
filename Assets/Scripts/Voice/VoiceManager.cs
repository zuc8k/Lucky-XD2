using UnityEngine;
using UnityEngine.Networking;
using System.Collections;
using Agora.Rtc;
using Game.Config;

public class VoiceManager : MonoBehaviour
{
    public string channelName;
    private IRtcEngine rtcEngine;

    public void JoinVoice(string uid)
    {
        StartCoroutine(GetTokenAndJoin(uid));
    }

    IEnumerator GetTokenAndJoin(string uid)
    {
        string url = ApiConfig.BASE_URL + "/voice/token";

        string json = JsonUtility.ToJson(
          new VoiceData(channelName, uid)
        );

        UnityWebRequest req = new UnityWebRequest(url, "POST");
        req.uploadHandler =
          new UploadHandlerRaw(
            System.Text.Encoding.UTF8.GetBytes(json)
          );
        req.downloadHandler = new DownloadHandlerBuffer();
        req.SetRequestHeader("Content-Type", "application/json");

        yield return req.SendWebRequest();

        VoiceToken res =
          JsonUtility.FromJson<VoiceToken>(
            req.downloadHandler.text
          );

        rtcEngine = RtcEngine.Create(res.appId);
        rtcEngine.EnableAudio();

        rtcEngine.JoinChannel(
          res.token,
          channelName,
          "",
          uint.Parse(uid)
        );
    }

    public void Mute(bool mute)
    {
        rtcEngine.MuteLocalAudioStream(mute);
    }

    public void Leave()
    {
        rtcEngine.LeaveChannel();
        rtcEngine.Dispose();
    }
}

[System.Serializable]
public class VoiceData
{
    public string channel;
    public string uid;

    public VoiceData(string c, string u)
    {
        channel = c;
        uid = u;
    }
}

[System.Serializable]
public class VoiceToken
{
    public string token;
    public string appId;
}