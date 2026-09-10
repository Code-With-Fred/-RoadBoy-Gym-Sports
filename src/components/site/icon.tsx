import {
  Apple,
  ClipboardCheck,
  Dumbbell,
  GraduationCap,
  HeartPulse,
  MonitorSmartphone,
  TrendingUp,
  UserRound,
  Users,
  type LucideIcon,
} from 'lucide-react'

/**
 * Explicit icon map rather than a dynamic import, so only the icons we actually
 * use end up in the bundle and a bad name from the CMS fails visibly here
 * instead of at runtime.
 */
const ICONS: Record<string, LucideIcon> = {
  Apple,
  ClipboardCheck,
  Dumbbell,
  GraduationCap,
  HeartPulse,
  MonitorSmartphone,
  TrendingUp,
  UserRound,
  Users,
}

export function Icon({ name, className }: { name: string; className?: string }) {
  const Component = ICONS[name] ?? Dumbbell
  return <Component className={className} aria-hidden />
}
