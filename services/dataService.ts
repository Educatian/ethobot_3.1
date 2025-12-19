
import type { Challenge, KnowledgeSource } from '../types';

let challengesCache: Challenge[] | null = null;
let challengesPromise: Promise<Challenge[]> | null = null;

const loadChallenges = async (): Promise<Challenge[]> => {
    if (challengesCache) return challengesCache;

    if (challengesPromise) return challengesPromise;

    challengesPromise = (async () => {
        try {
            const response = await fetch('/data/challenges.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            challengesCache = data as Challenge[];
            return challengesCache;
        } catch (error) {
            console.error("Could not fetch challenges data:", error);
            challengesPromise = null; // Allow retry
            return []; // Return empty array on error
        }
    })();

    return challengesPromise;
};

export const getChallengeById = async (id: string): Promise<Challenge | undefined> => {
    const challenges = await loadChallenges();
    return challenges.find(c => c.id === id);
};

let knowledgeCache: KnowledgeSource[] | null = null;
let knowledgePromise: Promise<KnowledgeSource[]> | null = null;

const loadKnowledge = async (): Promise<KnowledgeSource[]> => {
    if (knowledgeCache) return knowledgeCache;
    if (knowledgePromise) return knowledgePromise;

    knowledgePromise = (async () => {
        try {
            const response = await fetch('/data/knowledge_base.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            knowledgeCache = data as KnowledgeSource[];
            return knowledgeCache;
        } catch (error) {
            console.error("Could not fetch knowledge data:", error);
            knowledgePromise = null;
            return [];
        }
    })();
    return knowledgePromise;
};

export const getKnowledgeSourceById = async (id: string): Promise<KnowledgeSource | undefined> => {
    const sources = await loadKnowledge();
    return sources.find(s => s.id === id);
};
