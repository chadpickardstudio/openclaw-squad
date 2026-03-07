#!/usr/bin/env node
/**
 * One-shot Discord server setup script.
 * Connects, wipes all channels, creates fresh IntegrateAI HQ structure, then exits.
 *
 * Usage: node setup-server.mjs
 */
import { Client, GatewayIntentBits, EmbedBuilder, ChannelType } from 'discord.js';
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../.env') });

const TOKEN = process.env.DISCORD_BOT_TOKEN;
const GUILD_ID = process.env.DISCORD_GUILD_ID;

if (!TOKEN || TOKEN === 'your_token_here') {
  console.error('❌ Missing DISCORD_BOT_TOKEN in .env');
  process.exit(1);
}

// IntegrateAI HQ channel structure
const STRUCTURE = [
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
];

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once('ready', async () => {
  console.log(`✅ Logged in as ${client.user.tag}\n`);

  // Find the guild
  let guild;
  if (GUILD_ID && GUILD_ID !== 'your_guild_id_here') {
    guild = client.guilds.cache.get(GUILD_ID);
  } else {
    // Auto-detect: use the first (or only) guild the bot is in
    guild = client.guilds.cache.first();
  }

  if (!guild) {
    console.error('❌ Bot is not in any server. Invite it first using:');
    console.error(`   https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot`);
    process.exit(1);
  }

  console.log(`🔧 Setting up server: ${guild.name} (${guild.id})\n`);

  // Step 1: Delete all existing channels
  console.log('🗑️  Clearing all existing channels...');
  const existingChannels = guild.channels.cache;
  for (const [, channel] of existingChannels) {
    try {
      await channel.delete();
      console.log(`   Deleted: ${channel.name}`);
    } catch (err) {
      console.log(`   Skipped: ${channel.name} (${err.message})`);
    }
  }
  console.log('');

  // Step 2: Create new structure
  console.log('🏗️  Creating IntegrateAI HQ channels...');
  let welcomeChannel = null;

  for (const category of STRUCTURE) {
    const cat = await guild.channels.create({
      name: category.name,
      type: ChannelType.GuildCategory,
    });
    console.log(`   📁 ${category.name}`);

    for (const ch of category.channels) {
      const created = await guild.channels.create({
        name: ch.name,
        type: ChannelType.GuildText,
        parent: cat.id,
        topic: ch.topic,
      });
      console.log(`      #${ch.name}`);
      if (ch.name === 'general') welcomeChannel = created;
    }
  }
  console.log('');

  // Step 3: Post welcome message
  if (welcomeChannel) {
    const embed = new EmbedBuilder()
      .setTitle('🚀 IntegrateAI HQ - Online')
      .setDescription(
        'Server has been set up fresh. All channels are ready.\n\n' +
        '**Channel Guide:**\n' +
        '📋 **Command Center** — Announcements, activity log, decisions\n' +
        '🤖 **Agent Ops** — Agent status, logs, alerts\n' +
        '💬 **Team** — General chat, dev, strategy\n' +
        '📊 **Clients** — Pipeline and client updates'
      )
      .setColor(0x00ff88)
      .setTimestamp();
    await welcomeChannel.send({ embeds: [embed] });
    console.log('📨 Welcome message posted in #general');
  }

  console.log('\n✅ Server setup complete! You can close this script.');
  console.log(`\n💡 Tip: Save your Guild ID for .env: DISCORD_GUILD_ID=${guild.id}`);

  client.destroy();
  process.exit(0);
});

client.login(TOKEN);
