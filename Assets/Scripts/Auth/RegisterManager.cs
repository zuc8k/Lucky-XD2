using UnityEngine;
using UnityEngine.Networking;
using UnityEngine.SceneManagement;
using System.Collections;
using Game.Config;

public class RegisterManager : MonoBehaviour
{
    public string username;
    public string password;

    public void Register()
    {
        StartCoroutine(RegisterRequest());
    }

    IEnumerator RegisterRequest()
    {
        string url = ApiConfig.BASE_URL + "/auth/register";

        string json = JsonUtility.ToJson(new RegisterData(username, password));

        UnityWebRequest req = new UnityWebRequest(url, "POST");
        byte[] body = System.Text.Encoding.UTF8.GetBytes(json);

        req.uploadHandler = new UploadHandlerRaw(body);
        req.downloadHandler = new DownloadHandlerBuffer();
        req.SetRequestHeader("Content-Type", "application/json");

        yield return req.SendWebRequest();

        if (req.result == UnityWebRequest.Result.Success)
        {
            SceneManager.LoadScene("Login");
        }
        else
        {
            Debug.Log("Register Failed");
        }
    }
}

[System.Serializable]
public class RegisterData
{
    public string username;
    public string password;

    public RegisterData(string u, string p)
    {
        username = u;
        password = p;
    }
}