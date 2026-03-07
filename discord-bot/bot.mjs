import { Client, GatewayIntentBits, EmbedBuilder, ChannelType } from 'discord.js';
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../.env') });

const TOKEN = process.env.DISCORD_BOT_TOKEN;
const GUILD_ID = process.env.DISCORD_GUILD_ID;

if (!TOKEN || TOKEN === 'your_token_here') {
  console.error('Missing DISCORD_BOT_TOKEN in .env file');
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

// Channel structure for IntegrateAI HQ
const CHANNELS = {
  categories: [
    {
      name: '📋 COMMAND CENTER',
      channels: [
        { name: 'announcements', topic: 'Official announcements and updates' },
        { name: 'activity-log', topic: 'Automated activity feed from agents and systems' },
        { name: 'decisions', topic: 'Key decisions and their rationale' },
      ],
    },
    {
      name: '🤖 AGENT OPS',
      channels: [
        { name: 'agent-status', topic: 'Live agent status and heartbeat updates' },
        { name: 'agent-logs', topic: 'Agent task logs and outputs' },
        { name: 'agent-alerts', topic: 'Errors, warnings, and escalations from agents' },
      ],
    },
    {
      name: '💬 TEAM',
      channels: [
        { name: 'general', topic: 'General team discussion' },
        { name: 'dev', topic: 'Development and engineering discussion' },
        { name: 'strategy', topic: 'Business strategy and planning' },
      ],
    },
    {
      name: '📊 CLIENTS',
      channels: [
        { name: 'client-pipeline', topic: 'Client discovery and onboarding pipeline' },
        { name: 'client-updates', topic: 'Active client status updates' },
      ],
    },
  ],
};

// Setup server channels on command
async function setupServer(guild) {
  console.log(`Setting up server: ${guild.name}`);

  // Delete all existing channels
  const existingChannels = guild.channels.cache;
  for (const [, channel] of existingChannels) {
    try {
      await channel.delete();
      console.log(`  Deleted: #${channel.name}`);
    } catch (err) {
      console.log(`  Could not delete: #${channel.name} (${err.message})`);
    }
  }

  // Create new channel structure
  for (const category of CHANNELS.categories) {
    const cat = await guild.channels.create({
      name: category.name,
      type: ChannelType.GuildCategory,
    });
    console.log(`  Created category: ${category.name}`);

    for (const ch of category.channels) {
      await guild.channels.create({
        name: ch.name,
        type: ChannelType.GuildText,
        parent: cat.id,
        topic: ch.topic,
      });
      console.log(`    Created: #${ch.name}`);
    }
  }

  console.log('Server setup complete!');
}

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);
  console.log(`Serving ${client.guilds.cache.size} guild(s)`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  // !setup - wipe and rebuild the server channels
  if (message.content === '!setup' && message.member.permissions.has('Administrator')) {
    await message.reply('Starting fresh server setup... This will delete all channels and recreate them.');
    await setupServer(message.guild);

    // Find the new general channel to confirm
    const general = message.guild.channels.cache.find(
      (ch) => ch.name === 'general' && ch.type === ChannelType.GuildText
    );
    if (general) {
      const embed = new EmbedBuilder()
        .setTitle('IntegrateAI HQ - Ready')
        .setDescription('Server has been set up fresh. All channels are ready.')
        .setColor(0x00ff88)
        .setTimestamp();
      await general.send({ embeds: [embed] });
    }
  }

  // !status - bot health check
  if (message.content === '!status') {
    const embed = new EmbedBuilder()
      .setTitle('Bot Status')
      .addFields(
        { name: 'Uptime', value: `${Math.floor(client.uptime / 1000)}s`, inline: true },
        { name: 'Ping', value: `${client.ws.ping}ms`, inline: true },
        { name: 'Server', value: message.guild.name, inline: true }
      )
      .setColor(0x00ff88)
      .setTimestamp();
    await message.reply({ embeds: [embed] });
  }

  // !ping
  if (message.content === '!ping') {
    await message.reply(`Pong! ${client.ws.ping}ms`);
  }
});

client.login(TOKEN);
