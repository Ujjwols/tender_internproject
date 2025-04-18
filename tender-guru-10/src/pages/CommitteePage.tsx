
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CommitteeSearch from '@/components/committee/search/CommitteeSearch';
import CommitteeForm from '@/components/committee/CommitteeForm';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Committee } from '@/types/committee';

const CommitteePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isCreateRoute = location.pathname === '/committee/create';

  const handleCreateCommittee = (committee: Committee) => {
    toast({
      title: "Committee Created",
      description: `${committee.name} has been successfully created.`,
    });
    navigate('/committee');
  };

  if (isCreateRoute) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          <div className="max-w-4xl mx-auto">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/committee')}
              className="mb-4 -ml-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Committee List
            </Button>
            
            <Card className="overflow-hidden bg-white/95 backdrop-blur-sm shadow-xl ring-1 ring-gray-900/5">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-50" />
                <div className="relative p-4 sm:p-6 lg:p-8">
                  <CommitteeForm 
                    onClose={() => navigate('/committee')}
                    onCreateCommittee={handleCreateCommittee}
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <Card className="overflow-hidden bg-white/95 backdrop-blur-sm shadow-xl ring-1 ring-gray-900/5">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-50" />
            <div className="relative p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Committee Management</h1>
                  <p className="mt-1 text-sm text-gray-500">Create and manage your committees</p>
                </div>
                <Button 
                  onClick={() => navigate('/committee/create')}
                  className="flex items-center gap-2 w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <UserPlus className="h-4 w-4" />
                  Create Committee
                </Button>
              </div>
              
              <div className="space-y-8">
                <div className="mt-6">
                  <CommitteeSearch />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CommitteePage;
