import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import Details from "./Details";

export type DiseaseData = {
  DiseaseName: string;
  ncRNASymbol: string;
  ncRNACategory: string;
  Species: string;
  Sample: string;
  DysfunctionPattern: string;
  ValidatedMethod: string;
  PubMedID: string;
  Causality: string;
  CausalDescription: string;
  Description: string;
};

export default function Results() {
  const [searchParams] = useSearchParams();
  const disease = searchParams.get("disease");
  const lncrna = searchParams.get("lncrna");
  const [result, setResult] = useState<DiseaseData>(
    {
      DiseaseName: "",
      ncRNASymbol: "",
      ncRNACategory: "",
      Species: "",
      Sample: "",
      DysfunctionPattern: "",
      ValidatedMethod: "",
      PubMedID: "",
      Causality: "",
      CausalDescription: "",
      Description: ""
    }
  );
  const [clicked, setClicked] = useState(false);

  const [results, setResults] = useState<[DiseaseData]>([
    {
      DiseaseName: "",
      ncRNASymbol: "",
      ncRNACategory: "",
      Species: "",
      Sample: "",
      DysfunctionPattern: "",
      ValidatedMethod: "",
      PubMedID: "",
      Causality: "",
      CausalDescription: "",
      Description: ""
    }
  ]); 

  useEffect(() => {
    const fetchData = async () => {
      const params = new URLSearchParams();
      if (disease) params.append("disease", disease);
      if (lncrna) params.append("lncrna", lncrna);
      if (!disease && !lncrna) return;
      const res = await fetch(`http://localhost:3000/api/search?${params}`);
      const data = await res.json();
      setResults(data);
    };

    fetchData();
  }, [disease, lncrna]);

  const handleClick = (r: DiseaseData) => {
    console.log(r);
    setClicked(true);
    setResult(r);
  }

  return (
    clicked ? (<Details {... result} />):(
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Results</h1>
      <table className="w-full table-auto border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Disease</th>
            <th className="border px-4 py-2">lncRNA</th>
            <th className="border px-2 py-2">PubMed ID</th>
            <th className="border px-4 py-2">Causal Description</th>
            <th className="border px-4 py-2">View More</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r:DiseaseData, i) => (
            <tr key={i}>
              <td className="border px-4 py-2">{r.DiseaseName}</td>
              <td className="border px-4 py-2">{r.ncRNASymbol}</td>
              <td className="border px-4 py-2">{r.PubMedID}</td>
              <td className="border px-4 py-2 text-justify">{r.CausalDescription}</td>
              <td className="border px-4 py-2 text-justify"><Button onClick={() => handleClick(r)} variant="outline">Click Here</Button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>)
  );
}
