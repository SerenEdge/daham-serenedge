import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

export default function NotFound() {
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-secondary px-6">
            <div className="flex flex-col items-center gap-8 text-center">
                {/* Large 404 Display */}
                <h1 className="text-[150px] md:text-[200px] font-bold leading-none text-tertiary/20 select-none">
                    404
                </h1>

                <div className="flex flex-col gap-4">
                    <h2 className="text-3xl md:text-4xl font-medium">Page Not Found</h2>
                    <p className="text-lg text-tertiary max-w-md">
                        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                    </p>
                </div>

                <Link
                    href="/"
                    className="group flex items-center gap-2 mt-8 px-8 py-3 bg-white text-black rounded-full font-medium transition-all hover:bg-gray-200"
                >
                    <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
