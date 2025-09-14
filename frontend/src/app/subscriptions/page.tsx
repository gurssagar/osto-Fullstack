
import { getSubscriptionsAction, getPlansAction } from "@/app/actions/subscriptions";
import SubscriptionComponents from "./subscriptionsComponent"
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';

// Force dynamic rendering to avoid static generation errors with cookies
export const dynamic = 'force-dynamic';

export default async function SubscriptionCard(){
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
        // Fetch subscriptions and plans data using server actions
        const [subscriptionsResult, plansResult] = await Promise.all([
            organizationId 
                ? getSubscriptionsAction(organizationId).catch(() => ({ success: false, data: [] }))
                : Promise.resolve({ success: false, data: [] }),
            getPlansAction().catch(() => ({ success: false, data: [] })),
        ]);

        const subscriptions = subscriptionsResult.success ? subscriptionsResult.data || [] : [];
        const plans = plansResult.success ? plansResult.data || [] : [];

        return (
            <>
                <SubscriptionComponents subscriptions={subscriptions} plans={plans} />
            </>
        )
    } catch (error) {
        console.error('Failed to fetch subscriptions data:', error);
        
        // Return component with empty data on error
        return (
            <>
                <SubscriptionComponents subscriptions={[]} plans={[]} />
            </>
        )
    }
}
