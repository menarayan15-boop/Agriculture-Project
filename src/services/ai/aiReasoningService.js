/**
 * AiReasoningService - Advanced Agricultural Reasoning Engine
 * Orchestrates Dynamic Intent Extraction, Multi-Tier LLM Execution,
 * Domain Knowledge Injection, and Agricultural Response Validation.
 */

import { processAgriculturalQuery, cleanAiText } from './krishiAIService.js';
import { classifyIntent, INTENT_DEFINITIONS } from './intentClassifier.js';
import { extractCropEntity, CROP_DATABASE } from './cropContextService.js';
import { validateCropResponse } from './responseValidator.js';

/**
 * Execute AI reasoning for an agricultural query.
 * @param {string} query - Farmer's question
 * @param {Object} context - { crop, soil, area, location, stage, langCode, apiKey, chatHistory }
 * @returns {Promise<string>} Clean, crop-validated answer text
 */
export async function getAiAnswer(query, context = {}) {
  const result = await processAgriculturalQuery(query, context);
  return result.answer;
}

/**
 * Full details query processor for rich UI components.
 * @param {string} query - Farmer's question
 * @param {Object} context - { crop, soil, area, location, stage, langCode, apiKey, chatHistory }
 * @returns {Promise<Object>} { answer, intent, crop, confidence, matchedQuestion, missingContext }
 */
export async function getAiAnswerDetails(query, context = {}) {
  return processAgriculturalQuery(query, context);
}

/**
 * Extract crop and intent from query.
 */
export function extractCropAndIntent(query = '', profileCrop = null, profileSoil = null) {
  const crop = extractCropEntity(query, profileCrop);
  const { intent } = classifyIntent(query);
  return { crop, intent };
}

export const INTENT_TYPES = INTENT_DEFINITIONS;
export { cleanAiText as cleanAiResponse, validateCropResponse as validateAgronomyResponse };
