import { useState, useEffect } from 'react';
import { useGetAllAgentsQuery } from '../services/valorantApi';

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "What's your preferred playstyle?",
    options: ['Aggressive & Bold', 'Passive & Tactical', 'Balanced & Adaptive'],
    key: 'aggression',
  },
  {
    id: 2,
    question: 'Which team role suits you best?',
    options: ['Entry Fragger', 'Support / Utility', 'Controller / Smoker', 'Anchor / Sentinel'],
    key: 'role',
  },
  {
    id: 3,
    question: 'What type of abilities do you prefer?',
    options: ['Damage & Combat', 'Intel & Recon', 'Crowd Control & Flashes', 'Healing & Sustain', 'Traps & Area Denial'],
    key: 'abilityType',
  },
  {
    id: 4,
    question: 'Preferred combat range?',
    options: ['Close Range', 'Medium Range', 'Long Range'],
    key: 'range',
  },
  {
    id: 5,
    question: 'How much team coordination do you prefer?',
    options: ['High — Coordinated team plays', 'Medium — Some teamwork', 'Low — Solo carry potential'],
    key: 'coordination',
  },
  {
    id: 6,
    question: 'How do you approach map control?',
    options: ['Push aggressively & take space', 'Lock down areas with utility', 'Gather info then decide', 'Create chaos & confusion'],
    key: 'mapControl',
  },
  {
    id: 7,
    question: 'In a clutch situation, you prefer to...',
    options: ['Outplay with raw mechanics', 'Use utility to stall & delay', 'Outsmart with repositioning', 'Go all-in with aggression'],
    key: 'clutch',
  },
  {
    id: 8,
    question: 'What do you value most in a match?',
    options: ['Getting kills & top fragging', 'Helping the team with utility', 'Controlling areas of the map', 'Gathering enemy information'],
    key: 'value',
  },
  {
    id: 9,
    question: 'What pace do you prefer?',
    options: ['Fast — Always moving & pushing', 'Slow — Patient & methodical', 'Reactive — Adapt to the enemy'],
    key: 'pace',
  },
  {
    id: 10,
    question: 'Pick a trait that describes you:',
    options: ['Fearless & Confident', 'Strategic & Calculated', 'Creative & Unpredictable', 'Reliable & Consistent'],
    key: 'trait',
  },
];

