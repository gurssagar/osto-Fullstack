import { getInvoicesByOrganizationAction } from "@/app/actions/invoices";
import InvoicesComponent from "./invoice-data"
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';

export default async function Invoices(){
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
        // Fetch invoices data using server action
        const invoicesResult = organizationId 
            ? await getInvoicesByOrganizationAction(organizationId).catch(() => ({ success: false, data: [] }))
            : { success: false, data: [] };
        
        const invoices = invoicesResult.success ? invoicesResult.data || [] : [];

        return (
            <>
                <InvoicesComponent invoices={invoices} />
            </>
        )
    } catch (error) {
        console.error('Failed to fetch invoices data:', error);
        
        // Return component with empty data on error
        return (
            <>
                <InvoicesComponent invoices={[]} />
            </>
        )
    }
}