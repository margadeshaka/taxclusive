"use client";

import { Phone, MessageCircle } from "lucide-react";
import { useState } from "react";

export default function ContactButtons() {
  const [isExpanded, setIsExpanded] = useState(false);
  const phoneNumber = "+919782799042"; // Replace with your actual phone number
  const whatsappMessage = encodeURIComponent("Hello, I'd like to inquire about your services.");

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-3">
      {isExpanded && (
        <>
          <a
            href={`tel:${phoneNumber}`}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all duration-300 relative group"
            aria-label="Call us"
          >
            <Phone className="h-5 w-5" />
            <span className="absolute right-full mr-3 px-2 py-1 rounded bg-background border border-border text-sm font-medium shadow-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              Voice Call
            </span>
          </a>

          <a
            href={`https://wa.me/${phoneNumber.replace(/\+/g, "")}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-12 h-12 rounded-full bg-[#25D366] text-white shadow-lg hover:bg-[#22c55e] transition-all duration-300 relative group"
            aria-label="Contact us on WhatsApp"
          >
            <MessageCircle className="h-5 w-5" />
            <span className="absolute right-full mr-3 px-2 py-1 rounded bg-background border border-border text-sm font-medium shadow-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              WhatsApp
            </span>
          </a>
        </>
      )}

      <button
        onClick={toggleExpand}
        className={`flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-300 ${
          isExpanded
            ? "bg-muted text-muted-foreground rotate-45"
            : "bg-primary text-primary-foreground ethnic-pulse"
        }`}
        aria-label={isExpanded ? "Close contact options" : "Open contact options"}
      >
        <span className={`transition-transform duration-300 ${isExpanded ? "rotate-45" : ""}`}>
          {isExpanded ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
          )}
        </span>
      </button>
    </div>
  );
}
