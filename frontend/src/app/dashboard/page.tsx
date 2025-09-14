import { getSubscriptionsAction, getPlansAction } from "@/app/actions/subscriptions";
import { getInvoicesByOrganizationAction } from "@/app/actions/invoices";
import DashboardComponent from "./Dashboard"
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from "@/auth";
import { getSession } from '@/lib/session';

// Force dynamic rendering to avoid static generation errors with cookies
export const dynamic = 'force-dynamic';
interface DashboardData {
  subscriptions: any[];
  plans: any[];
  invoices: any[];
}

export default async function Dashboard() {
  // Get session data to extract organization ID
  const sessionData = await getSession();
  
  if (!sessionData || !sessionData.user) {
    redirect('/signin');
  }

  // Use the organization ID from the logged-in user's session
  const organizationId = sessionData.organization?.id;

  if (!organizationId) {
    console.warn('No organization ID found in session');
  }

  try {
    // Call all server actions in parallel with the user's organization ID
    const [subscriptionsResult, plansResult, invoicesResult] = await Promise.all([
      organizationId 
        ? getSubscriptionsAction(organizationId).catch(() => ({ success: false, data: [] }))
        : Promise.resolve({ success: false, data: [] }),
      getPlansAction().catch(() => ({ success: false, data: [] })),
      organizationId 
        ? getInvoicesByOrganizationAction(organizationId).catch(() => ({ success: false, data: [] }))
        : Promise.resolve({ success: false, data: [] }),
    ]);
    console.log(subscriptionsResult, plansResult, invoicesResult);

    const dashboardData: DashboardData = {
      subscriptions: subscriptionsResult.success ? subscriptionsResult.data || [] : [],
      plans: plansResult.success ? plansResult.data || [] : [],
      invoices: invoicesResult.success ? invoicesResult.data || [] : [],
    };

    return (
      <div>
        <DashboardComponent 
          subscriptions={dashboardData.subscriptions}
          plans={dashboardData.plans}
          invoices={dashboardData.invoices}
        />
      </div>
    );
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    
    // Return component with empty data on error
    return (
      <div>
        <DashboardComponent 
          subscriptions={[]}
          plans={[]}
          invoices={[]}
        />
      </div>
    );
  }
}