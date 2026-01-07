using UnityEngine;

public class MatchmakingManager : MonoBehaviour
{
    public void FindMatch()
    {
        // socket emit
        // find_match
        Debug.Log("🔍 Finding Match...");
    }

    public void CancelMatch()
    {
        // socket emit
        // cancel_match
        Debug.Log("❌ Match Canceled");
    }

    // لما السيرفر يبعث:
    // match_found
    public void OnMatchFound(string roomId)
    {
        Debug.Log("🎯 Match Found! Room: " + roomId);

        // Join Ludo Game
        // Join Voice Channel
        // Load Game Scene
    }
}