import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import type { Clarification } from "@/types/procurement";

interface ClarificationManagerProps {
  tenderId: number;
  clarifications: Clarification[];
  onUpdate: (clarifications: Clarification[]) => void;
}

const ClarificationManager = ({
  tenderId,
  clarifications,
  onUpdate,
}: ClarificationManagerProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    question: "",
    requestedBy: {
      id: 1, // This would typically come from auth context
      name: "John Doe", // This would typically come from auth context
      organization: "Example Corp", // This would typically come from auth context
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newClarification: Clarification = {
      id: Date.now(),
      tenderId,
      question: formData.question,
      requestedBy: formData.requestedBy,
      requestDate: new Date().toISOString(),
      status: "pending",
    };

    onUpdate([...clarifications, newClarification]);
    setFormData({
      ...formData,
      question: "",
    });

    toast({
      title: "Clarification Requested",
      description: "New clarification request has been submitted.",
    });
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="question">Question</Label>
          <Textarea
            id="question"
            value={formData.question}
            onChange={(e) =>
              setFormData({ ...formData, question: e.target.value })
            }
            required
          />
        </div>

        <Button type="submit">Submit Question</Button>
      </form>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Clarification Requests</h3>
        {clarifications.length === 0 ? (
          <p className="text-gray-500">No clarification requests yet.</p>
        ) : (
          <div className="space-y-2">
            {clarifications.map((clarification) => (
              <div
                key={clarification.id}
                className="p-4 border rounded-lg space-y-2"
              >
                <div>
                  <p className="font-medium">Question: {clarification.question}</p>
                  <p className="text-sm text-gray-500">
                    By: {clarification.requestedBy.name} ({clarification.requestedBy.organization})
                  </p>
                  <p className="text-sm text-gray-500">
                    Status: {clarification.status.toUpperCase()}
                  </p>
                  {clarification.answer && (
                    <p className="mt-2 p-2 bg-gray-50 rounded">
                      Answer: {clarification.answer}
                    </p>
                  )}
                </div>
                {clarification.status === "pending" && (
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Type your answer here..."
                      onChange={(e) => {
                        const answer = e.target.value;
                        const updated = clarifications.map((c) =>
                          c.id === clarification.id
                            ? { ...c, answer }
                            : c
                        );
                        onUpdate(updated);
                      }}
                    />
                    <Button
                      onClick={() => {
                        const updated = clarifications.map((c) =>
                          c.id === clarification.id
                            ? {
                                ...c,
                                status: "answered" as const,
                                responseDate: new Date().toISOString(),
                              }
                            : c
                        );
                        onUpdate(updated);
                        toast({
                          title: "Answer Submitted",
                          description: "Clarification has been answered.",
                        });
                      }}
                    >
                      Submit Answer
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClarificationManager;
