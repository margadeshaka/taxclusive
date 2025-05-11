
import Link from "next/link"
import { Facebook, Twitter, Linkedin, Instagram, Youtube } from "lucide-react"

export default function SocialLinks({ className }: { className?: string }) {
  return (
   <div className={`flex gap-4 ${className}`}>

      <Link
        href="https://facebook.com"
        className="text-muted-foreground hover:text-primary transition-colors"
        aria-label="Facebook"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Facebook className="h-5 w-5" />
      </Link>
      <Link
        href="https://twitter.com"
        className="text-muted-foreground hover:text-primary transition-colors"
        aria-label="Twitter"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Twitter className="h-5 w-5" />
      </Link>
      <Link
        href="https://linkedin.com"
        className="text-muted-foreground hover:text-primary transition-colors"
        aria-label="LinkedIn"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Linkedin className="h-5 w-5" />
      </Link>
      <Link
        href="https://instagram.com"
        className="text-muted-foreground hover:text-primary transition-colors"
        aria-label="Instagram"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Instagram className="h-5 w-5" />
      </Link>
      <Link
        href="https://youtube.com"
        className="text-muted-foreground hover:text-primary transition-colors"
        aria-label="YouTube"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Youtube className="h-5 w-5" />
      </Link>


    </div>
  )
}

