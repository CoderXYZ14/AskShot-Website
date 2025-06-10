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

// API route handler for analyzing screenshots with Claude Vision API

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { screenshot, question } = body;

    // Validate input
    if (!screenshot) {
      return NextResponse.json(
        { error: "Screenshot is required" },
        { status: 400 }
      );
    }

    // Validate the screenshot
    if (!validateBase64Image(screenshot)) {
      return NextResponse.json(
        {
          error: "Invalid image format. Must be a base64 encoded image.",
          details:
            "The provided data does not appear to be a valid base64 encoded image.",
        },
        { status: 400 }
      );
    }

    // Clean the base64 data
    const cleanedImageData = cleanBase64Image(screenshot);

    // Determine the media type from the data URL if present
    let mediaType = "image/png";
    if (screenshot.startsWith("data:image/")) {
      const match = screenshot.match(/^data:image\/(\w+);base64,/);
      if (match && match[1]) {
        mediaType = `image/${match[1]}`;
      }
    }

    // Prepare the message content using proper SDK types
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

    // Call the Anthropic API

    const response = await anthropicClient.messages.create({
      model: "claude-3-sonnet-20240229", // You can adjust the model as needed
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content,
        },
      ],
    });

    // Extract and return the response
    const answer = response.content[0].text;

    return NextResponse.json({
      answer,
      status: "success",
    });
  } catch (error) {
    console.error("Error processing image:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to process image", details: errorMessage },
      { status: 500 }
    );
  }
}
