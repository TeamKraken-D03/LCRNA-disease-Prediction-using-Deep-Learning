import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useEffect, useState, useRef } from "react";
import { DiseaseData } from "./Results";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function Details(diseasedata: DiseaseData) {
  const [associatedLncRNAs, setAssociatedLncrnas] = useState([]);
  const [associatedDiseases, setAssociatedDiseases] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [showNetworkView, setShowNetworkView] = useState(false);
  
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
    if (showNetworkView) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showNetworkView]);

  useEffect(() => {
    const fetchRelatedData = async () => {
      if (!diseasedata) return; 
      const params = new URLSearchParams();
      if (diseasedata.DiseaseName) params.append("disease", diseasedata.DiseaseName);
      if (diseasedata.ncRNASymbol) params.append("lncrna", diseasedata.ncRNASymbol);
      const response = await fetch(`http://localhost:3000/api/related?${params}`);
      const data = await response.json();
      console.log(data); 
      setAssociatedDiseases(data.associated_diseases || []);
      setAssociatedLncrnas(data.associated_lncrna || []);
    };
    fetchRelatedData();
  }, [diseasedata]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Tabs defaultValue="details">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="details">Disease Details</TabsTrigger>
          <TabsTrigger value="related">Other Associated lncRNAs & Diseases</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Disease Details</CardTitle>
              <CardDescription>Detailed information for the selected disease-lncRNA pair.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 overflow-y-auto max-h-100">
              {diseasedata ? (
                <>
                  <p><strong>Disease:</strong> {diseasedata.DiseaseName}</p>
                  <p><strong>lncRNA:</strong> {diseasedata.ncRNASymbol}</p>
                  <p><strong>ncRNA Category:</strong> {diseasedata.ncRNACategory}</p>
                  <p><strong>Species:</strong> {diseasedata.Species}</p>
                  <p><strong>Sample:</strong> {diseasedata.Sample}</p>
                  <p><strong>Dysfunction Pattern:</strong> {diseasedata.DysfunctionPattern}</p>
                  <p><strong>Validated Method:</strong> {diseasedata.ValidatedMethod}</p>
                  <p><strong>PubMed ID:</strong> {diseasedata.PubMedID}</p>
                  <p><strong>Causality:</strong> {diseasedata.Causality}</p>
                  <p className="text-justify"><strong>Causal Description:</strong> {diseasedata.CausalDescription}</p>
                  <p className="text-justify"><strong>Description:</strong> {diseasedata.Description}</p>
                </>
              ) : (
                <p className="text-red-500">No data available.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="related">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Disease Associations</CardTitle>
                  <CardDescription>Other known diseases associated with this lncRNA.</CardDescription>
                </div>
                <Button 
                  onClick={() => setShowNetworkView(true)} 
                  variant="outline"
                  className="ml-2"
                >
                  Show Network View
                </Button>
              </CardHeader>
              <CardContent className="space-y-2 max-h-100 overflow-y-auto">
                {associatedDiseases.length > 0 ? (
                  associatedDiseases.map((item: any, index: number) => (
                    <div key={index} className="border-b pb-2 mb-2">
                      <p><strong>Disease:</strong> {item.DiseaseName}</p>
                      <p className="text-justify"><strong>Description:</strong> {item.CausalDescription}</p>
                    </div>
                  ))
                ) : (
                  <p>No disease associations found.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">lncRNA Associations</CardTitle>
                <CardDescription>Other known lncRNAs associated with this disease.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 max-h-100 overflow-y-auto">
                {associatedLncRNAs.length > 0 ? (
                  associatedLncRNAs.map((item: any, index: number) => (
                    <div key={index} className="border-b pb-2 mb-2">
                      <p><strong>lncRNA:</strong> {item.ncRNASymbol}</p>
                      <p className="text-justify"><strong>Description:</strong> {item.CausalDescription}</p>
                    </div>
                  ))
                ) : (
                  <p>No lncRNA associations found.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Full screen popup for network visualization */}
          {showNetworkView && (
            <div className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 flex flex-col">
              <div className="p-4 flex items-center justify-between bg-card shadow-md">
                <h2 className="text-xl font-bold">
                  Disease Network Visualization: {diseasedata.ncRNASymbol}
                </h2>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowNetworkView(false)}
                  className="rounded-full"
                >
                  <X className="size-5" />
                </Button>
              </div>
              
              <div className="flex-1 overflow-hidden p-4">
                <div id="disease-network-visualization" className="relative w-full h-full flex items-center justify-center bg-card/50 rounded-lg border">
                  {associatedDiseases.length > 0 ? (
                    <div className="flex flex-wrap justify-center items-center gap-4 w-full h-full">
                      {/* Center lncRNA node */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                        <div className="bg-blue-500 rounded-full w-24 h-24 flex items-center justify-center shadow-lg">
                          <p className="text-white text-center text-sm font-bold p-2">{diseasedata.ncRNASymbol}</p>
                        </div>
                      </div>
                      
                      {/* Disease nodes in a circle around the lncRNA */}
                      {associatedDiseases.map((disease: any, index: number) => {
                        // Calculate position in a circle
                        const angle = (index * 2 * Math.PI) / associatedDiseases.length;
                        
                        // Calculate dynamic radius based on number of diseases
                        const baseRadius = Math.min(Math.min(windowWidth, windowHeight) * 0.4, 350);
                        const scalingFactor = Math.max(1, Math.min(1.5, 10 / associatedDiseases.length));
                        const radius = baseRadius * scalingFactor;
                        
                        // Adjust node size based on number of items (larger in fullscreen)
                        const nodeSize = associatedDiseases.length > 15 ? 8 : 12;
                        
                        // Calculate exact position at the end of the line
                        const left = `calc(50% + ${radius * Math.cos(angle)}px)`;
                        const top = `calc(50% + ${radius * Math.sin(angle)}px)`;
                        
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
                            {/* Connection line from center to disease */}
                            <div className="absolute top-1/2 left-1/2 h-[2px] bg-green-200 origin-left z-0" 
                                 style={{ 
                                   width: `${radius}px`,
                                   transform: `rotate(${angle + Math.PI}rad)`,
                                 }}>
                            </div>
                            
                            {/* Disease node */}
                            <div className={`bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-md hover:shadow-lg hover:scale-110 transition-transform cursor-pointer relative z-10`}
                                 style={{
                                   width: `${nodeSize * 2}px`,
                                   height: `${nodeSize * 2}px`
                                 }}
                                 title={disease.CausalDescription}>
                            </div>
                            
                            {/* Disease name label - now positioned directly below node */}
                            <div className="absolute w-auto left-1/2 -translate-x-1/2 mt-1 top-full">
                              <p className="text-xs font-medium text-foreground bg-background/80 px-1 py-0.5 rounded truncate max-w-[120px] sm:max-w-[150px] md:max-w-[180px] text-center" 
                                 title={disease.DiseaseName}>
                                {disease.DiseaseName}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p>No disease associations to visualize.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
