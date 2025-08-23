// إيموجيات للفئات
const categoryIcons = {
    "settings": "⚙️",
    "games": "🎮",
    "info": "📚",
    "admin": "👑",
    "music": "🎵",
    "tools": "🛠️",
    "other": "✨"
};

async function onCall({ message, args, getLang, userPermissions, prefix }) {
    const { commandsConfig } = global.plugins;
    const commandName = args[0]?.toLowerCase();

    if (!commandName) {
        let commands = {};
        const language = message?.thread?.data?.language || global.config.LANGUAGE || 'en_US';

        for (const [key, value] of commandsConfig.entries()) {
            if (!!value.isHidden) continue;
            if (!!value.isAbsolute ? !global.config?.ABSOLUTES.includes(message.senderID) : false) continue;
            if (!value.hasOwnProperty("permissions")) value.permissions = [0, 1, 2];
            if (!value.permissions.some(p => userPermissions.includes(p))) continue;

            if (!commands.hasOwnProperty(value.category)) commands[value.category] = [];
            commands[value.category].push(`• ${value._name?.[language] || key}`);
        }

        let list = Object.keys(commands)
            .map(category => {
                const icon = categoryIcons[category.toLowerCase()] || "📌";
                return `${icon} ${category.toUpperCase()}\n${commands[category].join("\n")}`;
            })
            .join("\n\n");

        message.reply(getLang("help.list", {
            total: Object.values(commands).map(e => e.length).reduce((a, b) => a + b, 0),
            list,
            syntax: prefix
        }));
    } else {
        // باقي الكود نفسه (عرض تفاصيل الأمر)...
    }
}
