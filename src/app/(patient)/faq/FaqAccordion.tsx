"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

interface FaqItem {
  question: string;
  answer: string;
}

function FaqItemComponent({ question, answer }: FaqItem) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-bg-light transition-colors"
      >
        <span className="font-medium text-text-dark pr-4">{question}</span>
        {isOpen ? (
          <ChevronUp size={20} className="text-primary shrink-0" />
        ) : (
          <ChevronDown size={20} className="text-text-secondary shrink-0" />
        )}
      </button>
      {isOpen && (
        <CardContent className="px-6 pb-4 pt-0">
          <p className="text-sm text-text-secondary leading-relaxed">{answer}</p>
        </CardContent>
      )}
    </Card>
  );
}

export function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  return (
    <div className="space-y-3">
      {faqs.map((faq) => (
        <FaqItemComponent key={faq.question} question={faq.question} answer={faq.answer} />
      ))}
    </div>
  );
}
