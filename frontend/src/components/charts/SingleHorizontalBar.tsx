

function SingleHorizontalBar({ precentage }: { precentage: number }) {
    return (
        <div className="relative bg-neutral-300 h-2 rounded-full overflow-hidden">
            <div
                className="absolute bg-red-400 h-2"
                style={{ width: `${precentage}%` }}
            ></div>
        </div>
    );
}

export default SingleHorizontalBar;