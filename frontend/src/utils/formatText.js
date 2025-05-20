function formatText(text) {
  if (text.includes("\n")) return text;
  return text.replace(/•\s*/g, "• ").replace(/• /g, "\n• ");
}

export default formatText;
