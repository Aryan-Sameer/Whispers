import React from 'react'

const FriendsSkeleton = () => {
    return (
        <div>
            <h1 className='text-center text-xl font-bold my-4 animate-pulse text-slate-500'>People you might know</h1>
            <div className='grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mx-auto my-8 sm:w-[80%] lg:w-3/4 gap-2 px-4'>
                {[...Array(9)].map((_, i) => (
                    <div key={i} className="rounded-sm gap-2">
                        <div className="skeleton h-32 w-full"></div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default FriendsSkeleton