const AGENT_SCORES = {
  // ── DUELISTS ──
  Jett: {
    aggression: { 'Aggressive & Bold': 3, 'Passive & Tactical': 0, 'Balanced & Adaptive': 1 },
    role: { 'Entry Fragger': 3, 'Support / Utility': 0, 'Controller / Smoker': 0, 'Anchor / Sentinel': 0 },
    abilityType: { 'Damage & Combat': 2, 'Intel & Recon': 0, 'Crowd Control & Flashes': 0, 'Healing & Sustain': 0, 'Traps & Area Denial': 0 },
    range: { 'Close Range': 2, 'Medium Range': 1, 'Long Range': 3 },
    coordination: { 'High — Coordinated team plays': 0, 'Medium — Some teamwork': 1, 'Low — Solo carry potential': 3 },
    mapControl: { 'Push aggressively & take space': 3, 'Lock down areas with utility': 0, 'Gather info then decide': 0, 'Create chaos & confusion': 1 },
    clutch: { 'Outplay with raw mechanics': 3, 'Use utility to stall & delay': 0, 'Outsmart with repositioning': 2, 'Go all-in with aggression': 1 },
    value: { 'Getting kills & top fragging': 3, 'Helping the team with utility': 0, 'Controlling areas of the map': 0, 'Gathering enemy information': 0 },
    pace: { 'Fast — Always moving & pushing': 3, 'Slow — Patient & methodical': 0, 'Reactive — Adapt to the enemy': 1 },
    trait: { 'Fearless & Confident': 3, 'Strategic & Calculated': 0, 'Creative & Unpredictable': 1, 'Reliable & Consistent': 0 },
  },
  Reyna: {
    aggression: { 'Aggressive & Bold': 3, 'Passive & Tactical': 0, 'Balanced & Adaptive': 1 },
    role: { 'Entry Fragger': 3, 'Support / Utility': 0, 'Controller / Smoker': 0, 'Anchor / Sentinel': 0 },
    abilityType: { 'Damage & Combat': 2, 'Intel & Recon': 0, 'Crowd Control & Flashes': 1, 'Healing & Sustain': 2, 'Traps & Area Denial': 0 },
    range: { 'Close Range': 2, 'Medium Range': 3, 'Long Range': 1 },
    coordination: { 'High — Coordinated team plays': 0, 'Medium — Some teamwork': 1, 'Low — Solo carry potential': 3 },
    mapControl: { 'Push aggressively & take space': 3, 'Lock down areas with utility': 0, 'Gather info then decide': 0, 'Create chaos & confusion': 1 },
    clutch: { 'Outplay with raw mechanics': 3, 'Use utility to stall & delay': 0, 'Outsmart with repositioning': 1, 'Go all-in with aggression': 2 },
    value: { 'Getting kills & top fragging': 3, 'Helping the team with utility': 0, 'Controlling areas of the map': 0, 'Gathering enemy information': 0 },
    pace: { 'Fast — Always moving & pushing': 3, 'Slow — Patient & methodical': 0, 'Reactive — Adapt to the enemy': 1 },
    trait: { 'Fearless & Confident': 3, 'Strategic & Calculated': 0, 'Creative & Unpredictable': 0, 'Reliable & Consistent': 0 },
  },
  Phoenix: {
    aggression: { 'Aggressive & Bold': 3, 'Passive & Tactical': 0, 'Balanced & Adaptive': 1 },
    role: { 'Entry Fragger': 3, 'Support / Utility': 1, 'Controller / Smoker': 0, 'Anchor / Sentinel': 0 },
    abilityType: { 'Damage & Combat': 2, 'Intel & Recon': 0, 'Crowd Control & Flashes': 2, 'Healing & Sustain': 2, 'Traps & Area Denial': 0 },
    range: { 'Close Range': 2, 'Medium Range': 3, 'Long Range': 0 },
    coordination: { 'High — Coordinated team plays': 1, 'Medium — Some teamwork': 3, 'Low — Solo carry potential': 1 },
    mapControl: { 'Push aggressively & take space': 3, 'Lock down areas with utility': 0, 'Gather info then decide': 0, 'Create chaos & confusion': 1 },
    clutch: { 'Outplay with raw mechanics': 2, 'Use utility to stall & delay': 0, 'Outsmart with repositioning': 1, 'Go all-in with aggression': 3 },
    value: { 'Getting kills & top fragging': 2, 'Helping the team with utility': 1, 'Controlling areas of the map': 1, 'Gathering enemy information': 0 },
    pace: { 'Fast — Always moving & pushing': 3, 'Slow — Patient & methodical': 0, 'Reactive — Adapt to the enemy': 1 },
    trait: { 'Fearless & Confident': 3, 'Strategic & Calculated': 0, 'Creative & Unpredictable': 1, 'Reliable & Consistent': 1 },
  },
  Raze: {
    aggression: { 'Aggressive & Bold': 3, 'Passive & Tactical': 0, 'Balanced & Adaptive': 1 },
    role: { 'Entry Fragger': 2, 'Support / Utility': 0, 'Controller / Smoker': 0, 'Anchor / Sentinel': 0 },
    abilityType: { 'Damage & Combat': 3, 'Intel & Recon': 1, 'Crowd Control & Flashes': 0, 'Healing & Sustain': 0, 'Traps & Area Denial': 0 },
    range: { 'Close Range': 1, 'Medium Range': 3, 'Long Range': 0 },
    coordination: { 'High — Coordinated team plays': 2, 'Medium — Some teamwork': 2, 'Low — Solo carry potential': 1 },
    mapControl: { 'Push aggressively & take space': 3, 'Lock down areas with utility': 0, 'Gather info then decide': 1, 'Create chaos & confusion': 2 },
    clutch: { 'Outplay with raw mechanics': 2, 'Use utility to stall & delay': 0, 'Outsmart with repositioning': 1, 'Go all-in with aggression': 3 },
    value: { 'Getting kills & top fragging': 3, 'Helping the team with utility': 1, 'Controlling areas of the map': 0, 'Gathering enemy information': 0 },
    pace: { 'Fast — Always moving & pushing': 3, 'Slow — Patient & methodical': 0, 'Reactive — Adapt to the enemy': 1 },
    trait: { 'Fearless & Confident': 2, 'Strategic & Calculated': 0, 'Creative & Unpredictable': 2, 'Reliable & Consistent': 0 },
  },
  Yoru: {
    aggression: { 'Aggressive & Bold': 2, 'Passive & Tactical': 1, 'Balanced & Adaptive': 2 },
    role: { 'Entry Fragger': 2, 'Support / Utility': 0, 'Controller / Smoker': 0, 'Anchor / Sentinel': 0 },
    abilityType: { 'Damage & Combat': 1, 'Intel & Recon': 1, 'Crowd Control & Flashes': 1, 'Healing & Sustain': 0, 'Traps & Area Denial': 0 },
    range: { 'Close Range': 3, 'Medium Range': 1, 'Long Range': 0 },
    coordination: { 'High — Coordinated team plays': 0, 'Medium — Some teamwork': 1, 'Low — Solo carry potential': 3 },
    mapControl: { 'Push aggressively & take space': 2, 'Lock down areas with utility': 0, 'Gather info then decide': 1, 'Create chaos & confusion': 3 },
    clutch: { 'Outplay with raw mechanics': 2, 'Use utility to stall & delay': 0, 'Outsmart with repositioning': 3, 'Go all-in with aggression': 1 },
    value: { 'Getting kills & top fragging': 2, 'Helping the team with utility': 0, 'Controlling areas of the map': 1, 'Gathering enemy information': 1 },
    pace: { 'Fast — Always moving & pushing': 2, 'Slow — Patient & methodical': 0, 'Reactive — Adapt to the enemy': 2 },
    trait: { 'Fearless & Confident': 1, 'Strategic & Calculated': 1, 'Creative & Unpredictable': 3, 'Reliable & Consistent': 0 },
  },
  Neon: {
    aggression: { 'Aggressive & Bold': 3, 'Passive & Tactical': 0, 'Balanced & Adaptive': 1 },
    role: { 'Entry Fragger': 3, 'Support / Utility': 0, 'Controller / Smoker': 0, 'Anchor / Sentinel': 0 },
    abilityType: { 'Damage & Combat': 2, 'Intel & Recon': 0, 'Crowd Control & Flashes': 1, 'Healing & Sustain': 0, 'Traps & Area Denial': 0 },
    range: { 'Close Range': 3, 'Medium Range': 2, 'Long Range': 0 },
    coordination: { 'High — Coordinated team plays': 1, 'Medium — Some teamwork': 2, 'Low — Solo carry potential': 2 },
    mapControl: { 'Push aggressively & take space': 3, 'Lock down areas with utility': 0, 'Gather info then decide': 0, 'Create chaos & confusion': 2 },
    clutch: { 'Outplay with raw mechanics': 3, 'Use utility to stall & delay': 0, 'Outsmart with repositioning': 1, 'Go all-in with aggression': 2 },
    value: { 'Getting kills & top fragging': 3, 'Helping the team with utility': 0, 'Controlling areas of the map': 1, 'Gathering enemy information': 0 },
    pace: { 'Fast — Always moving & pushing': 3, 'Slow — Patient & methodical': 0, 'Reactive — Adapt to the enemy': 1 },
    trait: { 'Fearless & Confident': 3, 'Strategic & Calculated': 0, 'Creative & Unpredictable': 1, 'Reliable & Consistent': 0 },
  },
  Iso: {
    aggression: { 'Aggressive & Bold': 2, 'Passive & Tactical': 1, 'Balanced & Adaptive': 2 },
    role: { 'Entry Fragger': 2, 'Support / Utility': 0, 'Controller / Smoker': 0, 'Anchor / Sentinel': 0 },
    abilityType: { 'Damage & Combat': 2, 'Intel & Recon': 0, 'Crowd Control & Flashes': 1, 'Healing & Sustain': 0, 'Traps & Area Denial': 0 },
    range: { 'Close Range': 1, 'Medium Range': 3, 'Long Range': 1 },
    coordination: { 'High — Coordinated team plays': 0, 'Medium — Some teamwork': 2, 'Low — Solo carry potential': 3 },
    mapControl: { 'Push aggressively & take space': 2, 'Lock down areas with utility': 0, 'Gather info then decide': 0, 'Create chaos & confusion': 1 },
    clutch: { 'Outplay with raw mechanics': 3, 'Use utility to stall & delay': 0, 'Outsmart with repositioning': 1, 'Go all-in with aggression': 2 },
    value: { 'Getting kills & top fragging': 3, 'Helping the team with utility': 0, 'Controlling areas of the map': 0, 'Gathering enemy information': 0 },
    pace: { 'Fast — Always moving & pushing': 2, 'Slow — Patient & methodical': 0, 'Reactive — Adapt to the enemy': 2 },
    trait: { 'Fearless & Confident': 2, 'Strategic & Calculated': 1, 'Creative & Unpredictable': 1, 'Reliable & Consistent': 1 },
  },
  Waylay: {
    aggression: { 'Aggressive & Bold': 2, 'Passive & Tactical': 1, 'Balanced & Adaptive': 2 },
    role: { 'Entry Fragger': 2, 'Support / Utility': 1, 'Controller / Smoker': 0, 'Anchor / Sentinel': 0 },
    abilityType: { 'Damage & Combat': 2, 'Intel & Recon': 1, 'Crowd Control & Flashes': 1, 'Healing & Sustain': 0, 'Traps & Area Denial': 0 },
    range: { 'Close Range': 2, 'Medium Range': 2, 'Long Range': 1 },
    coordination: { 'High — Coordinated team plays': 1, 'Medium — Some teamwork': 2, 'Low — Solo carry potential': 2 },
    mapControl: { 'Push aggressively & take space': 2, 'Lock down areas with utility': 0, 'Gather info then decide': 1, 'Create chaos & confusion': 2 },
    clutch: { 'Outplay with raw mechanics': 2, 'Use utility to stall & delay': 0, 'Outsmart with repositioning': 2, 'Go all-in with aggression': 2 },
    value: { 'Getting kills & top fragging': 2, 'Helping the team with utility': 1, 'Controlling areas of the map': 0, 'Gathering enemy information': 1 },
    pace: { 'Fast — Always moving & pushing': 2, 'Slow — Patient & methodical': 0, 'Reactive — Adapt to the enemy': 2 },
    trait: { 'Fearless & Confident': 1, 'Strategic & Calculated': 1, 'Creative & Unpredictable': 3, 'Reliable & Consistent': 0 },
  },

  // ── CONTROLLERS ──
  Omen: {
    aggression: { 'Aggressive & Bold': 1, 'Passive & Tactical': 2, 'Balanced & Adaptive': 2 },
    role: { 'Entry Fragger': 0, 'Support / Utility': 1, 'Controller / Smoker': 3, 'Anchor / Sentinel': 0 },
    abilityType: { 'Damage & Combat': 0, 'Intel & Recon': 1, 'Crowd Control & Flashes': 2, 'Healing & Sustain': 0, 'Traps & Area Denial': 0 },
    range: { 'Close Range': 0, 'Medium Range': 3, 'Long Range': 1 },
    coordination: { 'High — Coordinated team plays': 2, 'Medium — Some teamwork': 2, 'Low — Solo carry potential': 1 },
    mapControl: { 'Push aggressively & take space': 0, 'Lock down areas with utility': 1, 'Gather info then decide': 1, 'Create chaos & confusion': 3 },
    clutch: { 'Outplay with raw mechanics': 1, 'Use utility to stall & delay': 1, 'Outsmart with repositioning': 3, 'Go all-in with aggression': 0 },
    value: { 'Getting kills & top fragging': 0, 'Helping the team with utility': 1, 'Controlling areas of the map': 3, 'Gathering enemy information': 1 },
    pace: { 'Fast — Always moving & pushing': 0, 'Slow — Patient & methodical': 1, 'Reactive — Adapt to the enemy': 3 },
    trait: { 'Fearless & Confident': 0, 'Strategic & Calculated': 2, 'Creative & Unpredictable': 3, 'Reliable & Consistent': 0 },
  },
  Viper: {
    aggression: { 'Aggressive & Bold': 0, 'Passive & Tactical': 3, 'Balanced & Adaptive': 1 },
    role: { 'Entry Fragger': 0, 'Support / Utility': 1, 'Controller / Smoker': 3, 'Anchor / Sentinel': 1 },
    abilityType: { 'Damage & Combat': 1, 'Intel & Recon': 0, 'Crowd Control & Flashes': 0, 'Healing & Sustain': 0, 'Traps & Area Denial': 3 },
    range: { 'Close Range': 0, 'Medium Range': 2, 'Long Range': 2 },
    coordination: { 'High — Coordinated team plays': 2, 'Medium — Some teamwork': 2, 'Low — Solo carry potential': 1 },
    mapControl: { 'Push aggressively & take space': 0, 'Lock down areas with utility': 3, 'Gather info then decide': 0, 'Create chaos & confusion': 1 },
    clutch: { 'Outplay with raw mechanics': 0, 'Use utility to stall & delay': 3, 'Outsmart with repositioning': 1, 'Go all-in with aggression': 0 },
    value: { 'Getting kills & top fragging': 0, 'Helping the team with utility': 1, 'Controlling areas of the map': 3, 'Gathering enemy information': 0 },
    pace: { 'Fast — Always moving & pushing': 0, 'Slow — Patient & methodical': 3, 'Reactive — Adapt to the enemy': 1 },
    trait: { 'Fearless & Confident': 0, 'Strategic & Calculated': 3, 'Creative & Unpredictable': 1, 'Reliable & Consistent': 2 },
  },
  Astra: {
    aggression: { 'Aggressive & Bold': 0, 'Passive & Tactical': 3, 'Balanced & Adaptive': 1 },
    role: { 'Entry Fragger': 0, 'Support / Utility': 2, 'Controller / Smoker': 3, 'Anchor / Sentinel': 0 },
    abilityType: { 'Damage & Combat': 0, 'Intel & Recon': 0, 'Crowd Control & Flashes': 3, 'Healing & Sustain': 0, 'Traps & Area Denial': 1 },
    range: { 'Close Range': 0, 'Medium Range': 2, 'Long Range': 2 },
    coordination: { 'High — Coordinated team plays': 3, 'Medium — Some teamwork': 1, 'Low — Solo carry potential': 0 },
    mapControl: { 'Push aggressively & take space': 0, 'Lock down areas with utility': 2, 'Gather info then decide': 1, 'Create chaos & confusion': 2 },
    clutch: { 'Outplay with raw mechanics': 0, 'Use utility to stall & delay': 3, 'Outsmart with repositioning': 1, 'Go all-in with aggression': 0 },
    value: { 'Getting kills & top fragging': 0, 'Helping the team with utility': 2, 'Controlling areas of the map': 3, 'Gathering enemy information': 0 },
    pace: { 'Fast — Always moving & pushing': 0, 'Slow — Patient & methodical': 2, 'Reactive — Adapt to the enemy': 2 },
    trait: { 'Fearless & Confident': 0, 'Strategic & Calculated': 3, 'Creative & Unpredictable': 2, 'Reliable & Consistent': 1 },
  },
  Brimstone: {
    aggression: { 'Aggressive & Bold': 1, 'Passive & Tactical': 2, 'Balanced & Adaptive': 1 },
    role: { 'Entry Fragger': 0, 'Support / Utility': 2, 'Controller / Smoker': 3, 'Anchor / Sentinel': 0 },
    abilityType: { 'Damage & Combat': 2, 'Intel & Recon': 0, 'Crowd Control & Flashes': 0, 'Healing & Sustain': 0, 'Traps & Area Denial': 1 },
    range: { 'Close Range': 0, 'Medium Range': 2, 'Long Range': 2 },
    coordination: { 'High — Coordinated team plays': 3, 'Medium — Some teamwork': 1, 'Low — Solo carry potential': 0 },
    mapControl: { 'Push aggressively & take space': 1, 'Lock down areas with utility': 2, 'Gather info then decide': 0, 'Create chaos & confusion': 1 },
    clutch: { 'Outplay with raw mechanics': 0, 'Use utility to stall & delay': 2, 'Outsmart with repositioning': 0, 'Go all-in with aggression': 2 },
    value: { 'Getting kills & top fragging': 1, 'Helping the team with utility': 2, 'Controlling areas of the map': 3, 'Gathering enemy information': 0 },
    pace: { 'Fast — Always moving & pushing': 0, 'Slow — Patient & methodical': 2, 'Reactive — Adapt to the enemy': 2 },
    trait: { 'Fearless & Confident': 1, 'Strategic & Calculated': 2, 'Creative & Unpredictable': 0, 'Reliable & Consistent': 3 },
  },
  Harbor: {
    aggression: { 'Aggressive & Bold': 1, 'Passive & Tactical': 2, 'Balanced & Adaptive': 2 },
    role: { 'Entry Fragger': 0, 'Support / Utility': 2, 'Controller / Smoker': 3, 'Anchor / Sentinel': 0 },
    abilityType: { 'Damage & Combat': 0, 'Intel & Recon': 0, 'Crowd Control & Flashes': 2, 'Healing & Sustain': 0, 'Traps & Area Denial': 1 },
    range: { 'Close Range': 0, 'Medium Range': 3, 'Long Range': 1 },
    coordination: { 'High — Coordinated team plays': 3, 'Medium — Some teamwork': 1, 'Low — Solo carry potential': 0 },
    mapControl: { 'Push aggressively & take space': 2, 'Lock down areas with utility': 2, 'Gather info then decide': 0, 'Create chaos & confusion': 1 },
    clutch: { 'Outplay with raw mechanics': 0, 'Use utility to stall & delay': 2, 'Outsmart with repositioning': 1, 'Go all-in with aggression': 0 },
    value: { 'Getting kills & top fragging': 0, 'Helping the team with utility': 3, 'Controlling areas of the map': 2, 'Gathering enemy information': 0 },
    pace: { 'Fast — Always moving & pushing': 1, 'Slow — Patient & methodical': 1, 'Reactive — Adapt to the enemy': 2 },
    trait: { 'Fearless & Confident': 0, 'Strategic & Calculated': 2, 'Creative & Unpredictable': 1, 'Reliable & Consistent': 3 },
  },
  Clove: {
    aggression: { 'Aggressive & Bold': 2, 'Passive & Tactical': 1, 'Balanced & Adaptive': 2 },
    role: { 'Entry Fragger': 1, 'Support / Utility': 1, 'Controller / Smoker': 3, 'Anchor / Sentinel': 0 },
    abilityType: { 'Damage & Combat': 1, 'Intel & Recon': 0, 'Crowd Control & Flashes': 1, 'Healing & Sustain': 2, 'Traps & Area Denial': 0 },
    range: { 'Close Range': 1, 'Medium Range': 3, 'Long Range': 0 },
    coordination: { 'High — Coordinated team plays': 2, 'Medium — Some teamwork': 2, 'Low — Solo carry potential': 1 },
    mapControl: { 'Push aggressively & take space': 2, 'Lock down areas with utility': 1, 'Gather info then decide': 0, 'Create chaos & confusion': 2 },
    clutch: { 'Outplay with raw mechanics': 1, 'Use utility to stall & delay': 1, 'Outsmart with repositioning': 1, 'Go all-in with aggression': 2 },
    value: { 'Getting kills & top fragging': 1, 'Helping the team with utility': 2, 'Controlling areas of the map': 2, 'Gathering enemy information': 0 },
    pace: { 'Fast — Always moving & pushing': 2, 'Slow — Patient & methodical': 0, 'Reactive — Adapt to the enemy': 2 },
    trait: { 'Fearless & Confident': 2, 'Strategic & Calculated': 1, 'Creative & Unpredictable': 2, 'Reliable & Consistent': 0 },
  },

  // ── INITIATORS ──
  Sova: {
    aggression: { 'Aggressive & Bold': 0, 'Passive & Tactical': 3, 'Balanced & Adaptive': 1 },
    role: { 'Entry Fragger': 0, 'Support / Utility': 3, 'Controller / Smoker': 0, 'Anchor / Sentinel': 0 },
    abilityType: { 'Damage & Combat': 1, 'Intel & Recon': 3, 'Crowd Control & Flashes': 0, 'Healing & Sustain': 0, 'Traps & Area Denial': 0 },
    range: { 'Close Range': 0, 'Medium Range': 1, 'Long Range': 3 },
    coordination: { 'High — Coordinated team plays': 3, 'Medium — Some teamwork': 1, 'Low — Solo carry potential': 0 },
    mapControl: { 'Push aggressively & take space': 0, 'Lock down areas with utility': 0, 'Gather info then decide': 3, 'Create chaos & confusion': 0 },
    clutch: { 'Outplay with raw mechanics': 1, 'Use utility to stall & delay': 1, 'Outsmart with repositioning': 1, 'Go all-in with aggression': 0 },
    value: { 'Getting kills & top fragging': 0, 'Helping the team with utility': 2, 'Controlling areas of the map': 0, 'Gathering enemy information': 3 },
    pace: { 'Fast — Always moving & pushing': 0, 'Slow — Patient & methodical': 2, 'Reactive — Adapt to the enemy': 2 },
    trait: { 'Fearless & Confident': 0, 'Strategic & Calculated': 3, 'Creative & Unpredictable': 1, 'Reliable & Consistent': 2 },
  },
  Breach: {
    aggression: { 'Aggressive & Bold': 2, 'Passive & Tactical': 1, 'Balanced & Adaptive': 1 },
    role: { 'Entry Fragger': 1, 'Support / Utility': 2, 'Controller / Smoker': 1, 'Anchor / Sentinel': 0 },
    abilityType: { 'Damage & Combat': 2, 'Intel & Recon': 0, 'Crowd Control & Flashes': 3, 'Healing & Sustain': 0, 'Traps & Area Denial': 0 },
    range: { 'Close Range': 1, 'Medium Range': 3, 'Long Range': 0 },
    coordination: { 'High — Coordinated team plays': 3, 'Medium — Some teamwork': 1, 'Low — Solo carry potential': 0 },
    mapControl: { 'Push aggressively & take space': 3, 'Lock down areas with utility': 0, 'Gather info then decide': 0, 'Create chaos & confusion': 2 },
    clutch: { 'Outplay with raw mechanics': 0, 'Use utility to stall & delay': 1, 'Outsmart with repositioning': 0, 'Go all-in with aggression': 3 },
    value: { 'Getting kills & top fragging': 1, 'Helping the team with utility': 3, 'Controlling areas of the map': 1, 'Gathering enemy information': 0 },
    pace: { 'Fast — Always moving & pushing': 2, 'Slow — Patient & methodical': 0, 'Reactive — Adapt to the enemy': 2 },
    trait: { 'Fearless & Confident': 2, 'Strategic & Calculated': 1, 'Creative & Unpredictable': 0, 'Reliable & Consistent': 2 },
  },
  Skye: {
    aggression: { 'Aggressive & Bold': 1, 'Passive & Tactical': 2, 'Balanced & Adaptive': 2 },
    role: { 'Entry Fragger': 0, 'Support / Utility': 3, 'Controller / Smoker': 0, 'Anchor / Sentinel': 0 },
    abilityType: { 'Damage & Combat': 0, 'Intel & Recon': 2, 'Crowd Control & Flashes': 2, 'Healing & Sustain': 3, 'Traps & Area Denial': 0 },
    range: { 'Close Range': 1, 'Medium Range': 3, 'Long Range': 0 },
    coordination: { 'High — Coordinated team plays': 3, 'Medium — Some teamwork': 1, 'Low — Solo carry potential': 0 },
    mapControl: { 'Push aggressively & take space': 1, 'Lock down areas with utility': 0, 'Gather info then decide': 3, 'Create chaos & confusion': 0 },
    clutch: { 'Outplay with raw mechanics': 0, 'Use utility to stall & delay': 2, 'Outsmart with repositioning': 1, 'Go all-in with aggression': 0 },
    value: { 'Getting kills & top fragging': 0, 'Helping the team with utility': 3, 'Controlling areas of the map': 0, 'Gathering enemy information': 2 },
    pace: { 'Fast — Always moving & pushing': 1, 'Slow — Patient & methodical': 1, 'Reactive — Adapt to the enemy': 2 },
    trait: { 'Fearless & Confident': 0, 'Strategic & Calculated': 1, 'Creative & Unpredictable': 1, 'Reliable & Consistent': 3 },
  },
  'KAY/O': {
    aggression: { 'Aggressive & Bold': 2, 'Passive & Tactical': 1, 'Balanced & Adaptive': 2 },
    role: { 'Entry Fragger': 1, 'Support / Utility': 2, 'Controller / Smoker': 0, 'Anchor / Sentinel': 0 },
    abilityType: { 'Damage & Combat': 2, 'Intel & Recon': 1, 'Crowd Control & Flashes': 3, 'Healing & Sustain': 0, 'Traps & Area Denial': 0 },
    range: { 'Close Range': 1, 'Medium Range': 3, 'Long Range': 0 },
    coordination: { 'High — Coordinated team plays': 2, 'Medium — Some teamwork': 2, 'Low — Solo carry potential': 1 },
    mapControl: { 'Push aggressively & take space': 2, 'Lock down areas with utility': 0, 'Gather info then decide': 1, 'Create chaos & confusion': 2 },
    clutch: { 'Outplay with raw mechanics': 1, 'Use utility to stall & delay': 1, 'Outsmart with repositioning': 0, 'Go all-in with aggression': 3 },
    value: { 'Getting kills & top fragging': 1, 'Helping the team with utility': 3, 'Controlling areas of the map': 0, 'Gathering enemy information': 1 },
    pace: { 'Fast — Always moving & pushing': 2, 'Slow — Patient & methodical': 0, 'Reactive — Adapt to the enemy': 2 },
    trait: { 'Fearless & Confident': 2, 'Strategic & Calculated': 1, 'Creative & Unpredictable': 0, 'Reliable & Consistent': 2 },
  },
  Fade: {
    aggression: { 'Aggressive & Bold': 1, 'Passive & Tactical': 2, 'Balanced & Adaptive': 2 },
    role: { 'Entry Fragger': 0, 'Support / Utility': 2, 'Controller / Smoker': 0, 'Anchor / Sentinel': 0 },
    abilityType: { 'Damage & Combat': 0, 'Intel & Recon': 3, 'Crowd Control & Flashes': 2, 'Healing & Sustain': 0, 'Traps & Area Denial': 0 },
    range: { 'Close Range': 0, 'Medium Range': 3, 'Long Range': 1 },
    coordination: { 'High — Coordinated team plays': 2, 'Medium — Some teamwork': 2, 'Low — Solo carry potential': 1 },
    mapControl: { 'Push aggressively & take space': 1, 'Lock down areas with utility': 0, 'Gather info then decide': 3, 'Create chaos & confusion': 1 },
    clutch: { 'Outplay with raw mechanics': 0, 'Use utility to stall & delay': 1, 'Outsmart with repositioning': 2, 'Go all-in with aggression': 0 },
    value: { 'Getting kills & top fragging': 0, 'Helping the team with utility': 2, 'Controlling areas of the map': 0, 'Gathering enemy information': 3 },
    pace: { 'Fast — Always moving & pushing': 0, 'Slow — Patient & methodical': 1, 'Reactive — Adapt to the enemy': 3 },
    trait: { 'Fearless & Confident': 0, 'Strategic & Calculated': 2, 'Creative & Unpredictable': 2, 'Reliable & Consistent': 1 },
  },
  Gekko: {
    aggression: { 'Aggressive & Bold': 2, 'Passive & Tactical': 1, 'Balanced & Adaptive': 2 },
    role: { 'Entry Fragger': 1, 'Support / Utility': 2, 'Controller / Smoker': 0, 'Anchor / Sentinel': 0 },
    abilityType: { 'Damage & Combat': 1, 'Intel & Recon': 1, 'Crowd Control & Flashes': 2, 'Healing & Sustain': 0, 'Traps & Area Denial': 0 },
    range: { 'Close Range': 2, 'Medium Range': 3, 'Long Range': 0 },
    coordination: { 'High — Coordinated team plays': 2, 'Medium — Some teamwork': 2, 'Low — Solo carry potential': 1 },
    mapControl: { 'Push aggressively & take space': 2, 'Lock down areas with utility': 0, 'Gather info then decide': 1, 'Create chaos & confusion': 2 },
    clutch: { 'Outplay with raw mechanics': 1, 'Use utility to stall & delay': 1, 'Outsmart with repositioning': 1, 'Go all-in with aggression': 2 },
    value: { 'Getting kills & top fragging': 1, 'Helping the team with utility': 3, 'Controlling areas of the map': 0, 'Gathering enemy information': 1 },
    pace: { 'Fast — Always moving & pushing': 2, 'Slow — Patient & methodical': 0, 'Reactive — Adapt to the enemy': 2 },
    trait: { 'Fearless & Confident': 1, 'Strategic & Calculated': 0, 'Creative & Unpredictable': 3, 'Reliable & Consistent': 1 },
  },
  Tejo: {
    aggression: { 'Aggressive & Bold': 2, 'Passive & Tactical': 1, 'Balanced & Adaptive': 2 },
    role: { 'Entry Fragger': 1, 'Support / Utility': 2, 'Controller / Smoker': 0, 'Anchor / Sentinel': 0 },
    abilityType: { 'Damage & Combat': 2, 'Intel & Recon': 2, 'Crowd Control & Flashes': 1, 'Healing & Sustain': 0, 'Traps & Area Denial': 0 },
    range: { 'Close Range': 0, 'Medium Range': 2, 'Long Range': 2 },
    coordination: { 'High — Coordinated team plays': 2, 'Medium — Some teamwork': 2, 'Low — Solo carry potential': 1 },
    mapControl: { 'Push aggressively & take space': 2, 'Lock down areas with utility': 0, 'Gather info then decide': 2, 'Create chaos & confusion': 1 },
    clutch: { 'Outplay with raw mechanics': 1, 'Use utility to stall & delay': 1, 'Outsmart with repositioning': 1, 'Go all-in with aggression': 2 },
    value: { 'Getting kills & top fragging': 1, 'Helping the team with utility': 2, 'Controlling areas of the map': 1, 'Gathering enemy information': 2 },
    pace: { 'Fast — Always moving & pushing': 1, 'Slow — Patient & methodical': 1, 'Reactive — Adapt to the enemy': 2 },
    trait: { 'Fearless & Confident': 1, 'Strategic & Calculated': 2, 'Creative & Unpredictable': 1, 'Reliable & Consistent': 2 },
  },
  Veto: {
    aggression: { 'Aggressive & Bold': 1, 'Passive & Tactical': 2, 'Balanced & Adaptive': 2 },
    role: { 'Entry Fragger': 0, 'Support / Utility': 3, 'Controller / Smoker': 0, 'Anchor / Sentinel': 0 },
    abilityType: { 'Damage & Combat': 1, 'Intel & Recon': 1, 'Crowd Control & Flashes': 3, 'Healing & Sustain': 0, 'Traps & Area Denial': 0 },
    range: { 'Close Range': 0, 'Medium Range': 3, 'Long Range': 1 },
    coordination: { 'High — Coordinated team plays': 3, 'Medium — Some teamwork': 1, 'Low — Solo carry potential': 0 },
    mapControl: { 'Push aggressively & take space': 1, 'Lock down areas with utility': 1, 'Gather info then decide': 1, 'Create chaos & confusion': 2 },
    clutch: { 'Outplay with raw mechanics': 0, 'Use utility to stall & delay': 2, 'Outsmart with repositioning': 1, 'Go all-in with aggression': 1 },
    value: { 'Getting kills & top fragging': 0, 'Helping the team with utility': 3, 'Controlling areas of the map': 1, 'Gathering enemy information': 1 },
    pace: { 'Fast — Always moving & pushing': 0, 'Slow — Patient & methodical': 1, 'Reactive — Adapt to the enemy': 3 },
    trait: { 'Fearless & Confident': 0, 'Strategic & Calculated': 2, 'Creative & Unpredictable': 2, 'Reliable & Consistent': 2 },
  },

  // ── SENTINELS ──
  Sage: {
    aggression: { 'Aggressive & Bold': 0, 'Passive & Tactical': 3, 'Balanced & Adaptive': 1 },
    role: { 'Entry Fragger': 0, 'Support / Utility': 3, 'Controller / Smoker': 0, 'Anchor / Sentinel': 2 },
    abilityType: { 'Damage & Combat': 0, 'Intel & Recon': 0, 'Crowd Control & Flashes': 1, 'Healing & Sustain': 3, 'Traps & Area Denial': 1 },
    range: { 'Close Range': 0, 'Medium Range': 3, 'Long Range': 1 },
    coordination: { 'High — Coordinated team plays': 3, 'Medium — Some teamwork': 1, 'Low — Solo carry potential': 0 },
    mapControl: { 'Push aggressively & take space': 0, 'Lock down areas with utility': 2, 'Gather info then decide': 0, 'Create chaos & confusion': 0 },
    clutch: { 'Outplay with raw mechanics': 0, 'Use utility to stall & delay': 3, 'Outsmart with repositioning': 1, 'Go all-in with aggression': 0 },
    value: { 'Getting kills & top fragging': 0, 'Helping the team with utility': 3, 'Controlling areas of the map': 1, 'Gathering enemy information': 0 },
    pace: { 'Fast — Always moving & pushing': 0, 'Slow — Patient & methodical': 3, 'Reactive — Adapt to the enemy': 1 },
    trait: { 'Fearless & Confident': 0, 'Strategic & Calculated': 1, 'Creative & Unpredictable': 0, 'Reliable & Consistent': 3 },
  },
  Cypher: {
    aggression: { 'Aggressive & Bold': 0, 'Passive & Tactical': 3, 'Balanced & Adaptive': 1 },
    role: { 'Entry Fragger': 0, 'Support / Utility': 1, 'Controller / Smoker': 0, 'Anchor / Sentinel': 3 },
    abilityType: { 'Damage & Combat': 0, 'Intel & Recon': 3, 'Crowd Control & Flashes': 0, 'Healing & Sustain': 0, 'Traps & Area Denial': 3 },
    range: { 'Close Range': 0, 'Medium Range': 2, 'Long Range': 2 },
    coordination: { 'High — Coordinated team plays': 2, 'Medium — Some teamwork': 2, 'Low — Solo carry potential': 1 },
    mapControl: { 'Push aggressively & take space': 0, 'Lock down areas with utility': 3, 'Gather info then decide': 2, 'Create chaos & confusion': 0 },
    clutch: { 'Outplay with raw mechanics': 0, 'Use utility to stall & delay': 2, 'Outsmart with repositioning': 2, 'Go all-in with aggression': 0 },
    value: { 'Getting kills & top fragging': 0, 'Helping the team with utility': 1, 'Controlling areas of the map': 2, 'Gathering enemy information': 3 },
    pace: { 'Fast — Always moving & pushing': 0, 'Slow — Patient & methodical': 3, 'Reactive — Adapt to the enemy': 1 },
    trait: { 'Fearless & Confident': 0, 'Strategic & Calculated': 3, 'Creative & Unpredictable': 1, 'Reliable & Consistent': 2 },
  },
  Killjoy: {
    aggression: { 'Aggressive & Bold': 0, 'Passive & Tactical': 3, 'Balanced & Adaptive': 1 },
    role: { 'Entry Fragger': 0, 'Support / Utility': 1, 'Controller / Smoker': 0, 'Anchor / Sentinel': 3 },
    abilityType: { 'Damage & Combat': 1, 'Intel & Recon': 1, 'Crowd Control & Flashes': 0, 'Healing & Sustain': 0, 'Traps & Area Denial': 3 },
    range: { 'Close Range': 2, 'Medium Range': 2, 'Long Range': 0 },
    coordination: { 'High — Coordinated team plays': 1, 'Medium — Some teamwork': 2, 'Low — Solo carry potential': 2 },
    mapControl: { 'Push aggressively & take space': 0, 'Lock down areas with utility': 3, 'Gather info then decide': 1, 'Create chaos & confusion': 0 },
    clutch: { 'Outplay with raw mechanics': 0, 'Use utility to stall & delay': 3, 'Outsmart with repositioning': 1, 'Go all-in with aggression': 0 },
    value: { 'Getting kills & top fragging': 1, 'Helping the team with utility': 1, 'Controlling areas of the map': 3, 'Gathering enemy information': 1 },
    pace: { 'Fast — Always moving & pushing': 0, 'Slow — Patient & methodical': 3, 'Reactive — Adapt to the enemy': 1 },
    trait: { 'Fearless & Confident': 0, 'Strategic & Calculated': 3, 'Creative & Unpredictable': 1, 'Reliable & Consistent': 2 },
  },
  Chamber: {
    aggression: { 'Aggressive & Bold': 2, 'Passive & Tactical': 1, 'Balanced & Adaptive': 2 },
    role: { 'Entry Fragger': 1, 'Support / Utility': 0, 'Controller / Smoker': 0, 'Anchor / Sentinel': 2 },
    abilityType: { 'Damage & Combat': 3, 'Intel & Recon': 0, 'Crowd Control & Flashes': 0, 'Healing & Sustain': 0, 'Traps & Area Denial': 1 },
    range: { 'Close Range': 0, 'Medium Range': 1, 'Long Range': 3 },
    coordination: { 'High — Coordinated team plays': 0, 'Medium — Some teamwork': 2, 'Low — Solo carry potential': 3 },
    mapControl: { 'Push aggressively & take space': 1, 'Lock down areas with utility': 1, 'Gather info then decide': 0, 'Create chaos & confusion': 1 },
    clutch: { 'Outplay with raw mechanics': 3, 'Use utility to stall & delay': 1, 'Outsmart with repositioning': 2, 'Go all-in with aggression': 0 },
    value: { 'Getting kills & top fragging': 3, 'Helping the team with utility': 0, 'Controlling areas of the map': 1, 'Gathering enemy information': 0 },
    pace: { 'Fast — Always moving & pushing': 0, 'Slow — Patient & methodical': 2, 'Reactive — Adapt to the enemy': 2 },
    trait: { 'Fearless & Confident': 2, 'Strategic & Calculated': 2, 'Creative & Unpredictable': 0, 'Reliable & Consistent': 1 },
  },
  Deadlock: {
    aggression: { 'Aggressive & Bold': 0, 'Passive & Tactical': 3, 'Balanced & Adaptive': 1 },
    role: { 'Entry Fragger': 0, 'Support / Utility': 1, 'Controller / Smoker': 0, 'Anchor / Sentinel': 3 },
    abilityType: { 'Damage & Combat': 0, 'Intel & Recon': 1, 'Crowd Control & Flashes': 2, 'Healing & Sustain': 0, 'Traps & Area Denial': 3 },
    range: { 'Close Range': 1, 'Medium Range': 2, 'Long Range': 1 },
    coordination: { 'High — Coordinated team plays': 2, 'Medium — Some teamwork': 2, 'Low — Solo carry potential': 1 },
    mapControl: { 'Push aggressively & take space': 0, 'Lock down areas with utility': 3, 'Gather info then decide': 1, 'Create chaos & confusion': 0 },
    clutch: { 'Outplay with raw mechanics': 0, 'Use utility to stall & delay': 3, 'Outsmart with repositioning': 0, 'Go all-in with aggression': 0 },
    value: { 'Getting kills & top fragging': 0, 'Helping the team with utility': 1, 'Controlling areas of the map': 3, 'Gathering enemy information': 1 },
    pace: { 'Fast — Always moving & pushing': 0, 'Slow — Patient & methodical': 3, 'Reactive — Adapt to the enemy': 1 },
    trait: { 'Fearless & Confident': 0, 'Strategic & Calculated': 2, 'Creative & Unpredictable': 0, 'Reliable & Consistent': 3 },
  },
  Vyse: {
    aggression: { 'Aggressive & Bold': 0, 'Passive & Tactical': 3, 'Balanced & Adaptive': 1 },
    role: { 'Entry Fragger': 0, 'Support / Utility': 1, 'Controller / Smoker': 0, 'Anchor / Sentinel': 3 },
    abilityType: { 'Damage & Combat': 1, 'Intel & Recon': 1, 'Crowd Control & Flashes': 1, 'Healing & Sustain': 0, 'Traps & Area Denial': 3 },
    range: { 'Close Range': 1, 'Medium Range': 3, 'Long Range': 0 },
    coordination: { 'High — Coordinated team plays': 2, 'Medium — Some teamwork': 2, 'Low — Solo carry potential': 1 },
    mapControl: { 'Push aggressively & take space': 0, 'Lock down areas with utility': 3, 'Gather info then decide': 1, 'Create chaos & confusion': 0 },
    clutch: { 'Outplay with raw mechanics': 0, 'Use utility to stall & delay': 2, 'Outsmart with repositioning': 1, 'Go all-in with aggression': 0 },
    value: { 'Getting kills & top fragging': 0, 'Helping the team with utility': 2, 'Controlling areas of the map': 3, 'Gathering enemy information': 1 },
    pace: { 'Fast — Always moving & pushing': 0, 'Slow — Patient & methodical': 3, 'Reactive — Adapt to the enemy': 1 },
    trait: { 'Fearless & Confident': 0, 'Strategic & Calculated': 3, 'Creative & Unpredictable': 1, 'Reliable & Consistent': 2 },
  },
  Miks: {
    aggression: { 'Aggressive & Bold': 0, 'Passive & Tactical': 2, 'Balanced & Adaptive': 2 },
    role: { 'Entry Fragger': 0, 'Support / Utility': 2, 'Controller / Smoker': 0, 'Anchor / Sentinel': 3 },
    abilityType: { 'Damage & Combat': 0, 'Intel & Recon': 2, 'Crowd Control & Flashes': 1, 'Healing & Sustain': 1, 'Traps & Area Denial': 2 },
    range: { 'Close Range': 1, 'Medium Range': 3, 'Long Range': 0 },
    coordination: { 'High — Coordinated team plays': 2, 'Medium — Some teamwork': 2, 'Low — Solo carry potential': 1 },
    mapControl: { 'Push aggressively & take space': 0, 'Lock down areas with utility': 2, 'Gather info then decide': 2, 'Create chaos & confusion': 0 },
    clutch: { 'Outplay with raw mechanics': 0, 'Use utility to stall & delay': 2, 'Outsmart with repositioning': 2, 'Go all-in with aggression': 0 },
    value: { 'Getting kills & top fragging': 0, 'Helping the team with utility': 2, 'Controlling areas of the map': 2, 'Gathering enemy information': 2 },
    pace: { 'Fast — Always moving & pushing': 0, 'Slow — Patient & methodical': 2, 'Reactive — Adapt to the enemy': 2 },
    trait: { 'Fearless & Confident': 0, 'Strategic & Calculated': 2, 'Creative & Unpredictable': 1, 'Reliable & Consistent': 3 },
  },
};

