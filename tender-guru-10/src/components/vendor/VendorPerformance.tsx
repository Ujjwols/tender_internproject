
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Vendor } from "@/types/vendor";

interface VendorPerformanceProps {
  vendor: Vendor;
}

const VendorPerformance = ({ vendor }: VendorPerformanceProps) => {
  // Mock performance data
  const performance = [
    {
      id: 1,
      projectId: 101,
      deliveryScore: 85,
      qualityScore: 90,
      communicationScore: 88,
      timelinessScore: 92,
      comments: "Excellent communication and quality of work",
      evaluatedAt: "2024-02-15T10:00:00Z",
    },
  ];

  const calculateAverageScore = (scores: number[]) => {
    return scores.reduce((a, b) => a + b, 0) / scores.length;
  };

  const averageScore = calculateAverageScore([
    ...performance.map((p) => p.deliveryScore),
    ...performance.map((p) => p.qualityScore),
    ...performance.map((p) => p.communicationScore),
    ...performance.map((p) => p.timelinessScore),
  ]);

  return (
    <ScrollArea className="h-[60vh]">
      <div className="space-y-6">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">Overall Performance</h3>
          <div className="text-3xl font-bold text-purple-600">
            {averageScore.toFixed(1)}%
          </div>
        </Card>

        <div className="space-y-4">
          {performance.map((p) => (
            <Card key={p.id} className="p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-semibold">Project #{p.projectId}</h4>
                  <p className="text-sm text-gray-500">
                    Evaluated on: {new Date(p.evaluatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Delivery</p>
                  <p className="font-semibold">{p.deliveryScore}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Quality</p>
                  <p className="font-semibold">{p.qualityScore}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Communication</p>
                  <p className="font-semibold">{p.communicationScore}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Timeliness</p>
                  <p className="font-semibold">{p.timelinessScore}%</p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-600">Comments</p>
                <p className="text-sm mt-1">{p.comments}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
};

export default VendorPerformance;

