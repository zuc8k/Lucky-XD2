require("dotenv").config();
const { REST, Routes } = require("discord.js");
const fs = require("fs");

const commands = [];
const files = fs.readdirSync("./src/commands/admin");

for (const file of files) {
  const command = require(`./src/commands/admin/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: "10" })
  .setToken(process.env.BOT_TOKEN);

(async () => {
  await rest.put(
    Routes.applicationGuildCommands(
      process.env.CLIENT_ID,
      process.env.GUILD_ID
    ),
    { body: commands }
  );
  console.log("✅ Slash Commands Registered");
})();