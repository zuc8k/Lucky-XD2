using UnityEngine;
using System.Security.Cryptography;
using System.Text;

public static class HWID
{
    public static string GetHWID()
    {
        string raw =
            SystemInfo.deviceModel +
            SystemInfo.deviceName +
            SystemInfo.operatingSystem +
            SystemInfo.processorType +
            SystemInfo.systemMemorySize;

        return Hash(raw);
    }

    static string Hash(string input)
    {
        using (SHA256 sha = SHA256.Create())
        {
            byte[] bytes = sha.ComputeHash(
                Encoding.UTF8.GetBytes(input)
            );

            StringBuilder sb = new StringBuilder();
            foreach (byte b in bytes)
                sb.Append(b.ToString("x2"));

            return sb.ToString();
        }
    }
}