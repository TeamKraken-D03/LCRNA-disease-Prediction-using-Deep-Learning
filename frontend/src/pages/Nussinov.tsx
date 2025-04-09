import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


function nussinov_algorithm(sequence: string): number {
  const n = sequence.length;
  const dp: number[][] = Array.from({ length: n }, () => Array(n).fill(0));

  // Check if two bases can pair
  const canPair = (a: string, b: string): boolean => {
    return (a === "A" && b === "U") || (a === "U" && b === "A") ||
           (a === "G" && b === "C") || (a === "C" && b === "G");
  };

  // Fill DP table
  for (let l = 1; l < n; l++) { // length of subsequence
    for (let i = 0; i < n - l; i++) {
      let j = i + l;
      if (j - i < 5) {
        dp[i][j] = 0;
        continue;
      }

      // Case 1: i unpaired
      dp[i][j] = dp[i + 1][j];

      // Case 2: j unpaired
      dp[i][j] = Math.max(dp[i][j], dp[i][j - 1]);

      // Case 3: i paired with j
      if (canPair(sequence[i], sequence[j])) {
        dp[i][j] = Math.max(dp[i][j], dp[i + 1][j - 1] + 1);
      }

      // Case 4: split the sequence
      for (let k = i + 1; k < j; k++) {
        dp[i][j] = Math.max(dp[i][j], dp[i][k] + dp[k + 1][j]);
      }
    }
  }

  return dp[0][n - 1];
}



export default function Nussinov() {
  const [sequence, setSequence] = useState("");
  const [result, setResult] = useState(-1);

  function handleClick(sequence: string) {
    const n: number = nussinov_algorithm(sequence)
    setResult(n);
    console.log(n);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="p-6 my-4 ml-5 h-150">
        <CardHeader>
          <CardTitle className="text-xl">Nussinov's Algorithm</CardTitle>
          <CardDescription>Secondary structure of non-coding RNA sequences using Nussinov's algorithm</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 max-h-100">
          <Input onChange={(e) => setSequence(e.target.value)} value={sequence} />
          <Button onClick={() => handleClick(sequence)}>Submit</Button>
        </CardContent>
      </Card>

      <Card className="p-6 my-4 mr-5 h-150">
        <CardHeader>
          <CardTitle className="text-xl">Secondary Structure</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-100">
          {(result === -1) ?
            <div className="text-lg font-bold">Please enter a sequence</div> :
            <div className="text-lg font-bold">The maximum number of base pairs is: {result}</div>}
        </CardContent>
      </Card>
    </div>
  )
}
