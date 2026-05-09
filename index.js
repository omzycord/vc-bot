require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");
const {
  joinVoiceChannel,
  VoiceConnectionStatus,
} = require("@discordjs/voice");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

function joinVC() {
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  if (!guild) return console.log("Guild not found.");

  const channel = guild.channels.cache.get(process.env.VOICE_CHANNEL_ID);
  if (!channel) return console.log("Voice channel not found.");

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
}

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
  joinVC();
});

client.login(process.env.TOKEN); 
