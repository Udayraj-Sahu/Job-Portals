"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";

export function ContactButtons({
	email = "hr@company.com",
	phone = "+1234567890",
	size = "default",
	className = "",
}) {
	const handleEmail = () => {
		window.location.href = `mailto:${email}`;
	};

	const handleCall = () => {
		window.location.href = `tel:${phone}`;
	};

	const handleWhatsApp = () => {
		const phoneNumber = phone.replace(/[^0-9]/g, "");
		window.open(`https://wa.me/${phoneNumber}`, "_blank");
	};

	const buttonVariants = {
		hidden: { opacity: 0, y: 10 },
		show: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.3, ease: "easeOut" },
		},
	};

	return (
		<motion.div
			initial="hidden"
			animate="show"
			transition={{ staggerChildren: 0.1 }}
			className={`flex gap-2 ${className}`}>
			{/* Email Button */}
			<motion.div
				variants={buttonVariants}
				whileHover={{ scale: 1.1 }}
				whileTap={{ scale: 0.95 }}>
				<Button
					size={size === "sm" ? "sm" : "default"}
					variant="outline"
					onClick={handleEmail}
					className="rounded-lg border-gray-300 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm"
					title="Send Email">
					<Mail className="w-4 h-4" />
				</Button>
			</motion.div>

			{/* Call Button */}
			<motion.div
				variants={buttonVariants}
				whileHover={{ scale: 1.1 }}
				whileTap={{ scale: 0.95 }}>
				<Button
					size={size === "sm" ? "sm" : "default"}
					variant="outline"
					onClick={handleCall}
					className="rounded-lg border-gray-300 hover:bg-green-600 hover:text-white hover:border-green-600 transition-all shadow-sm"
					title="Call">
					<Phone className="w-4 h-4" />
				</Button>
			</motion.div>

			{/* WhatsApp Button */}
			<motion.div
				variants={buttonVariants}
				whileHover={{ scale: 1.1 }}
				whileTap={{ scale: 0.95 }}>
				<Button
					size={size === "sm" ? "sm" : "default"}
					variant="outline"
					onClick={handleWhatsApp}
					className="rounded-lg border-gray-300 hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-all shadow-sm"
					title="WhatsApp">
					<MessageCircle className="w-4 h-4" />
				</Button>
			</motion.div>
		</motion.div>
	);
}
