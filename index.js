require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");
const {
  joinVoiceChannel,
} = require("@discordjs/voice");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

async function joinVC() {
  try {
    const guild = await client.guilds.fetch(process.env.GUILD_ID);
    const channel = await client.channels.fetch(process.env.VOICE_CHANNEL_ID);

    console.log("Channel found:", channel.name, channel.type);

    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
      selfMute: false,
      selfDeaf: false,
    });

    console.log("Attempted to join VC");

    connection.on("stateChange", (oldState, newState) => {
      console.log(`Connection changed from ${oldState.status} to ${newState.status}`);
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