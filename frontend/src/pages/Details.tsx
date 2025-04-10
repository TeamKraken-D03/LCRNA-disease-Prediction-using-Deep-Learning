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
import { useEffect, useState } from "react";
import { DiseaseData } from "./Results";
import { Button } from "@/components/ui/button";
import { NetworkVisualization } from "@/components/NetworkVisualization";

export default function Details(diseasedata: DiseaseData) {
  const [associatedLncRNAs, setAssociatedLncrnas] = useState([]);
  const [associatedDiseases, setAssociatedDiseases] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [showNetworkView, setShowNetworkView] = useState(false);
  const [showLncRNANetworkView, setShowLncRNANetworkView] = useState(false);
  
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
                <div className="flex justify-end mb-2">
                  <div>
                    <CardTitle className="text-xl">lncRNA Associations</CardTitle>
                    <CardDescription>Other known lncRNAs associated with this disease.</CardDescription>
                  </div>
                  <Button 
                    onClick={() => setShowLncRNANetworkView(true)} 
                    variant="outline"
                    className="ml-2"
                  >
                    Show Network View
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 max-h-100 overflow-y-auto">
                {associatedLncRNAs.length > 0 ? (
                  <>
                    {associatedLncRNAs.map((item: any, index: number) => (
                      <div key={index} className="border-b pb-2 mb-2">
                        <p><strong>lncRNA:</strong> {item.ncRNASymbol}</p>
                        <p className="text-justify"><strong>Description:</strong> {item.CausalDescription}</p>
                      </div>
                    ))}
                  </>
                ) : (
                  <p>No lncRNA associations found.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Network Visualizations */}
          {showNetworkView && (
            <NetworkVisualization 
              centerNode={diseasedata.ncRNASymbol}
              centerNodeType="lncRNA"
              associatedNodes={associatedDiseases}
              onClose={() => setShowNetworkView(false)}
            />
          )}

          {showLncRNANetworkView && (
            <NetworkVisualization 
              centerNode={diseasedata.DiseaseName}
              centerNodeType="disease"
              associatedNodes={associatedLncRNAs}
              onClose={() => setShowLncRNANetworkView(false)}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
