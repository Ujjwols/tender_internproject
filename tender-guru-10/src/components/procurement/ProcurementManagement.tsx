
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import type { BidSecurity, DocumentFee, PreBidMeeting, Clarification } from "@/types/procurement";
import BidSecurityTab from "./tabs/BidSecurityTab";
import DocumentFeesTab from "./tabs/DocumentFeesTab";
import PreBidMeetingsTab from "./tabs/PreBidMeetingsTab";
import ClarificationsTab from "./tabs/ClarificationsTab";
import { useMockDb } from "@/hooks/useMockDb";

const ProcurementManagement = ({ tenderId }: { tenderId: number }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("bid-security");
  
  const { data: bidSecurities, update: updateBidSecurity } = useMockDb<BidSecurity>('bidSecurities');
  const { data: documentFees, update: updateDocumentFee } = useMockDb<DocumentFee>('documentFees');
  const { data: preBidMeetings, update: updatePreBidMeeting } = useMockDb<PreBidMeeting>('preBidMeetings');
  const { data: clarifications, update: updateClarification } = useMockDb<Clarification>('clarifications');

  useEffect(() => {
    console.log("Loading procurement data for tender:", tenderId);
  }, [tenderId]);

  const handleUpdate = (type: string, data: any) => {
    switch (type) {
      case 'bid-security':
        updateBidSecurity(data.id, data);
        break;
      case 'document-fees':
        updateDocumentFee(data.id, data);
        break;
      case 'pre-bid':
        updatePreBidMeeting(data.id, data);
        break;
      case 'clarifications':
        updateClarification(data.id, data);
        break;
    }

    toast({
      title: "Updated Successfully",
      description: `${type.replace('-', ' ')} has been updated.`,
    });
  };

  return (
    <Card className="p-3 sm:p-4 md:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Procurement Management</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-0">
          <TabsTrigger value="bid-security">Bid Security</TabsTrigger>
          <TabsTrigger value="document-fees">Doc Fees</TabsTrigger>
          <TabsTrigger value="pre-bid">Pre-Bid</TabsTrigger>
          <TabsTrigger value="clarifications">Clarifications</TabsTrigger>
        </TabsList>

        <div className="mt-4 sm:mt-6">
          <TabsContent value="bid-security">
            <BidSecurityTab
              tenderId={tenderId}
              bidSecurities={bidSecurities}
              onUpdate={(data) => handleUpdate('bid-security', data)}
            />
          </TabsContent>

          <TabsContent value="document-fees">
            <DocumentFeesTab
              tenderId={tenderId}
              documentFees={documentFees}
              onUpdate={(data) => handleUpdate('document-fees', data)}
            />
          </TabsContent>

          <TabsContent value="pre-bid">
            <PreBidMeetingsTab
              tenderId={tenderId}
              meetings={preBidMeetings}
              onUpdate={(data) => handleUpdate('pre-bid', data)}
            />
          </TabsContent>

          <TabsContent value="clarifications">
            <ClarificationsTab
              tenderId={tenderId}
              clarifications={clarifications}
              onUpdate={(data) => handleUpdate('clarifications', data)}
            />
          </TabsContent>
        </div>
      </Tabs>
    </Card>
  );
};

export default ProcurementManagement;
