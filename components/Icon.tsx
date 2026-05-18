import type { LucideProps } from "lucide-react";
import {
  ArrowRight,
  ArrowUp,
  Award,
  BarChart3,
  BookOpen,
  Compass,
  Cpu,
  Download,
  ExternalLink,
  FileText,
  FolderKanban,
  Mail,
  MessageCircle,
  Monitor,
  PenSquare,
  Rss,
  Shield,
  Star,
  Terminal,
} from "lucide-react";

function GithubGlyph(props: LucideProps) {
  const { size = 24, ...rest } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      <path d="M9 19c-5 1.5-5-2.5-7-3" />
      <path d="M22 16.92v-3a6 6 0 0 0-1.76-4.24A6 6 0 0 0 20.91 6c-.09-.65-.3-1.28-.62-1.85-.32-.57-.74-1.07-1.24-1.5-1.8 0-3 .7-3.6 1.1a12.32 12.32 0 0 0-6.9 0C7.95 3.35 6.75 2.65 4.95 2.65c-.5.43-.92.93-1.24 1.5-.32.57-.53 1.2-.62 1.85a6 6 0 0 0 .67 3.68A6 6 0 0 0 2 13.92v3a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4Z" />
      <path d="M9 22v-4.87a3.37 3.37 0 0 1 .94-2.61" />
      <path d="M15 22v-4.87a3.37 3.37 0 0 0-.94-2.61" />
    </svg>
  );
}

const ICON_MAP = {
  "arrow-right": ArrowRight,
  "arrow-up": ArrowUp,
  award: Award,
  "bar-chart-3": BarChart3,
  "book-open": BookOpen,
  compass: Compass,
  cpu: Cpu,
  download: Download,
  "external-link": ExternalLink,
  "file-text": FileText,
  "folder-kanban": FolderKanban,
  github: GithubGlyph,
  mail: Mail,
  "message-circle": MessageCircle,
  monitor: Monitor,
  "pen-square": PenSquare,
  rss: Rss,
  shield: Shield,
  star: Star,
  terminal: Terminal,
} as const;

export type IconName = keyof typeof ICON_MAP;

type IconProps = Omit<LucideProps, "ref"> & {
  name: IconName | string;
};

export default function Icon({ name, ...props }: IconProps) {
  const Component = ICON_MAP[name as IconName];
  if (!Component) return null;
  return <Component {...props} />;
}
