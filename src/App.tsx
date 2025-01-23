import React, { useState, useEffect, useRef } from 'react';
import { Send, ChevronRight, ChevronLeft, User } from 'lucide-react';

interface TypingTextProps {
  text: string;
  onComplete: () => void;
}

interface Log {
  message: string;
  nodeType: string;
  iterationId?: number;
  timestamp: string;
  onComplete: () => void;
}

interface ThoughtProcess {
  id: number;
  name: string;
}

interface Iteration {
  id: number;
  subThought: ThoughtProcess;
  mode: {
    id: number;
    name: string;
  };
}

interface Analysis {
  thought: ThoughtProcess | null;
  iterations: Iteration[];
}

interface ShellBarProps {
  username: string;
  avatarUrl?: string;
}

const ShellBar: React.FC<ShellBarProps> = ({ username, avatarUrl }) => {
  return (
    <div className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white p-4 flex items-center justify-between shadow-lg" role="banner">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold bg-white/20 px-4 py-1 rounded-full" role="heading" aria-level={1}>Thought Analyzer</h1>
      </div>
      <div className="flex items-center gap-3 bg-black/10 px-4 py-2 rounded-full">
        <span className="font-medium">{username}</span>
        {avatarUrl ? (
          <img src={avatarUrl} alt={`${username}'s avatar`} className="w-8 h-8 rounded-full ring-2 ring-white/50" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm" aria-hidden="true">
            <User size={20} />
          </div>
        )}
      </div>
    </div>
  );
};

const TypingText: React.FC<TypingTextProps> = ({ text, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= text.length) {
        setDisplayedText(text.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
        onComplete();
      }
    }, 50);
    
    return () => clearInterval(interval);
  }, [text, onComplete]);
  
  return <span className="whitespace-pre-wrap break-words">{displayedText}</span>;
};

