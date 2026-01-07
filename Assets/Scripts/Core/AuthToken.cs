using UnityEngine;

namespace Game.Core
{
    public static class AuthToken
    {
        private const string TOKEN_KEY = "AUTH_TOKEN";

        public static void Save(string token)
        {
            PlayerPrefs.SetString(TOKEN_KEY, token);
            PlayerPrefs.Save();
        }

        public static string Get()
        {
            return PlayerPrefs.GetString(TOKEN_KEY, "");
        }

        public static bool HasToken()
        {
            return PlayerPrefs.HasKey(TOKEN_KEY);
        }

        public static void Clear()
        {
            PlayerPrefs.DeleteKey(TOKEN_KEY);
        }
    }
}