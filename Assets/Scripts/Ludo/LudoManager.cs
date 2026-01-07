using UnityEngine;

public class LudoManager : MonoBehaviour
{
    public void RollDice()
    {
        int dice = Random.Range(1, 7);
        Debug.Log("🎲 Dice: " + dice);

        // ابعت السيرفر تختار قطعة تتحرك
    }

    public void MovePiece(int pieceIndex, int dice)
    {
        // Send:
        // ludo_move { room, pieceIndex, dice }
    }

    public void OnUpdate()
    {
        // تحريك القطع على البورد
    }

    public void OnWin(string color)
    {
        Debug.Log("🏆 Winner: " + color);
    }
}