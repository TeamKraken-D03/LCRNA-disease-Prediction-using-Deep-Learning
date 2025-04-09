import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function Home() {
  const [disease, setDisease] = useState("");
  const [lncrna, setLncrna] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/results?disease=${disease}&lncrna=${lncrna}`);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">lncRNA Search Engine</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="disease" className="pb-2">Disease</Label>
              <Input
                id="disease"
                value={disease}
                onChange={(e) => setDisease(e.target.value)}
                placeholder="Enter disease"
              />
            </div>
            <div>
              <Label htmlFor="lncrna" className="pb-2">lncRNA</Label>
              <Input
                id="lncrna"
                value={lncrna}
                onChange={(e) => setLncrna(e.target.value)}
                placeholder="Enter lncRNA ID"
              />
            </div>
            <Button type="submit" className="w-full">
              Search
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
