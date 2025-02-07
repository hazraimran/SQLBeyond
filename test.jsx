import React from "react";
import { motion } from "framer-motion";

const SageCharacter = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            {/* SAGE Avatar */}
            <motion.div
                className="relative flex items-center justify-center w-32 h-32 bg-blue-500 rounded-full shadow-lg"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
            >
                <div className="absolute top-0 left-0 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
                <div className="text-white text-xl font-bold">SAGE</div>
            </motion.div>
            {/* Speech Bubble */}
            <motion.div
                className="mt-6 px-4 py-2 bg-white text-gray-800 rounded-lg shadow-md w-64 text-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                "Need help? I'm here to guide you through SQL!"
            </motion.div>

            {/* Buttons */}
            <div className="mt-6 flex space-x-4">
                <button className="px-4 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600">
                    Ask SAGE
                </button>
                <button className="px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600">
                    Hints Log
                </button>
            </div>
        </div>

    );
};

export default SageCharacter;