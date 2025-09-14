
import Settings from "./settings-component"
import { getUserProfileAction, getOrganizationAction } from "@/app/actions/user";
import { updateProfileAction, updateOrganizationAction, changePasswordAction } from "@/app/actions/user";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';

export default async function SettingsPage(){
    // Get session data to ensure user is authenticated
    const sessionData = await getSession();
    
    if (!sessionData || !sessionData.user) {
        redirect('/signin');
    }

    try {
        // Fetch user and organization data using server actions
        const [userResult, organizationResult] = await Promise.all([
            getUserProfileAction().catch(() => ({ success: false, data: null })),
            getOrganizationAction().catch(() => ({ success: false, data: null })),
        ]);

        const user = userResult.success ? userResult.data : null;
        const organization = organizationResult.success ? organizationResult.data : null;

        return (
            <>
                <Settings 
                    user={user}
                    organization={organization}
                    updateProfileAction={updateProfileAction}
                    updateOrganizationAction={updateOrganizationAction}
                    changePasswordAction={changePasswordAction}
                />
            </>
        )
    } catch (error) {
        console.error('Failed to fetch settings data:', error);
        
        // Return component with null data on error
        return (
            <>
                <Settings 
                    user={null}
                    organization={null}
                    updateProfileAction={updateProfileAction}
                    updateOrganizationAction={updateOrganizationAction}
                    changePasswordAction={changePasswordAction}
                />
            </>
        )
    }
}
