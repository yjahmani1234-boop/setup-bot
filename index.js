const { Client, GatewayIntentBits, PermissionFlagsBits, ChannelType } = require('discord.js');

const TOKEN = "MTU2MTA5MzE0MjY1OTIwMzExMg.G7zGIV.y3-rPwlj8ekuLE3Okw5csCV-xOm0rXPRW6MJoM"; 

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log(`[+] Setup Bot is online: ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.content === '!setup' && message.member.permissions.has(PermissionFlagsBits.Administrator)) {
        const guild = message.guild;
        await message.reply("⏳ جاري بناء السيرفر، استنى شوي...");

        const roles = [
            { name: '👑 Owner', color: '#FF0000', hoist: true, permissions: [PermissionFlagsBits.Administrator] },
            { name: '🛡️ Admin', color: '#EF4444', hoist: true, permissions: [PermissionFlagsBits.Administrator] },
            { name: '⚔️ Moderator', color: '#F59E0B', hoist: true, permissions: [PermissionFlagsBits.KickMembers, PermissionFlagsBits.BanMembers, PermissionFlagsBits.ModerateMembers] },
            { name: '💎 Premium', color: '#8B5CF6', hoist: true, permissions: [] },
            { name: '⭐ Trusted', color: '#06B6D4', hoist: true, permissions: [] },
            { name: '✅ Verified', color: '#22C55E', hoist: true, permissions: [] },
            { name: '👤 Member', color: '#6B7280', hoist: false, permissions: [] },
        ];

        for (const r of roles) {
            await guild.roles.create({ name: r.name, color: r.color, hoist: r.hoist, permissions: r.permissions }).catch(()=>{});
        }

        const categories = [
            { name: '📌 INFORMATION', channels: [
                { name: 'welcome', type: ChannelType.GuildText },
                { name: 'rules', type: ChannelType.GuildText },
                { name: 'announcements', type: ChannelType.GuildText },
                { name: 'vouches', type: ChannelType.GuildText },
            ]},
            { name: '🛒 STORE', channels: [
                { name: 'shop', type: ChannelType.GuildText },
                { name: 'tools-list', type: ChannelType.GuildText },
                { name: 'pricing', type: ChannelType.GuildText },
                { name: 'order-here', type: ChannelType.GuildText },
            ]},
            { name: '💬 COMMUNITY', channels: [
                { name: 'general', type: ChannelType.GuildText },
                { name: 'off-topic', type: ChannelType.GuildText },
                { name: 'memes', type: ChannelType.GuildText },
            ]},
            { name: '🎫 SUPPORT', channels: [
                { name: 'support', type: ChannelType.GuildText },
                { name: 'faq', type: ChannelType.GuildText },
            ]},
            { name: '🔊 VOICE', channels: [
                { name: 'General VC', type: ChannelType.GuildVoice },
                { name: 'Music VC', type: ChannelType.GuildVoice },
                { name: 'Gaming VC', type: ChannelType.GuildVoice },
            ]}
        ];

        for (const cat of categories) {
            const category = await guild.channels.create({ name: cat.name, type: ChannelType.GuildCategory }).catch(()=>{});
            if (!category) continue;
            for (const ch of cat.channels) {
                await guild.channels.create({ name: ch.name, type: ch.type, parent: category.id }).catch(()=>{});
            }
        }
        message.channel.send("✅ **تم بناء السيرفر بنجاح!**");
    }
});

client.login(TOKEN);