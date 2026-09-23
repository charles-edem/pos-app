import {
    useEffect,
    useRef,
    useState,
    type ReactNode,
    type MouseEvent,
    type TouchEvent,
} from "react";

type SwipeThroughProps<T> = {
    items: T[];
    renderItem: (item: T) => ReactNode;
    columns?: number;
    rows?: number;
};

export default function SwipeThrough<T>({
    items,
    renderItem,
    columns = 4,
    rows = 2,
}: SwipeThroughProps<T>) {
    const itemsPerPage = columns * rows;
    const totalPages = Math.ceil(items.length / itemsPerPage);
    const [currentPage, setCurrentPage] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState(0);
    const startX = useRef(0);
    const getClientX = (
        event: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>
    ) => {
        if ("touches" in event) {
            return event.touches[0]?.clientX ?? 0;
        }

        return event.clientX;
    };
    const goToPage = (page: number) => {
        if (page < 0 || page >= totalPages) return;

        setCurrentPage(page);
        setDragOffset(0);
    };
    const changePage = (direction: "next" | "previous") => {
        setCurrentPage((page) => {
            if (direction === "next") {
                return Math.min(page + 1, totalPages - 1);
            }

            return Math.max(page - 1, 0);
        });

        setDragOffset(0);
    };
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement;

            if (
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.tagName === "SELECT" ||
                target.isContentEditable
            ) {
                return;
            }

            if (event.key === "ArrowLeft") {
                event.preventDefault();
                changePage("previous");
            }

            if (event.key === "ArrowRight") {
                event.preventDefault();
                changePage("next");
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    });
    const handleStart = (
        event: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>
    ) => {
        startX.current = getClientX(event);
        setIsDragging(true);
    };
    const handleMove = (
        event: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>
    ) => {
        if (!isDragging) return;

        const distance = getClientX(event) - startX.current;

        if (
            (currentPage === 0 && distance > 0) ||
            (currentPage === totalPages - 1 && distance < 0)
        ) {
            setDragOffset(distance * 0.25);
            return;
        }

        setDragOffset(distance);
    };
    const handleEnd = () => {
        if (!isDragging) return;

        const threshold = 80;

        if (dragOffset < -threshold) {
            changePage("next");
        } else if (dragOffset > threshold) {
            changePage("previous");
        }

        setIsDragging(false);
        setDragOffset(0);
    };

    return (
        <div className="relative w-full">
            <div
                className="w-full overflow-hidden"
                onMouseDown={handleStart}
                onMouseMove={handleMove}
                onMouseUp={handleEnd}
                onMouseLeave={handleEnd}
                onTouchStart={handleStart}
                onTouchMove={handleMove}
                onTouchEnd={handleEnd}
            >
                <div
                    className={`flex ${
                        isDragging
                            ? ""
                            : "transition-transform duration-300 ease-out"
                    }`}
                    style={{
                        transform: `translateX(calc(-${
                            currentPage * 100
                        }% + ${dragOffset}px))`,
                    }}
                >
                    {Array.from({ length: totalPages }).map(
                        (_, pageIndex) => {
                            const pageItems = items.slice(
                                pageIndex * itemsPerPage,
                                (pageIndex + 1) * itemsPerPage
                            );

                            return (
                                <div
                                    key={pageIndex}
                                    className="grid w-full shrink-0 grid-cols-4 grid-rows-2 gap-3"
                                >
                                    {pageItems.map((item, index) => (
                                        <div
                                            key={index}
                                            className="min-w-0 select-none"
                                        >
                                            {renderItem(item)}
                                        </div>
                                    ))}
                                </div>
                            );
                        }
                    )}
                </div>
            </div>
            {totalPages > 1 && (
                <div className="mt-5 flex items-center justify-center gap-2">
                    {Array.from({ length: totalPages }).map(
                        (_, index) => {
                            const active = currentPage === index;

                            return (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => goToPage(index)}
                                    className={`flex h-8 min-w-8 cursor-pointer items-center justify-center rounded-full px-2 text-sm font-semibold transition-all duration-200 ${
                                        active
                                            ? "bg-blue-600 text-white shadow-md"
                                            : "bg-white text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                                    }`}
                                >
                                    {index + 1}
                                </button>
                            );
                        }
                    )}
                </div>
            )}
        </div>
    );
}
