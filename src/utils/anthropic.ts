import Anthropic from "@anthropic-ai/sdk";

export const anthropicClient = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export function validateBase64Image(base64String: string): boolean {
  if (!base64String) return false;

  if (base64String.startsWith("data:image/")) {
    return /^data:image\/(png|jpeg|jpg|gif|webp);base64,/.test(base64String);
  }

  try {
    atob(base64String.split(",").pop() || base64String);
    return true;
  } catch {
    return false;
  }
}

export function cleanBase64Image(base64String: string): string {
  if (!base64String) return "";
  return base64String.replace(/^data:image\/\w+;base64,/, "");
}
