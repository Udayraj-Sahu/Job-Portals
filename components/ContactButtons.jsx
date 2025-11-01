"use client";

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

	return (
		<div className={`flex gap-2 ${className}`}>
			<Button
				size={size === "sm" ? "sm" : "default"}
				variant="outline"
				onClick={handleEmail}
				className="rounded-lg hover:bg-[#2563EB] hover:text-white hover:border-[#2563EB] transition-colors"
				title="Send Email">
				<Mail className="w-4 h-4" />
			</Button>
			<Button
				size={size === "sm" ? "sm" : "default"}
				variant="outline"
				onClick={handleCall}
				className="rounded-lg hover:bg-[#16A34A] hover:text-white hover:border-[#16A34A] transition-colors"
				title="Call">
				<Phone className="w-4 h-4" />
			</Button>
			<Button
				size={size === "sm" ? "sm" : "default"}
				variant="outline"
				onClick={handleWhatsApp}
				className="rounded-lg hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-colors"
				title="WhatsApp">
				<MessageCircle className="w-4 h-4" />
			</Button>
		</div>
	);
}
