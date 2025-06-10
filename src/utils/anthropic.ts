import Anthropic from '@anthropic-ai/sdk';

// Initialize the Anthropic client
export const anthropicClient = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

/**
 * Helper function to validate an image in base64 format
 * @param base64String - The base64 string to validate
 * @returns boolean indicating if the string is a valid base64 image
 */
export function validateBase64Image(base64String: string): boolean {
  if (!base64String) return false;
  
  // Check if it's a data URL with base64 encoding
  if (base64String.startsWith('data:image/')) {
    const regex = /^data:image\/(png|jpeg|jpg|gif|webp);base64,/;
    return regex.test(base64String);
  }
  
  // If it's just a base64 string without the data URL prefix
  try {
    // Check if it can be decoded as base64
    atob(base64String.split(',').pop() || base64String);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Helper function to clean base64 image data by removing the data URL prefix if present
 * @param base64String - The base64 string to clean
 * @returns The cleaned base64 string
 */
export function cleanBase64Image(base64String: string): string {
  if (!base64String) return '';
  
  // If it already has the data URL prefix, remove it
  if (base64String.startsWith('data:image/')) {
    return base64String.replace(/^data:image\/\w+;base64,/, '');
  }
  
  // If it's already a clean base64 string, return it
  return base64String;
}
