
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "@/types/auth";
import DashboardContent from "@/components/home/DashboardContent";
import TenderList from "@/components/tender/TenderList";
import ProcurementManagement from "@/components/procurement/ProcurementManagement";
import BidEvaluationModule from "@/components/evaluation/BidEvaluationModule";
import ClarificationManager from "@/components/procurement/ClarificationManager";
import ComplaintManagement from "@/components/complaint/ComplaintManagement";
import EmployeeManagement from "@/components/employee/EmployeeManagement";
import CommitteeSearch from "@/components/committee/search/CommitteeSearch";

interface RoleBasedTabsProps {
  user: User | null;
  defaultTab: string;
}

const RoleBasedTabs = ({ user, defaultTab }: RoleBasedTabsProps) => {
  if (!user) return null;

  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="w-full justify-start mb-6 bg-white/50 backdrop-blur-sm p-1 rounded-lg overflow-x-auto flex-nowrap">
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="tenders">Tenders</TabsTrigger>
        <TabsTrigger value="committees">Committees</TabsTrigger>
        <TabsTrigger value="procurement">Procurement</TabsTrigger>
        <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
        <TabsTrigger value="clarifications">Clarifications</TabsTrigger>
        <TabsTrigger value="complaints">Complaints</TabsTrigger>
        <TabsTrigger value="employees">Employees</TabsTrigger>
      </TabsList>

      <TabsContent value="dashboard" className="bg-white/50 backdrop-blur-sm rounded-xl shadow-sm p-6">
        <DashboardContent />
      </TabsContent>

      <TabsContent value="tenders">
        <div className="bg-white/50 backdrop-blur-sm rounded-xl shadow-sm p-6">
          <h1 className="text-3xl font-bold mb-6">Tender Management</h1>
          <TenderList />
        </div>
      </TabsContent>

      <TabsContent value="committees">
        <div className="bg-white/50 backdrop-blur-sm rounded-xl shadow-sm p-6">
          <h1 className="text-3xl font-bold mb-6">Committee Management</h1>
          <CommitteeSearch />
        </div>
      </TabsContent>

      <TabsContent value="procurement">
        <div className="bg-white/50 backdrop-blur-sm rounded-xl shadow-sm p-6">
          <h1 className="text-3xl font-bold mb-6">Procurement Management</h1>
          <ProcurementManagement tenderId={1} />
        </div>
      </TabsContent>

      <TabsContent value="evaluation">
        <div className="bg-white/50 backdrop-blur-sm rounded-xl shadow-sm p-6">
          <h1 className="text-3xl font-bold mb-6">Bid Evaluation</h1>
          <BidEvaluationModule />
        </div>
      </TabsContent>

      <TabsContent value="clarifications">
        <div className="bg-white/50 backdrop-blur-sm rounded-xl shadow-sm p-6">
          <h1 className="text-3xl font-bold mb-6">Clarifications Management</h1>
          <ClarificationManager 
            tenderId={1}
            clarifications={[]}
            onUpdate={() => {}}
          />
        </div>
      </TabsContent>

      <TabsContent value="complaints">
        <div className="bg-white/50 backdrop-blur-sm rounded-xl shadow-sm p-6">
          <ComplaintManagement />
        </div>
      </TabsContent>

      <TabsContent value="employees">
        <div className="bg-white/50 backdrop-blur-sm rounded-xl shadow-sm p-6">
          <EmployeeManagement />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default RoleBasedTabs;
