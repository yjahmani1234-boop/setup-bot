const { Client, GatewayIntentBits, PermissionFlagsBits, ChannelType } = require('discord.js');

// 👇 التوكن يجي من إعدادات Render (ما تغيره)
const TOKEN = process.env.TOKEN; 

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('clientReady', () => {
    console.log(`[+] Setup Bot is online: ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.content === '!setup' && message.member.permissions.has(PermissionFlagsBits.Administrator)) {
        const guild = message.guild;
        await message.reply("⏳ جاري بناء السيرفر بالعربي، استنى شوي...");

        // 1. إنشاء الرتب
        const roles = [
            { name: '👑 المالك', color: '#FF0000', hoist: true, permissions: [PermissionFlagsBits.Administrator] },
            { name: '🛡️ الإدارة', color: '#EF4444', hoist: true, permissions: [PermissionFlagsBits.Administrator] },
            { name: '⚔️ المشرف', color: '#F59E0B', hoist: true, permissions: [PermissionFlagsBits.KickMembers, PermissionFlagsBits.BanMembers, PermissionFlagsBits.ModerateMembers] },
            { name: '💎 مميز', color: '#8B5CF6', hoist: true, permissions: [] },
            { name: '⭐ موثوق', color: '#06B6D4', hoist: true, permissions: [] },
            { name: '✅ موثق', color: '#22C55E', hoist: true, permissions: [] },
            { name: '👤 عضو', color: '#6B7280', hoist: false, permissions: [] },
        ];

        for (const r of roles) {
            await guild.roles.create({
                name: r.name,
                color: r.color,
                hoist: r.hoist,
                permissions: r.permissions
            }).catch(console.error);
        }

        // 2. إنشاء الأقسام والرومات (بالعربي + رومات الأدوات)
        const categories = [
            { name: '📌 المعلومات الأساسية', channels: [
                { name: 'الترحيب', type: ChannelType.GuildText },
                { name: 'القوانين', type: ChannelType.GuildText },
                { name: 'الإعلانات', type: ChannelType.GuildText },
                { name: 'التقييمات', type: ChannelType.GuildText },
            ]},
            { name: '🛒 المتجر (أدوات مجانية)', channels: [
                { name: 'طلب-أداة', type: ChannelType.GuildText },
                { name: 'أدوات-مجانية', type: ChannelType.GuildText },
                { name: 'الأسعار', type: ChannelType.GuildText },
                { name: 'الطلبات', type: ChannelType.GuildText },
            ]},
            { name: '💬 المجتمع', channels: [
                { name: 'دردشة-عامة', type: ChannelType.GuildText },
                { name: 'مواضيع-جانبية', type: ChannelType.GuildText },
                { name: 'ميمز', type: ChannelType.GuildText },
            ]},
            { name: '🎫 الدعم الفني', channels: [
                { name: 'الدعم', type: ChannelType.GuildText },
                { name: 'الأسئلة-الشائعة', type: ChannelType.GuildText },
            ]},
            { name: '🔊 الصوتيات', channels: [
                { name: 'عام', type: ChannelType.GuildVoice },
                { name: 'موسيقى', type: ChannelType.GuildVoice },
                { name: 'ألعاب', type: ChannelType.GuildVoice },
            ]}
        ];

        for (const cat of categories) {
            const category = await guild.channels.create({
                name: cat.name,
                type: ChannelType.GuildCategory
            }).catch(console.error);

            if (!category) continue;

            for (const ch of cat.channels) {
                await guild.channels.create({
                    name: ch.name,
                    type: ch.type,
                    parent: category.id
                }).catch(console.error);
            }
        }

        message.channel.send("✅ **تم بناء السيرفر بالعربي بنجاح!** كل الرتب والرومات (بما فيها رومات الأدوات المجانية) جاهزة.");
    }
});

client.login(TOKEN);
