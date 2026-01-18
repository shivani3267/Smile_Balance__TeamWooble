const SMILES_KEY = "sfh_smiles";
const USER_KEY = "sfh_user";
const SIX_HOURS = 6 * 60 * 60 * 1000;

export function getUser() {
    return JSON.parse(localStorage.getItem(USER_KEY) || "null");
}

export function setUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getSmiles() {
    return JSON.parse(localStorage.getItem(SMILES_KEY) || "[]");
}

export function setSmiles(smiles) {
    localStorage.setItem(SMILES_KEY, JSON.stringify(smiles));
}

export function addSmile(smile) {
    const smiles = getSmiles();
    smiles.push(smile);
    setSmiles(smiles);
}

export function calcStreakDays() {
    const smiles = getSmiles();
    if (smiles.length === 0) return 0;

    const days = [];

    for (let i = 0; i < smiles.length; i++) {
        const d = new Date(smiles[i].date);
        if (!isNaN(d)) {
            const day = d.toISOString().slice(0, 10);
            if (!days.includes(day)) days.push(day);
        }
    }

    days.sort();

    let streak = 0;
    let today = new Date();

    while (true) {
        const key = today.toISOString().slice(0, 10);
        if (days.includes(key)) {
            streak++;
            today.setDate(today.getDate() - 1);
        } else {
            break;
        }
    }

    return streak;
}

export function sixHourWaitLeftMs() {
    const smiles = getSmiles();
    if (smiles.length === 0) return 0;

    const last = smiles[smiles.length - 1];
    const lastTime = new Date(last.date).getTime();
    if (isNaN(lastTime)) return 0;

    const diff = Date.now() - lastTime;
    return diff >= SIX_HOURS ? 0 : SIX_HOURS - diff;
}
