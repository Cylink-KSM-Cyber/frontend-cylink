/**
 * Cyber Security Facts Utility
 * 
 * Manages loading and selection of cyber security facts for the interstitial page.
 * Provides efficient caching and random selection to enhance user experience.
 * 
 * @module src/utils/cyberSecurityFacts
 */

import { CyberSecurityFact } from "@/interfaces/interstitial";
import logger from "@/utils/logger";

/**
 * In-memory cache for cyber security facts
 * Prevents redundant network requests
 */
let factsCache: CyberSecurityFact[] | null = null;

/**
 * Load cyber security facts from JSON file
 * Uses caching to optimize performance
 * 
 * @returns Promise resolving to array of cyber security facts
 */
export async function loadCyberSecurityFacts(): Promise<CyberSecurityFact[]> {
  // Return cached facts if available
  if (factsCache && factsCache.length > 0) {
    logger.debug("Returning cached cyber security facts");
    return factsCache;
  }

  try {
    logger.info("Loading cyber security facts from JSON file");
    const response = await fetch("/data/cyberSecurityFacts.json");

    if (!response.ok) {
      throw new Error(`Failed to load facts: ${response.status}`);
    }

    const facts: CyberSecurityFact[] = await response.json();

    // Validate facts array
    if (!Array.isArray(facts) || facts.length === 0) {
      throw new Error("Invalid facts data structure");
    }

    // Cache the facts for future use
    factsCache = facts;
    logger.info(`Successfully loaded ${facts.length} cyber security facts`);

    return facts;
  } catch (error) {
    logger.error("Failed to load cyber security facts", error);
    
    // Return fallback facts if loading fails
    return getFallbackFacts();
  }
}

/**
 * Get a random cyber security fact
 * 
 * @returns Promise resolving to a random fact
 */
export async function getRandomFact(): Promise<CyberSecurityFact> {
  try {
    const facts = await loadCyberSecurityFacts();

    if (facts.length === 0) {
      return getFallbackFacts()[0];
    }

    // Select random index
    const randomIndex = Math.floor(Math.random() * facts.length);
    const selectedFact = facts[randomIndex];

    logger.debug(`Selected random fact: ${selectedFact.id}`);
    return selectedFact;
  } catch (error) {
    logger.error("Failed to get random fact", error);
    return getFallbackFacts()[0];
  }
}

/**
 * Preload facts into cache
 * Call this on app initialization to optimize performance
 * 
 * @returns Promise that resolves when facts are preloaded
 */
export async function preloadFacts(): Promise<void> {
  try {
    await loadCyberSecurityFacts();
    logger.info("Cyber security facts preloaded successfully");
  } catch (error) {
    logger.warn("Failed to preload cyber security facts", error);
  }
}

/**
 * Clear the facts cache
 * Useful for testing or forcing a reload
 */
export function clearFactsCache(): void {
  factsCache = null;
  logger.debug("Cyber security facts cache cleared");
}

/**
 * Get fallback facts when loading fails
 * Ensures the app always has facts to display
 * 
 * @returns Array of fallback facts
 */
function getFallbackFacts(): CyberSecurityFact[] {
  return [
    {
      id: 0,
      fact: "Always use strong, unique passwords for each of your accounts.",
      category: "authentication",
    },
    {
      id: -1,
      fact: "Enable two-factor authentication whenever possible to add an extra layer of security.",
      category: "authentication",
    },
    {
      id: -2,
      fact: "Be cautious of phishing emails and verify sender identities before clicking links.",
      category: "social_engineering",
    },
  ];
}

/**
 * Get all facts (mainly for testing and admin purposes)
 * 
 * @returns Promise resolving to all facts
 */
export async function getAllFacts(): Promise<CyberSecurityFact[]> {
  return await loadCyberSecurityFacts();
}

/**
 * Get fact by ID
 * 
 * @param id - The ID of the fact to retrieve
 * @returns Promise resolving to the fact or undefined if not found
 */
export async function getFactById(id: number): Promise<CyberSecurityFact | undefined> {
  const facts = await loadCyberSecurityFacts();
  return facts.find(fact => fact.id === id);
}

