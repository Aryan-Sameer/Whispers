import React from 'react'

const FriendsSkeleton = () => {
    return (
        <div>
            <div className="skeleton h-12 mt-6 mx-auto rounded-full w-full sm:w-[70%] md:w-[50%] lg:w-[40%] xl:w-[30%]" />
            <h1 className='text-center text-2xl font-bold mt-4 animate-pulse text-slate-500'>People you might know</h1>
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
