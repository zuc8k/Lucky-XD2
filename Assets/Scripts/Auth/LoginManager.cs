using UnityEngine;
using UnityEngine.Networking;
using UnityEngine.SceneManagement;
using System.Collections;
using Game.Config;
using Game.Core;

public class LoginManager : MonoBehaviour
{
    public string username;
    public string password;

    public void Login()
    {
        StartCoroutine(LoginRequest());
    }

    IEnumerator LoginRequest()
    {
        string url = ApiConfig.BASE_URL + "/auth/login";

        string json = JsonUtility.ToJson(new LoginData(username, password));

        UnityWebRequest req = new UnityWebRequest(url, "POST");
        byte[] body = System.Text.Encoding.UTF8.GetBytes(json);

        req.uploadHandler = new UploadHandlerRaw(body);
        req.downloadHandler = new DownloadHandlerBuffer();
        req.SetRequestHeader("Content-Type", "application/json");

        yield return req.SendWebRequest();

        if (req.result == UnityWebRequest.Result.Success)
        {
            LoginResponse res =
                JsonUtility.FromJson<LoginResponse>(req.downloadHandler.text);

            AuthToken.Save(res.token);

            SceneManager.LoadScene("MainMenu"); // بعد اللوجن
        }
        else
        {
            Debug.Log("Login Failed");
        }
    }
}

[System.Serializable]
public class LoginData
{
    public string username;
    public string password;

    public LoginData(string u, string p)
    {
        username = u;
        password = p;
    }
}

[System.Serializable]
public class LoginResponse
{
    public string token;
}