import { NextRequest, NextResponse } from "next/server";
import {
  anthropicClient,
  validateBase64Image,
  cleanBase64Image,
} from "@/utils/anthropic";
import {
  ContentBlockParam,
  ImageBlockParam,
  TextBlockParam,
} from "@anthropic-ai/sdk/resources";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { screenshot, question } = body;

    if (!screenshot || !validateBase64Image(screenshot)) {
      return NextResponse.json(
        { error: "Invalid or missing screenshot" },
        { status: 400 }
      );
    }

    const cleanedImageData = cleanBase64Image(screenshot);
    const mediaTypeMatch = screenshot.match(/^data:image\/(\w+);base64,/);
    const mediaType = mediaTypeMatch
      ? `image/${mediaTypeMatch[1]}`
      : "image/png";

    const content: ContentBlockParam[] = [
      {
        type: "image",
        source: {
          type: "base64",
          media_type: mediaType,
          data: cleanedImageData,
        },
      } as ImageBlockParam,
      {
        type: "text",
        text:
          question ||
          "What do you see in this screenshot? Please describe it in detail.",
      } as TextBlockParam,
    ];

    const response = await anthropicClient.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1024,
      messages: [{ role: "user", content }],
    });

    const answer = (response.content[0] as TextBlockParam).text;

    return NextResponse.json({ answer, status: "success" });
  } catch (error) {
    console.error("AnthropicAnalyse | Error:", error);
    return NextResponse.json(
      { error: "Failed to process image", details: String(error) },
      { status: 500 }
    );
  }
}
