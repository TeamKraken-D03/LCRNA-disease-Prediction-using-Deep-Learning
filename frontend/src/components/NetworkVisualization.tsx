import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState, useEffect } from "react";

interface NetworkVisualizationProps {
  centerNode: string;
  centerNodeType: "lncRNA" | "disease";
  associatedNodes: any[];
  onClose: () => void;
}

export function NetworkVisualization({
  centerNode,
  centerNodeType,
  associatedNodes,
  onClose,
}: NetworkVisualizationProps) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  // Track window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Prevent scrolling when popup is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const centerColor = centerNodeType === "lncRNA" ? "bg-blue-500" : "bg-purple-500";
  const nodeColor = centerNodeType === "lncRNA" ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600";
  const lineColor = centerNodeType === "lncRNA" ? "bg-green-200" : "bg-blue-200";
  const nodeKey = centerNodeType === "lncRNA" ? "DiseaseName" : "ncRNASymbol";

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      <div className="p-4 flex items-center justify-between bg-card shadow-md">
        <h2 className="text-xl font-bold">
          {centerNodeType === "lncRNA" ? "Disease" : "lncRNA"} Network Visualization: {centerNode}
        </h2>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onClose}
          className="rounded-full"
        >
          <X className="size-5" />
        </Button>
      </div>
      
      <div className="flex-1 p-0">
        <div className="relative w-full h-full flex items-center justify-center">
          {associatedNodes.length > 0 ? (
            <div className="flex flex-wrap justify-center items-center gap-4 w-full h-full">
              {/* Center node */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                <div className={`${centerColor} rounded-full w-24 h-24 flex items-center justify-center shadow-lg`}>
                  <p className="text-white text-center text-sm font-bold p-2">{centerNode}</p>
                </div>
              </div>
              
              {/* Associated nodes in a circle around the center */}
              {associatedNodes.map((node: any, index: number) => {
                // Calculate position in a circle
                const angle = (index * 2 * Math.PI) / associatedNodes.length;
                
                // Calculate dynamic radius based on number of nodes and full screen size
                const screenSize = Math.min(windowWidth, windowHeight) * 0.8;
                const baseRadius = Math.min(screenSize * 0.4, 400);
                const scalingFactor = Math.max(0.8, Math.min(1.4, 15 / Math.max(10, associatedNodes.length)));
                const radius = baseRadius * scalingFactor;
                
                // Adjust node size based on number of items
                const nodeSize = associatedNodes.length > 15 ? 8 : 12;
                
                // Calculate exact position at the end of the line
                const left = `calc(50% + ${radius * Math.cos(angle)}px)`;
                const top = `calc(50% + ${radius * Math.sin(angle)}px)`;
                
                // Determine label positioning based on node position in the circle
                const isLeftSide = Math.cos(angle) < -0.1;
                const isRightSide = Math.cos(angle) > 0.1;
                const isTopSide = Math.sin(angle) < -0.1;
                const isBottomSide = Math.sin(angle) > 0.1;
                
                // Calculate label positioning classes based on quadrant
                const labelPositionClasses = (() => {
                  if (isLeftSide) {
                    return "right-full mr-2 -translate-y-1/2 text-right"; // Right-aligned on left side
                  } else if (isRightSide) {
                    return "left-full ml-2 -translate-y-1/2 text-left"; // Left-aligned on right side
                  } else if (isTopSide) {
                    return "bottom-full mb-2 -translate-x-1/2 text-center"; // Centered above on top
                  } else {
                    return "top-full mt-2 -translate-x-1/2 text-center"; // Centered below on bottom
                  }
                })();
                
                // Calculate label connector line properties
                const linePositionStyle = (() => {
                  if (isLeftSide) {
                    return { right: 0, top: '50%', width: '10px', height: '1px' };
                  } else if (isRightSide) {
                    return { left: 0, top: '50%', width: '10px', height: '1px' };
                  } else if (isTopSide) {
                    return { bottom: 0, left: '50%', width: '1px', height: '10px' };
                  } else {
                    return { top: 0, left: '50%', width: '1px', height: '10px' };
                  }
                })();
                
                return (
                  <div 
                    key={index} 
                    className="absolute"
                    style={{ 
                      left, 
                      top,
                      transform: 'translate(-50%, -50%)',
                      transition: 'all 0.5s ease-in-out' 
                    }}
                  >
                    {/* Connection line from center to node */}
                    <div className={`absolute top-1/2 left-1/2 h-[2px] ${lineColor} origin-left z-0`}
                         style={{ 
                           width: `${radius}px`,
                           transform: `rotate(${angle + Math.PI}rad)`,
                         }}>
                    </div>
                    
                    {/* Node */}
                    <div className={`${nodeColor} rounded-full flex items-center justify-center shadow-md hover:shadow-lg hover:scale-110 transition-transform cursor-pointer relative z-10 group`}
                         style={{
                           width: `${nodeSize * 2}px`,
                           height: `${nodeSize * 2}px`
                         }}
                         title={node.CausalDescription}>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20">
                        <div className="bg-black/80 text-white text-xs rounded py-1 px-2 whitespace-nowrap shadow-lg">
                          {node[nodeKey]}
                        </div>
                        <div className="w-2 h-2 bg-black/80 rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1"></div>
                      </div>
                    </div>
                    
                    {/* Node label with smart positioning */}
                    <div className={`absolute ${labelPositionClasses} whitespace-nowrap`}>
                      <div className="relative">
                        {/* Removed connector line */}
                        
                        <p className="text-xs font-medium text-foreground bg-background/90 px-2 py-1 rounded shadow-sm max-w-[250px]">
                          {node[nodeKey]}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p>No associations to visualize.</p>
          )}
        </div>
      </div>
    </div>
  );
} 