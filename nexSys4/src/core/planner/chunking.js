export const chunkCommands = (commands, sep, chunkSize) => {
  const chunks = [];
  for (let i = 0; i < commands.length; i += chunkSize) {
    const chunk = commands.slice(i, i + chunkSize);
    chunks.push(chunk.join(sep));
  }
  return chunks;
};
