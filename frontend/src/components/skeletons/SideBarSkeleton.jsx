import React from "react";
import { HiUsers } from "react-icons/hi2";

const SidebarSkeleton = () => {
    // Create 8 skeleton items
    const skeletonContacts = Array(7).fill(null);

    return (
        <aside className="h-full lg:w-80 md:w-60 border-r border-base-300 flex flex-col transition-all duration-200">
            {/* Header */}
            <div className="w-full p-3">
                <div className="flex items-center gap-2 animate-pulse select-none">
                    <HiUsers className='text-2xl md:m-0' />
                    <span className="font-medium text-2xl">Your friends</span>
                </div>

                <div className="skeleton h-4 w-32 mt-3" />
            </div>

            {/* Skeleton Contacts */}
            <div className="overflow-y-auto w-full">
                {skeletonContacts.map((_, idx) => (
                    <div key={idx} className="w-full p-3 flex items-center gap-3">
                        {/* Avatar skeleton */}
                        <div className="relative lg:mx-0">
                            <div className="skeleton size-12 rounded-full" />
                        </div>

                        {/* User info skeleton - only visible on larger screens */}
                        <div className="block text-left min-w-0 flex-1">
                            <div className="skeleton h-4 w-32 mb-2" />
                            <div className="skeleton h-3 w-16" />
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
};

export default SidebarSkeleton;