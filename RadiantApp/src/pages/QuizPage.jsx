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
      <div className="h-screen px-4 flex items-center justify-center relative overflow-hidden" style={bgStyle}>
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Large ghost agent portrait */}
        {result.fullPortrait && (
          <img
            src={result.fullPortrait}
            alt=""
            className="absolute right-[-10%] top-1/2 -translate-y-1/2 h-[110%] object-contain opacity-[0.12] pointer-events-none select-none"
          />
        )}

        <div className="w-full max-w-5xl mx-auto relative z-10 flex flex-col lg:flex-row items-center lg:items-stretch gap-6 lg:gap-10">
          {/* Left — Abilities Panel */}
          <div className="hidden lg:flex flex-col justify-center gap-3 w-56 shrink-0">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 mb-1">Abilities</h3>
            {result.abilities && result.abilities.filter(a => a.displayIcon).slice(0, 4).map((ability, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] rounded-xl px-3 py-2.5 hover:border-[#ff4654]/30 transition-colors duration-200"
              >
                <div className="w-10 h-10 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center shrink-0">
                  <img src={ability.displayIcon} alt={ability.displayName} className="w-6 h-6 opacity-80" />
                </div>
                <div className="min-w-0">
                  <p className="text-white text-xs font-semibold truncate">{ability.displayName}</p>
                  <p className="text-gray-500 text-[10px] uppercase tracking-wider">
                    {ability.slot === 'Ability1' ? 'Q' : ability.slot === 'Ability2' ? 'E' : ability.slot === 'Grenade' ? 'C' : ability.slot === 'Ultimate' ? 'X' : ability.slot}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Center — Agent Result */}
          <div className="flex-1 max-w-sm sm:max-w-md mx-auto lg:mx-0 w-full flex flex-col gap-8">
            {/* Agent Portrait + Name */}
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="absolute inset-0 rounded-full bg-[#ff4654]/20 blur-xl scale-150"></div>
                {result.displayIcon && (
                  <img
                    src={result.displayIcon}
                    alt={result.displayName}
                    className="relative w-24 h-24 sm:w-32 sm:h-32 object-contain drop-shadow-[0_0_30px_rgba(255,70,84,0.4)]"
                  />
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-wider text-center mb-3">
                {result.displayName.toUpperCase()}
              </h1>
              <div className="flex items-center gap-3">
                <div className="h-px w-6 sm:w-8 bg-gradient-to-r from-transparent to-[#ff4654]"></div>
                <span className="text-[#ff4654] text-[11px] sm:text-xs font-bold uppercase tracking-[0.3em] whitespace-nowrap">
                  {result.role.displayName}
                </span>
                <div className="h-px w-6 sm:w-8 bg-gradient-to-l from-transparent to-[#ff4654]"></div>
              </div>
            </div>

            {/* Abilities — mobile only */}
            {result.abilities && result.abilities.filter(a => a.displayIcon).length > 0 && (
              <div className="flex lg:hidden justify-center gap-2">
                {result.abilities.filter(a => a.displayIcon).slice(0, 4).map((ability, i) => (
                  <div
                    key={i}
                    className="w-12 h-12 rounded-xl bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] flex items-center justify-center hover:border-[#ff4654]/30 transition-colors duration-200"
                    title={`${ability.displayName} (${ability.slot === 'Ability1' ? 'Q' : ability.slot === 'Ability2' ? 'E' : ability.slot === 'Grenade' ? 'C' : ability.slot === 'Ultimate' ? 'X' : ability.slot})`}
                  >
                    <img src={ability.displayIcon} alt={ability.displayName} className="w-6 h-6 opacity-80" />
                  </div>
                ))}
              </div>
            )}

            {/* Stat Cards */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] rounded-xl py-5 px-4 text-center hover:border-[#ff4654]/30 transition-colors duration-200">
                <div className="text-[#ff4654] text-base sm:text-lg font-black">✦</div>
                <p className="text-[9px] sm:text-[10px] text-gray-500 mt-1.5 uppercase tracking-wider">Playstyle</p>
                <p className="text-white text-[11px] sm:text-xs font-bold mt-1">Match</p>
              </div>
              <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] rounded-xl py-5 px-4 text-center hover:border-[#ff4654]/30 transition-colors duration-200">
                <div className="text-[#ff4654] text-base sm:text-lg font-black">⚡</div>
                <p className="text-[9px] sm:text-[10px] text-gray-500 mt-1.5 uppercase tracking-wider">Synergy</p>
                <p className="text-white text-[11px] sm:text-xs font-bold mt-1">High</p>
              </div>
              <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] rounded-xl py-5 px-4 text-center hover:border-[#ff4654]/30 transition-colors duration-200">
                <div className="text-[#ff4654] text-base sm:text-lg font-black">🎯</div>
                <p className="text-[9px] sm:text-[10px] text-gray-500 mt-1.5 uppercase tracking-wider">Impact</p>
                <p className="text-white text-[11px] sm:text-xs font-bold mt-1">Strong</p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] rounded-xl px-15 py-13">
              <p className="text-gray-300 text-[12px] sm:text-xs leading-relaxed text-justify">
                {result.description}
              </p>
            </div>

            {/* Button */}
            <button
              onClick={restart}
              className="w-full h-12 rounded-xl border-2 border-[#ff4654] relative overflow-hidden transition-all duration-500 ease-in hover:scale-[1.02] active:scale-[0.98] group"
              style={{
                background: 'transparent',
                cursor: 'pointer',
              }}
            >
              {/* Skew gradient backgrounds */}
              <div 
                className="absolute top-0 -left-2.5 w-0 h-full bg-[#ff4654] transition-all duration-500 group-hover:w-1/2 skew-x-12 z-0"
              />
              <div 
                className="absolute top-0 -right-2.5 w-0 h-full bg-[#ff6b6b] transition-all duration-500 group-hover:w-1/2 -skew-x-12 z-0"
              />
              
              {/* Text and icon */}
              <span className="relative z-10 flex items-center justify-center gap-2 h-full text-[#ff4654] group-hover:text-white transition-colors duration-300 font-bold text-sm sm:text-base uppercase tracking-wider">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                TRY ANOTHER AGENT
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
                className="w-full flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-4 bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] rounded-xl hover:border-[#ff4654]/30 hover:bg-white/[0.08] transition-all duration-200 group text-left"
              >
                {/* Number indicator */}
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-[#ff4654]/40 group-hover:bg-[#ff4654]/10 transition-all duration-200">
                  <span className="text-[#ff4654] font-bold text-xs sm:text-sm">{index + 1}</span>
                </div>
                {/* Option text */}
                <div className="min-w-0 flex-1">
                  <p className="text-gray-300 group-hover:text-white font-semibold text-xs sm:text-sm line-clamp-2 transition-colors duration-200">
                    {option}
                  </p>
                </div>
                {/* Arrow indicator */}
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-white/20 group-hover:border-[#ff4654]/50 flex items-center justify-center shrink-0 transition-all duration-200">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white/40 group-hover:text-[#ff4654] transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