const ThoughtProcessAnalyzer = () => {
  const [input, setInput] = useState('');
  const [analysis, setAnalysis] = useState<Analysis>({
    thought: null,
    iterations: []
  });
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedIterationId, setSelectedIterationId] = useState<number | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showNodes, setShowNodes] = useState({
    input: false,
    thought: false,
    iterations: false
  });
  const [showSubLevels, setShowSubLevels] = useState({
    subThoughts: false,
    modes: false
  });

  // Keep the level-specific states
  const [levelLogs, setLevelLogs] = useState({
    input: [] as Log[],
    thought: [] as Log[],
    subThought: [] as Log[],
    mode: [] as Log[]
  });

  const logRefs = {
    input: useRef<HTMLDivElement>(null),
    thought: useRef<HTMLDivElement>(null),
    subThought: useRef<HTMLDivElement>(null),
    mode: useRef<HTMLDivElement>(null)
  };

  const [levelCompletion, setLevelCompletion] = useState({
    input: false,
    thought: false,
    subThought: false,
    mode: false
  });

  const [collapsedLogs, setCollapsedLogs] = useState({
    input: false,
    thought: false,
    subThought: false,
    mode: false
  });

  // Add this function to handle collapse/expand
  const toggleLogWindow = (level: keyof typeof collapsedLogs) => {
    setCollapsedLogs(prev => ({
      ...prev,
      [level]: !prev[level]
    }));
  };

  // Mock user data
  const mockUser = {
    username: "John Doe",
    avatarUrl: undefined // Add a URL here if you want to show an actual avatar
  };

  // Mock data
  const thoughtProcesses: ThoughtProcess[] = [
    { id: 1, name: "Problem-Solving" },
    { id: 2, name: "Decision Making" },
    { id: 3, name: "Planning" },
    { id: 4, name: "Communication" },
    { id: 5, name: "Reflection" },
    { id: 6, name: "Synthesis" },
    { id: 7, name: "Visualization" },
    { id: 8, name: "Information Gathering" },
    { id: 9, name: "Idea Generation" },
    { id: 10, name: "Evaluation" },
    { id: 11, name: "Analysis" },
    { id: 12, name: "Monitoring" },
    { id: 13, name: "Implementation" }
  ];

  const subThoughts: ThoughtProcess[] = [
    { id: 1, name: "Identify Sources" },
    { id: 2, name: "Get Information" },
    { id: 3, name: "Collect Data" },
    { id: 4, name: "Record Information" },
    { id: 5, name: "Validate Information" },
    { id: 6, name: "Organize Information" },
    { id: 7, name: "Analyze Information" },
    { id: 8, name: "Summarize" },
    { id: 9, name: "Present" },
    { id: 10, name: "Review" },
    { id: 11, name: "Adjust" }
  ];

  const conversationModes = [
    { id: 1, name: "Question-Answer" },
    { id: 2, name: "Dialogue" },
    { id: 3, name: "Survey" },
    { id: 4, name: "Interview" },
    { id: 5, name: "Scenario-Based" },
    { id: 6, name: "Feedback" },
    { id: 7, name: "Reflective" },
    { id: 8, name: "Diagnostic" },
    { id: 9, name: "Coaching" }
  ];

  const addLog = (message: string, nodeType: string, iterationId?: number): Promise<void> => {
    return new Promise((resolve) => {
      const newLog = {
        message,
        nodeType,
        iterationId,
        timestamp: new Date().toLocaleTimeString(),
        onComplete: () => {
          resolve();
          // Scroll to bottom in the appropriate log container
          const ref = logRefs[nodeType as keyof typeof logRefs];
          if (ref.current) {
            setTimeout(() => {
              if (ref.current) {
                ref.current.scrollTop = ref.current.scrollHeight;
              }
            }, 50);
          }
        }
      };

      setLevelLogs(prev => ({
        ...prev,
        [nodeType]: [...prev[nodeType as keyof typeof prev], newLog]
      }));
    });
  };

  const simulateInterview = async (nodeType: string, iterationId?: number) => {
    // For mode node and it's Interview mode, show the full conversation
    if (nodeType === 'mode' && analysis.iterations[0]?.mode.name === "Interview") {
      // Iteration 1: Stakeholder Identification
      await addLog("User: For our in-depth assessment of stakeholder identification, I'd like to ask you the following:\n\nWho are the key stakeholders for this project?\nWhat unique insights can each stakeholder provide?\nHow should we engage with each stakeholder?\nWhat are the potential challenges in stakeholder engagement?", 'mode', iterationId);

      await addLog("AI: Key Stakeholders for the Project:\n\nSenior Management Team\n\nRole: Decision-makers responsible for strategic direction and resource allocation.\nInsights: Overall goals, resource needs, risk appetite.\nEngagement: Regular meetings for alignment and approvals.\nChallenges: Limited availability and differing priorities.\n\nProject Sponsor\n\nRole: Champion securing funding and resolving escalated issues.\nInsights: Budgetary constraints, high-level decisions.\nEngagement: Frequent communication and progress updates.\nChallenges: Ensuring sustained interest and support.\n\nEnd Users/Clients\n\nRole: Final users of deliverables; key to usability validation.\nInsights: Usability, functionality, user needs.\nEngagement: Conduct interviews, focus groups, surveys.\nChallenges: Balancing diverse feedback and expectations.", 'mode', iterationId);

      // Iteration 2: Source Evaluation
      await addLog("User: For our in-depth assessment of source evaluation, I'd like to ask you the following:\n\nHow reliable is each source?\nHow relevant is each source to our objectives?\nWhat are the limitations of each source?\nWhat is the cost-benefit ratio for each source?", 'mode', iterationId);

      await addLog("AI: Stakeholders:\n\nReliability: High but can vary based on involvement.\nRelevance: Highly relevant for strategic direction and resource insights.\nLimitations: Biases, availability constraints.\nCost-Benefit: High benefit; their support is essential for success.\n\nIndustry Reports:\n\nReliability: Generally reliable from reputable sources.\nRelevance: Crucial for understanding trends and competition.\nLimitations: May lack niche or real-time data.\nCost-Benefit: Justified by the insights they provide.\n\nMarket Analysis:\n\nReliability: Depends on data quality and methodology.\nRelevance: Key for assessing market dynamics and customer needs.\nLimitations: May not predict unforeseen market changes.\nCost-Benefit: High return on investment for business decisions.", 'mode', iterationId);

      // Iteration 3: Source Prioritization
      await addLog("User: For our in-depth assessment of source prioritization, I'd like to ask you the following:\n\nWhich sources should be our top priority?\nWhat is the recommended sequence for accessing these sources?\nWhat dependencies exist between sources?\nHow should we allocate resources across sources?", 'mode', iterationId);
      
      await addLog("AI: Stakeholder Engagement:\n\nTop Priority: Engage key stakeholders early to align goals.\nDependencies: Foundational for other insights.\nResource Allocation: Establish strong communication and feedback channels.\n\nIndustry Reports:\n\nPriority: Use early for strategic context.\nDependencies: Provides a foundation for market analysis.\nResource Allocation: Budget for purchasing and analysis.\n\nMarket Analysis:\n\nPriority: Conduct detailed analysis after stakeholder input and industry reports.\nDependencies: Relies on stakeholder feedback and report insights.\nResource Allocation: Focus on comprehensive data collection and analysis.\n\nInternal Documentation:\n\nPriority: Supplement external insights with historical strategies.\nDependencies: Complements external data for alignment.\nResource Allocation: Minimal effort for review and updates.\n\nPerformance Metrics and Operational Data:\n\nPriority: Use to monitor progress and financial health.\nDependencies: Effectiveness depends on external insights.\nResource Allocation: Maintain resources for continuous tracking.", 'mode', iterationId);

      // Iteration 4: Recommendations
      await addLog("User: Based on the prioritized sources, can you provide specific recommendations to move forward?", 'mode', iterationId);
      
      await addLog("AI: Strategic Recommendations:\n\nDevelop a detailed stakeholder engagement plan focusing on regular meetings and milestone-based reporting.\nPurchase and analyze industry reports to align strategic decisions with market trends.\nConduct a comprehensive market analysis to validate assumptions and refine deliverables.\n\nTactical Recommendations:\n\nTrain the team on data collection and analysis methods to improve accuracy.\nAllocate sufficient resources for stakeholder feedback collection and integration into project plans.\nUse a phased approach to integrate insights into the project timeline.\n\nOperational Recommendations:\n\nBuild robust data systems for real-time performance monitoring.\nSchedule periodic reviews to assess project alignment with stakeholder goals.\nEstablish a feedback loop to ensure continuous improvement.", 'mode', iterationId);

      // Iteration 5: Refinement of Results
      await addLog("User: What improvements or refinements were made in this process? How does this differ from previous iterations?", 'mode', iterationId);
      
      await addLog("AI: Refinement of Stakeholder Insights: Earlier iterations provided general recommendations. Subsequent refinements included specific strategies for engagement and risk mitigation.\nEnhanced Source Evaluation: Initial evaluations were broad; later iterations included cost-benefit analyses and dependencies for prioritization.\nImproved Recommendations: Final recommendations synthesized earlier insights into actionable steps aligned with strategic, tactical, and operational goals.", 'mode', iterationId);

      // Iteration 6: Result Presentation
      await addLog("User: How are the results being displayed?", 'mode', iterationId);
      
      await addLog("AI: The results are presented as structured and professional outputs:\n\nReports: Comprehensive analysis reports organized by stakeholders, sources, and recommendations.\nSummaries: Concise executive summaries for senior management.\nAction Plans: Phased strategies with clear timelines and responsibilities.", 'mode', iterationId);

      return;
    }

    // For other nodes, show simple status messages
    if (nodeType === 'input') {
      await addLog("ORCHESTRATOR - Information Gathering Process Started", 'input');
      await addLog("THOUGHT - Starting analysis of input content...", 'input');
    } else if (nodeType === 'thought') {
      await addLog("THOUGHT - Source Identification: Starting source identification process", 'thought');
      await addLog("THOUGHT - Analyzing approach and methodology...", 'thought');
    } else if (nodeType === 'subThought') {
      await addLog("THOUGHT - Examining sub-thought implications...", 'subThought', iterationId);
      await addLog("THOUGHT - Evaluating implementation requirements...", 'subThought', iterationId);
    } else if (nodeType === 'mode') {
      await addLog("THOUGHT - Initializing selected mode...", 'mode', iterationId);
      await addLog("THOUGHT - Preparing analysis framework...", 'mode', iterationId);
    }
  };

  const handleNodeClick = (nodeType: string, iterationId?: number) => {
    setSelectedNode(nodeType);
    setSelectedIterationId(iterationId ?? null);

    // Toggle the corresponding log window
    setCollapsedLogs(prev => {
      const newState = { ...prev };
      
      // If clicking the same node that's already selected
      if (selectedNode === nodeType && selectedIterationId === (iterationId ?? null)) {
        // Toggle the current log window
        newState[nodeType as keyof typeof prev] = !prev[nodeType as keyof typeof prev];
      } else {
        // If clicking a different node, open its log window and collapse others
        Object.keys(prev).forEach(key => {
          newState[key as keyof typeof prev] = key !== nodeType;
        });
      }
      
      return newState;
    });
  };

  const analyze = () => {
    if (!input.trim() || isAnalyzing) return;
    
    // Reset states
    setAnalysis({ 
      thought: thoughtProcesses.find(t => t.id === 8) || thoughtProcesses[0],
      iterations: [{
        id: 1,
        subThought: subThoughts.find(t => t.id === 1) || subThoughts[0],
        mode: conversationModes.find(m => m.id === 4) || conversationModes[0]
      }]
    });
    
    // Reset display states
    setShowNodes({ input: false, thought: false, iterations: false });
    setShowSubLevels({ subThoughts: false, modes: false });
    
    // Reset logs for each level
    setLevelLogs({
      input: [],
      thought: [],
      subThought: [],
      mode: []
    });

    // Reset level completion
    setLevelCompletion({
      input: false,
      thought: false,
      subThought: false,
      mode: false
    });
    
    // Reset selection states
    setSelectedNode('input');
    setSelectedIterationId(null);
    setIsAnalyzing(true);
  };

  useEffect(() => {
    let isMounted = true;

    const generateLogs = async () => {
      if (!isAnalyzing) return;

      // Reset states
      setCollapsedLogs({
        input: false,
        thought: false,
        subThought: false,
        mode: false
      });
      setShowSubLevels({ subThoughts: false, modes: false });

      // Input Level
      setShowNodes(prev => ({ ...prev, input: true }));
      setSelectedNode('input');  // Auto-select input node
      await addLog(`Starting analysis for input: "${input}"`, 'input', undefined);
      await simulateInterview('input');
      if (!isMounted) return;
      
      // Mark input level as complete and move to thought level
      setLevelCompletion(prev => ({ ...prev, input: true }));
      await new Promise(resolve => setTimeout(resolve, 800));

      // Thought Level
      setShowNodes(prev => ({ ...prev, thought: true }));
      setSelectedNode('thought');  // Auto-select thought node
      await addLog(`Selected ${analysis.thought?.name}`, 'thought', undefined);
      await simulateInterview('thought');
      if (!isMounted) return;
      
      // Mark thought level as complete and move to sub-thought level
      setLevelCompletion(prev => ({ ...prev, thought: true }));
      await new Promise(resolve => setTimeout(resolve, 800));

      // Sub-thought Level
      setShowNodes(prev => ({ ...prev, iterations: true }));
      setShowSubLevels(prev => ({ ...prev, subThoughts: true }));
      setSelectedNode('subThought');  // Auto-select sub-thought node
      const currentIteration = analysis.iterations[0];
      await addLog(`Selected ${currentIteration.subThought.name}`, 'subThought', currentIteration.id);
      await simulateInterview('subThought', currentIteration.id);
      if (!isMounted) return;
      
      // Mark sub-thought level as complete and move to mode level
      setLevelCompletion(prev => ({ ...prev, subThought: true }));
      await new Promise(resolve => setTimeout(resolve, 800));

      // Mode Level
      setShowSubLevels(prev => ({ ...prev, modes: true }));
      setSelectedNode('mode');  // Auto-select mode node
      await addLog(`Selected ${currentIteration.mode.name} mode`, 'mode', currentIteration.id);
      await simulateInterview('mode', currentIteration.id);
      
      if (!isMounted) return;
      
      // Mark mode level as complete
      setLevelCompletion(prev => ({ ...prev, mode: true }));
      
      await addLog("Analysis process completed.", 'system', currentIteration.id);
      setIsAnalyzing(false);
    };

    if (isAnalyzing) {
      generateLogs();
    }

    return () => {
      isMounted = false;
    };
  }, [isAnalyzing, input, analysis]);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100">
      <ShellBar username={mockUser.username} avatarUrl={mockUser.avatarUrl} />
      
      <div className="flex-1 p-2 flex flex-col min-h-0 overflow-hidden">
        {isAnalyzing ? (
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200" role="region" aria-label="Input Display">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium bg-indigo-100 text-indigo-700 shrink-0">
                <Send size={14} />
              </div>
              <div className="flex-1">
                <div className="text-xs font-medium text-gray-500 mb-1">Input Text</div>
                <div className="text-sm text-gray-900 whitespace-pre-wrap break-words bg-gray-50 rounded-lg p-3 border border-gray-100">
                  {input}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-2xl mx-auto px-4">
              <h2 className="text-center text-lg mb-4 font-semibold text-gray-900">
                Welcome to Thought Analyzer
              </h2>
              <p className="text-sm text-center mb-6 text-gray-700">
                Enter your thoughts below to begin the analysis process.
              </p>
              
              <div className="relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter your thoughts here for analysis..."
                  className="w-full p-3 border-2 border-gray-200 rounded-lg shadow-sm resize-none h-[120px] text-sm
                    focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all
                    bg-white"
                  aria-label="Analysis Input"
                  role="textbox"
                />
                <button
                  onClick={analyze}
                  disabled={!input.trim()}
                  className="mt-4 w-full py-2 px-4 rounded-lg flex items-center justify-center
                    bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                    disabled:bg-gray-400 disabled:cursor-not-allowed text-white transition-all duration-200"
                  aria-label="Start Analysis"
                >
                  <Send size={16} className="mr-2" aria-hidden="true" />
                  <span className="font-medium">Start Analysis</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {isAnalyzing && (
          <div className="flex-1 mt-2 min-h-0 overflow-hidden">
            <div className="w-full h-full bg-white p-4 rounded-xl shadow-lg border border-gray-200" role="main">
              <div className="flex gap-4 h-full">
                {/* Graph Section */}
                <div className="w-[60%] flex flex-col items-center" role="region" aria-label="Analysis Graph">
                  <div className="flex flex-col items-center gap-4 w-full max-w-[600px] mx-auto pt-4">
                    {/* Input Node */}
                    {showNodes.input && (
                      <div className="flex flex-col items-center">
                        <div 
                          onClick={() => handleNodeClick('input', undefined)}
                          className={`bg-gradient-to-br p-2 rounded-xl shadow-lg text-center w-28 h-12 flex items-center justify-center cursor-pointer backdrop-blur-sm border border-white/50
                            ${selectedNode === 'input' 
                              ? 'from-indigo-600 to-indigo-700 ring-2 ring-indigo-400 shadow-indigo-200/50' 
                              : 'from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700'
                            } transition-all duration-300 ease-in-out animate-fadeIn focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                          role="button"
                          aria-pressed={selectedNode === 'input'}
                          tabIndex={0}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              handleNodeClick('input', undefined);
                            }
                          }}
                        >
                          <span className="font-medium text-sm text-white">
                            Input
                          </span>
                        </div>
                        <div className="h-4 mt-2 mb-2 w-1 bg-gradient-to-b from-indigo-400 to-indigo-500 rounded-full animate-growVertical origin-top" aria-hidden="true"></div>
                      </div>
                    )}

                    {/* Thought Node */}
                    {showNodes.thought && (
                      <div className="flex flex-col items-center">
                        <div 
                          onClick={() => handleNodeClick('thought', undefined)}
                          className={`bg-gradient-to-br p-2 rounded-xl shadow-lg text-center w-28 h-12 flex items-center justify-center cursor-pointer backdrop-blur-sm border border-white/50
                            ${selectedNode === 'thought' 
                              ? 'from-indigo-600 to-indigo-700 ring-2 ring-indigo-400 shadow-indigo-200/50' 
                              : 'from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700'
                            } transition-all duration-300 ease-in-out animate-fadeIn focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                          role="button"
                          aria-pressed={selectedNode === 'thought'}
                          tabIndex={0}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              handleNodeClick('thought', undefined);
                            }
                          }}
                        >
                          <span className="font-medium text-sm text-white">
                            {analysis.thought?.name}
                          </span>
                        </div>
                        <div className="h-4 mt-2 mb-2 w-1 bg-gradient-to-b from-indigo-400 to-indigo-500 rounded-full animate-growVertical origin-top" aria-hidden="true"></div>
                      </div>
                    )}

                    {/* Sub-thoughts Grid */}
                    {showNodes.iterations && showSubLevels.subThoughts && (
                      <div className="flex flex-col items-center">
                        <div className="grid grid-cols-4 gap-1.5 w-full" role="grid">
                          {subThoughts.map(subThought => {
                            const isSelected = analysis.iterations.some(it => it.subThought.id === subThought.id);
                            const matchingIteration = analysis.iterations.find(it => it.subThought.id === subThought.id);
                            
                            return (
                              <div 
                                key={subThought.id}
                                onClick={() => {
                                  if (matchingIteration) {
                                    handleNodeClick('subThought', matchingIteration.id);
                                  }
                                }}
                                className={`bg-gradient-to-br p-2 rounded-xl shadow-lg text-center h-12 flex items-center justify-center backdrop-blur-sm border border-white/50
                                  ${isSelected
                                    ? `cursor-pointer from-indigo-600 to-indigo-700 ring-2 ring-indigo-400 shadow-indigo-200/50 ${
                                        selectedNode === 'subThought' && selectedIterationId === matchingIteration?.id
                                          ? 'ring-2 ring-indigo-500'
                                          : ''
                                      }`
                                    : 'from-indigo-400/40 to-indigo-500/40'
                                  } transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                                  role="gridcell"
                                  aria-selected={isSelected}
                                  tabIndex={isSelected ? 0 : -1}
                                  onKeyPress={(e) => {
                                    if (matchingIteration && (e.key === 'Enter' || e.key === ' ')) {
                                      handleNodeClick('subThought', matchingIteration.id);
                                    }
                                  }}
                              >
                                <span className={`font-medium text-xs leading-tight ${
                                  isSelected ? 'text-white' : 'text-white/60'
                                }`}>
                                  {subThought.name}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                        <div className="h-4 mt-2 mb-2 w-1 bg-gradient-to-b from-indigo-400 to-indigo-500 rounded-full animate-growVertical origin-top" aria-hidden="true"></div>
                      </div>
                    )}

                    {/* Conversation Modes Grid */}
                    {showNodes.iterations && showSubLevels.modes && (
                      <div className="flex flex-col items-center">
                        <div className="grid grid-cols-5 gap-1.5 w-full" role="grid">
                          {conversationModes.map(mode => {
                            const isSelected = analysis.iterations.some(it => it.mode.id === mode.id);
                            const matchingIteration = analysis.iterations.find(it => it.mode.id === mode.id);
                            
                            return (
                              <div 
                                key={mode.id}
                                onClick={() => {
                                  if (matchingIteration) {
                                    handleNodeClick('mode', matchingIteration.id);
                                  }
                                }}
                                className={`bg-gradient-to-br p-2 rounded-xl shadow-lg text-center h-12 flex items-center justify-center backdrop-blur-sm border border-white/50
                                  ${isSelected
                                    ? `cursor-pointer from-indigo-600 to-indigo-700 ring-2 ring-indigo-400 shadow-indigo-200/50 ${
                                        selectedNode === 'mode' && selectedIterationId === matchingIteration?.id
                                          ? 'ring-2 ring-indigo-500'
                                          : ''
                                      }`
                                    : 'from-indigo-400/40 to-indigo-500/40'
                                  } transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                                  role="gridcell"
                                  aria-selected={isSelected}
                                  tabIndex={isSelected ? 0 : -1}
                                  onKeyPress={(e) => {
                                    if (matchingIteration && (e.key === 'Enter' || e.key === ' ')) {
                                      handleNodeClick('mode', matchingIteration.id);
                                    }
                                  }}
                              >
                                <span className={`font-medium text-xs leading-tight ${
                                  isSelected ? 'text-white' : 'text-white/60'
                                }`}>
                                  {mode.name}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Logging Windows Section */}
                <div className="w-[40%] flex flex-col gap-2 h-full overflow-hidden" role="complementary" aria-label="Analysis Logs">
                  {/* Input Level Logger */}
                  {showNodes.input && selectedNode === 'input' && (
                    <div className={`bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden transition-all duration-300 shrink-0 ${collapsedLogs.input ? 'h-8' : ''}`}>
                      <div className="flex items-center justify-between p-2 bg-gray-50 shrink-0">
                        <div className="text-[10px] font-medium text-gray-900">Input Level Logs</div>
                        <button 
                          onClick={() => toggleLogWindow('input')}
                          className="text-gray-700 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          aria-label={collapsedLogs.input ? "Expand Input Logs" : "Collapse Input Logs"}
                        >
                          <ChevronRight size={14} className={`transform transition-transform ${collapsedLogs.input ? '' : 'rotate-90'}`} aria-hidden="true" />
                        </button>
                      </div>
                      {!collapsedLogs.input && (
                        <div 
                          ref={logRefs.input}
                          className="max-h-[calc(100vh-300px)] overflow-y-auto space-y-2 p-2 pr-4 scroll-smooth"
                          style={{ scrollBehavior: 'smooth' }}
                          role="log"
                        >
                          {levelLogs.input.map((log, index) => (
                            <div key={index} className="flex items-start justify-start">
                              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium bg-gray-100 text-gray-900 shrink-0" aria-hidden="true">
                                AI
                              </div>
                              <div className="mx-2 max-w-[80%]">
                                <div className="inline-block rounded-lg px-3 py-2 text-xs bg-gray-100 text-gray-900 whitespace-pre-wrap break-words">
                                  <TypingText text={log.message} onComplete={log.onComplete} />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Thought Level Logger */}
                  {showNodes.thought && selectedNode === 'thought' && (
                    <div className={`bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden transition-all duration-300 shrink-0 ${collapsedLogs.thought ? 'h-8' : ''}`}>
                      <div className="flex items-center justify-between p-2 bg-gray-50 shrink-0">
                        <div className="text-[10px] font-medium text-gray-900">Thought Level Logs</div>
                        <button 
                          onClick={() => toggleLogWindow('thought')}
                          className="text-gray-700 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          aria-label={collapsedLogs.thought ? "Expand Thought Logs" : "Collapse Thought Logs"}
                        >
                          <ChevronRight size={14} className={`transform transition-transform ${collapsedLogs.thought ? '' : 'rotate-90'}`} aria-hidden="true" />
                        </button>
                      </div>
                      {!collapsedLogs.thought && (
                        <div 
                          ref={logRefs.thought}
                          className="max-h-[calc(100vh-300px)] overflow-y-auto space-y-2 p-2 pr-4 scroll-smooth"
                          style={{ scrollBehavior: 'smooth' }}
                          role="log"
                        >
                          {levelLogs.thought.map((log, index) => (
                            <div key={index} className="flex items-start justify-start">
                              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium bg-gray-100 text-gray-900 shrink-0" aria-hidden="true">
                                AI
                              </div>
                              <div className="mx-2 max-w-[80%]">
                                <div className="inline-block rounded-lg px-3 py-2 text-xs bg-gray-100 text-gray-900 whitespace-pre-wrap break-words">
                                  <TypingText text={log.message} onComplete={log.onComplete} />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Sub-thought Level Logger */}
                  {showNodes.iterations && showSubLevels.subThoughts && selectedNode === 'subThought' && (
                    <div className={`bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden transition-all duration-300 shrink-0 ${collapsedLogs.subThought ? 'h-8' : ''}`}>
                      <div className="flex items-center justify-between p-2 bg-gray-50 shrink-0">
                        <div className="text-[10px] font-medium text-gray-900">Sub-thought Level Logs</div>
                        <button 
                          onClick={() => toggleLogWindow('subThought')}
                          className="text-gray-700 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          aria-label={collapsedLogs.subThought ? "Expand Sub-thought Logs" : "Collapse Sub-thought Logs"}
                        >
                          <ChevronRight size={14} className={`transform transition-transform ${collapsedLogs.subThought ? '' : 'rotate-90'}`} aria-hidden="true" />
                        </button>
                      </div>
                      {!collapsedLogs.subThought && (
                        <div 
                          ref={logRefs.subThought}
                          className="max-h-[calc(100vh-300px)] overflow-y-auto space-y-2 p-2 pr-4 scroll-smooth"
                          style={{ scrollBehavior: 'smooth' }}
                          role="log"
                        >
                          {levelLogs.subThought.map((log, index) => (
                            <div key={index} className="flex items-start justify-start">
                              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium bg-gray-100 text-gray-900 shrink-0" aria-hidden="true">
                                AI
                              </div>
                              <div className="mx-2 max-w-[80%]">
                                <div className="inline-block rounded-lg px-3 py-2 text-xs bg-gray-100 text-gray-900 whitespace-pre-wrap break-words">
                                  <TypingText text={log.message} onComplete={log.onComplete} />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Mode Level Logger - Chat Messages */}
                  {showNodes.iterations && showSubLevels.modes && selectedNode === 'mode' && (
                    <div className={`bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden transition-all duration-300 shrink-0 ${collapsedLogs.mode ? 'h-8' : 'flex-1'}`}>
                      <div className="flex items-center justify-between p-2 bg-gray-50 shrink-0">
                        <div className="text-[10px] font-medium text-gray-900">Mode Level Logs</div>
                        <button 
                          onClick={() => toggleLogWindow('mode')}
                          className="text-gray-700 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          aria-label={collapsedLogs.mode ? "Expand Mode Logs" : "Collapse Mode Logs"}
                        >
                          <ChevronRight size={14} className={`transform transition-transform ${collapsedLogs.mode ? '' : 'rotate-90'}`} aria-hidden="true" />
                        </button>
                      </div>
                      {!collapsedLogs.mode && (
                        <div 
                          ref={logRefs.mode}
                          className="h-[calc(100%-32px)] overflow-y-auto space-y-2 p-2 pr-4 scroll-smooth rounded-b-lg"
                          style={{ scrollBehavior: 'smooth' }}
                          role="log"
                        >
                          {levelLogs.mode.map((log, index) => {
                            const isAI = log.message.startsWith('AI:');
                            const isUser = log.message.startsWith('User:');
                            const message = isAI ? log.message.substring(4) : 
                                         isUser ? log.message.substring(5) : 
                                         log.message;

                            if (isAI || isUser) {
                              return (
                                <div key={index} className={`flex items-start ${isUser ? 'justify-end' : 'justify-start'}`} role="article">
                                  {isAI && (
                                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium bg-gray-100 text-gray-900 shrink-0" aria-hidden="true">
                                      AI
                                    </div>
                                  )}
                                  <div className={`mx-2 max-w-[80%]`}>
                                    <div className={`inline-block rounded-lg px-3 py-2 text-xs bg-gray-100 text-gray-900 whitespace-pre-wrap break-words`}>
                                      <TypingText text={message} onComplete={log.onComplete} />
                                    </div>
                                  </div>
                                  {isUser && (
                                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium bg-gray-100 text-gray-900 shrink-0" aria-hidden="true">
                                      P
                                    </div>
                                  )}
                                </div>
                              );
                            }

                            return (
                              <div key={index} className="bg-gray-50 rounded px-2 py-1 text-[10px] text-gray-900" role="article">
                                <TypingText text={log.message} onComplete={log.onComplete} />
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThoughtProcessAnalyzer;

