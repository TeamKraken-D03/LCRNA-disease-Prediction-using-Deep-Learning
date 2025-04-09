import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function SmithWaterman() {

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="p-6 my-4 ml-5 h-150">
        <CardHeader>
          <CardTitle className="text-xl">Smith-Waterman</CardTitle>
          <CardDescription>Local Alignment Algorithm</ CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 max-h-100">
          <Input onChange={(e)=>{
            console.log(e.target.value)
          }}/>
          <Button>Submit</Button>
        </CardContent>
      </Card>

      <Card className="p-6 my-4 mr-5 h-150">
        <CardHeader>
          <CardTitle className="text-xl">Local String Alignment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-100">
        </CardContent>
      </Card>
    </div>
  )
}
