export const getBadges = (user) => {
    const badges = [];
  
    const streak = user.streak || 0;
    const total = user.totalSmileCount || 0;
  
    // ✅ Streak badges
    if (streak >= 1) badges.push({ name: "Starter", icon: "🌱", level: 1 });
    if (streak >= 3) badges.push({ name: "Consistent", icon: "🔥", level: 2 });
    if (streak >= 7) badges.push({ name: "Weekly Warrior", icon: "🏆", level: 3 });
    if (streak >= 15) badges.push({ name: "Streak Master", icon: "👑", level: 4 });
    if (streak >= 30) badges.push({ name: "Unstoppable", icon: "⚡", level: 5 });
  
    // ✅ Total smiles badges
    if (total >= 10) badges.push({ name: "10 Smiles", icon: "😊", level: 1 });
    if (total >= 50) badges.push({ name: "50 Smiles", icon: "💛", level: 2 });
    if (total >= 100) badges.push({ name: "100 Smiles", icon: "🌟", level: 3 });
  
    return badges;
  };
  