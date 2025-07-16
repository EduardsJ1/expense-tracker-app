type SkeletonProps = {
    variant?:'circular'|'rectangular',
    width?: string|number,
    height?: string|number,
    className?:string,
}




function LoadingSkeleton({
    variant = 'rectangular',
    width='100%',
    height='1rem',
    className='',
}:SkeletonProps){


    return(
        <div className="animate-pulse">
            <div
                className={`bg-neutral-400 ${
                    variant === 'circular' ? 'rounded-full' : 'rounded'
                } ${className}`}
                style={{ width, height }}
            />
        </div>
    )
}

export default LoadingSkeleton;