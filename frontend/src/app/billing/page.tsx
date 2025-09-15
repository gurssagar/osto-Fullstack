import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { getPaymentMethodsAction, getBillingAddressAction, getBillingHistoryAction, addPaymentMethodAction, updatePaymentMethodAction, deletePaymentMethodAction, updateBillingAddressAction } from '@/app/actions/billing';
import BillingTabs from "./Billing";

export const dynamic = 'force-dynamic';

export default async function Billing() {
  const session = await getSession();
  
  if (!session?.user) {
    redirect('/login');
  }

  const organizationId = session.organization?.id;
  if (!organizationId) {
    redirect('/dashboard');
  }

  // Fetch billing data
  const [paymentMethodsResult, billingAddressResult, billingHistoryResult] = await Promise.all([
    getPaymentMethodsAction(),
    getBillingAddressAction(),
    getBillingHistoryAction()
  ]);

  const paymentMethods = paymentMethodsResult.success ? paymentMethodsResult.data : [];
  const billingAddress = billingAddressResult.success ? billingAddressResult.data : null;
  const billingHistory = billingHistoryResult.success ? billingHistoryResult.data : [];

  return (
    <div>
      <BillingTabs 
        paymentMethods={paymentMethods}
        billingAddress={billingAddress}
        billingHistory={billingHistory}
        organizationId={organizationId}
        addPaymentMethodAction={addPaymentMethodAction}
        updatePaymentMethodAction={updatePaymentMethodAction}
        deletePaymentMethodAction={deletePaymentMethodAction}
        updateBillingAddressAction={updateBillingAddressAction}
      />
    </div>
  );
}