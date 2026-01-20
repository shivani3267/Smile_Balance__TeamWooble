import { getSmiles, calcStreakDays } from "./storage"



const ACHIEVEMENTS = [
    {
        id: "first_smile",
        title: "First Smile",
        icon: "🥇",
        desc: "Completed your first verified smile",
        check: (smiles) => smiles.length >= 1,
    },
    {
        id: "streak_3",
        title: "3 Day Streak",
        icon: "🔥",
        desc: "Smiled for 3 days in a row",
        check: () => calcStreakDays() >= 3,
    },
    {
        id: "smile_10",
        title: "10 Smiles",
        icon: "😄",
        desc: "Completed 10 verified smiles",
        check: (smiles) => smiles.length >= 10,
    },
    {
        id: "perfect_smile",
        title: "Perfect Smile",
        icon: "🌟",
        desc: "Smile score above 0.85",
        check: (smiles) => smiles.some((s) => s.happyScore >= 0.85),
    },
]

export function getAchievements() {
    const smiles = getSmiles()
    const unlocked = JSON.parse(localStorage.getItem("sfh_achievements") || "[]")

    const newlyUnlocked = []

    ACHIEVEMENTS.forEach((a) => {
        if (!unlocked.includes(a.id) && a.check(smiles)) {
            unlocked.push(a.id)
            newlyUnlocked.push(a)
        }
    })

    if (newlyUnlocked.length) {
        localStorage.setItem("sfh_achievements", JSON.stringify(unlocked))
    }

    return {
        unlocked,
        all: ACHIEVEMENTS,
        newlyUnlocked,
    }
}