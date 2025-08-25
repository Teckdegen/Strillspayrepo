import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, Clock, AlertCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { format } from 'date-fns';

interface TransactionData {
  status: 'pending' | 'success' | 'failed';
  service: string;
  provider: string;
  amount: number;
  recipient: string;
  transactionHash: string;
  timestamp?: string;
  plan?: string;
  network?: string;
}

export default function Success() {
  const location = useLocation();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState<TransactionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get transaction data from location state or query params
    const state = location.state as TransactionData;
    const params = new URLSearchParams(location.search);
    
    if (state) {
      setTransaction({
        ...state,
        timestamp: state.timestamp || new Date().toISOString(),
      });
      setIsLoading(false);
    } else if (params.toString()) {
      // Handle direct URL access with query params
      const txData: TransactionData = {
        status: (params.get('status') as any) || 'pending',
        service: params.get('service') || '',
        provider: params.get('provider') || '',
        amount: parseFloat(params.get('amount') || '0'),
        recipient: params.get('recipient') || '',
        transactionHash: params.get('transactionHash') || '',
        timestamp: params.get('timestamp') || new Date().toISOString(),
        plan: params.get('plan') || undefined,
        network: params.get('network') || undefined,
      };
      setTransaction(txData);
      setIsLoading(false);
    } else {
      // No transaction data found, redirect to home
      navigate('/');
    }
  }, [location, navigate]);

  const renderStatus = () => {
    if (isLoading || !transaction) {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Loading transaction details...</p>
        </div>
      );
    }

    const { status, service, provider, amount, recipient, transactionHash, timestamp, plan, network } = transaction;

    const statusConfig = {
      pending: {
        icon: <Clock className="h-12 w-12 text-yellow-500" />,
        title: 'Transaction Pending',
        description: 'Your transaction is being processed. This may take a few moments.',
        bgColor: 'bg-yellow-50',
        textColor: 'text-yellow-800',
      },
      success: {
        icon: <CheckCircle2 className="h-12 w-12 text-green-500" />,
        title: 'Transaction Successful',
        description: 'Your transaction has been completed successfully!',
        bgColor: 'bg-green-50',
        textColor: 'text-green-800',
      },
      failed: {
        icon: <XCircle className="h-12 w-12 text-red-500" />,
        title: 'Transaction Failed',
        description: 'There was an issue processing your transaction.',
        bgColor: 'bg-red-50',
        textColor: 'text-red-800',
      },
    }[status];

    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className={`p-4 rounded-full ${statusConfig.bgColor}`}>
            {statusConfig.icon}
          </div>
          <h2 className={`text-2xl font-bold ${statusConfig.textColor}`}>
            {statusConfig.title}
          </h2>
          <p className="text-center text-gray-600">{statusConfig.description}</p>
        </div>

        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg">Transaction Details</CardTitle>
            <CardDescription>Reference: {transactionHash.substring(0, 16)}...</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Service</p>
                <p className="font-medium capitalize">{service}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Provider</p>
                <p className="font-medium">{provider}</p>
              </div>
              {plan && (
                <div>
                  <p className="text-sm text-gray-500">Plan</p>
                  <p className="font-medium">{plan}</p>
                </div>
              )}
              {network && (
                <div>
                  <p className="text-sm text-gray-500">Network</p>
                  <p className="font-medium">{network}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500">Amount</p>
                <p className="font-medium">₦{amount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Recipient</p>
                <p className="font-medium">{recipient}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">
                  {timestamp ? format(new Date(timestamp), 'PPpp') : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium capitalize">{status}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500 mb-2">Transaction Hash</p>
              <div className="flex items-center space-x-2">
                <code className="text-sm bg-gray-100 p-2 rounded-md font-mono break-all">
                  {transactionHash}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(transactionHash)}
                >
                  Copy
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            variant="outline"
            onClick={() => {
              // Clear any sensitive data before navigating
              window.history.replaceState({}, document.title);
              navigate('/');
            }}
          >
            Back to Home
          </Button>
          {status === 'success' && (
            <Button onClick={() => window.print()}>
              Print Receipt
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Transaction Status</h1>
          <p className="mt-2 text-gray-600">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        
        <Card className="w-full max-w-2xl mx-auto">
          <CardContent className="p-6">
            {renderStatus()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
