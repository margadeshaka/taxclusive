"use client";

import { useMemo } from "react";
import { CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface SEOScorePanelProps {
  title: string;
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  slug: string;
  content: string;
  coverImage: string;
}

type CheckStatus = "pass" | "warn" | "fail";

interface SEOCheck {
  label: string;
  status: CheckStatus;
  message: string;
}

export function SEOScorePanel({
  title,
  metaTitle,
  metaDescription,
  focusKeyword,
  slug,
  content,
  coverImage,
}: SEOScorePanelProps) {
  const checks = useMemo(() => {
    const results: SEOCheck[] = [];
    const effectiveTitle = metaTitle || title;
    const titleLen = effectiveTitle.length;
    const descLen = metaDescription.length;
    const wordCount = content
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0).length;
    const keywordLower = focusKeyword.toLowerCase().trim();

    // 1. Title length
    let titleStatus: CheckStatus = "fail";
    if (titleLen >= 50 && titleLen <= 60) titleStatus = "pass";
    else if (titleLen >= 30 && titleLen <= 70) titleStatus = "warn";
    results.push({
      label: "Title length",
      status: titleStatus,
      message: `${titleLen}/60 characters`,
    });

    // 2. Description length
    let descStatus: CheckStatus = "fail";
    let descMessage = `${descLen}/160 characters`;
    if (!metaDescription) {
      descStatus = "warn";
      descMessage = "Missing (will use excerpt)";
    } else if (descLen >= 150 && descLen <= 160) {
      descStatus = "pass";
    } else if (descLen >= 120 && descLen <= 170) {
      descStatus = "warn";
    }
    results.push({
      label: "Description length",
      status: descStatus,
      message: descMessage,
    });

    // Keyword checks (3-6) only if keyword is set
    if (keywordLower) {
      // 3. Keyword in title
      const keywordInTitle = effectiveTitle
        .toLowerCase()
        .includes(keywordLower);
      results.push({
        label: "Keyword in title",
        status: keywordInTitle ? "pass" : "fail",
        message: keywordInTitle
          ? "Focus keyword found in title"
          : "Focus keyword not found in title",
      });

      // 4. Keyword in description
      const keywordInDesc = metaDescription
        .toLowerCase()
        .includes(keywordLower);
      results.push({
        label: "Keyword in description",
        status: keywordInDesc ? "pass" : "fail",
        message: keywordInDesc
          ? "Focus keyword found in description"
          : "Focus keyword not found in description",
      });

      // 5. Keyword in slug
      const keywordSlug = keywordLower.replace(/\s+/g, "-");
      const keywordInSlug = slug.toLowerCase().includes(keywordSlug);
      results.push({
        label: "Keyword in slug",
        status: keywordInSlug ? "pass" : "fail",
        message: keywordInSlug
          ? "Focus keyword found in slug"
          : "Focus keyword not found in slug",
      });

      // 6. Keyword in first paragraph
      const firstParagraph = content.split(/\n\n|\r\n\r\n/)[0] || "";
      const keywordInFirst = firstParagraph
        .toLowerCase()
        .includes(keywordLower);
      results.push({
        label: "Keyword in first paragraph",
        status: keywordInFirst ? "pass" : "warn",
        message: keywordInFirst
          ? "Focus keyword found in first paragraph"
          : "Focus keyword not found in first paragraph",
      });
    } else {
      results.push({
        label: "Focus keyword",
        status: "warn",
        message: "No focus keyword set",
      });
    }

    // 7. Content length
    let contentStatus: CheckStatus = "fail";
    if (wordCount >= 600) contentStatus = "pass";
    else if (wordCount >= 300) contentStatus = "warn";
    results.push({
      label: "Content length",
      status: contentStatus,
      message: `${wordCount} words`,
    });

    // 8. Cover image
    results.push({
      label: "Cover image",
      status: coverImage ? "pass" : "warn",
      message: coverImage ? "Cover image is set" : "No cover image set",
    });

    // 9. Internal links
    const hasInternalLinks =
      content.includes("/services") ||
      content.includes("/locations") ||
      content.includes("/blogs");
    results.push({
      label: "Internal links",
      status: hasInternalLinks ? "pass" : "warn",
      message: hasInternalLinks
        ? "Internal links found in content"
        : "No internal links found",
    });

    return results;
  }, [title, metaTitle, metaDescription, focusKeyword, slug, content, coverImage]);

  const passedCount = checks.filter((c) => c.status === "pass").length;
  const totalCount = checks.length;
  const passRate = totalCount > 0 ? passedCount / totalCount : 0;

  const scoreColorClass =
    passRate >= 0.7
      ? "text-green-500"
      : passRate >= 0.4
        ? "text-yellow-500"
        : "text-red-500";

  const StatusIcon = ({ status }: { status: CheckStatus }) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />;
      case "warn":
        return <AlertCircle className="h-4 w-4 text-yellow-500 shrink-0" />;
      case "fail":
        return <XCircle className="h-4 w-4 text-red-500 shrink-0" />;
    }
  };

  return (
    <Collapsible defaultOpen>
      <Card>
        <CardHeader>
          <CollapsibleTrigger className="w-full">
            <CardTitle className="flex items-center justify-between text-base">
              <span>SEO Score</span>
              <span className={scoreColorClass}>
                {passedCount}/{totalCount} passed
              </span>
            </CardTitle>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent>
            <div className="space-y-2">
              {checks.map((check) => (
                <div key={check.label} className="flex items-center gap-2">
                  <StatusIcon status={check.status} />
                  <span className="font-medium text-sm">{check.label}:</span>
                  <span className="text-sm text-muted-foreground">
                    {check.message}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
