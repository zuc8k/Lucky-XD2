require("dotenv").config();
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");
const path = require("path");

const connectDB = require("./config/database");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.commands = new Collection();

// Load commands
const commandsPath = path.join(__dirname, "commands/admin");
for (const file of fs.readdirSync(commandsPath)) {
  const command = require(`./commands/admin/${file}`);
  client.commands.set(command.data.name, command);
}

// Mongo
connectDB();

// Ready
client.once("ready", () => {
  console.log(`🤖 Bot logged in as ${client.user.tag}`);
});

// Interaction
client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const cmd = client.commands.get(interaction.commandName);
  if (!cmd) return;

  // 🔐 Permission Check
  if (
    !interaction.member.roles.cache.has(
      process.env.ADMIN_ROLE_ID
    )
  ) {
    return interaction.reply({
      content: "❌ No permission",
      ephemeral: true
    });
  }

  await cmd.execute(interaction);
});

client.login(process.env.BOT_TOKEN);