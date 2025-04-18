
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, Download, Eye, Send } from "lucide-react";
import { mockLetters } from "@/mock/letterData";
import type { CommitteeFormationLetter } from "@/types/letter";
import LetterUpload from "./LetterUpload";
import LetterViewer from "./LetterViewer";

const LetterManagement = () => {
  const [letters, setLetters] = useState<CommitteeFormationLetter[]>(mockLetters);
  const [selectedLetter, setSelectedLetter] = useState<CommitteeFormationLetter | null>(null);
  const [showViewer, setShowViewer] = useState(false);
  const { toast } = useToast();

  const handleDistribute = (letter: CommitteeFormationLetter) => {
    toast({
      title: "Letter Distribution",
      description: `Distribution initiated for letter ${letter.referenceNumber}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Committee Formation Letters</h2>
        <LetterUpload onUpload={(letter) => setLetters([...letters, letter])} />
      </div>

      <div className="grid gap-4">
        {letters.map((letter) => (
          <Card key={letter.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{letter.referenceNumber}</h3>
                <p className="text-sm text-gray-500">{letter.purpose}</p>
                <p className="text-xs text-gray-400">
                  Issued: {new Date(letter.issueDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedLetter(letter);
                    setShowViewer(true);
                  }}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDistribute(letter)}
                >
                  <Send className="h-4 w-4 mr-1" />
                  Distribute
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {showViewer && selectedLetter && (
        <LetterViewer
          letter={selectedLetter}
          onClose={() => {
            setShowViewer(false);
            setSelectedLetter(null);
          }}
        />
      )}
    </div>
  );
};

export default LetterManagement;
