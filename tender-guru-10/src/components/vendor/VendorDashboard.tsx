
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import VendorRegistrationForm from "./VendorRegistrationForm";
import VendorBidHistory from "./VendorBidHistory";
import VendorPerformance from "./VendorPerformance";
import { mockVendors, mockBids } from "@/utils/vendorUtils";

const VendorDashboard = () => {
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(mockVendors[0]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Partner/Bidder Management</h1>
        <Button onClick={() => setShowRegistrationForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Registration
        </Button>
      </div>

      <Card className="p-6">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile & Documents</TabsTrigger>
            <TabsTrigger value="bids">Bid History</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ScrollArea className="h-[60vh]">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold">Company Details</h3>
                    <p>Name: {selectedVendor.companyName}</p>
                    <p>Registration: {selectedVendor.registrationNumber}</p>
                    <p>Status: {selectedVendor.status}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Contact Information</h3>
                    <p>Email: {selectedVendor.email}</p>
                    <p>Phone: {selectedVendor.phone}</p>
                    <p>Address: {selectedVendor.address}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">Categories</h3>
                  <div className="flex gap-2 flex-wrap">
                    {selectedVendor.category.map((cat, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="bids">
            <VendorBidHistory vendorId={selectedVendor.id} bids={mockBids} />
          </TabsContent>

          <TabsContent value="performance">
            <VendorPerformance vendor={selectedVendor} />
          </TabsContent>
        </Tabs>
      </Card>

      {showRegistrationForm && (
        <VendorRegistrationForm onClose={() => setShowRegistrationForm(false)} />
      )}
    </div>
  );
};

export default VendorDashboard;