function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const { data: agents = [], isLoading } = useGetAllAgentsQuery();

  const handleAnswerClick = (optionIndex) => {
    const question = QUIZ_QUESTIONS[currentQuestion];
    const newAnswers = {
      ...answers,
      [question.key]: question.options[optionIndex],
    };
    setAnswers(newAnswers);

    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (finalAnswers) => {
    let bestAgent = null;
    let bestScore = -1;

    for (const [agentName, scoring] of Object.entries(AGENT_SCORES)) {
      let score = 0;
      for (const [key, answer] of Object.entries(finalAnswers)) {
        if (scoring[key] && scoring[key][answer] !== undefined) {
          score += scoring[key][answer];
        }
      }
      if (score > bestScore) {
        bestScore = score;
        bestAgent = agentName;
      }
    }

    const matchedAgent = agents.find(
      (a) => a.displayName === bestAgent
    );
    setResult(matchedAgent || agents[0]);
  };

  const restart = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setResult(null);
  };

  const bgStyle = {
    backgroundImage: `url('https://res.cloudinary.com/dc3erz7jd/image/upload/v1776507337/1868810-3840x2160-desktop-4k-valorant-wallpaper_plv2fb.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#111823] flex items-center justify-center">
        <div className="text-white text-xl">Loading agents...</div>
      </div>
    );
  }

  if (result) {
  return (
    <div className="h-screen px-6 flex items-center justify-center relative overflow-hidden font-sans" style={bgStyle}>
      
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-[#111823]"></div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <span className="text-[25vw] font-black text-white/[0.02] select-none uppercase tracking-tighter">
          {result.displayName}
        </span>
      </div>

      {result.fullPortrait && (
        <img
          src={result.fullPortrait}
          alt=""
          className="absolute right-[-8%] bottom-[-15%] h-[130%] object-contain opacity-[0.15] pointer-events-none select-none hidden lg:block animate-pulse-slow"
        />
      )}

      <div className="w-full max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row items-center lg:items-center gap-12 xl:gap-16">
        
        <div className="hidden lg:flex flex-col gap-6 w-64 shrink-0">
          <div className="space-y-1.5">
  
            <h3 className="text-[12px] font-bold uppercase tracking-[0.4em] text-[#ff4654]">Tactical Profile</h3>
            <div className="h-1 w-16 bg-[#ff4654]"></div>
          </div>
          
          <div className="flex flex-col gap-3">
            {result.abilities && result.abilities.filter(a => a.displayIcon).slice(0, 4).map((ability, i) => (
              <div
                key={i}
                className="group flex items-center gap-4 bg-white/[0.03] backdrop-blur-md border border-white/[0.08] rounded-tr-3xl rounded-bl-3xl p-4 hover:bg-[#ff4654]/10 hover:border-[#ff4654]/40 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <img src={ability.displayIcon} alt={ability.displayName} className="w-7 h-7 opacity-70 group-hover:opacity-100" />
                </div>
                <div className="min-w-0">
                  <p className="text-white text-[12px] font-bold uppercase tracking-wider truncate">{ability.displayName}</p>
                  <p className="text-gray-500 text-[10px] font-black italic">{ability.slot.replace('Ability', 'KEY ')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center lg:items-center">
          <div className="relative group mb-8">
            <div className="absolute inset-0 rounded-full bg-[#ff4654]/30 blur-[70px] group-hover:bg-[#ff4654]/50 transition-all duration-700"></div>
            
            <div className="relative p-3 border-2 border-dashed border-white/20 rounded-full animate-spin-slow group-hover:border-[#ff4654]/50">
                {result.displayIcon && (
                  <img
                    src={result.displayIcon}
                    alt={result.displayName}
                    className="w-40 h-40 sm:w-56 sm:h-56 xl:w-64 xl:h-64 object-contain drop-shadow-[0_0_20px_rgba(0,0,0,0.8)] transform transition-transform duration-500 group-hover:scale-110"
                  />
                )}
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-5xl sm:text-8xl xl:text-9xl font-black text-white tracking-tighter italic uppercase mb-2 drop-shadow-lg">
              {result.displayName}
            </h1>
            <div className="inline-flex items-center gap-5 px-8 py-1.5 bg-[#ff4654] text-white skew-x-[-12deg]">
              <span className="text-sm font-black uppercase tracking-[0.2em] skew-x-[12deg]">
                {result.role.displayName}
              </span>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-96 flex flex-col gap-8">
          <div className="bg-white/[0.03] backdrop-blur-xl border-l-4 border-l-[#ff4654] border-y border-r border-white/10 p-7 xl:p-8 rounded-r-2xl">
            <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4 italic">// Biography</h4>
            <p className="text-gray-300 text-sm leading-relaxed text-left">
              {result.description}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Playstyle', val: 'Match', icon: '✦' },
              { label: 'Synergy', val: 'High', icon: '⚡' },
              { label: 'Impact', val: 'Strong', icon: '🎯' }
            ].map((stat, i) => (
              <div key={i} className="bg-white/[0.04] border border-white/5 p-4 rounded-xl text-center hover:bg-white/10 transition-colors">
                <span className="text-[#ff4654] text-xl">{stat.icon}</span>
                <p className="text-[9px] text-gray-500 uppercase font-bold mt-1.5">{stat.label}</p>
                <p className="text-white text-[12px] font-black">{stat.val}</p>
              </div>
            ))}
          </div>
          <button
            onClick={restart}
            className="group relative w-full h-16 bg-transparent border-2 border-white/20 hover:border-[#ff4654] transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 w-0 bg-[#ff4654] group-hover:w-full transition-all duration-500 ease-out"></div>
            {/* BIGGER: Text size */}
            <span className="relative z-10 text-white font-black italic tracking-widest text-base flex items-center justify-center gap-3">
              REDEPLOY AGENT
              <svg className="w-5 h-5 transform group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </span>
          </button>
        </div>

      </div>
    </div>
  );
}

  const question = QUIZ_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion) / QUIZ_QUESTIONS.length) * 100;

  return (
    <div className="h-screen px-4 flex items-center justify-center relative overflow-hidden" style={bgStyle}>
      <div className="absolute inset-0 bg-[#111823]/50"></div>
      <div className="w-full max-w-lg mx-auto relative z-10">
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-1 text-center tracking-wider">
          FIND YOUR <span className="text-[#ff4654]">AGENT</span>
        </h1>
        <p className="text-gray-500 text-center mb-4 text-xs sm:text-sm uppercase tracking-widest">
          {currentQuestion + 1} / {QUIZ_QUESTIONS.length}
        </p>

        {/* Progress Bar */}
        <div className="mb-6 h-[3px] bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#ff4654] to-[#ff6b6b] transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question Card */}
        <div className="bg-[#1a2332] border border-white/5 p-6 sm:p-8 rounded-2xl shadow-2xl shadow-black/40">
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-white mb-6 text-center">
            {question.question}
          </h2>

          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerClick(index)}
                // Added 'group' for child animations and 'active:scale-95' for tactile feedback
                className="w-full relative flex items-center gap-4 px-5 py-4 bg-white/[0.03] hover:bg-[#ff4654]/[0.08] border border-white/10 hover:border-[#ff4654]/50 rounded-xl transition-all duration-200 group active:scale-[0.98] overflow-hidden"
              >
                {/* Hover Background Accent - A subtle glow that follows the hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#ff4654]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Number Indicator */}
                <div className="relative w-10 h-10 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:border-[#ff4654]/60 group-hover:shadow-[0_0_15px_rgba(255,70,84,0.3)] transition-all duration-300">
                  <span className="text-gray-400 group-hover:text-[#ff4654] font-black text-sm italic transition-colors">
                    0{index + 1}
                  </span>
                </div>

                {/* Option Text */}
                <div className="relative min-w-0 flex-1">
                  <p className="text-gray-300 group-hover:text-white font-bold text-sm sm:text-base leading-tight transition-colors duration-200">
                    {option}
                  </p>
                </div>

                {/* Right Icon - More dynamic arrow */}
                <div className="relative transform translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  <svg 
                    className="w-5 h-5 text-[#ff4654]" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizPage;
