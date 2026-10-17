const { Client, GatewayIntentBits, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, StringSelectMenuBuilder, EmbedBuilder, Events } = require('discord.js');
const http = require('http');

const TOKEN = process.env.TOKEN;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log(`[+] Broadcast Bot is online: ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) return;

    if (message.content === '!panel') {
        const embed = new EmbedBuilder()
            .setTitle('📢 لوحة الإذاعة')
            .setDescription('اضغط على الزر تحت عشان ترسل رسالة لأي روم.')
            .setColor(0x5865F2);

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('open_broadcast')
                .setLabel('إرسال رسالة')
                .setEmoji('📝')
                .setStyle(ButtonStyle.Primary)
        );

        await message.channel.send({ embeds: [embed], components: [row] });
        message.delete().catch(()=>{});
    }
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.isButton() && interaction.customId === 'open_broadcast') {
        const channels = interaction.guild.channels.cache
            .filter(c => c.type === 0)
            .map(c => ({ label: '#' + c.name, value: c.id }))
            .slice(0, 25);

        if (channels.length === 0) {
            return interaction.reply({ content: 'ما في رومات نصية!', ephemeral: true });
        }

        const select = new StringSelectMenuBuilder()
            .setCustomId('select_channel')
            .setPlaceholder('اختر الروم اللي بدك ترسل فيه...')
            .addOptions(channels);

        const row = new ActionRowBuilder().addComponents(select);

        await interaction.reply({ 
            content: 'اختر الروم أولاً:', 
            components: [row], 
            ephemeral: true 
        });
    }

    if (interaction.isStringSelectMenu() && interaction.customId === 'select_channel') {
        const channelId = interaction.values[0];

        const modal = new ModalBuilder()
            .setCustomId(`broadcast_modal_${channelId}`)
            .setTitle('اكتب رسالتك');

        const textInput = new TextInputBuilder()
            .setCustomId('message_text')
            .setLabel('الرسالة')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('اكتب الكلام اللي بدك تبعته هنا...')
            .setRequired(true);

        const actionRow = new ActionRowBuilder().addComponents(textInput);
        modal.addComponents(actionRow);

        await interaction.showModal(modal);
    }

    if (interaction.isModalSubmit() && interaction.customId.startsWith('broadcast_modal_')) {
        const channelId = interaction.customId.split('_')[2]; 
        const text = interaction.fields.getTextInputValue('message_text');

        const targetChannel = interaction.guild.channels.cache.get(channelId);
        
        if (targetChannel) {
            await targetChannel.send(text);
            await interaction.reply({ content: `✅ تم إرسال رسالتك إلى ${targetChannel}`, ephemeral: true });
        } else {
            await interaction.reply({ content: '❌ ما قدرت ألاقي الروم، يمكن انحذف.', ephemeral: true });
        }
    }
});

// ═══════════════════════════════════════════
// هذا الجزء عشان Render ما يطفي البوت
// ═══════════════════════════════════════════
http.createServer((req, res) => res.end('Bot is alive!')).listen(process.env.PORT || 3000);

client.login(TOKEN);
