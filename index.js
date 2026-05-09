require("dotenv").config();

const { Client, GatewayIntentBits, ChannelType } = require("discord.js");
const { joinVoiceChannel, VoiceConnectionStatus } = require("@discordjs/voice");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

async function joinVC() {
  try {
    const guild = await client.guilds.fetch(process.env.GUILD_ID);
    if (!guild) return console.log("Guild not found.");

    const channel = await client.channels.fetch(process.env.VOICE_CHANNEL_ID);
    if (!channel) return console.log("Voice channel not found.");

    console.log("Channel found:", channel.name, channel.type);

    if (channel.type !== ChannelType.GuildVoice) {
      return console.log("That ID is not a normal voice channel.");
    }

    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
      selfMute: true,
      selfDeaf: false,
    });

    connection.on(VoiceConnectionStatus.Ready, () => {
      console.log("Bot joined the VC.");
    });

    connection.on(VoiceConnectionStatus.Disconnected, () => {
      console.log("Bot disconnected. Rejoining in 5 seconds...");
      setTimeout(joinVC, 5000);
    });
  } catch (err) {
    console.error("Join error:", err);
  }
}

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
  console.log("GUILD_ID:", process.env.GUILD_ID);
  console.log("VOICE_CHANNEL_ID:", process.env.VOICE_CHANNEL_ID);
  joinVC();
});

client.login(process.env.TOKEN);