export const thoughtProcesses = [
  {
    id: 1,
    name: "Critical Thinking",
    subProcesses: [
      {
        id: 1,
        name: "Analytical Reasoning",
        conversationModes: [
          { id: 1, name: "Socratic Questioning", description: "Using probing questions to examine ideas" },
          { id: 2, name: "Logical Analysis", description: "Breaking down arguments systematically" }
        ]
      },
      {
        id: 2,
        name: "Evidence Evaluation",
        conversationModes: [
          { id: 3, name: "Fact Checking", description: "Verifying claims and sources" },
          { id: 4, name: "Data Analysis", description: "Examining numerical evidence" }
        ]
      }
    ]
  },
  {
    id: 2,
    name: "Creative Thinking",
    subProcesses: [
      {
        id: 3,
        name: "Divergent Thinking",
        conversationModes: [
          { id: 5, name: "Brainstorming", description: "Generating multiple ideas" },
          { id: 6, name: "Lateral Thinking", description: "Finding unexpected connections" }
        ]
      }
    ]
  },
  {
    id: 3,
    name: "Systems Thinking",
    subProcesses: [
      {
        id: 4,
        name: "Pattern Recognition",
        conversationModes: [
          { id: 7, name: "Holistic Analysis", description: "Understanding interconnections" },
          { id: 8, name: "Trend Identification", description: "Spotting recurring patterns" }
        ]
      }
    ]
  }
];

export const getRandomAnalysis = (text: string) => {
  // Randomly select a thought process
  const thoughtProcess = thoughtProcesses[Math.floor(Math.random() * thoughtProcesses.length)];
  
  // Randomly select a sub process from the chosen thought process
  const subProcess = thoughtProcess.subProcesses[Math.floor(Math.random() * thoughtProcess.subProcesses.length)];
  
  // Randomly select a conversation mode from the chosen sub process
  const conversationMode = subProcess.conversationModes[Math.floor(Math.random() * subProcess.conversationModes.length)];

  return {
    thoughtProcess,
    subProcess,
    conversationMode,
    analysis: `Based on ${conversationMode.name} approach: This text demonstrates characteristics that align with ${thoughtProcess.name} through ${subProcess.name}. The analysis reveals key patterns and insights that can be further explored.`
  };
}; 