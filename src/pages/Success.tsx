import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, Clock, AlertCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { format } from 'date-fns';
import { toast } from 'sonner';

// TODO: Import your new service API here

interface TransactionData {
  status: 'pending' | 'success' | 'failed' | 'ready';
  service: string;
  provider: string;
  amount: number;
  recipient: string;
  mobileNumber?: string;
  transactionHash: string;
  timestamp?: string;
  plan?: string;
  network?: string;
  planId?: string;
  networkId?: string;
  cableId?: string;
  smartCardNumber?: string;
  meterNumber?: string;
  serviceProcessed?: boolean;
}

export default function Success() {
  const location = useLocation();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState<TransactionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const state = location.state as TransactionData;
    const params = new URLSearchParams(location.search);
    
    if (state) {
      const normalizedStatus = state.serviceProcessed ? 'success' : state.status === 'success' ? 'ready' : state.status;
      const txData: TransactionData = {
        ...state,
        status: normalizedStatus as 'pending' | 'success' | 'failed' | 'ready',
        timestamp: state.timestamp || new Date().toISOString(),
      };
      setTransaction(txData);
      setIsLoading(false);
    } else if (params.toString()) {
      const txData: TransactionData = {
        status: (params.get('status') as any) || 'pending',
        service: params.get('service') || '',
        provider: params.get('provider') || '',
        amount: parseFloat(params.get('amount') || '0'),
        recipient: params.get('recipient') || '',
        mobileNumber: params.get('mobileNumber') || undefined,
        transactionHash: params.get('transactionHash') || '',
        timestamp: params.get('timestamp') || new Date().toISOString(),
        plan: params.get('plan') || undefined,
        network: params.get('network') || undefined,
        planId: params.get('planId') || undefined,
        networkId: params.get('networkId') || undefined,
        cableId: params.get('cableId') || undefined,
        smartCardNumber: params.get('smartCardNumber') || undefined,
        meterNumber: params.get('meterNumber') || undefined,
        serviceProcessed: params.get('serviceProcessed') === 'true',
      };
      setTransaction(txData);
      setIsLoading(false);
    } else {
      navigate('/');
    }
  }, [location, navigate]);

  const handleProcessService = async () => {
    if (!transaction) return;
    
    setIsProcessing(true);
    
    try {
      // TODO: Add your new service API call here
      // Example:
      // const serviceData = {
      //   service: transaction.service.toLowerCase(),
      //   provider: transaction.provider,
      //   network: transaction.networkId || transaction.network,
      //   plan: transaction.planId || transaction.plan,
      //   phone: transaction.mobileNumber || transaction.recipient,
      //   amount: transaction.amount.toString(),
      //   reference: transaction.transactionHash,
      // };
      // 
      // const result = await yourNewServiceAPI(serviceData);
      // 
      // if (result.success) {
      //   setTransaction(prev => prev ? {
      //     ...prev,
      //     status: 'success',
      //     serviceProcessed: true
      //   } : null);
      //   toast.success('Service processed successfully!');
      // } else {
      //   throw new Error(result.message);
      // }
      
      toast.info('Service API not implemented yet');
    } catch (error: any) {
      console.error('Service processing error:', error);
      toast.error(error.message || 'Failed to process service. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

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
      ready: {
        icon: <CheckCircle2 className="h-12 w-12 text-blue-500" />,
        title: 'Transaction Confirmed',
        description: 'Your transaction is confirmed on the blockchain. Please complete the service activation.',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-800',
      },
      success: {
        icon: <CheckCircle2 className="h-12 w-12 text-green-500" />,
        title: 'Service Activated',
        description: 'Your service has been activated successfully!',
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
    };
    
    const currentStatus = statusConfig[status] || statusConfig.pending;

    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className={`p-4 rounded-full ${currentStatus.bgColor}`}>
            {currentStatus.icon}
          </div>
          <h2 className={`text-2xl font-bold ${currentStatus.textColor}`}>
            {currentStatus.title}
          </h2>
          <p className="text-center text-gray-600">{currentStatus.description}</p>
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
                <p className="font-medium capitalize">
                  {status === 'ready' ? 'Ready to Process' : status}
                </p>
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
          {status === 'ready' && (
            <Button 
              onClick={handleProcessService}
              disabled={isProcessing}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : 'Activate Service'}
            </Button>
          )}
          
          <Button
            variant="outline"
            onClick={() => navigate('/')}
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            {transaction?.status === 'ready' ? 'Complete Your Order' : 'Transaction Status'}
          </h1>
          <p className="mt-2 text-purple-200">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        
        <Card className="w-full max-w-2xl mx-auto bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-6">
            {renderStatus()}
          </CardContent>
        </Card>
        
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
        </div>
      </div>
      
      <style>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
